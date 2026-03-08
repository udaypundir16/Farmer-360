import React, { useState } from 'react';
import { X } from 'lucide-react';

/**
 * ShipmentStatusUpdate Component
 * Modal for updating shipment status and adding tracking notes
 * Handles status transitions and location updates
 */

const ShipmentStatusUpdate = ({ shipment, onSubmit, onCancel, loading = false }) => {
  const [formData, setFormData] = useState({
    status:
      shipment.status === 'created'
        ? 'picked_up'
        : shipment.status === 'picked_up'
          ? 'in_transit'
          : 'delivered',
    notes: '',
    location: {
      latitude: shipment.currentLocation?.latitude || '',
      longitude: shipment.currentLocation?.longitude || '',
      address: shipment.currentLocation?.address || '',
    },
  });

  // Define valid status transitions
  const statusTransitions = {
    created: ['picked_up'],
    picked_up: ['in_transit'],
    in_transit: ['delivered'],
    delivered: [],
  };

  const availableStatuses = statusTransitions[shipment.status] || [];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        [name]: value,
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // Status badge colors
  const getStatusColor = (status) => {
    switch (status) {
      case 'created':
        return 'bg-yellow-100 text-yellow-800';
      case 'picked_up':
        return 'bg-blue-100 text-blue-800';
      case 'in_transit':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">Update Shipment Status</h2>
          <button
            onClick={onCancel}
            className="p-1 hover:bg-gray-100 rounded transition"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Shipment Info */}
          <div className="bg-gray-50 p-3 rounded">
            <p className="text-sm text-gray-600">Shipment ID</p>
            <p className="font-semibold text-gray-800">{shipment.shipmentId}</p>
            <div className="mt-2">
              <p className="text-xs text-gray-600">Current Status</p>
              <span
                className={`inline-block px-2 py-1 rounded text-xs font-semibold mt-1 ${getStatusColor(shipment.status)}`}
              >
                {shipment.status.replace('_', ' ').toUpperCase()}
              </span>
            </div>
          </div>

          {availableStatuses.length > 0 ? (
            <>
              {/* Status Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Update Status To *
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {availableStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status.replace('_', ' ').toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              {/* Location Update */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Location (Optional)
                </label>
                <div className="space-y-2">
                  <input
                    type="number"
                    name="latitude"
                    placeholder="Latitude"
                    step="0.0001"
                    value={formData.location.latitude}
                    onChange={handleLocationChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-500"
                  />
                  <input
                    type="number"
                    name="longitude"
                    placeholder="Longitude"
                    step="0.0001"
                    value={formData.location.longitude}
                    onChange={handleLocationChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-500"
                  />
                  <input
                    type="text"
                    name="address"
                    placeholder="Address (optional)"
                    value={formData.location.address}
                    onChange={handleLocationChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tracking Notes (Optional)
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="e.g., Package picked up, Left warehouse at 2:00 PM"
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition font-medium disabled:bg-gray-400"
                >
                  {loading ? 'Updating...' : 'Update Status'}
                </button>
                <button
                  type="button"
                  onClick={onCancel}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition font-medium"
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <div className="bg-blue-50 p-4 rounded">
              <p className="text-blue-800 text-sm">
                ✓ This shipment has been delivered. No further status updates are available.
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ShipmentStatusUpdate;
