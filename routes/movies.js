const router = require('express').Router();

const { validateCreationMovie, validateMovieById } = require('../middlewares/validation');
const { returnMovies, createMovie, deleteMovieById } = require('../controllers/movies');

router.get('/', returnMovies);
router.post('/', validateCreationMovie, createMovie);
router.delete('/:_id', validateMovieById, deleteMovieById);

module.exports = router;
