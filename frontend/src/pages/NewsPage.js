import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Filter, Search } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { SectionTitle, NewsCard } from '../components/common';
import { useNewsStore } from '../stores';

const categories = [
  'Всі',
  'Інфраструктура',
  'Медицина',
  'Освіта',
  'Культура',
  'Офіційно',
  'Оголошення'
];

const radaFilters = [
  { value: 'all', label: 'Всі ради' },
  { value: 'rada1', label: 'Рада №1' },
  { value: 'rada2', label: 'Рада №2' }
];

export function NewsPage() {
  const { news, isLoading, fetchNews } = useNewsStore();
  const [selectedCategory, setSelectedCategory] = useState('Всі');
  const [selectedRada, setSelectedRada] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const rada = selectedRada === 'all' ? null : selectedRada;
    const category = selectedCategory === 'Всі' ? null : selectedCategory;
    fetchNews(rada, category);
  }, [selectedRada, selectedCategory]);

  const filteredNews = news.filter(item => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return item.title.toLowerCase().includes(query) || 
             item.excerpt.toLowerCase().includes(query);
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12" data-testid="news-page">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <SectionTitle 
            title="Новини громади" 
            subtitle="Будьте в курсі останніх подій нашої громади"
          />
        </motion.div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Пошук новин..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="news-search-input"
              />
            </div>

            {/* Rada Filter */}
            <div className="flex gap-2">
              {radaFilters.map((filter) => (
                <Button
                  key={filter.value}
                  variant={selectedRada === filter.value ? 'default' : 'outline'}
                  className={selectedRada === filter.value ? 'bg-[#1e3a5f]' : ''}
                  onClick={() => setSelectedRada(filter.value)}
                  data-testid={`filter-rada-${filter.value}`}
                >
                  {filter.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Category filters */}
          <div className="flex flex-wrap gap-2 mt-4">
            <Filter className="w-5 h-5 text-gray-400 mr-2" />
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  selectedCategory === category
                    ? 'bg-[#e67e22] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                data-testid={`filter-category-${category}`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* News Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-xl h-80 animate-pulse" />
            ))}
          </div>
        ) : filteredNews.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNews.map((item, index) => (
              <NewsCard key={item.id} news={item} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Новин не знайдено</p>
          </div>
        )}
      </div>
    </div>
  );
}
