# Shipment Module - Architecture & Data Flow Guide

## System Architecture

### Three-Tier Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND LAYER                           │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │          React Components (Dashboard)                    │  │
│  │  ┌─────────────┐ ┌──────────────┐ ┌──────────────────┐  │  │
│  │  │   Search   │ │   Filter     │ │ Timeline Display │  │  │
│  │  └─────────────┘ └──────────────┘ └──────────────────┘  │  │
│  │  ┌──────────────────────────────────────────────────┐  │  │
│  │  │        Shipment Cards & Status Updates           │  │  │
│  │  └──────────────────────────────────────────────────┘  │  │
│  └────────────────────────────┬─────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                                 │
                        API Calls (Fetch)
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                       API GATEWAY LAYER                         │
│  Base URL: http://localhost:3000/api/v1/shipments             │
│  Authentication: JWT Bearer Token                             │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                      BACKEND LAYER                              │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │              Express.js Server                          │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │  │
│  │  │   Routes     │  │ Controllers  │  │  Middleware  │  │  │
│  │  │   (8 total)  │  │  (8 methods) │  │ (Auth, Error)│  │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘  │  │
│  │                                                         │  │
│  │  ┌──────────────────────────────────────────────────┐  │  │
│  │  │       Service Layer (Business Logic)             │  │  │
│  │  │  - validateShipment()                            │  │  │
│  │  │  - updateStatus()                               │  │  │
│  │  │  - buildTimeline()                              │  │  │
│  │  │  - calculateStats()                             │  │  │
│  │  └──────────────────────────────────────────────────┘  │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                 │                              │
│                        Supabase Client                         │
│                                 │                              │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                    DATABASE LAYER                               │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │     Supabase (PostgreSQL)                              │  │
│  │                                                        │  │
│  │  TABLE: shipments (columns: 25+)                      │  │
│  │  ┌───────────────────────────────────────────────┐    │  │
│  │  │ Indexes:                                      │    │  │
│  │  │ - idx_shipment_id (unique)                   │    │  │
│  │  │ - idx_farmer_id (foreign key)                │    │  │
│  │  │ - idx_status (for filtering)                 │    │  │
│  │  │ - idx_created_at (for sorting)               │    │  │
│  │  └───────────────────────────────────────────────┘    │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Data Flow Diagrams

### 1. Create Shipment Flow

```
┌────────────────────────────────────────────────────────┐
│ USER: Clicks "New Shipment" Button                    │
└────────────────────┬─────────────────────────────────┘
                     │
                     ▼
┌────────────────────────────────────────────────────────┐
│ FRONTEND: Display ShipmentForm Component              │
│ - Input fields for crop, quantity, driver, vehicle   │
│ - Location pickers for pickup & delivery             │
└────────────────────┬─────────────────────────────────┘
                     │
                     ▼
┌────────────────────────────────────────────────────────┐
│ USER: Fill form & Click "Create Shipment"            │
└────────────────────┬─────────────────────────────────┘
                     │
                     ▼
┌────────────────────────────────────────────────────────┐
│ FRONTEND: Validate Form Data                         │
│ - Check required fields                              │
│ - Validate number inputs                             │
│ - Check email format (if provided)                   │
└────────────────────┬─────────────────────────────────┘
                     │
                     ▼
┌────────────────────────────────────────────────────────┐
│ FRONTEND: POST /api/v1/shipments                      │
│ {                                                    │
│   cropType: "Wheat",                                │
│   quantity: 500,                                    │
│   driverName: "John Doe",                          │
│   vehicleNumber: "DL-01-AB-1234",                  │
│   pickupLocation: { lat, lng, address }            │
│   ...                                              │
│ }                                                  │
└────────────────────┬─────────────────────────────────┘
                     │
                     ▼
┌────────────────────────────────────────────────────────┐
│ BACKEND: shipment.routes.js Receives Request         │
│ - Route matched: POST /                              │
│ - Middleware chain:                                  │
│   1. Authentication middleware (verify JWT)         │
│   2. Route handler (controller)                      │
└────────────────────┬─────────────────────────────────┘
                     │
                     ▼
┌────────────────────────────────────────────────────────┐
│ BACKEND: shipmentController.createShipment()         │
│ - Extract farmerId from auth token                   │
│ - Validate required fields                           │
│ - Generate unique shipmentId (AGRI-2025-XXXX)       │
│ - Prepare data object for database                   │
└────────────────────┬─────────────────────────────────┘
                     │
                     ▼
┌────────────────────────────────────────────────────────┐
│ BACKEND: supabase.insert() into shipments table       │
│ - INSERT INTO shipments VALUES (...)                 │
│ - Status set to 'created'                            │
│ - Timestamps auto-set                                │
│ - Return created record                              │
└────────────────────┬─────────────────────────────────┘
                     │
                     ▼
┌────────────────────────────────────────────────────────┐
│ BACKEND: formatShipmentResponse() Helper              │
│ - Convert snake_case to camelCase                    │
│ - Return 201 status with shipment data               │
└────────────────────┬─────────────────────────────────┘
                     │
                     ▼
┌────────────────────────────────────────────────────────┐
│ FRONTEND: Receive Response (200 or Error)            │
│ {                                                    │
│   message: "Shipment created successfully",          │
│   shipment: {                                        │
│     shipmentId: "AGRI-2025-0001",                   │
│     status: "created",                              │
│     ...                                             │
│   }                                                 │
│ }                                                    │
└────────────────────┬─────────────────────────────────┘
                     │
                     ▼
┌────────────────────────────────────────────────────────┐
│ FRONTEND: Show Success Message                       │
│ - Display shipment ID to user                        │
│ - Close form modal                                   │
│ - Refresh shipment list                              │
└────────────────────┬─────────────────────────────────┘
                     │
                     ▼
┌────────────────────────────────────────────────────────┐
│ USER: Sees new shipment in dashboard                 │
│ - Shipment appears in list with ID AGRI-2025-0001   │
│ - Status shows as "Created" (yellow)                │
│ - Can now track and update                           │
└────────────────────────────────────────────────────────┘
```

