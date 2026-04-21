# � QUICK START - 5 MINUTES TO RUNNING SYSTEM

## Prerequisites Check
- [ ] Node.js installed (`node -v` in terminal)
- [ ] MongoDB running (or MongoDB Atlas account ready)
- [ ] 2 terminal windows open
- [ ] Code editor with project open

---

## STEP 1: Terminal Window 1 - Backend (30 seconds)

```bash
cd C:\Users\Asus\OneDrive\Desktop\vendor-saas\server
npm run dev
```

**Wait for message:**
```
🚀 Server running on http://localhost:5000
📝 API Docs available at http://localhost:5000/health
```

✅ **Backend is ready!** (Keep this terminal running)

---

## STEP 2: Terminal Window 2 - Frontend (30 seconds)

```bash
cd C:\Users\Asus\OneDrive\Desktop\vendor-saas\client
npm run dev
```

**Wait for message:**
```
▲ Next.js 16.2.2
- Local:        http://localhost:3000
✓ Ready in 2.5s
```

✅ **Frontend is ready!** (Keep this terminal running)

---

## STEP 3: Open Browser (Instant)

**Go to:** http://localhost:3000

You'll see login page. Click "Register here" to create account!

---

## REGISTER TEST ACCOUNT (1 minute)

**Fill these fields:**
```
Business Name: My Wedding Business
Phone: +91 9876543210
Email: vendor@example.com
Password: password123
Confirm: password123
Click Register
```

**Then Login:**
```
Email or Phone: vendor@example.com
Password: password123
Click Login
```

✅ **You're in! Dashboard appears!**

---

## ADD TEST ITEMS (2 minutes)

Click "📦 Inventory" → Click "+ Add Item"

**Item 1:**
- Name: Chairs
- Category: Chairs
- Stock: 100
- Price: ₹150
- Add Item

**Item 2:**
- Name: Tables
- Category: Tables
- Stock: 20
- Price: ₹1000
- Add Item

✅ **Items added!**

---

## CREATE TEST BOOKING (1.5 minutes)

Click "📅 Bookings" → Click "+ New Booking"

**Fill:**
```
Client Name: John Smith
Phone: +91 9999999999
Event Date: [Pick any future date]
Add Item: Select "Chairs" → Qty: 50
Add Item: Select "Tables" → Qty: 5
Click Create Booking
```

✅ **Booking created!**

Check dashboard - numbers update!

---

## VERIFY EVERYTHING WORKS (30 sec)

### Dashboard
- [ ] Shows 1 booking
- [ ] Shows 2 items
- [ ] Shows correct total amount

### Inventory
- [ ] Shows 2 items with stock
- [ ] Can see items in grid

### Bookings
- [ ] Shows your booking
- [ ] Shows payment status
- [ ] Can mark as paid

### Calendar
- [ ] Shows booked date
- [ ] Shows event details

✅ **COMPLETE & WORKING!**

---

## 🎉 You're Done!

The system is fully functional. You can:
- ✅ Register vendors
- ✅ Add inventory items
- ✅ Create bookings
- ✅ Track payments
- ✅ View calendar
- ✅ Manage stock

---

## Troubleshooting Quick Tips

**"Cannot connect to API"**
→ Make sure server terminal shows "Server running on :5000"

**"Port already in use"**
→ Change in `server/.env`: PORT=3001

**"Cannot find MongoDB"**
→ Either start MongoDB locally or use MongoDB Atlas (cloud)

**"Module not found"**
→ In that folder: `npm install`

---

## Next: Explore Features!

Try these in the UI:
- [ ] Add more items
- [ ] Create more bookings
- [ ] Check low stock alert
- [ ] Update payment status
- [ ] View items by category
- [ ] Preview photos
- [ ] Check revenue on dashboard

## 🖥️ STEP 3: Backend Setup

```bash
# Navigate to server directory
cd server

# Install all dependencies
npm install

# Create .env file with credentials
cat > .env << EOF
# Database
MONGO_URI=mongodb+srv://your_username:your_password@cluster0.xxxxx.mongodb.net/vendor_saas

# JWT Secret (create any random string)
JWT_SECRET=your_super_secret_jwt_key_12345

# Google GenAI
GOOGLE_GENAI_API_KEY=AIzaSyxxxxxxxxxxxxxxxxxxxxxx

# Server
PORT=5000
NODE_ENV=development

# Optional: Twilio (for SMS invoicing)
# TWILIO_ACCOUNT_SID=your_account_sid
# TWILIO_AUTH_TOKEN=your_auth_token
EOF

# Test the server starts
npm run dev
# or: node server.js
```

**Expected Output:**
```
✅ MongoDB Connected
🚀 Server running on http://localhost:5000
📝 API Docs available at http://localhost:5000/health
```

---

## ⚛️ STEP 4: Frontend Setup

```bash
# Open a NEW terminal
# Navigate to client directory
cd client

# Install all dependencies
npm install

# Create .env.local file
cat > .env.local << EOF
REACT_APP_API_URL=http://localhost:5000/api
EOF

# Start development server
npm run dev
```

**Expected Output:**
```
> next dev

ready - started server on 0.0.0.0:3000
```

**Open your browser:** http://localhost:3000

---

## 🧪 STEP 5: Test the System

### Test 1: Register a Vendor
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "businessName": "Sharma Tent House",
    "phone": "+919876543210",
    "email": "vendor@example.com",
    "password": "password123",
    "plan": "Monthly"
  }'
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

