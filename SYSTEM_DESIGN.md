# Vendor SaaS System - Complete Implementation

This document outlines the complete system architecture and code structure for the Indian Vendor SaaS (Tent Houses, Decorators, Caterers).

## 📋 TABLE OF CONTENTS

1. [Project Structure](#project-structure)
2. [Database Schema](#database-schema)
3. [Backend API Endpoints](#backend-api-endpoints)
4. [Frontend Components](#frontend-components)
5. [Key Features Implementation](#key-features-implementation)
6. [Setup Instructions](#setup-instructions)

---

## 🏗️ PROJECT STRUCTURE

```
vendor-saas/
├── client/                          # React Frontend (Next.js)
│   ├── app/
│   │   ├── layout.js               # Root layout
│   │   ├── page.js                 # Home page
│   │   ├── dashboard/              # Dashboard pages
│   │   ├── booking/                # Booking pages
│   │   └── inventory/              # Inventory pages
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Navbar.jsx          # Top navigation
│   │   │   └── Sidebar.jsx         # Side navigation
│   │   ├── booking/
│   │   │   └── BookingCard.jsx    # Booking display card
│   │   └── inventory/
│   │       └── InventoryCard.jsx  # Inventory item card
│   ├── hooks/
│   │   ├── useBookings.js         # Bookings logic
│   │   └── useInventory.js        # Inventory logic
│   ├── lib/
│   │   └── api.js                 # API client setup
│   └── styles/
│       └── globals.css            # Global styles
│
└── server/                          # Express Backend
    ├── models/
    │   ├── User.js                # Vendor user schema
    │   ├── Inventory.js           # Inventory items schema
    │   └── Booking.js             # Bookings schema
    ├── controllers/
    │   ├── auth.controller.js     # Authentication logic
    │   ├── inventory.controller.js # Inventory operations
    │   └── booking.controller.js  # Booking operations
    ├── routes/
    │   ├── auth.routes.js         # Auth endpoints
    │   ├── inventory.routes.js    # Inventory endpoints
    │   └── booking.routes.js      # Booking endpoints
    ├── middleware/
    │   └── auth.middleware.js     # JWT authentication
    ├── utils/
    │   ├── generateInvoice.js     # PDF invoice + WhatsApp
    │   └── aiAssistant.js         # Google GenAI integration
    ├── config/
    │   └── db.js                  # Database configuration
    └── server.js                  # Entry point
```

---

## 📊 DATABASE SCHEMA

### 1. User Collection (Vendors)
```javascript
{
  _id: ObjectId,
  businessName: String,              // "Sharma Tent House"
  phone: String,                      // "+91 9876543210"
  email: String,                      // "vendor@example.com"
  password: String,                   // (hashed)
  subscriptionStatus: String,         // "active" | "inactive" | "cancelled"
  plan: String,                       // "Monthly" | "Yearly" | "Free"
  address: String,
  city: String,
  state: String,
  gstNumber: String,                  // For invoices
  profilePhoto: String,               // URL
  createdAt: Date,
  updatedAt: Date
}
```

### 2. Inventory Collection (Items)
```javascript
{
  _id: ObjectId,
  vendorId: ObjectId,                 // Reference to User
  name: String,                       // "Luxury Sofa", "Gold Lights"
  category: String,                   // "Furniture" | "Decoration" | "Utensils" | "Lights" | "Catering"
  totalStock: Number,                 // 50
  availableStock: Number,             // 30 (after bookings)
  rentPrice: Number,                  // 500 per day
  purchasePrice: Number,              // Cost to vendor
  description: String,
  itemCondition: String,              // "Good" | "Fair" | "Needs Repair"
  location: String,                   // Warehouse location
  photoUrl: String,
  lastMaintenanceDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### 3. Booking Collection (Events)
```javascript
{
  _id: ObjectId,
  vendorId: ObjectId,                 // Reference to User
  clientName: String,
  clientPhone: String,
  clientEmail: String,
  eventType: String,                  // "Wedding" | "Anniversary" | "Birthday" | "Corporate"
  eventDate: Date,
  venue: String,
  guestCount: Number,
  itemsBooked: [
    {
      itemId: ObjectId,               // Reference to Inventory
      itemName: String,
      quantity: Number,
      rentPrice: Number,
      subtotal: Number
    }
  ],
  totalAmount: Number,
  advancePaid: Number,
  paymentStatus: String,              // "Pending" | "Partial" | "Complete" | "Cancelled"
  deliveryStatus: String,             // "Pending" | "Delivered" | "Returned" | "Partial Return"
  damageReport: {
    totalDamage: Number,
    itemsDamaged: [
      {
        itemId: ObjectId,
        itemName: String,
        damageCost: Number,
        notes: String
      }
    ]
  },
  invoiceSent: Boolean,
  invoiceUrl: String,
  staffAssigned: [
    {
      staffName: String,
      role: String                    // "Loader" | "Supervisor" | "Helper"
    }
  ],
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔌 BACKEND API ENDPOINTS

### Authentication (`/api/auth`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/register` | Register new vendor |
| POST | `/login` | Login vendor |
| GET | `/profile` | Get vendor profile (Protected) |
| PUT | `/update-profile` | Update vendor profile (Protected) |

### Inventory (`/api/inventory`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/add` | Add inventory item (Protected) |
| GET | `/all` | Get all items (Protected) |
| GET | `/:id` | Get single item (Protected) |
| GET | `/category/:category` | Get items by category (Protected) |
| PUT | `/:id` | Update item (Protected) |
| DELETE | `/:id` | Delete item (Protected) |
| POST | `/check-availability` | Check item availability (Protected) |

### Bookings (`/api/bookings`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/create` | Create new booking (Protected) |
| GET | `/all` | Get all bookings (Protected) |
| GET | `/:id` | Get single booking (Protected) |
| GET | `/calendar/:month/:year` | Get month calendar view (Protected) |
| PUT | `/:id/update-status` | Update payment/delivery (Protected) |
| PUT | `/:id/update-payment` | Record advance payment (Protected) |
| POST | `/:id/send-invoice` | Send WhatsApp invoice (Protected) |
| POST | `/:id/mark-damage` | Record damage (Protected) |
| POST | `/:id/complete` | Complete booking (Protected) |
| DELETE | `/:id/cancel` | Cancel booking (Protected) |
| GET | `/analytics/dashboard` | Dashboard metrics (Protected) |

---

## 🎨 FRONTEND COMPONENTS

### UI Components (`components/ui/`)
- **Navbar.jsx** - Top navigation with user profile dropdown
- **Sidebar.jsx** - Side navigation with menu items

### Feature Components 
- **InventoryCard.jsx** - Display inventory items with stock status
- **BookingCard.jsx** - Display bookings with status and actions

### Custom Hooks
- **useInventory.js** - Inventory state management
  - `fetchInventory()`, `addItem()`, `updateItem()`, `deleteItem()`
  - `getByCategory()`, `checkAvailability()`

- **useBookings.js** - Booking state management
  - `fetchBookings()`, `createBooking()`, `updateStatus()`
  - `sendInvoice()`, `markDamage()`, `completeBooking()`
  - `fetchAnalytics()`

---

## 🚀 KEY FEATURES IMPLEMENTATION

### 1. **Availability Calendar** ✅
```
Flow:
1. User selects items and event date
2. checkAvailability() checks all bookings for that date
3. Compares available stock vs requested quantity
4. Returns conflict warnings if insufficient
```

### 2. **WhatsApp Invoicing** ✅
```
Flow:
1. Booking saved successfully
2. generateAndSendInvoice() generates PDF
3. Creates WhatsApp deep link with invoice
4. Shows WhatsApp link to vendor
5. Updates invoiceSent flag
```

### 3. **Damage/Loss Tracker** ✅
```
Flow:
1. After event, vendor marks item as damaged
2. markDamage() records damage report
3. Optional: AI analyzes damage costs
4. Deducts from customer payment or creates bill
```

### 4. **AI Quote Assistant** ✅ (via aiAssistant.js)
```
Flow:
1. User says: "I have 500 guests"
2. generateQuoteFromGuestCount() queries inventory
3. Google GenAI makes recommendations
4. Suggests items with quantities and total cost
5. Returns JSON with recommendations
```

### 5. **Staff Restricted View** ✅ (via staffMiddleware)
```
Flow:
1. Staff logs in with "staff" role
2. staffMiddleware filters endpoints
3. Staff can only see:
   - Loading lists for the day
   - Item assignments
4. Staff CANNOT see:
   - Financial data
   - Customer payment info
   - Pricing details
```

---

## ⚙️ SETUP INSTRUCTIONS

### Prerequisites
- Node.js 16+
- MongoDB
- Google GenAI API Key
- Twilio or WhatsApp Business API (optional)

### Backend Setup

```bash
# Navigate to server
cd server

# Install dependencies
npm install express mongoose bcryptjs jsonwebtoken cors dotenv jspdf jspdf-autotable axios @google/generative-ai

# Create .env file
cat > .env << EOF
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/vendor_saas
JWT_SECRET=your_jwt_secret_key_here
GOOGLE_GENAI_API_KEY=your_google_genai_key
TWILIO_ACCOUNT_SID=your_twilio_sid (optional)
TWILIO_AUTH_TOKEN=your_twilio_token (optional)
PORT=5000
EOF

# Start server
node server.js
```

### Frontend Setup

```bash
# Navigate to client
cd client

# Install dependencies
npm install next react axios react-query

# Create .env.local
cat > .env.local << EOF
REACT_APP_API_URL=http://localhost:5000/api
EOF

# Start development server
npm run dev
```

---

## 🔐 Authentication Flow

1. **Registration**
   - User submits: businessName, phone, email, password
   - Password hashed with bcrypt
   - JWT token returned
   - Stored in localStorage

2. **Login**
   - User submits: email, password
   - Password verified with bcrypt
   - JWT token returned
   - Token included in all API requests

3. **Protected Routes**
   - Token checked in authMiddleware
   - userId extracted from token
   - User can only access their own data

---

## 📈 Dashboard Analytics

```javascript
// Returns:
{
  totalBookings: Number,             // Total bookings made
  totalRevenue: Number,              // Sum of all booking amounts
  completedBookings: Number,         // Delivered & returned items
  pendingPayments: Number            // Partial or pending payments
}
```

---

## 🎯 Workflow Examples

### Example 1: Create Booking
```javascript
const bookingData = {
  clientName: "Rajesh Kumar",
  clientPhone: "+91 9876543210",
  clientEmail: "rajesh@example.com",
  eventType: "Wedding",
  eventDate: new Date("2026-12-25"),
  venue: "Taj Garden, Delhi",
  guestCount: 500,
  itemsBooked: [
    { itemId: "id1", quantity: 100 },    // Chairs
    { itemId: "id2", quantity: 20 },     // Tables
    { itemId: "id3", quantity: 50 }      // Lights
  ]
};

await createBooking(bookingData);
// ✓ Items checked for availability
// ✓ Stock reduced in inventory
// ✓ Invoice generated
// ✓ Booking saved
```

### Example 2: Damage Reporting
```javascript
const damageData = {
  totalDamage: 5000,
  itemsDamaged: [
    {
      itemId: "id1",
      itemName: "Chair",
      damageCost: 500,
      notes: "Leg broken"
    }
  ]
};

await markDamage(bookingId, damageData);
// ✓ Damage recorded
// ✓ Optional: AI analyzes realistic costs
// ✓ Bill adjusted or new charge created
```

### Example 3: AI Quote Generation
```javascript
const guestCount = 500;

const quote = await generateQuoteFromGuestCount(vendorId, guestCount);
// Returns:
{
  success: true,
  recommendation: {
    recommendations: [
      { item: "Chairs", quantity: 550, reason: "10% extra for contingency" },
      { item: "Tables", quantity: 25, reason: "Standard wedding proportions" },
      { item: "Lights", quantity: 60, reason: "For ambiance & safety" }
    ],
    totalEstimatedCost: 45000,
    notes: "..."
  }
}
```

---

## 📱 Mobile-First PWA Features

The frontend is built as a Progressive Web App (PWA):

1. **Responsive Design** - Works on mobile, tablet, desktop
2. **Offline Support** - (Can add Service Workers)
3. **Fast Loading** - Optimized with Next.js
4. **No App Store** - Install directly from browser

---

## 🎊 Future Enhancements

1. **SMS Invoicing** - Add Twilio SMS support
2. **Push Notifications** - Remind about upcoming events
3. **Multi-vendor Dashboard** - Admin view of all vendors
4. **Advanced Analytics** - Seasonal trends, popular items
5. **Rental Extensions** - Extend event dates
6. **Insurance Integration** - Damage claim management
7. **Staff Mobile App** - Separate view for loaders/helpers
8. **Subscription Management** - Upgrade/downgrade plans

---

## 💡 Key Success Factors

1. ✅ **Prevents Double-Booking** - Real-time availability check
2. ✅ **Transparent Billing** - Automated WhatsApp invoices
3. ✅ **Damage Management** - Track & recover costs
4. ✅ **Staff Privacy** - Restricted view for employees
5. ✅ **Smart Recommendations** - AI-powered quoting
6. ✅ **Zero Setup Cost** - Free tier setup
7. ✅ **Local & Scalable** - Works offline-first, scales to cloud

---

**Built for the "Desi" Vendor** 🇮🇳
Designed with Indian wedding customs in mind.
