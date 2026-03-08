# Shipment Tracking Module - Implementation Guide

## Overview

This module provides comprehensive logistics and shipment tracking functionality for the Smart Agriculture application. It enables farmers to create shipments, track their status in real-time, and manage transportation details through an intuitive dashboard.

## Key Features

✅ **Unique Shipment IDs** - Formatted IDs (AGRI-YYYY-XXXX) for easy tracking  
✅ **Status Tracking** - Track shipments through their complete lifecycle  
✅ **Real-time GPS Updates** - See current location of shipments  
✅ **Driver & Vehicle Management** - Assign and update transport details  
✅ **Complete Timeline** - View full history of shipment updates  
✅ **Search & Filter** - Find shipments by ID, status, or crop type  
✅ **RESTful API** - Enterprise-grade API design  
✅ **Responsive Dashboard** - Works on desktop and mobile  

---

## Architecture

### Backend Structure

```
backend/src/
├── models/
│   └── shipment.model.js          # Data schema definition
├── controllers/
│   └── shipment.controller.js     # Request handlers & business logic
├── routes/
│   └── shipment.routes.js         # API endpoint definitions
├── services/
│   └── shipment.service.js        # Reusable business logic & utilities
└── app.js                         # Main app integration
```

### Frontend Structure

```
frontend/src/
├── components/
│   └── shipments/
│       ├── ShipmentCard.jsx       # Displays shipment summary
│       ├── ShipmentForm.jsx       # Create/edit shipment form
│       ├── ShipmentTimeline.jsx   # Status timeline visualization
│       └── ShipmentStatusUpdate.jsx # Status update modal
├── pages/
│   └── ShipmentDashboard.jsx      # Main dashboard page
└── services/
    └── shipmentService.js         # API calls service layer
```

---

## Installation & Setup

### 1. Create Supabase Table

Create the `shipments` table with this SQL:

```sql
CREATE TABLE shipments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_id VARCHAR(20) UNIQUE NOT NULL,
  farmer_id UUID NOT NULL REFERENCES users(id),
  crop_type VARCHAR(50) NOT NULL,
  quantity DECIMAL(10, 2) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'created' 
    CHECK (status IN ('created', 'picked_up', 'in_transit', 'delivered')),
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

-- Create indexes for better performance
CREATE INDEX idx_shipment_id ON shipments(shipment_id);
CREATE INDEX idx_farmer_id ON shipments(farmer_id);
CREATE INDEX idx_status ON shipments(status);
CREATE INDEX idx_created_at ON shipments(created_at DESC);
```

### 2. Backend Integration

The routes are already integrated into `app.js`. The shipment module is automatically available at `/api/v1/shipments`.

### 3. Frontend Integration

Add the dashboard to your frontend routing:

```javascript
// In your main routing configuration (App.jsx)
import ShipmentDashboard from './pages/ShipmentDashboard';

const routes = [
  // ... other routes
  { path: '/shipments', component: ShipmentDashboard },
];
```

### 4. Environment Variables (Optional)

```env
# .env or .env.local
VITE_API_URL=http://localhost:3000/api/v1
```

---

## Usage Guide

### For Farmers

#### 1. Create a Shipment

1. Click **"New Shipment"** button on the dashboard
2. Fill in the shipment details:
   - **Crop Type**: Type of agriculture product
   - **Quantity**: Amount in kilograms
   - **Driver Name**: Name of transport driver
   - **Vehicle Number**: License plate number
   - **Locations**: Pickup and delivery coordinates
3. Click **"Create Shipment"**
4. Get your unique **Shipment ID** (e.g., AGRI-2025-0001)

#### 2. Track Your Shipment

1. Go to **Shipment Dashboard**
2. Search by **Shipment ID** or **Crop Type**
3. Click on any shipment to view details
4. See the **Timeline** showing all status updates
5. View **Current Location** updated in real-time

#### 3. Update Shipment Status

1. Select a shipment from the list
2. Click **"Update Status"** button
3. Select new status:
   - **Picked Up** → Driver picked up the shipment
   - **In Transit** → Currently being transported
   - **Delivered** → Reached destination
4. Add optional location coordinates (GPS)
5. Add tracking notes (e.g., "Left warehouse at 9:30 AM")
6. Click **"Update Status"**

### For Logistics Managers

#### Filter Shipments

Use the dashboard filters to:
- Filter by **Status**: See all shipments in specific status
- Search by **ID**: Find exact shipment
- Pagination: Handle large volumes efficiently

#### Bulk Operations

Use the API directly for bulk operations:

