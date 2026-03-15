# 📦 Інструкція з розгортання "Моє Містечко"

## Зміст
1. [Підготовка до GitHub](#1-підготовка-до-github)
2. [Локальне розгортання](#2-локальне-розгортання)
3. [Docker розгортання](#3-docker-розгортання)
4. [Розгортання на VPS](#4-розгортання-на-vps)
5. [Налаштування HTTPS](#5-налаштування-https)
6. [Моніторинг та обслуговування](#6-моніторинг-та-обслуговування)
7. [Резервне копіювання](#7-резервне-копіювання)
8. [Усунення неполадок](#8-усунення-неполадок)

---

## 1. Підготовка до GitHub

### Крок 1.1: Створення репозиторію на GitHub

1. Перейдіть на [github.com](https://github.com) та увійдіть
2. Натисніть **"New repository"** (зелена кнопка)
3. Заповніть:
   - **Repository name**: `moe-mistechko`
   - **Description**: `Портал об'єднаної територіальної громади`
   - **Visibility**: Public або Private
4. **НЕ** ставте галочки на README, .gitignore, license (вони вже є)
5. Натисніть **"Create repository"**

### Крок 1.2: Push коду на GitHub

```bash
# Перейдіть в папку проекту
cd /шлях/до/moe-mistechko

# Ініціалізуйте git (якщо ще не зроблено)
git init

# Додайте remote (замініть YOUR-USERNAME на ваш username)
git remote add origin https://github.com/YOUR-USERNAME/moe-mistechko.git

# Додайте всі файли
git add .

# Створіть commit
git commit -m "Initial commit: Моє Містечко MVP"

# Push на GitHub
git branch -M main
git push -u origin main
```

### Крок 1.3: Перевірка на GitHub

Після push перейдіть на `https://github.com/YOUR-USERNAME/moe-mistechko` та переконайтесь, що всі файли завантажились.

---

## 2. Локальне розгортання

### Вимоги
- Node.js 18+ та Yarn
- Python 3.11+
- MongoDB 7.0 (локально або Docker)

### Крок 2.1: Клонування репозиторію

```bash
git clone https://github.com/YOUR-USERNAME/moe-mistechko.git
cd moe-mistechko
```

### Крок 2.2: Запуск MongoDB

**Варіант A: Docker (рекомендовано)**
```bash
docker run -d \
  --name mongodb \
  -p 27017:27017 \
  -v mongodb_data:/data/db \
  mongo:7.0
```

**Варіант B: Локальна установка**
- Завантажте з [mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
- Встановіть та запустіть службу

### Крок 2.3: Налаштування Backend

```bash
# Перейдіть в папку backend
cd backend

# Створіть віртуальне середовище
python -m venv venv

# Активуйте (Linux/Mac)
source venv/bin/activate

# Активуйте (Windows)
venv\Scripts\activate

# Встановіть залежності
pip install -r requirements.txt

# Створіть файл .env
cp .env.example .env

# Відредагуйте .env
nano .env  # або будь-який текстовий редактор
```

**Мінімальний .env для локальної розробки:**
```env
MONGO_URL=mongodb://localhost:27017
DB_NAME=moe_mistechko
CORS_ORIGINS=http://localhost:3000
JWT_SECRET=my-local-secret-key-12345
```

```bash
# Запустіть backend
uvicorn server:app --reload --port 8001
```

Backend буде доступний на: `http://localhost:8001`
Swagger документація: `http://localhost:8001/docs`

### Крок 2.4: Налаштування Frontend

```bash
# В новому терміналі
cd frontend

# Встановіть залежності
yarn install

# Створіть файл .env
cp .env.example .env

# Відредагуйте .env
nano .env
```

**Вміст .env:**
```env
REACT_APP_BACKEND_URL=http://localhost:8001
```

```bash
# Запустіть frontend
yarn start
```

Frontend буде доступний на: `http://localhost:3000`

---

## 3. Docker розгортання

### Вимоги
- Docker 20.10+
- Docker Compose 2.0+

### Крок 3.1: Встановлення Docker

**Ubuntu/Debian:**
```bash
# Оновіть пакети
sudo apt update

# Встановіть Docker
curl -fsSL https://get.docker.com | sh

# Додайте користувача до групи docker
sudo usermod -aG docker $USER

# Перезайдіть для застосування змін
newgrp docker

# Перевірте
docker --version
docker-compose --version
```

**MacOS:**
- Завантажте [Docker Desktop](https://www.docker.com/products/docker-desktop/)

**Windows:**
- Завантажте [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- Увімкніть WSL 2

### Крок 3.2: Підготовка змінних середовища

```bash
# В кореневій папці проекту
cd moe-mistechko

# Створіть .env файл
cat > .env << EOF
JWT_SECRET=$(openssl rand -hex 32)
EOF

# Перевірте
cat .env
```

### Крок 3.3: Development режим (з hot reload)

```bash
# Запуск для розробки
docker-compose -f docker-compose.dev.yml up -d

# Перевірка статусу
docker-compose -f docker-compose.dev.yml ps

# Перегляд логів
docker-compose -f docker-compose.dev.yml logs -f
```

**Доступні адреси:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8001
- MongoDB: localhost:27017

### Крок 3.4: Production режим

```bash
# Збірка та запуск
docker-compose up -d --build

# Перевірка
docker-compose ps

# Логи
docker-compose logs -f
```

**Доступні адреси:**
- Сайт: http://localhost (порт 80)
- API: http://localhost/api/

---

## 4. Розгортання на VPS

### Вимоги до сервера
- **OS**: Ubuntu 22.04 LTS (рекомендовано)
- **RAM**: мінімум 2 GB
- **CPU**: 1+ vCPU
- **Диск**: 20+ GB SSD
- **Провайдери**: DigitalOcean, Hetzner, AWS, Azure, Google Cloud

### Крок 4.1: Підключення до сервера

```bash
ssh root@YOUR_SERVER_IP
```

### Крок 4.2: Оновлення системи

```bash
apt update && apt upgrade -y
```

### Крок 4.3: Встановлення Docker

```bash
# Встановлення Docker
curl -fsSL https://get.docker.com | sh

# Встановлення Docker Compose
apt install docker-compose-plugin -y

# Перевірка
docker --version
docker compose version
```

### Крок 4.4: Створення користувача

```bash
# Створіть користувача (не працюйте під root!)
adduser deploy
usermod -aG docker deploy
usermod -aG sudo deploy

# Переключіться на нового користувача
su - deploy
```

### Крок 4.5: Клонування проекту

```bash
cd ~
git clone https://github.com/YOUR-USERNAME/moe-mistechko.git
cd moe-mistechko
```

### Крок 4.6: Налаштування змінних

```bash
# Згенеруйте секретний ключ
JWT_SECRET=$(openssl rand -hex 32)

# Створіть .env
cat > .env << EOF
JWT_SECRET=$JWT_SECRET
EOF

# Перевірте
cat .env
```

### Крок 4.7: Запуск

```bash
# Збірка та запуск
docker compose up -d --build

# Перевірка
docker compose ps
docker compose logs -f
```

### Крок 4.8: Налаштування файрволу

```bash
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
sudo ufw status
```

---

## 5. Налаштування HTTPS

### Варіант A: Certbot (Let's Encrypt) - Рекомендовано

### Крок 5.1: Налаштування DNS

Додайте A-запис у DNS вашого домену:
```
moemistechko.ua  A  YOUR_SERVER_IP
www.moemistechko.ua  A  YOUR_SERVER_IP
```

### Крок 5.2: Встановлення Certbot

```bash
sudo apt install certbot python3-certbot-nginx -y
```

### Крок 5.3: Встановлення Nginx на хості

```bash
sudo apt install nginx -y
```

### Крок 5.4: Конфігурація Nginx

```bash
sudo nano /etc/nginx/sites-available/moemistechko
```

```nginx
server {
    listen 80;
    server_name moemistechko.ua www.moemistechko.ua;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api/ {
        proxy_pass http://localhost:8001/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# Активуйте конфігурацію
sudo ln -s /etc/nginx/sites-available/moemistechko /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Крок 5.5: Отримання SSL сертифіката

```bash
sudo certbot --nginx -d moemistechko.ua -d www.moemistechko.ua
```

### Крок 5.6: Автоматичне оновлення сертифіката

```bash
# Certbot автоматично додає cronjob, перевірте:
sudo systemctl status certbot.timer
```

---

## 6. Моніторинг та обслуговування

### Перевірка статусу

```bash
# Статус контейнерів
docker compose ps

# Використання ресурсів
docker stats

# Логи всіх сервісів
docker compose logs -f

# Логи конкретного сервісу
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f mongodb
```

### Перезапуск сервісів

```bash
# Перезапуск всіх
docker compose restart

# Перезапуск конкретного
docker compose restart backend
```

### Оновлення коду

```bash
cd ~/moe-mistechko

# Отримайте оновлення
git pull origin main

# Перебудуйте та перезапустіть
docker compose up -d --build
```

### Очищення

```bash
# Видалення зупинених контейнерів
docker system prune

# Видалення невикористаних образів
docker image prune -a

# Видалення невикористаних volumes (ОБЕРЕЖНО!)
docker volume prune
```

---

## 7. Резервне копіювання

### Backup MongoDB

```bash
# Створіть папку для бекапів
mkdir -p ~/backups

# Бекап бази даних
docker compose exec mongodb mongodump \
  --db moe_mistechko \
  --archive=/backup/backup_$(date +%Y%m%d_%H%M%S).gz \
  --gzip

# Скопіюйте на хост
docker cp moe-mistechko-mongodb:/backup ~/backups/
```

### Автоматичний бекап (cron)

```bash
# Створіть скрипт бекапу
cat > ~/backup_db.sh << 'EOF'
#!/bin/bash
BACKUP_DIR=~/backups
DATE=$(date +%Y%m%d_%H%M%S)
docker compose -f ~/moe-mistechko/docker-compose.yml exec -T mongodb mongodump --db moe_mistechko --archive --gzip > $BACKUP_DIR/mongodb_$DATE.gz

# Видалення старих бекапів (старше 7 днів)
find $BACKUP_DIR -name "mongodb_*.gz" -mtime +7 -delete
EOF

chmod +x ~/backup_db.sh

# Додайте до cron (щодня о 3:00)
crontab -e
# Додайте рядок:
# 0 3 * * * ~/backup_db.sh
```

### Відновлення з бекапу

```bash
# Відновлення
docker compose exec -T mongodb mongorestore \
  --db moe_mistechko \
  --archive=/backup/backup_20240115_030000.gz \
  --gzip \
  --drop
```

---

## 8. Усунення неполадок

### Контейнер не запускається

```bash
# Перевірте логи
docker compose logs backend

# Типові проблеми:
# - Неправильний MONGO_URL
# - Порт вже зайнятий
# - Недостатньо пам'яті
```

### MongoDB не підключається

```bash
# Перевірте чи MongoDB запущено
docker compose ps mongodb

# Перевірте мережу
docker network ls
docker network inspect moe-mistechko-network
```

### Frontend не бачить Backend

```bash
# Перевірте змінну REACT_APP_BACKEND_URL
docker compose exec frontend env | grep REACT

# Для production з nginx перевірте конфігурацію
cat frontend/nginx.conf
```

### Помилка "Permission denied"

```bash
# Для файлів
sudo chown -R $USER:$USER ~/moe-mistechko

# Для Docker socket
sudo chmod 666 /var/run/docker.sock
```

### Очищення та перезапуск з нуля

```bash
# Зупиніть все
docker compose down

# Видаліть volumes (ВИДАЛИТЬ ДАНІ!)
docker compose down -v

# Видаліть образи
docker compose down --rmi all

# Перебудуйте
docker compose up -d --build
```

---

## Контрольний список розгортання

- [ ] Код завантажено на GitHub
- [ ] Сервер підготовлено (Docker, firewall)
- [ ] DNS налаштовано на IP сервера
- [ ] `.env` файл створено з JWT_SECRET
- [ ] Контейнери запущено
- [ ] SSL сертифікат встановлено
- [ ] Бекапи налаштовано
- [ ] Сайт доступний за доменом

---

## Корисні команди

```bash
# Швидка перевірка здоров'я API
curl http://localhost:8001/api/health

# Підключення до MongoDB
docker compose exec mongodb mongosh

# Перегляд бази даних
docker compose exec mongodb mongosh --eval "use moe_mistechko; db.stats()"

# Перегляд користувачів
docker compose exec mongodb mongosh --eval "use moe_mistechko; db.users.find()"

# Вхід в контейнер
docker compose exec backend /bin/sh
docker compose exec frontend /bin/sh

# Перегляд розміру volumes
docker system df -v
```

---

**Успішного розгортання! 🚀**
