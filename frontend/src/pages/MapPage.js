import { SectionTitle } from '../components/common';
import { MapComponent } from '../components/map';

export function MapPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12" data-testid="map-page">
      <div className="container mx-auto px-4">
        <SectionTitle 
          title="Інтерактивна мапа громади" 
          subtitle="Томаківська та Мирівська громади: магазини, організації й об’єкти інфраструктури"
        />
        <MapComponent height="calc(100vh - 300px)" />
      </div>
    </div>
  );
}
