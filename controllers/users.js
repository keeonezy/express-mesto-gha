const bcrypt = require('bcryptjs');
const jsonWebToken = require('jsonwebtoken');
const User = require('../models/user');
const {
  STATUS_CREATED,
  BAD_REQUEST_ERROR,
  UNAUTH_ERROR,
  NOT_FOUND_ERROR,
  INTERNAL_SERVER_ERROR,
} = require('../utils/responseStatus');

module.exports.getUsers = async (req, res) => {
  try {
    // Ожидание ответа
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(INTERNAL_SERVER_ERROR)
      .send({
        message: 'Ошибка сервера',
      });
  }
};

module.exports.getUserInfo = (req, res) => {
  try {
    const user = User.findById(req.user._id)
      // Если не будет ничего найдено. Not Found не менять т.к коды будут не корректно работать
      .orFail(() => new Error('Not found'));
    res.send(user);
  } catch (err) {
    if (err.message === 'Not found') {
      res.status(NOT_FOUND_ERROR)
        .send({
          message: 'Данные не найдены',
        });
    } else if (err.name === 'CastError') {
      res.status(BAD_REQUEST_ERROR)
        .send({
          message: 'Объект не найден',
        });
    } else {
      res.status(INTERNAL_SERVER_ERROR)
        .send({
          message: 'Ошибка сервера',
        });
    }
  }
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    // Если не будет ничего найдено. Not Found не менять т.к коды будут не корректно работать
    .orFail(() => new Error('Not found'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.message === 'Not found') {
        res.status(NOT_FOUND_ERROR)
          .send({
            message: 'Данные не найдены',
          });
      } else if (err.name === 'CastError') {
        res.status(BAD_REQUEST_ERROR)
          .send({
            message: 'Объект не найден',
          });
      } else {
        res.status(INTERNAL_SERVER_ERROR)
          .send({
            message: 'Ошибка сервера',
          });
      }
    });
};

// module.exports.createUser = (req, res) => {
//   const { name, about, avatar, email, password } = req.body;
//   const hashedPassword = bcrypt.hash(String(password), 10);

//   User.create({
//     name, about, avatar, email, password,
//   })
//     // 201 статус должен быть успешным
//     .then((user) => res.status(STATUS_CREATED).send(user))
//     .catch((err) => {
//       if (err.name === 'ValidationError') {
//         res.status(BAD_REQUEST_ERROR)
//           .send({
//             message: 'Данные переданы не правильно',
//           });
//       } else {
//         res.status(INTERNAL_SERVER_ERROR)
//           .send({
//             message: 'Ошибка сервера',
//           });
//       }
//     });
// };

module.exports.createUser = async (req, res) => {
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
      res.status(BAD_REQUEST_ERROR)
        .send({
          message: 'Данные переданы не правильно',
        });
    } else {
      res.status(INTERNAL_SERVER_ERROR)
        .send({
          message: 'Ошибка сервера',
        });
    }
  }
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  const owner = req.user._id;

  User.findByIdAndUpdate(owner, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        res.status(NOT_FOUND_ERROR)
          .send({
            message: 'Данные не найдены',
          });
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST_ERROR)
          .send({
            message: 'Данные переданы не правильно',
          });
      } else {
        res.status(INTERNAL_SERVER_ERROR)
          .send({
            message: 'Ошибка сервера',
          });
      }
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  const owner = req.user._id;

  User.findByIdAndUpdate(owner, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        res.status(NOT_FOUND_ERROR)
          .send({
            message: 'Данные не найдены',
          });
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST_ERROR)
          .send({
            message: 'Данные переданы не правильно',
          });
      } else {
        res.status(INTERNAL_SERVER_ERROR)
          .send({
            message: 'Ошибка сервера',
          });
      }
    });
};

module.exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Существует ли email
    const user = await User.findOne({ email })
      .select('+password');
    if (user) {
      const isValidUser = await bcrypt.compare(String(password), user.password);
      if (isValidUser) {
        // Создаем JWT токен
        const jwt = jsonWebToken.sign({
          _id: user._id,
        }, process.env.SECRET__HEHE); // Наш секретный код для пароля
        // закреляем JWT к cookie
        res.cookie('jwt', jwt, {
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 дней(дни, часы, минуты, секунды, милисекунды)
          httpOnly: true, // Cookie только для http запроса, а не js
          sameSite: true, // Cookie отправляется только в рамках 1 домена
          secure: true, // Cookie только для https соединения
        });
        res.send({ data: user.toJSON() });
      }
    }
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(BAD_REQUEST_ERROR)
        .send({
          message: 'Данные переданы не правильно',
        });
    } else {
      res.status(INTERNAL_SERVER_ERROR)
        .send({
          message: 'Ошибка сервера',
        });
    }
  }
};
