import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Building2 } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { SectionTitle } from '../components/common';
import { rada1Info, rada2Info } from '../data/mockData';

export function ContactsPage() {
  const radas = [
    { ...rada1Info, accent: '#e67e22' },
    { ...rada2Info, accent: '#27ae60' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12" data-testid="contacts-page">
      <div className="container mx-auto px-4">
        <SectionTitle 
          title="Контакти" 
          subtitle="Зв'яжіться з місцевими радами нашої громади"
        />

        <div className="grid md:grid-cols-2 gap-8 mt-8">
          {radas.map((rada, index) => (
            <motion.div
              key={rada.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
            >
              <Card className="overflow-hidden h-full hover:shadow-xl transition-shadow">
                <div 
                  className="h-48 bg-cover bg-center relative"
                  style={{ backgroundImage: `url(${rada.hero_image})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <Badge style={{ backgroundColor: rada.accent }} className="text-white mb-2">
                      {rada.short_name}
                    </Badge>
                    <h3 className="text-xl font-bold text-white">{rada.name}</h3>
                  </div>
                </div>
                
                <CardContent className="p-6 space-y-4">
                  {/* Head */}
                  <div className="flex items-center gap-4 pb-4 border-b">
                    <img 
                      src={rada.head_photo}
                      alt={rada.head_name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-bold text-[#1e3a5f]">{rada.head_name}</p>
                      <p className="text-sm text-gray-600">{rada.head_position}</p>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 flex-shrink-0" style={{ color: rada.accent }} />
                      <span className="text-sm text-gray-700">{rada.address}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 flex-shrink-0" style={{ color: rada.accent }} />
                      <a href={`tel:${rada.phone}`} className="text-sm text-gray-700 hover:underline">
                        {rada.phone}
                      </a>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 flex-shrink-0" style={{ color: rada.accent }} />
                      <a href={`mailto:${rada.email}`} className="text-sm text-gray-700 hover:underline">
                        {rada.email}
                      </a>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 flex-shrink-0" style={{ color: rada.accent }} />
                      <div>
                        <p className="text-sm text-gray-700">{rada.working_hours}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Прийом: {rada.reception_hours}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* General Contact */}
        <div className="mt-12">
          <Card className="bg-[#1e3a5f] text-white">
            <CardContent className="p-8 text-center">
              <Building2 className="w-12 h-12 mx-auto mb-4 text-[#e67e22]" />
              <h3 className="text-2xl font-bold mb-2">Загальна гаряча лінія</h3>
              <p className="text-white/70 mb-4">
                Для термінових питань щодо роботи громади
              </p>
              <a 
                href="tel:+380312456789"
                className="text-3xl font-bold text-[#e67e22] hover:underline"
              >
                +38 (0312) 45-67-89
              </a>
              <p className="text-sm text-white/60 mt-2">
                Пн-Пт: 8:00 - 18:00, Сб: 9:00 - 14:00
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
