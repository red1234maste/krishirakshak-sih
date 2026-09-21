const db = require('../config/db');

/**
 * KrishiRakshak Early-Warning Risk Engine
 * Computes Disease & Pest Risk Index (0-100%)
 * Score Classification:
 *   < 40%  -> LOW (Green)
 *   40-70% -> MEDIUM (Amber)
 *   > 70%  -> HIGH (Red 🚨)
 */

const calculatePestRisk = ({
  temperature = 27,
  humidity = 85,
  rainfall = 15,
  leafWetnessHours = 7,
  satelliteNdvi = 0.55,
  crop = 'Cotton',
  cropStage = 'Flowering & Boll Formation',
  verifiedReportsInRadius = 2
}) => {
  // 1. Weather Factor (Weight: 35%)
  // High humidity (>80%) + leaf wetness (>6hrs) + moderate temp (22-30°C) are prime for pests and fungal pathogens
  let weatherScore = 0;
  if (humidity >= 85) weatherScore += 40;
  else if (humidity >= 70) weatherScore += 25;
  else weatherScore += 10;

  if (leafWetnessHours >= 7) weatherScore += 35;
  else if (leafWetnessHours >= 4) weatherScore += 20;
  else weatherScore += 5;

  if (temperature >= 22 && temperature <= 32) weatherScore += 25;
  else weatherScore += 10;

  const weatherComponent = Math.min(100, weatherScore) * 0.35;

  // 2. Spatial Disease Cluster Factor (Weight: 30%)
  // Verified reports in the village / nearby farms
  let clusterScore = 0;
  if (verifiedReportsInRadius >= 3) clusterScore = 95;
  else if (verifiedReportsInRadius === 2) clusterScore = 75;
  else if (verifiedReportsInRadius === 1) clusterScore = 50;
  else clusterScore = 15;

  const clusterComponent = clusterScore * 0.30;

  // 3. Satellite NDVI Vegetation Stress Factor (Weight: 20%)
  // Healthy crop NDVI is typically 0.70 - 0.85. Stressed/infested vegetation drops below 0.60
  let ndviScore = 0;
  if (satelliteNdvi < 0.55) ndviScore = 90;
  else if (satelliteNdvi < 0.65) ndviScore = 70;
  else if (satelliteNdvi < 0.75) ndviScore = 40;
  else ndviScore = 15;

  const ndviComponent = ndviScore * 0.20;

  // 4. Crop Stage Vulnerability Factor (Weight: 15%)
  let stageScore = 50;
  const stageLower = (cropStage || '').toLowerCase();
  if (stageLower.includes('boll') || stageLower.includes('flowering') || stageLower.includes('pod') || stageLower.includes('fruit')) {
    stageScore = 85; // highly vulnerable reproductive stage
  } else if (stageLower.includes('seedling') || stageLower.includes('vegetative')) {
    stageScore = 60;
  }
  const stageComponent = stageScore * 0.15;

  const rawRiskScore = Math.round(weatherComponent + clusterComponent + ndviComponent + stageComponent);
  const finalRiskScore = Math.max(5, Math.min(99, rawRiskScore));

  let riskLevel = 'LOW';
  if (finalRiskScore > 70) {
    riskLevel = 'HIGH';
  } else if (finalRiskScore >= 40) {
    riskLevel = 'MEDIUM';
  }

  return {
    riskScore: finalRiskScore,
    riskLevel,
    breakdown: {
      weatherContribution: Math.round(weatherComponent),
      clusterContribution: Math.round(clusterComponent),
      satelliteNdviContribution: Math.round(ndviComponent),
      cropStageContribution: Math.round(stageComponent)
    },
    riskFactors: [
      humidity > 80 ? `Critical Relative Humidity: ${humidity}% (spore germination zone)` : null,
      leafWetnessHours > 6 ? `Extended Leaf Wetness: ${leafWetnessHours} hrs` : null,
      satelliteNdvi < 0.65 ? `Satellite Canopy Stress Anomaly (NDVI: ${satelliteNdvi})` : null,
      verifiedReportsInRadius > 0 ? `${verifiedReportsInRadius} verified field outbreak(s) detected in sector` : null
    ].filter(Boolean)
  };
};

const axios = require('axios');

const fetchLiveWeatherForVillage = async (lat = 20.0, lon = 73.8) => {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m&timezone=auto`;
    const res = await axios.get(url, { timeout: 3500 });
    if (res.data && res.data.current) {
      const c = res.data.current;
      const humidity = c.relative_humidity_2m || 75;
      const temp = c.temperature_2m || 26;
      const rain = c.precipitation || 0;
      const leafWetness = Math.min(12, Math.max(2, Math.round((humidity / 100) * 10)));

      return {
        temperatureCelsius: temp,
        humidityPercentage: humidity,
        rainfallMm: rain,
        windSpeedKmh: c.wind_speed_10m || 12,
        leafWetnessHours: leafWetness,
        satelliteNdviScore: 0.62,
        weatherCondition: c.weather_code <= 2 ? 'Clear / Partly Cloudy' : 'Humid / Overcast',
        source: 'OPEN_METEO_LIVE_API',
        isLive: true,
        lastSynced: new Date().toISOString()
      };
    }
  } catch (err) {
    console.log('[RiskEngine] Using local telemetry cache:', err.message);
  }
  return null;
};

const evaluateVillageRisk = async (villageId) => {
  const village = db.findById('villages', villageId);
  if (!village) return null;

  // Attempt to fetch real live weather from Open-Meteo API for village coordinates
  const lat = village.latitude || 20.17;
  const lon = village.longitude || 73.98;
  const liveWeather = await fetchLiveWeatherForVillage(lat, lon);

  let weather = liveWeather;
  if (!weather) {
    weather = db.findOne('weather_data', { villageId }) || {
      temperatureCelsius: 26.5,
      humidityPercentage: 82,
      rainfallMm: 0,
      windSpeedKmh: 14,
      leafWetnessHours: 7,
      satelliteNdviScore: 0.60,
      isLive: false,
      lastSynced: new Date().toISOString()
    };
  } else {
    // Cache live weather in DB
    const existing = db.findOne('weather_data', { villageId });
    if (existing) {
      db.update('weather_data', existing.id, weather);
    } else {
      db.create('weather_data', { villageId, ...weather });
    }
  }

  const reports = db.find('disease_reports', { villageId, officerVerificationStatus: 'VERIFIED' });

  const evaluation = calculatePestRisk({
    temperature: weather.temperatureCelsius,
    humidity: weather.humidityPercentage,
    rainfall: weather.rainfallMm,
    leafWetnessHours: weather.leafWetnessHours,
    satelliteNdvi: weather.satelliteNdviScore,
    crop: village.primaryCrops[0] || 'Cotton',
    cropStage: 'Flowering & Boll Formation',
    verifiedReportsInRadius: reports.length
  });

  // Update village current risk
  db.update('villages', villageId, {
    riskLevel: evaluation.riskLevel,
    riskScore: evaluation.riskScore
  });

  return {
    village,
    weather,
    verifiedOutbreaks: reports.length,
    ...evaluation
  };
};

module.exports = {
  calculatePestRisk,
  evaluateVillageRisk,
  fetchLiveWeatherForVillage
};
