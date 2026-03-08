# Shipment Tracking Module - API Documentation

## Overview

The Shipment Tracking Module provides RESTful APIs for managing agricultural logistics and shipment tracking. It enables farmers and logistics managers to create shipments, track their status in real-time, and manage transportation details.

**Base URL:** `/api/v1/shipments`  
**Authentication:** Required (Bearer Token)  
**API Version:** 1.0

---

## Table of Contents

1. [Shipment Model](#shipment-model)
2. [API Endpoints](#api-endpoints)
3. [Status Lifecycle](#status-lifecycle)
4. [Error Handling](#error-handling)
5. [Integration Guide](#integration-guide)
6. [Examples](#examples)

---

## Shipment Model

### Shipment Object

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "shipmentId": "AGRI-2025-0001",
  "farmerId": "user-123",
  "cropType": "Wheat",
  "quantity": 500,
  "status": "in_transit",
  "driverName": "John Doe",
  "vehicleNumber": "DL-01-AB-1234",
  "vehicleType": "truck",
  "pickupLocation": {
    "latitude": 28.7041,
    "longitude": 77.1025,
    "address": "Farm Location, New Delhi"
  },
  "deliveryLocation": {
    "latitude": 28.5244,
    "longitude": 77.1855,
    "address": "Market Hub, New Delhi"
  },
  "currentLocation": {
    "latitude": 28.6328,
    "longitude": 77.2197,
    "address": "Highway NH-1",
    "timestamp": "2025-02-15T14:30:00Z"
  },
  "routeDetails": "Farm → Highway NH-1 → Market Hub",
  "estimatedDeliveryDate": "2025-02-16T18:00:00Z",
  "createdAt": "2025-02-15T08:00:00Z",
  "updatedAt": "2025-02-15T14:30:00Z",
  "pickedUpAt": "2025-02-15T09:30:00Z",
  "deliveredAt": null,
  "notes": "Handle with care - organic produce",
  "trackingNotes": "Shipment created...\nPicked up at 09:30...",
  "phoneNumber": "+91 9876543210",
  "email": "farmer@example.com"
}
```

### Status Values

- `created` - Shipment created, awaiting pickup
- `picked_up` - Driver picked up the shipment
- `in_transit` - Shipment is being transported
- `delivered` - Shipment delivered to destination

---

## API Endpoints

### 1. Create Shipment

Creates a new shipment for a farmer.

**Endpoint:** `POST /api/v1/shipments`

**Authentication:** Required

**Request Body:**

```json
{
  "cropType": "Wheat",
  "quantity": 500,
  "driverName": "John Doe",
  "vehicleNumber": "DL-01-AB-1234",
  "vehicleType": "truck",
  "pickupLocation": {
    "latitude": 28.7041,
    "longitude": 77.1025,
    "address": "Farm, Delhi"
  },
  "deliveryLocation": {
    "latitude": 28.5244,
    "longitude": 77.1855,
    "address": "Market, Delhi"
  },
  "routeDetails": "Farm → Market",
  "estimatedDeliveryDate": "2025-02-16T18:00:00Z",
  "notes": "Handle with care",
  "phoneNumber": "+91 9876543210",
  "email": "farmer@example.com"
}
```

**Query Parameters:** None

**Response (201 Created):**

```json
{
  "message": "Shipment created successfully",
  "shipment": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "shipmentId": "AGRI-2025-0001",
    "status": "created",
    ...
  }
}
```

---

### 2. Get All Shipments

Fetches all shipments for the authenticated user (or all if admin).

**Endpoint:** `GET /api/v1/shipments`

**Authentication:** Required

**Query Parameters:**

| Parameter | Type   | Description                                                     |
| --------- | ------ | --------------------------------------------------------------- |
| status    | string | Filter by status: created, picked_up, in_transit, delivered     |
| farmerId  | string | (Admin only) Filter by specific farmer ID                      |
| limit     | number | Number of results per page (default: 50, max: 100)             |
| offset    | number | Pagination offset (default: 0)                                 |

**Example Request:**

```bash
GET /api/v1/shipments?status=in_transit&limit=20&offset=0
```

**Response (200 OK):**

```json
{
  "message": "Shipments retrieved successfully",
  "shipments": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "shipmentId": "AGRI-2025-0001",
      "cropType": "Wheat",
      "quantity": 500,
      "status": "in_transit",
      ...
    }
  ],
  "pagination": {
    "total": 45,
    "limit": 20,
    "offset": 0,
    "hasMore": true
  }
}
```

---

### 3. Get Shipment by ID

Retrieves details of a specific shipment.

**Endpoint:** `GET /api/v1/shipments/:shipmentId`

**Authentication:** Required

**Path Parameters:**

| Parameter   | Type   | Description                   |
| ----------- | ------ | ----------------------------- |
| shipmentId  | string | Formatted shipment ID (e.g., AGRI-2025-0001) |

**Example Request:**

```bash
GET /api/v1/shipments/AGRI-2025-0001
```

**Response (200 OK):**

```json
{
  "message": "Shipment retrieved successfully",
  "shipment": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "shipmentId": "AGRI-2025-0001",
    "farmerId": "user-123",
    "cropType": "Wheat",
    "quantity": 500,
    "status": "in_transit",
    ...
  }
}
```

---

### 4. Update Shipment Status

Updates the status of a shipment and adds tracking notes.

**Endpoint:** `PATCH /api/v1/shipments/:shipmentId/status`

**Authentication:** Required

**Path Parameters:**

| Parameter   | Type   | Description          |
| ----------- | ------ | -------------------- |
| shipmentId  | string | Formatted shipment ID |

**Request Body:**

```json
{
  "status": "in_transit",
  "notes": "Left warehouse at 2:00 PM, on highway NH-1",
  "location": {
    "latitude": 28.6328,
    "longitude": 77.2197,
    "address": "Highway NH-1"
  }
}
```

**Response (200 OK):**

```json
{
  "message": "Shipment status updated successfully",
  "shipment": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "shipmentId": "AGRI-2025-0001",
    "status": "in_transit",
    "currentLocation": {
      "latitude": 28.6328,
      "longitude": 77.2197,
      "address": "Highway NH-1",
      "timestamp": "2025-02-15T14:30:00Z"
    },
    "trackingNotes": "... previous notes ...\n2025-02-15T14:30:00Z - Status: in_transit: Left warehouse at 2:00 PM, on highway NH-1",
    ...
  }
}
```

---

### 5. Update Transport Details

Updates driver, vehicle, or route information.

**Endpoint:** `PATCH /api/v1/shipments/:shipmentId/transport`

**Authentication:** Required

**Path Parameters:**

| Parameter   | Type   | Description          |
| ----------- | ------ | -------------------- |
| shipmentId  | string | Formatted shipment ID |

**Request Body:**

```json
{
  "driverName": "Jane Smith",
  "vehicleNumber": "DL-01-CD-5678",
  "vehicleType": "van",
  "routeDetails": "Farm → Highway → Distribution Center"
}
```

**Response (200 OK):**

```json
{
  "message": "Transport details updated successfully",
  "shipment": {
    "shipmentId": "AGRI-2025-0001",
    "driverName": "Jane Smith",
    "vehicleNumber": "DL-01-CD-5678",
    "vehicleType": "van",
    "routeDetails": "Farm → Highway → Distribution Center",
    ...
  }
}
```

---

### 6. Update Location (GPS Tracking)

Updates the current GPS location of a shipment.

**Endpoint:** `PATCH /api/v1/shipments/:shipmentId/location`

**Authentication:** Required

**Path Parameters:**

| Parameter   | Type   | Description          |
| ----------- | ------ | -------------------- |
| shipmentId  | string | Formatted shipment ID |

**Request Body:**

```json
{
  "latitude": 28.5500,
  "longitude": 77.2100,
  "address": "Approaching delivery location"
}
```

**Response (200 OK):**

```json
{
  "message": "Location updated successfully",
  "shipment": {
    "shipmentId": "AGRI-2025-0001",
    "currentLocation": {
      "latitude": 28.5500,
      "longitude": 77.2100,
      "address": "Approaching delivery location",
      "timestamp": "2025-02-15T17:45:00Z"
    },
    ...
  }
}
```

---

### 7. Get Shipment History/Timeline

Retrieves the complete tracking timeline for a shipment.

**Endpoint:** `GET /api/v1/shipments/:shipmentId/history`

**Authentication:** Required

**Path Parameters:**

| Parameter   | Type   | Description          |
| ----------- | ------ | -------------------- |
| shipmentId  | string | Formatted shipment ID |

**Response (200 OK):**

```json
{
  "message": "Shipment history retrieved successfully",
  "shipmentId": "AGRI-2025-0001",
  "timeline": [
    {
      "status": "created",
      "timestamp": "2025-02-15T08:00:00Z",
      "description": "Shipment created",
      "icon": "CheckCircle"
    },
    {
      "status": "picked_up",
      "timestamp": "2025-02-15T09:30:00Z",
      "description": "Picked up by John Doe",
      "details": "Vehicle: DL-01-AB-1234",
      "icon": "Truck"
    },
    {
      "status": "in_transit",
      "timestamp": "2025-02-15T09:30:00Z",
      "description": "In transit to destination",
      "location": {
        "latitude": 28.6328,
        "longitude": 77.2197,
        "address": "Highway NH-1"
      },
      "icon": "Navigation"
    }
  ],
  "trackingNotes": "Detailed tracking notes..."
}
```

---

### 8. Delete Shipment

Deletes a shipment (only if in 'created' status, or by admin).

**Endpoint:** `DELETE /api/v1/shipments/:shipmentId`

**Authentication:** Required

**Path Parameters:**

| Parameter   | Type   | Description          |
| ----------- | ------ | -------------------- |
| shipmentId  | string | Formatted shipment ID |

**Response (200 OK):**

```json
{
  "message": "Shipment deleted successfully",
  "shipmentId": "AGRI-2025-0001"
}
```

---

## Status Lifecycle

```
Created
   ↓ (pickup scheduled)
