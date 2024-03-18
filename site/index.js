require('dotenv').config(); // Загрузка переменных окружения
const express = require('express');
const mongoose = require('mongoose'); // Подключение Mongoose

const app = express();

// Подключение к MongoDB
mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to DB!'))
  .catch(err => console.error(err));
  
app.use(express.json()); // Для разбора JSON-подобных входящих запросов

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});

