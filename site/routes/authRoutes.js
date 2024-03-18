const express = require('express');
const router = express.Router();

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Путь к твоей модели пользователя

router.post('/login', async (req, res) => {
    try {
        // Извлечение email и password из тела запроса
        const { email, password } = req.body;

        // Поиск пользователя по email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Authentication failed. User not found.' });
        }

        // Сравнение переданного пароля с хешированным паролем в базе данных
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Authentication failed. Wrong password.' });
        }

        // Генерация JWT
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET, // Ключ для подписи токена, хранится в переменных окружения
            { expiresIn: '1h' } // Срок действия токена
        );

        // Отправка ответа с токеном
        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error logging in', error: error });
    }
});
