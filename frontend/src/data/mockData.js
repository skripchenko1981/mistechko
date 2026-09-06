// Mock data for initial display (fallback when API is unavailable)

export const rada1Info = {
  id: 'rada1',
  name: 'Сільська рада села Зелене',
  short_name: 'Рада №1',
  description: 'Село Зелене — мальовничий куточок нашої громади з багатою історією та привітними жителями.',
  address: 'вул. Центральна, 45, с. Зелене',
  phone: '+38 (0312) 45-67-89',
  email: 'rada1@moemistechko.ua',
  working_hours: 'Пн-Пт: 8:00 - 17:00',
  reception_hours: 'Вт: 10:00 - 14:00, Чт: 14:00 - 18:00',
  head_name: 'Іван Петрович Коваленко',
  head_position: 'Сільський голова',
  head_photo: '/api/storage/site/photo-1507003211169-0a1dd7228f2d.jpg',
  hero_image: '/api/storage/site/photo-1500382017468-9049fed747ef.jpg',
  population: 3240,
  area: '18.5 км²',
  founded_year: 1587
};

export const rada2Info = {
  id: 'rada2',
  name: 'Міська рада мікрорайону Сонячний',
  short_name: 'Рада №2',
  description: 'Мікрорайон Сонячний — сучасний житловий масив з розвиненою інфраструктурою.',
  address: 'просп. Сонячний, 12, мікрорайон Сонячний',
  phone: '+38 (0312) 56-78-90',
  email: 'rada2@moemistechko.ua',
  working_hours: 'Пн-Пт: 8:00 - 17:00',
  reception_hours: 'Пн: 10:00 - 14:00, Ср: 14:00 - 18:00',
  head_name: 'Марія Олександрівна Шевченко',
  head_position: 'Голова ради',
  head_photo: '/api/storage/site/photo-1573496359142-b8d87734a5a2.jpg',
  hero_image: '/api/storage/site/photo-1449844908441-8829872d2607.jpg',
  population: 5680,
  area: '12.3 км²',
  founded_year: 1985
};

export const currentWeather = {
  location: 'Зелене',
  temperature: 4,
  feels_like: 1,
  condition: 'Хмарно',
  icon: 'cloud',
  humidity: 78,
  wind_speed: 12,
  pressure: 1023,
  uv_index: 2,
  sunrise: '07:42',
  sunset: '16:18'
};

export const weatherForecast = [
  { date: '2025-01-14', day_of_week: 'Сб', high: 5, low: 0, condition: 'Хмарно', icon: 'cloud', precipitation: 10 },
  { date: '2025-01-15', day_of_week: 'Нд', high: 3, low: -2, condition: 'Дощ', icon: 'cloud-rain', precipitation: 80 },
  { date: '2025-01-16', day_of_week: 'Пн', high: 2, low: -3, condition: 'Сніг', icon: 'snowflake', precipitation: 60 },
  { date: '2025-01-17', day_of_week: 'Вт', high: 1, low: -4, condition: 'Сніг', icon: 'snowflake', precipitation: 40 },
  { date: '2025-01-18', day_of_week: 'Ср', high: 0, low: -5, condition: 'Ясно', icon: 'sun', precipitation: 5 },
  { date: '2025-01-19', day_of_week: 'Чт', high: 2, low: -3, condition: 'Ясно', icon: 'sun', precipitation: 0 },
  { date: '2025-01-20', day_of_week: 'Пт', high: 4, low: -1, condition: 'Хмарно', icon: 'cloud', precipitation: 20 }
];

export const mapPointsData = [
  {
    id: '1',
    name: 'Томаківська центральна лікарня',
    type: 'medicine',
    coordinates: [47.8107, 34.7472],
    address: 'смт Томаківка, Дніпропетровська область',
    phone: '',
    description: 'Медичний заклад Томаківської громади',
    community: 'tomakivska'
  },
  {
    id: '2',
    name: 'Томаківський ліцей',
    type: 'education',
    coordinates: [47.8165, 34.7539],
    address: 'смт Томаківка, Дніпропетровська область',
    phone: '',
    description: 'Освітній заклад громади',
    community: 'tomakivska'
  },
  {
    id: '3',
    name: 'Томаківська селищна рада',
    type: 'admin',
    coordinates: [47.813333, 34.749167],
    address: 'смт Томаківка, Нікопольський район, Дніпропетровська область',
    phone: '',
    description: 'Адміністративний центр Томаківської громади',
    community: 'tomakivska'
  },
  {
    id: '5',
    name: 'Мирівський медичний пункт',
    type: 'medicine',
    coordinates: [47.7727, 34.7305],
    address: 'с. Мирове, Нікопольський район, Дніпропетровська область',
    phone: '',
    description: 'Медичний заклад Мирівської громади',
    community: 'myrivska'
  },
  {
    id: '6',
    name: 'Мирівський ліцей',
    type: 'education',
    coordinates: [47.7688, 34.7364],
    address: 'с. Мирове, Нікопольський район, Дніпропетровська область',
    phone: '',
    description: 'Освітній заклад громади',
    community: 'myrivska'
  },
  {
    id: '7',
    name: 'Мирівська сільська рада',
    type: 'admin',
    coordinates: [47.77079, 34.73345],
    address: 'с. Мирове, Нікопольський район, Дніпропетровська область',
    phone: '',
    description: 'Адміністративний центр Мирівської громади',
    community: 'myrivska'
  }
];

export const socialPostsData = [
  {
    id: '1',
    platform: 'facebook',
    content: 'Сьогодні відкрили новий дитячий майданчик! Дякуємо всім, хто долучився до реалізації проєкту.',
    image: '/api/storage/site/photo-1566140967404-b8b3932483f5.jpg',
    likes: 156,
    comments: 23,
    created_at: '2024-12-10',
    url: '#'
  },
  {
    id: '2',
    platform: 'instagram',
    content: 'Зимова краса нашого села ❄️ #моємістечко #зелене',
    image: '/api/storage/site/photo-1486325212027-8081e485255e.jpg',
    likes: 234,
    comments: 18,
    created_at: '2024-12-09',
    url: '#'
  },
  {
    id: '3',
    platform: 'facebook',
    content: 'Нагадуємо про завтрашнє відключення електроенергії. Перевірте список адрес на сайті.',
    likes: 89,
    comments: 45,
    created_at: '2024-12-11',
    url: '#'
  },
  {
    id: '4',
    platform: 'instagram',
    content: 'Сонячний захід у мікрорайоні Сонячний 🌅 #сонячний #моємістечко',
    image: '/api/storage/site/photo-1495616811223-4d98c6e9c869.jpg',
    likes: 312,
    comments: 27,
    created_at: '2024-12-08',
    url: '#'
  }
];

export const announcementCategories = {
  work: { label: 'Робота', color: 'bg-blue-100 text-blue-800' },
  realty: { label: 'Нерухомість', color: 'bg-green-100 text-green-800' },
  auto: { label: 'Авто', color: 'bg-orange-100 text-orange-800' },
  services: { label: 'Послуги', color: 'bg-purple-100 text-purple-800' },
  lostfound: { label: 'Знайшов/Загубив', color: 'bg-red-100 text-red-800' },
  other: { label: 'Інше', color: 'bg-gray-100 text-gray-800' }
};
