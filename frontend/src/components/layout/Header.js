import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, Cloud, Sun, CloudRain, Snowflake, 
  Newspaper, Megaphone, ShoppingBag, MessageSquare, 
  Map, Phone, Home, Building2, ChevronDown, LogIn, LogOut, User
} from 'lucide-react';
import { Button } from '../ui/button';
import { useUIStore, useAuthStore } from '../../stores';
import { currentWeather } from '../../data/mockData';

const navLinks = [
  { path: '/', label: 'Головна', icon: Home },
  { path: '/news', label: 'Новини', icon: Newspaper },
  { path: '/announcements', label: 'Оголошення', icon: Megaphone },
  { path: '/marketplace', label: 'Маркетплейс', icon: ShoppingBag },
  { path: '/forum', label: 'Форум', icon: MessageSquare },
  { path: '/map', label: 'Мапа', icon: Map },
  { path: '/contacts', label: 'Контакти', icon: Phone },
];

const radaLinks = [
  { path: '/rada/rada1', label: 'Рада №1 (Зелене)', icon: Building2 },
  { path: '/rada/rada2', label: 'Рада №2 (Сонячний)', icon: Building2 },
];

const getWeatherIcon = (icon) => {
  switch (icon) {
    case 'sun': return <Sun className="w-5 h-5 text-yellow-500" />;
    case 'cloud-rain': return <CloudRain className="w-5 h-5 text-blue-500" />;
    case 'snowflake': return <Snowflake className="w-5 h-5 text-blue-300" />;
    default: return <Cloud className="w-5 h-5 text-gray-400" />;
  }
};

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { mobileMenuOpen, toggleMobileMenu, setMobileMenuOpen } = useUIStore();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [radaDropdownOpen, setRadaDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    setRadaDropdownOpen(false);
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname, setMobileMenuOpen]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md" data-testid="main-header">
      {/* Top bar */}
      <div className="bg-[#1e3a5f] text-white py-2">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm">
            <span className="hidden sm:inline">Об'єднана територіальна громада</span>
            <span className="text-[#e67e22] font-semibold">Моє Містечко</span>
          </div>
          <div className="flex items-center gap-4">
            {/* Weather widget */}
            <div className="flex items-center gap-2 text-sm bg-white/10 px-3 py-1 rounded-full" data-testid="weather-widget">
              {getWeatherIcon(currentWeather.icon)}
              <span>{currentWeather.temperature}°C</span>
              <span className="hidden sm:inline text-white/70">{currentWeather.location}</span>
            </div>
            
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 text-sm hover:text-[#e67e22] transition-colors"
                  data-testid="user-menu-btn"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">{user?.name}</span>
                </button>
                
                <AnimatePresence>
                  {userDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border py-2 z-50"
                    >
                      {user?.role === 'superadmin' || user?.role === 'admin' ? (
                        <Link
                          to="/admin"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setUserDropdownOpen(false)}
                        >
                          <Building2 className="w-4 h-4" />
                          Адмін-панель
                        </Link>
                      ) : null}
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-50 w-full"
                        data-testid="logout-btn"
                      >
                        <LogOut className="w-4 h-4" />
                        Вийти
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link 
                to="/login" 
                className="text-sm hover:text-[#e67e22] transition-colors flex items-center gap-1"
                data-testid="login-link"
              >
                <LogIn className="w-4 h-4" />
                <span className="hidden sm:inline">Вхід</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3" data-testid="logo-link">
            <div className="w-12 h-12 bg-[#1e3a5f] rounded-lg flex items-center justify-center">
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-[#1e3a5f] leading-tight">Моє Містечко</h1>
              <p className="text-xs text-gray-500">Об'єднана територіальна громада</p>
            </div>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden lg:flex items-center gap-1" data-testid="desktop-nav">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive(link.path)
                    ? 'bg-[#1e3a5f] text-white'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-[#1e3a5f]'
                }`}
                data-testid={`nav-${link.label}`}
              >
                {link.label}
              </Link>
            ))}
            
            {/* Rada dropdown */}
            <div className="relative">
              <button
                onClick={() => setRadaDropdownOpen(!radaDropdownOpen)}
                className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-[#1e3a5f] transition-all flex items-center gap-1"
                data-testid="radas-dropdown-btn"
              >
                Ради
                <ChevronDown className={`w-4 h-4 transition-transform ${radaDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {radaDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50"
                  >
                    {radaLinks.map((link) => (
                      <Link
                        key={link.path}
                        to={link.path}
                        className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                          isActive(link.path)
                            ? 'bg-[#1e3a5f]/10 text-[#1e3a5f]'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <link.icon className="w-4 h-4" />
                        {link.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={toggleMobileMenu}
            data-testid="mobile-menu-btn"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-gray-100"
            data-testid="mobile-nav"
          >
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    isActive(link.path)
                      ? 'bg-[#1e3a5f] text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <link.icon className="w-5 h-5" />
                  {link.label}
                </Link>
              ))}
              <div className="border-t border-gray-100 my-2" />
              <p className="px-4 text-xs text-gray-500 uppercase font-semibold">Місцеві ради</p>
              {radaLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    isActive(link.path)
                      ? 'bg-[#e67e22] text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <link.icon className="w-5 h-5" />
                  {link.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
