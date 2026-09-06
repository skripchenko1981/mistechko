import { useEffect, useState } from 'react';
import { ArrowLeft, Loader2, MapPin, MessageCircle, Phone, ShoppingBag, Star } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Textarea } from '../components/ui/textarea';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { SectionTitle } from '../components/common';
import { useAuthStore } from '../stores';
import { uploadFile } from '../lib/storage';

const API_URL = process.env.REACT_APP_BACKEND_URL || '';

export function MarketplaceProductPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [messages, setMessages] = useState([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [chatError, setChatError] = useState('');
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editError, setEditError] = useState('');
  const [editProduct, setEditProduct] = useState(null);
  const [editImageFile, setEditImageFile] = useState(null);
  const { user, token, isAuthenticated } = useAuthStore();

  useEffect(() => {
    fetch(`${API_URL}/api/products/${productId}`)
      .then(async (response) => {
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.detail || 'Оголошення не знайдено.');
        setProduct(data);
      })
      .catch((requestError) => setError(requestError.message))
      .finally(() => setIsLoading(false));
  }, [productId]);

  const openChat = async () => {
    setChatError('');
    setIsChatOpen(true);
    try {
      const response = await fetch(`${API_URL}/api/products/${productId}/messages`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        credentials: 'include',
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.detail || 'Не вдалося завантажити переписку.');
      setMessages(data);
    } catch (chatRequestError) {
      setChatError(chatRequestError.message);
    }
  };

  const sendMessage = async (event) => {
    event.preventDefault();
    if (!messageText.trim()) return;
    setIsSending(true);
    setChatError('');

    const recipientId = user?.user_id === product.user_id
      ? messages.find((message) => message.sender_id !== user.user_id)?.sender_id
      : product.user_id;

    try {
      const response = await fetch(`${API_URL}/api/products/${productId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: 'include',
        body: JSON.stringify({ content: messageText.trim(), receiver_id: recipientId }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.detail || 'Не вдалося надіслати повідомлення.');
      setMessages((currentMessages) => [...currentMessages, data]);
      setMessageText('');
    } catch (sendError) {
      setChatError(sendError.message);
    } finally {
      setIsSending(false);
    }
  };

  const startEditing = () => {
    setEditError('');
    setEditProduct({
      name: product.name, description: product.description, price: product.price,
      image: product.image || '', category: product.category, rada: product.rada || 'all',
      location: product.location || '', condition: product.condition || 'Вживане',
      contact_phone: product.contact_phone || '',
    });
    setEditImageFile(null);
    setIsEditOpen(true);
  };

  const saveProduct = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setEditError('');
    try {
      const uploadedImage = editImageFile ? await uploadFile(editImageFile, token) : null;
      const response = await fetch(`${API_URL}/api/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        credentials: 'include',
        body: JSON.stringify({ ...editProduct, price: Number(editProduct.price), image: uploadedImage?.url || editProduct.image || null }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.detail || 'Не вдалося зберегти зміни.');
      setProduct(data);
      setIsEditOpen(false);
    } catch (saveError) {
      setEditError(saveError.message);
    } finally {
      setIsSaving(false);
    }
  };

  const deleteProduct = async () => {
    if (!window.confirm('Видалити це оголошення? Дію неможливо скасувати.')) return;
    const response = await fetch(`${API_URL}/api/products/${productId}`, {
      method: 'DELETE', headers: token ? { Authorization: `Bearer ${token}` } : {}, credentials: 'include'
    });
    if (response.ok) navigate('/marketplace');
    else setEditError('Не вдалося видалити оголошення.');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto max-w-5xl px-4">
        <Link to="/marketplace">
          <Button variant="ghost" className="mb-6 pl-0 text-[#1e3a5f] hover:bg-transparent hover:text-[#27ae60]">
            <ArrowLeft className="mr-2 h-4 w-4" /> До розділу «Купи-продай»
          </Button>
        </Link>
        {isLoading ? <div className="h-96 animate-pulse rounded-xl bg-white" /> : error ? (
          <Card><CardContent className="py-16 text-center text-gray-600">{error}</CardContent></Card>
        ) : (
          <>
            <SectionTitle title={product.name} subtitle="Оголошення громади" />
            <div className="mt-8 grid gap-8 md:grid-cols-[1.3fr_1fr]">
              <Card className="overflow-hidden">
                {product.image ? <img src={product.image} alt={product.name} className="h-80 w-full object-cover" /> : (
                  <div className="flex h-80 items-center justify-center bg-[#27ae60]/10"><ShoppingBag className="h-24 w-24 text-[#27ae60]/50" /></div>
                )}
                <CardContent className="p-6">
                  <Badge variant="secondary">{product.category}</Badge>
                  <p className="mt-5 whitespace-pre-wrap leading-7 text-gray-700">{product.description}</p>
                </CardContent>
              </Card>
              <Card className="h-fit border-[#d9e2ec]">
                <CardContent className="p-6">
                  <p className="text-3xl font-bold text-[#27ae60]">{product.price} грн</p>
                  <div className="mt-5 border-t border-gray-100 pt-5">
                    <p className="text-sm text-gray-500">Продавець</p>
                    <p className="mt-1 text-lg font-semibold text-[#1e3a5f]">{product.seller}</p>
                    <div className="mt-2 flex items-center gap-1 text-yellow-500">
                      <Star className="h-4 w-4 fill-current" />
                      <span>{product.rating || 0}</span><span className="text-gray-400">({product.reviews || 0} відгуків)</span>
                    </div>
                    <div className="mt-4 space-y-2 text-sm text-gray-600">
                      <p><span className="font-medium text-gray-700">Стан:</span> {product.condition || 'Не вказано'}</p>
                      <p className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {product.location || 'Громада'}</p>
                    </div>
                  </div>
                  {isAuthenticated && product.user_id !== 'system' && (
                    <Button className="mt-6 w-full bg-[#27ae60] hover:bg-[#219653]" onClick={openChat}>
                      <MessageCircle className="mr-2 h-4 w-4" /> {product.user_id === user?.user_id ? 'Відкрити переписку' : 'Написати продавцю'}
                    </Button>
                  )}
                  {!isAuthenticated && product.user_id !== 'system' && (
                    <Link to="/login" className="mt-6 block">
                      <Button className="w-full bg-[#27ae60] hover:bg-[#219653]"><MessageCircle className="mr-2 h-4 w-4" /> Увійдіть, щоб написати</Button>
                    </Link>
                  )}
                  {product.contact_phone && (
                    <a href={`tel:${product.contact_phone}`} className="mt-3 block">
                      <Button variant="outline" className="w-full border-[#27ae60] text-[#219653] hover:bg-[#27ae60]/10"><Phone className="mr-2 h-4 w-4" /> {product.contact_phone}</Button>
                    </a>
                  )}
                  {isAuthenticated && product.user_id === user?.user_id && (
                    <div className="mt-6 grid grid-cols-2 gap-3">
                      <Button variant="outline" onClick={startEditing}>Редагувати</Button>
                      <Button variant="destructive" onClick={deleteProduct}>Видалити</Button>
                    </div>
                  )}
                  {product.user_id === 'system' && (
                    <p className="mt-5 rounded-lg bg-gray-50 p-3 text-center text-xs text-gray-500">
                      Це демонстраційне оголошення. Контакти продавця для нього ще не підключені.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {isChatOpen && (
              <Card className="mt-8 border-[#d9e2ec]">
                <CardContent className="p-6">
                  <div className="mb-5 flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-[#1e3a5f]">Переписка з продавцем</h2>
                    <Button variant="ghost" onClick={() => setIsChatOpen(false)}>Закрити</Button>
                  </div>
                  <div className="mb-5 max-h-80 space-y-3 overflow-y-auto rounded-lg bg-gray-50 p-4">
                    {messages.length > 0 ? messages.map((message) => (
                      <div key={message.id} className={`flex ${message.sender_id === user?.user_id ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${message.sender_id === user?.user_id ? 'bg-[#27ae60] text-white' : 'bg-white text-gray-700 shadow-sm'}`}>
                          <p className="mb-1 text-xs opacity-70">{message.sender_name}</p>
                          <p className="whitespace-pre-wrap">{message.content}</p>
                        </div>
                      </div>
                    )) : <p className="py-8 text-center text-gray-500">Поки що повідомлень немає. Напишіть продавцю першим.</p>}
                  </div>
                  {product.user_id === user?.user_id && !messages.some((message) => message.sender_id !== user.user_id) ? (
                    <p className="text-sm text-gray-500">Коли покупець напише, ви зможете відповісти тут.</p>
                  ) : (
                    <form onSubmit={sendMessage} className="space-y-3">
                      <Textarea value={messageText} onChange={(event) => setMessageText(event.target.value)} maxLength={2000} placeholder="Напишіть повідомлення..." className="min-h-[90px]" disabled={isSending} />
                      {chatError && <p className="text-sm text-red-600" role="alert">{chatError}</p>}
                      <div className="flex justify-end">
                        <Button type="submit" className="bg-[#27ae60] hover:bg-[#219653]" disabled={isSending || !messageText.trim()}>
                          {isSending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          {isSending ? 'Надсилання...' : 'Надіслати'}
                        </Button>
                      </div>
                    </form>
                  )}
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="border-[#cde8d7] bg-[#f6fcf8] shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-[#1e3a5f]">Редагувати оголошення</DialogTitle>
            <DialogDescription className="text-[#64748b]">Оновіть дані вашого оголошення.</DialogDescription>
          </DialogHeader>
          {editProduct && (
            <form onSubmit={saveProduct} className="space-y-4">
              <div className="space-y-2"><Label className="text-[#1e3a5f]">Назва</Label><Input className="border-[#b9dcc5] bg-white focus-visible:ring-[#27ae60]" value={editProduct.name} onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })} required /></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2"><Label className="text-[#1e3a5f]">Ціна, грн</Label><Input className="border-[#b9dcc5] bg-white focus-visible:ring-[#27ae60]" type="number" min="0" value={editProduct.price} onChange={(e) => setEditProduct({ ...editProduct, price: e.target.value })} required /></div>
                <div className="space-y-2"><Label className="text-[#1e3a5f]">Телефон</Label><Input className="border-[#b9dcc5] bg-white focus-visible:ring-[#27ae60]" type="tel" value={editProduct.contact_phone} onChange={(e) => setEditProduct({ ...editProduct, contact_phone: e.target.value })} required /></div>
              </div>
              <div className="space-y-2"><Label className="text-[#1e3a5f]">Місто або населений пункт</Label><Input className="border-[#b9dcc5] bg-white focus-visible:ring-[#27ae60]" value={editProduct.location} onChange={(e) => setEditProduct({ ...editProduct, location: e.target.value })} /></div>
              <div className="space-y-2"><Label className="text-[#1e3a5f]">Фото товару</Label><Input className="border-[#b9dcc5] bg-white file:bg-transparent" type="file" accept="image/*" onChange={(e) => setEditImageFile(e.target.files?.[0] || null)} />{editImageFile && <p className="text-xs text-gray-500">Обрано: {editImageFile.name}</p>}</div>
              <div className="space-y-2"><Label className="text-[#1e3a5f]">Опис</Label><Textarea className="min-h-[120px] border-[#b9dcc5] bg-white focus-visible:ring-[#27ae60]" value={editProduct.description} onChange={(e) => setEditProduct({ ...editProduct, description: e.target.value })} required /></div>
              {editError && <p className="text-sm text-red-600" role="alert">{editError}</p>}
              <DialogFooter><Button type="button" variant="outline" className="border-[#b9dcc5] text-[#1e3a5f] hover:bg-[#e8f6ed]" onClick={() => setIsEditOpen(false)}>Скасувати</Button><Button type="submit" className="bg-[#27ae60] hover:bg-[#219653]" disabled={isSaving}>{isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Зберегти</Button></DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
