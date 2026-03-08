const { supabase } = require('../config/database');
const logger = require('../utils/logger');
const { v4: uuidv4 } = require('uuid');

/**
 * Shipment Service Layer
 * Handles business logic for shipment operations
 * This service can be extended for notifications, analytics, etc.
 */

/**
 * Generate a formatted shipment ID
 * Format: AGRI-YYYY-XXXX (e.g., AGRI-2025-0001)
 */
function generateShipmentId() {
  const timestamp = new Date().getFullYear();
  const randomNum = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
  return `AGRI-${timestamp}-${randomNum}`;
}

/**
 * Create a new shipment in database
 * @param {Object} shipmentData - Shipment data
 * @param {String} farmerId - ID of the farmer creating shipment
 * @returns {Object} - Created shipment object
 */
exports.createShipment = async (shipmentData, farmerId) => {
  try {
    const shipmentId = generateShipmentId();

    const shipmentRecord = {
      id: uuidv4(),
      shipment_id: shipmentId,
      farmer_id: farmerId,
      crop_type: shipmentData.cropType,
      quantity: shipmentData.quantity,
      status: 'created',
      driver_name: shipmentData.driverName,
      vehicle_number: shipmentData.vehicleNumber,
      vehicle_type: shipmentData.vehicleType || null,
      pickup_location: shipmentData.pickupLocation || null,
      delivery_location: shipmentData.deliveryLocation || null,
      current_location: shipmentData.pickupLocation || null,
      route_details: shipmentData.routeDetails || null,
      estimated_delivery_date: shipmentData.estimatedDeliveryDate || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      notes: shipmentData.notes || null,
      phone_number: shipmentData.phoneNumber || null,
      email: shipmentData.email || null,
      tracking_notes: `Shipment created by farmer ${farmerId}`,
    };

    const { data, error } = await supabase
      .from('shipments')
      .insert([shipmentRecord])
      .select();

    if (error) throw error;

    logger.info(`Shipment ${shipmentId} created successfully`);
    return data[0];
  } catch (error) {
    logger.error('Error in createShipment service:', error);
    throw error;
  }
};

/**
 * Get shipment by formatted ID
 * @param {String} shipmentId - Formatted shipment ID (e.g., AGRI-2025-0001)
 * @returns {Object} - Shipment object or null
 */