### 2. Update Shipment Status Flow

```
┌────────────────────────────────────────────────────────┐
│ USER: Selects Shipment & Clicks "Update Status"      │
└────────────────────┬─────────────────────────────────┘
                     │
                     ▼
┌────────────────────────────────────────────────────────┐
│ FRONTEND: GET /api/v1/shipments/:shipmentId          │
│ - Fetch latest shipment details                      │
└────────────────────┬─────────────────────────────────┘
                     │
                     ▼
┌────────────────────────────────────────────────────────┐
│ BACKEND: Query shipments table                       │
│ - Find by shipment_id                                │
│ - Return shipment record                             │
└────────────────────┬─────────────────────────────────┘
                     │
                     ▼
┌────────────────────────────────────────────────────────┐
│ FRONTEND: Display ShipmentStatusUpdate Modal         │
│ - Show current status                                │
│ - Show valid next statuses                           │
│ - Input for GPS coordinates (optional)               │
│ - Input for tracking notes (optional)                │
└────────────────────┬─────────────────────────────────┘
                     │
                     ▼
┌────────────────────────────────────────────────────────┐
│ USER: Select new status & add optional notes         │
│ - Status dropdown: "in_transit"                      │
│ - Notes: "Left warehouse at 2 PM"                    │
│ - Location: Lat/Lng if available                     │
└────────────────────┬─────────────────────────────────┘
                     │
                     ▼
┌────────────────────────────────────────────────────────┐
│ FRONTEND: PATCH /api/v1/shipments/:id/status         │
│ {                                                    │
│   status: "in_transit",                             │
│   notes: "Left warehouse at 2 PM",                  │
│   location: { lat, lng, address }                   │
│ }                                                    │
└────────────────────┬─────────────────────────────────┘
                     │
                     ▼
┌────────────────────────────────────────────────────────┐
│ BACKEND: shipmentController.updateShipmentStatus()  │
│ - Fetch current shipment                             │
│ - Validate status transition                         │
│   (created→picked_up, picked_up→in_transit, etc)     │
│ - Build tracking note with timestamp                 │
│ - Append to existing tracking_notes                  │
│ - Add location data if provided                      │
│ - Set timestamp fields if status milestone           │
└────────────────────┬─────────────────────────────────┘
                     │
                     ▼
┌────────────────────────────────────────────────────────┐
│ BACKEND: supabase.update() shipments table            │
│ - UPDATE shipments SET:                              │
│   - status = 'in_transit'                            │
│   - current_location = {...}                         │
│   - tracking_notes = old_notes + new_entry           │
│   - updated_at = NOW()                               │
│   WHERE shipment_id = 'AGRI-2025-0001'              │
└────────────────────┬─────────────────────────────────┘
                     │
                     ▼
┌────────────────────────────────────────────────────────┐
│ BACKEND: Prepare response with updated shipment      │
│ - Format response                                    │
│ - Return 200 OK with shipment data                   │
└────────────────────┬─────────────────────────────────┘
                     │
                     ▼
┌────────────────────────────────────────────────────────┐
│ FRONTEND: Receive Updated Shipment                   │
│ - Update local state                                 │
│ - Close modal                                        │
│ - Refresh dashboard                                  │
│ - Show success notification                          │
└────────────────────┬─────────────────────────────────┘
                     │
                     ▼
┌────────────────────────────────────────────────────────┐
│ USER: Sees updated status                            │
│ - Status badge changes to "In Transit" (purple)     │
│ - Timeline now shows new event                       │
│ - Current location updated on map (if integrated)    │
└────────────────────────────────────────────────────────┘
```

