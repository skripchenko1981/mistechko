import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, User, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { SectionTitle } from '@/components/common/SectionTitle';
import { Badge } from '@/components/ui/badge';
import { MapComponent } from '@/components/map/MapComponent';
import { rada1Info, rada2Info } from '@/data/mockData';

export function ContactsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <SectionTitle 
          title="Контакти" 
          subtitle="Зв'яжіться з нами або відвідайте наші офіси"
        />

        {/* Contact Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Rada 1 */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="h-full border-l-4 border-l-[#e67e22]">
              <CardContent className="p-6">
                <Badge className="bg-[#e67e22] text-white mb-4">{rada1Info.shortName}</Badge>
                <h3 className="text-xl font-bold text-[#1e3a5f] mb-4">{rada1Info.name}</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-[#e67e22]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-[#e67e22]" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Адреса</p>
                      <p className="font-medium text-[#1e3a5f]">{rada1Info.address}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-[#e67e22]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-[#e67e22]" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Телефон</p>
                      <p className="font-medium text-[#1e3a5f]">{rada1Info.phone}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-[#e67e22]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-[#e67e22]" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium text-[#1e3a5f]">{rada1Info.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-[#e67e22]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-[#e67e22]" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Години роботи</p>
                      <p className="font-medium text-[#1e3a5f]">{rada1Info.workingHours}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-[#e67e22]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-[#e67e22]" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Прийом громадян</p>
                      <p className="font-medium text-[#1e3a5f]">{rada1Info.receptionHours}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Rada 2 */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="h-full border-l-4 border-l-[#27ae60]">
              <CardContent className="p-6">
                <Badge className="bg-[#27ae60] text-white mb-4">{rada2Info.shortName}</Badge>
                <h3 className="text-xl font-bold text-[#1e3a5f] mb-4">{rada2Info.name}</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-[#27ae60]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-[#27ae60]" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Адреса</p>
                      <p className="font-medium text-[#1e3a5f]">{rada2Info.address}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-[#27ae60]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-[#27ae60]" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Телефон</p>
                      <p className="font-medium text-[#1e3a5f]">{rada2Info.phone}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-[#27ae60]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-[#27ae60]" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium text-[#1e3a5f]">{rada2Info.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-[#27ae60]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-[#27ae60]" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Години роботи</p>
                      <p className="font-medium text-[#1e3a5f]">{rada2Info.workingHours}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-[#27ae60]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-[#27ae60]" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Прийом громадян</p>
                      <p className="font-medium text-[#1e3a5f]">{rada2Info.receptionHours}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Contact Form & Map */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-[#1e3a5f] mb-4">Надіслати повідомлення</h3>
                <form className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-600 mb-1 block">Ім'я</label>
                      <Input placeholder="Ваше ім'я" />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 mb-1 block">Email</label>
                      <Input type="email" placeholder="your@email.com" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">Тема</label>
                    <Input placeholder="Тема повідомлення" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">Повідомлення</label>
                    <Textarea placeholder="Ваше повідомлення..." rows={5} />
                  </div>
                  <Button className="w-full bg-[#1e3a5f] hover:bg-[#152a45]">
                    <Send className="w-4 h-4 mr-2" />
                    Надіслати
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Map */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <MapComponent height="400px" showFilters={false} />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
