const { supabase } = require('../config/database');
const logger = require('../utils/logger');
const { v4: uuidv4 } = require('uuid');

/**
 * Generate a formatted shipment ID
 * Format: AGRI-YYYY-XXXX (e.g., AGRI-2026-0001)
 */
function generateShipmentId() {
  const timestamp = new Date().getFullYear();
  const randomNum = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
  return `AGRI-${timestamp}-${randomNum}`;
}

/**
 * Helper: convert snake_case DB row to camelCase API response
 */
function formatShipmentResponse(row) {
  return {
    id: row.id,
    shipmentId: row.shipment_id,
    farmerId: row.farmer_id,
    cropType: row.crop_type,
    quantity: row.quantity,
    status: row.status,
    driverName: row.driver_name,
    vehicleNumber: row.vehicle_number,
    vehicleType: row.vehicle_type,
    pickupLocation: row.pickup_location,
    deliveryLocation: row.delivery_location,
    currentLocation: row.current_location,
    routeDetails: row.route_details,
    estimatedDeliveryDate: row.estimated_delivery_date,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    pickedUpAt: row.picked_up_at,
    deliveredAt: row.delivered_at,
    notes: row.notes,
    trackingNotes: row.tracking_notes,
    phoneNumber: row.phone_number,
    email: row.email,
  };
}

/**
 * Create a new shipment
 * POST /api/v1/shipments
 */
