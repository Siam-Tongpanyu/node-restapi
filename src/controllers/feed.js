const {
  check,
  body,
  validationResult
} = require('express-validator');
const Post = require('../models/post');
const validator = require('../utils/validator');
const path = require('path');
const fs = require('fs');

const deleteFile = (filePath) => {
  filePath = path.join(__dirname, '..', filePath);
  fs.unlink(filePath, err => {
    if (err) {
      console.log(err);
    }
  });
};

exports.getPosts = (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = 5;
  let totalItems;
  Post.find().countDocuments().then(count => {
    totalItems = count;
    return Post.find().skip((currentPage - 1) * perPage).limit(perPage);
  }).then(posts => {
    console.log()
    res.status(200).json({
      message: 'find posts successfuly.',
      posts: posts,
      totalItems: totalItems
    });
  }).catch(err => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  });
};
exports.createPost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    validator.errorHandle('Validation error!! Please check title or content.', 422);
  }
  if (!req.file) {
    validator.errorHandle('No image provide.', 422, errors);
  }
  const imageUrl = 'images/' + path.basename(req.file.path);
  const title = req.body.title;
  const content = req.body.content;
  const post = new Post({
    title: title,
    content: content,
    creator: {
      name: 'Alexis'
    },
    imageUrl: imageUrl
  });
  post.save().then(result => {
    res.status(201).json({
      message: 'Create post successful',
      post: result
    });
  }).catch(err => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  });
};

exports.getPost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId).then(post => {
    if (!post) {
      validator.errorHandle('Could not find post.', 404);
    }
    res.status(200).json({
      message: 'Found post',
      post: post
    });
  }).catch(err => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  });
}

exports.updatePost = (req, res, next) => {
  const postId = req.params.postId;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    validator.errorHandle('Validation error!! Please check title or content.', 422);
  }
  const title = req.body.title;
  const content = req.body.content;
  let imageUrl = req.body.image;
  if (req.file) {
    imageUrl = 'images/' + path.basename(req.file.path);
  }
  if (!imageUrl) {
    validator.errorHandle('no image file.', 422);
  }
  Post.findById(postId).then(post => {
    if (!post) {
      validator.errorHandle('Could not find post.', 404);
    }
    if (post.imageUrl !== imageUrl) {
      deleteFile(post.imageUrl);
    }
    post.title = title;
    post.content = content;
    post.imageUrl = imageUrl;
    post.save();
  }).then(result => {
    res.status(200).json({
      message: 'Update post successful',
      post: result
    });
  }).catch(err => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  });
}

exports.removePost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId).then(post => {
    if (!post) {
      validator.errorHandle('Could not find post.', 404);
    }
    // Check login User
    deleteFile(post.imageUrl);
    return Post.findByIdAndRemove(postId);
  }).then(result => {
    res.status(200).json({
      message: 'Delete post successful.'
    });
  }).catch(err => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  });
}