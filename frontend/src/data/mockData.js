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
    name: 'Амбулаторія с. Зелене',
    type: 'medicine',
    coordinates: [48.9228, 24.7111],
    address: 'вул. Центральна, 23, с. Зелене',
    phone: '+38 (0312) 45-67-12',
    description: 'Пн-Пт: 8:00-18:00, Сб: 9:00-14:00',
    rada: 'rada1'
  },
  {
    id: '2',
    name: 'Школа №1 с. Зелене',
    type: 'education',
    coordinates: [48.9245, 24.7135],
    address: 'вул. Шкільна, 5, с. Зелене',
    phone: '+38 (0312) 45-67-23',
    description: 'Загальноосвітня школа I-III ступенів',
    rada: 'rada1'
  },
  {
    id: '3',
    name: 'Сільська рада',
    type: 'admin',
    coordinates: [48.9235, 24.7120],
    address: 'вул. Центральна, 45, с. Зелене',
    phone: '+38 (0312) 45-67-89',
    description: 'Прийом громадян: Вт, Чт',
    rada: 'rada1'
  },
  {
    id: '5',
    name: 'Медичний пункт Сонячний',
    type: 'medicine',
    coordinates: [48.9350, 24.7250],
    address: 'просп. Сонячний, 8, мікрорайон Сонячний',
    phone: '+38 (0312) 56-78-12',
    description: 'Пн-Пт: 8:00-16:00',
    rada: 'rada2'
  },
  {
    id: '6',
    name: 'Школа №3',
    type: 'education',
    coordinates: [48.9365, 24.7275],
    address: 'вул. Освітня, 3, мікрорайон Сонячний',
    phone: '+38 (0312) 56-78-23',
    description: 'Загальноосвітня школа I-III ступенів',
    rada: 'rada2'
  },
  {
    id: '7',
    name: 'Рада мікрорайону',
    type: 'admin',
    coordinates: [48.9355, 24.7260],
    address: 'просп. Сонячний, 12, мікрорайон Сонячний',
    phone: '+38 (0312) 56-78-90',
    description: 'Прийом громадян: Пн, Ср',
    rada: 'rada2'
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
