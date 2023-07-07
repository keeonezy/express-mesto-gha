// Express фреймворка
const express = require('express');
// Для работы с БД
const mongoose = require('mongoose');
const router = require('./routes');

// Создаем сервер
const app = express();

// Устанавливаем порт
const { PORT = 3000 } = process.env;

// localhost не работает с POST. Устанавливаем 127.0.0.1
mongoose.connect('mongodb://127.0.0.1:27017/mestodb');
mongoose.connection.on('connected', () => console.log('Связь с БД установлена'));
mongoose.connection.on('error', () => console.log('Бд сломалась - '));

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '64949815d186b037fc433f1c', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

app.use(router);

// Беру порт и передаю колбэк, он вызовется в момент его старта
app.listen(PORT, () => {
  console.log(`Сервер запущен на порте: ${PORT}`);
});

module.exports = app;