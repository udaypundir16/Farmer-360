/**
 * Forum Post Model — Supabase-backed
 */

const { supabase } = require('../config/database');

class ForumPostModel {
  /**
   * Create a new forum post
   */
  static async createPost(postData) {
    const { data, error } = await supabase
      .from('forum_posts')
      .insert({
        title: postData.title,
        description: postData.description,
        crop_tag: postData.cropTag,
        author_id: postData.authorId || 'anonymous',
        author_name: postData.authorName || 'Anonymous Farmer',
      })
      .select()
      .single();

    if (error) throw error;

    // Return in the shape the frontend expects
    return this._formatPost(data, []);
  }

  /**
   * Get all posts with optional filtering
   */
  static async getAllPosts(filters = {}) {
    let query = supabase.from('forum_posts').select('*');

    if (filters.cropTag) {
      query = query.ilike('crop_tag', filters.cropTag);
    }

    if (filters.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }

    query = query.order('created_at', { ascending: false });

    const { data: posts, error } = await query;
    if (error) throw error;

    // Fetch replies for all posts
    const postIds = posts.map((p) => p.id);
    let replies = [];
    if (postIds.length > 0) {
      const { data: repliesData } = await supabase
        .from('forum_replies')
        .select('*')
        .in('post_id', postIds)
        .order('created_at', { ascending: true });
      replies = repliesData || [];
    }

    // Group replies by post_id
    const repliesByPost = {};
    for (const r of replies) {
      if (!repliesByPost[r.post_id]) repliesByPost[r.post_id] = [];
      repliesByPost[r.post_id].push(this._formatReply(r));
    }

    return posts.map((p) => this._formatPost(p, repliesByPost[p.id] || []));
  }

  /**
   * Get a post by ID (also increments view count)
   */
  static async getPostById(postId) {
    const { data: post, error } = await supabase
      .from('forum_posts')
      .select('*')
      .eq('id', postId)
      .single();

    if (error || !post) return null;

    // Increment view count
    await supabase
      .from('forum_posts')
      .update({ view_count: (post.view_count || 0) + 1 })
      .eq('id', postId);

    post.view_count = (post.view_count || 0) + 1;

    // Fetch replies
    const { data: replies } = await supabase
      .from('forum_replies')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    return this._formatPost(post, (replies || []).map((r) => this._formatReply(r)));
  }

  /**
   * Delete a post (replies cascade-delete automatically)
   */
  static async deletePost(postId) {
    const { error } = await supabase
      .from('forum_posts')
      .delete()
      .eq('id', postId);

    if (error) throw error;
    return true;
  }

  /**
   * Add a reply to a post
   */
  static async addReply(postId, replyData) {
    // Verify post exists
    const { data: post } = await supabase
      .from('forum_posts')
      .select('id')
      .eq('id', postId)
      .single();

    if (!post) return null;

    const { error } = await supabase
      .from('forum_replies')
      .insert({
        post_id: postId,
        author_id: replyData.authorId || 'anonymous',
        author_name: replyData.authorName || 'Anonymous Farmer',
        content: replyData.content,
      });

    if (error) throw error;

    // Return the full updated post
    return this.getPostById(postId);
  }

  /**
   * Toggle like on a post
   */
  static async togglePostLike(postId, userId) {
    const { data: post, error } = await supabase
      .from('forum_posts')
      .select('*')
      .eq('id', postId)
      .single();

    if (error || !post) return null;

    const likedBy = post.liked_by || [];
    const idx = likedBy.indexOf(userId);
    let newLikes = post.likes || 0;

    if (idx > -1) {
      likedBy.splice(idx, 1);
      newLikes = Math.max(0, newLikes - 1);
    } else {
      likedBy.push(userId);
      newLikes += 1;
    }

    await supabase
      .from('forum_posts')
      .update({ likes: newLikes, liked_by: likedBy })
      .eq('id', postId);

    return this.getPostById(postId);
  }

  /**
   * Toggle like on a reply
   */
  static async toggleReplyLike(postId, replyId, userId) {
    const { data: reply, error } = await supabase
      .from('forum_replies')
      .select('*')
      .eq('id', replyId)
      .single();

    if (error || !reply) return null;

    const likedBy = reply.liked_by || [];
    const idx = likedBy.indexOf(userId);
    let newLikes = reply.likes || 0;

    if (idx > -1) {
      likedBy.splice(idx, 1);
      newLikes = Math.max(0, newLikes - 1);
    } else {
      likedBy.push(userId);
      newLikes += 1;
    }

    await supabase
      .from('forum_replies')
      .update({ likes: newLikes, liked_by: likedBy })
      .eq('id', replyId);

    return this.getPostById(postId);
  }

  /**
   * Get unique crop tags
   */
  static async getCropTags() {
    const { data, error } = await supabase
      .from('forum_posts')
      .select('crop_tag');

    if (error) throw error;

    const tags = new Set();
    (data || []).forEach((row) => {
      if (row.crop_tag) tags.add(row.crop_tag);
    });
    return Array.from(tags).sort();
  }

  /**
   * Get forum statistics
   */
  static async getStats() {
    const { data: posts } = await supabase.from('forum_posts').select('likes, view_count');
    const { count: replyCount } = await supabase.from('forum_replies').select('id', { count: 'exact', head: true });

    const totalPosts = (posts || []).length;
    const totalLikes = (posts || []).reduce((sum, p) => sum + (p.likes || 0), 0);
    const totalViews = (posts || []).reduce((sum, p) => sum + (p.view_count || 0), 0);
    const tags = await this.getCropTags();

    return {
      totalPosts,
      totalReplies: replyCount || 0,
      totalLikes,
      totalViews,
      activeCropTags: tags.length,
    };
  }

  // ---- Helpers ----

  static _formatPost(dbRow, replies = []) {
    return {
      id: dbRow.id,
      title: dbRow.title,
      description: dbRow.description,
      cropTag: dbRow.crop_tag,
      authorId: dbRow.author_id,
      authorName: dbRow.author_name,
      likes: dbRow.likes || 0,
      likedBy: dbRow.liked_by || [],
      viewCount: dbRow.view_count || 0,
      createdAt: dbRow.created_at,
      updatedAt: dbRow.updated_at,
      replies,
    };
  }

  static _formatReply(dbRow) {
    return {
      id: dbRow.id,
      postId: dbRow.post_id,
      authorId: dbRow.author_id,
      authorName: dbRow.author_name,
      content: dbRow.content,
      likes: dbRow.likes || 0,
      likedBy: dbRow.liked_by || [],
      createdAt: dbRow.created_at,
    };
  }
}

module.exports = ForumPostModel;
