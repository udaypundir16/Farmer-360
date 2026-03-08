import React, { useState, useEffect } from 'react';
import { Search, Plus, Loader, AlertCircle, Truck, Eye } from 'lucide-react';
import ShipmentCard from '../components/shipments/ShipmentCard';
import ShipmentForm from '../components/shipments/ShipmentForm';
import ShipmentTimeline from '../components/shipments/ShipmentTimeline';
import ShipmentStatusUpdate from '../components/shipments/ShipmentStatusUpdate';

/**
 * Shipment Dashboard Page
 * Main page for managing and tracking shipments
 * Features:
 * - View all shipments
 * - Create new shipments
 * - Track shipment status
 * - Update shipment information
 * - Search by shipment ID
 */

const ShipmentDashboard = () => {
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

  // API base URL (adjust based on your backend setup)
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-900">
              <Truck className="inline mr-2" />
              Shipment Tracking
            </h1>
            <button
              onClick={() => setShowForm(true)}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2 font-medium"
            >
              <Plus className="w-4 h-4" />
              New Shipment
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-800">Error</h3>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-600 text-sm font-medium">Total</p>
            <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
          </div>
          <div className="bg-yellow-50 rounded-lg shadow p-4 border-l-4 border-yellow-500">
            <p className="text-gray-600 text-sm font-medium">Created</p>
            <p className="text-3xl font-bold text-yellow-600">{stats.created}</p>
          </div>
          <div className="bg-blue-50 rounded-lg shadow p-4 border-l-4 border-blue-500">
            <p className="text-gray-600 text-sm font-medium">Picked Up</p>
            <p className="text-3xl font-bold text-blue-600">{stats.pickedUp}</p>
          </div>
          <div className="bg-purple-50 rounded-lg shadow p-4 border-l-4 border-purple-500">
            <p className="text-gray-600 text-sm font-medium">In Transit</p>
            <p className="text-3xl font-bold text-purple-600">{stats.inTransit}</p>
          </div>
          <div className="bg-green-50 rounded-lg shadow p-4 border-l-4 border-green-500">
            <p className="text-gray-600 text-sm font-medium">Delivered</p>
            <p className="text-3xl font-bold text-green-600">{stats.delivered}</p>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by Shipment ID or Crop Type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="created">Created</option>
              <option value="picked_up">Picked Up</option>
              <option value="in_transit">In Transit</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>

          <p className="text-sm text-gray-600">
            Showing {filteredShipments.length} of {shipments.length} shipments
          </p>
        </div>

        {/* Three-Column Layout: List + Details + Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Shipments List - Left Column */}
          <div className="lg:col-span-4">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="text-center">
                  <Loader className="w-8 h-8 text-green-600 animate-spin mx-auto mb-2" />
                  <p className="text-gray-600">Loading shipments...</p>
                </div>
              </div>
            ) : filteredShipments.length > 0 ? (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {filteredShipments.map((shipment) => (
                  <div
                    key={shipment.shipmentId}
                    onClick={() => handleViewShipment(shipment.shipmentId)}
                    className={`cursor-pointer rounded-lg p-3 border-2 transition ${selectedShipmentId === shipment.shipmentId
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 bg-white hover:border-green-300'
                      }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-gray-800">{shipment.shipmentId}</p>
                        <p className="text-xs text-gray-600">{shipment.cropType}</p>
                        <p className="text-xs text-gray-500 mt-1">{shipment.quantity} kg</p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${shipment.status === 'created'
                          ? 'bg-yellow-100 text-yellow-800'
                          : shipment.status === 'picked_up'
                            ? 'bg-blue-100 text-blue-800'
                            : shipment.status === 'in_transit'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                      >
                        {shipment.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <Truck className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">No shipments found</p>
              </div>
            )}
          </div>

          {/* Shipment Details - Middle Column */}
          {selectedShipment ? (
            <div className="lg:col-span-4">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-bold mb-4">Shipment Details</h3>

                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-gray-600">Shipment ID</p>
                    <p className="font-semibold text-gray-800">{selectedShipment.shipmentId}</p>
                  </div>

                  <div>
                    <p className="text-gray-600">Crop Type</p>
                    <p className="font-semibold text-gray-800">{selectedShipment.cropType}</p>
                  </div>

                  <div>
                    <p className="text-gray-600">Quantity</p>
                    <p className="font-semibold text-gray-800">{selectedShipment.quantity} kg</p>
                  </div>

                  <div>
                    <p className="text-gray-600">Status</p>
                    <p
                      className={`font-semibold inline-block px-2 py-1 rounded text-xs mt-1 ${selectedShipment.status === 'created'
                        ? 'bg-yellow-100 text-yellow-800'
                        : selectedShipment.status === 'picked_up'
                          ? 'bg-blue-100 text-blue-800'
                          : selectedShipment.status === 'in_transit'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                    >
                      {selectedShipment.status.replace('_', ' ').toUpperCase()}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-600">Driver</p>
                    <p className="font-semibold text-gray-800">
                      {selectedShipment.driverName || 'Not assigned'}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-600">Vehicle</p>
                    <p className="font-semibold text-gray-800">
                      {selectedShipment.vehicleNumber} ({selectedShipment.vehicleType || 'N/A'})
                    </p>
                  </div>

                  {selectedShipment.currentLocation && (
                    <div>
                      <p className="text-gray-600">Current Location</p>
                      <p className="font-semibold text-gray-800">
                        {selectedShipment.currentLocation.address || 'GPS Update'}
                      </p>
                      <p className="text-xs text-gray-500">
                        Lat: {selectedShipment.currentLocation.latitude?.toFixed(4)}, Lng:{' '}
                        {selectedShipment.currentLocation.longitude?.toFixed(4)}
                      </p>
                    </div>
                  )}

                  <div>
                    <p className="text-gray-600">Created</p>
                    <p className="font-semibold text-gray-800">
                      {new Date(selectedShipment.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {selectedShipment.status !== 'delivered' && (
                  <button
                    onClick={() => handleInitiateStatusUpdate(selectedShipmentId)}
                    className="w-full mt-4 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition font-medium"
                  >
                    Update Status
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="lg:col-span-4 bg-gray-50 rounded-lg p-8 text-center">
              <Eye className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">Select a shipment to view details</p>
            </div>
          )}

          {/* Timeline - Right Column */}
          {selectedShipment ? (
            <div className="lg:col-span-4">
              <ShipmentTimeline timeline={selectedShipment.timeline || []} shipmentId={selectedShipmentId} />
            </div>
          ) : (
            <div className="lg:col-span-4" />
          )}
        </div>
      </div>

      {/* Modals */}
      {showForm && (
        <div
          className="fixed inset-x-0 bottom-0 top-[112px] z-40 overflow-y-auto bg-black/50 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && setShowForm(false)}
        >
          <div className="min-h-full flex items-start justify-center p-6">
            <div className="w-full max-w-2xl my-4">
              <ShipmentForm
                onSubmit={handleCreateShipment}
                onCancel={() => setShowForm(false)}
                loading={submitting}
              />
            </div>
          </div>
        </div>
      )}

      {showStatusUpdate && selectedShipment && (
        <ShipmentStatusUpdate
          shipment={selectedShipment}
          onSubmit={handleUpdateStatus}
          onCancel={() => setShowStatusUpdate(false)}
          loading={submitting}
        />
      )}
    </div>
  );
};

export default ShipmentDashboard;
