# Shipment Module - Testing & Integration Checklist

## Pre-Deployment Checklist

### ✅ Backend Setup

- [ ] Database table created and indexed
  - [ ] SQL script executed in Supabase
  - [ ] Indexes created (4 indexes)
  - [ ] Foreign key references validated
  - [ ] JSONB fields configured

- [ ] Backend files in place
  - [ ] `backend/src/models/shipment.model.js` exists
  - [ ] `backend/src/controllers/shipment.controller.js` exists
  - [ ] `backend/src/routes/shipment.routes.js` exists
  - [ ] `backend/src/services/shipment.service.js` exists

- [ ] App.js integration
  - [ ] Shipment import added
  - [ ] Shipment route registered: `/api/v1/shipments`
  - [ ] Middleware chain verified

- [ ] Dependencies installed
  - [ ] No missing npm packages
  - [ ] All imports resolving
  - [ ] UUID available for ID generation

### ✅ Frontend Setup

- [ ] Frontend files created
  - [ ] `frontend/src/pages/ShipmentDashboard.jsx` exists
  - [ ] `frontend/src/components/shipments/ShipmentCard.jsx` exists
  - [ ] `frontend/src/components/shipments/ShipmentForm.jsx` exists
  - [ ] `frontend/src/components/shipments/ShipmentTimeline.jsx` exists
  - [ ] `frontend/src/components/shipments/ShipmentStatusUpdate.jsx` exists

- [ ] React integration
  - [ ] Components import correctly
  - [ ] No missing dependencies (lucide-react, etc.)
  - [ ] Tailwind CSS available
  - [ ] React Hooks working (useState, useEffect)

- [ ] Routing setup
  - [ ] Dashboard page added to routes
  - [ ] Navigation link created (if needed)
  - [ ] Page accessible at `/shipments` path

### ✅ API Verification

- [ ] API running
  - [ ] Backend started: `npm start` in backend folder
  - [ ] Health endpoint working: `GET /health` → 200 OK
  - [ ] API listening on localhost:3000

- [ ] Authentication working
  - [ ] Valid JWT token obtained
  - [ ] Token stored in localStorage
  - [ ] Auth header properly formatted: `Authorization: Bearer <token>`

- [ ] Route registration
  - [ ] GET `/api/v1/shipments` accessible
  - [ ] POST `/api/v1/shipments` accessible
  - [ ] PATCH `/api/v1/shipments/:id/status` accessible
  - [ ] Other endpoints responsive

### ✅ Documentation
- [ ] SHIPMENT_API_DOCUMENTATION.md complete
- [ ] SHIPMENT_MODULE_README.md complete
- [ ] SHIPMENT_QUICK_START.md complete
- [ ] SHIPMENT_ARCHITECTURE_GUIDE.md complete
- [ ] This checklist complete

---

## API Endpoint Testing

### Test 1: Get All Shipments (Basic)

**Endpoint**: `GET /api/v1/shipments`

```bash
curl http://localhost:3000/api/v1/shipments \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected Response**:
```json
{
  "message": "Shipments retrieved successfully",
  "shipments": [],
  "pagination": { "total": 0, ... }
}
```

- [ ] Status 200 ✓
- [ ] Message present ✓
- [ ] Shipments array present ✓
- [ ] Pagination info present ✓

### Test 2: Create Shipment

**Endpoint**: `POST /api/v1/shipments`

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
    "notes": "Test shipment"
  }'
```

**Expected Response**:
```json
{
  "message": "Shipment created successfully",
  "shipment": {
    "shipmentId": "AGRI-2025-XXXX",
    "status": "created",
    ...
  }
}
```

- [ ] Status 201 ✓
- [ ] Shipment ID format correct (AGRI-YYYY-XXXX) ✓
- [ ] Status is "created" ✓
- [ ] All fields present ✓

**Note**: Save the shipmentId for next tests!

### Test 3: Get Shipment by ID

**Endpoint**: `GET /api/v1/shipments/:shipmentId`