Picked Up
   ↓ (driver starts delivery)
In Transit
   ↓ (delivery complete)
Delivered
   (terminal status)
```

### Valid Transitions:

- `created` → `picked_up` or `created` (cancellation, admin only)
- `picked_up` → `in_transit` or `picked_up` (backward, admin only)
- `in_transit` → `delivered`
- `delivered` → No transitions allowed

---

## Error Handling

### Error Response Format:

```json
{
  "message": "Error description",
  "error": "error_code",
  "statusCode": 400
}
```

### Common HTTP Status Codes:

| Status | Meaning                          |
| ------ | -------------------------------- |
| 201    | Shipment created successfully    |
| 200    | Request successful               |
| 400    | Bad request / validation error   |
| 401    | Unauthorized (invalid token)     |
| 403    | Forbidden (permission denied)    |
| 404    | Shipment not found               |
| 422    | Invalid status transition        |
| 500    | Server error                     |

### Example Error Response:

```json
{
  "message": "Cannot transition from in_transit to created. Valid transitions: delivered",
  "error": "INVALID_STATUS_TRANSITION",
  "statusCode": 422
}
```

---

## Integration Guide

### Frontend Integration

#### 1. Install Dependencies

```bash
npm install axios  # or use fetch()
```

#### 2. Create API Service

```javascript
// services/shipmentService.js
const API_URL = process.env.VITE_API_URL || 'http://localhost:3000/api/v1';

