// Shipment Model - represents database schema for logistics and shipment tracking
// This model defines the structure for tracking agricultural shipments

module.exports = {
  // Schema definition for reference
  // This will be implemented in Supabase as a table
  shipmentSchema: {
    // Unique identifier for the shipment (UUID)
    id: 'UUID (primary key)',

    // Formatted shipment ID for user-friendly reference (e.g., AGRI-2025-0001)
    shipmentId: 'string (unique, indexed)',

    // Reference to the farmer who owns this shipment
    farmerId: 'UUID (foreign key to users table)',

    // Agricultural product details
    cropType: 'string (e.g., wheat, rice, corn)',
    quantity: 'number (in kg or liters)',
    cropsGrown: 'string (array of crops)',

    // Shipment status tracking
    // Statuses: Created -> Picked Up -> In Transit -> Delivered
    status: 'string (enum: created, picked_up, in_transit, delivered)',

    // Transportation details
    driverName: 'string',
    vehicleNumber: 'string (license plate)',
    vehicleType: 'string (truck, van, bicycle, etc)',

    // Location tracking
    // Format: { latitude: number, longitude: number, address: string, timestamp: ISO string }
    pickupLocation: 'JSON object with lat/long/address',
    deliveryLocation: 'JSON object with lat/long/address',
    currentLocation: 'JSON object with lat/long/address (updated during transit)',

    // Route and destination information
    routeDetails: 'string (from location to destination)',
    estimatedDeliveryDate: 'timestamp',

    // Timestamps for tracking
    createdAt: 'timestamp (auto-generated)',
    updatedAt: 'timestamp (auto-updated on change)',
    pickedUpAt: 'timestamp (when driver picks up)',
    deliveredAt: 'timestamp (when delivered)',

    // Optional metadata
    notes: 'string (special handling instructions)',
    trackingNotes: 'string (updates during transit)',
    phoneNumber: 'string (farmer contact)',
    email: 'string (farmer email)',
  },

  // Status enum for valid shipment statuses
  SHIPMENT_STATUS: {
    CREATED: 'created',
    PICKED_UP: 'picked_up',
    IN_TRANSIT: 'in_transit',
    DELIVERED: 'delivered',
  },

  // Shipment ID prefix for formatted IDs
  SHIPMENT_ID_PREFIX: 'AGRI',
};
