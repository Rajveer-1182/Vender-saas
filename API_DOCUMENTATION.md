# 📚 Vendor SaaS - API DOCUMENTATION

Complete API reference for the Vendor SaaS Backend.

## 🔐 Authentication

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

---

## 👤 AUTHENTICATION ENDPOINTS (`/api/auth`)

### 1. Register Vendor
**Endpoint:** `POST /auth/register`  
**Auth Required:** ❌ No  
**Description:** Register a new vendor account

**Request Body:**
```json
{
  "businessName": "Sharma Tent House",
  "phone": "+919876543210",
  "email": "vendor@example.com",
  "password": "password123",
  "plan": "Monthly"
}
```

**Response (Success - 201):**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "65abc123def456...",
    "businessName": "Sharma Tent House",
    "email": "vendor@example.com",
    "phone": "+919876543210"
  }
}
```

**Error Cases:**
- 400: All fields required
- 400: Email or Phone already registered

---

### 2. Login Vendor
**Endpoint:** `POST /auth/login`  
**Auth Required:** ❌ No  
**Description:** Login to existing vendor account

**Request Body:**
```json
{
  "email": "vendor@example.com",
  "password": "password123"
}
```

**Response (Success - 200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "65abc123def456...",
    "businessName": "Sharma Tent House",
    "email": "vendor@example.com",
    "phone": "+919876543210",
    "plan": "Monthly"
  }
}
```

**Error Cases:**
- 400: Email and password required
- 401: Invalid credentials

---

### 3. Get Vendor Profile
**Endpoint:** `GET /auth/profile`  
**Auth Required:** ✅ Yes  
**Description:** Get current vendor's profile

**Request Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Response (Success - 200):**
```json
{
  "_id": "65abc123def456...",
  "businessName": "Sharma Tent House",
  "phone": "+919876543210",
  "email": "vendor@example.com",
  "subscriptionStatus": "active",
  "plan": "Monthly",
  "address": "Shop No. 5, Wedding Lane",
  "city": "Delhi",
  "state": "Delhi",
  "gstNumber": "07AABCT1234H1Z0",
  "profilePhoto": "https://...",
  "createdAt": "2026-04-05T10:30:00Z",
  "updatedAt": "2026-04-05T10:30:00Z"
}
```

---

### 4. Update Profile
**Endpoint:** `PUT /auth/update-profile`  
**Auth Required:** ✅ Yes  
**Description:** Update vendor profile information

**Request Body:**
```json
{
  "businessName": "New Business Name",
  "address": "New Address",
  "city": "Mumbai",
  "state": "Maharashtra",
  "gstNumber": "27AABCU1234H1Z0",
  "profilePhoto": "https://cloudinary.com/..."
}
```

**Response (Success - 200):**
```json
{
  "message": "Profile updated",
  "user": { /* updated user object */ }
}
```

---

## 📦 INVENTORY ENDPOINTS (`/api/inventory`)

### 1. Add Inventory Item
**Endpoint:** `POST /inventory/add`  
**Auth Required:** ✅ Yes  
**Description:** Add a new item to inventory

**Request Body:**
```json
{
  "name": "Luxury Sofa",
  "category": "Furniture",
  "totalStock": 50,
  "rentPrice": 500,
  "purchasePrice": 5000,
  "description": "Premium sofa for weddings",
  "location": "Main Warehouse",
  "photoUrl": "https://..."
}
```

**Response (Success - 201):**
```json
{
  "message": "Inventory item added",
  "inventory": {
    "_id": "65def789ghi012...",
    "vendorId": "65abc123def456...",
    "name": "Luxury Sofa",
    "category": "Furniture",
    "totalStock": 50,
    "availableStock": 50,
    "rentPrice": 500,
    "itemCondition": "Good",
    "createdAt": "2026-04-05T10:30:00Z"
  }
}
```

---

### 2. Get All Inventory Items
**Endpoint:** `GET /inventory/all`  
**Auth Required:** ✅ Yes  
**Description:** Get all inventory items for the vendor

**Response (Success - 200):**
```json
[
  {
    "_id": "65def789ghi012...",
    "name": "Luxury Sofa",
    "category": "Furniture",
    "totalStock": 50,
    "availableStock": 45,
    "rentPrice": 500,
    "itemCondition": "Good"
  },
  // ... more items
]
```

