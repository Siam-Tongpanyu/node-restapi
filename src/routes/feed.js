const express = require('express');
const feedController = require('../controllers/feed');
const validator = require('../utils/validator');

const router = express.Router();

// GET /fees/posts
router.get('/posts', feedController.getPosts);
router.get('/post/:postId', feedController.getPost);
router.post('/post', validator.feedController.createPost, feedController.createPost);
router.put('/post/:postId', validator.feedController.createPost, feedController.updatePost);
router.delete('/post/:postId', feedController.removePost);

module.exports = router;