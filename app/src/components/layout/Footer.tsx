import { Link } from 'react-router-dom';
import { 
  Building2, 
  Phone, 
  Mail, 
  MapPin, 
  Facebook, 
  Instagram, 
  Send,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { rada1Info, rada2Info } from '@/data/mockData';

const quickLinks = [
  { path: '/news', label: 'Новини' },
  { path: '/announcements', label: 'Оголошення' },
  { path: '/marketplace', label: 'Маркетплейс' },
  { path: '/forum', label: 'Форум' },
  { path: '/map', label: 'Інтерактивна мапа' },
  { path: '/contacts', label: 'Контакти' },
];

const legalLinks = [
  { path: '/privacy', label: 'Політика конфіденційності' },
  { path: '/terms', label: 'Умови використання' },
  { path: '/cookies', label: 'Cookies' },
];

export function Footer() {
  return (
    <footer className="bg-[#1e3a5f] text-white">
      {/* Main footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: About */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-[#e67e22]" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Моє Містечко</h3>
                <p className="text-xs text-white/60">ОТГ</p>
              </div>
            </div>
            <p className="text-white/70 text-sm mb-4">
              Об'єднана територіальна громада, що об'єднує жителів села Зелене та мікрорайону Сонячний у єдиному цифровому просторі.
            </p>
            <div className="flex items-center gap-3">
              <a 
                href="#" 
                className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-[#e67e22] transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-[#e67e22] transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-[#e67e22] transition-colors"
              >
                <Send className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Швидкі посилання</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link 
                    to={link.path}
                    className="text-white/70 hover:text-[#e67e22] transition-colors text-sm flex items-center gap-2"
                  >
                    <ExternalLink className="w-3 h-3" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contacts */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Контакти рад</h4>
            <div className="space-y-4">
              <div>
                <p className="font-medium text-[#e67e22] text-sm">{rada1Info.shortName}</p>
                <div className="space-y-1 mt-1">
                  <p className="text-white/70 text-sm flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {rada1Info.address}
                  </p>
                  <p className="text-white/70 text-sm flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    {rada1Info.phone}
                  </p>
                </div>
              </div>
              <div>
                <p className="font-medium text-[#27ae60] text-sm">{rada2Info.shortName}</p>
                <div className="space-y-1 mt-1">
                  <p className="text-white/70 text-sm flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {rada2Info.address}
                  </p>
                  <p className="text-white/70 text-sm flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    {rada2Info.phone}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Підписка на новини</h4>
            <p className="text-white/70 text-sm mb-4">
              Отримуйте актуальні новини та оголошення громади на email.
            </p>
            <div className="space-y-2">
              <Input 
                type="email" 
                placeholder="Ваш email"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
              <Button className="w-full bg-[#e67e22] hover:bg-[#d35400]">
                <Mail className="w-4 h-4 mr-2" />
                Підписатись
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/50 text-sm text-center md:text-left">
              © 2024 Моє Містечко. Об'єднана територіальна громада. Всі права захищені.
            </p>
            <div className="flex items-center gap-4">
              {legalLinks.map((link) => (
                <Link 
                  key={link.path}
                  to={link.path}
                  className="text-white/50 hover:text-white text-sm transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