---

### 3. Get Items by Category
**Endpoint:** `GET /inventory/category/:category`  
**Auth Required:** ✅ Yes  
**Parameters:**
- `category`: Furniture | Decoration | Utensils | Lights | Catering | Other

**Response (Success - 200):**
```json
[
  {
    "_id": "65def789ghi012...",
    "name": "Luxury Sofa",
    "category": "Furniture",
    "totalStock": 50,
    "availableStock": 45,
    "rentPrice": 500
  }
]
```

---

### 4. Get Single Item
**Endpoint:** `GET /inventory/:id`  
**Auth Required:** ✅ Yes  
**Parameters:**
- `id`: Inventory item ID

**Response (Success - 200):**
```json
{
  "_id": "65def789ghi012...",
  "name": "Luxury Sofa",
  "category": "Furniture",
  "totalStock": 50,
  "availableStock": 45,
  "rentPrice": 500,
  "purchasePrice": 5000,
  "description": "..."
  // ... full item object
}
```

---

### 5. Update Inventory Item
**Endpoint:** `PUT /inventory/:id`  
**Auth Required:** ✅ Yes  
**Parameters:**
- `id`: Inventory item ID

**Request Body:**
```json
{
  "name": "Updated Name",
  "totalStock": 60,
  "availableStock": 55,
  "rentPrice": 600,
  "itemCondition": "Fair",
  "location": "Secondary Warehouse"
}
```

**Response (Success - 200):**
```json
{
  "message": "Inventory updated",
  "inventory": { /* updated item */ }
}
```

---

### 6. Delete Inventory Item
**Endpoint:** `DELETE /inventory/:id`  
**Auth Required:** ✅ Yes  
**Parameters:**
- `id`: Inventory item ID

**Response (Success - 200):**
```json
{
  "message": "Inventory deleted"
}
```

---

### 7. Check Availability
**Endpoint:** `POST /inventory/check-availability`  
**Auth Required:** ✅ Yes  
**Description:** Check if items are available for a booking

**Request Body:**
```json
{
  "itemsNeeded": [
    { "itemId": "65def789ghi012...", "quantity": 100 },
    { "itemId": "65def789ghi013...", "quantity": 20 }
  ],
  "eventDate": "2026-12-25T10:00:00Z"
}
```

**Response (Success - 200):**
```json
{
  "availableItems": [
    {
      "itemId": "65def789ghi012...",
      "itemName": "Chair",
      "availableQuantity": 150,
      "requestedQuantity": 100,
      "rentPrice": 50
    }
  ],
  "unavailableItems": [
    {
      "itemId": "65def789ghi013...",
      "itemName": "Sofa",
      "available": 5,
      "requested": 20
    }
  ],
  "isFullyAvailable": false
}
```

---

## 📅 BOOKING ENDPOINTS (`/api/bookings`)

### 1. Create Booking
**Endpoint:** `POST /bookings/create`  
**Auth Required:** ✅ Yes  
**Description:** Create a new booking

**Request Body:**
```json
{
  "clientName": "Rajesh Kumar",
  "clientPhone": "+919999999999",
  "clientEmail": "client@example.com",
  "eventType": "Wedding",
  "eventDate": "2026-12-25T10:00:00Z",
  "venue": "Taj Garden, Delhi",
  "guestCount": 500,
  "itemsBooked": [
    { "itemId": "65def789ghi012...", "quantity": 100 },
    { "itemId": "65def789ghi013...", "quantity": 20 }
  ]
}
```

**Response (Success - 201):**
```json
{
  "message": "Booking created successfully",
  "booking": {
    "_id": "65ghi901jkl234...",
    "vendorId": "65abc123def456...",
    "clientName": "Rajesh Kumar",
    "clientPhone": "+919999999999",
    "eventDate": "2026-12-25T10:00:00Z",
    "totalAmount": 15000,
    "advancePaid": 0,
    "paymentStatus": "Pending",
    "deliveryStatus": "Pending",
    "itemsBooked": [
      {
        "itemId": "65def789ghi012...",
        "itemName": "Chair",
        "quantity": 100,
        "rentPrice": 50,
        "subtotal": 5000
      }
    ]
  }
}
```

