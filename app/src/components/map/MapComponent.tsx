import { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Stethoscope, 
  GraduationCap, 
  ShoppingCart, 
  Bus, 
  Building2,
  Filter
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mapPointsData } from '@/data/mockData';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default markers
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const typeFilters = [
  { key: 'all', label: 'Всі', icon: MapPin, color: 'bg-gray-500' },
  { key: 'medicine', label: 'Медицина', icon: Stethoscope, color: 'bg-red-500' },
  { key: 'education', label: 'Освіта', icon: GraduationCap, color: 'bg-blue-500' },
  { key: 'trade', label: 'Торгівля', icon: ShoppingCart, color: 'bg-green-500' },
  { key: 'transport', label: 'Транспорт', icon: Bus, color: 'bg-purple-500' },
  { key: 'admin', label: 'Адміністрація', icon: Building2, color: 'bg-orange-500' },
];

const getCustomIcon = (type: string) => {
  const colors: Record<string, string> = {
    medicine: '#ef4444',
    education: '#3b82f6',
    trade: '#22c55e',
    transport: '#a855f7',
    admin: '#f97316',
    other: '#6b7280'
  };
  
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      width: 32px;
      height: 32px;
      background-color: ${colors[type] || colors.other};
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
    </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32]
  });
};

interface MapComponentProps {
  height?: string;
  showFilters?: boolean;
  radaFilter?: 'all' | 'rada1' | 'rada2';
}

export function MapComponent({ height = '500px', showFilters = true, radaFilter = 'all' }: MapComponentProps) {
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const filteredPoints = useMemo(() => {
    return mapPointsData.filter(point => {
      const typeMatch = activeFilter === 'all' || point.type === activeFilter;
      const radaMatch = radaFilter === 'all' || point.rada === radaFilter;
      return typeMatch && radaMatch;
    });
  }, [activeFilter, radaFilter]);

  const center: [number, number] = [48.928, 24.718];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="relative"
    >
      <Card className="overflow-hidden">
        {showFilters && (
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <Filter className="w-4 h-4 text-[#1e3a5f]" />
              <span className="text-sm font-medium text-[#1e3a5f]">Фільтри:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {typeFilters.map((filter) => (
                <Button
                  key={filter.key}
                  size="sm"
                  variant={activeFilter === filter.key ? 'default' : 'outline'}
                  onClick={() => setActiveFilter(filter.key)}
                  className={`text-xs ${
                    activeFilter === filter.key 
                      ? 'bg-[#1e3a5f]' 
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <filter.icon className="w-3 h-3 mr-1" />
                  {filter.label}
                </Button>
              ))}
            </div>
          </div>
        )}
        
        <div style={{ height }} className="relative">
          <MapContainer 
            center={center} 
            zoom={14} 
            scrollWheelZoom={false}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {filteredPoints.map((point) => (
              <Marker 
                key={point.id}
                position={point.coordinates}
                icon={getCustomIcon(point.type)}
              >
                <Popup>
                  <div className="p-2 min-w-[200px]">
                    <h4 className="font-bold text-[#1e3a5f] mb-1">{point.name}</h4>
                    <p className="text-sm text-gray-600 mb-2">{point.address}</p>
                    {point.phone && (
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <span className="font-medium">Тел:</span> {point.phone}
                      </p>
                    )}
                    {point.description && (
                      <p className="text-sm text-gray-500 mt-2">{point.description}</p>
                    )}
                    <Badge 
                      className={`mt-2 ${point.rada === 'rada1' ? 'bg-[#e67e22]' : 'bg-[#27ae60]'}`}
                    >
                      {point.rada === 'rada1' ? 'Рада №1' : 'Рада №2'}
                    </Badge>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {/* Stats overlay */}
          <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 z-[1000]">
            <p className="text-sm text-gray-600">
              Показано об'єктів: <span className="font-bold text-[#1e3a5f]">{filteredPoints.length}</span>
            </p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
