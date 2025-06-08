# TSForDoiT

Проєкт для пошуку мовних партнерів. Використовує **Angular** на фронтенді та **Node.js + Express** на бекенді.


# Технології

Frontend: Angular + Angular Material
Backend: Node.js + Express + PostgreSQL + Prisma

# Запуск проєкту

## Backend

### Перейдіть у директорію `Backend`

cd Backend
npm install

### Створіть .env файл:

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=qwerty
DB_NAME=fordoit
DB_URL=postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}
JWT_SECRET=secretKey
PORT=5000
frontend_url=http://localhost:4200

#### Запуск

npm start

Бекенд працюватиме на (http://localhost:5000)

## Frontend

Перейдіть у директорію Frontend/tsfordoit

cd Frontend/tsfordoit
npm install

### Запуск у режимі розробки

npm start

Вебклієнт буде доступний на (http://localhost:4200)

### Продакшн збірка

ng build

# Основні кроки використання

1. Зареєструватися
2. Увійти
3. Здійснити пошук партнерів по мові
4. Надіслати запит
5. Прийняти або відхилити запит
