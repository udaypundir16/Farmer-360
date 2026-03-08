import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import LocationSearchInput from '../common/LocationSearchInput';

/**
 * ShipmentForm Component
 * Form for creating or updating shipments
 * Handles input validation and submission
 */

const ShipmentForm = ({ onSubmit, onCancel, loading = false, initialData = null }) => {
  const [formData, setFormData] = useState(
    initialData || {
      cropType: '',
      quantity: '',
      driverName: '',
      vehicleNumber: '',
      vehicleType: 'truck',
      pickupLocation: { latitude: '', longitude: '', address: '' },
      deliveryLocation: { latitude: '', longitude: '', address: '' },
      routeDetails: '',
      estimatedDeliveryDate: '',
      notes: '',
      phoneNumber: '',
      email: '',
    }
  );

  const [errors, setErrors] = useState({});

  /**
   * Handle form input changes
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  /**
   * Handle nested object changes (location)
   */
  const handleLocationChange = (e, location, field) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [location]: {
        ...prev[location],
        [field]: value,
      },
    }));
  };

  /**
   * Validate form data
   */
  const validateForm = () => {
    const newErrors = {};

    if (!formData.cropType.trim()) newErrors.cropType = 'Crop type is required';
    if (!formData.quantity || isNaN(formData.quantity))
      newErrors.quantity = 'Valid quantity is required';
    if (!formData.driverName.trim()) newErrors.driverName = 'Driver name is required';
    if (!formData.vehicleNumber.trim()) newErrors.vehicleNumber = 'Vehicle number is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSubmit(formData);
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl w-full overflow-hidden">
      {/* Header with green accent */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-5 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 rounded-lg p-2">
            <Plus className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Create New Shipment</h2>
            <p className="text-green-100 text-xs mt-0.5">Fill in the details below to create a shipment</p>
          </div>
        </div>
        <button
          onClick={onCancel}
          className="p-2 hover:bg-white/20 rounded-full transition text-white"
          title="Close form"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="px-6 py-6 space-y-8">
        {/* Basic Information Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-5 bg-green-600 rounded-full" />
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Basic Information</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Crop Type <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="cropType"
                value={formData.cropType}
                onChange={handleChange}
                placeholder="e.g., Wheat, Rice, Corn"
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition text-sm ${errors.cropType ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50 hover:border-gray-300'}`}
              />
              {errors.cropType && <p className="text-red-500 text-xs mt-1">{errors.cropType}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Quantity (kg) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="e.g., 500"
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition text-sm ${errors.quantity ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50 hover:border-gray-300'}`}
              />
              {errors.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity}</p>}
            </div>
          </div>
        </div>

        {/* Transport Information Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-5 bg-blue-500 rounded-full" />
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Transport Information</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Driver Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="driverName"
                value={formData.driverName}
                onChange={handleChange}
                placeholder="e.g., John Doe"
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition text-sm ${errors.driverName ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50 hover:border-gray-300'}`}
              />
              {errors.driverName && <p className="text-red-500 text-xs mt-1">{errors.driverName}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Vehicle Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="vehicleNumber"
                value={formData.vehicleNumber}
                onChange={handleChange}
                placeholder="e.g., DL-01-AB-1234"
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition text-sm ${errors.vehicleNumber ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50 hover:border-gray-300'}`}
              />
              {errors.vehicleNumber && <p className="text-red-500 text-xs mt-1">{errors.vehicleNumber}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Vehicle Type</label>
              <select
                name="vehicleType"
                value={formData.vehicleType}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-200 bg-gray-50 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition text-sm hover:border-gray-300"
              >
                <option value="truck">Truck</option>
                <option value="van">Van</option>
                <option value="bicycle">Bicycle/Cart</option>
                <option value="motorcycle">Motorcycle</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Route Details</label>
              <input
                type="text"
                name="routeDetails"
                value={formData.routeDetails}
                onChange={handleChange}
                placeholder="e.g., Farm → Market → Warehouse"
                className="w-full px-4 py-2.5 border border-gray-200 bg-gray-50 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition text-sm hover:border-gray-300"
              />
            </div>
          </div>
        </div>

        {/* Location Information Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-5 bg-purple-500 rounded-full" />
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Location Information</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
              <h4 className="font-semibold text-blue-700 text-sm mb-3 flex items-center gap-1.5">
                <span className="w-2 h-2 bg-blue-500 rounded-full inline-block" />
                Pickup Location
              </h4>
              <LocationSearchInput
                label="Search Pickup Address"
                value={formData.pickupLocation}
                onChange={(e) => handleLocationChange({ target: { value: e.target.value } }, 'pickupLocation', 'address')}
                onLocationSelect={(loc) => setFormData(prev => ({ ...prev, pickupLocation: loc }))}
                placeholder="Enter pickup address"
              />
              <div className="mt-2 text-xs text-blue-500 font-mono">
                {formData.pickupLocation.latitude ? `${formData.pickupLocation.latitude}, ${formData.pickupLocation.longitude}` : 'No coordinates selected'}
              </div>
            </div>
            <div className="p-4 bg-green-50 border border-green-100 rounded-xl">
              <h4 className="font-semibold text-green-700 text-sm mb-3 flex items-center gap-1.5">
                <span className="w-2 h-2 bg-green-500 rounded-full inline-block" />
                Delivery Location
              </h4>
              <LocationSearchInput
                label="Search Delivery Address"
                value={formData.deliveryLocation}
                onChange={(e) => handleLocationChange({ target: { value: e.target.value } }, 'deliveryLocation', 'address')}
                onLocationSelect={(loc) => setFormData(prev => ({ ...prev, deliveryLocation: loc }))}
                placeholder="Enter delivery address"
              />
              <div className="mt-2 text-xs text-green-600 font-mono">
                {formData.deliveryLocation.latitude ? `${formData.deliveryLocation.latitude}, ${formData.deliveryLocation.longitude}` : 'No coordinates selected'}
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-5 bg-orange-400 rounded-full" />
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Additional Information</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Estimated Delivery Date</label>
              <input
                type="date"
                name="estimatedDeliveryDate"
                value={formData.estimatedDeliveryDate}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-200 bg-gray-50 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition text-sm hover:border-gray-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Contact Phone <span className="text-gray-400 font-normal">(optional)</span></label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="e.g., +91 9876543210"
                className="w-full px-4 py-2.5 border border-gray-200 bg-gray-50 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition text-sm hover:border-gray-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email <span className="text-gray-400 font-normal">(optional)</span></label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="e.g., farmer@example.com"
                className="w-full px-4 py-2.5 border border-gray-200 bg-gray-50 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition text-sm hover:border-gray-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Special Instructions <span className="text-gray-400 font-normal">(optional)</span></label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="e.g., Handle with care, keep cold"
                rows="3"
                className="w-full px-4 py-2.5 border border-gray-200 bg-gray-50 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition text-sm hover:border-gray-300 resize-none"
              />
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex gap-3 pt-2 border-t border-gray-100">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-xl hover:from-green-700 hover:to-green-800 transition font-semibold disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            {loading ? 'Creating...' : 'Create Shipment'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl hover:bg-gray-200 transition font-semibold"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ShipmentForm;

