const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Определение схемы реферала
const referralSchema = new Schema({
  // Ссылка на пользователя, который дал реферальную ссылку
  referrer: {
    type: Schema.Types.ObjectId, // Тип данных - ObjectId
    ref: 'User', // Ссылка на модель 'User'
    required: true // Обязательное поле
  },
  // Ссылка на пользователя, который зарегистрировался по реферальной ссылке
  referred: {
    type: Schema.Types.ObjectId, // Тип данных - ObjectId
    ref: 'User', // Ссылка на модель 'User'
    required: true // Обязательное поле
  },
  // Дата создания реферала
  createdAt: {
    type: Date, // Тип данных - дата
    default: Date.now // Значение по умолчанию - текущая дата и время
  }
});

// Экспорт модели 'Referral' с использованием схемы referralSchema
module.exports = mongoose.model('Referral', referralSchema);

