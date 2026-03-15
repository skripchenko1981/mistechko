import type { 
  NewsItem, 
  Announcement, 
  Deputy, 
  WeatherData, 
  WeatherForecast,
  Document, 
  MapPoint, 
  ForumTopic, 
  Product, 
  RadaInfo,
  SocialPost,
  User
} from '@/types';

export const rada1Info: RadaInfo = {
  id: 'rada1',
  name: 'Сільська рада села Зелене',
  shortName: 'Рада №1',
  description: 'Село Зелене — мальовничий куточок нашої громади з багатою історією та привітними жителями. Тут поєднуються традиції та сучасність.',
  address: 'вул. Центральна, 45, с. Зелене',
  phone: '+38 (0312) 45-67-89',
  email: 'rada1@moemistecheko.ua',
  workingHours: 'Пн-Пт: 8:00 - 17:00',
  receptionHours: 'Вт: 10:00 - 14:00, Чт: 14:00 - 18:00',
  headName: 'Іван Петрович Коваленко',
  headPosition: 'Сільський голова',
  headPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
  heroImage: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&h=600&fit=crop',
  population: 3240,
  area: '18.5 км²',
  foundedYear: 1587
};

export const rada2Info: RadaInfo = {
  id: 'rada2',
  name: 'Міська рада мікрорайону Сонячний',
  shortName: 'Рада №2',
  description: 'Мікрорайон Сонячний — сучасний житловий масив з розвиненою інфраструктурою, де комфорт поєднується з природою.',
  address: 'просп. Сонячний, 12, мікрорайон Сонячний',
  phone: '+38 (0312) 56-78-90',
  email: 'rada2@moemistecheko.ua',
  workingHours: 'Пн-Пт: 8:00 - 17:00',
  receptionHours: 'Пн: 10:00 - 14:00, Ср: 14:00 - 18:00',
  headName: 'Марія Олександрівна Шевченко',
  headPosition: 'Голова ради',
  headPhoto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face',
  heroImage: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?w=1200&h=600&fit=crop',
  population: 5680,
  area: '12.3 км²',
  foundedYear: 1985
};

