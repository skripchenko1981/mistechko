# Технічна специфікація — Моє Містечко

## 1. Архітектура проєкту

### 1.1 Структура файлів

```
/mnt/okcomputer/output/app/
├── public/
│   ├── images/
│   │   ├── hero/
│   │   ├── news/
│   │   ├── deputies/
│   │   └── icons/
│   └── data/
├── src/
│   ├── components/
│   │   ├── ui/           # shadcn/ui компоненти
│   │   ├── common/       # Спільні компоненти
│   │   ├── layout/       # Layout компоненти
│   │   ├── news/         # Компоненти новин
│   │   ├── weather/      # Компоненти погоди
│   │   ├── map/          # Компоненти мапи
│   │   └── admin/        # Компоненти адмінки
│   ├── hooks/            # Custom React hooks
│   ├── stores/           # Zustand stores
│   ├── types/            # TypeScript types
│   ├── data/             # Mock дані
│   ├── lib/              # Утиліти
│   ├── pages/            # Сторінки
│   └── App.tsx           # Головний компонент
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

### 1.2 Технологічний стек

**Frontend:**
- React 18 + TypeScript
- Vite (збірка)
- Tailwind CSS 3.4
- shadcn/ui компоненти
- React Router DOM
- Zustand (стан)
- React Query (кешування)
- React Hook Form + Zod
- Framer Motion (анімації)
- Leaflet (мапа)
- Recharts (графіки)

**Іконки:**
- Lucide React

**Шрифти:**
- Montserrat (Google Fonts)
- Open Sans (Google Fonts)

---

## 2. Компоненти

### 2.1 UI Компоненти (shadcn/ui)

**Вже встановлені:**
- Button, Card, Input, Label
- Tabs, Dialog, DropdownMenu
- Select, Checkbox, RadioGroup
- Textarea, Avatar, Badge
- Skeleton, Toast, Alert
- Table, Pagination
- Sheet, ScrollArea
- Separator, Switch
- Accordion, Collapsible
- Calendar, Popover
- Command, NavigationMenu

### 2.2 Кастомні компоненти

**Layout:**
- `Header` — шапка з навігацією, погодою
- `Footer` — підвал з контактами
- `Sidebar` — бічне меню для адмінки
- `MobileNav` — мобільна навігація

**Common:**
- `SectionTitle` — заголовок секції
- `NewsCard` — картка новини
- `AnnouncementCard` — картка оголошення
- `ProductCard` — картка товару
- `DeputyCard` — картка депутата
- `WeatherWidget` — віджет погоди
- `SocialFeed` — стрічка соцмереж
- `MapComponent` — інтерактивна мапа

**Admin:**
- `DataTable` — таблиця даних
- `StatCard` — картка статистики
- `ChartComponent` — графіки

---

## 3. Сторінки

### 3.1 Публічні сторінки

| Сторінка | URL | Опис |
|----------|-----|------|
| Головна | `/` | Landing page |
| Рада №1 | `/rada1` | Сторінка першої ради |
| Рада №2 | `/rada2` | Сторінка другої ради |
| Новини | `/news` | Всі новини |
| Новина | `/news/:id` | Детальна новина |
| Оголошення | `/announcements` | Всі оголошення |
| Маркетплейс | `/marketplace` | Магазин |
| Форум | `/forum` | Обговорення |
| Мапа | `/map` | Інтерактивна мапа |
| Контакти | `/contacts` | Контакти рад |

### 3.2 Адмін сторінки

| Сторінка | URL | Опис |
|----------|-----|------|
| Login | `/admin/login` | Вхід |
| Dashboard | `/admin` | Панель керування |
| News | `/admin/news` | Управління новинами |
| Announcements | `/admin/announcements` | Управління оголошеннями |
| Documents | `/admin/documents` | Документи |
| Users | `/admin/users` | Користувачі |
| Settings | `/admin/settings` | Налаштування |

---

## 4. Стан додатку (Zustand)

### 4.1 Stores

**authStore:**
- user: User | null
- isAuthenticated: boolean
- login(), logout()

**newsStore:**
- news: NewsItem[]
- selectedRada: 'all' | 'rada1' | 'rada2'
- filterNews(), addNews(), updateNews(), deleteNews()

**weatherStore:**
- currentWeather: WeatherData
- forecast: WeatherData[]
- selectedLocation: string
- fetchWeather()

**uiStore:**
- theme: 'light' | 'dark'
- sidebarOpen: boolean
- toggleTheme(), toggleSidebar()

---

## 5. Типи даних

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  role: 'superadmin' | 'admin' | 'moderator' | 'user';
  rada?: 'rada1' | 'rada2';
  avatar?: string;
}

interface NewsItem {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  image: string;
  category: string;
  rada: 'all' | 'rada1' | 'rada2';
  author: string;
  createdAt: Date;
  views: number;
}

interface Announcement {
  id: string;
  title: string;
  description: string;
  category: string;
  rada: 'rada1' | 'rada2';
  isUrgent: boolean;
  price?: number;
  contactInfo: string;
  createdAt: Date;
  expiresAt: Date;
}

interface Deputy {
  id: string;
  name: string;
  position: string;
  photo: string;
  phone: string;
  email: string;
  biography: string;
  rada: 'rada1' | 'rada2';
}

interface WeatherData {
  location: string;
  temperature: number;
  feelsLike: number;
  condition: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  pressure: number;
  uvIndex: number;
  sunrise: string;
  sunset: string;
}

interface Document {
  id: string;
  title: string;
  type: 'decision' | 'protocol' | 'order';
  rada: 'rada1' | 'rada2';
  fileUrl: string;
  date: Date;
  description: string;
}

interface MapPoint {
  id: string;
  name: string;
  type: 'medicine' | 'education' | 'trade' | 'transport';
  coordinates: [number, number];
  address: string;
  phone?: string;
  description?: string;
}
```

