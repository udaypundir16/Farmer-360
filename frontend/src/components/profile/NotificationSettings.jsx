import { useEffect, useState } from 'react';
import { getNotificationPrefs, updateNotificationPrefs } from '../../services/user.service';

export default function NotificationSettings() {
  const [prefs, setPrefs] = useState({ sms: true, whatsapp: false });
  const [message, setMessage] = useState('');

  useEffect(() => {
    getNotificationPrefs().then(setPrefs);
  }, []);

  const handleToggle = (key) => {
    const newPrefs = { ...prefs, [key]: !prefs[key] };
    setPrefs(newPrefs);
    updateNotificationPrefs(newPrefs).then(() => setMessage('Preferences updated')).catch(() => setMessage('Error'));
  };

  return (
    <div className="space-y-4 mt-4">
      <div className="flex items-center justify-between">
        <span>SMS Notifications</span>
        <input type="checkbox" checked={prefs.sms} onChange={() => handleToggle('sms')} />
      </div>
      <div className="flex items-center justify-between">
        <span>WhatsApp Notifications</span>
        <input type="checkbox" checked={prefs.whatsapp} onChange={() => handleToggle('whatsapp')} />
      </div>
      {message && <p className="text-sm text-green-600">{message}</p>}
    </div>
  );
}