# Shipment Module - Quick Start Guide

Get the shipment tracking module up and running in 5 minutes!

## TL;DR - Quick Setup

### Step 1: Create Database Table (1 min)

Run this SQL query in your Supabase dashboard (SQL Editor):

```sql
CREATE TABLE IF NOT EXISTS shipments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_id VARCHAR(20) UNIQUE NOT NULL,
  farmer_id UUID NOT NULL REFERENCES users(id),
  crop_type VARCHAR(50) NOT NULL,
  quantity DECIMAL(10, 2) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'created' CHECK (status IN ('created', 'picked_up', 'in_transit', 'delivered')),
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
```

### Step 2: Backend Already Integrated ✅

The backend files are already created and integrated:
- Models: `backend/src/models/shipment.model.js`
- Controllers: `backend/src/controllers/shipment.controller.js`
- Routes: `backend/src/routes/shipment.routes.js`
- Services: `backend/src/services/shipment.service.js`
- Routes already added to `backend/src/app.js`

### Step 3: Access the API (Verify)

```bash
# Test the API (you need a valid auth token)
curl http://localhost:3000/api/v1/shipments \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN"
```

### Step 4: Add Dashboard to Frontend (2 min)

#### Option A: Add Route to Your Routing

```javascript
// In src/App.jsx or your routing file

import ShipmentDashboard from './pages/ShipmentDashboard';

// Add to your routes
const routes = [
  // ... existing routes
  {
    path: '/shipments',
    element: <ShipmentDashboard />,
    name: 'Shipments'
  }
];
```

#### Option B: Add Navigation Link

```javascript
// In your navigation component
<a href="/shipments" className="nav-link">
  🚚 Shipments
</a>
```

### Step 5: Done! 🎉

- Dashboard available at: `http://localhost:3000/shipments`
- API available at: `http://localhost:3000/api/v1/shipments`
- Create shipments, track status, update locations!

---

## Quick API Test

### Create a Shipment

```bash
curl -X POST http://localhost:3000/api/v1/shipments \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "cropType": "Wheat",
    "quantity": 500,
    "driverName": "John Doe",
    "vehicleNumber": "DL-01-AB-1234",
    "pickupLocation": {
      "latitude": 28.7041,
      "longitude": 77.1025,
      "address": "Farm"
    },
    "deliveryLocation": {
      "latitude": 28.5244,
      "longitude": 77.1855,
      "address": "Market"
    },
    "notes": "Handle with care"
  }'
```

**Response**:
```json
{
  "message": "Shipment created successfully",
  "shipment": {
    "shipmentId": "AGRI-2025-0001",
    "status": "created",
    "cropType": "Wheat",
    ...
  }
}
```

### Get All Shipments

```bash
curl http://localhost:3000/api/v1/shipments \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get Shipment by ID

```bash
curl http://localhost:3000/api/v1/shipments/AGRI-2025-0001 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Update Status

```bash
curl -X PATCH http://localhost:3000/api/v1/shipments/AGRI-2025-0001/status \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "picked_up",
    "notes": "Pickup completed"
  }'
```

### Update Location (GPS)

```bash
curl -X PATCH http://localhost:3000/api/v1/shipments/AGRI-2025-0001/location \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "latitude": 28.6328,
    "longitude": 77.2197,
    "address": "Highway NH-1"
  }'
```

### Get Timeline

```bash
curl http://localhost:3000/api/v1/shipments/AGRI-2025-0001/history \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Dashboard Features

### Create Shipment
- Click **"New Shipment"** button
- Fill form with crop type, quantity, driver, vehicle info
- Set pickup and delivery locations
- Submit to get unique **Shipment ID**

### Track Shipment
- Search by **Shipment ID** or **Crop Type**
- Click shipment to view details
- See **Timeline** of all status updates
- Check **Current Location** (GPS coordinates)
- View **Driver** and **Vehicle** information

### Update Status
- Click **"Update"** button on shipment
- Select new status (Picked Up → In Transit → Delivered)
- Add optional GPS coordinates
- Add tracking notes (e.g., "Left warehouse")
- Submit update

### Filter & Search
- Filter by **Status**: Show all "In Transit" shipments
- Search by **ID**: Find exact shipment
- Pagination: Navigate large lists

---

## Components Overview

### ShipmentDashboard
Main page with list, details, and timeline

### ShipmentCard
Individual shipment display in list

### ShipmentForm
Create/edit shipment form

### ShipmentTimeline
Visual timeline of status updates

### ShipmentStatusUpdate
Modal for updating shipment status

---

## File Locations

```
Backend Files:
- Models: backend/src/models/shipment.model.js
- Controller: backend/src/controllers/shipment.controller.js
- Routes: backend/src/routes/shipment.routes.js
- Service: backend/src/services/shipment.service.js

Frontend Files:
- Components: frontend/src/components/shipments/
  - ShipmentCard.jsx
  - ShipmentForm.jsx
  - ShipmentTimeline.jsx
  - ShipmentStatusUpdate.jsx
- Page: frontend/src/pages/ShipmentDashboard.jsx

