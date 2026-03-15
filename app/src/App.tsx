import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { 
  HomePage, 
  RadaPage, 
  NewsPage, 
  AnnouncementsPage, 
  MarketplacePage, 
  ForumPage, 
  MapPage, 
  ContactsPage 
} from '@/pages';
import { AdminLoginPage, AdminDashboard } from '@/pages/admin';
import './App.css';

// Main layout with header and footer
function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

// Admin layout without header/footer
function AdminLayout() {
  return <Outlet />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/rada1" element={<RadaPage rada="rada1" />} />
          <Route path="/rada2" element={<RadaPage rada="rada2" />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/announcements" element={<AnnouncementsPage />} />
          <Route path="/marketplace" element={<MarketplacePage />} />
          <Route path="/forum" element={<ForumPage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/contacts" element={<ContactsPage />} />
        </Route>

        {/* Admin routes */}
        <Route element={<AdminLayout />}>
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/news" element={<AdminDashboard />} />
          <Route path="/admin/announcements" element={<AdminDashboard />} />
          <Route path="/admin/documents" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminDashboard />} />
          <Route path="/admin/settings" element={<AdminDashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