export const newsData: NewsItem[] = [
  {
    id: '1',
    title: 'Відкриття нового дитячого майданчика у селі Зелене',
    content: 'Сьогодні у селі Зелене відбулося урочисте відкриття сучасного дитячого майданчика. На спорудження об\'єкту з міського бюджету було виділено 450 тисяч гривень.\n\nНа новому майданчику встановлені безпечні гойдалки, гірки, пісочниця та спортивні елементи. Також облаштовано лавочки для батьків та освітлення для вечірніх прогулянок.\n\nСільський голова Іван Коваленко подякував мешканцям за активну участь у обговоренні проєкту та обіцяв продовжувати розвиток інфраструктури.',
    excerpt: 'Сучасний дитячий майданчик відкрився у селі Зелене. На спорудження виділено 450 тис. грн.',
    image: 'https://images.unsplash.com/photo-1566140967404-b8b3932483f5?w=800&h=500&fit=crop',
    category: 'Інфраструктура',
    rada: 'rada1',
    author: 'Прес-служба Ради №1',
    createdAt: new Date('2024-12-10'),
    views: 245
  },
  {
    id: '2',
    title: 'У мікрорайоні Сонячний запрацював новий медичний пункт',
    content: 'З початку грудня у мікрорайоні Сонячний розпочав роботу оновлений медичний пункт. Тепер жителі мають доступ до якісної первинної медичної допомоги без необхідності їздити до центру міста.\n\nУ медпункті проводять прийом сімейний лікар та медсестра. Також доступні послуги з взяття аналізів та базової діагностики. Графік роботи: понеділок-п\'ятниця з 8:00 до 16:00.',
    excerpt: 'Оновлений медичний пункт тепер приймає жителів мікрорайону Сонячний. Графік: Пн-Пт, 8:00-16:00.',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&h=500&fit=crop',
    category: 'Медицина',
    rada: 'rada2',
    author: 'Прес-служба Ради №2',
    createdAt: new Date('2024-12-08'),
    views: 189
  },
  {
    id: '3',
    title: 'Сесія ОТГ: затверджено бюджет на 2025 рік',
    content: 'На черговій сесії об\'єднаної територіальної громади було затверджено бюджет на 2025 рік. Основні напрямки фінансування:\n\n- Освіта: 35%\n- Медицина: 25%\n- Інфраструктура: 20%\n- Соціальний захист: 12%\n- Культура та спорт: 8%\n\nТакож було прийнято ряд рішень щодо розвитку громади та покращення якості життя мешканців.',
    excerpt: 'Затверджено бюджет ОТГ на 2025 рік. Пріоритетні галузі: освіта, медицина, інфраструктура.',
    image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&h=500&fit=crop',
    category: 'Офіційно',
    rada: 'all',
    author: 'Секретар ради',
    createdAt: new Date('2024-12-05'),
    views: 412
  },
  {
    id: '4',
    title: 'Ремонт дороги Зелене — Сонячний завершено',
    content: 'Завершено капітальний ремонт дороги, що з\'єднує село Зелене та мікрорайон Сонячний. Роботи тривали протягом трьох місяців.\n\nУ рамках проєкту було виконано:\n- Повну заміну асфальтного покриття (4.5 км)\n- Встановлення нових дорожніх знаків\n- Облаштування тротуарів\n- Встановлення освітлення\n\nТепер дорога відповідає всім сучасним стандартам безпеки.',
    excerpt: 'Капітальний ремонт дороги завершено. Замінено 4.5 км покриття, встановлено освітлення.',
    image: 'https://images.unsplash.com/photo-1519817914152-22d216bb9170?w=800&h=500&fit=crop',
    category: 'Інфраструктура',
    rada: 'all',
    author: 'Відділ ЖКГ',
    createdAt: new Date('2024-12-01'),
    views: 356
  },
  {
    id: '5',
    title: 'Фестиваль "Зимові свята" у нашій громаді',
    content: 'Запрошуємо всіх мешканців на традиційний фестиваль "Зимові свята", який відбудеться 20 грудня на центральній площі.\n\nПрограма заходу:\n- 14:00 — Відкриття, виступ дитячих колективів\n- 15:00 — Конкурс сніговиків\n- 16:00 — Розіграш подарунків\n- 17:00 — Виступ місцевих музикантів\n- 18:00 — Запалення ялинки\n\nДля дітей працюватиме безкоштовна ковзанка та атракціони!',
    excerpt: '20 грудня — фестиваль "Зимові свята". Ялинка, конкурси, подарунки, атракціони!',
    image: 'https://images.unsplash.com/photo-1543589077-47d81606c1bf?w=800&h=500&fit=crop',
    category: 'Культура',
    rada: 'all',
    author: 'Відділ культури',
    createdAt: new Date('2024-11-28'),
    views: 523
  },
  {
    id: '6',
    title: 'Увага! Планове відключення електроенергії',
    content: 'У зв\'язку з плановими ремонтними роботами 15 грудня з 9:00 до 14:00 буде відключено електропостачання за наступними адресами:\n\nс. Зелене:\n- вул. Центральна (буд. 1-45, непарні)\n- вул. Шкільна (буд. 2-18, парні)\n- вул. Лісова (всі будинки)\n\nПросимо вибачення за тимчасові незручності.',
    excerpt: '15 грудня, 9:00-14:00 — планове відключення електроенергії у частині села Зелене.',
    image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&h=500&fit=crop',
    category: 'Оголошення',
    rada: 'rada1',
    author: 'Диспетчерська служба',
    createdAt: new Date('2024-12-12'),
    views: 178
  }
];

