const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { STATUS_CREATED } = require('../utils/responseStatus');
const BadRequestError = require('../utils/status-400');
const NotFoundError = require('../utils/status-404');
const ConflictError = require('../utils/status-409');

module.exports.getUsers = async (req, res, next) => {
  try {
    // Ожидание ответа
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    next(err);
  }
};

module.exports.getUserInfo = (req, res, next) => {
  try {
    const user = User.findById(req.user._id)
      // Если не будет ничего найдено. Not Found не менять т.к коды будут не корректно работать
      .orFail(() => { throw new NotFoundError('Карточка для удаления не найдена'); });
    res.send(user);
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError('Не правильно переданы данные'));
    } else {
      next(err);
    }
  }
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(() => { throw new NotFoundError('Карточка для удаления не найдена'); })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Не правильно переданы данные'));
      } else {
        next(err);
      }
    });
};

module.exports.createUser = async (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  try {
    // Соль для пароля. Создает уникальное значение хэша
    const hashedPassword = await bcrypt.hash(String(password), 10);
    const user = await User.create({
      name, about, avatar, email, password: hashedPassword,
    });
    res.status(STATUS_CREATED).send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Не правильно переданы данные'));
    } else if (err.code === 11000) {
      next(new ConflictError('Пользователь с такой почтой уже зарегистрирован'));
    } else {
      next(err);
    }
  }
};

module.exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Существует ли email
    const user = await User.findUserByCredentials(email, password);
    if (user) {
      const isValidUser = await bcrypt.compare(String(password), user.password);
      if (isValidUser) {
        // Создаем JWT токен. В process.env передаем наш код секретный
        const token = jwt.sign({ _id: user._id }, process.env.SECRET__HEHE);
        // закреляем JWT к cookie
        res.cookie('jwt', token, {
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 дней(дни, часы, минуты, секунды, милисекунды)
          httpOnly: true, // Cookie только для http запроса, а не js
          sameSite: true, // Cookie отправляется только в рамках 1 домена
          secure: true, // Cookie только для https соединения
        });
        res.send({ token });
      }
    }
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Не правильно переданы данные'));
    } else {
      next(err);
    }
  }
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  const owner = req.user._id;

  User.findByIdAndUpdate(owner, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        throw new NotFoundError('Пользователь не найден');
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Не правильно переданы данные'));
      } else {
        next(err);
      }
    });
};

module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const owner = req.user._id;

  User.findByIdAndUpdate(owner, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        throw new NotFoundError('Пользователь не найден');
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Не правильно переданы данные'));
      } else {
        next(err);
      }
    });
};
