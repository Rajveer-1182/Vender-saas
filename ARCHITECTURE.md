# 🏗️ VENDOR SAAS - ARCHITECTURE OVERVIEW

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          VENDOR SAAS PLATFORM                              │
│                          Indian Wedding Vendors                             │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React + Next.js)                          │
│                          on Vercel (FREE TIER)                              │
├──────────────────────────────────────────────────────────────────────────────┤
│
│  ┌─────────────────────────────────────────────────────────────────┐
│  │                     PAGES                                        │
│  ├─────────────────────────────────────────────────────────────────┤
│  │ • Home / Login / Register                                        │
│  │ • Dashboard (Analytics & KPIs)                                  │
│  │ • Inventory Management (List, Add, Edit, Delete)               │
│  │ • Booking Management (Create, View, Update)                    │
│  │ • Availability Calendar (Visual booking calendar)              │
│  │ • Invoice Management (Send via WhatsApp)                       │
│  │ • Damage Tracker (Report & calculate costs)                    │
│  │ • Staff Mode (Restricted - Loading lists only)                 │
│  │ • Profile & Settings                                            │
│  └─────────────────────────────────────────────────────────────────┘
│
│  ┌─────────────────────────────────────────────────────────────────┐
│  │                    COMPONENTS                                    │
│  ├─────────────────────────────────────────────────────────────────┤
│  │ UI Components          Feature Components    Custom Hooks       │
│  │ • Navbar             • InventoryCard      • useInventory      │
│  │ • Sidebar            • BookingCard         • useBookings       │
│  │ • Forms              • Modals              • useAuth           │
│  │ • Tables             • Charts              • useAnalytics      │
│  │ • Cards              • Filters             • useCalendar       │
│  └─────────────────────────────────────────────────────────────────┘
│
│  ┌─────────────────────────────────────────────────────────────────┐
│  │                    API CLIENT (axios)                           │
│  │                    /lib/api.js                                  │
│  └─────────────────────────────────────────────────────────────────┘
│
└──────────────────────────────────────────────────────────────────────────────┘
                                    ║
                        HTTP/REST API Calls (JSON)
                                    ║