export const announcementsData: Announcement[] = [
  {
    id: '1',
    title: 'Продам будинок у с. Зелене',
    description: 'Продається затишний будинок 120 м² на ділянці 15 соток. Газ, вода, світло. Гарний ремонт, сад, гараж.',
    category: 'realty',
    rada: 'rada1',
    isUrgent: false,
    price: 85000,
    contactInfo: '+38 (067) 123-45-67',
    createdAt: new Date('2024-12-10'),
    expiresAt: new Date('2025-01-10'),
    image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=300&fit=crop'
  },
  {
    id: '2',
    title: 'Терміново потрібен водій',
    description: 'Підприємство шукає водія вантажівки. Категорія С, досвід від 3 років. Офіційне працевлаштування.',
    category: 'work',
    rada: 'rada2',
    isUrgent: true,
    contactInfo: '+38 (050) 987-65-43',
    createdAt: new Date('2024-12-11'),
    expiresAt: new Date('2024-12-25')
  },
  {
    id: '3',
    title: 'Знайшов кота (мікрорайон Сонячний)',
    description: 'Знайшов рудого кота на вул. Квітневій. Дуже лагідний, вихований. Шукаю власника!',
    category: 'lostfound',
    rada: 'rada2',
    isUrgent: false,
    contactInfo: '+38 (063) 111-22-33',
    createdAt: new Date('2024-12-09'),
    expiresAt: new Date('2024-12-23'),
    image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=300&fit=crop'
  },
  {
    id: '4',
    title: 'Продам Opel Astra 2015',
    description: 'Продам автомобіль у хорошому стані. Пробіг 120 тис. км. Кондиціонер, ABS, подушки безпеки.',
    category: 'auto',
    rada: 'rada1',
    isUrgent: false,
    price: 8500,
    contactInfo: '+38 (068) 444-55-66',
    createdAt: new Date('2024-12-08'),
    expiresAt: new Date('2025-01-08'),
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=300&fit=crop'
  },
  {
    id: '5',
    title: 'Послуги електрика',
    description: 'Якісний ремонт електропроводки. Встановлення розеток, вимикачів, люстр. Гарантія на роботу.',
    category: 'services',
    rada: 'rada1',
    isUrgent: false,
    contactInfo: '+38 (097) 777-88-99',
    createdAt: new Date('2024-12-07'),
    expiresAt: new Date('2025-01-07')
  },
  {
    id: '6',
    title: 'Здам квартиру подобово',
    description: 'Здається 2-кімнатна квартира у центрі мікрорайону. Wi-Fi, техніка, постіль. Від 500 грн/добу.',
    category: 'realty',
    rada: 'rada2',
    isUrgent: false,
    price: 500,
    contactInfo: '+38 (066) 333-44-55',
    createdAt: new Date('2024-12-06'),
    expiresAt: new Date('2025-01-06'),
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop'
  }
];

