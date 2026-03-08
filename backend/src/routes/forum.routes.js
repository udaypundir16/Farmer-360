/**
 * Forum Routes
 * Routes for community forum operations
 */

const express = require('express');
const router = express.Router();
const forumController = require('../controllers/forum.controller');

// GET - Get forum statistics
router.get('/stats', forumController.getForumStats);

// GET - Get available crop tags
router.get('/crop-tags', forumController.getCropTags);

// GET - Get all forum posts (with optional filters)
router.get('/posts', forumController.getAllPosts);

// POST - Create a new forum post
router.post('/posts', forumController.createPost);

// GET - Get a specific post
router.get('/posts/:id', forumController.getPostById);

// POST - Add a reply to a post
router.post('/posts/:id/replies', forumController.addReply);

// POST - Like a post
router.post('/posts/:id/like', forumController.likePost);

// POST - Like a reply
router.post('/posts/:postId/replies/:replyId/like', forumController.likeReply);

// DELETE - Delete a post
router.delete('/posts/:id', forumController.deletePost);

module.exports = router;