```bash
curl http://localhost:3000/api/v1/shipments/AGRI-2025-0001 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected Response**:
```json
{
  "message": "Shipment retrieved successfully",
  "shipment": {
    "shipmentId": "AGRI-2025-0001",
    ...
  }
}
```

- [ ] Status 200 ✓
- [ ] Correct shipment returned ✓
- [ ] All fields populated ✓

### Test 4: Update Status

**Endpoint**: `PATCH /api/v1/shipments/:shipmentId/status`

```bash
curl -X PATCH http://localhost:3000/api/v1/shipments/AGRI-2025-0001/status \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "picked_up",
    "notes": "Driver picked up shipment"
  }'
```

**Expected Response**:
```json
{
  "message": "Shipment status updated successfully",
  "shipment": {
    "status": "picked_up",
    "pickedUpAt": "2025-02-15T...",
    ...
  }
}
```

- [ ] Status 200 ✓
- [ ] Status changed to "picked_up" ✓
- [ ] pickedUpAt timestamp set ✓
- [ ] Tracking notes updated ✓

### Test 5: Update Location

**Endpoint**: `PATCH /api/v1/shipments/:shipmentId/location`

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

**Expected Response**:
```json
{
  "message": "Location updated successfully",
  "shipment": {
    "currentLocation": {
      "latitude": 28.6328,
      "longitude": 77.2197,
      "address": "Highway NH-1",
      "timestamp": "2025-02-15T14:30:00Z"
    },
    ...
  }
}
```

- [ ] Status 200 ✓
- [ ] currentLocation updated ✓
- [ ] Timestamp present ✓

### Test 6: Update to In Transit

**Endpoint**: `PATCH /api/v1/shipments/:shipmentId/status`

```bash
curl -X PATCH http://localhost:3000/api/v1/shipments/AGRI-2025-0001/status \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "in_transit",
    "notes": "On highway, ETA 6:00 PM"
  }'
```

- [ ] Status 200 ✓
- [ ] Status changed to "in_transit" ✓

### Test 7: Get Timeline/History

**Endpoint**: `GET /api/v1/shipments/:shipmentId/history`

```bash
curl http://localhost:3000/api/v1/shipments/AGRI-2025-0001/history \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected Response**:
```json
{
  "message": "Shipment history retrieved successfully",
  "timeline": [
    {
      "status": "created",
      "timestamp": "...",
      "description": "Shipment created"
    },
    {
      "status": "picked_up",
      "timestamp": "...",
      "description": "Picked up by John Doe"
    },
    {
      "status": "in_transit",
      "timestamp": "...",
      "description": "In transit to destination"
    }
  ],
  "trackingNotes": "..."
}
```

- [ ] Status 200 ✓
- [ ] Timeline array has 3+ events ✓
- [ ] Events in chronological order ✓
- [ ] All statuses included ✓

### Test 8: Mark as Delivered

**Endpoint**: `PATCH /api/v1/shipments/:shipmentId/status`

```bash
curl -X PATCH http://localhost:3000/api/v1/shipments/AGRI-2025-0001/status \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "delivered",
    "notes": "Successfully delivered at market",
    "location": {
      "latitude": 28.5244,
      "longitude": 77.1855,
      "address": "Market"
    }
  }'
```

- [ ] Status 200 ✓
- [ ] Status changed to "delivered" ✓
- [ ] deliveredAt timestamp set ✓

### Test 9: Filter by Status

**Endpoint**: `GET /api/v1/shipments?status=delivered`

```bash
curl "http://localhost:3000/api/v1/shipments?status=delivered" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

- [ ] Status 200 ✓
- [ ] Returns only "delivered" shipments ✓

### Test 10: Pagination

**Endpoint**: `GET /api/v1/shipments?limit=10&offset=0`

```bash
curl "http://localhost:3000/api/v1/shipments?limit=10&offset=0" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

- [ ] Status 200 ✓
- [ ] Pagination info correct ✓
- [ ] Results limited to 10 ✓

---

## Frontend Component Testing

### Dashboard Page

- [ ] Page loads without errors
  - [ ] Check browser console for errors
  - [ ] All components render
  - [ ] No infinite loops

- [ ] Statistics display
  - [ ] Total count shows correct number
  - [ ] Status counts accurate
  - [ ] Colors match specification

- [ ] Search functionality
  - [ ] Search by shipment ID works
  - [ ] Search by crop type works
  - [ ] Results update in real-time
  - [ ] Search is debounced

- [ ] Filter functionality
  - [ ] Filter by "All Status" shows all
  - [ ] Filter by "Created" shows only created
  - [ ] Filter by "Delivered" shows only delivered
  - [ ] Filters work together with search