export const deputiesData: Deputy[] = [
  {
    id: '1',
    name: 'Іван Петрович Коваленко',
    position: 'Сільський голова',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    phone: '+38 (0312) 45-67-89',
    email: 'kovalenko@rada1.ua',
    biography: 'Народився у 1965 році в селі Зелене. Освіта вища економічна. Працює у місцевому самоврядуванні з 2010 року.',
    rada: 'rada1'
  },
  {
    id: '2',
    name: 'Ольга Михайлівна Петренко',
    position: 'Секретар ради',
    photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face',
    phone: '+38 (0312) 45-67-90',
    email: 'petrenko@rada1.ua',
    biography: 'Народилася у 1978 році. Освіта вища юридична. У місцевому самоврядуванні з 2015 року.',
    rada: 'rada1'
  },
  {
    id: '3',
    name: 'Сергій Васильович Мельник',
    position: 'Депутат, голова комісії з питань ЖКГ',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    phone: '+38 (067) 234-56-78',
    email: 'melnyk@rada1.ua',
    biography: 'Народився у 1980 році. Підприємець, активний громадський діяч.',
    rada: 'rada1'
  },
  {
    id: '4',
    name: 'Тетяна Іванівна Сидоренко',
    position: 'Депутат, голова комісії з освіти',
    photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
    phone: '+38 (068) 345-67-89',
    email: 'sydorenko@rada1.ua',
    biography: 'Народилася у 1985 році. Вчителька з 15-річним стажем.',
    rada: 'rada1'
  },
  {
    id: '5',
    name: 'Марія Олександрівна Шевченко',
    position: 'Голова ради',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face',
    phone: '+38 (0312) 56-78-90',
    email: 'shevchenko@rada2.ua',
    biography: 'Народилася у 1972 році. Освіта вища управлінська. У місцевому самоврядуванні з 2012 року.',
    rada: 'rada2'
  },
  {
    id: '6',
    name: 'Андрій Миколайович Бондаренко',
    position: 'Секретар ради',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
    phone: '+38 (0312) 56-78-91',
    email: 'bondarenko@rada2.ua',
    biography: 'Народився у 1983 році. Освіта вища економічна. Фінансист за фахом.',
    rada: 'rada2'
  },
  {
    id: '7',
    name: 'Наталія Петрівна Кравченко',
    position: 'Депутат, голова комісії з соцзахисту',
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face',
    phone: '+38 (050) 456-78-90',
    email: 'kravchenko@rada2.ua',
    biography: 'Народилася у 1979 році. Соціальний працівник з великим досвідом.',
    rada: 'rada2'
  },
  {
    id: '8',
    name: 'Віктор Ігорович Лисенко',
    position: 'Депутат, голова комісії з благоустрою',
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face',
    phone: '+38 (063) 567-89-01',
    email: 'lysenko@rada2.ua',
    biography: 'Народився у 1975 році. Інженер-будівельник, підприємець.',
    rada: 'rada2'
  }
];

export const currentWeather: WeatherData = {
  location: 'Зелене',
  temperature: 4,
  feelsLike: 1,
  condition: 'Хмарно',
  icon: 'cloud',
  humidity: 78,
  windSpeed: 12,
  pressure: 1023,
  uvIndex: 2,
  sunrise: '07:42',
  sunset: '16:18'
};

export const weatherForecast: WeatherForecast[] = [
  { date: '2024-12-14', dayOfWeek: 'Сб', high: 5, low: 0, condition: 'Хмарно', icon: 'cloud', precipitation: 10 },
  { date: '2024-12-15', dayOfWeek: 'Нд', high: 3, low: -2, condition: 'Дощ', icon: 'cloud-rain', precipitation: 80 },
  { date: '2024-12-16', dayOfWeek: 'Пн', high: 2, low: -3, condition: 'Сніг', icon: 'snowflake', precipitation: 60 },
  { date: '2024-12-17', dayOfWeek: 'Вт', high: 1, low: -4, condition: 'Сніг', icon: 'snowflake', precipitation: 40 },
  { date: '2024-12-18', dayOfWeek: 'Ср', high: 0, low: -5, condition: 'Ясно', icon: 'sun', precipitation: 5 },
  { date: '2024-12-19', dayOfWeek: 'Чт', high: 2, low: -3, condition: 'Ясно', icon: 'sun', precipitation: 0 },
  { date: '2024-12-20', dayOfWeek: 'Пт', high: 4, low: -1, condition: 'Хмарно', icon: 'cloud', precipitation: 20 }
];

