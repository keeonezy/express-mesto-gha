// Express фреймворка
const express = require("express");
// Для работы с БД
const mongoose = require("mongoose");
const router = require("./routes/index");

// Устанавливаем порт
const { PORT = 3000 } = process.env;

mongoose.connect("mongodb://localhost:27017/mestodb", {
  useNewUrlParser: true,
});

// Создаем сервер
const app = express();

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '5d8b8592978f8bd833ca8133' // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

app.use(router);

// Беру порт и передаю колбэк, он вызовется в момент его старта
app.listen(PORT, () => {
  console.log(`Порт активен: ${PORT}`)
});