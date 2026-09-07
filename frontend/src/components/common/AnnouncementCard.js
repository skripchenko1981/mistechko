import { motion } from 'framer-motion';
import { Clock, Phone, AlertTriangle, Pencil, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { announcementCategories } from '../../data/mockData';
import { useAuthStore } from '../../stores';

export function AnnouncementCard({ announcement, index = 0, onDelete }) {
  const { user } = useAuthStore();
  const rawPhoneDigits = (announcement.contact_info || '').replace(/\D/g, '');
  const phoneDigitsWithCountry = rawPhoneDigits.startsWith('38')
    ? rawPhoneDigits
    : `38${rawPhoneDigits}`;
  const phoneNumber = rawPhoneDigits ? `+${phoneDigitsWithCountry}` : '';
  const phoneHref = phoneNumber;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('uk-UA', {
      day: 'numeric',
      month: 'short'
    });
  };

  const category = announcementCategories[announcement.category] || announcementCategories.other;
  const canEdit = user && (
    user.user_id === announcement.user_id ||
    ['superadmin', 'admin', 'moderator'].includes(user.role)
  );

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
          {canEdit && (
            <div className="mb-2 flex items-center gap-3 text-xs">
              <Link
                to={`/announcements/${announcement.id}/edit`}
                className="inline-flex items-center gap-1 text-[#1e3a5f] hover:text-[#e67e22] hover:underline"
              >
                <Pencil className="h-3 w-3" />
                Редагувати
              </Link>
              <button
                type="button"
                onClick={() => onDelete?.(announcement.id)}
                className="inline-flex items-center gap-1 text-red-600 hover:text-red-800 hover:underline"
              >
                <Trash2 className="h-3 w-3" />
                Видалити
              </button>
            </div>
          )}
          
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
