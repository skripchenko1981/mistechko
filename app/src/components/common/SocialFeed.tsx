import { motion } from 'framer-motion';
import { Facebook, Instagram, Heart, MessageCircle, ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { socialPostsData } from '@/data/mockData';

export function SocialFeed() {
  const facebookPosts = socialPostsData.filter(post => post.platform === 'facebook');
  const instagramPosts = socialPostsData.filter(post => post.platform === 'instagram');

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <Tabs defaultValue="facebook" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="facebook" className="flex items-center gap-2 data-[state=active]:bg-[#1877f2] data-[state=active]:text-white">
            <Facebook className="w-4 h-4" />
            Facebook
          </TabsTrigger>
          <TabsTrigger value="instagram" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:via-pink-500 data-[state=active]:to-orange-500 data-[state=active]:text-white">
            <Instagram className="w-4 h-4" />
            Instagram
          </TabsTrigger>
        </TabsList>

        <TabsContent value="facebook" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {facebookPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-[#1877f2] rounded-full flex items-center justify-center">
                        <Facebook className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-[#1e3a5f]">Моє Містечко</p>
                        <p className="text-xs text-gray-500">
                          {post.createdAt.toLocaleDateString('uk-UA')}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-3">{post.content}</p>
                    {post.image && (
                      <img 
                        src={post.image} 
                        alt="Post" 
                        className="w-full h-48 object-cover rounded-lg mb-3"
                      />
                    )}
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Heart className="w-4 h-4 text-red-500" />
                          {post.likes}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="w-4 h-4 text-blue-500" />
                          {post.comments}
                        </span>
                      </div>
                      <a 
                        href={post.url} 
                        className="flex items-center gap-1 text-[#1877f2] hover:underline"
                      >
                        Переглянути
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="instagram" className="mt-0">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {instagramPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="group relative aspect-square"
              >
                <Card className="overflow-hidden h-full">
                  <img 
                    src={post.image} 
                    alt="Instagram post" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="text-white text-center">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Heart className="w-5 h-5" />
                          {post.likes}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="w-5 h-5" />
                          {post.comments}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
