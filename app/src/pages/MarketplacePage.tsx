import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Star, Phone, ShoppingBag } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { SectionTitle } from '@/components/common/SectionTitle';
import { productsData } from '@/data/mockData';

const categories = ['Всі', 'Продукти', 'Послуги', 'Ремесла', 'Техніка', 'Одяг'];

export function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Всі');

  const filteredProducts = productsData.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Всі' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <SectionTitle 
            title="Маркетплейс" 
            subtitle="Товари та послуги від місцевих підприємців та жителів"
          />
          <Button className="bg-[#27ae60] hover:bg-[#1e8449]">
            <Plus className="w-4 h-4 mr-2" />
            Додати товар
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input 
              placeholder="Пошук товарів та послуг..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-500 mb-2">Категорії:</p>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <Badge
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  className={`cursor-pointer ${selectedCategory === category ? 'bg-[#27ae60]' : ''}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Results count */}
        <p className="text-gray-500 mb-4">
          Знайдено <span className="font-semibold text-[#1e3a5f]">{filteredProducts.length}</span> товарів
        </p>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="overflow-hidden group hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-[#27ae60] text-white">
                      {product.price} грн
                    </Badge>
                  </div>
                  <div className="absolute top-3 left-3">
                    <Badge variant="secondary">
                      {product.category}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-4 flex flex-col flex-grow">
                  <h3 className="font-bold text-[#1e3a5f] mb-1 group-hover:text-[#e67e22] transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2 flex-grow">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-gray-500">{product.seller}</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-sm font-medium">{product.rating}</span>
                      <span className="text-xs text-gray-400">({product.reviews})</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    <Phone className="w-4 h-4 mr-2" />
                    Зв'язатись
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Товарів не знайдено</h3>
            <p className="text-gray-500">Спробуйте змінити параметри пошуку</p>
          </div>
        )}
      </div>
    </div>
  );
}
