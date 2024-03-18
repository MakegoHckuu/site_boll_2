// Импортируем mongoose, библиотеку для работы с MongoDB
const mongoose = require('mongoose');

// Определяем схему транзакции
const transactionSchema = new mongoose.Schema({
  // ID пользователя, который совершает транзакцию
  userId: {
    type: mongoose.Schema.Types.ObjectId, // Тип данных - ObjectId MongoDB
    ref: 'User', // Ссылка на модель User
    required: true // Обязательное поле
  },
  // Тип транзакции: депозит или снятие
  type: {
    type: String, // Тип данных - строка
    enum: ['deposit', 'withdrawal'], // Ограничение значений
    required: true // Обязательное поле
  },
  // Сумма транзакции
  amount: {
    type: Number, // Тип данных - число
    required: true // Обязательное поле
  },
  // Статус транзакции
  status: {
    type: String, // Тип данных - строка
    enum: ['pending', 'completed', 'failed'], // Ограничение значений
    default: 'pending' // Значение по умолчанию
  },
  // Дата транзакции
  transactionDate: {
    type: Date, // Тип данных - дата
    default: Date.now // Значение по умолчанию - текущая дата
  }
});

// Экспортируем модель 'Transaction' с определенной схемой
module.exports = mongoose.model('Transaction', transactionSchema);