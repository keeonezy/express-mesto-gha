// Экспорт express фреймворка
const express = require('express');
// Для работы с БД
const mongoose = require('mongoose');

const app = express()

// Устанавливаем порт
const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb');


// Беру порт и передаю колбэк, он вызовется в момент его старта
app.listen(PORT, () => {
  console.log(`Порт активен: ${PORT}`)
});