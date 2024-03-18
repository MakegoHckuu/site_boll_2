const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Определение схемы запроса на депозит
const depositRequestSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId, // Идентификатор пользователя, связь с моделью User
    ref: 'User', // Ссылка на модель User
    required: true // Обязательное поле, Указывает что каждая заявка на вывод средств должна быть связана с пользователем
  },
  amount: {
    type: Number, // Сумма депозита
    required: true // Обязательное поле
  },
  status: {
    type: String, // Статус запроса на депозит
    enum: ['pending', 'completed', 'rejected'], // Допустимые значения статуса
    default: 'pending' // Значение по умолчанию
  },
  createdDate: {
    type: Date, // Дата создания запроса
    default: Date.now // Значение по умолчанию - текущая дата
  },
  processedDate: Date // Дата обработки запроса
});

// Экспорт модели запроса на депозит
module.exports = mongoose.model('DepositRequest', depositRequestSchema);