┌──────────────────────────────────────────────────────────────────────────────┐
│                      BACKEND (Node.js + Express.js)                          │
│                      on Render/Railway (FREE TIER)                           │
├──────────────────────────────────────────────────────────────────────────────┤
│
│  ┌─────────────────────────────────────────────────────────────────┐
│  │               ROUTES & ENDPOINTS (25 Total)                    │
│  ├─────────────────────────────────────────────────────────────────┤
│  │
│  ├─ /api/auth           (4 endpoints)
│  │  ├─ POST   /register        - Register new vendor
│  │  ├─ POST   /login           - Login vendor
│  │  ├─ GET    /profile         - Get current profile
│  │  └─ PUT    /update-profile  - Update profile
│  │
│  ├─ /api/inventory      (7 endpoints)
│  │  ├─ POST   /add                  - Add new item
│  │  ├─ GET    /all                  - List all items
│  │  ├─ GET    /category/:category   - Filter by category
│  │  ├─ GET    /:id                  - Get single item
│  │  ├─ PUT    /:id                  - Update item
│  │  ├─ DELETE /:id                  - Delete item
│  │  └─ POST   /check-availability   - Check stock
│  │
│  ├─ /api/bookings       (11 endpoints)
│  │  ├─ POST   /create                    - Create booking
│  │  ├─ GET    /all                       - List all bookings
│  │  ├─ GET    /:id                       - Get single booking
│  │  ├─ GET    /calendar/:month/:year     - Calendar view
│  │  ├─ PUT    /:id/update-status        - Update payment/delivery
│  │  ├─ PUT    /:id/update-payment       - Record advance payment
│  │  ├─ POST   /:id/send-invoice         - Send WhatsApp invoice
│  │  ├─ POST   /:id/mark-damage          - Report damage
│  │  ├─ POST   /:id/complete             - Complete booking
│  │  ├─ DELETE /:id/cancel               - Cancel booking
│  │  └─ GET    /analytics/dashboard      - Dashboard metrics
│  │
│  └─────────────────────────────────────────────────────────────────┘
│
│  ┌─────────────────────────────────────────────────────────────────┐
│  │                   MIDDLEWARE                                    │
│  ├─────────────────────────────────────────────────────────────────┤
│  │ • authMiddleware      - JWT token verification                 │
│  │ • staffMiddleware     - Staff role restriction                │
│  │ • errorHandler        - Error response formatting              │
│  │ • cors                - Cross-origin requests                  │
│  │ • bodyParser          - JSON parsing                           │
│  └─────────────────────────────────────────────────────────────────┘
│
│  ┌─────────────────────────────────────────────────────────────────┐
│  │                   CONTROLLERS (Business Logic)                 │
│  ├─────────────────────────────────────────────────────────────────┤
│  │ Auth Controller:            Inventory Controller:               │
│  │ • Register                  • Add Item                          │
│  │ • Login                     • Get All Items                    │
│  │ • Get Profile              • Get By Category                   │
│  │ • Update Profile           • Update Item                       │
│  │                             • Delete Item                       │
│  │ Booking Controller:         • Check Availability               │
│  │ • Create Booking            (Stock validation)                 │
│  │ • Get All Bookings                                             │
│  │ • Get Single Booking                                           │
│  │ • Update Status                                                │
│  │ • Send Invoice                                                 │
│  │ • Mark Damage                                                  │
│  │ • Complete Booking                                             │
│  │ • Get Analytics                                                │
│  └─────────────────────────────────────────────────────────────────┘
│
│  ┌─────────────────────────────────────────────────────────────────┐
│  │                   DATABASE MODELS                              │
│  ├─────────────────────────────────────────────────────────────────┤
│  │
│  │  User Model              Inventory Model        Booking Model   │
│  │  • _id                   • _id                  • _id            │
│  │  • businessName          • vendorId (FK)        • vendorId (FK) │
│  │  • phone                 • name                 • clientName     │
│  │  • email                 • category             • eventType      │
│  │  • password (hashed)     • totalStock           • eventDate      │
│  │  • plan                  • availableStock       • itemsBooked[]  │
│  │  • subscription          • rentPrice            • totalAmount    │
│  │  • gstNumber             • condition            • paymentStatus  │
│  │  • profilePhoto          • location             • deliveryStatus │
│  │  • timestamps            • timestamps           • damageReport   │
│  │                                                  • invoiceSent    │
│  │                                                  • timestamps     │
│  │
│  └─────────────────────────────────────────────────────────────────┘
│
│  ┌─────────────────────────────────────────────────────────────────┐
│  │                   UTILITIES & SERVICES                         │
│  ├─────────────────────────────────────────────────────────────────┤
│  │
│  │  Invoice Generator                AI Assistant                  │
│  │  • generatePDFInvoice()            • generateQuoteFromGuests()  │
│  │  • sendViaWhatsApp()               • analyzeBookingTrends()     │
│  │  (Using jsPDF library)             • estimateDamageCosts()      │
│  │                                     (Using Google GenAI)         │
│  │
│  └─────────────────────────────────────────────────────────────────┘
│
└──────────────────────────────────────────────────────────────────────────────┘
                                    ║
                              Database Queries
                                    ║
