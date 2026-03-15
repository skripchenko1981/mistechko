import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Eye, User, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import type { NewsItem } from '@/types';

interface NewsCardProps {
  news: NewsItem;
  index?: number;
}

const radaColors = {
  all: 'bg-[#1e3a5f]',
  rada1: 'bg-[#e67e22]',
  rada2: 'bg-[#27ae60]'
};

const radaLabels = {
  all: 'Загальна',
  rada1: 'Рада №1',
  rada2: 'Рада №2'
};

export function NewsCard({ news, index = 0 }: NewsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="overflow-hidden group hover:shadow-xl transition-all duration-300 h-full flex flex-col">
        <div className="relative h-48 overflow-hidden">
          <img 
            src={news.image} 
            alt={news.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 left-3 flex gap-2">
            <Badge className={`${radaColors[news.rada]} text-white`}>
              {radaLabels[news.rada]}
            </Badge>
            <Badge variant="secondary" className="bg-white/90">
              {news.category}
            </Badge>
          </div>
        </div>
        <CardContent className="p-5 flex flex-col flex-grow">
          <h3 className="text-lg font-bold text-[#1e3a5f] mb-2 line-clamp-2 group-hover:text-[#e67e22] transition-colors">
            {news.title}
          </h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">
            {news.excerpt}
          </p>
          <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {news.createdAt.toLocaleDateString('uk-UA')}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {news.views}
              </span>
            </div>
            <span className="flex items-center gap-1">
              <User className="w-3 h-3" />
              {news.author}
            </span>
          </div>
          <Link 
            to={`/news/${news.id}`}
            className="inline-flex items-center gap-2 text-[#1e3a5f] font-medium text-sm hover:text-[#e67e22] transition-colors"
          >
            Читати далі
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </CardContent>
      </Card>
    </motion.div>
  );
}
