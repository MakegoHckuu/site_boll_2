const bcrypt = require('bcryptjs'); // Подключаем модуль bcryptjs для хеширования и проверки паролей
const jwt = require('jsonwebtoken'); // Подключаем модуль jsonwebtoken для создания JWT токенов
const User = require('../models/user'); // Подключаем модель пользователя. Убедитесь, что путь к модели корректен

const login = async (req, res) => { // Асинхронная функция для обработки запроса на вход пользователя
    try {
        const { email, password } = req.body; // Извлекаем email и пароль из тела запроса
        if (!email || !password) { // Проверяем, предоставлены ли email и пароль
            return res.status(400).json({ message: 'Email and password are required.' }); // Если нет, отправляем ответ с ошибкой
        }

        const user = await User.findOne({ email }); // Ищем пользователя по email
        if (!user) { // Если пользователь не найден,
            return res.status(401).json({ message: 'Authentication failed. User not found.' }); // отправляем ответ с ошибкой
        }

        const isMatch = await bcrypt.compare(password, user.password); // Сравниваем предоставленный пароль с хешированным паролем пользователя
        if (!isMatch) { // Если пароли не совпадают,
            return res.status(401).json({ message: 'Authentication failed. Wrong password.' }); // отправляем ответ с ошибкой
        }

        const token = jwt.sign( // Создаем JWT токен
            { userId: user._id, email: user.email }, // с идентификатором пользователя и email в качестве полезной нагрузки
            process.env.JWT_SECRET, // используем секретный ключ, хранящийся в переменных окружения
            { expiresIn: '1h' } // устанавливаем срок действия токена в 1 час
        );

        res.json({ token }); // Отправляем токен в ответе
    } catch (error) { // В случае возникновения ошибки
        console.error(error); // Выводим информацию об ошибке в консоль
        res.status(500).json({ message: 'Error logging in', error: error }); // и отправляем ответ с ошибкой
    }
};
const register = async (req, res) => { // Объявление асинхронной функции register, принимающей объекты запроса и ответа
    try { // Начало блока try для перехвата возможных ошибок
      const { email, password } = req.body; // Извлечение email и password из тела запроса
      // Проверка, существует ли пользователь с таким email
      const existingUser = await User.findOne({ email }); // Асинхронный поиск пользователя по email в базе данных
      if (existingUser) { // Если пользователь найден,
        return res.status(400).json({ message: 'User with this email already exists.' }); // возвращаем ответ с ошибкой
      }
      // Хеширование пароля и создание нового пользователя
      const hashedPassword = await bcrypt.hash(password, 10); // Асинхронное хеширование пароля
      const user = new User({ email, password: hashedPassword }); // Создание нового пользователя с хешированным паролем
      await user.save(); // Асинхронное сохранение пользователя в базу данных
      // Генерация JWT для нового пользователя
      const token = jwt.sign( // Создание токена JWT
        { userId: user._id, email: user.email }, // Пейлоуд токена
        process.env.JWT_SECRET, // Секретный ключ из переменных окружения
        { expiresIn: '1h' } // Время жизни токена
      );
      res.status(201).json({ token }); // Отправка токена в ответе
    } catch (error) { // В случае возникновения ошибки
      console.error(error); // Вывод ошибки в консоль
      res.status(500).json({ message: 'Error registering new user', error: error }); // Отправка ответа с ошибкой
    }
  };

module.exports = { login }; // Экспортируем функцию login для использования в других частях приложения