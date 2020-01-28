const {
  query,
  body,
  param,
  validationResult
} = require("express-validator");
const User = require("../models/user");
const mongoose = require("mongoose");

const errorHandle = (message, statusCode, errResult) => {
  errResult = errResult || 0;
  message = message || "default error message from errorHandle";
  error = new Error(message);
  error.statusCode = statusCode || 500;
  if (errResult) {
    error.data = errResult.array();
  }
  throw error;
};

const checkMongoId = (mongoId) => {
  if (mongoose.Types.ObjectId.isValid(mongoId)) {
    return true;
  } else {
    error = new Error("invalid MongoDB ID");
    error.statusCode = 404;
    throw error;
  }
};

module.exports = {
  errorHandle: errorHandle,
  checkMongoId: checkMongoId,
  feedController: {
    createPost: [
      body("title")
      .trim()
      .isLength({
        min: 5,
        max: 50
      }),
      body("content")
      .trim()
      .isLength({
        min: 5,
        max: 3000
      })
    ],
    getPosts: [
      query('page')
      .isInt({
        min: 1
      })
      .withMessage("Please use integer number")
      .isLength({
        max: 5
      })
    ],
    getPost: [
      param('postId').isMongoId().withMessage("Please use correct ID").isLength({
        max: 50
      })
    ]
  },
  userController: {
    signup: [
      body("email")
      .isEmail()
      .withMessage("Please input valid email.")
      .custom((value, {
        req
      }) => {
        return User.findOne({
          email: value
        }).then(userDoc => {
          if (userDoc) {
            return Promise.reject("E-mail already exits.");
          }
        });
      }),
      body("password")
      .trim()
      .isLength({
        min: 8,
        max: 80
      })
      .withMessage("password must more than 8 characters"),
      body("name")
      .trim()
      .notEmpty()
    ],
    login: [
      body("email")
      .isEmail()
      .withMessage("Please input valid email."),
      body("password")
      .trim()
      .isLength({
        min: 8,
        max: 80
      })
      .withMessage("password must more than 8 characters")
    ],
    updateStatus: [
      body("status")
      .trim()
      .notEmpty()
      .withMessage("Please input status.")
    ]
  }
};