┌──────────────────────────────────────────────────────────────────────────────┐
│                           DATABASE LAYER                                     │
│                         MongoDB on Atlas (FREE)                              │
├──────────────────────────────────────────────────────────────────────────────┤
│
│  Collections:
│  • users           (Vendors, password hashed with bcryptjs)
│  • inventories    (Items with stock tracking)
│  • bookings       (Event bookings with items & payments)
│
│  Indexes:
│  • users: email, phone (unique)
│  • inventories: vendorId, category
│  • bookings: vendorId, eventDate, paymentStatus
│
│  Relationships:
│  • inventories.vendorId → users._id
│  • bookings.vendorId → users._id
│  • bookings.itemsBooked[].itemId → inventories._id
│
└──────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│                        EXTERNAL INTEGRATIONS                                 │
├──────────────────────────────────────────────────────────────────────────────┤
│
│  ✅ Google GenAI API
│     • Quote generation from guest count
│     • Booking trend analysis
│     • Damage cost estimation
│
│  ✅ WhatsApp Distribution API
│     • Send invoices to customers
│     • Order confirmations
│     • Reminders
│
│  📍 Optional Future Integrations:
│     • Twilio (SMS)
│     • Cloudinary (Image upload)
│     • Stripe/Razorpay (Payments)
│     • SendGrid (Email)
│
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 User Flow Diagram

```
                    ┌─────────────────────────┐
                    │   Vendor Visits App     │
                    └────────────┬────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │   Register / Login      │
                    │  (JWT token received)   │
                    └────────────┬────────────┘
                                 │
        ┌────────────────────────┼────────────────────────┐
        │                        │                        │
        ▼                        ▼                        ▼
   ┌────────────┐          ┌──────────────┐        ┌──────────────┐
   │ Inventory  │          │   Bookings   │        │  Dashboard   │
   │ Management │          │ Management   │        │  & Analytics │
   └──────┬─────┘          └──────┬───────┘        └──────┬───────┘
          │                       │                       │
          ▼                       ▼                       ▼
    ┌──────────────┐      ┌───────────────┐      ┌──────────────┐
    │ Add/Edit/Del │      │ Check         │      │ View Revenue │
    │ Inventory    │      │ Availability  │      │ & Metrics    │
    │ Items        │      │               │      │              │
    └──────────────┘      └───────┬───────┘      └──────────────┘
                                  │
                     ┌────────────▼────────────┐
                     │   Create Booking        │
                     │   (Stock Deducted)      │
                     └────────────┬────────────┘
                                  │
                     ┌────────────▼────────────┐
                     │   Send Invoice via      │
                     │   WhatsApp to Customer  │
                     └────────────┬────────────┘
                                  │
                     ┌────────────▼────────────┐
                     │   Record Payment        │
                     │   (Advance/Partial/Full)│
                     └────────────┬────────────┘
                                  │
                     ┌────────────▼────────────┐
                     │   Event Date Arrives    │
                     │   (Delivery)            │
                     └────────────┬────────────┘
                                  │
                     ┌────────────▼────────────┐
                     │   Report Damage (if any)│
                     │   (AI calculates cost)  │
                     └────────────┬────────────┘
                                  │
                     ┌────────────▼────────────┐
                     │   Complete Booking      │
                     │   (Stock Returned)      │
                     └─────────────────────────┘
```

---

## 💾 Data Flow Diagram

```
Frontend (React)                Backend (Node.js)              Database (MongoDB)
─────────────────               ─────────────────             ──────────────────

User Input
    ↓
[useInventory Hook]
    ↓
API Client (axios)
    ↓
HTTP Request ─────────────────→ [Express Router]
                                    ↓
                            [Auth Middleware]
                            (Verify JWT Token)
                                    ↓
                            [Corresponding Controller]
                            (Business Logic)
                                    ↓
                            Database Query
                                    ├──────────────────────→ [MongoDB Collection]
                                    │                              ↓
Response Data ←──────────────────── [Query Result]         [CRUD Operation]
    ↓                                   ↓
[JSON Response]                    [Update State]
    ↓                                   ↓
Re-render UI                   Return to Frontend
    ↓
User Sees Updated Data
```

---

## 🔐 Authentication Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    LOGIN/REGISTER FLOW                      │
├─────────────────────────────────────────────────────────────┤

Credentials
    ↓
POST /auth/register or /auth/login
    ↓
Validate Input
    ↓
Check Database
    ↓ (Registration)
