import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Plus, Pin, Eye, MessageCircle, Search, Filter } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { SectionTitle } from '../components/common';
import { useAuthStore } from '../stores';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const categories = ['Всі', 'ЖКГ', 'Освіта', 'Медицина', 'Транспорт', 'Інфраструктура', 'Інше'];

export function ForumPage() {
  const [topics, setTopics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Всі');
  const [searchQuery, setSearchQuery] = useState('');
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const category = selectedCategory === 'Всі' ? '' : `?category=${selectedCategory}`;
        const response = await fetch(`${API_URL}/api/forum/topics${category}`);
        if (response.ok) {
          const data = await response.json();
          setTopics(data);
        }
      } catch (error) {
        console.error('Error fetching topics:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTopics();
  }, [selectedCategory]);

  const filteredTopics = topics.filter(topic => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return topic.title.toLowerCase().includes(query);
    }
    return true;
  });

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('uk-UA', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12" data-testid="forum-page">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <SectionTitle 
            title="Форум громади" 
            subtitle="Обговорюйте важливі питання з сусідами"
          />
          {isAuthenticated && (
            <Button className="bg-[#1e3a5f] hover:bg-[#2c5282]">
              <Plus className="w-4 h-4 mr-2" />
              Нова тема
            </Button>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Пошук тем..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            <Filter className="w-5 h-5 text-gray-400 mr-2" />
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  selectedCategory === category
                    ? 'bg-[#1e3a5f] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Topics List */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-white rounded-xl h-24 animate-pulse" />
            ))}
          </div>
        ) : filteredTopics.length > 0 ? (
          <div className="space-y-4">
            {filteredTopics.map((topic, index) => (
              <motion.div
                key={topic.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-[#1e3a5f]/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <MessageSquare className="w-6 h-6 text-[#1e3a5f]" />
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="secondary">{topic.category}</Badge>
                          {topic.is_pinned && (
                            <Badge className="bg-[#e67e22] text-white">
                              <Pin className="w-3 h-3 mr-1" />
                              Закріплено
                            </Badge>
                          )}
                        </div>
                        <h3 className="font-semibold text-[#1e3a5f] mb-1 hover:text-[#e67e22] transition-colors">
                          {topic.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>{topic.author}</span>
                          <span className="flex items-center gap-1">
                            <MessageCircle className="w-4 h-4" />
                            {topic.replies}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {topic.views}
                          </span>
                          {topic.last_reply && (
                            <span className="text-xs">
                              Остання відповідь: {formatDate(topic.last_reply)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <MessageSquare className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">Тем не знайдено</p>
            {isAuthenticated && (
              <Button className="mt-4 bg-[#1e3a5f]">
                <Plus className="w-4 h-4 mr-2" />
                Створити першу тему
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
