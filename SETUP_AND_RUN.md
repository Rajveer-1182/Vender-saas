# 🚀 Complete Setup & Run Guide

## Project Overview
This is a **Vendor SaaS platform** for Indian wedding vendors with:
- ✅ Backend: Node.js + Express + MongoDB
- ✅ Frontend: Next.js 16 + React 19 + Tailwind CSS
- ✅ 25+ API endpoints
- ✅ Full authentication system
- ✅ Inventory & Booking management

---

## 📋 Prerequisites
- Node.js installed (v16 or higher)
- MongoDB running locally or connection string ready
- 2 terminal windows (one for backend, one for frontend)

---

## 🔧 Backend Setup & Run

### Step 1: Navigate to Backend Directory
```bash
cd C:\Users\Asus\OneDrive\Desktop\vendor-saas\server
```

### Step 2: Configure Environment Variables
Open `server/.env` and add:
```env
MONGO_URI=mongodb://localhost:27017/vendor-saas
JWT_SECRET=your-secret-key-here
PORT=5000
GOOGLE_AI_API_KEY=optional-for-ai-assistant
WHATSAPP_API_KEY=optional-for-whatsapp
```

### Step 3: Install Dependencies
```bash
npm install
```

### Step 4: Start the Server
```bash
npm run dev
```

**Expected Output:**
```
🚀 Server running on http://localhost:5000
📝 API Docs available at http://localhost:5000/health
```

---

## 🎨 Frontend Setup & Run

### Step 1: Navigate to Frontend Directory
```bash
cd C:\Users\Asus\OneDrive\Desktop\vendor-saas\client
```

### Step 2: Configure Environment Variables
File: `client/.env.local`
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Step 3: Install Dependencies (if needed)
```bash
npm install
```

### Step 4: Start the Frontend
```bash
npm run dev
```

**Expected Output:**
```
  ▲ Next.js 16.2.2
  - Local:        http://localhost:3000
  ✓ Ready in 2.5s
```

---

## 🧪 Testing the Full Application

### Open in Browser
- **Frontend:** http://localhost:3000
- **API Health Check:** http://localhost:5000/health

### Test Flow

#### 1️⃣ Register as New Vendor
- Go to http://localhost:3000
- You'll be redirected to login
- Click "Register here"
- Fill in your details:
  - Business Name: "My Wedding Rentals"
  - Phone: "+91 9876543210"
  - Email: "vendor@example.com"
  - Password: "password123"

#### 2️⃣ Login
- Click login with your credentials

#### 3️⃣ Add Inventory Items
- Click "📦 Inventory" in sidebar
- Click "+ Add Item"
- Add items like:
  - **Wooden Chairs** | Category: Chairs | Stock: 50 | Price: ₹100
  - **Round Tables** | Category: Tables | Stock: 20 | Price: ₹500
  - **Gold Lights** | Category: Lighting | Stock: 30 | Price: ₹200

#### 4️⃣ Create a Booking
- Click "📅 Bookings" in sidebar
- Click "+ New Booking"
- Fill in:
  - Client Name: "Raj Sharma"
  - Phone: "+91 9999999999"
  - Event Date: Pick a future date
  - Add items with quantities
  - Click "Create Booking"

#### 5️⃣ Update Payment Status
- Go back to bookings
- Click "Mark as Paid"
- Payment status will update

#### 6️⃣ View Dashboard
- Click "Dashboard" to see:
  - Total bookings
  - Inventory count
  - Revenue stats
  - Pending payments

#### 7️⃣ Check Calendar
- Click "📆 Calendar"
- See all your booked events visually
- Upcoming events listed below

---

## 📁 File Structure

