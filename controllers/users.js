const http2 = require('http2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const { NotFoundError } = require('../erorrs/notFound');
const { BadRequest } = require('../erorrs/badRequest');
const { DuplicationError } = require('../erorrs/dataDuplication');
const { AuthError } = require('../erorrs/authError');

const { JWT_SECRET = 'strange-secret-key' } = process.env;
const { NODE_ENV } = process.env;

const {
  HTTP_STATUS_CREATED,
} = http2.constants;

const getUser = (req, res, next) => {
  const id = req.user._id;
  User.findById(id)
    .then((user) => {
      res.send(user);
    })
    .catch(next);
};

const updateUserInfo = (req, res, next) => {
  const { name, email } = req.body;
  const id = req.user._id;
  User.findByIdAndUpdate(id, { name, email }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет пользователя с таким id');
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Невалидные данные'));
      } else {
        next(err);
      }
    });
};

const createUser = (req, res, next) => {
  const { name, email, password } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name, email, password: hash,
      })
        .then(() => res.status(HTTP_STATUS_CREATED)
          .send({
            name, email,
          }))
        .catch((err) => {
          if (err.code === 11000) {
            next(new DuplicationError('Пользователь с таким Email уже существует'));
          } else if (err.name === 'ValidationError') {
            next(new BadRequest('Невалидные данные'));
          } else {
            next(err);
          }
        });
    }).catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new AuthError('Неправильные почта или пароль');
      }
      bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new AuthError('Неправильные почта или пароль');
          }
          const token = jwt.sign(
            { _id: user._id },
            NODE_ENV === 'production' ? JWT_SECRET : 'strange-secret-key',
            { expiresIn: '7d' },
          );
          return res.send({ jwt: token });
        })
        .catch(next);
    })
    .catch(next);
};

module.exports = {
  getUser,
  updateUserInfo,
  createUser,
  login,
};
