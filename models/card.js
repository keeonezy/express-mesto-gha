const mongoose = require('mongoose');
const validator = require('validator');

// Название создаем
const cardSchema = new mongoose.Schema({
  // Имя в схеме
  name: {
    // Тип
    type: String,
    // Обязательное требование
    required: true,
    // Минимальная длина символов
    minlength: 2,
    // Максимальная длина символов
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: (url) => validator.isURL(url),
      message: 'Не корректный URL',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    default: [],
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
