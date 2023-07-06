const mongoose = require('mongoose');
const validator = require('validator');

// Название создаем
const userSchema = new mongoose.Schema({
  // Имя в схеме
  name: {
    // Тип
    type: String,
    // Обязательное требование
    // required: true,
    // Значение по умолчанию
    default: 'Жак-Ив Кусто',
    // Минимальная длина символов
    minlength: 2,
    // Максимальная длина символов
    maxlength: 30,
  },
  about: {
    type: String,
    default: 'Исследователь',
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    required: true,
    unique: true,
    // validate: {
    //   validator(v) {
    //     return validator.isEmail(v);
    //   },
    //   message: 'Ошибка в адресе электронной почты',
    // },
  },
  password: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('user', userSchema);
