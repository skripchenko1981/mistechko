import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SectionTitle } from '@/components/common/SectionTitle';
import { NewsCard } from '@/components/common/NewsCard';
import { newsData } from '@/data/mockData';

const categories = ['Всі', 'Інфраструктура', 'Медицина', 'Освіта', 'Культура', 'Офіційно', 'Оголошення'];
const radas = [
  { key: 'all', label: 'Всі новини', color: 'bg-[#1e3a5f]' },
  { key: 'rada1', label: 'Рада №1', color: 'bg-[#e67e22]' },
  { key: 'rada2', label: 'Рада №2', color: 'bg-[#27ae60]' }
];

export function NewsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Всі');
  const [selectedRada, setSelectedRada] = useState<'all' | 'rada1' | 'rada2'>('all');

  const filteredNews = newsData.filter(news => {
    const matchesSearch = news.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         news.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Всі' || news.category === selectedCategory;
    const matchesRada = selectedRada === 'all' || news.rada === selectedRada || news.rada === 'all';
    return matchesSearch && matchesCategory && matchesRada;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <SectionTitle 
          title="Новини громади" 
          subtitle="Актуальні події та важливі повідомлення від обох рад"
        />

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input 
                placeholder="Пошук новин..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {radas.map(rada => (
                <Button
                  key={rada.key}
                  variant={selectedRada === rada.key ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedRada(rada.key as 'all' | 'rada1' | 'rada2')}
                  className={selectedRada === rada.key ? rada.color : ''}
                >
                  {rada.label}
                </Button>
              ))}
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-500 mb-2">Категорії:</p>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <Badge
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  className={`cursor-pointer ${selectedCategory === category ? 'bg-[#1e3a5f]' : ''}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Results count */}
        <p className="text-gray-500 mb-4">
          Знайдено <span className="font-semibold text-[#1e3a5f]">{filteredNews.length}</span> новин
        </p>

        {/* News Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNews.map((news, index) => (
            <NewsCard key={news.id} news={news} index={index} />
          ))}
        </div>

        {filteredNews.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Новин не знайдено</h3>
            <p className="text-gray-500">Спробуйте змінити параметри пошуку</p>
          </div>
        )}
      </div>
    </div>
  );
}
