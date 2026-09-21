const db = require('../config/db');

const getVillagesGeoJson = (req, res) => {
  const villages = db.get('villages');
  const reports = db.get('disease_reports');
  const weatherList = db.get('weather_data');

  const features = villages.map((v) => {
    const villageReports = reports.filter((r) => r.villageId === v.id);
    const weather = weatherList.find((w) => w.villageId === v.id) || {};

    let fillColor = '#10B981'; // LOW = Green
    if (v.riskLevel === 'HIGH') fillColor = '#EF4444'; // Red
    else if (v.riskLevel === 'MEDIUM') fillColor = '#F59E0B'; // Amber

    return {
      type: 'Feature',
      id: v.id,
      geometry: v.geoJsonPolygon,
      properties: {
        id: v.id,
        name: v.name,
        nameHi: v.nameHi,
        nameMr: v.nameMr,
        district: v.district,
        state: v.state,
        latitude: v.latitude,
        longitude: v.longitude,
        riskLevel: v.riskLevel,
        riskScore: v.riskScore,
        weatherAlert: v.weatherAlert,
        primaryCrops: v.primaryCrops,
        farmerCount: v.farmerCount,
        totalFarms: v.totalFarms,
        activeReportsCount: villageReports.length,
        verifiedOutbreaks: villageReports.filter((r) => r.officerVerificationStatus === 'VERIFIED').length,
        temperature: weather.temperatureCelsius,
        humidity: weather.humidityPercentage,
        leafWetnessHours: weather.leafWetnessHours,
        satelliteNdvi: weather.satelliteNdviScore,
        fillColor
      }
    };
  });

  return res.json({
    type: 'FeatureCollection',
    features
  });
};

const getFarmsCoordinates = (req, res) => {
  const farms = db.get('farms');
  const enriched = farms.map((f) => {
    const farmer = db.findById('farmers', f.farmerId);
    const village = db.findById('villages', f.villageId);
    return {
      ...f,
      farmerName: farmer ? farmer.name : 'Unknown',
      villageName: village ? village.name : 'Unknown'
    };
  });

  return res.json({
    success: true,
    count: enriched.length,
    farms: enriched
  });
};

module.exports = {
  getVillagesGeoJson,
  getFarmsCoordinates
};
