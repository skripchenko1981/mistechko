import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { mapPointsData } from '../../data/mockData';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const typeColors = {
  medicine: '#e74c3c',
  education: '#3498db',
  trade: '#27ae60',
  transport: '#9b59b6',
  admin: '#e67e22',
  other: '#95a5a6'
};

const typeLabels = {
  medicine: 'Медицина',
  education: 'Освіта',
  trade: 'Торгівля',
  transport: 'Транспорт',
  admin: 'Адміністрація',
  other: 'Інше'
};

const createCustomIcon = (type) => {
  const color = typeColors[type] || typeColors.other;
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12]
  });
};

export function MapComponent({ height = '400px', rada = null }) {
  const [activeType, setActiveType] = useState(null);
  
  const filteredPoints = mapPointsData.filter(point => {
    if (rada && point.rada !== rada) return false;
    if (activeType && point.type !== activeType) return false;
    return true;
  });

  const center = rada === 'rada1' 
    ? [48.9235, 24.7120] 
    : rada === 'rada2' 
      ? [48.9355, 24.7260] 
      : [48.9290, 24.7185];

  return (
    <div data-testid="map-component">
      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setActiveType(null)}
          className={`px-3 py-1 rounded-full text-sm transition-colors ${
            activeType === null 
              ? 'bg-[#1e3a5f] text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Всі
        </button>
        {Object.entries(typeLabels).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setActiveType(activeType === key ? null : key)}
            className={`px-3 py-1 rounded-full text-sm transition-colors flex items-center gap-2 ${
              activeType === key 
                ? 'bg-[#1e3a5f] text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: typeColors[key] }}
            />
            {label}
          </button>
        ))}
      </div>

      {/* Map */}
      <div style={{ height }} className="rounded-xl overflow-hidden shadow-lg">
        <MapContainer
          center={center}
          zoom={14}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {filteredPoints.map((point) => (
            <Marker
              key={point.id}
              position={point.coordinates}
              icon={createCustomIcon(point.type)}
            >
              <Popup>
                <div className="min-w-[200px]">
                  <h4 className="font-bold text-[#1e3a5f] mb-1">{point.name}</h4>
                  <p className="text-sm text-gray-600 mb-1">{point.address}</p>
                  {point.phone && (
                    <p className="text-sm">
                      <a href={`tel:${point.phone}`} className="text-[#e67e22]">
                        {point.phone}
                      </a>
                    </p>
                  )}
                  {point.description && (
                    <p className="text-xs text-gray-500 mt-1">{point.description}</p>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-4 justify-center text-sm text-gray-600">
        {Object.entries(typeLabels).map(([key, label]) => (
          <div key={key} className="flex items-center gap-2">
            <span 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: typeColors[key] }}
            />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}