export const documentsData: Document[] = [
  {
    id: '1',
    title: 'Про затвердження бюджету на 2025 рік',
    type: 'decision',
    rada: 'rada1',
    fileUrl: '#',
    date: new Date('2024-12-05'),
    description: 'Рішення сесії сільської ради про затвердження бюджету на наступний рік.',
    number: '№ 45-2024'
  },
  {
    id: '2',
    title: 'Про надання дозволу на ремонт доріг',
    type: 'decision',
    rada: 'rada1',
    fileUrl: '#',
    date: new Date('2024-11-20'),
    description: 'Рішення про виділення коштів на капітальний ремонт доріг.',
    number: '№ 42-2024'
  },
  {
    id: '3',
    title: 'Протокол сесії від 05.12.2024',
    type: 'protocol',
    rada: 'rada1',
    fileUrl: '#',
    date: new Date('2024-12-05'),
    description: 'Протокол чергової сесії сільської ради.',
    number: '№ 12'
  },
  {
    id: '4',
    title: 'Наказ про проведення ярмарку',
    type: 'order',
    rada: 'rada1',
    fileUrl: '#',
    date: new Date('2024-12-01'),
    description: 'Наказ про організацію передноворічного ярмарку.',
    number: '№ 156'
  },
  {
    id: '5',
    title: 'Про відкриття медичного пункту',
    type: 'decision',
    rada: 'rada2',
    fileUrl: '#',
    date: new Date('2024-11-15'),
    description: 'Рішення про відкриття та фінансування медичного пункту.',
    number: '№ 38-2024'
  },
  {
    id: '6',
    title: 'Протокол сесії від 15.11.2024',
    type: 'protocol',
    rada: 'rada2',
    fileUrl: '#',
    date: new Date('2024-11-15'),
    description: 'Протокол чергової сесії ради мікрорайону.',
    number: '№ 10'
  }
];

export const mapPointsData: MapPoint[] = [
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
    id: '4',
    name: 'Супермаркет "Продукти"',
    type: 'trade',
    coordinates: [48.9220, 24.7105],
    address: 'вул. Центральна, 12, с. Зелене',
    phone: '+38 (0312) 45-67-34',
    description: 'Пн-Нд: 8:00-22:00',
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
  },
  {
    id: '8',
    name: 'Торговий центр "Сонячний"',
    type: 'trade',
    coordinates: [48.9340, 24.7245],
    address: 'просп. Сонячний, 25, мікрорайон Сонячний',
    phone: '+38 (0312) 56-78-34',
    description: 'Пн-Нд: 9:00-21:00',
    rada: 'rada2'
  },
  {
    id: '9',
    name: 'Зупинка автобуса №15',
    type: 'transport',
    coordinates: [48.9230, 24.7115],
    address: 'вул. Центральна, с. Зелене',
    description: 'Маршрут: Зелене — Центр — Сонячний',
    rada: 'rada1'
  },
  {
    id: '10',
    name: 'Зупинка автобуса №15',
    type: 'transport',
    coordinates: [48.9355, 24.7265],
    address: 'просп. Сонячний, мікрорайон Сонячний',
    description: 'Маршрут: Сонячний — Центр — Зелене',
    rada: 'rada2'
  }
];

export const forumTopicsData: ForumTopic[] = [
  {
    id: '1',
    title: 'Проблеми з вивезенням сміття у селі Зелене',
    category: 'ЖКГ',
    author: 'Марія К.',
    replies: 23,
    views: 456,
    lastReply: new Date('2024-12-12'),
    isPinned: true
  },
  {
    id: '2',
    title: 'Шукаю репетитора з математики для 9 класу',
    category: 'Освіта',
    author: 'Олена П.',
    replies: 8,
    views: 189,
    lastReply: new Date('2024-12-11'),
    isPinned: false
  },
  {
    id: '3',
    title: 'Ремонт дороги Зелене-Сонячний — ваші враження',
    category: 'Інфраструктура',
    author: 'Сергій М.',
    replies: 45,
    views: 892,
    lastReply: new Date('2024-12-10'),
    isPinned: false
  },
  {
    id: '4',
    title: 'Хто знає хорошого педіатра в нашій громаді?',
    category: 'Медицина',
    author: 'Наталія В.',
    replies: 15,
    views: 334,
    lastReply: new Date('2024-12-09'),
    isPinned: false
  },
  {
    id: '5',
    title: 'Організація спільного транспорту до школи',
    category: 'Транспорт',
    author: 'Андрій Б.',
    replies: 31,
    views: 567,
    lastReply: new Date('2024-12-08'),
    isPinned: false
  }
];