---

## 6. Mock дані

Для демонстрації створимо:
- 10+ новин (змішані ради)
- 15+ оголошень (різні категорії)
- 8+ депутатів (по 4 на кожну раду)
- 5+ документів
- 10+ точок на мапі
- Погодні дані (мок)

---

## 7. Анімації

### 7.1 Framer Motion конфігурація

```typescript
// Fade In Up
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] }
};

// Stagger Container
const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

// Scale In
const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.5 }
};
```

---

## 8. Маршрутизація

```typescript
const routes = [
  { path: '/', element: <HomePage /> },
  { path: '/rada1', element: <RadaPage rada="rada1" /> },
  { path: '/rada2', element: <RadaPage rada="rada2" /> },
  { path: '/news', element: <NewsPage /> },
  { path: '/news/:id', element: <NewsDetailPage /> },
  { path: '/announcements', element: <AnnouncementsPage /> },
  { path: '/marketplace', element: <MarketplacePage /> },
  { path: '/forum', element: <ForumPage /> },
  { path: '/map', element: <MapPage /> },
  { path: '/contacts', element: <ContactsPage /> },
  { path: '/admin/login', element: <AdminLoginPage /> },
  { path: '/admin', element: <AdminDashboard /> },
  { path: '/admin/news', element: <AdminNewsPage /> },
  { path: '/admin/announcements', element: <AdminAnnouncementsPage /> },
  { path: '/admin/documents', element: <AdminDocumentsPage /> },
  { path: '/admin/users', element: <AdminUsersPage /> },
  { path: '/admin/settings', element: <AdminSettingsPage /> },
];
```

---

## 9. Інтеграції

### 9.1 Погода (OpenWeatherMap API)
- GET `/data/2.5/weather` — поточна погода
- GET `/data/2.5/forecast` — прогноз

### 9.2 Соціальні мережі
- Facebook Graph API (сторінка громади)
- Instagram Basic Display API

### 9.3 Мапа
- Leaflet + OpenStreetMap

---

## 10. Безпека

- JWT автентифікація
- Ролевий доступ (RBAC)
- Валідація форм (Zod)
- XSS захист
- CSRF токени
