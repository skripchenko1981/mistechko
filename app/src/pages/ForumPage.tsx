import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, MessageSquare, Eye, Pin, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { SectionTitle } from '@/components/common/SectionTitle';
import { forumTopicsData } from '@/data/mockData';

const categories = ['Всі', 'ЖКГ', 'Освіта', 'Медицина', 'Транспорт', 'Інфраструктура', 'Загальні'];

export function ForumPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Всі');

  const filteredTopics = forumTopicsData.filter(topic => {
    const matchesSearch = topic.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Всі' || topic.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const pinnedTopics = filteredTopics.filter(t => t.isPinned);
  const regularTopics = filteredTopics.filter(t => !t.isPinned);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <SectionTitle 
            title="Форум громади" 
            subtitle="Обговорюйте важливі питання, діліться думками та пропозиціями"
          />
          <Button className="bg-[#1e3a5f] hover:bg-[#152a45]">
            <Plus className="w-4 h-4 mr-2" />
            Нова тема
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input 
              placeholder="Пошук тем..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
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

        {/* Topics List */}
        <div className="space-y-4">
          {/* Pinned topics */}
          {pinnedTopics.map((topic, index) => (
            <motion.div
              key={topic.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="border-l-4 border-l-[#e67e22] hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#e67e22]/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Pin className="w-6 h-6 text-[#e67e22]" />
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className="bg-[#e67e22]">Важливо</Badge>
                        <Badge variant="secondary">{topic.category}</Badge>
                      </div>
                      <h4 className="font-semibold text-[#1e3a5f] text-lg hover:text-[#e67e22] transition-colors cursor-pointer">
                        {topic.title}
                      </h4>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span>{topic.author}</span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-4 h-4" />
                          {topic.replies} відповідей
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {topic.views} переглядів
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {topic.lastReply.toLocaleDateString('uk-UA')}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}

          {/* Regular topics */}
          {regularTopics.map((topic, index) => (
            <motion.div
              key={topic.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (pinnedTopics.length + index) * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#1e3a5f]/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <MessageSquare className="w-6 h-6 text-[#1e3a5f]" />
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="secondary">{topic.category}</Badge>
                      </div>
                      <h4 className="font-semibold text-[#1e3a5f] hover:text-[#e67e22] transition-colors cursor-pointer">
                        {topic.title}
                      </h4>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span>{topic.author}</span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-4 h-4" />
                          {topic.replies} відповідей
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {topic.views} переглядів
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {topic.lastReply.toLocaleDateString('uk-UA')}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredTopics.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Тем не знайдено</h3>
            <p className="text-gray-500">Спробуйте змінити параметри пошуку</p>
          </div>
        )}
      </div>
    </div>
  );
}
