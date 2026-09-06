import { useState } from 'react';
import { ArrowLeft, Loader2, Upload } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { SectionTitle } from '../components/common';
import { uploadFile } from '../lib/storage';
import { useAuthStore } from '../stores';

const API_URL = process.env.REACT_APP_BACKEND_URL || '';

const categories = [
  ['work', 'Робота'],
  ['realty', 'Нерухомість'],
  ['auto', 'Авто'],
  ['services', 'Послуги'],
  ['lostfound', 'Знайшов/Загубив'],
  ['other', 'Інше'],
];

export function AnnouncementCreatePage() {
  const navigate = useNavigate();
  const { token } = useAuthStore();
  const [form, setForm] = useState({
    title: '', description: '', category: 'other', rada: 'all', price: '', contact_info: '', expires_days: '30', is_urgent: false,
  });
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSaving(true);
    try {
      const uploadedImage = imageFile ? await uploadFile(imageFile, token) : null;
      const response = await fetch(`${API_URL}/api/announcements`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        credentials: 'include',
        body: JSON.stringify({
          ...form,
          title: form.title.trim(),
          description: form.description.trim(),
          contact_info: form.contact_info.trim(),
          price: form.price === '' ? null : Number(form.price),
          expires_days: Number(form.expires_days),
          image: uploadedImage?.url || null,
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.detail || 'Не вдалося створити оголошення.');
      navigate('/announcements');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto max-w-3xl px-4">
        <Link to="/announcements" className="mb-6 inline-flex items-center text-[#1e3a5f] hover:text-[#e67e22]">
          <ArrowLeft className="mr-2 h-4 w-4" /> До оголошень
        </Link>
        <SectionTitle title="Нове оголошення" subtitle="Розкажіть громаді про важливу пропозицію або подію" />
        <Card className="mt-8 border-[#d9e2ec] shadow-sm">
          <CardContent className="p-6">
            <form onSubmit={submit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="announcement-title">Заголовок *</Label>
                <Input id="announcement-title" value={form.title} maxLength={120} required placeholder="Наприклад: Продам будинок" onChange={(event) => update('title', event.target.value)} />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="announcement-category">Категорія *</Label>
                  <select id="announcement-category" value={form.category} onChange={(event) => update('category', event.target.value)} className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm">
                    {categories.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="announcement-rada">Громада</Label>
                  <select id="announcement-rada" value={form.rada} onChange={(event) => update('rada', event.target.value)} className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm">
                    <option value="all">Уся громада</option>
                    <option value="rada1">Рада №1</option>
                    <option value="rada2">Рада №2</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="announcement-price">Ціна, грн</Label>
                  <Input id="announcement-price" type="number" min="0" step="0.01" value={form.price} placeholder="Не вказано" onChange={(event) => update('price', event.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="announcement-expires">Діє, днів</Label>
                  <Input id="announcement-expires" type="number" min="1" max="365" value={form.expires_days} onChange={(event) => update('expires_days', event.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="announcement-contact">Телефон для зв’язку *</Label>
                <Input id="announcement-contact" type="tel" maxLength={40} required placeholder="+380 67 123 45 67" value={form.contact_info} onChange={(event) => update('contact_info', event.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="announcement-description">Опис *</Label>
                <Textarea id="announcement-description" className="min-h-[150px]" maxLength={3000} required placeholder="Детально опишіть оголошення" value={form.description} onChange={(event) => update('description', event.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="announcement-image">Фото <span className="font-normal text-gray-400">(необов’язково, до 25 МБ)</span></Label>
                <Input id="announcement-image" type="file" accept="image/*" onChange={(event) => setImageFile(event.target.files?.[0] || null)} />
                {imageFile && <p className="flex items-center gap-2 text-xs text-gray-500"><Upload className="h-3 w-3" /> {imageFile.name}</p>}
              </div>
              <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
                <input type="checkbox" checked={form.is_urgent} onChange={(event) => update('is_urgent', event.target.checked)} />
                Позначити як термінове
              </label>
              {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
              <div className="flex justify-end gap-3">
                <Link to="/announcements"><Button type="button" variant="outline">Скасувати</Button></Link>
                <Button type="submit" className="bg-[#e67e22] hover:bg-[#d35400]" disabled={isSaving}>
                  {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isSaving ? 'Публікація...' : 'Опублікувати'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
