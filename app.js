require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const routes = require('./routes/index');
const error = require('./middlewares/error');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3001 } = process.env;

const app = express();
app.use(express.json());

app.use(helmet());

mongoose.connect('mongodb://127.0.0.1:27017/bitfilmsdb', {
  useNewUrlParser: true,
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
});

app.use(cors({
  origin: [
    'http://localhost:3001',
    'https://mestogallery.nomoreparties.co',

  ],
  credentials: true, // разрешить куки
}));

app.use(cookieParser());

app.use(requestLogger);

// Apply the rate limiting middleware to all requests
app.use(limiter);

app.use('/', routes);

app.use(errorLogger);

app.use(errors());

app.use(error);

app.listen(PORT);
