//Для отправки верификационных смс:
// Download the helper library from https://www.twilio.com/docs/node/install
// Set environment variables for your credentials
// Read more at http://twil.io/secure
// Идентификатор учетной записи Twilio
const accountSid = process.env.TWILIO_ACCOUNT_SID;

// Токен аутентификации Twilio, получаемый из переменных окружения
const authToken = process.env.TWILIO_AUTH_TOKEN;

// Идентификатор сервиса верификации Twilio
const verifySid = process.env.VERIFY_SID; 

// Подключение к API Twilio с использованием учетных данных
const client = require("twilio")(accountSid, authToken);

// Создание запроса на отправку SMS для верификации номера телефона
client.verify.v2
.services(verifySid)
.verifications.create({ to: "+380980517515", channel: "sms" })
.then((verification) => console.log(verification.status)) // Вывод статуса отправки SMS

// После отправки SMS запрашиваем у пользователя ввод одноразового пароля (OTP)
.then(() => {
    const readline = require("readline").createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    // Запрос ввода OTP у пользователя
    readline.question("Please enter the OTP:", (otpCode) => {
        // Проверка введенного OTP
        client.verify.v2
        .services(verifySid)
        .verificationChecks.create({ to: "+380980517515", code: otpCode })
        .then((verification_check) => console.log(verification_check.status)) // Вывод результата проверки OTP
        .then(() => readline.close()); // Закрытие интерфейса ввода после получения ответа
    });
});