export const shipmentService = {
  // Create shipment
  createShipment: async (data) => {
    const response = await fetch(`${API_URL}/shipments`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    return response.json();
  },

  // Get all shipments
  getAllShipments: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await fetch(`${API_URL}/shipments?${params}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });
    return response.json();
  },

  // Get shipment by ID
  getShipmentById: async (shipmentId) => {
    const response = await fetch(`${API_URL}/shipments/${shipmentId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });
    return response.json();
  },

  // Update status
  updateStatus: async (shipmentId, data) => {
    const response = await fetch(`${API_URL}/shipments/${shipmentId}/status`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    return response.json();
  },

  // Update location
  updateLocation: async (shipmentId, latitude, longitude, address) => {
    const response = await fetch(`${API_URL}/shipments/${shipmentId}/location`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ latitude, longitude, address })
    });
    return response.json();
  }
};
```

#### 3. Using in React Component

```javascript
import { shipmentService } from './services/shipmentService';

// In your component
useEffect(() => {
  shipmentService.getAllShipments({ status: 'in_transit' })
    .then(data => setShipments(data.shipments))
    .catch(err => console.error(err));
}, []);
```

### Database Setup (Supabase)

Run the following SQL to create the shipments table:

```sql
CREATE TABLE shipments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_id VARCHAR(20) UNIQUE NOT NULL,
  farmer_id UUID NOT NULL REFERENCES users(id),
  crop_type VARCHAR(50) NOT NULL,
  quantity DECIMAL(10, 2) NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('created', 'picked_up', 'in_transit', 'delivered')),
  driver_name VARCHAR(100),
  vehicle_number VARCHAR(50),
  vehicle_type VARCHAR(30),
  pickup_location JSONB,
  delivery_location JSONB,
  current_location JSONB,
  route_details TEXT,
  estimated_delivery_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  picked_up_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  tracking_notes TEXT,
  phone_number VARCHAR(20),
  email VARCHAR(100)
);