Documentation:
- SHIPMENT_MODULE_README.md (detailed guide)
- SHIPMENT_API_DOCUMENTATION.md (API reference)
- SHIPMENT_QUICK_START.md (this file)
```

---

## Status Flow

```
✅ Created (Yellow)
   ↓ Click "Update"
✅ Picked Up (Blue)
   ↓ Click "Update"
✅ In Transit (Purple)
   ↓ Click "Update"
✅ Delivered (Green) - Final
```

---

## Environment Setup

### Backend

No special environment variables needed! Uses existing:
- `DATABASE_URL` (Supabase)
- `JWT_SECRET` (Auth)

### Frontend

Optional:
```env
VITE_API_URL=http://localhost:3000/api/v1
```

---

## Common Issues & Fixes

### "Cannot find shipment"
- Check shipment ID is correct
- Use format: `AGRI-2025-XXXX`

### "Permission denied"
- Ensure you have valid authentication token
- Check authorization header

### "Database error"
- Verify shipments table exists in Supabase
- Check table permissions
- Run SQL setup again

### "Dashboard not loading"
- Check API is running: `curl http://localhost:3000/health`
- Verify auth token in localStorage
- Check browser console for errors

---

## Next Steps

1. **Create Test Data**: Use API to create sample shipments
2. **Test Dashboard**: Navigate to `/shipments` in app
3. **Try Tracking**: Create shipment → Update status → View timeline
4. **Customize**: Modify components/colors to match your theme
5. **Deploy**: Deploy to production when ready

---

## Integration Points

### Add to Navbar

```javascript
<NavLink to="/shipments" className="nav-item">
  🚚 Track Shipments
</NavLink>
```

### Add to Dashboard

```javascript
import ShipmentDashboard from './pages/ShipmentDashboard';

<div>
  <ShipmentDashboard />
</div>
```

### Add Menu Item

```javascript
{
  icon: <Truck />,
  label: "Shipments",
  path: "/shipments",
  permission: "farmer"
}
```

---

## API Endpoints Summary

| Method | URL | Purpose |
|--------|-----|---------|
| POST | `/shipments` | Create shipment |
| GET | `/shipments` | List all shipments |
| GET | `/shipments/:id` | Get details |
| PATCH | `/shipments/:id/status` | Update status |
| PATCH | `/shipments/:id/location` | Update GPS |
| GET | `/shipments/:id/history` | Get timeline |
| DELETE | `/shipments/:id` | Delete (if status='created') |

---

## Example Response

### Create Shipment Response
```json
{
  "message": "Shipment created successfully",
  "shipment": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "shipmentId": "AGRI-2025-0001",
    "farmerId": "user-123",
    "cropType": "Wheat",
    "quantity": 500,
    "status": "created",
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
    "currentLocation": {
      "latitude": 28.7041,
      "longitude": 77.1025,
      "address": "Farm, Delhi",
      "timestamp": "2025-02-15T08:00:00Z"
    },
    "createdAt": "2025-02-15T08:00:00Z",
    "updatedAt": "2025-02-15T08:00:00Z",
    "trackingNotes": "Shipment created by farmer user-123"
  }
}
```

---

## Testing Workflow

1. **Create Shipment**
   - Go to dashboard
   - Click "New Shipment"
   - Fill form
   - Get ID: AGRI-2025-0001

2. **View Shipment**
   - Click on created shipment
   - See all details in right panel

3. **Update Status**
   - Click "Update" button
   - Change to "Picked Up"
   - Add note
   - Submit

4. **Update Location**
   - Update status again to "In Transit"
   - Add GPS coordinates
   - See current location update

5. **Mark Delivered**
   - Update to "Delivered"
   - See green badge
   - View complete timeline

---

## Performance Tips

- Dashboard loads first 50 shipments
- Use filters to reduce data
- Search by ID for quick lookup
- Timestamps auto-refresh every 30 seconds
- Location updates every 5 minutes (adjustable)

---

## For Production Deployment

1. Ensure Supabase backups are enabled
2. Set up API rate limiting
3. Enable CORS for your domain
4. Use HTTPS for all API calls
5. Store auth tokens securely (httpOnly cookies)
6. Set up monitoring/logging
7. Add error tracking (Sentry)

---

## Support Documentation

- **Full API Docs**: [SHIPMENT_API_DOCUMENTATION.md](../SHIPMENT_API_DOCUMENTATION.md)
- **Implementation Guide**: [SHIPMENT_MODULE_README.md](../SHIPMENT_MODULE_README.md)
- **Code Examples**: Check individual component files

---

## Feature Checklist

- ✅ Unique shipment IDs (AGRI-YYYY-XXXX)
- ✅ Create shipments
- ✅ Get shipment details
- ✅ Update shipment status
- ✅ Assign transport details
- ✅ GPS location tracking
- ✅ Status timeline
- ✅ Search & filter
- ✅ RESTful API
- ✅ React dashboard
- ✅ Responsive design
- ✅ Error handling
- ✅ Authentication
- ✅ Permission control

---

**Ready to go! 🚀**

Start creating shipments and tracking your agricultural logistics!

---

Generated: February 15, 2025