exports.createShipment = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const {
      cropType,
      quantity,
      driverName,
      vehicleNumber,
      vehicleType,
      pickupLocation,
      deliveryLocation,
      routeDetails,
      estimatedDeliveryDate,
      notes,
      phoneNumber,
      email,
    } = req.body;

    // Validate required fields
    if (!cropType || !quantity || !driverName || !vehicleNumber) {
      return res.status(400).json({
        message: 'Missing required fields: cropType, quantity, driverName, vehicleNumber',
      });
    }

    const shipmentId = generateShipmentId();

    const { data, error } = await supabase
      .from('shipments')
      .insert([
        {
          id: uuidv4(),
          shipment_id: shipmentId,
          farmer_id: userId,
          crop_type: cropType,
          quantity: Number(quantity),
          status: 'created',
          driver_name: driverName,
          vehicle_number: vehicleNumber,
          vehicle_type: vehicleType || null,
          pickup_location: pickupLocation || null,
          delivery_location: deliveryLocation || null,
          current_location: pickupLocation || null,
          route_details: routeDetails || null,
          estimated_delivery_date: estimatedDeliveryDate || null,
          notes: notes || null,
          phone_number: phoneNumber || null,
          email: email || null,
          tracking_notes: `Shipment created by farmer ${userId}`,
        },
      ])
      .select();

    if (error) {
      logger.error('Error creating shipment:', error);
      return res.status(500).json({ message: 'Failed to create shipment', error: error.message });
    }

    logger.info(`Shipment created: ${shipmentId}`);

    return res.status(201).json({
      message: 'Shipment created successfully',
      shipment: formatShipmentResponse(data[0]),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get shipment details by shipment ID
 * GET /api/v1/shipments/:shipmentId
 */
exports.getShipmentById = async (req, res, next) => {
  try {
    const { shipmentId } = req.params;

    const { data, error } = await supabase
      .from('shipments')
      .select('*')
      .eq('shipment_id', shipmentId)
      .single();

    if (error || !data) {
      return res.status(404).json({ message: 'Shipment not found' });
    }

    if (data.farmer_id && data.farmer_id !== req.user.userId && !req.user.isAdmin) {
      return res.status(403).json({ message: 'You do not have permission to view this shipment' });
    }

    return res.json({
      message: 'Shipment retrieved successfully',
      shipment: formatShipmentResponse(data),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all shipments (with optional filtering)
 * GET /api/v1/shipments?status=in_transit&farmerId=xxx
 */
exports.getAllShipments = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { status, farmerId, limit = 50, offset = 0 } = req.query;

    let query = supabase.from('shipments').select('*', { count: 'exact' });

    // Non-admin users can only see their own shipments
    if (!req.user.isAdmin) {
      query = query.eq('farmer_id', userId);
    } else if (farmerId) {
      query = query.eq('farmer_id', farmerId);
    }

    if (status) {
      query = query.eq('status', status);
    }

    const from = parseInt(offset);
    const to = from + parseInt(limit) - 1;

    query = query.order('created_at', { ascending: false }).range(from, to);

    const { data, error, count } = await query;

    if (error) {
      logger.error('Error fetching shipments:', error);
      return res.status(500).json({ message: 'Failed to fetch shipments', error: error.message });
    }

    return res.json({
      message: 'Shipments retrieved successfully',
      shipments: (data || []).map(formatShipmentResponse),
      pagination: {
        total: count || 0,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: from + (data || []).length < (count || 0),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update shipment status
 * PATCH /api/v1/shipments/:shipmentId/status
 */
exports.updateShipmentStatus = async (req, res, next) => {
  try {
    const { shipmentId } = req.params;
    const { status, location, notes } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    const validStatuses = ['created', 'picked_up', 'in_transit', 'delivered'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    // Fetch current shipment
    const { data: shipment, error: fetchError } = await supabase
      .from('shipments')
      .select('*')
      .eq('shipment_id', shipmentId)
      .single();

    if (fetchError || !shipment) {
      return res.status(404).json({ message: 'Shipment not found' });
    }

    if (shipment.farmer_id !== req.user.userId && !req.user.isAdmin) {
      return res.status(403).json({ message: 'You do not have permission to update this shipment' });
    }

    const updateData = {
      status,
      updated_at: new Date().toISOString(),
      current_location: location || shipment.current_location,
    };

    let trackingNotesEntry = `${new Date().toISOString()} - Status updated to ${status}`;
    if (notes) trackingNotesEntry += `: ${notes}`;
    updateData.tracking_notes = (shipment.tracking_notes || '') + '\n' + trackingNotesEntry;

    if (status === 'picked_up') updateData.picked_up_at = new Date().toISOString();
    if (status === 'delivered') updateData.delivered_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('shipments')
      .update(updateData)
      .eq('shipment_id', shipmentId)
      .select();

    if (error) {
      logger.error('Error updating shipment status:', error);
      return res.status(500).json({ message: 'Failed to update status', error: error.message });
    }

    return res.json({
      message: 'Shipment status updated successfully',
      shipment: formatShipmentResponse(data[0]),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update shipment transport details
 * PATCH /api/v1/shipments/:shipmentId/transport
 */
exports.updateTransportDetails = async (req, res, next) => {
  try {
    const { shipmentId } = req.params;
    const { driverName, vehicleNumber, vehicleType, routeDetails } = req.body;

    const { data: shipment, error: fetchError } = await supabase
      .from('shipments')
      .select('*')
      .eq('shipment_id', shipmentId)
      .single();

    if (fetchError || !shipment) {
      return res.status(404).json({ message: 'Shipment not found' });
    }

    if (shipment.farmer_id !== req.user.userId && !req.user.isAdmin) {
      return res.status(403).json({ message: 'You do not have permission to update this shipment' });
    }

    const updateData = { updated_at: new Date().toISOString() };
    if (driverName) updateData.driver_name = driverName;
    if (vehicleNumber) updateData.vehicle_number = vehicleNumber;
    if (vehicleType) updateData.vehicle_type = vehicleType;
    if (routeDetails) updateData.route_details = routeDetails;

    const { data, error } = await supabase
      .from('shipments')
      .update(updateData)
      .eq('shipment_id', shipmentId)
      .select();

    if (error) {
      logger.error('Error updating transport details:', error);
      return res.status(500).json({ message: 'Failed to update transport', error: error.message });
    }

    return res.json({
      message: 'Transport details updated successfully',
      shipment: formatShipmentResponse(data[0]),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update shipment location (GPS tracking)
 * PATCH /api/v1/shipments/:shipmentId/location
 */
exports.updateLocation = async (req, res, next) => {
  try {
    const { shipmentId } = req.params;
    const { latitude, longitude, address } = req.body;

    if (latitude === undefined || longitude === undefined) {
      return res.status(400).json({ message: 'Latitude and longitude are required' });
    }

    const { data: shipment, error: fetchError } = await supabase
      .from('shipments')
      .select('*')
      .eq('shipment_id', shipmentId)
      .single();

    if (fetchError || !shipment) {
      return res.status(404).json({ message: 'Shipment not found' });
    }

    if (shipment.farmer_id !== req.user.userId && !req.user.isAdmin) {
      return res.status(403).json({ message: 'You do not have permission to update this shipment' });
    }

    const { data, error } = await supabase
      .from('shipments')
      .update({
        current_location: {
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          address: address || 'Not specified',
          timestamp: new Date().toISOString(),
        },
        updated_at: new Date().toISOString(),
      })
      .eq('shipment_id', shipmentId)
      .select();

    if (error) {
      logger.error('Error updating location:', error);
      return res.status(500).json({ message: 'Failed to update location', error: error.message });
    }

    return res.json({
      message: 'Location updated successfully',
      shipment: formatShipmentResponse(data[0]),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a shipment
 * DELETE /api/v1/shipments/:shipmentId
 */
exports.deleteShipment = async (req, res, next) => {
  try {
    const { shipmentId } = req.params;

    const { data: shipment, error: fetchError } = await supabase
      .from('shipments')
      .select('*')
      .eq('shipment_id', shipmentId)
      .single();

    if (fetchError || !shipment) {
      return res.status(404).json({ message: 'Shipment not found' });
    }

    if (shipment.farmer_id !== req.user.userId && !req.user.isAdmin) {
      return res.status(403).json({ message: 'You do not have permission to delete this shipment' });
    }

    if (shipment.status !== 'created' && !req.user.isAdmin) {
      return res.status(400).json({ message: 'Can only delete shipments in "created" status' });
    }

    const { error } = await supabase
      .from('shipments')
      .delete()
      .eq('shipment_id', shipmentId);

    if (error) {
      logger.error('Error deleting shipment:', error);
      return res.status(500).json({ message: 'Failed to delete shipment', error: error.message });
    }

    return res.json({ message: 'Shipment deleted successfully', shipmentId });
  } catch (error) {
    next(error);
  }
};

/**
 * Get shipment tracking history
 * GET /api/v1/shipments/:shipmentId/history
 */
exports.getShipmentHistory = async (req, res, next) => {
  try {
    const { shipmentId } = req.params;

    const { data: shipment, error } = await supabase
      .from('shipments')
      .select('*')
      .eq('shipment_id', shipmentId)
      .single();

    if (error || !shipment) {
      return res.status(404).json({ message: 'Shipment not found' });
    }

    if (shipment.farmer_id !== req.user.userId && !req.user.isAdmin) {
      return res.status(403).json({ message: 'You do not have permission to view this shipment' });
    }

    const timeline = [];

    timeline.push({
      status: 'created',
      timestamp: shipment.created_at,
      description: 'Shipment created',
    });

    if (shipment.picked_up_at) {
      timeline.push({
        status: 'picked_up',
        timestamp: shipment.picked_up_at,
        description: `Picked up by ${shipment.driver_name} (${shipment.vehicle_number})`,
      });
    }

    if (shipment.status === 'in_transit' || shipment.delivered_at) {
      timeline.push({
        status: 'in_transit',
        timestamp: shipment.picked_up_at || shipment.created_at,
        description: 'In transit',
      });
    }

    if (shipment.delivered_at) {
      timeline.push({
        status: 'delivered',
        timestamp: shipment.delivered_at,
        description: 'Delivered',
      });
    }

    return res.json({
      message: 'Shipment history retrieved successfully',
      shipmentId,
      timeline,
      trackingNotes: shipment.tracking_notes,
    });
  } catch (error) {
    next(error);
  }
};