exports.getShipmentById = async (shipmentId) => {
  try {
    const { data, error } = await supabase
      .from('shipments')
      .select('*')
      .eq('shipment_id', shipmentId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    logger.error(`Error fetching shipment ${shipmentId}:`, error);
    throw error;
  }
};

/**
 * Get all shipments for a farmer
 * @param {String} farmerId - Farmer ID
 * @param {Object} options - Filter options (status, limit, offset)
 * @returns {Object} - { data: shipments, count: total }
 */
exports.getShipmentsByFarmer = async (farmerId, options = {}) => {
  try {
    const { status, limit = 50, offset = 0 } = options;

    let query = supabase
      .from('shipments')
      .select('*', { count: 'exact' })
      .eq('farmer_id', farmerId);

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .limit(limit)
      .offset(offset);

    if (error) throw error;
    return { data, count };
  } catch (error) {
    logger.error(`Error fetching shipments for farmer ${farmerId}:`, error);
    throw error;
  }
};

/**
 * Update shipment status with validation
 * @param {String} shipmentId - Formatted shipment ID
 * @param {String} newStatus - New status
 * @param {Object} options - Additional options (location, notes)
 * @returns {Object} - Updated shipment
 */
exports.updateShipmentStatus = async (shipmentId, newStatus, options = {}) => {
  try {
    const { location, notes } = options;

    // Fetch current shipment
    const shipment = await this.getShipmentById(shipmentId);
    if (!shipment) throw new Error('Shipment not found');

    // Validate status transition
    const validTransitions = {
      created: ['picked_up', 'cancelled'],
      picked_up: ['in_transit', 'created'],
      in_transit: ['delivered'],
      delivered: [],
    };

    if (!validTransitions[shipment.status]?.includes(newStatus)) {
      throw new Error(
        `Cannot transition from ${shipment.status} to ${newStatus}. Valid transitions: ${validTransitions[shipment.status].join(', ')}`
      );
    }

    const updateData = {
      status: newStatus,
      updated_at: new Date().toISOString(),
    };

    if (location) {
      updateData.current_location = location;
    }

    // Add tracking note
    let trackingNote = `${new Date().toISOString()} - Status: ${newStatus}`;
    if (notes) trackingNote += ` - ${notes}`;
    updateData.tracking_notes = (shipment.tracking_notes || '') + '\n' + trackingNote;

    // Status-specific updates
    if (newStatus === 'picked_up') {
      updateData.picked_up_at = new Date().toISOString();
    } else if (newStatus === 'delivered') {
      updateData.delivered_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('shipments')
      .update(updateData)
      .eq('shipment_id', shipmentId)
      .select();

    if (error) throw error;

    logger.info(`Shipment ${shipmentId} status updated to ${newStatus}`);
    
    // TODO: Send notifications here (SMS/Email)
    // this.sendNotification(shipment.farmer_id, `Your shipment ${shipmentId} is now ${newStatus}`);

    return data[0];
  } catch (error) {
    logger.error(`Error updating shipment status:`, error);
    throw error;
  }
};

/**
 * Update GPS location
 * @param {String} shipmentId - Formatted shipment ID
 * @param {Number} latitude - Latitude
 * @param {Number} longitude - Longitude
 * @param {String} address - Address (optional)
 * @returns {Object} - Updated shipment
 */
exports.updateLocation = async (shipmentId, latitude, longitude, address = null) => {
  try {
    const locationData = {
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      address: address || 'Update',
      timestamp: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('shipments')
      .update({
        current_location: locationData,
        updated_at: new Date().toISOString(),
      })
      .eq('shipment_id', shipmentId)
      .select();

    if (error) throw error;

    logger.info(`Shipment ${shipmentId} location updated`);
    return data[0];
  } catch (error) {
    logger.error(`Error updating location for shipment ${shipmentId}:`, error);
    throw error;
  }
};

/**
 * Get shipment timeline/history
 * @param {String} shipmentId - Formatted shipment ID
 * @returns {Array} - Timeline of events
 */
exports.getShipmentTimeline = async (shipmentId) => {
  try {
    const shipment = await this.getShipmentById(shipmentId);
    if (!shipment) throw new Error('Shipment not found');

    const timeline = [];

    timeline.push({
      status: 'created',
      timestamp: shipment.created_at,
      description: 'Shipment created',
      icon: 'CheckCircle',
    });

    if (shipment.picked_up_at) {
      timeline.push({
        status: 'picked_up',
        timestamp: shipment.picked_up_at,
        description: `Picked up by ${shipment.driver_name}`,
        details: `Vehicle: ${shipment.vehicle_number}`,
        icon: 'Truck',
      });
    }

    if (shipment.status === 'in_transit' || shipment.delivered_at) {
      timeline.push({
        status: 'in_transit',
        timestamp: shipment.picked_up_at || shipment.created_at,
        description: 'In transit to destination',
        location: shipment.current_location,
        icon: 'Navigation',
      });
    }

    if (shipment.delivered_at) {
      timeline.push({
        status: 'delivered',
        timestamp: shipment.delivered_at,
        description: 'Delivered successfully',
        location: shipment.delivery_location,
        icon: 'CheckCircle2',
      });
    }

    return timeline;
  } catch (error) {
    logger.error(`Error getting timeline for shipment ${shipmentId}:`, error);
    throw error;
  }
};

/**
 * Get shipment statistics for a farmer
 * @param {String} farmerId - Farmer ID
 * @returns {Object} - Statistics object
 */
exports.getShipmentStats = async (farmerId) => {
  try {
    const { data, error } = await supabase
      .from('shipments')
      .select('status')
      .eq('farmer_id', farmerId);

    if (error) throw error;

    const stats = {
      total: data.length,
      created: data.filter((s) => s.status === 'created').length,
      pickedUp: data.filter((s) => s.status === 'picked_up').length,
      inTransit: data.filter((s) => s.status === 'in_transit').length,
      delivered: data.filter((s) => s.status === 'delivered').length,
    };

    return stats;
  } catch (error) {
    logger.error(`Error getting shipment stats for farmer ${farmerId}:`, error);
    throw error;
  }
};

/**
 * Placeholder for sending notifications
 * This can be extended to send SMS/Email notifications
 * @param {String} farmerId - Farmer ID
 * @param {String} message - Message to send
 * @param {String} type - Notification type (sms, email)
 */
exports.sendNotification = async (farmerId, message, type = 'email') => {
  try {
    logger.info(`[NOTIFICATION] ${type.toUpperCase()}: ${message} (Farmer: ${farmerId})`);
    
    // TODO: Integration points for real notifications:
    // - Email: Use nodemailer or SendGrid
    // - SMS: Use Twilio or AWS SNS
    // - Push notifications: Use Firebase Cloud Messaging
    
    // Example:
    // if (type === 'sms') {
    //   await twilioClient.messages.create({
    //     body: message,
    //     from: process.env.TWILIO_PHONE,
    //     to: farmerPhoneNumber
    //   });
    // }
  } catch (error) {
    logger.error('Error sending notification:', error);
    // Don't throw - notifications shouldn't block main flow
  }
};
