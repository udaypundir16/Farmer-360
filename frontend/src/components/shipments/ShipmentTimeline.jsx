import React, { useState, useEffect } from 'react';
import { FileText, MapPin, Truck, CheckCircle, Clock } from 'lucide-react';

/**
 * ShipmentTimeline Component
 * Displays a visual timeline of shipment status updates
 * Shows: Created -> Picked Up -> In Transit -> Delivered
 */

const ShipmentTimeline = ({ timeline, shipmentId }) => {
  if (!timeline || timeline.length === 0) {
    return (
      <div className="bg-gray-50 p-6 rounded-lg">
        <p className="text-gray-500">No tracking information available yet</p>
      </div>
    );
  }

  // Map status to icons
  const getStatusIcon = (status) => {
    switch (status) {
      case 'created':
        return <FileText className="w-6 h-6" />;
      case 'picked_up':
        return <Truck className="w-6 h-6" />;
      case 'in_transit':
        return <MapPin className="w-6 h-6" />;
      case 'delivered':
        return <CheckCircle className="w-6 h-6" />;
      default:
        return <Clock className="w-6 h-6" />;
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-bold mb-6">Shipment Tracking Timeline</h3>
        <p className="text-sm text-gray-600 mb-6">ID: {shipmentId}</p>
      </div>

      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-green-500 to-blue-500" />

        {/* Timeline items */}
        <div className="space-y-8">
          {timeline.map((event, index) => (
            <div key={index} className="relative pl-20">
              {/* Icon circle */}
              <div className="absolute -left-3 top-0 w-16 h-16 bg-white border-4 border-green-500 rounded-full flex items-center justify-center text-green-600 shadow-md">
                {getStatusIcon(event.status)}
              </div>

              {/* Event details */}
              <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-gray-800 capitalize">
                      {event.status.replace('_', ' ')}
                    </h4>
                    <p className="text-gray-600 text-sm mt-1">{event.description}</p>
                    {event.details && (
                      <p className="text-gray-500 text-xs mt-2">{event.details}</p>
                    )}
                  </div>
                </div>

                {/* Timestamp */}
                <div className="text-xs text-gray-500 mt-3">
                  {new Date(event.timestamp).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>

                {/* Location info if available */}
                {event.location && (
                  <div className="mt-3 p-2 bg-blue-50 rounded text-xs text-blue-700">
                    <MapPin className="w-3 h-3 inline mr-1" />
                    Lat: {event.location.latitude?.toFixed(4)}, Lng:{' '}
                    {event.location.longitude?.toFixed(4)}
                    {event.location.address && ` - ${event.location.address}`}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShipmentTimeline;
