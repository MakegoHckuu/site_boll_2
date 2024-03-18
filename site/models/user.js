const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    //почта
    email: {
        type: String,
        validate: {
            validator: function(value) {
                // Проверяем, что если почта не предоставлена, то должен быть телефон
                return value || this.phone;
            },
            message: 'Email or phone number must be provided'
        }
    },
    //запасная почта
    spare_email: {
        type: String
        required: true,
        unique: true
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
        default: 'user' 
    },
    //реферальная ссылка
    referralLink: String,
    referralsCount: { 
        type: Number, 
        default: 0 
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
        default: 'English'
    }   
});

//метод для автоматического получения уровня юзера
userSchema.methods.getLevel = function() {
    const balance = this.balance;
    if (balance < 200) return 1;
    if (balance < 400) return 2;
    if (balance < 600) return 3;
    if (balance < 800) return 4;
    if (balance < 1000) return 5;
    return 6;
};

// Хеширование пароля перед сохранением пользователя в базу данных
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

module.exports = mongoose.model('User', userSchema);
