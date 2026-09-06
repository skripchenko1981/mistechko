import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, Eye, ArrowRight, ExternalLink } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';

export function NewsCard({ news, index = 0 }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('uk-UA', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getRadaBadge = (rada) => {
    switch (rada) {
      case 'rada1':
        return <Badge className="bg-[#e67e22] text-white text-xs">Рада №1</Badge>;
      case 'rada2':
        return <Badge className="bg-[#27ae60] text-white text-xs">Рада №2</Badge>;
      default:
        return <Badge variant="secondary" className="text-xs">Загальне</Badge>;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      data-testid={`news-card-${news.id}`}
    >
      <Card className="overflow-hidden group hover:shadow-xl transition-all duration-300 h-full flex flex-col">
        {news.image && (
          <div className="relative h-48 overflow-hidden">
            <img 
              src={news.image} 
              alt={news.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute top-3 left-3 flex gap-2">
              {getRadaBadge(news.rada)}
            </div>
          </div>
        )}
        <CardContent className="p-5 flex-grow flex flex-col">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <Badge variant="outline" className="text-xs">{news.category}</Badge>
          </div>
          <h3 className="font-bold text-[#1e3a5f] mb-2 line-clamp-2 group-hover:text-[#e67e22] transition-colors">
            {news.title}
          </h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">{news.excerpt}</p>
          {news.source === 'facebook' && news.source_url && (
            <a
              href={news.source_url}
              target="_blank"
              rel="noreferrer"
              className="mb-3 inline-flex items-center gap-1 text-xs text-[#1877f2] hover:underline"
            >
              Джерело: Facebook
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
          <div className="flex items-center justify-between text-xs text-gray-400 pt-3 border-t">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {formatDate(news.created_at)}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {news.views}
              </span>
            </div>
            <Link 
              to={`/news/${news.id}`}
              className="flex items-center gap-1 text-[#e67e22] hover:underline font-medium"
            >
              Детальніше
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
