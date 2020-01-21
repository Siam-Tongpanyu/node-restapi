const {
  check,
  body,
  validationResult
} = require('express-validator');
const User = require('../models/user');

const errorHandle = (message, statusCode, errResult) => {
  errResult = errResult || 0;
  error = new Error(message);
  error.statusCode = statusCode;
  if (errResult) {
    error.data = errResult.array();
  }
  throw error;
};

module.exports = {
  errorHandle: errorHandle,
  feedController: {
    createPost: [
      body('title').trim().isLength({
        min: 5,
        max: 50
      }),
      body('content').trim().isLength({
        min: 5,
        max: 3000
      })
    ]
  },
  userController: {
    signup: [
      body('email').isEmail().withMessage('Please input valid email.').custom((value, {
        req
      }) => {
        return User.findOne({
          email: value
        }).then(userDoc => {
          if (userDoc) {
            return Promise.reject('E-mail already exits.');
          }
        })
      }),
      body('password').trim().isLength({
        min: 8,
        max: 80
      }).withMessage('password must more than 8 characters'),
      body('name').trim().notEmpty()
    ],
    login: [
      body('email').isEmail().withMessage('Please input valid email.'),
      body('password').trim().isLength({
        min: 8,
        max: 80
      }).withMessage('password must more than 8 characters')
    ]
  }
}