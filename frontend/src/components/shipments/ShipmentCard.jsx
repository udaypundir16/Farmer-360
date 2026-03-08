import React from 'react';
import { Truck, Calendar, Boxes, Phone, Mail, MapPin } from 'lucide-react';

/**
 * ShipmentCard Component
 * Displays shipment information in a card format
 * Shows summary of shipment details, current status, and quick actions
 */

const ShipmentCard = ({ shipment, onViewDetails, onUpdateStatus }) => {
  // Determine status badge color
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

  // Determine status display text
  const getStatusText = (status) => {
    return status.replace('_', ' ').toUpperCase();
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border-l-4 border-green-500">
      {/* Header with ID and Status */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-800">{shipment.shipmentId}</h3>
          <p className="text-sm text-gray-500">{shipment.cropType}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(shipment.status)}`}>
          {getStatusText(shipment.status)}
        </span>
      </div>

      {/* Main Information Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Quantity */}
        <div className="flex items-center space-x-2">
          <Boxes className="w-4 h-4 text-gray-400" />
          <div>
            <p className="text-xs text-gray-500">Quantity</p>
            <p className="text-sm font-semibold text-gray-800">{shipment.quantity} kg</p>
          </div>
        </div>

        {/* Created Date */}
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <div>
            <p className="text-xs text-gray-500">Created</p>
            <p className="text-sm font-semibold text-gray-800">
              {new Date(shipment.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Transport Details */}
      <div className="bg-gray-50 p-3 rounded mb-4 space-y-2">
        <div className="flex items-center space-x-2">
          <Truck className="w-4 h-4 text-blue-600" />
          <div className="flex-1">
            <p className="text-xs text-gray-600">Driver & Vehicle</p>
            <p className="text-sm font-medium text-gray-800">
              {shipment.driverName || 'Not assigned'} • {shipment.vehicleNumber || 'N/A'}
            </p>
          </div>
        </div>

        {/* Location */}
        {shipment.currentLocation && (
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-red-600" />
            <div className="flex-1">
              <p className="text-xs text-gray-600">Current Location</p>
              <p className="text-xs text-gray-700">
                {shipment.currentLocation.address || 'GPS: ' + shipment.currentLocation.latitude?.toFixed(4) +
                  ', ' + shipment.currentLocation.longitude?.toFixed(4)}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Contact Info */}
      {(shipment.phoneNumber || shipment.email) && (
        <div className="space-y-1 mb-4 text-xs text-gray-600">
          {shipment.phoneNumber && (
            <div className="flex items-center space-x-1">
              <Phone className="w-3 h-3" />
              <span>{shipment.phoneNumber}</span>
            </div>
          )}
          {shipment.email && (
            <div className="flex items-center space-x-1">
              <Mail className="w-3 h-3" />
              <span>{shipment.email}</span>
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => onViewDetails(shipment.shipmentId)}
          className="flex-1 px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded font-medium text-sm transition"
        >
          Track
        </button>

        {shipment.status !== 'delivered' && (
          <button
            onClick={() => onUpdateStatus(shipment.shipmentId)}
            className="flex-1 px-4 py-2 bg-green-50 text-green-600 hover:bg-green-100 rounded font-medium text-sm transition"
          >
            Update
          </button>
        )}
      </div>

      {/* Additional Notes */}
      {shipment.notes && (
        <div className="mt-3 p-2 bg-yellow-50 rounded text-xs text-yellow-700 italic">
          <strong>Note:</strong> {shipment.notes}
        </div>
      )}
    </div>
  );
};

export default ShipmentCard;
