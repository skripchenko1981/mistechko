import { Link } from 'react-router-dom';
import { Building2, Phone, Mail, MapPin, Facebook, Instagram } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#1e3a5f] text-white" data-testid="main-footer">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold">Моє Містечко</h3>
                <p className="text-xs text-white/60">ОТГ</p>
              </div>
            </div>
            <p className="text-sm text-white/70 mb-4">
              Об'єднана територіальна громада, що об'єднує село Зелене та мікрорайон Сонячний.
            </p>
            <div className="flex gap-3">
              <a 
                href="#" 
                className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-[#e67e22] transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-[#e67e22] transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-[#e67e22]">Швидкі посилання</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/news" className="text-sm text-white/70 hover:text-white transition-colors">
                  Новини
                </Link>
              </li>
              <li>
                <Link to="/announcements" className="text-sm text-white/70 hover:text-white transition-colors">
                  Оголошення
                </Link>
              </li>
              <li>
                <Link to="/marketplace" className="text-sm text-white/70 hover:text-white transition-colors">
                  Купи-продай
                </Link>
              </li>
              <li>
                <Link to="/forum" className="text-sm text-white/70 hover:text-white transition-colors">
                  Форум
                </Link>
              </li>
              <li>
                <Link to="/map" className="text-sm text-white/70 hover:text-white transition-colors">
                  Інтерактивна мапа
                </Link>
              </li>
            </ul>
          </div>

          {/* Radas */}
          <div>
            <h4 className="font-semibold mb-4 text-[#e67e22]">Місцеві ради</h4>
            <ul className="space-y-4">
              <li>
                <Link to="/rada/rada1" className="block">
                  <p className="text-sm font-medium hover:text-[#e67e22] transition-colors">Рада №1</p>
                  <p className="text-xs text-white/60">Село Зелене</p>
                </Link>
              </li>
              <li>
                <Link to="/rada/rada2" className="block">
                  <p className="text-sm font-medium hover:text-[#e67e22] transition-colors">Рада №2</p>
                  <p className="text-xs text-white/60">Мікрорайон Сонячний</p>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacts */}
          <div>
            <h4 className="font-semibold mb-4 text-[#e67e22]">Контакти</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#e67e22] mt-0.5 flex-shrink-0" />
                <span className="text-sm text-white/70">
                  вул. Центральна, 45, с. Зелене
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#e67e22] flex-shrink-0" />
                <a href="tel:+380312456789" className="text-sm text-white/70 hover:text-white">
                  +38 (0312) 45-67-89
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#e67e22] flex-shrink-0" />
                <a href="mailto:info@moemistechko.ua" className="text-sm text-white/70 hover:text-white">
                  info@moemistechko.ua
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/60">
            © {new Date().getFullYear()} Моє Містечко. Всі права захищено.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-sm text-white/60 hover:text-white transition-colors">
              Політика конфіденційності
            </a>
            <a href="#" className="text-sm text-white/60 hover:text-white transition-colors">
              Умови використання
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
