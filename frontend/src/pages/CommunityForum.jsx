import { useState, useEffect } from 'react';
import { MessageSquare, Search, Plus, Heart, MessageCircle, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { useTranslation } from 'react-i18next';
import api from '../services/api';

export default function CommunityForum() {
  const { t } = useTranslation();
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('');
  const [cropTags, setCropTags] = useState([]);
  const [stats, setStats] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    cropTag: '',
    authorName: '',
  });

  const [replyData, setReplyData] = useState({
    content: '',
    authorName: '',
  });

  // Fetch posts
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedCrop) params.cropTag = selectedCrop;
      if (searchTerm) params.search = searchTerm;

      const response = await api.get('/forum/posts', { params });
      const data = response.data;

      if (data.success) {
        setPosts(data.data);
        setError('');
      } else {
        setError(t('common.error'));
      }
    } catch (err) {
      setError(t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  // Fetch crop tags and stats
  const fetchMetadata = async () => {
    try {
      const [tagsRes, statsRes] = await Promise.all([
        api.get('/forum/crop-tags'),
        api.get('/forum/stats'),
      ]);

      const tagsData = tagsRes.data;
      const statsData = statsRes.data;

      if (tagsData.success) setCropTags(tagsData.data);
      if (statsData.success) setStats(statsData.data);
    } catch (err) {
      console.error('Error fetching metadata', err);
    }
  };

  useEffect(() => {
    fetchMetadata();
    fetchPosts();
  }, [selectedCrop, searchTerm]);

  // Handle create post
  const handleCreatePost = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/forum/posts', formData);
      const data = response.data;

      if (data.success) {
        setPosts([data.data, ...posts]);
        setFormData({ title: '', description: '', cropTag: '', authorName: '' });
        setShowCreateForm(false);
        setError('');
      } else {
        setError(data.message || t('common.error'));
      }
    } catch (err) {
      setError(t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  // Handle add reply
  const handleAddReply = async (e, postId) => {
    e.preventDefault();
    if (!replyData.content.trim()) return;

    try {
      const response = await api.post(`/forum/posts/${postId}/replies`, replyData);
      const data = response.data;

      if (data.success) {
        setSelectedPost(data.data);
        setPosts(posts.map((p) => (p.id === postId ? data.data : p)));
        setReplyData({ content: '', authorName: '' });
      }
    } catch (err) {
      setError(t('common.error'));
    }
  };

  // Handle like post
  const handleLikePost = async (postId) => {
    try {
      const response = await api.post(`/forum/posts/${postId}/like`, { userId: 'user-' + Math.random() });
      const data = response.data;
      if (data.success) {
        setPosts(posts.map((p) => (p.id === postId ? data.data : p)));
        if (selectedPost?.id === postId) {
          setSelectedPost(data.data);
        }
      }
    } catch (err) {
      console.error('Error liking post', err);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (selectedPost) {
    return (
      <div className="min-h-screen bg-transparent py-8">
        <div className="container mx-auto p-4">
          <Button
            onClick={() => setSelectedPost(null)}
            className="mb-6 px-4 py-2 bg-primary-600 text-white rounded-agri hover:bg-primary-700"
          >
            ← {t('common.back')}
          </Button>

          <Card className="bg-white/95 border-primary-100 shadow-agri">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-2xl mb-2">{selectedPost.title}</CardTitle>
                  <div className="flex items-center gap-4 text-soil-light text-sm">
                    <span className="font-semibold text-primary-600">{selectedPost.authorName}</span>
                    <span>{formatDate(selectedPost.createdAt)}</span>
                    <span className="flex items-center gap-1">
                      <Eye size={14} /> {selectedPost.viewCount} {t('forum.views')}
                    </span>
                  </div>
                </div>
                <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold whitespace-nowrap">
                  {selectedPost.cropTag}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="prose prose-sm max-w-none">
                <p className="text-soil whitespace-pre-wrap">{selectedPost.description}</p>
              </div>

              <div className="flex gap-4 pt-4 border-t border-primary-100">
                <button
                  onClick={() => handleLikePost(selectedPost.id)}
                  className="flex items-center gap-2 text-soil-light hover:text-primary-600 transition"
                >
                  <Heart size={18} fill={selectedPost.likedBy.length > 0 ? 'red' : 'none'} />
                  <span>{selectedPost.likes}</span>
                </button>
                <div className="flex items-center gap-2 text-soil-light">
                  <MessageCircle size={18} />
                  <span>{selectedPost.replies.length} {t('forum.replies')}</span>
                </div>
              </div>

              {/* Replies Section */}
              <div className="border-t border-primary-100 pt-6">
                <h3 className="font-heading text-lg font-bold mb-4">{t('forum.replies')} ({selectedPost.replies.length})</h3>

                {selectedPost.replies.length === 0 ? (
                  <p className="text-soil-light text-center py-8">{t('forum.no_discussions')}</p>
                ) : (
                  <div className="space-y-4 mb-6">
                    {selectedPost.replies.map((reply) => (
                      <div key={reply.id} className="p-4 bg-cream-50 rounded-agri border border-primary-100">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-semibold text-soil">{reply.authorName}</p>
                            <p className="text-xs text-soil-light">{formatDate(reply.createdAt)}</p>
                          </div>
                          <span className="text-primary-600 font-semibold flex items-center gap-1">
                            <Heart size={14} /> {reply.likes}
                          </span>
                        </div>
                        <p className="text-soil whitespace-pre-wrap">{reply.content}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Reply Form */}
                <form onSubmit={(e) => handleAddReply(e, selectedPost.id)} className="space-y-3 bg-cream-50 p-4 rounded-agri border border-primary-100">
                  <div>
                    <input
                      type="text"
                      placeholder={t('forum.enter_name')}
                      value={replyData.authorName}
                      onChange={(e) => setReplyData({ ...replyData, authorName: e.target.value })}
                      className="w-full px-3 py-2 border border-primary-200 rounded-agri focus:outline-none focus:border-primary-500"
                    />
                  </div>
                  <textarea
                    placeholder={t('forum.reply_placeholder')}
                    rows="3"
                    value={replyData.content}
                    onChange={(e) => setReplyData({ ...replyData, content: e.target.value })}
                    className="w-full px-3 py-2 border border-primary-200 rounded-agri focus:outline-none focus:border-primary-500"
                  />
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary-600 text-white py-2 rounded-agri hover:bg-primary-700"
                  >
                    {t('forum.post_reply')}
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent py-8">
      <div className="container mx-auto p-4">
        {/* Header */}
        <div className="mb-8 animate-fade-in-up">
          <div className="inline-block px-6 py-3 rounded-agri-lg bg-white/80 backdrop-blur-sm border border-primary-100 shadow-agri">
            <h1 className="font-heading text-3xl font-bold text-primary-800 flex items-center gap-3">
              <MessageSquare className="text-primary-600" size={32} />
              {t('forum.title')}
            </h1>
            <p className="text-soil-light mt-2">{t('forum.subtitle')}</p>
          </div>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-gradient-to-br from-primary-50 to-primary-100/50 border-primary-200">
              <CardContent className="pt-6">
                <p className="text-soil-light text-sm mb-1">{t('forum.all_topics')}</p>
                <p className="text-2xl font-bold text-primary-700">{stats.totalPosts}</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-green-50 to-green-100/50 border-green-200">
              <CardContent className="pt-6">
                <p className="text-soil-light text-sm mb-1">{t('forum.replies')}</p>
                <p className="text-2xl font-bold text-green-700">{stats.totalReplies}</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-red-50 to-red-100/50 border-red-200">
              <CardContent className="pt-6">
                <p className="text-soil-light text-sm mb-1">{t('forum.likes')}</p>
                <p className="text-2xl font-bold text-red-700">{stats.totalLikes}</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-gold-50 to-gold-100/50 border-gold-200">
              <CardContent className="pt-6">
                <p className="text-soil-light text-sm mb-1">{t('crop_market.crop_name')}</p>
                <p className="text-2xl font-bold text-gold-700">{stats.activeCropTags}</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-soil-light" size={20} />
            <input
              type="text"
              placeholder={t('forum.search_discussions')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-primary-200 rounded-agri bg-white focus:outline-none focus:border-primary-500"
            />
          </div>
          <select
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
            className="px-4 py-2 border border-primary-200 rounded-agri bg-white focus:outline-none focus:border-primary-500"
          >
            <option value="">{t('cropcalendar.all_crops')}</option>
            {cropTags.map((crop) => (
              <option key={crop} value={crop}>
                {crop}
              </option>
            ))}
          </select>
          <Button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="flex items-center gap-2 px-6 py-2 bg-primary-600 text-white rounded-agri hover:bg-primary-700"
          >
            <Plus size={20} />
            {t('forum.ask_question')}
          </Button>
        </div>

        {/* Create Post Form */}
        {showCreateForm && (
          <Card className="bg-white/95 border-primary-100 shadow-agri mb-6">
            <CardHeader>
              <CardTitle>{t('forum.ask_question')}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreatePost} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-soil mb-2">{t('forum.question_title')}</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder={t('forum.enter_title')}
                    className="w-full px-4 py-2 border border-primary-200 rounded-agri focus:outline-none focus:border-primary-500"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-soil mb-2">{t('forum.crop_tag')}</label>
                    <select
                      value={formData.cropTag}
                      onChange={(e) => setFormData({ ...formData, cropTag: e.target.value })}
                      className="w-full px-4 py-2 border border-primary-200 rounded-agri focus:outline-none focus:border-primary-500"
                    >
                      <option value="">{t('forum.select_tag')}</option>
                      {['Wheat', 'Rice', 'Cotton', 'Corn', 'Sugarcane', 'Potato', 'Tomato'].map((crop) => (
                        <option key={crop} value={crop}>
                          {crop}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-soil mb-2">{t('forum.your_name')}</label>
                    <input
                      type="text"
                      value={formData.authorName}
                      onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                      placeholder={t('forum.enter_name')}
                      className="w-full px-4 py-2 border border-primary-200 rounded-agri focus:outline-none focus:border-primary-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-soil mb-2">{t('forum.description')}</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder={t('forum.enter_description')}
                    rows="5"
                    className="w-full px-4 py-2 border border-primary-200 rounded-agri focus:outline-none focus:border-primary-500"
                  />
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-agri text-sm">
                    {error}
                  </div>
                )}

                <div className="flex gap-3">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-primary-600 text-white py-2 rounded-agri hover:bg-primary-700"
                  >
                    {loading ? t('common.loading') : t('forum.post_btn')}
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-agri hover:bg-gray-400"
                  >
                    {t('common.cancel')}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Posts List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <p className="text-soil-light">{t('common.loading')}</p>
            </div>
          ) : posts.length === 0 ? (
            <Card className="bg-white/95 border-primary-100">
              <CardContent className="py-16 text-center">
                <MessageSquare className="mx-auto text-primary-300 mb-4" size={48} />
                <p className="text-soil-light">{t('forum.no_discussions')}</p>
              </CardContent>
            </Card>
          ) : (
            posts.map((post) => (
              <Card
                key={post.id}
                onClick={() => setSelectedPost(post)}
                className="bg-white/95 border-primary-100 hover:shadow-card-hover hover:-translate-y-1 cursor-pointer transition-all duration-300"
              >
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-soil hover:text-primary-600">{post.title}</h3>
                      <p className="text-soil-light text-sm mt-1">by {post.authorName}</p>
                    </div>
                    <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-semibold whitespace-nowrap">
                      {post.cropTag}
                    </span>
                  </div>

                  <p className="text-soil text-sm line-clamp-2 mb-3">{post.description}</p>

                  <div className="flex gap-6 text-soil-light text-sm">
                    <span className="flex items-center gap-1">
                      <Heart size={16} /> {post.likes}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPost(post);
                      }}
                      className="flex items-center gap-1 hover:text-primary-600 transition"
                    >
                      <MessageSquare size={16} /> {t('forum.post_reply')}
                    </button>
                    <span className="flex items-center gap-1">
                      <MessageCircle size={16} /> {post.replies.length}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye size={16} /> {post.viewCount}
                    </span>
                    <span className="ml-auto text-xs">{formatDate(post.createdAt)}</span>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
