const jwt = require("jsonwebtoken");
const { port, env, jwtSecret } = require("../config/vars");
const bcrypt = require("bcrypt");
const Sal_Round = 12;
const expiresIn = "1h";

function generateToken(reqObject) {
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
}

function verifyToken(token) {
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
}

function encrypt(reqString) {
  return new Promise((resolve, reject) => {
    return bcrypt.hash(reqString, Sal_Round, (error, hash) => {
      if (error) {
        return reject(error);
      } else {
        return resolve(hash);
      }
    });
  });
}

module.exports = {
  verifyToken: verifyToken,
  encrypt: encrypt,
  generateToken: generateToken
};
