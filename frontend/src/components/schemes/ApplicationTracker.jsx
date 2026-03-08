import { useEffect, useState } from 'react';
import { getUserApplications } from '../../services/user.service';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Calendar, MapPin, DollarSign } from 'lucide-react';

export default function ApplicationTracker() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const data = await getUserApplications();
      setApplications(data);
    } catch (error) {
      console.error('Failed to load applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    completed: 'bg-blue-100 text-blue-800',
  };

  if (loading) return <div className="text-center py-4">Loading applications...</div>;

  return (
    <div className="space-y-4">
      {applications.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No applications yet. Apply for schemes to track them here.</p>
        </div>
      ) : (
        applications.map(app => (
          <Card key={app.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{app.scheme_name}</CardTitle>
                  <p className="text-sm text-gray-600">{app.scheme_code}</p>
                </div>
                <Badge className={statusColors[app.status] || statusColors.pending}>
                  {app.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <Calendar size={16} className="text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500">Applied on</p>
                    <p className="font-semibold">{new Date(app.applied_date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <DollarSign size={16} className="text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500">Amount</p>
                    <p className="font-semibold">₹{app.amount?.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin size={16} className="text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500">District</p>
                    <p className="font-semibold">{app.district}</p>
                  </div>
                </div>
              </div>
              {app.remarks && (
                <div className="mt-4 p-3 bg-gray-50 rounded">
                  <p className="text-xs text-gray-600 font-semibold">Remarks:</p>
                  <p className="text-sm text-gray-700">{app.remarks}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
