import { useEffect, useState } from 'react';
import { getAnalytics } from '../services/admin.service';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Trash2, AlertCircle } from 'lucide-react';
import api from '../services/api';

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [cropTrades, setCropTrades] = useState([]);
  const [shipments, setShipments] = useState([]);
  const [forumPosts, setForumPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    getAnalytics().then(setAnalytics);
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      setLoading(true);
      setMessage('');
      const [tradesRes, shipmentsRes, forumRes] = await Promise.all([
        api.get('/admin/crop-trades').catch((error) => {
          console.error('Crop trades fetch error:', error.response?.data || error.message);
          return { data: { trades: [] } };
        }),
        api.get('/admin/shipments').catch((error) => {
          console.error('Shipments fetch error:', error.response?.data || error.message);
          return { data: { shipments: [] } };
        }),
        api.get('/admin/forum-posts').catch((error) => {
          console.error('Forum posts fetch error:', error.response?.data || error.message);
          return { data: { posts: [] } };
        })
      ]);
      
      console.log('Crop trades data:', tradesRes.data);
      console.log('Shipments data:', shipmentsRes.data);
      console.log('Forum posts data:', forumRes.data);
      
      setCropTrades(tradesRes.data.trades || []);
      setShipments(shipmentsRes.data.shipments || []);
      setForumPosts(forumRes.data.posts || []);
    } catch (error) {
      console.error('Error loading content:', error);
      setMessage('Error loading content. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const deleteCropTrade = async (id) => {
    if (!window.confirm('Are you sure you want to delete this crop trade post?')) return;
    try {
      await api.delete(`/admin/crop-trades/${id}`);
      setCropTrades(cropTrades.filter(ct => ct.id !== id));
      setMessage('Crop trade deleted successfully');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Failed to delete crop trade');
    }
  };

  const deleteShipment = async (id) => {
    if (!window.confirm('Are you sure you want to delete this shipment?')) return;
    try {
      await api.delete(`/admin/shipments/${id}`);
      setShipments(shipments.filter(s => s.id !== id));
      setMessage('Shipment deleted successfully');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Failed to delete shipment');
    }
  };

  const deleteForumPost = async (id) => {
    if (!window.confirm('Are you sure you want to delete this forum post?')) return;
    try {
      await api.delete(`/admin/forum-posts/${id}`);
      setForumPosts(forumPosts.filter(fp => fp.id !== id));
      setMessage('Forum post deleted successfully');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Failed to delete forum post');
    }
  };

  if (!analytics) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">Admin Dashboard</h1>

        {message && (
          <div className={`mb-4 p-4 rounded-lg ${message.includes('successfully') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {message}
          </div>
        )}

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader><CardTitle>Total Users</CardTitle></CardHeader>
            <CardContent><p className="text-3xl font-bold">{analytics.totalUsers}</p></CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Active Schemes</CardTitle></CardHeader>
            <CardContent><p className="text-3xl font-bold">{analytics.activeSchemes}</p></CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Active Alerts</CardTitle></CardHeader>
            <CardContent><p className="text-3xl font-bold">{analytics.activeAlerts}</p></CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Applications</CardTitle></CardHeader>
            <CardContent><p className="text-3xl font-bold">{analytics.totalApplications}</p></CardContent>
          </Card>
        </div>

        {/* Content Management Tabs */}
        <Card>
          <CardHeader>
            <CardTitle>Content Management</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="crops" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="crops">Crop Posts</TabsTrigger>
                <TabsTrigger value="shipments">Shipments</TabsTrigger>
                <TabsTrigger value="forum">Forum Posts</TabsTrigger>
              </TabsList>

              {/* Crop Trades Tab */}
              <TabsContent value="crops" className="mt-6">
                <div className="space-y-4">
                  {cropTrades.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No crop trades found</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="px-4 py-2 text-left">Crop</th>
                            <th className="px-4 py-2 text-left">Type</th>
                            <th className="px-4 py-2 text-left">Quantity</th>
                            <th className="px-4 py-2 text-left">Price</th>
                            <th className="px-4 py-2 text-left">Status</th>
                            <th className="px-4 py-2">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {cropTrades.map((trade) => (
                            <tr key={trade.id} className="border-b hover:bg-gray-50">
                              <td className="px-4 py-2">{trade.crop}</td>
                              <td className="px-4 py-2"><span className={`px-2 py-1 rounded text-xs font-semibold ${trade.type === 'buy' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>{trade.type}</span></td>
                              <td className="px-4 py-2">{trade.quantity}</td>
                              <td className="px-4 py-2">₹{trade.price_per_unit}</td>
                              <td className="px-4 py-2">{trade.status}</td>
                              <td className="px-4 py-2 text-center">
                                <button
                                  onClick={() => deleteCropTrade(trade.id)}
                                  className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded"
                                  title="Delete"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Shipments Tab */}
              <TabsContent value="shipments" className="mt-6">
                <div className="space-y-4">
                  {shipments.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No shipments found</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="px-4 py-2 text-left">ID</th>
                            <th className="px-4 py-2 text-left">From</th>
                            <th className="px-4 py-2 text-left">To</th>
                            <th className="px-4 py-2 text-left">Status</th>
                            <th className="px-4 py-2">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {shipments.map((shipment) => (
                            <tr key={shipment.id} className="border-b hover:bg-gray-50">
                              <td className="px-4 py-2 font-mono text-xs">{shipment.id?.slice(0, 8)}...</td>
                              <td className="px-4 py-2">{shipment.from_location}</td>
                              <td className="px-4 py-2">{shipment.to_location}</td>
                              <td className="px-4 py-2"><span className="px-2 py-1 rounded text-xs font-semibold bg-yellow-100 text-yellow-700">{shipment.status}</span></td>
                              <td className="px-4 py-2 text-center">
                                <button
                                  onClick={() => deleteShipment(shipment.id)}
                                  className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded"
                                  title="Delete"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Forum Posts Tab */}
              <TabsContent value="forum" className="mt-6">
                <div className="space-y-4">
                  {forumPosts.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No forum posts found</p>
                  ) : (
                    <div className="space-y-3">
                      {forumPosts.map((post) => (
                        <div key={post.id} className="border rounded-lg p-4 hover:bg-gray-50 flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{post.title}</h3>
                            <p className="text-gray-600 text-sm mt-1 line-clamp-2">{post.content}</p>
                            <p className="text-gray-500 text-xs mt-2">By: {post.author_name || 'Anonymous'}</p>
                          </div>
                          <button
                            onClick={() => deleteForumPost(post.id)}
                            className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded ml-4"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Analytics Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <Card>
            <CardHeader><CardTitle>User Registrations (Last 30 days)</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.registrations}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#22c55e" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Top Commodities Searched</CardTitle></CardHeader>
            <CardContent>
              <ul>
                {analytics.topCommodities?.map((c, i) => (
                  <li key={i} className="flex justify-between py-2 border-b last:border-b-0">
                    <span className="text-gray-700">{c.commodity}</span>
                    <span className="font-semibold text-gray-900">{c.count}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}