### 3. View Timeline Flow

```
┌────────────────────────────────────────────────────────┐
│ USER: Views Shipment Details                         │
└────────────────────┬─────────────────────────────────┘
                     │
                     ▼
┌────────────────────────────────────────────────────────┐
│ FRONTEND: Detect Timeline Column Needs Update        │
│ - Check if shipmentId changed                        │
│ - Trigger timeline fetch                             │
└────────────────────┬─────────────────────────────────┘
                     │
                     ▼
┌────────────────────────────────────────────────────────┐
│ FRONTEND: GET /api/v1/shipments/:id/history          │
│ - Request shipment timeline                          │
└────────────────────┬─────────────────────────────────┘
                     │
                     ▼
┌────────────────────────────────────────────────────────┐
│ BACKEND: shipmentController.getShipmentHistory()     │
│ - Fetch shipment by ID                               │
│ - Build timeline array from data:                     │
│   1. created event + created_at                      │
│   2. picked_up event + picked_up_at (if exists)     │
│   3. in_transit event + picked_up_at (if status=in) │
│   4. delivered event + delivered_at (if exists)     │
│ - Format for display                                 │
│ - Include tracking_notes string                      │
└────────────────────┬─────────────────────────────────┘
                     │
                     ▼
┌────────────────────────────────────────────────────────┐
│ Response Structure:                                  │
│ {                                                    │
│   timeline: [                                        │
│     {                                                │
│       status: "created",                             │
│       timestamp: "2025-02-15T08:00:00Z",            │
│       description: "Shipment created",              │
│       icon: "CheckCircle"                           │
│     },                                              │
│     {                                                │
│       status: "picked_up",                          │
│       timestamp: "2025-02-15T09:30:00Z",            │
│       description: "Picked up by John Doe",         │
│       details: "Vehicle: DL-01-AB-1234"             │
│     },                                              │
│     ...                                             │
│   ],                                                │
│   trackingNotes: "..."                              │
│ }                                                    │
└────────────────────┬─────────────────────────────────┘
                     │
                     ▼
┌────────────────────────────────────────────────────────┐
│ FRONTEND: ShipmentTimeline Component Renders         │
│ - Draw vertical line connecting events               │
│ - For each event:                                    │
│   1. Draw icon circle                                │
│   2. Display description                             │
│   3. Show formatted timestamp                        │
│   4. Display location if available                   │
└────────────────────┬─────────────────────────────────┘
                     │
                     ▼
┌────────────────────────────────────────────────────────┐
│ USER: Views Complete Shipment Journey                │
│                                                      │
│   ● Created - Feb 15 8:00 AM                        │
│   │                                                 │
│   ● Picked Up - Feb 15 9:30 AM                      │
│   │  Vehicle: DL-01-AB-1234                         │
│   │                                                 │
│   ● In Transit - Feb 15 9:30 AM                     │
│   │  Current: Highway NH-1                          │
│   │                                                 │
│   ● Expected Delivery - Feb 16 6:00 PM              │
│                                                      │
└────────────────────────────────────────────────────────┘
```

---

## Component Hierarchy