CREATE INDEX idx_shipment_id ON shipments(shipment_id);
CREATE INDEX idx_farmer_id ON shipments(farmer_id);
CREATE INDEX idx_status ON shipments(status);
CREATE INDEX idx_created_at ON shipments(created_at DESC);
```

---

## Examples

### Example 1: Complete Workflow

```bash
# 1. Create a shipment
curl -X POST http://localhost:3000/api/v1/shipments \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "cropType": "Wheat",
    "quantity": 500,
    "driverName": "John Doe",
    "vehicleNumber": "DL-01-AB-1234",
    "vehicleType": "truck",
    "pickupLocation": {
      "latitude": 28.7041,
      "longitude": 77.1025,
      "address": "Farm, Delhi"
    },
    "deliveryLocation": {
      "latitude": 28.5244,
      "longitude": 77.1855,
      "address": "Market, Delhi"
    },
    "notes": "Handle with care - organic produce"
  }'

# Expected Response:
# {
#   "message": "Shipment created successfully",
#   "shipment": {
#     "shipmentId": "AGRI-2025-0001",
#     "status": "created",
#     ...
#   }
# }

# 2. Update status to picked_up
curl -X PATCH http://localhost:3000/api/v1/shipments/AGRI-2025-0001/status \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "picked_up",
    "notes": "Pickup completed at 9:30 AM"
  }'

# 3. Track GPS location
curl -X PATCH http://localhost:3000/api/v1/shipments/AGRI-2025-0001/location \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "latitude": 28.6328,
    "longitude": 77.2197,
    "address": "Highway NH-1"
  }'

# 4. Update to in_transit
curl -X PATCH http://localhost:3000/api/v1/shipments/AGRI-2025-0001/status \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "in_transit",
    "notes": "Left warehouse, on highway"
  }'

# 5. Get shipment history
curl -X GET http://localhost:3000/api/v1/shipments/AGRI-2025-0001/history \
  -H "Authorization: Bearer YOUR_TOKEN"

# 6. Mark as delivered
curl -X PATCH http://localhost:3000/api/v1/shipments/AGRI-2025-0001/status \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "delivered",
    "notes": "Delivered to market at 6:00 PM",
    "location": {
      "latitude": 28.5244,
      "longitude": 77.1855,
      "address": "Market, Delhi"
    }
  }'
```

### Example 2: React Component for Creating Shipment

```javascript
import { useState } from 'react';
import ShipmentForm from './components/ShipmentForm';
import { shipmentService } from './services/shipmentService';

export function CreateShipmentPage() {
  const [loading, setLoading] = useState(false);

  const handleCreateShipment = async (formData) => {
    try {
      setLoading(true);
      const response = await shipmentService.createShipment(formData);
      console.log('Shipment created:', response.shipment.shipmentId);
      alert(`Shipment created: ${response.shipment.shipmentId}`);
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ShipmentForm
      onSubmit={handleCreateShipment}
      loading={loading}
      onCancel={() => window.history.back()}
    />
  );
}
```

---

## Notification Integration (Future)

The system is designed to support notifications. Here's how to extend it:

### SMS Notifications (Twilio)

```javascript
// In shipment.service.js
exports.sendNotification = async (farmerId, message, type = 'sms') => {
  if (type === 'sms') {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const client = require('twilio')(accountSid, authToken);

    await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE,
      to: farmerPhoneNumber
    });
  }
};

// Call when status updates
await this.sendNotification(
  shipment.farmerId,
  `Your shipment ${shipmentId} is now in transit. Track it here: [URL]`,
  'sms'
);
```

### Email Notifications (NodeMailer)

```javascript
const nodemailer = require('nodemailer');

exports.sendEmailNotification = async (email, subject, message) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: subject,
    html: message
  });
};
```

---

## Best Practices

1. **Always include authentication tokens** in request headers
2. **Handle pagination** for large result sets
3. **Validate input data** before submitting to backend
4. **Implement retry logic** for network failures
5. **Use timestamps** for accurate tracking
6. **Store shipment IDs** for audit purposes
7. **Cache shipment data** on frontend to reduce API calls
8. **Implement real-time updates** using WebSockets for live tracking

---

## Support & Troubleshooting

- **401 Unauthorized**: Check your authentication token
- **403 Forbidden**: You don't have permission to access this shipment
- **404 Not Found**: Shipment ID doesn't exist
- **422 Unprocessable Entity**: Invalid status transition

---

Generated: February 15, 2025  
Version: 1.0
