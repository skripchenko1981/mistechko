import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  MapPin, Phone, Mail, Clock, Calendar, Users, 
  FileText, Building2, ArrowRight
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { SectionTitle, NewsCard } from '../components/common';
import { MapComponent } from '../components/map';
import { useNewsStore, useRadasStore } from '../stores';
import { rada1Info, rada2Info } from '../data/mockData';

export function RadaPage() {
  const { radaId } = useParams();
  const { news, fetchNews } = useNewsStore();
  const [radaInfo, setRadaInfo] = useState(null);

  useEffect(() => {
    // Use mock data for now
    if (radaId === 'rada1') {
      setRadaInfo(rada1Info);
    } else if (radaId === 'rada2') {
      setRadaInfo(rada2Info);
    }
    fetchNews(radaId);
  }, [radaId]);

  if (!radaInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#1e3a5f] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const isRada1 = radaId === 'rada1';
  const accentColor = isRada1 ? '#e67e22' : '#27ae60';
  const radaNews = news.filter(n => n.rada === radaId || n.rada === 'all').slice(0, 3);

  return (
    <div className="min-h-screen" data-testid={`rada-page-${radaId}`}>
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center">
        <div className="absolute inset-0">
          <img 
            src={radaInfo.hero_image}
            alt={radaInfo.name}
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
            <Badge 
              className="text-white mb-4"
              style={{ backgroundColor: accentColor }}
            >
              {radaInfo.short_name}
            </Badge>
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              {radaInfo.name}
            </h1>
            <p className="text-white/80 mb-6">
              {radaInfo.description}
            </p>
            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" style={{ color: accentColor }} />
                <span>{radaInfo.population.toLocaleString()} жителів</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" style={{ color: accentColor }} />
                <span>Площа: {radaInfo.area}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" style={{ color: accentColor }} />
                <span>Засновано: {radaInfo.founded_year} р.</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Info */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 flex items-start gap-4">
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${accentColor}20` }}
                >
                  <MapPin className="w-6 h-6" style={{ color: accentColor }} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-500 text-sm">Адреса</h4>
                  <p className="text-[#1e3a5f] font-medium">{radaInfo.address}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 flex items-start gap-4">
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${accentColor}20` }}
                >
                  <Phone className="w-6 h-6" style={{ color: accentColor }} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-500 text-sm">Телефон</h4>
                  <a href={`tel:${radaInfo.phone}`} className="text-[#1e3a5f] font-medium hover:underline">
                    {radaInfo.phone}
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 flex items-start gap-4">
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${accentColor}20` }}
                >
                  <Clock className="w-6 h-6" style={{ color: accentColor }} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-500 text-sm">Графік роботи</h4>
                  <p className="text-[#1e3a5f] font-medium">{radaInfo.working_hours}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 flex items-start gap-4">
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${accentColor}20` }}
                >
                  <Mail className="w-6 h-6" style={{ color: accentColor }} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-500 text-sm">Email</h4>
                  <a href={`mailto:${radaInfo.email}`} className="text-[#1e3a5f] font-medium hover:underline">
                    {radaInfo.email}
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Head of Rada */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <SectionTitle 
                title="Керівництво"
                subtitle="Голова ради та контактна інформація"
              />
              <Card className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <img 
                      src={radaInfo.head_photo}
                      alt={radaInfo.head_name}
                      className="w-24 h-24 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="text-xl font-bold text-[#1e3a5f]">{radaInfo.head_name}</h3>
                      <p className="text-gray-600">{radaInfo.head_position}</p>
                      <Badge 
                        className="mt-2"
                        style={{ backgroundColor: accentColor }}
                      >
                        {radaInfo.short_name}
                      </Badge>
                    </div>
                  </div>
                  <div className="mt-6 pt-6 border-t space-y-3">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">
                        <strong>Прийом громадян:</strong> {radaInfo.reception_hours}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <a href={`tel:${radaInfo.phone}`} className="text-sm hover:underline">
                        {radaInfo.phone}
                      </a>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <a href={`mailto:${radaInfo.email}`} className="text-sm hover:underline">
                        {radaInfo.email}
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div>
              <MapComponent height="350px" rada={radaId} />
            </div>
          </div>
        </div>
      </section>

      {/* Rada News */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <SectionTitle title={`Новини ${radaInfo.short_name}`} />
            <Button 
              variant="outline"
              onClick={() => window.location.href = `/news?rada=${radaId}`}
            >
              Всі новини
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {radaNews.map((item, index) => (
              <NewsCard key={item.id} news={item} index={index} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
