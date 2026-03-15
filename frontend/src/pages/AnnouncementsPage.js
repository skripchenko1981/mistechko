import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Filter, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { SectionTitle, AnnouncementCard } from '../components/common';
import { useAnnouncementsStore, useAuthStore } from '../stores';
import { announcementCategories } from '../data/mockData';

const radaFilters = [
  { value: 'all', label: 'Всі ради' },
  { value: 'rada1', label: 'Рада №1' },
  { value: 'rada2', label: 'Рада №2' }
];

export function AnnouncementsPage() {
  const { announcements, isLoading, fetchAnnouncements } = useAnnouncementsStore();
  const { isAuthenticated } = useAuthStore();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedRada, setSelectedRada] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const rada = selectedRada === 'all' ? null : selectedRada;
    const category = selectedCategory === 'all' ? null : selectedCategory;
    fetchAnnouncements(rada, category);
  }, [selectedRada, selectedCategory]);

  const filteredAnnouncements = announcements.filter(item => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return item.title.toLowerCase().includes(query) || 
             item.description.toLowerCase().includes(query);
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12" data-testid="announcements-page">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4"
        >
          <SectionTitle 
            title="Оголошення" 
            subtitle="Дошка оголошень нашої громади"
          />
          {isAuthenticated && (
            <Link to="/announcements/new">
              <Button className="bg-[#e67e22] hover:bg-[#d35400]" data-testid="add-announcement-btn">
                <Plus className="w-4 h-4 mr-2" />
                Додати оголошення
              </Button>
            </Link>
          )}
        </motion.div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Пошук оголошень..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="announcements-search-input"
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
                >
                  {filter.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Category filters */}
          <div className="flex flex-wrap gap-2 mt-4">
            <Filter className="w-5 h-5 text-gray-400 mr-2" />
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-[#1e3a5f] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Всі
            </button>
            {Object.entries(announcementCategories).map(([key, { label, color }]) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  selectedCategory === key
                    ? color
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Announcements Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="bg-white rounded-xl h-64 animate-pulse" />
            ))}
          </div>
        ) : filteredAnnouncements.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredAnnouncements.map((item, index) => (
              <AnnouncementCard key={item.id} announcement={item} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Оголошень не знайдено</p>
            {isAuthenticated && (
              <Link to="/announcements/new">
                <Button className="mt-4 bg-[#e67e22] hover:bg-[#d35400]">
                  <Plus className="w-4 h-4 mr-2" />
                  Додати перше оголошення
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
