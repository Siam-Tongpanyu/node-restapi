const { check, body, validationResult } = require("express-validator");
const User = require("../models/user");
const validator = require("../utils/validator");
const auth = require("../utils/auth");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");

exports.signup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    validator.errorHandle(
      "Validation error!! Please check email or password again.",
      422,
      errors
    );
  }
  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;
  auth
    .encrypt(password)
    .then(hassPw => {
      const user = new User({
        email: email,
        name: name,
        password: hassPw
      });
      return user.save();
    })
    .then(result => {
      res.status(201).json({
        message: "Create new user successful",
        userId: result._id
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.login = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    validator.errorHandle(
      "Validation error!! Please check email or password again.",
      422,
      errors
    );
  }
  const email = req.body.email;
  const password = req.body.password;
  let loadUser;
  User.findOne({
    email: email
  })
    .then(userDoc => {
      if (!userDoc) {
        validator.errorHandle("not found this email.", 401);
      } else {
        loadUser = userDoc;
        return bcrypt.compare(password, loadUser.password);
      }
    })
    .then(isEqual => {
      if (!isEqual) {
        validator.errorHandle("wrong password!!.", 401);
      }
      auth
        .generateToken({
          email: loadUser.email,
          userId: loadUser._id.toString()
        })
        .then(token => {
          res.status(200).json({
            userId: loadUser._id.toString(),
            token: token
          });
        });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
