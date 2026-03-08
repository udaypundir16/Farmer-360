/**
 * Forum Service
 * Handles business logic for forum operations — all methods async for Supabase
 */

const ForumPostModel = require('../models/forum-post.model');
const logger = require('../utils/logger');

class ForumService {
  /**
   * Create a new forum post
   */
  async createPost(postData) {
    try {
      if (!postData.title || !postData.description || !postData.cropTag) {
        return { success: false, message: 'Title, description, and cropTag are required' };
      }
      if (postData.title.length < 5 || postData.title.length > 200) {
        return { success: false, message: 'Title must be between 5 and 200 characters' };
      }
      if (postData.description.length < 20 || postData.description.length > 5000) {
        return { success: false, message: 'Description must be between 20 and 5000 characters' };
      }

      const post = await ForumPostModel.createPost(postData);
      logger.info({ message: 'Forum post created', postId: post.id, cropTag: post.cropTag });
      return { success: true, message: 'Post created successfully', data: post };
    } catch (error) {
      logger.error('Error creating forum post', error);
      return { success: false, message: 'Error creating post', error: error.message };
    }
  }

  /**
   * Get all forum posts
   */
  async getAllPosts(filters = {}) {
    try {
      const posts = await ForumPostModel.getAllPosts(filters);
      return { success: true, message: 'Posts retrieved successfully', data: posts, meta: { total: posts.length, filters } };
    } catch (error) {
      logger.error('Error fetching forum posts', error);
      return { success: false, message: 'Error fetching posts', error: error.message };
    }
  }

  /**
   * Get a single post by ID
   */
  async getPostById(postId) {
    try {
      const post = await ForumPostModel.getPostById(postId);
      if (!post) return { success: false, message: 'Post not found' };
      return { success: true, message: 'Post retrieved successfully', data: post };
    } catch (error) {
      logger.error('Error fetching post', error);
      return { success: false, message: 'Error fetching post', error: error.message };
    }
  }

  /**
   * Delete a post
   */
  async deletePost(postId) {
    try {
      const post = await ForumPostModel.getPostById(postId);
      if (!post) return { success: false, message: 'Post not found' };

      await ForumPostModel.deletePost(postId);
      logger.info({ message: 'Forum post deleted', postId });
      return { success: true, message: 'Post deleted successfully' };
    } catch (error) {
      logger.error('Error deleting post', error);
      return { success: false, message: 'Error deleting post', error: error.message };
    }
  }

  /**
   * Add a reply to a post
   */
  async addReply(postId, replyData) {
    try {
      if (!replyData.content || replyData.content.trim() === '') {
        return { success: false, message: 'Reply content is required' };
      }
      if (replyData.content.length < 5 || replyData.content.length > 2000) {
        return { success: false, message: 'Reply must be between 5 and 2000 characters' };
      }

      const post = await ForumPostModel.addReply(postId, replyData);
      if (!post) return { success: false, message: 'Post not found' };

      logger.info({ message: 'Reply added to forum post', postId, replyCount: post.replies.length });
      return { success: true, message: 'Reply added successfully', data: post };
    } catch (error) {
      logger.error('Error adding reply', error);
      return { success: false, message: 'Error adding reply', error: error.message };
    }
  }

  /**
   * Like a post
   */
  async likePost(postId, userId) {
    try {
      if (!userId) return { success: false, message: 'User ID is required' };

      const post = await ForumPostModel.togglePostLike(postId, userId);
      if (!post) return { success: false, message: 'Post not found' };

      logger.info({ message: 'Post like toggled', postId, userId, likes: post.likes });
      return { success: true, message: 'Post like toggled successfully', data: post };
    } catch (error) {
      logger.error('Error liking post', error);
      return { success: false, message: 'Error liking post', error: error.message };
    }
  }

  /**
   * Like a reply
   */
  async likeReply(postId, replyId, userId) {
    try {
      if (!userId) return { success: false, message: 'User ID is required' };

      const post = await ForumPostModel.toggleReplyLike(postId, replyId, userId);
      if (!post) return { success: false, message: 'Post not found' };

      return { success: true, message: 'Reply like toggled successfully', data: post };
    } catch (error) {
      logger.error('Error liking reply', error);
      return { success: false, message: 'Error liking reply', error: error.message };
    }
  }

  /**
   * Get forum statistics
   */
  async getForumStats() {
    try {
      const stats = await ForumPostModel.getStats();
      return { success: true, message: 'Forum statistics retrieved', data: stats };
    } catch (error) {
      logger.error('Error fetching forum stats', error);
      return { success: false, message: 'Error fetching forum statistics', error: error.message };
    }
  }

  /**
   * Get available crop tags
   */
  async getCropTags() {
    try {
      const tags = await ForumPostModel.getCropTags();
      return { success: true, message: 'Crop tags retrieved', data: tags };
    } catch (error) {
      logger.error('Error fetching crop tags', error);
      return { success: false, message: 'Error fetching crop tags', error: error.message };
    }
  }
}

module.exports = new ForumService();
