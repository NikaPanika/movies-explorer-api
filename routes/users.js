const router = require('express').Router();

const { validateUser } = require('../middlewares/validation');
const { getUser, updateUserInfo } = require('../controllers/users');

router.get('/me', getUser);
router.patch('/me', validateUser, updateUserInfo);

module.exports = router;
