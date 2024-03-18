const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const withdrawalRequestSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true // Указывает, что каждая заявка на вывод средств должна быть связана с пользователем
  },
  amount: {
    type: Number,
    required: true // Сумма, которую пользователь хочет вывести
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'rejected'], // Статус заявки, позволяющий отслеживать её текущее состояние
    default: 'pending' // Значение по умолчанию для статуса - 'в ожидании'
  },
  createdDate: {
    type: Date,
    default: Date.now // Дата создания заявки, автоматически устанавливается в текущее время при создании документа
  },
  processedDate: Date // Дата обработки заявки, устанавливается вручную при изменении статуса на 'completed' или 'rejected'
});

module.exports = mongoose.model('WithdrawalRequest', withdrawalRequestSchema);