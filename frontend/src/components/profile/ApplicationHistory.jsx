import { useEffect, useState } from 'react';

export default function ApplicationHistory() {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    // Load user applications
    // const data = await getUserApplications();
    // setApplications(data);
  }, []);

  return (
    <div className="space-y-4 mt-4">
      {applications.length === 0 ? (
        <p className="text-gray-500">No applications submitted yet</p>
      ) : (
        <ul className="space-y-2">
          {applications.map((app) => (
            <li key={app.id} className="border rounded p-2">
              <strong>{app.scheme?.name}</strong>
              <p className="text-sm text-gray-600">Status: {app.status}</p>
              <p className="text-xs text-gray-400">{new Date(app.application_date).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
