/*
  📦 BACKEND DEPENDENCIES
  Install with: npm install
*/

// Core Framework
express                      // Web framework
mongoose                     // MongoDB ODM
cors                        // Handle cross-origin requests
dotenv                      // Environment variables

// Authentication & Security
bcryptjs                    // Password hashing
jsonwebtoken               // JWT tokens
helmet                     // Security headers (optional)

// File & PDF Generation
jspdf                      // PDF generation
jspdf-autotable           // Tables in PDF
axios                      // HTTP client

// AI Integration
@google/generative-ai      // Google GenAI API

// Optional Services
twilio                     // SMS/WhatsApp
cloudinary                 // Image upload

// Development
nodemon                    // Auto-restart server
@babel/node               // Babel support (optional)

/*
  📦 FRONTEND DEPENDENCIES
  Install with: npm install
*/

// Core
next                       // React framework
react                      // React library
react-dom                  // DOM rendering

// API & State Management
axios                      // HTTP client
react-query               // Data fetching
(or: @tanstack/react-query)

// UI & Styling
tailwindcss               // Utility CSS
@tailwindcss/forms       // Form components
@tailwindcss/typography  // Typography

// Optional
next-auth                 // Authentication (alternative)
framer-motion            // Animations
recharts                 // Charts & analytics

/*
  FULL INSTALLATION COMMANDS
*/

// BACKEND
cd server
npm install express mongoose cors dotenv bcryptjs jsonwebtoken jspdf jspdf-autotable axios @google/generative-ai

// FRONTEND
cd client
npm install

// DEV DEPENDENCIES (Backend)
npm install --save-dev nodemon @babel/node @babel/core @babel/preset-env

// DEV DEPENDENCIES (Frontend - usually included with Next.js)
npm install --save-dev tailwindcss postcss autoprefixer
npx tailwindcss init -p
