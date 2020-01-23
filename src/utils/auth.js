const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/vars");
const bcrypt = require("bcrypt");
const Sal_Round = 12;
const expiresIn = "1h";

const generateToken = reqObject => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      reqObject,
      jwtSecret,
      { expiresIn: expiresIn },
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
    // Authorization: Bearer <token>
    const accessToken = token.split(" ")[1];
    return new Promise((resolve, reject) => {
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
  const token = headerAuth.split(" ")[1];
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
  req.userId = decodeToken.userId;
  next();
};

const encrypt = reqString => {
  return new Promise((resolve, reject) => {
    return bcrypt.hash(reqString, Sal_Round, (error, hash) => {
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
  checkAuth: checkAuth
};
