import { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SectionTitle } from '@/components/common/SectionTitle';
import { AnnouncementCard } from '@/components/common/AnnouncementCard';
import { announcementsData } from '@/data/mockData';

const categories = [
  { key: 'all', label: 'Всі', color: 'bg-gray-500' },
  { key: 'work', label: 'Робота', color: 'bg-blue-500' },
  { key: 'realty', label: 'Нерухомість', color: 'bg-green-500' },
  { key: 'auto', label: 'Авто', color: 'bg-purple-500' },
  { key: 'services', label: 'Послуги', color: 'bg-orange-500' },
  { key: 'lostfound', label: 'Знайшов/загубив', color: 'bg-pink-500' }
];

const radas = [
  { key: 'all', label: 'Всі ради' },
  { key: 'rada1', label: 'Рада №1' },
  { key: 'rada2', label: 'Рада №2' }
];

export function AnnouncementsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedRada, setSelectedRada] = useState<'all' | 'rada1' | 'rada2'>('all');

  const filteredAnnouncements = announcementsData.filter(ann => {
    const matchesSearch = ann.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ann.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || ann.category === selectedCategory;
    const matchesRada = selectedRada === 'all' || ann.rada === selectedRada;
    return matchesSearch && matchesCategory && matchesRada;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <SectionTitle title="Оголошення" subtitle="Оголошення від жителів та організацій громади" />
          <Button className="bg-[#e67e22] hover:bg-[#d35400]">
            <Plus className="w-4 h-4 mr-2" />
            Додати оголошення
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input 
                placeholder="Пошук оголошень..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              {radas.map(rada => (
                <Button
                  key={rada.key}
                  variant={selectedRada === rada.key ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedRada(rada.key as 'all' | 'rada1' | 'rada2')}
                  className={selectedRada === rada.key ? 'bg-[#1e3a5f]' : ''}
                >
                  {rada.label}
                </Button>
              ))}
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-500 mb-2">Категорії:</p>
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <Badge
                  key={cat.key}
                  variant={selectedCategory === cat.key ? 'default' : 'outline'}
                  className={`cursor-pointer ${selectedCategory === cat.key ? cat.color : ''}`}
                  onClick={() => setSelectedCategory(cat.key)}
                >
                  {cat.label}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Results count */}
        <p className="text-gray-500 mb-4">
          Знайдено <span className="font-semibold text-[#1e3a5f]">{filteredAnnouncements.length}</span> оголошень
        </p>

        {/* Announcements Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredAnnouncements.map((announcement, index) => (
            <AnnouncementCard key={announcement.id} announcement={announcement} index={index} />
          ))}
        </div>

        {filteredAnnouncements.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Оголошень не знайдено</h3>
            <p className="text-gray-500">Спробуйте змінити параметри пошуку</p>
          </div>
        )}
      </div>
    </div>
  );
}
