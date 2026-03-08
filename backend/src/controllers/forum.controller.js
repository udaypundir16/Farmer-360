/**
 * Forum Controller
 * Handles HTTP requests for forum operations
 */

const forumService = require('../services/forum.service');
const logger = require('../utils/logger');

class ForumController {
  /**
   * Create a new forum post
   * @route POST /api/v1/forum/posts
   */
  async createPost(req, res) {
    try {
      const { title, description, cropTag, authorName, authorId } = req.body;

      const result = await forumService.createPost({
        title,
        description,
        cropTag,
        authorName: authorName || 'Anonymous Farmer',
        authorId: authorId || 'anon-' + Date.now(),
      });

      if (!result.success) {
        return res.status(400).json(result);
      }
      return res.status(201).json(result);
    } catch (error) {
      logger.error('Error in createPost controller', error);
      return res.status(500).json({ success: false, message: 'Error creating post', error: error.message });
    }
  }

  /**
   * Get all forum posts
   * @route GET /api/v1/forum/posts
   */
  async getAllPosts(req, res) {
    try {
      const { cropTag, search } = req.query;
      const filters = {};
      if (cropTag) filters.cropTag = cropTag;
      if (search) filters.search = search;

      const result = await forumService.getAllPosts(filters);
      if (!result.success) {
        return res.status(400).json(result);
      }
      return res.status(200).json(result);
    } catch (error) {
      logger.error('Error in getAllPosts controller', error);
      return res.status(500).json({ success: false, message: 'Error fetching posts', error: error.message });
    }
  }

  /**
   * Get a single post by ID
   * @route GET /api/v1/forum/posts/:id
   */
  async getPostById(req, res) {
    try {
      const { id } = req.params;
      const result = await forumService.getPostById(id);
      if (!result.success) {
        return res.status(404).json(result);
      }
      return res.status(200).json(result);
    } catch (error) {
      logger.error('Error in getPostById controller', error);
      return res.status(500).json({ success: false, message: 'Error fetching post', error: error.message });
    }
  }

  /**
   * Delete a forum post
   * @route DELETE /api/v1/forum/posts/:id
   */
  async deletePost(req, res) {
    try {
      const { id } = req.params;
      const result = await forumService.deletePost(id);
      if (!result.success) {
        return res.status(404).json(result);
      }
      return res.status(200).json(result);
    } catch (error) {
      logger.error('Error in deletePost controller', error);
      return res.status(500).json({ success: false, message: 'Error deleting post', error: error.message });
    }
  }

  /**
   * Add a reply to a post
   * @route POST /api/v1/forum/posts/:id/replies
   */
  async addReply(req, res) {
    try {
      const { id } = req.params;
      const { content, authorName, authorId } = req.body;

      const result = await forumService.addReply(id, {
        content,
        authorName: authorName || 'Anonymous Farmer',
        authorId: authorId || 'anon-' + Date.now(),
      });

      if (!result.success) {
        return res.status(400).json(result);
      }
      return res.status(201).json(result);
    } catch (error) {
      logger.error('Error in addReply controller', error);
      return res.status(500).json({ success: false, message: 'Error adding reply', error: error.message });
    }
  }

  /**
   * Like a post
   * @route POST /api/v1/forum/posts/:id/like
   */
  async likePost(req, res) {
    try {
      const { id } = req.params;
      const { userId } = req.body;

      const result = await forumService.likePost(id, userId);
      if (!result.success) {
        return res.status(400).json(result);
      }
      return res.status(200).json(result);
    } catch (error) {
      logger.error('Error in likePost controller', error);
      return res.status(500).json({ success: false, message: 'Error liking post', error: error.message });
    }
  }

  /**
   * Like a reply
   * @route POST /api/v1/forum/posts/:postId/replies/:replyId/like
   */
  async likeReply(req, res) {
    try {
      const { postId, replyId } = req.params;
      const { userId } = req.body;

      const result = await forumService.likeReply(postId, replyId, userId);
      if (!result.success) {
        return res.status(400).json(result);
      }
      return res.status(200).json(result);
    } catch (error) {
      logger.error('Error in likeReply controller', error);
      return res.status(500).json({ success: false, message: 'Error liking reply', error: error.message });
    }
  }

  /**
   * Get forum statistics
   * @route GET /api/v1/forum/stats
   */
  async getForumStats(req, res) {
    try {
      const result = await forumService.getForumStats();
      if (!result.success) {
        return res.status(400).json(result);
      }
      return res.status(200).json(result);
    } catch (error) {
      logger.error('Error in getForumStats controller', error);
      return res.status(500).json({ success: false, message: 'Error fetching forum statistics', error: error.message });
    }
  }

  /**
   * Get available crop tags
   * @route GET /api/v1/forum/crop-tags
   */
  async getCropTags(req, res) {
    try {
      const result = await forumService.getCropTags();
      if (!result.success) {
        return res.status(400).json(result);
      }
      return res.status(200).json(result);
    } catch (error) {
      logger.error('Error in getCropTags controller', error);
      return res.status(500).json({ success: false, message: 'Error fetching crop tags', error: error.message });
    }
  }
}

module.exports = new ForumController();
