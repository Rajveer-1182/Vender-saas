# 🧪 VENDOR SAAS - TESTING GUIDE

Complete testing guide for all features and endpoints.

---

## 📋 Prerequisites for Testing

1. **Backend running**: `node server.js` (PORT 5000)
2. **Frontend running**: `npm run dev` (PORT 3000)
3. **MongoDB connected**: Check MongoDB connection in console
4. **Postman/Insomnia installed**: For API testing
5. **Test account created**: Via registration endpoint

---

## 🔑 Test Credentials

Use these for manual testing (after registration):

```
Email: vendor@example.com
Password: password123
Phone: +919876543210
Business Name: Test Vendor
```

---

## 🧬 Unit Testing: Authentication

### Test 1.1: Register New Vendor
**Endpoint:** `POST http://localhost:5000/api/auth/register`

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

**Expected Response:**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "65abc123...",
    "businessName": "Sharma Tent House",
    "email": "vendor@example.com"
  }
}
```

**Status Code:** 201

**✅ Pass Criteria:**
- [ ] Response code is 201
- [ ] Token is returned
- [ ] User object contains businessName
- [ ] Can decode JWT token at jwt.io

---

### Test 1.2: Duplicate Registration (Should Fail)
**Endpoint:** `POST http://localhost:5000/api/auth/register`

**Request Body:**
```json
{
  "businessName": "Another Vendor",
  "phone": "+919876543210",  // Same phone
  "email": "another@example.com",
  "password": "password456",
  "plan": "Monthly"
}
```

**Expected Response:**
```json
{
  "message": "Email or Phone already registered"
}
```

**Status Code:** 400

**✅ Pass Criteria:**
- [ ] Response code is 400
- [ ] Error message mentions duplicate

---

### Test 1.3: Login
**Endpoint:** `POST http://localhost:5000/api/auth/login`

**Request Body:**
```json
{
  "email": "vendor@example.com",
  "password": "password123"
}
```

**Expected Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "65abc123...",
    "businessName": "Sharma Tent House",
    "plan": "Monthly"
  }
}
```

**Status Code:** 200

**✅ Pass Criteria:**
- [ ] Response code is 200
- [ ] Different token than registration
- [ ] Plan is returned

---

### Test 1.4: Wrong Password (Should Fail)
**Endpoint:** `POST http://localhost:5000/api/auth/login`

**Request Body:**
```json
{
  "email": "vendor@example.com",
  "password": "wrongpassword"
}
```

**Expected Response:**
```json
{
  "message": "Invalid credentials"
}
```

**Status Code:** 401

**✅ Pass Criteria:**
- [ ] Response code is 401
- [ ] No token returned

---

### Test 1.5: Get Profile (Protected)
**Endpoint:** `GET http://localhost:5000/api/auth/profile`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Expected Response:**
```json
{
  "_id": "65abc123...",
  "businessName": "Sharma Tent House",
  "phone": "+919876543210",
  "email": "vendor@example.com",
  "plan": "Monthly",
  "subscriptionStatus": "active",
  "createdAt": "2026-04-05T10:30:00Z"
}
```

**Status Code:** 200

**✅ Pass Criteria:**
- [ ] Response code is 200
- [ ] Full profile returned
- [ ] Password NOT included
- [ ] No token? Returns 401

---

### Test 1.6: Update Profile (Protected)
**Endpoint:** `PUT http://localhost:5000/api/auth/update-profile`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Request Body:**
```json
{
  "businessName": "Updated Sharma Tent House",
  "city": "Delhi",
  "state": "Delhi",
  "gstNumber": "07AABCT1234H1Z0"
}
```

**Expected Response:**
```json
{
  "message": "Profile updated",
  "user": {
    "businessName": "Updated Sharma Tent House",
    "city": "Delhi",
    "state": "Delhi"
  }
}
```

**Status Code:** 200

**✅ Pass Criteria:**
- [ ] Response code is 200
- [ ] Updates reflected in response
- [ ] businessName changed
- [ ] Password still hashed

---

## 📦 Unit Testing: Inventory

### Test 2.1: Add Inventory Item
**Endpoint:** `POST http://localhost:5000/api/inventory/add`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Request Body:**
```json
{
  "name": "Luxury Sofa",
  "category": "Furniture",
  "totalStock": 50,
  "rentPrice": 500,
  "purchasePrice": 5000,
  "description": "Premium sofa set",
  "location": "Main Warehouse"
}
```