export const productsData: Product[] = [
  {
    id: '1',
    name: 'Мед від місцевого пасічника',
    description: 'Натуральний квітковий мед, зібраний у екологічно чистому районі.',
    price: 250,
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=300&fit=crop',
    seller: 'Пасіка "Зелений мед"',
    rating: 4.9,
    reviews: 45,
    category: 'Продукти',
    rada: 'rada1',
    createdAt: new Date('2024-12-01')
  },
  {
    id: '2',
    name: 'Домашнє варення з малини',
    description: 'Смачне домашнє варення без консервантів. Банка 0.5 л.',
    price: 80,
    image: 'https://images.unsplash.com/photo-1568051243851-f9b136146e97?w=400&h=300&fit=crop',
    seller: 'Господиня Олена',
    rating: 5.0,
    reviews: 23,
    category: 'Продукти',
    rada: 'rada2',
    createdAt: new Date('2024-12-05')
  },
  {
    id: '3',
    name: 'Ремонт пральних машин',
    description: 'Якісний ремонт пральних машин на дому. Гарантія 6 місяців.',
    price: 400,
    image: 'https://images.unsplash.com/photo-1626806819282-2c1dc01a5e0c?w=400&h=300&fit=crop',
    seller: 'Майстер Віктор',
    rating: 4.7,
    reviews: 67,
    category: 'Послуги',
    rada: 'rada1',
    createdAt: new Date('2024-11-28')
  },
  {
    id: '4',
    name: 'В\'язані шкарпетки ручної роботи',
    description: 'Теплі в\'язані шкарпетки з натуральної вовни. Різні кольори.',
    price: 120,
    image: 'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=400&h=300&fit=crop',
    seller: 'Майстерня "Тепло"',
    rating: 4.8,
    reviews: 34,
    category: 'Ремесла',
    rada: 'rada2',
    createdAt: new Date('2024-12-08')
  }
];

export const socialPostsData: SocialPost[] = [
  {
    id: '1',
    platform: 'facebook',
    content: 'Сьогодні відкрили новий дитячий майданчик! Дякуємо всім, хто долучився до реалізації проєкту.',
    image: 'https://images.unsplash.com/photo-1566140967404-b8b3932483f5?w=400&h=300&fit=crop',
    likes: 156,
    comments: 23,
    createdAt: new Date('2024-12-10'),
    url: '#'
  },
  {
    id: '2',
    platform: 'instagram',
    content: 'Зимова краса нашого села ❄️ #моємістечко #зелене',
    image: 'https://images.unsplash.com/photo-1483664852095-d6cc6870705d?w=400&h=400&fit=crop',
    likes: 234,
    comments: 18,
    createdAt: new Date('2024-12-09'),
    url: '#'
  },
  {
    id: '3',
    platform: 'facebook',
    content: 'Нагадуємо про завтрашнє відключення електроенергії. Перевірте список адрес на сайті.',
    likes: 89,
    comments: 45,
    createdAt: new Date('2024-12-11'),
    url: '#'
  },
  {
    id: '4',
    platform: 'instagram',
    content: 'Сонячний захід у мікрорайоні Сонячний 🌅 #сонячний #моємістечко',
    image: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=400&h=400&fit=crop',
    likes: 312,
    comments: 27,
    createdAt: new Date('2024-12-08'),
    url: '#'
  }
];

export const adminUsers: User[] = [
  {
    id: '1',
    name: 'Супер Адмін',
    email: 'admin@moemistecheko.ua',
    role: 'superadmin',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face'
  },
  {
    id: '2',
    name: 'Секретар Ради №1',
    email: 'secretary1@rada1.ua',
    role: 'admin',
    rada: 'rada1',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face'
  },
  {
    id: '3',
    name: 'Секретар Ради №2',
    email: 'secretary2@rada2.ua',
    role: 'admin',
    rada: 'rada2',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face'
  },
  {
    id: '4',
    name: 'Модератор Петро',
    email: 'moderator@moemistecheko.ua',
    role: 'moderator',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
  }
];
