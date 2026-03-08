import { useEffect, useState } from 'react';
import { getUserAlerts, deleteAlert } from '../../services/alert.service';

export default function AlertHistory() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    try {
      const data = await getUserAlerts();
      setAlerts(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-4 mt-4">
      {alerts.length === 0 ? (
        <p className="text-gray-500">No alert history</p>
      ) : (
        <ul className="space-y-2">
          {alerts.map((alert) => (
            <li key={alert.id} className="flex justify-between items-center border rounded p-2">
              <span>{alert.commodity} @ {alert.market || 'Any'} - ₹{alert.target_price}</span>
              <span className="text-sm">{alert.triggered ? 'Triggered' : 'Pending'}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
