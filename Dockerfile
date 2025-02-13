# 1. Використовуємо офіційний образ Node.js
FROM node:latest AS builder

# 2. Встановлюємо робочу директорію
WORKDIR /app

# 3. Копіюємо package.json та package-lock.json
COPY package*.json ./

# 4. Встановлюємо залежності
RUN npm install --only=production

# 5. Копіюємо весь код проєкту
COPY . .

RUN npm install -g @nestjs/cli

# 6. Збираємо NestJS (якщо є TypeScript)
RUN npm run build

# 7. Другий етап — створення мінімального образу
FROM node:latest

# 8. Встановлюємо робочу директорію
WORKDIR /app

# 9. Копіюємо зібраний код з першого контейнера
COPY --from=builder /app ./

# 10. Вказуємо команду для запуску
CMD ["node", "dist/main"]

# 11. Відкриваємо порт
EXPOSE 4000