```
ShipmentDashboard (Main Container)
│
├─ Header
│  └─ "New Shipment" Button
│
├─ Statistics Cards (5 columns)
│  ├─ Total Shipments
│  ├─ Created Count
│  ├─ Picked Up Count
│  ├─ In Transit Count
│  └─ Delivered Count
│
├─ Search & Filter Section
│  ├─ Search Input (Shipment ID / Crop Type)
│  └─ Status Filter Dropdown
│
├─ Main Content (3-column layout)
│
│  ├─ Column 1: Shipment List
│  │  ├─ Search Results
│  │  └─ ShipmentCard (Clickable)
│  │     ├─ Shipment ID
│  │     ├─ Crop Type
│  │     ├─ Status Badge
│  │     ├─ Quantity
│  │     └─ Quick Actions
│  │
│  ├─ Column 2: Shipment Details
│  │  ├─ Basic Info
│  │  │  ├─ Shipment ID
│  │  │  ├─ Crop Type
│  │  │  ├─ Quantity
│  │  │  └─ Status
│  │  │
│  │  ├─ Transport Info
│  │  │  ├─ Driver Name
│  │  │  ├─ Vehicle Number
│  │  │  ├─ Vehicle Type
│  │  │  └─ Route
│  │  │
│  │  ├─ Location Info
│  │  │  ├─ Current Location
│  │  │  ├─ Latitude
│  │  │  └─ Longitude
│  │  │
│  │  └─ "Update Status" Button
│  │
│  └─ Column 3: Timeline
│     ├─ ShipmentTimeline Component
│     │  ├─ Vertical Line
│     │  └─ Timeline Events (repeating)
│     │     ├─ Event Icon
│     │     ├─ Event Description
│     │     ├─ Event Timestamp
│     │     └─ Optional Location
│     │
│     └─ Tracking Notes
│
└─ Modals
   ├─ ShipmentForm Modal
   │  ├─ Basic Info Section
   │  ├─ Transport Section
   │  ├─ Location Section
   │  ├─ Additional Info Section
   │  └─ Submit/Cancel Buttons
   │
   └─ ShipmentStatusUpdate Modal
      ├─ Current Status Display
      ├─ Status Dropdown
      ├─ Location Inputs
      ├─ Notes Textarea
      └─ Submit/Cancel Buttons
```

---

## Request/Response Flow

### POST /api/v1/shipments (Create)

```
REQUEST:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
POST /api/v1/shipments HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json

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
  "notes": "Handle with care"
}

         │
    SERVER PROCESSING
         │
    ┌─────────────────┐
    │ Validate Request │──────→ Check required fields
    ├─────────────────┤
    │ Generate ID     │──────→ Create AGRI-2025-XXXX
    ├─────────────────┤
    │ Insert to DB    │──────→ INSERT INTO shipments
    ├─────────────────┤
    │ Format Response │──────→ camelCase conversion
    └─────────────────┘
         │
         ▼

RESPONSE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
HTTP/1.1 201 Created
Content-Type: application/json

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
    "pickupLocation": {...},
    "deliveryLocation": {...},
    "currentLocation": {...},
    "createdAt": "2025-02-15T08:00:00Z",
    "updatedAt": "2025-02-15T08:00:00Z",
    "trackingNotes": "Shipment created by farmer user-123"
  }
}
```

---

## Database Query Patterns

### 1. Create Shipment
```sql
INSERT INTO shipments (
  id, shipment_id, farmer_id, crop_type, quantity,
  status, driver_name, vehicle_number, vehicle_type,
  pickup_location, delivery_location, current_location,
  route_details, estimated_delivery_date,
  created_at, updated_at, notes, tracking_notes,
  phone_number, email
) VALUES (
  gen_random_uuid(),
  'AGRI-2025-0001',
  'user-123',
  'Wheat',
  500,
  'created',
  'John Doe',
  'DL-01-AB-1234',
  'truck',
  '{"latitude": 28.7041, "longitude": 77.1025, ...}',
  '{"latitude": 28.5244, "longitude": 77.1855, ...}',
  '{"latitude": 28.7041, "longitude": 77.1025, ...}',
  'Farm → Market',
  '2025-02-16T18:00:00Z',
  NOW(),
  NOW(),
  'Handle with care',
  'Shipment created...',
  '+91 9876543210',
  'farmer@example.com'
)
RETURNING *;
```

### 2. Get All Shipments (with filtering)
```sql
SELECT * FROM shipments
WHERE farmer_id = 'user-123'
  AND status = 'in_transit'
ORDER BY created_at DESC
LIMIT 50
OFFSET 0;
```

### 3. Update Status
```sql
UPDATE shipments
SET
  status = 'in_transit',
  current_location = '{"latitude": 28.6328, "longitude": 77.2197, ...}',
  tracking_notes = tracking_notes || '\n2025-02-15T14:30:00Z - Status: in_transit: Left warehouse',
  updated_at = NOW()
WHERE shipment_id = 'AGRI-2025-0001'
RETURNING *;
```

### 4. Get Timeline Events
```sql
SELECT
  created_at as "createdAt",
  picked_up_at as "pickedUpAt",
  delivered_at as "deliveredAt",
  current_location as "currentLocation",
  tracking_notes as "trackingNotes",
  driver_name as "driverName",
  vehicle_number as "vehicleNumber"
FROM shipments
WHERE shipment_id = 'AGRI-2025-0001';
```

