import { motion } from 'framer-motion';
import { Clock, Phone, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { announcementCategories } from '../../data/mockData';

export function AnnouncementCard({ announcement, index = 0 }) {
  const phoneNumber = (announcement.contact_info || '').trim();
  const phoneHref = phoneNumber
    ? `${phoneNumber.startsWith('+') ? '+' : ''}${phoneNumber.replace(/\D/g, '')}`
    : '';

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('uk-UA', {
      day: 'numeric',
      month: 'short'
    });
  };

  const category = announcementCategories[announcement.category] || announcementCategories.other;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      data-testid={`announcement-card-${announcement.id}`}
    >
      <Card className={`overflow-hidden hover:shadow-lg transition-shadow h-full ${announcement.is_urgent ? 'border-2 border-red-500' : ''}`}>
        {announcement.image && (
          <div className="relative h-32 overflow-hidden">
            <img 
              src={announcement.image} 
              alt={announcement.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Badge className={category.color}>{category.label}</Badge>
            {announcement.is_urgent && (
              <Badge className="bg-red-500 text-white flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                Терміново
              </Badge>
            )}
          </div>
          
          <h4 className="font-semibold text-[#1e3a5f] mb-2 line-clamp-2">
            {announcement.title}
          </h4>
          
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {announcement.description}
          </p>
          
          <div className="flex items-end justify-between gap-3 text-xs text-gray-500 pt-2 border-t">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              до {formatDate(announcement.expires_at)}
            </span>
            {phoneHref ? (
              <div className="flex flex-col items-end gap-1">
                <a
                  href={`tel:${phoneHref}`}
                  aria-label={`Зателефонувати за номером ${phoneNumber}`}
                  className="flex items-center gap-1 rounded-md text-right text-[#e67e22] hover:underline"
                >
                  <Phone className="w-3 h-3" />
                  Зателефонувати
                </a>
                <span className="text-[11px] text-gray-500">{phoneNumber}</span>
              </div>
            ) : (
              <span className="text-[11px] text-gray-400">Телефон не вказано</span>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
