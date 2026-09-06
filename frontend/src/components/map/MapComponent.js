import { useEffect, useMemo, useState } from 'react';
import { CircleMarker, MapContainer, Marker, Popup, TileLayer, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { Link } from 'react-router-dom';
import { MapPin, Plus, X } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import { mapPointsData } from '../../data/mockData';
import { useAuthStore } from '../../stores';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';

const API_URL = process.env.REACT_APP_BACKEND_URL || '';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const typeColors = {
  shop: '#27ae60',
  organization: '#8e44ad',
  medicine: '#e74c3c',
  education: '#3498db',
  trade: '#16a085',
  transport: '#9b59b6',
  admin: '#e67e22',
  service: '#d35400',
  other: '#95a5a6',
};

const typeLabels = {
  shop: 'Магазини',
  organization: 'Організації',
  medicine: 'Медицина',
  education: 'Освіта',
  trade: 'Торгівля',
  transport: 'Транспорт',
  admin: 'Адміністрація',
  service: 'Послуги',
  other: 'Інше',
};

const communities = {
  tomakivska: {
    name: 'Томаківська громада',
    center: [47.813333, 34.749167],
    zoom: 13,
  },
  myrivska: {
    name: 'Мирівська громада',
    center: [47.77079, 34.73345],
    zoom: 13,
  },
};

const createCustomIcon = (type) => {
  const color = typeColors[type] || typeColors.other;
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  });
};

