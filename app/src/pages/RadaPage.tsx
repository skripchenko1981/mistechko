import { motion } from 'framer-motion';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Calendar,
  FileText, 
  Users,
  Download,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SectionTitle } from '@/components/common/SectionTitle';
import { NewsCard } from '@/components/common/NewsCard';
import { AnnouncementCard } from '@/components/common/AnnouncementCard';
import { MapComponent } from '@/components/map/MapComponent';
import { 
  rada1Info, 
  rada2Info, 
  newsData, 
  announcementsData, 
  deputiesData, 
  documentsData 
} from '@/data/mockData';

interface RadaPageProps {
  rada: 'rada1' | 'rada2';
}

export function RadaPage({ rada }: RadaPageProps) {
  const info = rada === 'rada1' ? rada1Info : rada2Info;
  const accentClass = rada === 'rada1' ? 'bg-[#e67e22]' : 'bg-[#27ae60]';
  
  const radaNews = newsData.filter(n => n.rada === rada || n.rada === 'all');
  const radaAnnouncements = announcementsData.filter(a => a.rada === rada);
  const radaDeputies = deputiesData.filter(d => d.rada === rada);
  const radaDocuments = documentsData.filter(d => d.rada === rada);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="relative h-[400px] flex items-end">
        <div className="absolute inset-0">
          <img 
            src={info.heroImage}
            alt={info.name}
            className="w-full h-full object-cover"
          />
          <div className={`absolute inset-0 bg-gradient-to-t from-[#1e3a5f]/90 via-[#1e3a5f]/50 to-transparent`} />
        </div>
        
        <div className="container mx-auto px-4 relative z-10 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className={`${accentClass} text-white mb-4`}>
              {info.shortName}
            </Badge>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
              {info.name}
            </h1>
            <p className="text-white/80 max-w-2xl text-lg">
              {info.description}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Quick Info Cards */}
      <section className="py-8 -mt-8 relative z-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="shadow-lg">
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`w-12 h-12 ${accentClass} rounded-lg flex items-center justify-center`}>
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#1e3a5f]">{info.population.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">жителів</p>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-lg">
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`w-12 h-12 ${accentClass} rounded-lg flex items-center justify-center`}>
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#1e3a5f]">{info.area}</p>
                  <p className="text-sm text-gray-500">площа</p>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-lg">
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`w-12 h-12 ${accentClass} rounded-lg flex items-center justify-center`}>
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#1e3a5f]">{info.foundedYear}</p>
                  <p className="text-sm text-gray-500">засновано</p>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-lg">
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`w-12 h-12 ${accentClass} rounded-lg flex items-center justify-center`}>
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#1e3a5f]">{radaDeputies.length}</p>
                  <p className="text-sm text-gray-500">депутатів</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="news" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 mb-8">
              <TabsTrigger value="news">Новини</TabsTrigger>
              <TabsTrigger value="announcements">Оголошення</TabsTrigger>
              <TabsTrigger value="documents">Документи</TabsTrigger>
              <TabsTrigger value="deputies">Депутати</TabsTrigger>
              <TabsTrigger value="contacts">Контакти</TabsTrigger>
            </TabsList>

            {/* News Tab */}
            <TabsContent value="news" className="mt-0">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {radaNews.map((news, index) => (
                  <NewsCard key={news.id} news={news} index={index} />
                ))}
              </div>
            </TabsContent>

            {/* Announcements Tab */}
            <TabsContent value="announcements" className="mt-0">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {radaAnnouncements.map((announcement, index) => (
                  <AnnouncementCard key={announcement.id} announcement={announcement} index={index} />
                ))}
              </div>
            </TabsContent>

            {/* Documents Tab */}
            <TabsContent value="documents" className="mt-0">
              <div className="space-y-4">
                {radaDocuments.map((doc, index) => (
                  <motion.div
                    key={doc.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 ${accentClass} rounded-lg flex items-center justify-center`}>
                            <FileText className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline">{doc.number}</Badge>
                              <span className="text-sm text-gray-500">
                                {doc.date.toLocaleDateString('uk-UA')}
                              </span>
                            </div>
                            <h4 className="font-semibold text-[#1e3a5f]">{doc.title}</h4>
                            <p className="text-sm text-gray-600">{doc.description}</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          Завантажити
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Deputies Tab */}
            <TabsContent value="deputies" className="mt-0">
              <div className="grid md:grid-cols-2 gap-6">
                {radaDeputies.map((deputy, index) => (
                  <motion.div
                    key={deputy.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                      <CardContent className="p-0">
                        <div className="flex">
                          <div className="w-32 h-32 flex-shrink-0">
                            <img 
                              src={deputy.photo} 
                              alt={deputy.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="p-4 flex-grow">
                            <h4 className="font-bold text-[#1e3a5f]">{deputy.name}</h4>
                            <p className={`text-sm ${accentClass.replace('bg-', 'text-')} mb-2`}>
                              {deputy.position}
                            </p>
                            <div className="space-y-1 text-sm text-gray-600">
                              <p className="flex items-center gap-2">
                                <Phone className="w-4 h-4" />
                                {deputy.phone}
                              </p>
                              <p className="flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                {deputy.email}
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Contacts Tab */}
            <TabsContent value="contacts" className="mt-0">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <SectionTitle title="Контактна інформація" />
                  <div className="space-y-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 ${accentClass} rounded-lg flex items-center justify-center`}>
                            <MapPin className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Адреса</p>
                            <p className="font-medium text-[#1e3a5f]">{info.address}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 ${accentClass} rounded-lg flex items-center justify-center`}>
                            <Phone className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Телефон</p>
                            <p className="font-medium text-[#1e3a5f]">{info.phone}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 ${accentClass} rounded-lg flex items-center justify-center`}>
                            <Mail className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="font-medium text-[#1e3a5f]">{info.email}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 ${accentClass} rounded-lg flex items-center justify-center`}>
                            <Clock className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Години роботи</p>
                            <p className="font-medium text-[#1e3a5f]">{info.workingHours}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 ${accentClass} rounded-lg flex items-center justify-center`}>
                            <User className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Прийом громадян</p>
                            <p className="font-medium text-[#1e3a5f]">{info.receptionHours}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
                <div>
                  <SectionTitle title="Розташування на мапі" />
                  <MapComponent height="400px" showFilters={false} radaFilter={rada} />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Head of Rada */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/3">
                    <img 
                      src={info.headPhoto} 
                      alt={info.headName}
                      className="w-full h-64 md:h-full object-cover"
                    />
                  </div>
                  <div className="md:w-2/3 p-6 md:p-8">
                    <Badge className={`${accentClass} text-white mb-4`}>
                      Керівництво
                    </Badge>
                    <h3 className="text-2xl font-bold text-[#1e3a5f] mb-2">{info.headName}</h3>
                    <p className={`text-lg ${accentClass.replace('bg-', 'text-')} mb-4`}>
                      {info.headPosition}
                    </p>
                    <p className="text-gray-600 mb-6">
                      Звертаюсь до всіх жителів нашої громади! Разом ми будуємо комфортне 
                      та сучасне місце для життя. Ваша активність та підтримка — запорука 
                      нашого спільного успіху.
                    </p>
                    <div className="flex gap-4">
                      <Button className={accentClass}>
                        <Phone className="w-4 h-4 mr-2" />
                        Зв'язатись
                      </Button>
                      <Button variant="outline">
                        <Calendar className="w-4 h-4 mr-2" />
                        Запис на прийом
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
