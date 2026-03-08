import { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import AlertCard from '../components/alerts/AlertCard';
import CreateAlert from '../components/alerts/CreateAlert';
import { getUserAlerts, deleteAlert } from '../services/alert.service';
import Loader from '../components/ui/loader';
import { Bell, Plus, AlertCircle } from 'lucide-react';

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    try {
      const data = await getUserAlerts();
      const alertsData = Array.isArray(data) ? data : (data.alerts || []);
      setAlerts(alertsData);
    } catch (error) {
      console.error('Error loading alerts:', error);
      setAlerts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteAlert(id);
      loadAlerts();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 py-8">
      <style>{`
        @keyframes slideDownWithBounce {
          0% {
            opacity: 0;
            transform: translateY(-30px);
          }
          70% {
            transform: translateY(5px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInStagger {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
          }
          50% {
            box-shadow: 0 0 0 10px rgba(239, 68, 68, 0);
          }
        }
        
        .page-header {
          animation: slideDownWithBounce 0.7s ease-out;
        }
        
        .create-button {
          animation: slideDownWithBounce 0.7s ease-out;
        }
        
        .alert-card-item {
          animation: fadeInStagger 0.5s ease-out;
        }
        
        .alert-card-item:nth-child(1) { animation-delay: 0.05s; }
        .alert-card-item:nth-child(2) { animation-delay: 0.1s; }
        .alert-card-item:nth-child(3) { animation-delay: 0.15s; }
        .alert-card-item:nth-child(4) { animation-delay: 0.2s; }
        .alert-card-item:nth-child(5) { animation-delay: 0.25s; }
        .alert-card-item:nth-child(6) { animation-delay: 0.3s; }
        
        .create-button-hover:hover {
          animation: pulse-glow 2s infinite;
          transform: scale(1.05);
        }
      `}</style>

      <div className="container mx-auto p-4">
        {/* Page Header */}
        <div className="page-header flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 bg-clip-text text-transparent">
              🚨 Price Alerts
            </h1>
            <p className="text-gray-600 text-lg">Manage and monitor your price change alerts</p>
          </div>
          
          <Button 
            onClick={() => setShowCreate(true)} 
            className="create-button create-button-hover bg-gradient-to-r from-red-500 to-orange-600 text-white px-8 py-3 rounded-lg font-bold hover:shadow-lg transition-all duration-300 flex items-center gap-2 w-fit"
          >
            <Plus size={20} />
            Create Alert
          </Button>
        </div>

        {/* Create Alert Modal */}
        {showCreate && (
          <div className="mb-8 animate-in fade-in zoom-in-95 duration-300">
            <CreateAlert onClose={() => setShowCreate(false)} onSuccess={loadAlerts} />
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader />
          </div>
        ) : (
          <>
            {/* Empty State */}
            {alerts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 rounded-2xl bg-gradient-to-br from-white to-red-50 border-2 border-dashed border-red-200 shadow-md">
                <Bell size={64} className="text-red-300 mb-4 opacity-50" />
                <p className="text-2xl font-bold text-gray-700 mb-2">No Price Alerts Yet</p>
                <p className="text-gray-600 mb-6">Create your first price alert to monitor commodity prices</p>
                <Button 
                  onClick={() => setShowCreate(true)} 
                  className="bg-gradient-to-r from-red-500 to-orange-600 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center gap-2"
                >
                  <Plus size={18} />
                  Create First Alert
                </Button>
              </div>
            ) : (
              <>
                {/* Stats Bar */}
                <div className="mb-8 p-4 rounded-xl bg-white shadow-md border border-red-100">
                  <div className="flex gap-6">
                    <div className="flex items-center gap-2">
                      <AlertCircle size={20} className="text-red-500" />
                      <span className="text-gray-600">Active Alerts: <span className="font-bold text-red-600">{alerts.length}</span></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Bell size={20} className="text-orange-500" />
                      <span className="text-gray-600">Triggered: <span className="font-bold text-orange-600">{alerts.filter(a => a.triggered).length}</span></span>
                    </div>
                  </div>
                </div>

                {/* Alerts Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {alerts.map((alert) => (
                    <div key={alert.id} className="alert-card-item">
                      <AlertCard alert={alert} onDelete={handleDelete} />
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