**Error Cases:**
- 400: Required fields missing
- 400: Insufficient stock for item
- 404: Item not found

---

### 2. Get All Bookings
**Endpoint:** `GET /bookings/all`  
**Auth Required:** ✅ Yes  
**Description:** Get all bookings for the vendor

**Response (Success - 200):**
```json
[
  {
    "_id": "65ghi901jkl234...",
    "clientName": "Rajesh Kumar",
    "eventDate": "2026-12-25T10:00:00Z",
    "totalAmount": 15000,
    "paymentStatus": "Pending",
    "deliveryStatus": "Pending",
    "itemsBooked": [ /* ... */ ]
  }
]
```

---

### 3. Get Single Booking
**Endpoint:** `GET /bookings/:id`  
**Auth Required:** ✅ Yes  
**Parameters:**
- `id`: Booking ID

**Response (Success - 200):**
```json
{
  "_id": "65ghi901jkl234...",
  "vendorId": "65abc123def456...",
  "clientName": "Rajesh Kumar",
  "clientPhone": "+919999999999",
  "clientEmail": "client@example.com",
  "eventType": "Wedding",
  "eventDate": "2026-12-25T10:00:00Z",
  "venue": "Taj Garden, Delhi",
  "guestCount": 500,
  "totalAmount": 15000,
  "advancePaid": 5000,
  "paymentStatus": "Partial",
  "deliveryStatus": "Pending",
  "itemsBooked": [ /* ... */ ],
  "damageReport": {
    "totalDamage": 0,
    "itemsDamaged": []
  },
  "invoiceSent": false,
  "notes": "..."
}
```

---

### 4. Get Calendar View
**Endpoint:** `GET /bookings/calendar/:month/:year`  
**Auth Required:** ✅ Yes  
**Parameters:**
- `month`: 1-12
- `year`: YYYY

**Response (Success - 200):**
```json
[
  {
    "_id": "65ghi901jkl234...",
    "clientName": "Rajesh Kumar",
    "eventDate": "2026-12-25T10:00:00Z",
    "eventType": "Wedding",
    "totalAmount": 15000
  }
]
```

---

### 5. Update Booking Status
**Endpoint:** `PUT /bookings/:id/update-status`  
**Auth Required:** ✅ Yes  
**Parameters:**
- `id`: Booking ID

**Request Body:**
```json
{
  "paymentStatus": "Partial",
  "deliveryStatus": "Delivered"
}
```

**Response (Success - 200):**
```json
{
  "message": "Booking updated",
  "booking": { /* updated booking */ }
}
```

---

### 6. Update Payment
**Endpoint:** `PUT /bookings/:id/update-payment`  
**Auth Required:** ✅ Yes  
**Parameters:**
- `id`: Booking ID

**Request Body:**
```json
{
  "advancePaid": 5000
}
```

**Response (Success - 200):**
```json
{
  "message": "Payment updated",
  "booking": {
    "totalAmount": 15000,
    "advancePaid": 5000,
    "paymentStatus": "Partial"
  }
}
```

---

### 7. Send Invoice via WhatsApp
**Endpoint:** `POST /bookings/:id/send-invoice`  
**Auth Required:** ✅ Yes  
**Parameters:**
- `id`: Booking ID

**Response (Success - 200):**
```json
{
  "message": "Invoice sent successfully",
  "invoiceUrl": "https://wa.me/919999999999?text=Invoice..."
}
```

---

### 8. Mark Damage/Loss
**Endpoint:** `POST /bookings/:id/mark-damage`  
**Auth Required:** ✅ Yes  
**Parameters:**
- `id`: Booking ID

**Request Body:**
```json
{
  "totalDamage": 2500,
  "itemsDamaged": [
    {
      "itemId": "65def789ghi012...",
      "itemName": "Chair",
      "damageCost": 500,
      "notes": "Leg broken"
    },
    {
      "itemId": "65def789ghi013...",
      "itemName": "Sofa",
      "damageCost": 2000,
      "notes": "Torn fabric"
    }
  ]
}
```

**Response (Success - 200):**
```json
{
  "message": "Damage recorded",
  "booking": {
    "damageReport": {
      "totalDamage": 2500,
      "itemsDamaged": [ /* ... */ ]
    }
  }
}
```

