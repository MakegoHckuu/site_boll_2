const mongoose = require('mongoose'); 
const Schema = mongoose.Schema; // Используем Schema из mongoose для создания схемы данных
const validator = require('validator'); // Подключаем библиотеку validator для валидации данных

// Определяем схему для видео
const videoSchema = new Schema({
    // Заголовок видео, который обязателен и должен быть строкой
    title: { type: String, required: true },
    // Описание видео, необязательное поле, тип - строка
    description: String,
    // URL видео, обязательное поле с валидацией URL
    videoUrl: {
        // Функция валидации URL
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                // Проверяем, является ли v валидным URL с протоколами http или https
                return validator.isURL(v, {
                    protocols: ['http','https'], // Указываем, какие протоколы допустимы
                    require_protocol: true // Требуем наличие протокола в URL
                });
            },
            // Сообщение об ошибке, если URL не валиден
            message: props => `${props.value} is not a valid URL!`
        }
    },
    // Количество просмотров, по умолчанию 0
    viewsCount: { type: Number, default: 0 },
    // Общее время просмотра в секундах, по умолчанию 0
    totalTimeWatched: { type: Number, default: 0 }, 
    // Дата добавления видео, по умолчанию текущая дата
    addedDate: { type: Date, default: Date.now }
});
// Экспортируем модель 'Video' с использованием videoSchema
module.exports = mongoose.model('Video', videoSchema);