const createCommunityIcon = (color) => L.divIcon({
  className: 'community-marker',
  html: `<div style="background-color: ${color}; color: white; width: 32px; height: 32px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.35); display: flex; align-items: center; justify-content: center; font-weight: 700;">●</div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16],
});

function MapClickHandler({ enabled, onPick }) {
  useMapEvents({
    click: (event) => {
      if (enabled) onPick([event.latlng.lat, event.latlng.lng]);
    },
  });
  return null;
}

function ObjectForm({ object, setObject, onSubmit, onCancel, isSaving, error, hasLocation }) {
  return (
    <div className="mb-4 rounded-xl border border-[#b9dcc5] bg-[#f6fcf8] p-4 shadow-sm">
      <div className="mb-3 flex items-start justify-between gap-4">
        <div>
          <h3 className="font-semibold text-[#1e3a5f]">Новий об’єкт на мапі</h3>
      <p className="text-sm text-gray-600">{hasLocation ? 'Точку вже вибрано. Заповніть інформацію про магазин або організацію.' : 'Клікніть на мапі в місці розташування об’єкта.'}</p>
        </div>
        <button type="button" onClick={onCancel} className="text-gray-500 hover:text-gray-800" aria-label="Закрити">
          <X className="h-5 w-5" />
        </button>
      </div>
      <form onSubmit={onSubmit} className="grid gap-3 md:grid-cols-2">
        <div className="space-y-1">
          <Label htmlFor="map-object-name">Назва *</Label>
          <Input id="map-object-name" value={object.name} maxLength={120} required placeholder="Наприклад: Магазин 'Добробут'" onChange={(event) => setObject({ ...object, name: event.target.value })} />
        </div>
        <div className="space-y-1">
          <Label htmlFor="map-object-type">Тип об’єкта *</Label>
          <select id="map-object-type" value={object.type} onChange={(event) => setObject({ ...object, type: event.target.value })} className="flex h-9 w-full rounded-md border border-input bg-white px-3 py-1 text-sm">
            <option value="shop">Магазин</option>
            <option value="organization">Організація</option>
            <option value="service">Послуга</option>
            <option value="medicine">Медицина</option>
            <option value="education">Освіта</option>
            <option value="other">Інше</option>
          </select>
        </div>
        <div className="space-y-1">
          <Label htmlFor="map-object-community">Громада *</Label>
          <select id="map-object-community" value={object.community} onChange={(event) => setObject({ ...object, community: event.target.value })} className="flex h-9 w-full rounded-md border border-input bg-white px-3 py-1 text-sm">
            <option value="tomakivska">Томаківська громада</option>
            <option value="myrivska">Мирівська громада</option>
          </select>
        </div>
        <div className="space-y-1">
          <Label htmlFor="map-object-address">Адреса</Label>
          <Input id="map-object-address" value={object.address} maxLength={180} placeholder="Вулиця, номер будинку" onChange={(event) => setObject({ ...object, address: event.target.value })} />
        </div>
        <div className="space-y-1">
          <Label htmlFor="map-object-phone">Телефон</Label>
          <Input id="map-object-phone" type="tel" value={object.phone} maxLength={30} placeholder="+380..." onChange={(event) => setObject({ ...object, phone: event.target.value })} />
        </div>
        <div className="space-y-1 md:col-span-2">
          <Label htmlFor="map-object-description">Опис</Label>
          <Textarea id="map-object-description" value={object.description} maxLength={1000} placeholder="Графік роботи або додаткова інформація" onChange={(event) => setObject({ ...object, description: event.target.value })} />
        </div>
        <p className={`text-xs md:col-span-2 ${hasLocation ? 'text-gray-500' : 'font-medium text-[#e67e22]'}`}>
          {hasLocation ? `Координати: ${object.latitude.toFixed(6)}, ${object.longitude.toFixed(6)}` : 'Місце на мапі ще не вибрано'}
        </p>
        {error && <p className="text-sm text-red-600 md:col-span-2">{error}</p>}
        <div className="flex gap-2 md:col-span-2">
          <Button type="submit" className="bg-[#27ae60] hover:bg-[#219653]" disabled={isSaving || !hasLocation}>{isSaving ? 'Збереження...' : 'Додати об’єкт'}</Button>
          <Button type="button" variant="outline" onClick={onCancel}>Скасувати</Button>
        </div>
      </form>
    </div>
  );
}

export function MapComponent({ height = '400px', rada = null }) {
  const legacyCommunity = rada === 'rada1' ? 'tomakivska' : rada === 'rada2' ? 'myrivska' : 'all';
  const [activeCommunity, setActiveCommunity] = useState(legacyCommunity);
  const [activeType, setActiveType] = useState(null);
  const [serverObjects, setServerObjects] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [pickedCoordinates, setPickedCoordinates] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const { isAuthenticated, token, user } = useAuthStore();
  const [newObject, setNewObject] = useState({
    name: '', type: 'shop', community: legacyCommunity === 'all' ? 'tomakivska' : legacyCommunity,
    latitude: communities.tomakivska.center[0], longitude: communities.tomakivska.center[1], address: '', phone: '', description: '',
  });

  useEffect(() => {
    const params = activeCommunity !== 'all' ? `?community=${activeCommunity}` : '';
    fetch(`${API_URL}/api/map/objects${params}`)
      .then((response) => (response.ok ? response.json() : []))
      .then((data) => setServerObjects(Array.isArray(data) ? data : []))
      .catch(() => setServerObjects([]));
  }, [activeCommunity]);

  const allPoints = useMemo(() => [
    ...mapPointsData,
    ...serverObjects.map((object) => ({ ...object, coordinates: [object.latitude, object.longitude] })),
  ], [serverObjects]);

  const filteredPoints = allPoints.filter((point) => {
    if (activeCommunity !== 'all' && point.community !== activeCommunity) return false;
    if (activeType && point.type !== activeType) return false;
    return true;
  });

  const center = activeCommunity === 'all' ? [47.792, 34.741] : communities[activeCommunity].center;
  const zoom = activeCommunity === 'all' ? 12 : communities[activeCommunity].zoom;

  const startAdding = () => {
    setFormError('');
    setPickedCoordinates(null);
    setIsAdding(true);
  };

  const handleMapPick = ([latitude, longitude]) => {
    setPickedCoordinates([latitude, longitude]);
    setNewObject((current) => ({ ...current, latitude, longitude, community: activeCommunity === 'all' ? current.community : activeCommunity }));
    setFormError('');
  };

  const cancelAdding = () => {
    setIsAdding(false);
    setPickedCoordinates(null);
    setFormError('');
  };

  const saveObject = async (event) => {
    event.preventDefault();
    if (!pickedCoordinates) {
      setFormError('Спочатку клікніть на мапі, щоб вибрати місце об’єкта.');
      return;
    }
    setIsSaving(true);
    setFormError('');
    try {
      const response = await fetch(`${API_URL}/api/map/objects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        credentials: 'include',
        body: JSON.stringify(newObject),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.detail || 'Не вдалося додати об’єкт.');
      if (activeCommunity === 'all' || data.community === activeCommunity) setServerObjects((current) => [data, ...current]);
      setNewObject({ ...newObject, name: '', address: '', phone: '', description: '' });
      setIsAdding(false);
      setPickedCoordinates(null);
    } catch (error) {
      setFormError(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const deleteObject = async (objectId) => {
    if (!window.confirm('Видалити цей об’єкт з мапи?')) return;
    const response = await fetch(`${API_URL}/api/map/objects/${objectId}`, {
      method: 'DELETE',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      credentials: 'include',
    });
    if (response.ok) setServerObjects((current) => current.filter((object) => object.id !== objectId));
  };

  return (
    <div data-testid="map-component">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="mr-1 text-sm font-medium text-[#1e3a5f]">Громада:</span>
        <button type="button" onClick={() => setActiveCommunity('all')} className={`rounded-full px-3 py-1 text-sm ${activeCommunity === 'all' ? 'bg-[#1e3a5f] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>Обидві</button>
        {Object.entries(communities).map(([key, community]) => (
          <button type="button" key={key} onClick={() => setActiveCommunity(key)} className={`rounded-full px-3 py-1 text-sm ${activeCommunity === key ? 'bg-[#1e3a5f] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>{community.name}</button>
        ))}
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <button type="button" onClick={() => setActiveType(null)} className={`flex items-center gap-2 rounded-full px-3 py-1 text-sm ${activeType === null ? 'bg-[#1e3a5f] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>Всі об’єкти</button>
        {Object.entries(typeLabels).map(([key, label]) => (
          <button type="button" key={key} onClick={() => setActiveType(activeType === key ? null : key)} className={`flex items-center gap-2 rounded-full px-3 py-1 text-sm ${activeType === key ? 'bg-[#1e3a5f] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: typeColors[key] }} />{label}
          </button>
        ))}
      </div>

      {isAuthenticated ? (
        <div className="mb-4 flex items-center gap-3 rounded-lg bg-white p-3 shadow-sm">
          <Button type="button" onClick={startAdding} className="bg-[#e67e22] hover:bg-[#d35400]" disabled={isAdding}><Plus className="mr-2 h-4 w-4" /> Додати об’єкт на мапу</Button>
          {isAdding && <span className="text-sm text-gray-600">Клікніть на потрібне місце на мапі.</span>}
        </div>
      ) : (
        <p className="mb-4 rounded-lg bg-white p-3 text-sm text-gray-600 shadow-sm"><Link to="/login" className="font-medium text-[#e67e22] hover:underline">Увійдіть</Link>, щоб додати магазин або організацію на мапу.</p>
      )}

      {isAdding && <ObjectForm object={newObject} setObject={setNewObject} onSubmit={saveObject} onCancel={cancelAdding} isSaving={isSaving} error={formError} hasLocation={Boolean(pickedCoordinates)} />}

      <div style={{ height }} className="overflow-hidden rounded-xl shadow-lg">
        <MapContainer key={activeCommunity} center={center} zoom={zoom} style={{ height: '100%', width: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' />
          <MapClickHandler enabled={isAdding} onPick={handleMapPick} />
          {isAdding && pickedCoordinates && (
            <CircleMarker center={pickedCoordinates} radius={10} pathOptions={{ color: '#e67e22', fillColor: '#e67e22', fillOpacity: 0.8, weight: 3 }}>
              <Popup>Обрана точка об’єкта</Popup>
            </CircleMarker>
          )}
          {activeCommunity === 'all' && Object.entries(communities).map(([key, community], index) => (
            <Marker key={key} position={community.center} icon={createCommunityIcon(index === 0 ? '#1e3a5f' : '#27ae60')}>
              <Popup><strong>{community.name}</strong><br />Адміністративний центр громади</Popup>
            </Marker>
          ))}
          {filteredPoints.map((point) => (
            <Marker key={point.id} position={point.coordinates} icon={createCustomIcon(point.type)}>
              <Popup>
                <div className="min-w-[210px]">
                  <h4 className="mb-1 font-bold text-[#1e3a5f]">{point.name}</h4>
                  {point.community && <p className="text-xs text-[#27ae60]">{communities[point.community]?.name}</p>}
                  {point.address && <p className="mb-1 text-sm text-gray-600">{point.address}</p>}
                  {point.phone && <p className="text-sm"><a href={`tel:${point.phone}`} className="text-[#e67e22]">{point.phone}</a></p>}
                  {point.description && <p className="mt-1 text-xs text-gray-500">{point.description}</p>}
                  {point.user_id && user?.user_id === point.user_id && <button type="button" onClick={() => deleteObject(point.id)} className="mt-2 text-xs text-red-600 hover:underline">Видалити об’єкт</button>}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <div className="mt-4 flex flex-wrap justify-center gap-4 text-sm text-gray-600">
        {Object.entries(typeLabels).map(([key, label]) => <div key={key} className="flex items-center gap-2"><span className="h-3 w-3 rounded-full" style={{ backgroundColor: typeColors[key] }} />{label}</div>)}
      </div>
    </div>
  );
}
