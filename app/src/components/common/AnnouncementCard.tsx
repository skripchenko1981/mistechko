import { motion } from 'framer-motion';
import { Calendar, Phone, AlertCircle, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Announcement } from '@/types';

interface AnnouncementCardProps {
  announcement: Announcement;
  index?: number;
}

const categoryLabels: Record<string, string> = {
  work: 'Робота',
  realty: 'Нерухомість',
  auto: 'Авто',
  services: 'Послуги',
  lostfound: 'Знайшов/загубив',
  other: 'Інше'
};

const categoryColors: Record<string, string> = {
  work: 'bg-blue-500',
  realty: 'bg-green-500',
  auto: 'bg-purple-500',
  services: 'bg-orange-500',
  lostfound: 'bg-pink-500',
  other: 'bg-gray-500'
};

export function AnnouncementCard({ announcement, index = 0 }: AnnouncementCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className={`overflow-hidden group hover:shadow-xl transition-all duration-300 h-full ${
        announcement.isUrgent ? 'border-red-300 ring-1 ring-red-200' : ''
      }`}>
        {announcement.image && (
          <div className="relative h-40 overflow-hidden">
            <img 
              src={announcement.image} 
              alt={announcement.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {announcement.isUrgent && (
              <div className="absolute top-3 right-3">
                <Badge className="bg-red-500 text-white flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Терміново
                </Badge>
              </div>
            )}
          </div>
        )}
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <Badge className={`${categoryColors[announcement.category]} text-white text-xs`}>
              <Tag className="w-3 h-3 mr-1" />
              {categoryLabels[announcement.category]}
            </Badge>
            <Badge variant="outline" className={announcement.rada === 'rada1' ? 'text-[#e67e22]' : 'text-[#27ae60]'}>
              {announcement.rada === 'rada1' ? 'Рада №1' : 'Рада №2'}
            </Badge>
          </div>
          
          <h3 className="text-lg font-bold text-[#1e3a5f] mb-2 line-clamp-2 group-hover:text-[#e67e22] transition-colors">
            {announcement.title}
          </h3>
          
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {announcement.description}
          </p>
          
          {announcement.price && (
            <p className="text-xl font-bold text-[#27ae60] mb-3">
              {announcement.price.toLocaleString('uk-UA')} грн
            </p>
          )}
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Calendar className="w-3 h-3" />
              {announcement.createdAt.toLocaleDateString('uk-UA')}
            </div>
            <Button size="sm" variant="outline" className="text-xs">
              <Phone className="w-3 h-3 mr-1" />
              Зв'язатись
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
