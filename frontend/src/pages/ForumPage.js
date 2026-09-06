import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MessageSquare, Plus, Pin, Eye, MessageCircle, Search, Filter, Loader2 } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { SectionTitle } from '../components/common';
import { useAuthStore } from '../stores';

const API_URL = process.env.REACT_APP_BACKEND_URL || '';

const categories = ['Всі', 'ЖКГ', 'Освіта', 'Медицина', 'Транспорт', 'Інфраструктура', 'Інше'];

export function ForumPage() {
  const [topics, setTopics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Всі');
  const [searchQuery, setSearchQuery] = useState('');
  const { isAuthenticated, token } = useAuthStore();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newTopic, setNewTopic] = useState({ title: '', category: 'ЖКГ', content: '' });
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState('');

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

  const openCreateDialog = () => {
    setCreateError('');
    setIsCreateDialogOpen(true);
  };

  const handleCreateTopic = async (event) => {
    event.preventDefault();
    setCreateError('');

    if (!newTopic.title.trim() || !newTopic.content.trim()) {
      setCreateError('Заповніть назву та текст теми.');
      return;
    }

    setIsCreating(true);
    try {
      const response = await fetch(`${API_URL}/api/forum/topics`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: 'include',
        body: JSON.stringify({
          title: newTopic.title.trim(),
          category: newTopic.category,
          content: newTopic.content.trim(),
        }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.detail || 'Не вдалося створити тему.');
      }

      const createdTopic = await response.json();
      setTopics((currentTopics) => (
        selectedCategory === 'Всі' || selectedCategory === createdTopic.category
          ? [createdTopic, ...currentTopics]
          : currentTopics
      ));
      setNewTopic({ title: '', category: 'ЖКГ', content: '' });
      setIsCreateDialogOpen(false);
    } catch (error) {
      setCreateError(error.message);
    } finally {
      setIsCreating(false);
    }
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
            <Button className="bg-[#1e3a5f] hover:bg-[#2c5282]" onClick={openCreateDialog}>
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
                <Link to={`/forum/${topic.id}`} className="block" aria-label={`Відкрити тему: ${topic.title}`}>
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
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <MessageSquare className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">Тем не знайдено</p>
            {isAuthenticated && (
              <Button className="mt-4 bg-[#1e3a5f]" onClick={openCreateDialog}>
                <Plus className="w-4 h-4 mr-2" />
                Створити першу тему
              </Button>
            )}
          </div>
        )}
      </div>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="border-[#d9e2ec] bg-[#f8fafc] shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-[#1e3a5f]">Створити нову тему</DialogTitle>
            <DialogDescription className="text-[#64748b]">
              Опишіть питання, яке хочете обговорити з мешканцями громади.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateTopic} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="topic-title" className="text-[#1e3a5f]">Назва теми</Label>
              <Input
                id="topic-title"
                placeholder="Наприклад: Освітлення на центральній вулиці"
                value={newTopic.title}
                onChange={(event) => setNewTopic({ ...newTopic, title: event.target.value })}
                className="border-[#cbd5e1] bg-white focus-visible:ring-[#e67e22]"
                maxLength={120}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="topic-category" className="text-[#1e3a5f]">Категорія</Label>
              <select
                id="topic-category"
                value={newTopic.category}
                onChange={(event) => setNewTopic({ ...newTopic, category: event.target.value })}
                className="flex h-9 w-full rounded-md border border-[#cbd5e1] bg-white px-3 py-1 text-sm text-[#334155] shadow-sm focus:outline-none focus:ring-1 focus:ring-[#e67e22]"
              >
                {categories.slice(1).map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="topic-content" className="text-[#1e3a5f]">Текст теми</Label>
              <Textarea
                id="topic-content"
                placeholder="Розкажіть детальніше про своє питання..."
                value={newTopic.content}
                onChange={(event) => setNewTopic({ ...newTopic, content: event.target.value })}
                className="min-h-[140px] border-[#cbd5e1] bg-white focus-visible:ring-[#e67e22]"
                maxLength={2000}
                required
              />
            </div>

            {createError && (
              <p className="text-sm text-red-600" role="alert">{createError}</p>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Скасувати
              </Button>
              <Button type="submit" className="bg-[#e67e22] text-white hover:bg-[#d35400]" disabled={isCreating}>
                {isCreating && <Loader2 className="w-4 h-4 animate-spin" />}
                {isCreating ? 'Створення...' : 'Створити тему'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
