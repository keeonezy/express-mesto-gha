// Express фреймворка
const express = require('express');
// Для работы с БД
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const router = require('./routes');
const { PORT, urlBD } = require('./config');

// Создаем сервер
const app = express();

// Подключаемся к БД
mongoose.connect(urlBD);
mongoose.connection.on('connected', () => console.log('Связь с БД установлена'));
mongoose.connection.on('error', () => console.log('Бд сломалась - '));

app.use(cookieParser());
app.use(express.json());

app.use(router);

app.use(errors());
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode)
    .send({
      message: statusCode === 500 ? 'На сервере произошла ошибка' : message,
    });

  next();
});

// Беру порт и передаю колбэк, он вызовется в момент его старта
app.listen(PORT, () => {
  console.log(`Сервер запущен на порте: ${PORT}`);
});