### Test 2: Add Inventory Item
```bash
curl -X POST http://localhost:5000/api/inventory/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "Luxury Sofa",
    "category": "Furniture",
    "totalStock": 50,
    "rentPrice": 500,
    "purchasePrice": 5000,
    "description": "Premium sofa for weddings",
    "location": "Main Warehouse"
  }'
```

### Test 3: List Inventory
```bash
curl http://localhost:5000/api/inventory/all \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Test 4: Create Booking
```bash
# First, get item IDs from list inventory
# Then create booking:

curl -X POST http://localhost:5000/api/bookings/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "clientName": "Rajesh Kumar",
    "clientPhone": "+919999999999",
    "clientEmail": "client@example.com",
    "eventType": "Wedding",
    "eventDate": "2026-12-25T10:00:00Z",
    "venue": "Taj Garden, Delhi",
    "guestCount": 500,
    "itemsBooked": [
      {
        "itemId": "ITEM_ID_HERE",
        "quantity": 100
      }
    ]
  }'
```

---

## 📱 STEP 6: View in Browser

### Frontend Pages (Open in Browser)
- **Home:** http://localhost:3000
- **Login:** http://localhost:3000/login
- **Dashboard:** http://localhost:3000/dashboard
- **Inventory:** http://localhost:3000/inventory
- **Bookings:** http://localhost:3000/bookings
- **Calendar:** http://localhost:3000/calendar

### Test Login Credentials
- **Email:** vendor@example.com
- **Password:** password123

---

## 📁 Project File Structure

```
vendor-saas/
├── server/
│   ├── .env                 ← Add MongoDB & API keys here
│   ├── server.js
│   ├── models/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   └── package.json
│
└── client/
    ├── .env.local           ← Add API URL here
    ├── app/
    │   ├── page.js
    │   ├── layout.js
    │   ├── dashboard/
    │   ├── booking/
    │   └── inventory/
    ├── components/
    ├── hooks/
    └── package.json
```

---

## 🐛 Troubleshooting

### Issue: MongoDB Connection Error
**Error:** `MongooseError: Cannot connect to MongoDB`
```
Solution:
1. Check MONGO_URI in .env is correct
2. Check internet is connected
3. Check IP whitelist in MongoDB Atlas
4. Check MongoDB is running (if local)
```

### Issue: Port Already in Use
**Error:** `Error: listen EADDRINUSE: address already in use :::5000`
```
Solution:
# Kill process on port 5000
# macOS/Linux:
lsof -i :5000
kill -9 <PID>

# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Issue: CORS Error
**Error:** `Access to XMLHttpRequest blocked by CORS policy`
```
Solution:
1. Check backend CORS is enabled: app.use(cors())
2. Check frontend API URL in .env.local
3. Restart both servers
```

### Issue: JWT Token Error
**Error:** `Invalid or expired token`
```
Solution:
1. Get new token (re-login)
2. Check Authorization header format: "Bearer TOKEN"
3. Check JWT_SECRET is same in .env
```

---

## 🎯 What to Do Next

### Phase 1: Development (Week 1-2)
- ✅ Setup complete
- ✅ Test all endpoints with Postman/Insomnia
- ✅ Build dashboard UI
- ✅ Test with sample data

### Phase 2: MVP Features (Week 3-4)
- [ ] Calendar view
- [ ] WhatsApp invoice sending
- [ ] Damage tracker UI
- [ ] Staff mode restriction
- [ ] AI quote assistant

### Phase 3: Testing (Week 5-6)
- [ ] User testing with 5 local vendors
- [ ] Bug fixes
- [ ] UI improvements
- [ ] Performance optimization

### Phase 4: Deployment
- [ ] Deploy backend to Render/Railway
- [ ] Deploy frontend to Vercel
- [ ] Setup production MongoDB
- [ ] Configure domain

---

## 🔗 Useful Links

| Resource | Link |
|----------|------|
| MongoDB Atlas | https://www.mongodb.com/cloud/atlas |
| Google AI Studio | https://makersuite.google.com/app/apikey |
| Postman (API Testing) | https://www.postman.com/downloads/ |
| Vercel (Frontend Hosting) | https://vercel.com |
| Render (Backend Hosting) | https://render.com |
| JWT Debug | https://jwt.io |

---

## 📞 Common Commands

```bash
# Backend
cd server && npm install          # Install dependencies
npm run dev / node server.js      # Start server
npm test                          # Run tests

# Frontend  
cd client && npm install          # Install dependencies
npm run dev                       # Start dev server
npm run build                     # Build for production
npm start                         # Run production build

# Database
mongosh                           # Connect to MongoDB shell
db.users.find()                   # List all users
db.inventory.deleteMany({})       # Clear inventory
```

---

## ✅ Success Checklist

- [ ] Node.js installed
- [ ] MongoDB setup & connected
- [ ] Google GenAI API key obtained
- [ ] `.env` file created with credentials
- [ ] `.env.local` file created
- [ ] Backend server running on :5000
- [ ] Frontend running on :3000
- [ ] Can register vendor
- [ ] Can add inventory
- [ ] Can create booking
- [ ] Can see dashboard

---

## 💬 Next Steps

1. **Familiarize** with the file structure
2. **Read** SYSTEM_DESIGN.md for architecture details
3. **Test** all API endpoints
4. **Build** additional UI pages as needed
5. **Deploy** when ready

---

**Start Building! 🚀**

Questions? Check the SYSTEM_DESIGN.md for detailed explanations.