- [ ] Shipment List
  - [ ] List displays shipments
  - [ ] Click shipment highlights it
  - [ ] Clicking loads details
  - [ ] Scrolling works smoothly

- [ ] Shipment Details
  - [ ] Shows selected shipment info
  - [ ] All fields displayed correctly
  - [ ] Location coordinates shown
  - [ ] Contact info displayed (if present)
  - [ ] "Update Status" button visible (if not delivered)

- [ ] Timeline
  - [ ] Displays vertical line
  - [ ] Shows all events
  - [ ] Icons render correctly
  - [ ] Timestamps formatted nicely
  - [ ] Location info shows (if available)

### Create Shipment Form

- [ ] Form displays
  - [ ] All sections visible
  - [ ] Form is responsive
  - [ ] Modal closes properly

- [ ] Form validation
  - [ ] Required fields marked with *
  - [ ] Error messages appear
  - [ ] Errors clear when typing

- [ ] Form submission
  - [ ] "Create" button works
  - [ ] Loading state shows
  - [ ] Success message appears
  - [ ] Form closes on success
  - [ ] Shipment added to list

- [ ] Form fields
  - [ ] Crop type input works
  - [ ] Quantity accepts numbers
  - [ ] Driver name input works
  - [ ] Vehicle number input works
  - [ ] Location fields accept coordinates
  - [ ] Date picker works
  - [ ] Notes textarea works

### Status Update Modal

- [ ] Modal displays
  - [ ] Shows current shipment info
  - [ ] Shows current status badge
  - [ ] Modal can be dismissed

- [ ] Status dropdown
  - [ ] Shows valid next statuses only
  - [ ] Selection works
  - [ ] Different statuses show different options

- [ ] Location input
  - [ ] Latitude field works
  - [ ] Longitude field works
  - [ ] Address field works

- [ ] Notes textarea
  - [ ] Text can be entered
  - [ ] Multi-line text works

- [ ] Submission
  - [ ] "Update Status" button works
  - [ ] Loading state shows
  - [ ] Success message appears
  - [ ] Details refresh
  - [ ] Timeline updates

---

## Error Handling Tests

### Test Invalid Authentication

```bash
curl http://localhost:3000/api/v1/shipments \
  -H "Authorization: Bearer INVALID_TOKEN"
```

- [ ] Status 401 Unauthorized ✓
- [ ] Error message present ✓

### Test Missing Required Field

```bash
curl -X POST http://localhost:3000/api/v1/shipments \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"quantity": 500}'  # Missing required fields
```

- [ ] Status 400 Bad Request ✓
- [ ] Error message clear ✓

### Test Non-existent Shipment

```bash
curl http://localhost:3000/api/v1/shipments/AGRI-9999-9999 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

- [ ] Status 404 Not Found ✓
- [ ] Error message present ✓

### Test Invalid Status Transition

```bash
curl -X PATCH http://localhost:3000/api/v1/shipments/AGRI-2025-0001/status \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "created"}'  # Can't go backward
```

- [ ] Status 422 Unprocessable Entity ✓
- [ ] Error message explains valid transitions ✓

---

## Integration Testing Scenario

### Full Workflow Test

```
1. Initialize
   [ ] Clear browser cache
   [ ] Login to application
   [ ] Navigate to /shipments

2. Check Dashboard
   [ ] Page loads
   [ ] Stats show zero shipments
   [ ] Search/filter available
   [ ] "New Shipment" button visible

3. Create Shipment
   [ ] Click "New Shipment"
   [ ] Form appears
   [ ] Fill all required fields
   [ ] Submit form
   [ ] Success message
   [ ] Form closes
   [ ] Shipment appears in list

4. View Details
   [ ] Click created shipment
   [ ] Details panel updates
   [ ] Timeline shows 1 event (Created)
   [ ] All data correct

5. Update Status - Picked Up
   [ ] Click "Update Status"
   [ ] Modal appears
   [ ] Select "Picked Up"
   [ ] Add note "Pickup completed"
   [ ] Submit
   [ ] Success message
   [ ] Details update
   [ ] Timeline shows 2 events

