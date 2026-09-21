import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, Marker, Popup, CircleMarker } from 'react-leaflet';
import L from 'leaflet';
import { useTranslation } from 'react-i18next';
import { ShieldAlert, CloudRain, Thermometer, Droplets, Satellite, Users, RefreshCw } from 'lucide-react';
import api from '../services/api';
import { useHelpline } from '../context/HelplineContext';

// Fix default Leaflet icon paths
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
});

const GISMap = ({ selectedVillageId, onSelectVillage, height = '500px' }) => {
  const { t, i18n } = useTranslation();
  const { helpline } = useHelpline();
  const [geoData, setGeoData] = useState(null);
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGisData();
  }, []);

  const fetchGisData = async () => {
    setLoading(true);
    try {
      const [geoRes, farmRes] = await Promise.all([
        api.get('/gis/villages-geojson'),
        api.get('/gis/farms')
      ]);
      setGeoData(geoRes.data);
      setFarms(farmRes.data?.farms || []);
    } catch (e) {
      console.error('Failed to load GIS data', e);
    } finally {
      setLoading(false);
    }
  };

  const getStyle = (feature) => {
    const risk = feature.properties.riskLevel;
    let color = '#10B981'; // Green
    let fillOpacity = 0.35;

    if (risk === 'HIGH') {
      color = '#EF4444'; // Red
      fillOpacity = 0.55;
    } else if (risk === 'MEDIUM') {
      color = '#F59E0B'; // Amber
      fillOpacity = 0.45;
    }

    const isSelected = selectedVillageId === feature.properties.id;

    return {
      fillColor: color,
      weight: isSelected ? 4 : 2,
      opacity: 1,
      color: isSelected ? '#1E293B' : color,
      dashArray: isSelected ? '4' : null,
      fillOpacity
    };
  };

  const onEachFeature = (feature, layer) => {
    const props = feature.properties;
    const name = i18n.language === 'mr' ? (props.nameMr || props.name) : i18n.language === 'hi' ? (props.nameHi || props.name) : props.name;

    layer.on({
      click: () => {
        if (onSelectVillage) {
          onSelectVillage(props);
        }
      }
    });

    layer.bindTooltip(
      `<strong>${name}</strong><br/>Risk: ${props.riskScore}% (${props.riskLevel})`,
      { permanent: false, direction: 'center', className: 'text-xs font-semibold font-sans' }
    );
  };

  return (
    <div className="relative rounded-2xl overflow-hidden border border-slate-300 shadow-md bg-slate-100">
      {/* Map Header / Legend Overlay */}
      <div className="absolute top-3 left-3 z-[1000] bg-white/95 backdrop-blur-md p-3 rounded-xl shadow-lg border border-slate-200 text-xs max-w-xs">
        <div className="font-bold text-slate-800 flex items-center justify-between mb-1.5">
          <span>{t('gis.title')}</span>
          <button
            onClick={fetchGisData}
            className="text-slate-500 hover:text-emerald-700 p-0.5 rounded"
            title="Refresh GIS layer"
          >
            <RefreshCw className="w-3 h-3" />
          </button>
        </div>
        <div className="flex items-center space-x-2 text-[11px] mb-2">
          <span className="flex items-center gap-1 font-semibold">
            <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span> Low (&lt;40%)
          </span>
          <span className="flex items-center gap-1 font-semibold">
            <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span> Med (40-70%)
          </span>
          <span className="flex items-center gap-1 font-semibold">
            <span className="w-3 h-3 rounded-full bg-rose-500 inline-block animate-pulse"></span> High (&gt;70% 🚨)
          </span>
        </div>
        <p className="text-[10px] text-slate-500">
          Click any village polygon to inspect satellite NDVI stress, humidity index & outbreak clusters.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-[500px] text-slate-500 text-sm font-semibold">
          Loading GIS Outbreak Map...
        </div>
      ) : (
        <MapContainer
          center={[19.92, 74.25]}
          zoom={10}
          style={{ height, width: '100%' }}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {geoData && <GeoJSON data={geoData} style={getStyle} onEachFeature={onEachFeature} />}

          {/* Farm Markers */}
          {farms.map((farm) => {
            const isHigh = farm.currentRiskLevel === 'HIGH';
            return (
              <CircleMarker
                key={farm.id}
                center={[farm.latitude, farm.longitude]}
                radius={isHigh ? 9 : 6}
                pathOptions={{
                  fillColor: isHigh ? '#EF4444' : '#10B981',
                  color: '#FFFFFF',
                  weight: 2,
                  fillOpacity: 0.9
                }}
              >
                <Popup>
                  <div className="text-xs p-1 space-y-1">
                    <p className="font-bold text-slate-900">{farm.surveyNumber} — {farm.crop}</p>
                    <p className="text-slate-600">Farmer: {farm.farmerName}</p>
                    <p className="text-slate-600">Stage: {farm.cropStage}</p>
                    <div className="pt-1 flex items-center justify-between border-t border-slate-100">
                      <span className={`font-bold text-[10px] px-1.5 py-0.5 rounded ${isHigh ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'}`}>
                        Risk: {farm.currentRiskScore}% ({farm.currentRiskLevel})
                      </span>
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>
      )}
    </div>
  );
};

export default GISMap;
