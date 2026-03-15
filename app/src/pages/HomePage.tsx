import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Building2, 
  Newspaper, 
  Megaphone, 
  MessageSquare, 
  Map,
  Users,
  TrendingUp,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SectionTitle } from '@/components/common/SectionTitle';
import { NewsCard } from '@/components/common/NewsCard';
import { AnnouncementCard } from '@/components/common/AnnouncementCard';
import { WeatherWidget } from '@/components/weather/WeatherWidget';
import { MapComponent } from '@/components/map/MapComponent';
import { SocialFeed } from '@/components/common/SocialFeed';
import { 
  newsData, 
  announcementsData, 
  productsData, 
  forumTopicsData,
  rada1Info,
  rada2Info 
} from '@/data/mockData';

const stats = [
  { label: 'Жителів', value: '8,920', icon: Users, color: 'bg-blue-500' },
  { label: 'Площа', value: '30.8 км²', icon: Map, color: 'bg-green-500' },
  { label: 'Підприємців', value: '156', icon: TrendingUp, color: 'bg-orange-500' },
  { label: 'Документів', value: '2,340', icon: FileText, color: 'bg-purple-500' },
];

export function HomePage() {
  const latestNews = newsData.slice(0, 3);
  const latestAnnouncements = announcementsData.slice(0, 4);
  const latestProducts = productsData.slice(0, 4);
  const latestTopics = forumTopicsData.slice(0, 4);

  return (
    <div className="min-h-screen">
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
            <Badge className="bg-[#e67e22] text-white mb-4">
              Об'єднана територіальна громада
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
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
              <Link to="/rada1">
                <Button size="lg" className="bg-[#e67e22] hover:bg-[#d35400]">
                  <Building2 className="w-5 h-5 mr-2" />
                  Рада №1
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link to="/rada2">
                <Button size="lg" className="bg-[#27ae60] hover:bg-[#1e8449]">
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
                    <h4 className="font-bold text-[#1e3a5f]">{rada1Info.shortName}</h4>
                    <p className="text-sm text-gray-600">{rada1Info.name}</p>
                    <p className="text-xs text-gray-500 mt-1">{rada1Info.population} жителів</p>
                  </CardContent>
                </Card>
                <Card className="border-l-4 border-l-[#27ae60]">
                  <CardContent className="p-4">
                    <h4 className="font-bold text-[#1e3a5f]">{rada2Info.shortName}</h4>
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
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <SectionTitle title="Новини громади" />
            <Link to="/news">
              <Button variant="outline" className="hidden sm:flex">
                Всі новини
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestNews.map((news, index) => (
              <NewsCard key={news.id} news={news} index={index} />
            ))}
          </div>
          <div className="mt-6 text-center sm:hidden">
            <Link to="/news">
              <Button variant="outline">
                Всі новини
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Weather Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <SectionTitle 
            title="Погода" 
            subtitle="Актуальний прогноз погоди для обох населених пунктів громади"
          />
          <WeatherWidget />
        </div>
      </section>

      {/* Announcements Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <SectionTitle title="Оголошення" />
            <Link to="/announcements">
              <Button variant="outline" className="hidden sm:flex">
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

      {/* Marketplace Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <SectionTitle title="Маркетплейс" subtitle="Товари та послуги місцевих підприємців" />
            <Link to="/marketplace">
              <Button variant="outline" className="hidden sm:flex">
                Всі товари
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {latestProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="overflow-hidden group hover:shadow-xl transition-all duration-300">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-[#27ae60] text-white">
                        {product.price} грн
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold text-[#1e3a5f] mb-1 line-clamp-1">{product.name}</h3>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{product.seller}</span>
                      <div className="flex items-center gap-1 text-yellow-500">
                        <span className="text-sm font-medium">{product.rating}</span>
                        <span className="text-xs text-gray-400">({product.reviews})</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <SectionTitle 
            title="Інтерактивна мапа" 
            subtitle="Знайдіть важливі об'єкти інфраструктури на мапі громади"
          />
          <MapComponent height="500px" />
        </div>
      </section>

      {/* Forum Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <SectionTitle title="Активні обговорення" subtitle="Приєднуйтесь до дискусій на форумі" />
            <Link to="/forum">
              <Button variant="outline" className="hidden sm:flex">
                Перейти на форум
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {latestTopics.map((topic, index) => (
              <motion.div
                key={topic.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-[#1e3a5f]/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <MessageSquare className="w-5 h-5 text-[#1e3a5f]" />
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="secondary" className="text-xs">
                            {topic.category}
                          </Badge>
                          {topic.isPinned && (
                            <Badge className="bg-[#e67e22] text-xs">Важливо</Badge>
                          )}
                        </div>
                        <h4 className="font-semibold text-[#1e3a5f] mb-1 hover:text-[#e67e22] transition-colors cursor-pointer">
                          {topic.title}
                        </h4>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>{topic.author}</span>
                          <span>{topic.replies} відповідей</span>
                          <span>{topic.views} переглядів</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
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
              <Button size="lg" className="bg-[#e67e22] hover:bg-[#d35400]">
                <Newspaper className="w-5 h-5 mr-2" />
                Підписатись на новини
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-[#1e3a5f]">
                <Megaphone className="w-5 h-5 mr-2" />
                Додати оголошення
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
