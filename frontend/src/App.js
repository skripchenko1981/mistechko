import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Outlet, Navigate } from 'react-router-dom';
import { Header, Footer } from './components/layout';
import { 
  HomePage, 
  NewsPage, 
  AnnouncementsPage,
  RadaPage,
  MapPage,
  ContactsPage,
  MarketplacePage,
  MarketplaceProductPage,
  ForumPage,
  ForumTopicPage,
  LoginPage,
  RegisterPage
} from './pages';
import { useAuthStore } from './stores';
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

// Protected Route wrapper
function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuthStore();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#1e3a5f] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

function AppRouter() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <Routes>
      {/* Public routes with layout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/announcements" element={<AnnouncementsPage />} />
        <Route path="/marketplace" element={<MarketplacePage />} />
        <Route path="/marketplace/:productId" element={<MarketplaceProductPage />} />
        <Route path="/forum" element={<ForumPage />} />
        <Route path="/forum/:topicId" element={<ForumTopicPage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/contacts" element={<ContactsPage />} />
        <Route path="/rada/:radaId" element={<RadaPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  );
}

export default App;
