require('dotenv').config(); // Загрузка переменных окружения
const express = require('express');
const mongoose = require('mongoose'); // Подключение к Mongoose
const authRoutes = require('./routes/authRoutes'); // Убедись, что путь правильный

const app = express();

app.use(express.json()); // Использование middleware для разбора JSON-полей в запросах

// Использование маршрутов аутентификации
app.use('/api/auth', authRoutes);

// Порт, на котором будет запущен сервер. Если порт не указан в переменных окружения, используется 3000
const PORT = process.env.PORT || 3000;

// Подключение к MongoDB
mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to DB!')) // Успешное подключение к базе данных
  .catch(err => console.error(err)); // Обработка ошибки подключения к базе данных

// Запуск сервера на указанном порте и вывод сообщения о запуске
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});