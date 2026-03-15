import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight, Building2, Newspaper, Megaphone, MessageSquare, 
  Map, Users, TrendingUp, FileText
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { SectionTitle, NewsCard, AnnouncementCard, SocialFeed } from '../components/common';
import { WeatherWidget } from '../components/weather';
import { MapComponent } from '../components/map';
import { useNewsStore, useAnnouncementsStore, useRadasStore } from '../stores';
import { rada1Info, rada2Info } from '../data/mockData';

const stats = [
  { label: 'Жителів', value: '8,920', icon: Users, color: 'bg-blue-500' },
  { label: 'Площа', value: '30.8 км²', icon: Map, color: 'bg-green-500' },
  { label: 'Підприємців', value: '156', icon: TrendingUp, color: 'bg-orange-500' },
  { label: 'Документів', value: '2,340', icon: FileText, color: 'bg-purple-500' },
];

export function HomePage() {
  const { news, fetchNews } = useNewsStore();
  const { announcements, fetchAnnouncements } = useAnnouncementsStore();
  const { fetchRadas } = useRadasStore();

  useEffect(() => {
    fetchNews();
    fetchAnnouncements();
    fetchRadas();
  }, []);

  const latestNews = news.slice(0, 3);
  const latestAnnouncements = announcements.slice(0, 4);

  return (
    <div className="min-h-screen" data-testid="home-page">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1600&h=800&fit=crop"
            alt="Hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1e3a5f]/90 to-[#1e3a5f]/60" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl text-white"
          >
            <Badge className="bg-[#e67e22] text-white mb-4" data-testid="hero-badge">
              Об'єднана територіальна громада
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-4" data-testid="hero-title">
              Моє Містечко
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-2">
              Єдина громада — спільне майбутнє
            </p>
            <p className="text-white/70 mb-8 max-w-lg">
              Об'єднуємо жителів села Зелене та мікрорайону Сонячний у єдиному цифровому просторі 
              для комфортного життя та розвитку.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link to="/rada/rada1">
                <Button size="lg" className="bg-[#e67e22] hover:bg-[#d35400]" data-testid="rada1-btn">
                  <Building2 className="w-5 h-5 mr-2" />
                  Рада №1
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link to="/rada/rada2">
                <Button size="lg" className="bg-[#27ae60] hover:bg-[#1e8449]" data-testid="rada2-btn">
                  <Building2 className="w-5 h-5 mr-2" />
                  Рада №2
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Stats bar */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="absolute bottom-0 left-0 right-0 bg-white/10 backdrop-blur-md"
        >
          <div className="container mx-auto px-4 py-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <div key={index} className="flex items-center gap-3 text-white">
                  <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-white/70">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <SectionTitle 
                title="Про нашу громаду"
                subtitle="Ми об'єднали два населені пункти для спільного розвитку та покращення якості життя"
              />
              <p className="text-gray-600 mb-6">
                Об'єднана територіальна громада "Моє Містечко" була створена з метою ефективного 
                управління ресурсами, розвитку інфраструктури та забезпечення якісних послуг 
                для всіх жителів.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <Card className="border-l-4 border-l-[#e67e22]">
                  <CardContent className="p-4">
                    <h4 className="font-bold text-[#1e3a5f]">{rada1Info.short_name}</h4>
                    <p className="text-sm text-gray-600">{rada1Info.name}</p>
                    <p className="text-xs text-gray-500 mt-1">{rada1Info.population} жителів</p>
                  </CardContent>
                </Card>
                <Card className="border-l-4 border-l-[#27ae60]">
                  <CardContent className="p-4">
                    <h4 className="font-bold text-[#1e3a5f]">{rada2Info.short_name}</h4>
                    <p className="text-sm text-gray-600">{rada2Info.name}</p>
                    <p className="text-xs text-gray-500 mt-1">{rada2Info.population} жителів</p>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <img 
                src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop"
                alt="Community"
                className="rounded-2xl shadow-xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-[#e67e22] text-white p-6 rounded-xl shadow-lg">
                <p className="text-3xl font-bold">{new Date().getFullYear() - 2020}+</p>
                <p className="text-sm">років розвитку</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="py-16 bg-gray-50" data-testid="news-section">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <SectionTitle title="Новини громади" />
            <Link to="/news">
              <Button variant="outline" className="hidden sm:flex" data-testid="all-news-btn">
                Всі новини
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestNews.map((item, index) => (
              <NewsCard key={item.id} news={item} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Weather Section */}
      <section className="py-16 bg-white" data-testid="weather-section-home">
        <div className="container mx-auto px-4">
          <SectionTitle 
            title="Погода" 
            subtitle="Актуальний прогноз погоди для обох населених пунктів громади"
          />
          <WeatherWidget />
        </div>
      </section>

      {/* Announcements Section */}
      <section className="py-16 bg-gray-50" data-testid="announcements-section">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <SectionTitle title="Оголошення" />
            <Link to="/announcements">
              <Button variant="outline" className="hidden sm:flex" data-testid="all-announcements-btn">
                Всі оголошення
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {latestAnnouncements.map((announcement, index) => (
              <AnnouncementCard key={announcement.id} announcement={announcement} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-white" data-testid="map-section">
        <div className="container mx-auto px-4">
          <SectionTitle 
            title="Інтерактивна мапа" 
            subtitle="Знайдіть важливі об'єкти інфраструктури на мапі громади"
          />
          <MapComponent height="500px" />
        </div>
      </section>

      {/* Social Feed Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <SectionTitle 
            title="Ми в соціальних мережах" 
            subtitle="Слідкуйте за новинами у Facebook та Instagram"
          />
          <SocialFeed />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#1e3a5f]">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Приєднуйтесь до нашої громади!
            </h2>
            <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
              Будьте в курсі всіх подій, отримуйте важливі оголошення та спілкуйтесь з сусідами
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/register">
                <Button size="lg" className="bg-[#e67e22] hover:bg-[#d35400]" data-testid="register-cta-btn">
                  <Newspaper className="w-5 h-5 mr-2" />
                  Зареєструватися
                </Button>
              </Link>
              <Link to="/announcements">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-[#1e3a5f]">
                  <Megaphone className="w-5 h-5 mr-2" />
                  Переглянути оголошення
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
