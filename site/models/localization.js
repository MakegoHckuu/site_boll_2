//Модель локализации может хранить переводы для различных 
//элементов интерфейса или сообщений в системе. Она позволяет динамически 
//менять язык в приложении, основываясь на предпочтениях пользователя.
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Определение схемы локализации
const localizationSchema = new Schema({
  key: {
    type: String,
    required: true // Уникальный ключ для идентификации строки перевода
  },
  translations: {
    en: { type: String, required: true }, // Перевод на английский язык, обязательное поле
    es: String, // Перевод на испанский язык, необязательное поле
    ru: String, // Перевод на русский язык, необязательное поле   
  }
});

// Экспорт модели 'Localization' с использованием определенной схемы
module.exports = mongoose.model('Localization', localizationSchema);