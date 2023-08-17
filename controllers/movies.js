const Movie = require('../models/movie');
const { NotFoundError } = require('../erorrs/notFound');
const { ForbiddenError } = require('../erorrs/forbiddenError');

const returnMovies = (req, res, next) => {
  const ownerId = req.user._id;
  Movie.find({ owner: ownerId })
    .then((movies) => {
      if (!movies) {
        throw new NotFoundError('Нет данных');
      }
      res.send(movies);
    })
    .catch(next);
};

const createMovie = (req, res, next) => {
  const owner = req.user._id;
  Movie.create({ owner, ...req.body })
    .then((movie) => {
      res.send(movie);
    })
    .catch(next);
};

const deleteMovieById = (req, res, next) => {
  const { movieId } = req.params;
  const id = req.user._id;

  Movie.findById(movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Нет фильма с таким id');
      } else if (movie.owner.toString() === id) {
        Movie.deleteOne(movie)
          .then((data) => {
            res.send({ data, message: 'Удалено' });
          })
          .catch(next);
      } else {
        throw new ForbiddenError('Вы не можете удалить фильм');
      }
    })
    .catch(next);
};

module.exports = { returnMovies, createMovie, deleteMovieById };