---

## Error Handling Flow

```
Request Received
│
└─→ Check Authentication
    │
    ├─ ✗ Invalid/Missing Token ──→ 401 Unauthorized
    │
    └─ ✓ Token Valid
        │
        └─→ Validate Input
            │
            ├─ ✗ Missing Required Fields ──→ 400 Bad Request
            ├─ ✗ Invalid Data Type ──→ 400 Bad Request
            │
            └─ ✓ Input Valid
                │
                └─→ Check Permissions
                    │
                    ├─ ✗ Access Denied ──→ 403 Forbidden
                    │
                    └─ ✓ Permission OK
                        │
                        └─→ Process Request
                            │
                            ├─ ✓ Success ──→ 200/201 OK
                            │
                            └─ ✗ Error
                                │
                                ├─ ✗ Not Found ──→ 404 Not Found
                                ├─ ✗ Invalid Transition ──→ 422 Unprocessable
                                └─ ✗ Server Error ──→ 500 Internal Error
```

---

## Security Layers

```
┌─────────────────────────────────┐
│  HTTPS/TLS Layer                │
│  (Encryption in Transit)        │
└────────────────┬────────────────┘
                 │
┌─────────────────────────────────┐
│  API Authorization              │
│  - JWT Bearer Token Validation  │
│  - User ID Extraction           │
└────────────────┬────────────────┘
                 │
┌─────────────────────────────────┐
│  Permission Checks              │
│  - Farmer can see own shipments │
│  - Admin can see all            │
└────────────────┬────────────────┘
                 │
┌─────────────────────────────────┐
│  Input Validation               │
│  - Required field checks        │
│  - Data type validation         │
│  - Boundary checks              │
└────────────────┬────────────────┘
                 │
┌─────────────────────────────────┐
│  Business Logic Validation      │
│  - Status transition validation │
│  - Coordinate range checks      │
└────────────────┬────────────────┘
                 │
┌─────────────────────────────────┐
│  Database Constraints           │
│  - Unique constraints           │
│  - Foreign key checks           │
│  - NOT NULL constraints         │
└─────────────────────────────────┘
```

---

## Performance Optimization Points

### Database Level
```
Index Strategy:
├─ PRIMARY KEY: id (UUID)
├─ UNIQUE: shipment_id (for lookups)
├─ INDEXED: farmer_id (join with users)
├─ INDEXED: status (filtering)
└─ INDEXED: created_at (sorting)

Statistics:
├─ Avg Query Time: < 50ms (with indexes)
├─ Max Records: 100,000+ per table
└─ Pagination: 50 items default
```

### API Level
```
Response Optimization:
├─ Pagination: Limit 50, Max 100
├─ Field Selection: Only needed columns
├─ Caching: Frontend caches results
└─ Compression: Gzip enabled

Request Optimization:
├─ Batch Operations: Queue multiple updates
├─ Debouncing: Search debounced
└─ Lazy Loading: Load details on demand
```

### Frontend Level
```
Component Optimization:
├─ Memoization: Prevents re-renders
├─ Virtual Scrolling: For large lists
├─ Code Splitting: Lazy load components
└─ Minification: Production bundle

Caching:
├─ localStorage: Session data
├─ sessionStorage: Temp data
└─ Memory Cache: Component state
```

---

## Scalability Strategy

### Vertical Scaling
- Increase database connections
- Add more worker threads
- Increase cache size
- Upgrade server RAM

### Horizontal Scaling
- Multiple backend instances
- Load balancing
- Database replication
- CDN for static assets
- Message queues for async tasks

### Database Scaling
- Partitioning by farmer_id
- Archiving old shipments
- Read-only replica for reporting
- Connection pooling

---

## Monitoring & Observability

```
Metrics to Track:
├─ API Response Times
├─ Error Rates by Endpoint
├─ Database Query Performance
├─ Active Concurrent Users
├─ Failed Authentication Attempts
├─ Storage Growth Rate
└─ Cache Hit Ratio

Logging:
├─ INFO: User actions (create, update)
├─ WARN: Unusual patterns
├─ ERROR: Failed operations
└─ DEBUG: Detailed execution flow

Alerts:
├─ High Error Rate (> 5%)
├─ Slow Responses (> 500ms)
├─ Database Connection Issues
├─ Authentication Failures
└─ Storage Nearly Full
```

---

This architecture provides a solid foundation for the shipment tracking module with clear separation of concerns, scalability, security, and performance optimization.