6. Update Location
   [ ] Update status to "In Transit"
   [ ] Add GPS coordinates
   [ ] Add note "On highway"
   [ ] Submit
   [ ] Location updates in details
   [ ] Timeline shows 3 events

7. Mark Delivered
   [ ] Update status to "Delivered"
   [ ] Add delivery location
   [ ] Add note "Successfully delivered"
   [ ] Submit
   [ ] Status badge turns green
   [ ] "Update Status" button disappears
   [ ] Timeline shows 4 events

8. Verify Complete Timeline
   [ ] Created event present with timestamp
   [ ] Picked Up event present with timestamp
   [ ] In Transit event present with timestamp
   [ ] Delivered event present with timestamp
   [ ] All timestamps in order
   [ ] Tracking notes section shows history

9. Test Filtering
   [ ] Filter by "Delivered" status
   [ ] Shipment appears in list
   [ ] Stats show 1 delivered
   [ ] Filter by "Created" status
   [ ] Shipment not in list
   [ ] Filter to "All Status"
   [ ] Shipment reappears

10. Search
    [ ] Search by exact ID
    [ ] Search results show shipment
    [ ] Search by crop type
    [ ] Search results show shipment
    [ ] Clear search
    [ ] All shipments show
```

- [ ] All 10 steps completed successfully ✓

---

## Performance Testing

### Response Time Benchmarks

- [ ] Create Shipment: < 200ms
- [ ] Get All Shipments: < 300ms
- [ ] Get Single Shipment: < 100ms
- [ ] Update Status: < 150ms
- [ ] Get Timeline: < 100ms

### Load Testing (Optional)

- [ ] 100 concurrent users: API stable
- [ ] 1000 shipments in database: Queries < 500ms
- [ ] Large timeline (50+ events): Renders < 1s

### Browser Performance

- [ ] Dashboard loads in < 2s
- [ ] Components render smoothly (60 FPS)
- [ ] No memory leaks on page navigation
- [ ] Smooth scrolling in lists

---

## Compatibility Testing

### Browsers

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

### Devices

- [ ] Desktop (1920x1080)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)

### Operating Systems

- [ ] Windows
- [ ] macOS
- [ ] Linux
- [ ] iOS (if mobile app)
- [ ] Android (if mobile app)

---

## Security Testing

- [ ] SQL Injection Test
  - [ ] Try malicious input in forms
  - [ ] No database errors exposed

- [ ] XSS Test
  - [ ] Enter `<script>alert('xss')</script>` in forms
  - [ ] No script execution

- [ ] CSRF Protection
  - [ ] Token validation working
  - [ ] Cross-site requests rejected

- [ ] Authorization
  - [ ] Farmer can't see other farmer's shipments
  - [ ] Non-authenticated users can't access API

- [ ] Data Validation
  - [ ] Negative quantities rejected
  - [ ] Invalid coordinates rejected
  - [ ] Empty required fields rejected

---

## Deployment Readiness

### Pre-Production

- [ ] All tests passing
- [ ] Error logging configured
- [ ] Database backups enabled
- [ ] Security headers set
- [ ] HTTPS configured
- [ ] Rate limiting enabled
- [ ] Environment variables secured
- [ ] API keys not in source code

### Post-Deployment

- [ ] Monitor error rates
- [ ] Check response times
- [ ] Verify database connectivity
- [ ] Test with real data
- [ ] User acceptance testing (UAT)
- [ ] Performance monitoring active
- [ ] Alerting configured

---

## Maintenance Checklist

### Weekly

- [ ] Check error logs
- [ ] Verify backup copies exist
- [ ] Check database size growth
- [ ] Monitor API response times

### Monthly

- [ ] Review performance metrics
- [ ] Update dependencies
- [ ] Clean old/archived shipments
- [ ] User feedback review

### Quarterly

- [ ] Security audit
- [ ] Capacity planning
- [ ] Feature improvement planning
- [ ] Performance optimization review

---

## Sign-Off

- [ ] All API tests passed
- [ ] All frontend tests passed
- [ ] Error handling verified
- [ ] Performance acceptable
- [ ] Security verified
- [ ] Documentation complete
- [ ] Ready for production

**Tested By**: ________________  
**Date**: ________________  
**Status**: ✅ APPROVED FOR PRODUCTION

---

**Note**: This checklist should be completed before any production deployment. Save a signed copy for compliance records.
