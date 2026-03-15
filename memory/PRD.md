# Моє Містечко - PRD (Product Requirements Document)

## Оригінальна постановка задачі
Комплексний веб-сайт для об'єднаної територіальної громади "Моє Містечко" з двома адміністративними зонами:
- **Рада №1**: Село Зелене (населення 3,240)
- **Рада №2**: Мікрорайон Сонячний (населення 5,680)

## Архітектура
- **Frontend**: React 19 + Tailwind CSS + Framer Motion + Leaflet
- **Backend**: FastAPI (Python) + MongoDB
- **Авторизація**: JWT + Google OAuth (Emergent Auth)
- **Контейнеризація**: Docker + Docker Compose
- **Веб-сервер**: Nginx (production)

## Цільова аудиторія
- Жителі обох населених пунктів громади
- Працівники місцевих рад
- Підприємці та продавці
- Адміністратори системи

---

## Що реалізовано - 15.03.2026

### Backend API
- [x] Авторизація (JWT + Google OAuth)
- [x] Реєстрація користувачів
- [x] CRUD для новин
- [x] CRUD для оголошень
- [x] Отримання інформації про ради
- [x] Маркетплейс (продукти)
- [x] Теми форуму
- [x] Seed даних при старті

### Frontend
- [x] Головна сторінка з hero, статистикою, секціями
- [x] Навігація (хедер, мобільне меню, футер)
- [x] Сторінка новин з фільтрами
- [x] Сторінка оголошень
- [x] Сторінки рад (окрема для кожної)
- [x] Маркетплейс
- [x] Форум
- [x] Інтерактивна мапа (Leaflet)
- [x] Сторінка контактів
- [x] Логін/Реєстрація
- [x] Google OAuth інтеграція
- [x] Погодний віджет (мок дані)

### Docker та Deployment
- [x] Dockerfile для backend (production + dev)
- [x] Dockerfile для frontend (multi-stage + dev)
- [x] docker-compose.yml для production
- [x] docker-compose.dev.yml для розробки
- [x] Nginx конфігурація
- [x] .env.example файли
- [x] .dockerignore файли
- [x] Детальна документація (README.md, DEPLOY.md)

---

## Структура проекту

```
moe-mistechko/
├── backend/
│   ├── Dockerfile
│   ├── Dockerfile.dev
│   ├── .env.example
│   ├── .dockerignore
│   ├── requirements.txt
│   └── server.py
├── frontend/
│   ├── src/
│   ├── public/
│   ├── Dockerfile
│   ├── Dockerfile.dev
│   ├── .env.example
│   ├── .dockerignore
│   ├── nginx.conf
│   └── package.json
├── docker-compose.yml
├── docker-compose.dev.yml
├── README.md
├── DEPLOY.md
├── LICENSE
└── .gitignore
```

---

## Credentials (тестові)
- **Admin**: admin@moemistechko.ua / admin123

## Docker команди

```bash
# Production
docker-compose up -d --build

# Development
docker-compose -f docker-compose.dev.yml up -d

# Логи
docker-compose logs -f

# Зупинка
docker-compose down
```

---

## Backlog

### P0 - Критичні
1. [ ] Адмін-панель для управління контентом
2. [ ] Детальна сторінка новини (/news/:id)
3. [ ] Створення оголошень через форму

### P1 - Важливі
4. [ ] Інтеграція OpenWeatherMap API
5. [ ] Інтеграція Facebook/Instagram API
6. [ ] Система коментарів
7. [ ] Профіль користувача

### P2 - Бажані
8. [ ] Темна тема
9. [ ] PWA підтримка
10. [ ] Мультимовність (UA/EN)
11. [ ] Push-сповіщення
