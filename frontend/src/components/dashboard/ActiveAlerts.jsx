import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';
import { getUserAlerts } from '../../services/alert.service';
import React from 'react';
import { Bell, TrendingUp, TrendingDown } from 'lucide-react';

export default function ActiveAlerts() {
  const [alerts, setAlerts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    try {
      const data = await getUserAlerts();
      const alertsData = Array.isArray(data) ? data : (data.alerts || []);
      setAlerts(alertsData.slice(0, 3));
    } catch (error) {
      console.error('Error loading alerts:', error);
      // Mock data for demo
      setAlerts([
        { id: 1, commodity: 'Wheat', target_price: 2200, alert_type: 'above', triggered: false },
        { id: 2, commodity: 'Rice', target_price: 1800, alert_type: 'below', triggered: true },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p className="text-gray-500 text-sm">Loading...</p>;
  }

  if (alerts.length === 0) {
    return (
      <div className="text-center py-4">
        <Bell size={32} className="text-gray-300 mx-auto mb-2" />
        <p className="text-gray-500 text-sm mb-2">No active alerts</p>
        <Link to="/alerts">
          <Button size="sm" variant="outline" className="text-xs">Create Alert</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {alerts.map((alert) => (
        <div key={alert.id} className={`p-3 rounded-lg border ${
          alert.triggered ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between mb-1">
            <span className="font-semibold text-sm">{alert.commodity}</span>
            {alert.alert_type === 'above' ? (
              <TrendingUp size={16} className="text-green-600" />
            ) : (
              <TrendingDown size={16} className="text-red-600" />
            )}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600">
              {alert.alert_type === 'above' ? 'Above' : 'Below'} ₹{alert.target_price}
            </span>
            {alert.triggered && (
              <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">Triggered</span>
            )}
          </div>
        </div>
      ))}
      {alerts.length >= 3 && (
        <Link to="/alerts" className="block text-center mt-2">
          <Button size="sm" variant="outline" className="text-xs w-full">View All</Button>
        </Link>
      )}
    </div>
  );
}
