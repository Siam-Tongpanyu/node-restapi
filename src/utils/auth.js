const jwt = require("jsonwebtoken");
const {
  jwtSecret
} = require("../config/vars");
const bcrypt = require("bcrypt");
const validator = require("../utils/validator");
const sal_Round = 12;
const expiresIn = "1h";

const generateToken = reqObject => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      reqObject,
      jwtSecret, {
        expiresIn: expiresIn
      },
      (error, newToken) => {
        if (error) {
          reject(error);
        } else {
          resolve(newToken);
        }
      }
    );
  });
};

const verifyToken = token => {
  if (token) {
    return new Promise((resolve, reject) => {
      // Authorization: Bearer <token>
      const accessToken = token.split(" ")[1];
      if (!accessToken) {
        reject("Your header authorization is incorrect!!");
      }
      jwt.verify(accessToken, jwtSecret, (error, decode) => {
        if (error) {
          reject("Your authorization is incorrect!!");
        } else {
          resolve(decode);
        }
      });
    });
  }
};

// function checkAuth use for middleware in routes
const checkAuth = (req, res, next) => {
  const headerAuth = req.get("Authorization");
  if (!headerAuth) {
    error = new Error("Not authenticated");
    error.statusCode = 401;
    throw error;
  }
  let token = '';
  if (headerAuth.trim().split(" ").length == 2) {
    token = headerAuth.split(" ")[1];
  } else {
    error = new Error("Not found token");
    error.statusCode = 404;
    throw error;
  }
  let decodeToken;
  try {
    decodeToken = jwt.verify(token, jwtSecret);
  } catch (err) {
    err.statusCode = 500;
    throw err;
  }
  if (!decodeToken) {
    error = new Error("Not authenticated");
    error.statusCode = 401;
    throw error;
  }
  if (validator.checkMongoId(decodeToken.userId)) {
    req.userId = decodeToken.userId;
  }
  next();
};

const encrypt = reqString => {
  return new Promise((resolve, reject) => {
    return bcrypt.hash(reqString, sal_Round, (error, hash) => {
      if (error) {
        return reject(error);
      } else {
        return resolve(hash);
      }
    });
  });
};

module.exports = {
  verifyToken: verifyToken,
  encrypt: encrypt,
  generateToken: generateToken,
  checkAuth: checkAuth,
  sal_Round: sal_Round,
  expiresIn: expiresIn
};