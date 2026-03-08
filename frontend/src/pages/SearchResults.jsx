import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { globalSearch } from '../services/search.service';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import SchemeCard from '../components/schemes/SchemeCard';

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState({ schemes: [], commodities: [], markets: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (query) {
      globalSearch(query).then(setResults).catch(console.error).finally(() => setLoading(false));
    }
  }, [query]);

  if (loading) return <div>Searching...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Search results for "{query}"</h1>
      <Tabs defaultValue="schemes">
        <TabsList>
          <TabsTrigger value="schemes">Schemes ({results.schemes.length})</TabsTrigger>
          <TabsTrigger value="commodities">Commodities ({results.commodities.length})</TabsTrigger>
          <TabsTrigger value="markets">Markets ({results.markets.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="schemes">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.schemes.map(scheme => <SchemeCard key={scheme.id} scheme={scheme} />)}
          </div>
        </TabsContent>
        <TabsContent value="commodities">
          <ul className="list-disc pl-5">
            {results.commodities.map(c => <li key={c}>{c}</li>)}
          </ul>
        </TabsContent>
        <TabsContent value="markets">
          <ul className="list-disc pl-5">
            {results.markets.map(m => <li key={m.market}>{m.market}, {m.state}</li>)}
          </ul>
        </TabsContent>
      </Tabs>
    </div>
  );
}