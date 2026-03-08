import { useEffect, useState } from 'react';
import { getSchemes } from '../../services/schemes.service';
import SchemeCard from '../schemes/SchemeCard';

export default function RecommendedSchemes({ state, crops }) {
  const [schemes, setSchemes] = useState([]);

  useEffect(() => {
    async function fetch() {
      try {
        const response = await getSchemes({ state, limit: 2 });
        setSchemes(Array.isArray(response) ? response : (response.schemes || []));
      } catch (error) {
        console.error('Error fetching schemes:', error);
        setSchemes([]);
      }
    }
    fetch();
  }, [state]);

  if (schemes.length === 0) {
    return <p className="text-gray-500">No schemes found for your profile</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {schemes.map((scheme) => (
        <SchemeCard key={scheme.id} scheme={scheme} />
      ))}
    </div>
  );
}
