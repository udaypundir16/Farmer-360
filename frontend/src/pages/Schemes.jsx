import { useState, useEffect } from 'react';
import { getSchemes } from '../services/schemes.service';
import SchemeCard from '../components/schemes/SchemeCard';
import SchemeFilters from '../components/schemes/SchemeFilters';
import SchemeNews from '../components/schemes/SchemeNews';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import Loader from '../components/ui/loader';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Schemes() {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ category: '', state: '', search: '' });
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });

  useEffect(() => {
    loadSchemes();
  }, [filters, pagination.page]);

  const loadSchemes = async () => {
    setLoading(true);
    try {
      const response = await getSchemes({ ...filters, page: pagination.page, limit: pagination.limit });
      const schemeData = Array.isArray(response) ? response : (response.data || []);
      const total = response.pagination?.total || response.length || 0;
      setSchemes(schemeData);
      setPagination(prev => ({ ...prev, total }));
    } catch (error) {
      console.error('Error loading schemes:', error);
      setSchemes([]);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(pagination.total / pagination.limit);

  return (
    <div className="min-h-screen bg-cream-100 py-8">
      <div className="container mx-auto p-4">
        <div className="mb-8 animate-fade-in-up">
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-2 text-primary-800">
            Government Schemes
          </h1>
          <p className="text-soil-light text-lg">Discover and apply for schemes that benefit your farming operations</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filter sidebar - glassmorphism */}
          <aside className="lg:w-72 flex-shrink-0">
            <div className="sticky top-24 p-6 rounded-agri-lg glass border border-primary-100/50">
              <h3 className="font-heading text-lg font-bold text-soil mb-4">Filters</h3>
              <SchemeFilters filters={filters} setFilters={setFilters} />
            </div>

            <div className="mt-6">
              <SchemeNews />
            </div>
          </aside>

          <main className="flex-1">
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-500" size={20} />
                <Input
                  type="search"
                  placeholder="Search schemes by name, description..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="pl-12 py-3 rounded-agri-lg border-primary-100 focus:ring-primary-500/20"
                />
                {filters.search && (
                  <button
                    type="button"
                    onClick={() => setFilters({ ...filters, search: '' })}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-soil-light hover:text-soil"
                  >
                    ✕
                  </button>
                )}
              </div>
              {filters.search && (
                <p className="mt-2 text-sm text-soil-light">
                  Searching for: <span className="font-semibold text-soil">"{filters.search}"</span>
                </p>
              )}
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Loader />
              </div>
            ) : (
              <>
                {schemes.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {schemes.map((scheme, idx) => (
                      <div
                        key={scheme.id}
                        className="animate-fade-in-up"
                        style={{ animationDelay: `${Math.min(idx * 0.06, 0.25)}s`, animationFillMode: 'both' }}
                      >
                        <SchemeCard scheme={scheme} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 rounded-agri-lg bg-cream-50 border border-primary-100">
                    <p className="text-xl font-medium text-soil-light mb-2">No schemes found</p>
                    <p className="text-soil-light/80">Try adjusting your search filters</p>
                  </div>
                )}

                {schemes.length > 0 && (
                  <div className="mb-4 p-4 rounded-agri bg-primary-50/80 border border-primary-100">
                    <p className="text-sm text-soil">
                      Showing <span className="font-semibold text-primary-700">{schemes.length}</span> scheme{schemes.length !== 1 ? 's' : ''}
                      {filters.search && ` matching "${filters.search}"`}
                      {filters.category && ` in ${filters.category} category`}
                      {filters.state && ` for ${filters.state}`}
                    </p>
                  </div>
                )}

                {schemes.length > 0 && totalPages > 1 && (
                  <div className="flex items-center justify-center gap-4 mt-12 p-6 rounded-agri-lg glass border border-primary-100/50">
                    <Button
                      onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}
                      disabled={pagination.page === 1}
                      className="flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft size={18} />
                      Previous
                    </Button>
                    <span className="text-soil font-semibold">
                      Page <span className="text-primary-600">{pagination.page}</span> of <span className="text-primary-600">{totalPages}</span>
                    </span>
                    <Button
                      onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}
                      disabled={pagination.page >= totalPages}
                      className="flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                      <ChevronRight size={18} />
                    </Button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
