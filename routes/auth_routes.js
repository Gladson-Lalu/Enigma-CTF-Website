const { Router } = require('express');
const authController = require('../controllers/auth_controller');
const bodyParser = require('body-parser');

const urlEncoder = bodyParser.urlencoded({extended: true});
const router = Router();

router.get('/register.html', authController.signup_get);
router.post('/register',urlEncoder, authController.signup_post);
router.get('/login.html', authController.login_get);
router.post('/login', authController.login_post);
router.get('/logout', authController.logout_get);

module.exports = router;