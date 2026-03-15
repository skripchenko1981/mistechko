import { SectionTitle } from '@/components/common/SectionTitle';
import { MapComponent } from '@/components/map/MapComponent';
import { Card, CardContent } from '@/components/ui/card';
import { Stethoscope, GraduationCap, ShoppingCart, Bus, Building2, MapPin } from 'lucide-react';

const mapCategories = [
  { key: 'medicine', label: 'Медицина', icon: Stethoscope, color: 'bg-red-500', count: 2 },
  { key: 'education', label: 'Освіта', icon: GraduationCap, color: 'bg-blue-500', count: 2 },
  { key: 'trade', label: 'Торгівля', icon: ShoppingCart, color: 'bg-green-500', count: 2 },
  { key: 'transport', label: 'Транспорт', icon: Bus, color: 'bg-purple-500', count: 2 },
  { key: 'admin', label: 'Адміністрація', icon: Building2, color: 'bg-orange-500', count: 2 },
];

export function MapPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <SectionTitle 
          title="Інтерактивна мапа" 
          subtitle="Знайдіть важливі об'єкти інфраструктури на мапі громади"
        />

        {/* Categories */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {mapCategories.map((cat) => (
            <Card key={cat.key} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`w-10 h-10 ${cat.color} rounded-lg flex items-center justify-center`}>
                  <cat.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-[#1e3a5f]">{cat.label}</p>
                  <p className="text-xs text-gray-500">{cat.count} об'єктів</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Map */}
        <MapComponent height="600px" />

        {/* Info */}
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-[#1e3a5f] rounded-lg flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-[#1e3a5f] mb-2">Як користуватись мапою</h3>
              <p className="text-gray-600 text-sm">
                Використовуйте фільтри для відображення потрібних об'єктів. 
                Клікніть на маркер для детальної інформації.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-[#e67e22] rounded-lg flex items-center justify-center mb-4">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-[#1e3a5f] mb-2">Додати об'єкт</h3>
              <p className="text-gray-600 text-sm">
                Якщо ви помітили, що якогось важливого об'єкта немає на мапі, 
                повідомте нам через форму зворотного зв'язку.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-[#27ae60] rounded-lg flex items-center justify-center mb-4">
                <Bus className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-[#1e3a5f] mb-2">Маршрути транспорту</h3>
              <p className="text-gray-600 text-sm">
                На мапі позначені зупинки громадського транспорту. 
                Актуальні маршрути дивіться у розділі "Транспорт".
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