```
vendor-saas/
├── server/                          # Backend
│   ├── server.js                   # Main entry point
│   ├── package.json                # Dependencies (✅ FIXED)
│   ├── .env                        # Configuration
│   ├── models/                     # MongoDB schemas
│   │   ├── User.js                # Vendor accounts
│   │   ├── Inventory.js           # Items/stock
│   │   └── Booking.js             # Events/bookings
│   ├── controllers/                # Business logic
│   │   ├── auth.controller.js     # Register/Login
│   │   ├── inventory.controller.js # CRUD items
│   │   └── booking.controller.js  # Booking lifecycle
│   ├── routes/                     # API endpoints
│   │   ├── auth.routes.js         # /api/auth
│   │   ├── inventory.routes.js    # /api/inventory
│   │   └── booking.routes.js      # /api/bookings
│   ├── middleware/
│   │   └── auth.middleware.js     # JWT verification
│   └── utils/
│       ├── generateInvoice.js     # Invoice creation
│       └── aiAssistant.js         # AI quoting
│
└── client/                          # Frontend
    ├── app/
    │   ├── layout.js               # Root layout with nav
    │   ├── page.js                 # Home (redirect logic)
    │   ├── login/page.js           # Auth pages ✅ NEW
    │   ├── register/page.js        # ✅ NEW
    │   ├── dashboard/page.js       # Dashboard ✅ NEW
    │   ├── inventory/
    │   │   ├── page.js            # Inventory list ✅ NEW
    │   │   └── add/page.js        # Add item form ✅ NEW
    │   ├── bookings/
    │   │   ├── page.js            # Bookings list ✅ NEW
    │   │   └── create/page.js     # Create booking form ✅ NEW
    │   └── calendar/page.js        # Calendar view ✅ NEW
    ├── components/                 # Reusable components
    │   ├── ui/
    │   │   ├── Navbar.jsx         # Top navigation
    │   │   └── Sidebar.jsx        # Side menu
    │   ├── booking/
    │   │   └── BookingCard.jsx    # Booking display
    │   └── inventory/
    │       └── InventoryCard.jsx  # Item display
    ├── hooks/                      # Custom React hooks
    │   ├── useInventory.js        # Inventory state management
    │   └── useBookings.js         # Booking state management
    ├── lib/
    │   ├── api.js                 # Axios API client
    │   └── queryClient.js         # React Query setup
    ├── package.json               # Dependencies
    └── .env.local                 # Configuration
```

---

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Create vendor account
- `POST /api/auth/login` - Vendor login
- `GET /api/auth/profile` - Get vendor profile
- `PUT /api/auth/profile` - Update profile

### Inventory
- `GET /api/inventory` - List all items
- `POST /api/inventory` - Add new item
- `PUT /api/inventory/:id` - Update item
- `DELETE /api/inventory/:id` - Delete item
- `GET /api/inventory/check-availability` - Check availability

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - List all bookings
- `GET /api/bookings/:id` - Get booking details
- `PUT /api/bookings/:id` - Update booking
- `PUT /api/bookings/:id/payment` - Update payment
- `PUT /api/bookings/:id/delivery` - Mark delivered
- `PUT /api/bookings/:id/damage` - Report damage
- `DELETE /api/bookings/:id` - Cancel booking
- `GET /api/bookings/invoice/:id` - Generate invoice
- ... and more

---

## 🐛 Troubleshooting

### Backend Won't Start
**Error:** `Cannot use import statement outside a module`
**Solution:** ✅ Already fixed! `package.json` now has `"type": "module"`

### Frontend Shows "Cannot connect to API"
**Solution:** 
1. Verify backend is running on port 5000
2. Check `.env.local` has correct `NEXT_PUBLIC_API_URL`
3. Restart frontend (Ctrl+C, then `npm run dev`)

### MongoDB Connection Failed
**Solution:**
1. Start MongoDB: `mongod`
2. Update `MONGO_URI` in `.env`
3. Restart backend

### "Module not found" errors
**Solution:**
```bash
# Clear cache and reinstall
rm -r node_modules package-lock.json
npm install
npm run dev
```

---

## 📊 Features Implemented

✅ **Authentication**
- User registration with password hashing
- JWT-based login system
- Protected API routes
- Automatic logout on expired tokens

✅ **Inventory Management**
- Add/Edit/Delete items
- Stock tracking with availability checking
- Category filtering
- Item condition monitoring

✅ **Booking System**
- Create bookings with multiple items
- Automatic stock deduction
- Payment status tracking
- Delivery status management
- Damage reporting with cost calculation

✅ **Dashboard**
- Revenue statistics
- Pending payments summary
- Recent bookings display
- Low stock alerts

✅ **Calendar View**
- Visual event calendar
- Day-by-day event display
- Upcoming events list
- Quick booking navigation

✅ **Responsive Design**
- Mobile-friendly layout
- Tailwind CSS styling
- Dark mode ready
- Optimized navigation

---

## 🎯 Next Steps (Optional)

### To Add AI Features:
1. Get Google AI API key: https://makersuite.google.com/app/apikey
2. Add to `.env`: `GOOGLE_AI_API_KEY=your-key`
3. Update `server/utils/aiAssistant.js` to use actual API

### To Enable WhatsApp Invoicing:
1. Set up Twilio account
2. Add credentials to `.env`
3. Update `server/utils/generateInvoice.js`

### To Enable Payment Gateway:
1. Integrate Razorpay or Stripe
2. Add payment endpoint
3. Update booking controller

---

## 💻 Commands Quick Reference

**Backend:**
```bash
cd server
npm install           # First time setup
npm run dev          # Start server
npm start            # Production
```

**Frontend:**
```bash
cd client
npm install           # First time setup
npm run dev          # Start frontend
npm run build        # Build for production
npm start            # Run production build
```

---

## ✨ That's it! 

Your full-stack vendor SaaS is ready to run! 🎉

**Questions?** Check the inline code comments or API_DOCUMENTATION.md for detailed endpoint info.
