const mongoose = require("mongoose");

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
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  likes: {
    type: mongoose.Schema.Types.ObjectId,
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
})

module.exports = mongoose.model("card", cardSchema);