const express = require("express");
const feedController = require("../controllers/feed");
const validator = require("../utils/validator");
const auth = require("../utils/auth");

const router = express.Router();

// GET /fees/posts
router.get("/posts", auth.checkAuth, validator.feedController.getPosts, feedController.getPosts);
router.get("/post/:postId", auth.checkAuth, validator.feedController.getPost, feedController.getPost);
router.post(
  "/post",
  auth.checkAuth,
  validator.feedController.createPost,
  feedController.createPost
);
router.put(
  "/post/:postId",
  auth.checkAuth,
  validator.feedController.getPost,
  validator.feedController.createPost,
  feedController.updatePost
);
router.delete("/post/:postId", auth.checkAuth, feedController.removePost);

module.exports = router;