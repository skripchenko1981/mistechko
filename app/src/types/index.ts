export interface User {
  id: string;
  name: string;
  email: string;
  role: 'superadmin' | 'admin' | 'moderator' | 'user';
  rada?: 'rada1' | 'rada2';
  avatar?: string;
}

export interface NewsItem {
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

export interface Announcement {
  id: string;
  title: string;
  description: string;
  category: 'work' | 'realty' | 'auto' | 'services' | 'lostfound' | 'other';
  rada: 'rada1' | 'rada2';
  isUrgent: boolean;
  price?: number;
  contactInfo: string;
  createdAt: Date;
  expiresAt: Date;
  image?: string;
}

export interface Deputy {
  id: string;
  name: string;
  position: string;
  photo: string;
  phone: string;
  email: string;
  biography: string;
  rada: 'rada1' | 'rada2';
}

export interface WeatherData {
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

export interface WeatherForecast {
  date: string;
  dayOfWeek: string;
  high: number;
  low: number;
  condition: string;
  icon: string;
  precipitation: number;
}

export interface Document {
  id: string;
  title: string;
  type: 'decision' | 'protocol' | 'order';
  rada: 'rada1' | 'rada2';
  fileUrl: string;
  date: Date;
  description: string;
  number: string;
}

export interface MapPoint {
  id: string;
  name: string;
  type: 'medicine' | 'education' | 'trade' | 'transport' | 'admin' | 'other';
  coordinates: [number, number];
  address: string;
  phone?: string;
  description?: string;
  rada: 'rada1' | 'rada2';
}

export interface ForumTopic {
  id: string;
  title: string;
  category: string;
  author: string;
  replies: number;
  views: number;
  lastReply: Date;
  isPinned: boolean;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  seller: string;
  rating: number;
  reviews: number;
  category: string;
  rada: 'rada1' | 'rada2';
  createdAt: Date;
}

export interface RadaInfo {
  id: string;
  name: string;
  shortName: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  workingHours: string;
  receptionHours: string;
  headName: string;
  headPosition: string;
  headPhoto: string;
  heroImage: string;
  population: number;
  area: string;
  foundedYear: number;
}

export interface SocialPost {
  id: string;
  platform: 'facebook' | 'instagram';
  content: string;
  image?: string;
  likes: number;
  comments: number;
  createdAt: Date;
  url: string;
}

export interface StatisticData {
  label: string;
  value: number;
  change: number;
  icon: string;
}
