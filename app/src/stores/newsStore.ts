import { create } from 'zustand';
import type { NewsItem } from '@/types';
import { newsData } from '@/data/mockData';

interface NewsState {
  news: NewsItem[];
  selectedRada: 'all' | 'rada1' | 'rada2';
  setSelectedRada: (rada: 'all' | 'rada1' | 'rada2') => void;
  getFilteredNews: () => NewsItem[];
  addNews: (item: NewsItem) => void;
  updateNews: (id: string, item: Partial<NewsItem>) => void;
  deleteNews: (id: string) => void;
  getNewsById: (id: string) => NewsItem | undefined;
}

export const useNewsStore = create<NewsState>((set, get) => ({
  news: newsData,
  selectedRada: 'all',
  setSelectedRada: (rada) => set({ selectedRada: rada }),
  getFilteredNews: () => {
    const { news, selectedRada } = get();
    if (selectedRada === 'all') return news;
    return news.filter(item => item.rada === selectedRada || item.rada === 'all');
  },
  addNews: (item) => set((state) => ({ news: [item, ...state.news] })),
  updateNews: (id, item) => set((state) => ({
    news: state.news.map(n => n.id === id ? { ...n, ...item } : n)
  })),
  deleteNews: (id) => set((state) => ({
    news: state.news.filter(n => n.id !== id)
  })),
  getNewsById: (id) => get().news.find(n => n.id === id),
}));
