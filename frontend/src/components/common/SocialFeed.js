import { motion } from 'framer-motion';
import { Facebook, Instagram, Heart, MessageCircle, ExternalLink } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { socialPostsData } from '../../data/mockData';

export function SocialFeed() {
  const getPlatformIcon = (platform) => {
    switch (platform) {
      case 'facebook':
        return <Facebook className="w-5 h-5 text-blue-600" />;
      case 'instagram':
        return <Instagram className="w-5 h-5 text-pink-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4" data-testid="social-feed">
      {socialPostsData.map((post, index) => (
        <motion.div
          key={post.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
            {post.image && (
              <div className="relative h-40 overflow-hidden">
                <img 
                  src={post.image} 
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                {getPlatformIcon(post.platform)}
                <span className="text-xs text-gray-500 capitalize">{post.platform}</span>
              </div>
              
              <p className="text-sm text-gray-700 mb-3 line-clamp-3">
                {post.content}
              </p>
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Heart className="w-3 h-3 text-red-500" />
                    {post.likes}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="w-3 h-3" />
                    {post.comments}
                  </span>
                </div>
                <a 
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[#e67e22] hover:underline"
                >
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