**Expected Response:**
```json
{
  "message": "Inventory item added",
  "inventory": {
    "_id": "65def789...",
    "vendorId": "65abc123...",
    "name": "Luxury Sofa",
    "category": "Furniture",
    "totalStock": 50,
    "availableStock": 50,
    "rentPrice": 500,
    "itemCondition": "Good"
  }
}
```

**Status Code:** 201

**✅ Pass Criteria:**
- [ ] Item created with unique ID
- [ ] Available stock = total stock
- [ ] Defaults to "Good" condition
- [ ] Save ITEM_ID for next tests

---

### Test 2.2: Get All Inventory
**Endpoint:** `GET http://localhost:5000/api/inventory/all`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Expected Response:**
```json
[
  {
    "_id": "65def789...",
    "name": "Luxury Sofa",
    "category": "Furniture",
    "totalStock": 50,
    "availableStock": 50,
    "rentPrice": 500
  }
]
```

**Status Code:** 200

**✅ Pass Criteria:**
- [ ] Returns array of items
- [ ] Previously added item appears
- [ ] Only your items shown (not others')

---

### Test 2.3: Get by Category
**Endpoint:** `GET http://localhost:5000/api/inventory/category/Furniture`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Expected Response:**
```json
[
  {
    "_id": "65def789...",
    "name": "Luxury Sofa",
    "category": "Furniture",
    "totalStock": 50,
    "availableStock": 50
  }
]
```

**Status Code:** 200

**✅ Pass Criteria:**
- [ ] Only Furniture items shown
- [ ] Empty array if no items

---

### Test 2.4: Get Single Item
**Endpoint:** `GET http://localhost:5000/api/inventory/ITEM_ID_HERE`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Expected Response:**
```json
{
  "_id": "65def789...",
  "name": "Luxury Sofa",
  "category": "Furniture",
  "totalStock": 50,
  "availableStock": 50,
  "rentPrice": 500,
  "purchasePrice": 5000,
  "description": "Premium sofa set",
  "location": "Main Warehouse"
}
```

**Status Code:** 200

**✅ Pass Criteria:**
- [ ] Full item details returned
- [ ] Access denied if not owner (should fail)

---

### Test 2.5: Update Inventory Item
**Endpoint:** `PUT http://localhost:5000/api/inventory/ITEM_ID_HERE`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Request Body:**
```json
{
  "name": "Premium Sofa Set",
  "rentPrice": 600,
  "itemCondition": "Fair",
  "availableStock": 40
}
```

**Expected Response:**
```json
{
  "message": "Inventory updated",
  "inventory": {
    "name": "Premium Sofa Set",
    "rentPrice": 600,
    "itemCondition": "Fair",
    "availableStock": 40
  }
}
```

**Status Code:** 200

**✅ Pass Criteria:**
- [ ] Updated values returned
- [ ] Name changed to "Premium Sofa Set"
- [ ] Rent price changed to 600

---

### Test 2.6: Delete Inventory Item
**Endpoint:** `DELETE http://localhost:5000/api/inventory/ITEM_ID_HERE`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Expected Response:**
```json
{
  "message": "Inventory deleted"
}
```

**Status Code:** 200

**✅ Pass Criteria:**
- [ ] Item deleted successfully
- [ ] No longer appears in list

---

## 📅 Unit Testing: Bookings

### Test 3.1: Create Booking (First add 2 items)
**First, add two more inventory items:**

Item 1: Gold Chairs (Furniture)
- totalStock: 200
- rentPrice: 50

Item 2: Light Sets (Lights)
- totalStock: 100
- rentPrice: 1000

---

**Endpoint:** `POST http://localhost:5000/api/bookings/create`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Request Body:**
```json
{
  "clientName": "Rajesh Kumar",
  "clientPhone": "+919999999999",
  "clientEmail": "rajesh@gmail.com",
  "eventType": "Wedding",
  "eventDate": "2026-12-25T10:00:00Z",
  "venue": "Taj Garden, Delhi",
  "guestCount": 500,
  "itemsBooked": [
    { "itemId": "CHAIRS_ITEM_ID", "quantity": 100 },
    { "itemId": "LIGHTS_ITEM_ID", "quantity": 5 }
  ]
}
```

**Expected Response:**
```json
{
  "message": "Booking created successfully",
  "booking": {
    "_id": "65ghi901...",
    "clientName": "Rajesh Kumar",
    "eventDate": "2026-12-25T10:00:00Z",
    "totalAmount": 10000,  // 100*50 + 5*1000
    "paymentStatus": "Pending",
    "deliveryStatus": "Pending",
    "itemsBooked": [
      {
        "itemName": "Gold Chairs",
        "quantity": 100,
        "rentPrice": 50,
        "subtotal": 5000
      }
    ]
  }
}
```

**Status Code:** 201

**✅ Pass Criteria:**
- [ ] Booking created
- [ ] Total calculated correctly
- [ ] Save BOOKING_ID
- [ ] Check inventory: Chairs should now show 100 available (200-100)

---

### Test 3.2: Check Availability (Before Overbooking)
**Endpoint:** `POST http://localhost:5000/api/inventory/check-availability`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Request Body:**
```json
{
  "itemsNeeded": [
    { "itemId": "CHAIRS_ITEM_ID", "quantity": 150 }
  ],
  "eventDate": "2026-12-26T10:00:00Z"
}
```

**Expected Response:**
```json
{
  "availableItems": [
    {
      "itemId": "CHAIRS_ITEM_ID",
      "itemName": "Gold Chairs",
      "availableQuantity": 100,
      "requestedQuantity": 150,
      "rentPrice": 50
    }
  ],
  "unavailableItems": [],
  "isFullyAvailable": false
}
```

**✅ Pass Criteria:**
- [ ] Shows available = 100 (not 200, because we already booked 100)
- [ ] isFullyAvailable = false
- [ ] Warning shown for insufficient stock

---

### Test 3.3: Get All Bookings
**Endpoint:** `GET http://localhost:5000/api/bookings/all`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Expected Response:**
```json
[
  {
    "_id": "65ghi901...",
    "clientName": "Rajesh Kumar",
    "eventDate": "2026-12-25...",
    "totalAmount": 10000,
    "paymentStatus": "Pending",
    "deliveryStatus": "Pending"
  }
]
```

**Status Code:** 200

**✅ Pass Criteria:**
- [ ] Returns array
- [ ] Previously created booking appears

---

### Test 3.4: Get Single Booking
**Endpoint:** `GET http://localhost:5000/api/bookings/BOOKING_ID_HERE`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Expected Response:**
```json
{
  "_id": "65ghi901...",
  "clientName": "Rajesh Kumar",
  "clientPhone": "+919999999999",
  "eventDate": "2026-12-25...",
  "totalAmount": 10000,
  "advancePaid": 0,
  "paymentStatus": "Pending",
  "deliveryStatus": "Pending",
  "itemsBooked": [ /* ... */ ]
}
```

**Status Code:** 200

---

### Test 3.5: Update Payment
**Endpoint:** `PUT http://localhost:5000/api/bookings/BOOKING_ID_HERE/update-payment`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Request Body:**
```json
{
  "advancePaid": 5000
}
```

**Expected Response:**
```json
{
  "message": "Payment updated",
  "booking": {
    "totalAmount": 10000,
    "advancePaid": 5000,
    "paymentStatus": "Partial"
  }
}
```

**Status Code:** 200

**✅ Pass Criteria:**
- [ ] advancePaid updated to 5000
- [ ] paymentStatus changed to "Partial"

---

### Test 3.6: Update Status
**Endpoint:** `PUT http://localhost:5000/api/bookings/BOOKING_ID_HERE/update-status`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Request Body:**
```json
{
  "deliveryStatus": "Delivered"
}
```

**Expected Response:**
```json
{
  "message": "Booking updated",
  "booking": {
    "deliveryStatus": "Delivered"
  }
}
```

**Status Code:** 200

---

### Test 3.7: Send Invoice
**Endpoint:** `POST http://localhost:5000/api/bookings/BOOKING_ID_HERE/send-invoice`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Expected Response:**
```json
{
  "message": "Invoice sent successfully",
  "invoiceUrl": "https://wa.me/919999999999?text=Invoice..."
}
```

**Status Code:** 200

**✅ Pass Criteria:**
- [ ] WhatsApp URL generated
- [ ] URL includes phone number

---

### Test 3.8: Mark Damage
**Endpoint:** `POST http://localhost:5000/api/bookings/BOOKING_ID_HERE/mark-damage`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Request Body:**
```json
{
  "totalDamage": 500,
  "itemsDamaged": [
    {
      "itemId": "CHAIRS_ITEM_ID",
      "itemName": "Gold Chairs",
      "damageCost": 500,
      "notes": "2 chairs broken"
    }
  ]
}
```

**Expected Response:**
```json
{
  "message": "Damage recorded",
  "booking": {
    "damageReport": {
      "totalDamage": 500,
      "itemsDamaged": [ /* ... */ ]
    }
  }
}
```

**Status Code:** 200

---

### Test 3.9: Complete Booking
**Endpoint:** `POST http://localhost:5000/api/bookings/BOOKING_ID_HERE/complete`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Expected Response:**
```json
{
  "message": "Booking completed",
  "booking": {
    "deliveryStatus": "Returned"
  }
}
```

**Status Code:** 200

**✅ Pass Criteria:**
- [ ] Delivery status = "Returned"
- [ ] Inventory stock restored (Chairs back to 100)

---

### Test 3.10: Get Calendar View
**Endpoint:** `GET http://localhost:5000/api/bookings/calendar/12/2026`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Expected Response:**
```json
[
  {
    "_id": "65ghi901...",
    "clientName": "Rajesh Kumar",
    "eventDate": "2026-12-25T10:00:00Z",
    "eventType": "Wedding",
    "totalAmount": 10000
  }
]
```

**Status Code:** 200

---

### Test 3.11: Dashboard Analytics
**Endpoint:** `GET http://localhost:5000/api/bookings/analytics/dashboard`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Expected Response:**
```json
{
  "totalBookings": 1,
  "totalRevenue": 10000,
  "completedBookings": 1,
  "pendingPayments": 0
}
```

**Status Code:** 200

---

## 🚨 Error Testing

### Test 4.1: Missing Authorization Header
**Endpoint:** `GET http://localhost:5000/api/inventory/all`
(Without Authorization header)

**Expected Response:**
```json
{
  "message": "No token provided"
}
```

**Status Code:** 401

---

### Test 4.2: Invalid Token
**Endpoint:** `GET http://localhost:5000/api/inventory/all`

**Headers:**
```
Authorization: Bearer INVALID_TOKEN_HERE
```

**Expected Response:**
```json
{
  "message": "Invalid or expired token"
}
```

**Status Code:** 401

---

### Test 4.3: Missing Required Fields
**Endpoint:** `POST http://localhost:5000/api/auth/register`

**Request Body:**
```json
{
  "businessName": "Test"
  // Missing: phone, email, password
}
```

**Expected Response:**
```json
{
  "message": "All fields are required"
}
```

**Status Code:** 400

---

### Test 4.4: Insufficient Stock
**Endpoint:** `POST http://localhost:5000/api/bookings/create`

**Request Body:**
```json
{
  "clientName": "Test",
  "clientPhone": "+919999999998",
  "eventDate": "2026-12-27T10:00:00Z",
  "itemsBooked": [
    { "itemId": "CHAIRS_ID", "quantity": 999 }  // More than available
  ]
}
```

**Expected Response:**
```json
{
  "message": "Insufficient stock for Gold Chairs. Available: 100, Requested: 999"
}
```

**Status Code:** 400

---

## 📊 Frontend Testing Checklist

### Navigation
- [ ] Navbar displays with logo
- [ ] Sidebar shows menu items
- [ ] Menu items have correct icons
- [ ] Hover effects work

### Authentication Pages
- [ ] Register page loads
- [ ] Can fill registration form
- [ ] Login page loads
- [ ] Can fill login form
- [ ] Error messages display

### Inventory Page
- [ ] Displays all inventory items
- [ ] Items show in card format
- [ ] Stock progress bars display
- [ ] Edit/Delete buttons work
- [ ] Add new item form works
- [ ] Category filter works (if implemented)

### Booking Page
- [ ] Displays all bookings
- [ ] Shows payment status
- [ ] Shows delivery status
- [ ] Shows item list
- [ ] Can create new booking
- [ ] Can update booking status

### Dashboard
- [ ] Displays analytics cards
- [ ] Shows total bookings
- [ ] Shows total revenue
- [ ] Shows pending payments
- [ ] Charts render (if implemented)

---

## ✅ Final Success Criteria

All tests should pass in the following order:

1. ✅ Auth Tests (1.1 - 1.6)
2. ✅ Inventory Tests (2.1 - 2.6)
3. ✅ Booking Tests (3.1 - 3.11)
4. ✅ Error Tests (4.1 - 4.4)
5. ✅ Frontend Visual Tests

**If all above pass → System is Ready for MVP Testing! 🎉**

---

## 📝 Test Report Template

```
Test Suite: Vendor SaaS v1.0
Date: ___________
Tester: ___________

RESULTS:
--------
Auth Tests:      ✅ / ❌  (Reason: _______)
Inventory Tests: ✅ / ❌  (Reason: _______)
Booking Tests:   ✅ / ❌  (Reason: _______)
Error Tests:     ✅ / ❌  (Reason: _______)
Frontend Tests:  ✅ / ❌  (Reason: _______)

ISSUES FOUND:
1. ____________
2. ____________
3. ____________

NOTES:
_________________

Approved For MVP: ✅ / ❌
```

---

**Test Suite Status: READY FOR EXECUTION**
