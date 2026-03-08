const express = require('express');
const shipmentController = require('../controllers/shipment.controller');
const { verifyToken } = require('../middleware/auth.middleware');

/**
 * Shipment Routes
 * All routes require authentication
 * Base URL: /api/v1/shipments
 */

const router = express.Router();

// Apply auth middleware to all routes
router.use(verifyToken);

/**
 * Create a new shipment
 * POST /api/v1/shipments
 * Body: { cropType, quantity, driverName, vehicleNumber, pickupLocation?, deliveryLocation?, ... }
 */
router.post('/', shipmentController.createShipment);

/**
 * Get all shipments (for current farmer or all if admin)
 * GET /api/v1/shipments?status=in_transit&limit=50&offset=0
 */
router.get('/', shipmentController.getAllShipments);

/**
 * Get shipment details by ID
 * GET /api/v1/shipments/:shipmentId
 */
router.get('/:shipmentId', shipmentController.getShipmentById);

/**
 * Get shipment tracking history/timeline
 * GET /api/v1/shipments/:shipmentId/history
 */
router.get('/:shipmentId/history', shipmentController.getShipmentHistory);

/**
 * Update shipment status
 * PATCH /api/v1/shipments/:shipmentId/status
 * Body: { status, location?, notes? }
 */
router.patch('/:shipmentId/status', shipmentController.updateShipmentStatus);

/**
 * Update transport details
 * PATCH /api/v1/shipments/:shipmentId/transport
 * Body: { driverName?, vehicleNumber?, vehicleType?, routeDetails? }
 */
router.patch('/:shipmentId/transport', shipmentController.updateTransportDetails);

/**
 * Update current location (GPS tracking)
 * PATCH /api/v1/shipments/:shipmentId/location
 * Body: { latitude: number, longitude: number, address?: string }
 */
router.patch('/:shipmentId/location', shipmentController.updateLocation);

/**
 * Delete a shipment
 * DELETE /api/v1/shipments/:shipmentId
 */
router.delete('/:shipmentId', shipmentController.deleteShipment);

module.exports = router;
