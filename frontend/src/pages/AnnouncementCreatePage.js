import { useEffect, useState } from 'react';
import { ArrowLeft, Loader2, Upload } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { SectionTitle } from '../components/common';
import { uploadFile } from '../lib/storage';
import { extractUkrainianPhoneDigits, formatUkrainianPhone, isValidUkrainianPhone, PHONE_PREFIX } from '../lib/phone';
import { useAuthStore } from '../stores';

const API_URL = process.env.REACT_APP_BACKEND_URL || '';

const categories = [
  ['community', 'Громадські повідомлення'],
  ['events', 'Події та заходи'],
  ['work', 'Робота'],
  ['help', 'Потрібна допомога'],
  ['lostfound', 'Знайдено/Загублено'],
  ['other', 'Інше'],
];

export function AnnouncementCreatePage() {
  const navigate = useNavigate();
  const { announcementId } = useParams();
  const { token } = useAuthStore();
  const isEdit = Boolean(announcementId);
  const [form, setForm] = useState({
    title: '', description: '', category: 'community', rada: 'all', phone_digits: '', expires_days: '30', is_urgent: false,
  });
  const [imageFile, setImageFile] = useState(null);
  const [existingImage, setExistingImage] = useState(null);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(isEdit);

  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  useEffect(() => {
    if (!isEdit) return;
    const loadAnnouncement = async () => {
      try {
        const response = await fetch(`${API_URL}/api/announcements/${announcementId}`);
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.detail || 'Не вдалося завантажити оголошення.');
        const remainingDays = Math.max(1, Math.ceil((new Date(data.expires_at) - Date.now()) / 86400000));
        setForm({
          title: data.title || '',
          description: data.description || '',
          category: data.category || 'community',
          rada: data.rada || 'all',
          phone_digits: extractUkrainianPhoneDigits(data.contact_info),
          expires_days: String(remainingDays),
          is_urgent: Boolean(data.is_urgent),
        });
        setExistingImage(data.image || null);
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setIsLoading(false);
      }
    };
    loadAnnouncement();
  }, [announcementId, isEdit]);

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    if (!isValidUkrainianPhone(form.phone_digits)) {
      setError('Введіть 10 цифр номера: 0XX XXX XX XX.');
      return;
    }
    setIsSaving(true);
    try {
      const uploadedImage = imageFile ? await uploadFile(imageFile, token) : null;
      const response = await fetch(`${API_URL}/api/announcements${isEdit ? `/${announcementId}` : ''}`, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        credentials: 'include',
        body: JSON.stringify({
          ...form,
          title: form.title.trim(),
          description: form.description.trim(),
          contact_info: formatUkrainianPhone(form.phone_digits),
          phone_digits: undefined,
          expires_days: Number(form.expires_days),
          image: uploadedImage?.url || existingImage || null,
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.detail || (isEdit ? 'Не вдалося зберегти оголошення.' : 'Не вдалося створити оголошення.'));
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
        <SectionTitle title={isEdit ? 'Редагувати оголошення' : 'Нове оголошення'} subtitle="Повідомте громаду про важливу подію або інформацію" />
        <Card className="mt-8 border-[#d9e2ec] shadow-sm">
          <CardContent className="p-6">
            {isLoading ? (
              <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-[#1e3a5f]" /></div>
            ) : (
            <form onSubmit={submit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="announcement-title">Заголовок *</Label>
                <Input id="announcement-title" value={form.title} maxLength={120} required placeholder="Наприклад: Громадські слухання у селі" onChange={(event) => update('title', event.target.value)} />
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
                  <Label htmlFor="announcement-expires">Діє, днів</Label>
                  <Input id="announcement-expires" type="number" min="1" max="365" value={form.expires_days} onChange={(event) => update('expires_days', event.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="announcement-contact">Телефон для зв’язку *</Label>
                <div className="flex">
                  <span className="inline-flex h-10 items-center rounded-l-md border border-r-0 border-input bg-gray-100 px-3 text-sm text-gray-700">{PHONE_PREFIX}</span>
                  <Input id="announcement-contact" className="rounded-l-none" type="tel" inputMode="numeric" maxLength={10} required placeholder="067 123 45 67" value={form.phone_digits} onChange={(event) => update('phone_digits', event.target.value.replace(/\D/g, '').slice(0, 10))} />
                </div>
                <p className="text-xs text-gray-500">Введіть 10 цифр разом із початковим 0.</p>
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
                  {isSaving ? 'Збереження...' : (isEdit ? 'Зберегти зміни' : 'Опублікувати')}
                </Button>
              </div>
            </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
