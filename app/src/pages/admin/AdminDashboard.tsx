import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Newspaper, 
  Megaphone, 
  FileText, 
  Users, 
  Settings,
  LogOut,
  TrendingUp,
  Eye,
  MessageSquare,
  ShoppingBag,
  ChevronRight
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuthStore, useUIStore } from '@/stores';
import { newsData, announcementsData, forumTopicsData, productsData } from '@/data/mockData';

const sidebarLinks = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/news', label: 'Новини', icon: Newspaper },
  { path: '/admin/announcements', label: 'Оголошення', icon: Megaphone },
  { path: '/admin/documents', label: 'Документи', icon: FileText },
  { path: '/admin/users', label: 'Користувачі', icon: Users },
  { path: '/admin/settings', label: 'Налаштування', icon: Settings },
];

const stats = [
  { label: 'Всього новин', value: newsData.length, icon: Newspaper, color: 'bg-blue-500', change: '+12%' },
  { label: 'Оголошень', value: announcementsData.length, icon: Megaphone, color: 'bg-orange-500', change: '+5%' },
  { label: 'Тем форуму', value: forumTopicsData.length, icon: MessageSquare, color: 'bg-purple-500', change: '+8%' },
  { label: 'Товарів', value: productsData.length, icon: ShoppingBag, color: 'bg-green-500', change: '+3%' },
];

export function AdminDashboard() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { sidebarOpen } = useUIStore();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  if (!isAuthenticated || !user) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`bg-[#1e3a5f] text-white transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'} flex-shrink-0`}>
        <div className="p-4">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
              <LayoutDashboard className="w-6 h-6" />
            </div>
            {sidebarOpen && (
              <div>
                <p className="font-bold">Адмін-панель</p>
                <p className="text-xs text-white/60">Моє Містечко</p>
              </div>
            )}
          </div>

          <nav className="space-y-2">
            {sidebarLinks.map((link) => (
              <a
                key={link.path}
                href={link.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  location.pathname === link.path 
                    ? 'bg-white/20' 
                    : 'hover:bg-white/10'
                }`}
              >
                <link.icon className="w-5 h-5" />
                {sidebarOpen && <span>{link.label}</span>}
              </a>
            ))}
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors w-full"
          >
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span>Вихід</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-grow p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[#1e3a5f]">Dashboard</h1>
            <p className="text-gray-500">Ласкаво просимо, {user.name}</p>
          </div>
          <div className="flex items-center gap-4">
            <Badge className={user.role === 'superadmin' ? 'bg-purple-500' : 'bg-blue-500'}>
              {user.role === 'superadmin' ? 'Super Admin' : user.role === 'admin' ? 'Admin' : 'Moderator'}
            </Badge>
            {user.rada && (
              <Badge className={user.rada === 'rada1' ? 'bg-[#e67e22]' : 'bg-[#27ae60]'}>
                {user.rada === 'rada1' ? 'Рада №1' : 'Рада №2'}
              </Badge>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <Badge variant="outline" className="text-green-600">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {stat.change}
                    </Badge>
                  </div>
                  <p className="text-3xl font-bold text-[#1e3a5f]">{stat.value}</p>
                  <p className="text-gray-500">{stat.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-[#1e3a5f]">Останні новини</h3>
                <a href="/admin/news" className="text-sm text-[#e67e22] hover:underline flex items-center gap-1">
                  Всі
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>
              <div className="space-y-3">
                {newsData.slice(0, 5).map((news) => (
                  <div key={news.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <div>
                      <p className="font-medium text-[#1e3a5f] line-clamp-1">{news.title}</p>
                      <p className="text-sm text-gray-500">{news.createdAt.toLocaleDateString('uk-UA')}</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Eye className="w-4 h-4" />
                      {news.views}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-[#1e3a5f]">Останні оголошення</h3>
                <a href="/admin/announcements" className="text-sm text-[#e67e22] hover:underline flex items-center gap-1">
                  Всі
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>
              <div className="space-y-3">
                {announcementsData.slice(0, 5).map((ann) => (
                  <div key={ann.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <div>
                      <p className="font-medium text-[#1e3a5f] line-clamp-1">{ann.title}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {ann.rada === 'rada1' ? 'Рада №1' : 'Рада №2'}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {ann.createdAt.toLocaleDateString('uk-UA')}
                        </span>
                      </div>
                    </div>
                    {ann.isUrgent && (
                      <Badge className="bg-red-500">Терміново</Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
