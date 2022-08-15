const { Router } = require('express');
const authcontroller = require('../controllers/authcontroller');

const router = Router();

router.get('/register', (authcontroller.register_get));
router.post('/register', (authcontroller.register_post));
router.get('/login', (authcontroller.login_get));
router.post('/login', (authcontroller.login_post));
router.post('/sendmail', (authcontroller.send_the_mail));
router.post('/checkOTP', (authcontroller.check_the_otp));
router.post('/create-checkout-session', (authcontroller.create_the_checkout_session));


module.exports = router;