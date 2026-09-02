import React, { useState, useEffect } from 'react';
import { Search, Plus, Loader, AlertCircle, Truck, Eye } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ShipmentCard from '../components/shipments/ShipmentCard';
import ShipmentForm from '../components/shipments/ShipmentForm';
import ShipmentTimeline from '../components/shipments/ShipmentTimeline';
import ShipmentStatusUpdate from '../components/shipments/ShipmentStatusUpdate';

/**
 * Shipment Dashboard Page
 */
const ShipmentDashboard = () => {
  const { t } = useTranslation();
  // State management
  const [shipments, setShipments] = useState([]);
  const [filteredShipments, setFilteredShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    created: 0,
    pickedUp: 0,
    inTransit: 0,
    delivered: 0,
  });

  // UI state
  const [showForm, setShowForm] = useState(false);
  const [selectedShipmentId, setSelectedShipmentId] = useState(null);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showStatusUpdate, setShowStatusUpdate] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // API base URL
  const API_URL = import.meta.env.VITE_API_URL || 'https://farmer-360-production.up.railway.app/api/v1';
  const authToken = localStorage.getItem('token');

  /**
   * Fetch shipments from API   
   */
  const fetchShipments = async () => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams();
      if (statusFilter !== 'all') queryParams.append('status', statusFilter);

      const response = await fetch(`${API_URL}/shipments?${queryParams}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          setError('Session expired. Please login again.');
          return;
        }
        throw new Error(`API Error: ${response.statusText}`);
      }

      const data = await response.json();
      setShipments(data.shipments || []);

      // Calculate stats
      const statsData = {
        total: data.shipments?.length || 0,
        created: data.shipments?.filter((s) => s.status === 'created').length || 0,
        pickedUp: data.shipments?.filter((s) => s.status === 'picked_up').length || 0,
        inTransit: data.shipments?.filter((s) => s.status === 'in_transit').length || 0,
        delivered: data.shipments?.filter((s) => s.status === 'delivered').length || 0,
      };
      setStats(statsData);
    } catch (err) {
      console.error('Error fetching shipments:', err);
      setError(err.message || 'Failed to fetch shipments');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch single shipment details
   */
  const fetchShipmentDetails = async (shipmentId) => {
    try {
      const response = await fetch(`${API_URL}/shipments/${shipmentId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed to fetch shipment details');

      const data = await response.json();
      setSelectedShipment(data.shipment);
      setSelectedShipmentId(shipmentId);
    } catch (err) {
      console.error('Error fetching shipment details:', err);
      setError(err.message);
    }
  };

  /**
   * Fetch shipment timeline/history
   */
  const fetchShipmentTimeline = async (shipmentId) => {
    try {
      const response = await fetch(`${API_URL}/shipments/${shipmentId}/history`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed to fetch timeline');

      const data = await response.json();
      return data.timeline;
    } catch (err) {
      console.error('Error fetching timeline:', err);
      return [];
    }
  };

  /**
   * Create new shipment
   */
  const handleCreateShipment = async (formData) => {
    try {
      setSubmitting(true);
      setError(null);

      const response = await fetch(`${API_URL}/shipments`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create shipment');
      }

      const data = await response.json();
      setShowForm(false);

      // Show success message
      alert(`✓ Shipment created successfully!\nID: ${data.shipment.shipmentId}`);

      // Refresh list
      fetchShipments();
    } catch (err) {
      console.error('Error creating shipment:', err);
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * Update shipment status
   */
  const handleUpdateStatus = async (formData) => {
    try {
      setSubmitting(true);
      setError(null);

      const response = await fetch(`${API_URL}/shipments/${selectedShipmentId}/status`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: formData.status,
          notes: formData.notes,
          location: formData.location.latitude
            ? {
              latitude: parseFloat(formData.location.latitude),
              longitude: parseFloat(formData.location.longitude),
              address: formData.location.address,
            }
            : undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update status');
      }

      setShowStatusUpdate(false);
      alert('✓ Status updated successfully!');

      // Refresh shipment details
      await fetchShipmentDetails(selectedShipmentId);
      fetchShipments();
    } catch (err) {
      console.error('Error updating status:', err);
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * Handle shipment view
   */
  const handleViewShipment = async (shipmentId) => {
    await fetchShipmentDetails(shipmentId);
  };

  /**
   * Handle status update initiation
   */
  const handleInitiateStatusUpdate = (shipmentId) => {
    handleViewShipment(shipmentId).then(() => {
      setShowStatusUpdate(true);
    });
  };

  // Filter shipments based on search and status filter
  useEffect(() => {
    let filtered = shipments;

    if (searchTerm) {
      filtered = filtered.filter(
        (s) =>
          s.shipmentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.cropType.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((s) => s.status === statusFilter);
    }

    setFilteredShipments(filtered);
  }, [shipments, searchTerm, statusFilter]);

  // Initial load
  useEffect(() => {
    fetchShipments();
  }, [statusFilter]);

  return (
    <div className="min-h-screen bg-transparent py-8">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center">
              <Truck className="inline mr-2 text-primary-700" />
              {t('shipments.title')}
            </h1>
            <button
              onClick={() => setShowForm(true)}
              className="bg-primary-700 text-white px-5 py-2.5 rounded-xl hover:bg-primary-800 transition flex items-center justify-center gap-2 font-bold w-full sm:w-auto text-sm shadow-sm min-h-[44px]"
            >
              <Plus className="w-4 h-4" />
              {t('shipments.create_shipment')}
            </button>
          </div>


          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-800">{t('common.error')}</h3>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-primary-100 p-3.5 sm:p-4">
            <p className="text-gray-500 text-xs sm:text-sm font-bold uppercase tracking-wider">{t('forum.all_topics')}</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-soil-dark mt-0.5">{stats.total}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-primary-100 p-3.5 sm:p-4">
            <p className="text-gray-500 text-xs sm:text-sm font-bold uppercase tracking-wider">{t('shipments.create_shipment')}</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-blue-600 mt-0.5">{stats.created}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-primary-100 p-3.5 sm:p-4">
            <p className="text-gray-500 text-xs sm:text-sm font-bold uppercase tracking-wider">{t('shipments.status_dispatched')}</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-amber-600 mt-0.5">{stats.pickedUp}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-primary-100 p-3.5 sm:p-4">
            <p className="text-gray-500 text-xs sm:text-sm font-bold uppercase tracking-wider">{t('shipments.status_in_transit')}</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-purple-600 mt-0.5">{stats.inTransit}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-primary-100 p-3.5 sm:p-4 col-span-2 sm:col-span-1">
            <p className="text-gray-500 text-xs sm:text-sm font-bold uppercase tracking-wider">{t('shipments.status_delivered')}</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600 mt-0.5">{stats.delivered}</p>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl shadow-sm border border-primary-100 p-4 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder={`${t('common.search')} ${t('shipments.shipment_id')} / ${t('crop_market.crop_name')}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base font-medium"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base font-medium bg-white cursor-pointer"
            >
              <option value="all">{t('forum.all_topics')}</option>
              <option value="created">{t('shipments.create_shipment')}</option>
              <option value="picked_up">{t('shipments.status_dispatched')}</option>
              <option value="in_transit">{t('shipments.status_in_transit')}</option>
              <option value="delivered">{t('shipments.status_delivered')}</option>
            </select>
          </div>
          <p className="text-xs sm:text-sm font-semibold text-gray-500 mt-1">
            Showing {filteredShipments.length} of {shipments.length} {t('shipments.title')}
          </p>
        </div>

        {/* Layout: List + Details + Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Shipments List - Left Column */}
          <div className="lg:col-span-4">
            {loading ? (
              <div className="flex justify-center items-center h-64 bg-white rounded-xl border border-primary-100">
                <div className="text-center">
                  <Loader className="w-8 h-8 text-primary-600 animate-spin mx-auto mb-2" />
                  <p className="text-gray-600 font-medium">{t('common.loading')}</p>
                </div>
              </div>
            ) : filteredShipments.length > 0 ? (
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {filteredShipments.map((shipment) => (
                  <div
                    key={shipment.shipmentId}
                    onClick={() => {
                      handleViewShipment(shipment.shipmentId);
                      if (window.innerWidth < 1024) {
                        setTimeout(() => {
                          document.getElementById('shipment-details-section')?.scrollIntoView({ behavior: 'smooth' });
                        }, 100);
                      }
                    }}
                    className={`cursor-pointer rounded-2xl p-4 border-2 transition-all shadow-xs ${selectedShipmentId === shipment.shipmentId
                      ? 'border-primary-600 bg-primary-50/60 ring-2 ring-primary-500/20'
                      : 'border-gray-200 bg-white hover:border-primary-300'
                      }`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <p className="font-bold text-base text-soil-dark tracking-tight">{shipment.shipmentId}</p>
                        <p className="text-sm font-semibold text-primary-800 mt-0.5">{shipment.cropType}</p>
                        <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">{shipment.quantity} kg • {shipment.vehicleNumber || 'Standard Freight'}</p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap border ${shipment.status === 'created'
                          ? 'bg-yellow-100 text-yellow-900 border-yellow-300'
                          : shipment.status === 'picked_up'
                            ? 'bg-blue-100 text-blue-900 border-blue-300'
                            : shipment.status === 'in_transit'
                              ? 'bg-purple-100 text-purple-900 border-purple-300'
                              : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                          }`}
                      >
                        {shipment.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-primary-100 p-8 text-center">
                <Truck className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                <p className="text-base font-bold text-soil-dark">No shipments found</p>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">Create a new shipment to start tracking freight.</p>
              </div>
            )}
          </div>

          {/* Shipment Details - Middle Column */}
          <div id="shipment-details-section" className="lg:col-span-4">
            {selectedShipment ? (
              <div className="bg-white rounded-2xl shadow-sm border border-primary-100 p-5 sm:p-6">
                <h3 className="text-lg sm:text-xl font-extrabold text-soil-dark mb-4 pb-2 border-b border-primary-100">Shipment Details</h3>

                <div className="space-y-3.5 text-sm sm:text-base">
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Shipment ID</p>
                    <p className="font-extrabold text-soil-dark text-base">{selectedShipment.shipmentId}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Crop Type</p>
                      <p className="font-bold text-primary-900 text-base">{selectedShipment.cropType}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Quantity</p>
                      <p className="font-bold text-soil-dark text-base">{selectedShipment.quantity} kg</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Status</p>
                    <p
                      className={`font-bold inline-block px-3 py-1 rounded-full text-xs uppercase tracking-wider mt-1 border ${selectedShipment.status === 'created'
                        ? 'bg-yellow-100 text-yellow-900 border-yellow-300'
                        : selectedShipment.status === 'picked_up'
                          ? 'bg-blue-100 text-blue-900 border-blue-300'
                          : selectedShipment.status === 'in_transit'
                            ? 'bg-purple-100 text-purple-900 border-purple-300'
                            : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                        }`}
                    >
                      {selectedShipment.status.replace('_', ' ').toUpperCase()}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Driver</p>
                      <p className="font-semibold text-soil-dark">
                        {selectedShipment.driverName || 'Not assigned'}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Vehicle</p>
                      <p className="font-semibold text-soil-dark">
                        {selectedShipment.vehicleNumber} ({selectedShipment.vehicleType || 'N/A'})
                      </p>
                    </div>
                  </div>

                  {selectedShipment.currentLocation && (
                    <div className="p-3 rounded-xl bg-cream-50 border border-primary-100/60">
                      <p className="text-xs font-bold text-primary-800 uppercase tracking-wider">Current Location</p>
                      <p className="font-bold text-soil-dark text-sm mt-0.5">
                        {selectedShipment.currentLocation.address || 'GPS Live Tracking'}
                      </p>
                      <p className="text-xs font-mono text-gray-500 mt-0.5">
                        Lat: {selectedShipment.currentLocation.latitude?.toFixed(4)}, Lng:{' '}
                        {selectedShipment.currentLocation.longitude?.toFixed(4)}
                      </p>
                    </div>
                  )}

                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Created Date</p>
                    <p className="font-semibold text-soil-dark">
                      {new Date(selectedShipment.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {selectedShipment.status !== 'delivered' && (
                  <button
                    onClick={() => handleInitiateStatusUpdate(selectedShipmentId)}
                    className="w-full mt-5 bg-primary-700 hover:bg-primary-800 text-white py-3 rounded-xl transition-all font-bold text-sm sm:text-base shadow-md"
                  >
                    Update Status
                  </button>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-primary-100 p-8 text-center">
                <Eye className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                <p className="text-base font-bold text-soil-dark">Select a shipment to view details</p>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">Tap any shipment from the list on the left.</p>
              </div>
            )}
          </div>

          {/* Timeline - Right Column */}
          <div className="lg:col-span-4">
            {selectedShipment ? (
              <ShipmentTimeline timeline={selectedShipment.timeline || []} shipmentId={selectedShipmentId} />
            ) : (
              <div className="hidden lg:block bg-white/50 rounded-2xl border border-dashed border-gray-200 p-8 text-center text-gray-400 text-sm">
                Timeline will appear here
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto"
          onClick={(e) => e.target === e.currentTarget && setShowForm(false)}
        >
          <div className="w-full max-w-2xl my-auto">
            <ShipmentForm
              onSubmit={handleCreateShipment}
              onCancel={() => setShowForm(false)}
              loading={submitting}
            />
          </div>
        </div>
      )}

      {showStatusUpdate && selectedShipment && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto"
          onClick={(e) => e.target === e.currentTarget && setShowStatusUpdate(false)}
        >
          <div className="w-full max-w-lg my-auto">
            <ShipmentStatusUpdate
              shipment={selectedShipment}
              onSubmit={handleUpdateStatus}
              onCancel={() => setShowStatusUpdate(false)}
              loading={submitting}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ShipmentDashboard;
