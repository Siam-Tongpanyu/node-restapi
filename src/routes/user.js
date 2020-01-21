const express = require('express');
const userController = require('../controllers/user');
const validator = require('../utils/validator');

const router = express.Router();

router.put('/signup', validator.userController.signup, userController.signup);
router.post('/login', validator.userController.login, userController.login);


module.exports = router;