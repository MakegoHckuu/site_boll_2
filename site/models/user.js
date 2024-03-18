const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    //почта
    email: {
        type: String,
        unique: true, 
        validate: [
            {
                validator: function(value) {
                    // Проверяем, что если почта предоставлена, то она валидна
                    if (value) {
                        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\\.,;:\s@"]+\.)+[^<>()[\]\\.,;:\s@"]{2,})$/i;
                        return re.test(value);
                    }
                    return true; // Валидация пройдена, если email не предоставлен
                },
                message: props => `${props.value} is not a valid email address!`
            },
            {
                validator: function(value) {
                    // Проверяем, что если email не предоставлен, то должен быть телефон
                    return value || this.phone;
                },
                message: 'Email or phone number must be provided'
            }
        ]
    },
    //запасная почта
    spare_email: {
        type: String,        
    },
    //номер телефона
    phone: {
        type: String,
        validate: {
            validator: function(value) {
                // Проверяем, что если телефон не предоставлен, то должна быть почта
                if (!value) return this.email;
    
                // Проверка формата номера телефона
                var re = /^\+?[1-9]\d{1,14}$/; //простой пример регулярного выражения
                // ^: Начало строки.
                // \+?: Необязательный символ + в начале. Знак вопроса означает, что символ может быть, а может и не быть.
                // [1-9]: Первая цифра должна быть от 1 до 9. Это исключает номера, начинающиеся с нуля.
                // \d{1,14}: Последующие от одной до четырнадцати цифр (где \d означает любую цифру).
                return re.test(value);
            },
            message: props => `${props.value} is not a valid phone number or email must be provided`
        }
    },
    //пароль акк
    password: { 
        type: String, 
        required: true 
    },
    //права доступа
    role: { 
        type: String, 
        enum: ['user', 'admin', 'superadmin'],
        default: 'user'
    },
    //реферальная ссылка
    referralLink: String,
    referralsCount: { 
        type: Number, 
        default: 0 
    },
    //дата регистрации 
    registrationDate: { 
        type: Date, 
        default: Date.now 
    },
    //баланс
    balance: { 
        type: Number, 
        default: 0 
    },
    //язык интерфейса
    languagePreference: {
        type: String,
        enum: ['English', 'Spanish', 'Russian'],
        default: 'English'
    },   
    //комиссия
    komission: {
        type: String,
        default:0
    },
    //дневной заказ
    daily_orders: {
        type: String,
        default:0
    },
    //идентификатор (ID) пользователя-реферера.
    referredBy: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Ссылается на модель 'User'
        required: false // Это поле не обязательно, так как не все пользователи будут иметь реферера
    },
});

const LEVEL_THRESHOLDS = {
    LEVEL_1: 200,
    LEVEL_2: 400,
    LEVEL_3: 600,
    LEVEL_4: 800,
    LEVEL_5: 1000
};

//метод для автоматического получения уровня юзера
userSchema.methods.getLevel = function() {
    const balance = this.balance;
    if (balance < LEVEL_THRESHOLDS.LEVEL_1) return 1;
    if (balance < LEVEL_THRESHOLDS.LEVEL_2) return 2;
    if (balance < LEVEL_THRESHOLDS.LEVEL_3) return 3;
    if (balance < LEVEL_THRESHOLDS.LEVEL_4) return 4;
    if (balance < LEVEL_THRESHOLDS.LEVEL_5) return 5;
    return 6;
};

// Хеширование пароля перед сохранением пользователя в базу данных
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

module.exports = mongoose.model('User', userSchema);
