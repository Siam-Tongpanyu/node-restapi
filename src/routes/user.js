const express = require("express");
const userController = require("../controllers/user");
const validator = require("../utils/validator");
const auth = require("../utils/auth");

const router = express.Router();

router.put("/signup", validator.userController.signup, userController.signup);
router.post("/login", validator.userController.login, userController.login);
router.get("/status", auth.checkAuth, userController.getStatus);
router.put(
  "/status",
  auth.checkAuth,
  validator.userController.updateStatus,
  userController.updateStatus
);

module.exports = router;
