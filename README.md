# 🏘️ Моє Містечко - Портал ОТГ

<div align="center">

![Моє Містечко](https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&h=400&fit=crop)

**Комплексний веб-портал для об'єднаної територіальної громади**

[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.0-47A248?logo=mongodb)](https://www.mongodb.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker)](https://www.docker.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

[Демо](#демо) • [Функціонал](#-функціонал) • [Встановлення](#-встановлення) • [Docker](#-docker-розгортання) • [API](#-api-документація)

</div>

---

## 📋 Про проект

**Моє Містечко** — це сучасний веб-портал для об'єднаної територіальної громади, який об'єднує жителів двох населених пунктів:
- 🏡 **Рада №1** — Село Зелене (3,240 жителів)
- 🏢 **Рада №2** — Мікрорайон Сонячний (5,680 жителів)

### Дизайн
- **Основний колір**: `#1e3a5f` (темно-синій — стабільність)
- **Акцентний**: `#e67e22` (помаранчевий — енергія)
- **Допоміжний**: `#27ae60` (зелений — зростання)
- **Шрифти**: Montserrat (заголовки) + Open Sans (текст)

---

## ✨ Функціонал

### Публічна частина
- 📰 **Новини** — Стрічка новин з фільтрацією за радами та категоріями
- 📢 **Оголошення** — Дошка оголошень громадян (робота, нерухомість, авто, послуги)
- 🛒 **Маркетплейс** — Товари та послуги місцевих підприємців
- 💬 **Форум** — Тематичні обговорення (ЖКГ, освіта, медицина, транспорт)
- 🗺️ **Інтерактивна мапа** — Об'єкти інфраструктури на карті (Leaflet)
- ☁️ **Погода** — Віджет погоди для обох населених пунктів
- 📱 **Соціальні мережі** — Інтеграція з Facebook та Instagram

### Авторизація
- 🔐 JWT автентифікація (email/пароль)
- 🔑 Google OAuth (Emergent Auth)
- 👥 Рівні доступу: superadmin, admin, moderator, user

### Для кожної ради
- Власна стрічка новин
- Офіційні оголошення
- Документи та рішення сесій
- Контакти керівництва та депутатів
- Графік прийому громадян

---

## 🛠️ Технології

| Компонент | Технологія |
|-----------|------------|
| **Frontend** | React 19, Tailwind CSS, Framer Motion, Leaflet, Zustand |
| **Backend** | FastAPI (Python 3.11), Pydantic v2 |
| **База даних** | MongoDB 7.0 |
| **Авторизація** | JWT, Google OAuth |
| **Контейнеризація** | Docker, Docker Compose |
| **Веб-сервер** | Nginx (production) |

---

## 🚀 Встановлення

### Вимоги
- Node.js 18+ та Yarn
- Python 3.11+
- MongoDB 7.0+
- Docker та Docker Compose (для контейнеризації)

### Локальна розробка (без Docker)

#### 1. Клонування репозиторію
```bash
git clone https://github.com/your-username/moe-mistechko.git
cd moe-mistechko
```

#### 2. Налаштування Backend
```bash
cd backend

# Створіть віртуальне середовище
python -m venv venv
source venv/bin/activate  # Linux/Mac
# або
venv\Scripts\activate  # Windows

# Встановіть залежності
pip install -r requirements.txt

# Створіть .env файл
cp .env.example .env
# Відредагуйте .env та встановіть MONGO_URL

# Запустіть сервер
uvicorn server:app --reload --port 8001
```

#### 3. Налаштування Frontend
```bash
cd frontend

# Встановіть залежності
yarn install

# Створіть .env файл
cp .env.example .env
# Встановіть REACT_APP_BACKEND_URL=http://localhost:8001

# Запустіть development сервер
yarn start
```

#### 4. MongoDB
```bash
# Встановіть MongoDB локально або використайте Docker:
docker run -d -p 27017:27017 --name mongodb mongo:7.0
```

---

## 🐳 Docker розгортання

### Швидкий старт (Production)

```bash
# 1. Клонуйте репозиторій
git clone https://github.com/your-username/moe-mistechko.git
cd moe-mistechko

# 2. Створіть .env файл для production
echo "JWT_SECRET=$(openssl rand -hex 32)" > .env

# 3. Запустіть всі сервіси
docker-compose up -d

# 4. Перевірте статус
docker-compose ps

# 5. Відкрийте у браузері
# http://localhost
```

### Development режим (з hot reload)

```bash
# Запуск з hot reload для розробки
docker-compose -f docker-compose.dev.yml up -d

# Frontend буде доступний на http://localhost:3000
# Backend API на http://localhost:8001
```

### Docker команди

```bash
# Перегляд логів
docker-compose logs -f

# Логи конкретного сервісу
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb

# Перезапуск сервісів
docker-compose restart

# Зупинка
docker-compose down

# Зупинка з видаленням volumes (БД буде очищена!)
docker-compose down -v

# Перебудова образів
docker-compose build --no-cache
docker-compose up -d
```

### Docker структура

```
moe-mistechko/
├── docker-compose.yml          # Production конфігурація
├── docker-compose.dev.yml      # Development конфігурація
├── backend/
│   ├── Dockerfile              # Production образ
│   ├── Dockerfile.dev          # Development образ
│   └── .dockerignore
├── frontend/
│   ├── Dockerfile              # Production образ (multi-stage)
│   ├── Dockerfile.dev          # Development образ
│   ├── nginx.conf              # Nginx конфігурація
│   └── .dockerignore
└── .env                        # Змінні середовища
```

---

## ☁️ Розгортання на сервері

### Варіант 1: VPS/Dedicated Server

```bash
# 1. Підключіться до сервера
ssh user@your-server.com

# 2. Встановіть Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER

# 3. Встановіть Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 4. Клонуйте проект
git clone https://github.com/your-username/moe-mistechko.git
cd moe-mistechko

# 5. Налаштуйте змінні середовища
cp .env.example .env
nano .env  # Відредагуйте JWT_SECRET та інші налаштування

# 6. Запустіть
docker-compose up -d
```

### Варіант 2: З HTTPS (Let's Encrypt)

Створіть файл `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  nginx-proxy:
    image: nginxproxy/nginx-proxy
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /var/run/docker.sock:/tmp/docker.sock:ro
      - certs:/etc/nginx/certs
      - vhost:/etc/nginx/vhost.d
      - html:/usr/share/nginx/html
    
  acme-companion:
    image: nginxproxy/acme-companion
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - certs:/etc/nginx/certs
      - vhost:/etc/nginx/vhost.d
      - html:/usr/share/nginx/html
      - acme:/etc/acme.sh
    environment:
      - DEFAULT_EMAIL=your-email@example.com
      - NGINX_PROXY_CONTAINER=nginx-proxy

  frontend:
    build: ./frontend
    environment:
      - VIRTUAL_HOST=moemistechko.ua
      - LETSENCRYPT_HOST=moemistechko.ua
    depends_on:
      - backend

  backend:
    build: ./backend
    environment:
      - MONGO_URL=mongodb://mongodb:27017
      - DB_NAME=moe_mistechko
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - mongodb

  mongodb:
    image: mongo:7.0
    volumes:
      - mongodb_data:/data/db

volumes:
  mongodb_data:
  certs:
  vhost:
  html:
  acme:
```

---

## 📚 API Документація

### Base URL
- Development: `http://localhost:8001`
- Production: `https://your-domain.com`

### Endpoints

#### Публічні

| Метод | Endpoint | Опис |
|-------|----------|------|
| GET | `/api/health` | Перевірка статусу |
| GET | `/api/news` | Список новин |
| GET | `/api/news/{id}` | Окрема новина |
| GET | `/api/announcements` | Оголошення |
| GET | `/api/radas` | Інформація про ради |
| GET | `/api/deputies` | Депутати |
| GET | `/api/documents` | Документи |
| GET | `/api/forum/topics` | Теми форуму |
| GET | `/api/products` | Маркетплейс |

#### Авторизація

| Метод | Endpoint | Опис |
|-------|----------|------|
| POST | `/api/auth/register` | Реєстрація |
| POST | `/api/auth/login` | Вхід |
| POST | `/api/auth/google/session` | Google OAuth |
| GET | `/api/auth/me` | Поточний користувач |
| POST | `/api/auth/logout` | Вихід |

#### Приклади запитів

```bash
# Перевірка здоров'я
curl http://localhost:8001/api/health

# Отримати новини
curl http://localhost:8001/api/news

# Фільтрація за радою
curl "http://localhost:8001/api/news?rada=rada1"

# Авторизація
curl -X POST http://localhost:8001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@moemistechko.ua","password":"admin123"}'
```

### Swagger документація
Доступна за адресою: `http://localhost:8001/docs`

---

## 👤 Тестові облікові записи

| Роль | Email | Пароль |
|------|-------|--------|
| Super Admin | admin@moemistechko.ua | admin123 |

---

## 📁 Структура проекту

```
moe-mistechko/
├── backend/                    # FastAPI Backend
│   ├── server.py              # Головний файл API
│   ├── requirements.txt       # Python залежності
│   ├── Dockerfile             # Production образ
│   ├── Dockerfile.dev         # Development образ
│   ├── .env.example           # Приклад змінних
│   └── .dockerignore
│
├── frontend/                   # React Frontend
│   ├── src/
│   │   ├── components/        # React компоненти
│   │   │   ├── common/        # Спільні компоненти
│   │   │   ├── layout/        # Header, Footer
│   │   │   ├── map/           # Leaflet мапа
│   │   │   ├── weather/       # Погодний віджет
│   │   │   └── ui/            # UI компоненти (shadcn)
│   │   ├── pages/             # Сторінки
│   │   ├── stores/            # Zustand stores
│   │   ├── data/              # Mock дані
│   │   ├── types/             # TypeScript типи
│   │   ├── App.js             # Головний компонент
│   │   └── index.js           # Entry point
│   ├── public/
│   ├── package.json
│   ├── tailwind.config.js
│   ├── Dockerfile             # Production образ
│   ├── Dockerfile.dev         # Development образ
│   ├── nginx.conf             # Nginx конфігурація
│   └── .env.example
│
├── docker-compose.yml          # Production
├── docker-compose.dev.yml      # Development
├── .gitignore
└── README.md
```

---

## 🔧 Налаштування

### Змінні середовища Backend

| Змінна | Опис | Приклад |
|--------|------|---------|
| `MONGO_URL` | MongoDB connection string | `mongodb://localhost:27017` |
| `DB_NAME` | Назва бази даних | `moe_mistechko` |
| `JWT_SECRET` | Секрет для JWT токенів | `your-secret-key` |
| `CORS_ORIGINS` | Дозволені origins | `http://localhost:3000` |

### Змінні середовища Frontend

| Змінна | Опис | Приклад |
|--------|------|---------|
| `REACT_APP_BACKEND_URL` | URL бекенду | `http://localhost:8001` |

---

## 🤝 Розробка

### Git Workflow

```bash
# Створіть feature branch
git checkout -b feature/назва-функціоналу

# Зробіть зміни та commit
git add .
git commit -m "feat: опис змін"

# Push та створіть Pull Request
git push origin feature/назва-функціоналу
```

### Commit Convention
- `feat:` — новий функціонал
- `fix:` — виправлення багу
- `docs:` — документація
- `style:` — форматування
- `refactor:` — рефакторинг
- `test:` — тести

---

## 📝 Ліцензія

MIT License — див. файл [LICENSE](LICENSE)

---

## 📞 Контакти

- **Email**: info@moemistechko.ua
- **Телефон**: +38 (0312) 45-67-89

---

<div align="center">

**Зроблено з ❤️ для громади "Моє Містечко"**

</div>
