const Router = require('express')
const { check } = require('express-validator');
const router = new Router();
const controller = require('../controllers/authController');

router.post(
  '/registration',
  [
    check('name', 'Can not be empty').notEmpty(),
    check('password', 'Can not be less then 6').isLength({ min: 6 })
  ],
  controller.registration
)
router.post('/login', controller.login)
router.get('/user', controller.getUsers)

module.exports = router