```bash
# Get all in-transit shipments
curl "http://localhost:3000/api/v1/shipments?status=in_transit" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## API Endpoints Summary

| Method | Endpoint                      | Description                    |
| ------ | ----------------------------- | ------------------------------ |
| POST   | `/shipments`                  | Create new shipment            |
| GET    | `/shipments`                  | Get all shipments              |
| GET    | `/shipments/:shipmentId`      | Get specific shipment          |
| PATCH  | `/shipments/:shipmentId/status` | Update shipment status       |
| PATCH  | `/shipments/:shipmentId/transport` | Update driver/vehicle info |
| PATCH  | `/shipments/:shipmentId/location` | Update GPS location        |
| GET    | `/shipments/:shipmentId/history` | Get shipment timeline     |
| DELETE | `/shipments/:shipmentId`      | Delete shipment               |

For detailed API documentation, see [SHIPMENT_API_DOCUMENTATION.md](../SHIPMENT_API_DOCUMENTATION.md)

---

## Data Flow

### Creating a Shipment

```
User fills form
    ↓
React component validates input
    ↓
POST /api/v1/shipments
    ↓
Backend validates data
    ↓
Generate unique shipment ID (AGRI-2025-XXXX)
    ↓
Insert into Supabase
    ↓
Return shipment object with ID
    ↓
Frontend shows confirmation
```

### Tracking a Shipment

```
User clicks on shipment
    ↓
GET /api/v1/shipments/:shipmentId
    ↓
Backend queries Supabase
    ↓
Return shipment details with location & status
    ↓
GET /api/v1/shipments/:shipmentId/history
    ↓
Backend builds timeline from tracking notes & events
    ↓
Frontend displays timeline visualization
```

---

## Code Examples

### Example 1: Create Shipment via API

```javascript
const createShipment = async () => {
  const response = await fetch('http://localhost:3000/api/v1/shipments', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      cropType: 'Wheat',
      quantity: 500,
      driverName: 'John Doe',
      vehicleNumber: 'DL-01-AB-1234',
      pickupLocation: {
        latitude: 28.7041,
        longitude: 77.1025,
        address: 'Farm, Delhi'
      },
      deliveryLocation: {
        latitude: 28.5244,
        longitude: 77.1855,
        address: 'Market, Delhi'
      }
    })
  });

  const data = await response.json();
  console.log('Shipment ID:', data.shipment.shipmentId);
};
```

### Example 2: Update GPS Location

```javascript
const updateLocation = async (shipmentId, lat, lng) => {
  const response = await fetch(
    `http://localhost:3000/api/v1/shipments/${shipmentId}/location`,
    {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        latitude: lat,
        longitude: lng,
        address: 'Current Location'
      })
    }
  );

  const data = await response.json();
  console.log('Location updated:', data.shipment.currentLocation);
};
```

### Example 3: Real-time Location Tracking

```javascript
// Simulate GPS updates every 5 minutes
const startLocationTracking = (shipmentId) => {
  setInterval(async () => {
    // Get current GPS coordinates (from device or mock)
    const { latitude, longitude } = getCurrentLocation();

    await updateLocation(shipmentId, latitude, longitude);
  }, 5 * 60 * 1000); // Every 5 minutes
};
```

---

## Status Lifecycle

```
      CREATE SHIPMENT
           ↓
      [CREATED] ← Awaiting pickup
      (yellow badge)
           ↓
      UPDATE STATUS
           ↓
    [PICKED UP] ← Driver picked up
     (blue badge)
           ↓
      UPDATE STATUS
           ↓
    [IN TRANSIT] ← On the way
    (purple badge)
           ↓
      UPDATE STATUS
           ↓
    [DELIVERED] ← Delivered
    (green badge - terminal)
