//В этом файле определяем маршруты для изменения электронной почты и пароля:
const express = require('express');
const router = express.Router();
const userController = require('./userController'); // Убедись, что контроллеры подключены правильно

router.post('/change-email', userController.changeEmail);
router.post('/change-password', userController.changePassword);

module.exports = router;