Password → bcrypt.hash() → Hashed Password
    ↓
Create User in MongoDB
    ↓
Create JWT Token:
  jwt.sign(
    { userId: user._id },
    JWT_SECRET,
    { expiresIn: "30d" }
  )
    ↓
Return Token to Frontend
    ↓
Frontend Stores in localStorage
    ↓

Protected API Request:
    ↓
Include Token in Header:
  Authorization: Bearer TOKEN_XXXXX
    ↓
authMiddleware.verify():
  jwt.verify(token, JWT_SECRET)
    ↓ Success
Extract userId → Attach to req.userId
    ↓
Proceed to Controller
    ↓ Failure
Return 401 Unauthorized
    ↓
Frontend auto-logout

└─────────────────────────────────────────────────────────────┘
```

---

## 📊 Database Relationships

```
              ┌──────────────────┐
              │      User        │
              │  (Vendors)       │
              │                  │
              │ _id (PK)         │
              │ businessName     │
              │ phone (Unique)   │
              │ email (Unique)   │
              └────────┬─────────┘
                       │
          ┌────────────┴────────────┐
          │ One-to-Many            │ One-to-Many
          ▼                        ▼
   ┌─────────────────┐      ┌─────────────────┐
   │   Inventory     │      │    Booking      │
   │   (Items)       │      │    (Events)     │
   │                 │      │                 │
   │ _id (PK)        │      │ _id (PK)        │
   │ vendorId (FK) ──┼──────┼─ vendorId (FK)  │
   │ name            │      │ clientName      │
   │ category        │      │ eventDate       │
   │ rentPrice       │      │ totalAmount     │
   │ totalStock      │      │                 │
   │ availableStock  │      │ itemsBooked[] ──┤
   └─────────────────┘      │  ├─ itemId ────┼──→ Inventory._id
                            │  ├─ quantity    │
                            │  └─ subtotal    │
                            └─────────────────┘
```

---

## 🚀 Deployment Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                     PRODUCTION SETUP                        │
├──────────────────────────────────────────────────────────────┤

Internet Users
    ↓
┌─────────────────────────┐
│  Domain: vendorsaas.com │
├─────────────────────────┤
│  Frontend on Vercel     │  Backend on Render
│  (React App)            │  (Express Server)
│  vendorsaas.com    ←────┼──→ api.vendorsaas.com
│  www.vendorsaas.com     │  port 5000
└─────────────────────────┘
     ↓ API calls ↓
   HTTPS/REST
     ↓         ↓
  ┌──────────────────────┐
  │ MongoDB Atlas        │
  │ Cloud Hosted DB      │
  │ (Free Tier: 512MB)   │
  │                      │
  │ Replica Set:         │
  │ Primary + Secondary  │
  └──────────────────────┘

Benefits:
• Fast global CDN (Vercel)
• Auto-scaling backend
• Automatic SSL certificates
• Free tier sufficient for MVP
• Easy environment config
• Git-based deployment
```

---

## 🎯 Technology Stack Summary

| Layer | Technology | Purpose | Cost |
|-------|-----------|---------|------|
| **Frontend** | React + Next.js | Web app | Free |
| * Hosting | Vercel | CDN + Deployment | Free |
| * Styling | Tailwind CSS | UI Framework | Free |
| **Backend** | Node.js + Express | API Server | Free |
| * Hosting | Render/Railway | Server | Free |
| * Auth | JWT + bcryptjs | Security | Free |
| **Database** | MongoDB | Data Storage | Free |
| * Hosting | MongoDB Atlas | Cloud DB | Free (512MB) |
| **AI** | Google GenAI | Smart Features | Free (up to 60 req/min) |
| **External** | WhatsApp API | Invoice Delivery | ~₹1-2 per invoice |

**Total MVP Cost: FREE during development**
**Monthly after launch: ₹0-500 (minimal traffic)**

---

**Architecture Status: ✅ SCALABLE & CLOUD-READY**
