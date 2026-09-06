import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search, ShoppingBag, Star, Filter, Plus, Loader2, MapPin, SlidersHorizontal } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { SectionTitle } from '../components/common';
import { useAuthStore } from '../stores';
import { uploadFile } from '../lib/storage';

const API_URL = process.env.REACT_APP_BACKEND_URL || '';

const categories = ['Всі', 'Дитячий світ', 'Дім і сад', 'Електроніка', 'Одяг і взуття', 'Авто', 'Нерухомість', 'Послуги', 'Робота', 'Тварини', 'Хобі та спорт', 'Продукти', 'Ремесла', 'Техніка', 'Інше'];
const conditions = ['Нове', 'Як нове', 'Вживане'];

export function MarketplacePage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Всі');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState('');
  const [newProduct, setNewProduct] = useState({
    name: '', description: '', price: '', image: '', category: 'Дім і сад', rada: 'all', location: '', condition: 'Вживане', contact_phone: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const { isAuthenticated, token, user } = useAuthStore();
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sort, setSort] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [showMine, setShowMine] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const params = new URLSearchParams({ limit: '50' });
        if (selectedCategory !== 'Всі') params.set('category', selectedCategory);
        if (searchQuery.trim()) params.set('search', searchQuery.trim());
        if (minPrice) params.set('min_price', minPrice);
        if (maxPrice) params.set('max_price', maxPrice);
        params.set('sort', sort);
        const response = await fetch(`${API_URL}/api/products?${params.toString()}`);
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, [selectedCategory, searchQuery, minPrice, maxPrice, sort]);

  const handleCreateProduct = async (event) => {
    event.preventDefault();
    setCreateError('');
    if (!newProduct.name.trim() || !newProduct.description.trim() || newProduct.price === '') {
      setCreateError('Заповніть назву, опис і ціну.');
      return;
    }

    setIsCreating(true);
    try {
      const uploadedImage = imageFile ? await uploadFile(imageFile, token) : null;
      const response = await fetch(`${API_URL}/api/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: 'include',
        body: JSON.stringify({
          ...newProduct,
          name: newProduct.name.trim(),
          description: newProduct.description.trim(),
          price: Number(newProduct.price),
          image: uploadedImage?.url || null,
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.detail || 'Не вдалося опублікувати оголошення.');

      setProducts((currentProducts) => [data, ...currentProducts]);
      setNewProduct({ name: '', description: '', price: '', image: '', category: 'Дім і сад', rada: 'all', location: '', condition: 'Вживане', contact_phone: '' });
      setImageFile(null);
      setIsCreateDialogOpen(false);
    } catch (error) {
      setCreateError(error.message);
    } finally {
      setIsCreating(false);
    }
  };

  const filteredProducts = showMine ? products.filter((product) => product.user_id === user?.user_id) : products;

  return (
    <div className="min-h-screen bg-gray-50 py-12" data-testid="marketplace-page">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <SectionTitle
            title="Купи-продай"
            subtitle="Товари та послуги мешканців громади"
          />
          {isAuthenticated && (
            <Button className="bg-[#27ae60] hover:bg-[#219653]" onClick={() => { setCreateError(''); setIsCreateDialogOpen(true); }}>
              <Plus className="mr-2 h-4 w-4" />
              Подати оголошення
            </Button>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-8">
          <div className="flex flex-col gap-4 lg:flex-row">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Що шукаєте? Наприклад, велосипед або стіл"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="lg:w-auto" onClick={() => setShowFilters(!showFilters)}>
              <SlidersHorizontal className="mr-2 h-4 w-4" /> Фільтри
            </Button>
            <select value={sort} onChange={(event) => setSort(event.target.value)}
              className="h-9 rounded-md border border-input bg-white px-3 text-sm text-gray-700">
              <option value="newest">Спочатку нові</option>
              <option value="price_asc">Ціна: від дешевих</option>
              <option value="price_desc">Ціна: від дорогих</option>
            </select>
            {isAuthenticated && (
              <Button variant={showMine ? 'default' : 'outline'} className={showMine ? 'bg-[#1e3a5f]' : ''} onClick={() => setShowMine(!showMine)}>
                Мої оголошення
              </Button>
            )}
          </div>
          {showFilters && (
            <div className="mt-4 grid gap-3 border-t border-gray-100 pt-4 sm:grid-cols-3">
              <Input type="number" min="0" placeholder="Ціна від, грн" value={minPrice} onChange={(event) => setMinPrice(event.target.value)} />
              <Input type="number" min="0" placeholder="Ціна до, грн" value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)} />
              <Button variant="ghost" onClick={() => { setMinPrice(''); setMaxPrice(''); }}>Очистити фільтри</Button>
            </div>
          )}
          <div className="flex flex-wrap gap-2 mt-4">
            <Filter className="w-5 h-5 text-gray-400 mr-2" />
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  selectedCategory === category
                    ? 'bg-[#27ae60] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="bg-white rounded-xl h-72 animate-pulse" />
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link to={`/marketplace/${product.id}`} className="block">
                  <Card className="group overflow-hidden transition-all duration-300 hover:shadow-xl">
                  {product.image ? (
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
                    </div>
                  ) : (
                    <div className="flex h-48 items-center justify-center bg-[#27ae60]/10">
                      <ShoppingBag className="h-14 w-14 text-[#27ae60]/50" />
                    </div>
                  )}
                  <CardContent className="p-4">
                    <Badge variant="secondary" className="mb-2">{product.category}</Badge>
                    <h3 className="font-bold text-[#1e3a5f] mb-1 line-clamp-1">{product.name}</h3>
                    <p className="mb-3 line-clamp-2 text-sm text-gray-600">{product.description}</p>
                    <div className="mb-3 flex items-center gap-1 text-xs text-gray-500">
                      <MapPin className="h-3.5 w-3.5" /> {product.location || 'Громада'}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{product.seller}</span>
                      <div className="flex items-center gap-1 text-yellow-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-sm font-medium">{product.rating}</span>
                        <span className="text-xs text-gray-400">({product.reviews})</span>
                      </div>
                    </div>
                  </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <ShoppingBag className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">Товарів не знайдено</p>
          </div>
        )}
      </div>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="border-[#d9e2ec] bg-[#f8fafc] shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-[#1e3a5f]">Подати оголошення</DialogTitle>
            <DialogDescription>Розкажіть громаді про товар або послугу, яку пропонуєте.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateProduct} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="product-name" className="text-[#1e3a5f]">Назва</Label>
              <Input id="product-name" value={newProduct.name} maxLength={100} required
                placeholder="Наприклад: Домашній мед"
                onChange={(event) => setNewProduct({ ...newProduct, name: event.target.value })} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="product-price" className="text-[#1e3a5f]">Ціна, грн</Label>
                <Input id="product-price" type="number" min="0" step="0.01" value={newProduct.price} required
                  placeholder="250"
                  onChange={(event) => setNewProduct({ ...newProduct, price: event.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="product-category" className="text-[#1e3a5f]">Категорія</Label>
                <select id="product-category" value={newProduct.category}
                  onChange={(event) => setNewProduct({ ...newProduct, category: event.target.value })}
                  className="flex h-9 w-full rounded-md border border-[#cbd5e1] bg-white px-3 py-1 text-sm">
                  {categories.slice(1).map((category) => <option key={category}>{category}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="product-condition" className="text-[#1e3a5f]">Стан</Label>
                <select id="product-condition" value={newProduct.condition}
                  onChange={(event) => setNewProduct({ ...newProduct, condition: event.target.value })}
                  className="flex h-9 w-full rounded-md border border-[#cbd5e1] bg-white px-3 py-1 text-sm">
                  {conditions.map((condition) => <option key={condition}>{condition}</option>)}
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="product-location" className="text-[#1e3a5f]">Місто або населений пункт</Label>
              <Input id="product-location" value={newProduct.location} maxLength={80}
                placeholder="Наприклад: Зелене"
                onChange={(event) => setNewProduct({ ...newProduct, location: event.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="product-phone" className="text-[#1e3a5f]">Телефон продавця</Label>
              <Input id="product-phone" type="tel" value={newProduct.contact_phone} required maxLength={30}
                placeholder="+380 67 123 45 67"
                onChange={(event) => setNewProduct({ ...newProduct, contact_phone: event.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="product-description" className="text-[#1e3a5f]">Опис</Label>
              <Textarea id="product-description" value={newProduct.description} maxLength={2000} required
                placeholder="Опишіть товар або послугу"
                className="min-h-[110px] bg-white"
                onChange={(event) => setNewProduct({ ...newProduct, description: event.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="product-image" className="text-[#1e3a5f]">Фото товару <span className="font-normal text-gray-400">(необов'язково, до 25 МБ)</span></Label>
              <Input id="product-image" type="file" accept="image/*" onChange={(event) => setImageFile(event.target.files?.[0] || null)} />
              {imageFile && <p className="text-xs text-gray-500">Обрано: {imageFile.name}</p>}
            </div>
            {createError && <p className="text-sm text-red-600" role="alert">{createError}</p>}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Скасувати</Button>
              <Button type="submit" className="bg-[#27ae60] text-white hover:bg-[#219653]" disabled={isCreating}>
                {isCreating && <Loader2 className="h-4 w-4 animate-spin" />}
                {isCreating ? 'Публікація...' : 'Опублікувати'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
