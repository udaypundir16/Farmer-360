import { useState, useEffect } from 'react';
import { getUserAlerts, deleteAlert } from '../../services/alert.service';
import AlertCard from './AlertCard';
import CreateAlert from './CreateAlert';
import { Button } from '../ui/button';

export default function PriceAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    const data = await getUserAlerts();
    setAlerts(data);
  };

  const handleDelete = async (id) => {
    await deleteAlert(id);
    loadAlerts();
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Price Alerts</h1>
        <Button onClick={() => setShowCreate(true)}>Create New Alert</Button>
      </div>

      {showCreate && (
        <CreateAlert onClose={() => setShowCreate(false)} onSuccess={loadAlerts} />
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {alerts.map(alert => (
          <AlertCard key={alert.id} alert={alert} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
}