```

---

## Error Handling

The system handles errors gracefully:

1. **Network Errors**: Retry mechanism with exponential backoff
2. **Validation Errors**: Show specific field errors in form
3. **Permission Errors**: Show unauthorized message
4. **Server Errors**: Display user-friendly error message

Example error handling:

```javascript
try {
  const response = await fetch(url, options);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }
  
  return await response.json();
} catch (error) {
  console.error('API Error:', error);
  showErrorMessage(error.message);
}
```

---

## Performance Optimizations

1. **Pagination**: Large shipment lists are paginated (default: 50 items per page)
2. **Indexing**: Database indexes on frequently queried fields
3. **Caching**: Frontend caches shipment data locally
4. **Lazy Loading**: Load shipment details only when selected
5. **Debouncing**: Search input is debounced to reduce API calls

---

## Future Enhancements

### 1. Notifications Integration

**SMS Notifications** (Twilio):
```javascript
// When status updates
await sendSMS(
  farmerPhone,
  `Your shipment AGRI-2025-0001 is now in transit. Track: [URL]`
);
```

**Email Notifications** (SendGrid/NodeMailer):
```javascript
await sendEmail(
  farmerEmail,
  'Shipment Update',
  `Your shipment ${shipmentId} status changed to: ${newStatus}`
);
```

**Push Notifications** (Firebase Cloud Messaging):
```javascript
await sendPushNotification(
  farmerId,
  'Shipment Delivered',
  `Shipment ${shipmentId} has been successfully delivered!`
);
```

### 2. Real-time Updates

Implement WebSockets for live tracking:

```javascript
// frontend
const socket = io('http://localhost:3000');
socket.on(`shipment:${shipmentId}:update`, (data) => {
  updateShipmentDisplay(data);
});
```

### 3. Analytics Dashboard

- Shipments delivered on time %
- Average delivery duration
- Route efficiency analysis
- Driver performance metrics

### 4. Mobile App

- iOS/Android app for real-time tracking
- Push notifications for status updates
- Offline mode for areas without connectivity

### 5. Integration with Mapping Services

- Google Maps integration for route optimization
- Real-time traffic updates
- Estimated time of arrival (ETA) calculation

---

## Testing

### Unit Tests Example

```javascript
// shipment.controller.test.js
describe('Shipment Controller', () => {
  test('should create shipment with valid data', async () => {
    const req = {
      body: {
        cropType: 'Wheat',
        quantity: 500,
        driverName: 'John'
        // ...
      },
      user: { userId: 'user-123' }
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await shipmentController.createShipment(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Shipment created successfully'
      })
    );
  });
});
```

---

## Troubleshooting

### Issue: "Shipment not found" error

**Solution**: Check that the shipment ID is correct and belongs to your account

### Issue: "Cannot transition status" error

**Solution**: Check the valid status transitions - ensure you're following the lifecycle

### Issue: Location not updating

**Solution**: Verify latitude/longitude are valid decimal numbers (not strings)

### Issue: Authentication failed

**Solution**: Ensure your auth token is valid and hasn't expired

---

## Component Reference

### ShipmentCard

Displays a shipment summary in card format.

**Props**:
- `shipment` (Object): Shipment data
- `onViewDetails` (Function): Callback when clicking view
- `onUpdateStatus` (Function): Callback when clicking update

```javascript
<ShipmentCard
  shipment={shipmentData}
  onViewDetails={(id) => handleView(id)}
  onUpdateStatus={(id) => handleUpdate(id)}
/>
```

### ShipmentForm

Form for creating/editing shipments.

**Props**:
- `onSubmit` (Function): Called on form submission
- `onCancel` (Function): Called on cancel
- `loading` (Boolean): Show loading state
- `initialData` (Object): Pre-fill form (optional)

### ShipmentTimeline

Displays visual timeline of shipment status updates.

**Props**:
- `timeline` (Array): Array of timeline events
- `shipmentId` (String): Shipment ID for reference

### ShipmentStatusUpdate

Modal for updating shipment status.

**Props**:
- `shipment` (Object): Current shipment data
- `onSubmit` (Function): Called on submission
- `onCancel` (Function): Called on cancel
- `loading` (Boolean): Show loading state

---

## Database Schema Details

### Shipments Table

```sql
-- Core fields
id UUID                    -- Unique identifier
shipment_id VARCHAR(20)    -- Formatted ID (AGRI-2025-XXXX)
farmer_id UUID             -- Foreign key to users

-- Shipment content
crop_type VARCHAR(50)      -- Type of product
quantity DECIMAL(10,2)     -- Amount in kg

-- Current status
status VARCHAR(20)         -- created | picked_up | in_transit | delivered

-- Transport
driver_name VARCHAR(100)   -- Driver name
vehicle_number VARCHAR(50) -- License plate
vehicle_type VARCHAR(30)   -- truck | van | bicycle | motorcycle

-- Locations
pickup_location JSONB      -- {latitude, longitude, address}
delivery_location JSONB    -- {latitude, longitude, address}
current_location JSONB     -- Real-time GPS location

-- Dates
created_at TIMESTAMP       -- When created
updated_at TIMESTAMP       -- Last update
picked_up_at TIMESTAMP     -- When picked up
delivered_at TIMESTAMP     -- When delivered

-- Notes
route_details TEXT         -- Route description
notes TEXT                 -- Special instructions
tracking_notes TEXT        -- Complete tracking history

-- Contact
phone_number VARCHAR(20)   -- Farmer phone
email VARCHAR(100)         -- Farmer email
```

---

## Support

For issues or questions:
1. Check the [API Documentation](../SHIPMENT_API_DOCUMENTATION.md)
2. Review error messages carefully
3. Check browser console for client-side errors
4. Check backend logs for server-side errors
5. Verify Supabase connection and permissions

---

## License

Part of Smart Agriculture Project

---

**Last Updated**: February 15, 2025  
**Version**: 1.0