---

### 9. Complete Booking
**Endpoint:** `POST /bookings/:id/complete`  
**Auth Required:** ✅ Yes  
**Parameters:**
- `id`: Booking ID

**Response (Success - 200):**
```json
{
  "message": "Booking completed",
  "booking": {
    "deliveryStatus": "Returned",
    "paymentStatus": "Complete"
  }
}
```

---

### 10. Cancel Booking
**Endpoint:** `DELETE /bookings/:id/cancel`  
**Auth Required:** ✅ Yes  
**Parameters:**
- `id`: Booking ID

**Response (Success - 200):**
```json
{
  "message": "Booking cancelled",
  "booking": {
    "paymentStatus": "Cancelled",
    "deliveryStatus": "Cancelled"
  }
}
```

---

### 11. Get Dashboard Analytics
**Endpoint:** `GET /bookings/analytics/dashboard`  
**Auth Required:** ✅ Yes  
**Description:** Get dashboard metrics

**Response (Success - 200):**
```json
{
  "totalBookings": 25,
  "totalRevenue": 375000,
  "completedBookings": 18,
  "pendingPayments": 5
}
```

---

## 🔄 Response Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success - GET request |
| 201 | Success - Resource created |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - No/Invalid token |
| 404 | Not Found - Resource doesn't exist |
| 500 | Server Error |

---

## 📊 Data Models

### Inventory Model
```javascript
{
  _id: ObjectId,
  vendorId: ObjectId,
  name: String,
  category: String,          // "Furniture" | "Decoration" | "Utensils" | "Lights" | "Catering" | "Other"
  totalStock: Number,
  availableStock: Number,
  rentPrice: Number,
  purchasePrice: Number,
  description: String,
  itemCondition: String,     // "Good" | "Fair" | "Needs Repair"
  location: String,
  photoUrl: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Booking Model
```javascript
{
  _id: ObjectId,
  vendorId: ObjectId,
  clientName: String,
  clientPhone: String,       // "+919876543210"
  clientEmail: String,
  eventType: String,         // "Wedding" | "Anniversary" | "Birthday" | "Corporate"
  eventDate: Date,
  venue: String,
  guestCount: Number,
  itemsBooked: Array,        // [{itemId, itemName, quantity, rentPrice, subtotal}]
  totalAmount: Number,
  advancePaid: Number,
  paymentStatus: String,     // "Pending" | "Partial" | "Complete" | "Cancelled"
  deliveryStatus: String,    // "Pending" | "Delivered" | "Returned" | "Partial Return"
  damageReport: {
    totalDamage: Number,
    itemsDamaged: Array
  },
  invoiceSent: Boolean,
  invoiceUrl: String,
  staffAssigned: Array,      // [{staffName, role}]
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔗 Example Workflows

### Workflow 1: Create Booking Step-by-Step
```bash
# 1. Check Availability
curl -X POST http://localhost:5000/api/inventory/check-availability \
  -H "Authorization: Bearer TOKEN" \
  -d '{...}'

# 2. If available, Create Booking
curl -X POST http://localhost:5000/api/bookings/create \
  -H "Authorization: Bearer TOKEN" \
  -d '{...}'

# 3. Send Invoice
curl -X POST http://localhost:5000/api/bookings/ID/send-invoice \
  -H "Authorization: Bearer TOKEN"

# 4. Update Payment
curl -X PUT http://localhost:5000/api/bookings/ID/update-payment \
  -H "Authorization: Bearer TOKEN" \
  -d '{"advancePaid": 5000}'

# 5. Mark as Delivered
curl -X PUT http://localhost:5000/api/bookings/ID/update-status \
  -H "Authorization: Bearer TOKEN" \
  -d '{"deliveryStatus": "Delivered"}'

# 6. Record Damage (if any)
curl -X POST http://localhost:5000/api/bookings/ID/mark-damage \
  -H "Authorization: Bearer TOKEN" \
  -d '{...}'

# 7. Complete Booking
curl -X POST http://localhost:5000/api/bookings/ID/complete \
  -H "Authorization: Bearer TOKEN"
```

---

**Last Updated:** April 5, 2026
