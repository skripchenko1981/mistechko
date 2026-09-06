import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, UserPlus, Building2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useAuthStore } from '../stores';

export function LoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Помилка входу');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-gray-50" data-testid="login-page">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-[#1e3a5f] rounded-xl flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-2xl">Вхід</CardTitle>
            <CardDescription>
              Увійдіть до порталу громади "Моє Містечко"
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm" data-testid="login-error">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  data-testid="login-email-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Пароль</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  data-testid="login-password-input"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-[#1e3a5f] hover:bg-[#2c5282]"
                disabled={isLoading}
                data-testid="login-submit-btn"
              >
                <LogIn className="w-4 h-4 mr-2" />
                {isLoading ? 'Завантаження...' : 'Увійти'}
              </Button>

              <p className="text-center text-sm text-gray-600 mt-4">
                Немає акаунту?{' '}
                <Link to="/register" className="text-[#e67e22] hover:underline font-medium">
                  Зареєструватися
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export function RegisterPage() {
  const navigate = useNavigate();
  const { register, isAuthenticated } = useAuthStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rada, setRada] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await register(email, password, name, rada || null);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Помилка реєстрації');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-gray-50" data-testid="register-page">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-[#27ae60] rounded-xl flex items-center justify-center mx-auto mb-4">
              <UserPlus className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-2xl">Реєстрація</CardTitle>
            <CardDescription>
              Приєднайтесь до громади "Моє Містечко"
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm" data-testid="register-error">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="name">Ім'я</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Ваше ім'я"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  data-testid="register-name-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  data-testid="register-email-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Пароль</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  data-testid="register-password-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rada">Рада (необов'язково)</Label>
                <select
                  id="rada"
                  value={rada}
                  onChange={(e) => setRada(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  data-testid="register-rada-select"
                >
                  <option value="">Не вказано</option>
                  <option value="rada1">Рада №1 (с. Зелене)</option>
                  <option value="rada2">Рада №2 (мікрорайон Сонячний)</option>
                </select>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-[#27ae60] hover:bg-[#1e8449]"
                disabled={isLoading}
                data-testid="register-submit-btn"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                {isLoading ? 'Завантаження...' : 'Зареєструватися'}
              </Button>

              <p className="text-center text-sm text-gray-600 mt-4">
                Вже маєте акаунт?{' '}
                <Link to="/login" className="text-[#e67e22] hover:underline font-medium">
                  Увійти
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
