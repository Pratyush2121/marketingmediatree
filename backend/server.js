require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const connectDB = require('./config/db');
const seedData = require('./utils/seeder');

// Route imports
const authRoutes = require('./routes/authRoutes');
const blogRoutes = require('./routes/blogRoutes');
const contactRoutes = require('./routes/contactRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const mapRoutes = require('./routes/mapRoutes');
const mediaRoutes = require('./routes/mediaRoutes');

// Initialize express app
const app = express();

// Connect to Database
connectDB().then(() => {
  // Run seeder to pre-populate database if empty
  seedData();
});

// --- Security Middleware ---

// 1. Helmet: Secure HTTP Headers (configured to allow script execution for maps/iframes if needed)
app.use(helmet({
  contentSecurityPolicy: false // Disabled for deployment simplicity with embeds and external CDNs
}));

// 2. CORS: Enable Cross-Origin Resource Sharing (configure origins)
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://marketingmediatree.com',
  'https://www.marketingmediatree.com',
  /\.vercel\.app$/ // Matches all Vercel previews
];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    const isAllowed = allowedOrigins.some(allowed => {
      if (allowed instanceof RegExp) {
        return allowed.test(origin);
      }
      return allowed === origin;
    });

    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// 3. Rate Limiting: Limit requests from same IP (Prevent DDoS)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Limit each IP to 300 requests per window
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api', limiter);

// 4. Data Sanitization: Prevent NoSQL Query Injection (e.g. email: { "$gt": "" })
app.use(mongoSanitize());

// 5. XSS Protection: Clean user inputs from malicious HTML/JS scripts
app.use(xss());

// --- Body Parsers ---
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// --- API Routes ---
app.get('/api', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Marketing Media Tree API is running successfully'
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/maps', mapRoutes);
app.use('/api/media', mediaRoutes);

// --- Error Handler Middleware ---
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  console.error(`Error Middleware: ${err.message}`);
  res.status(statusCode).json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
});

// Start Server locally
const PORT = process.env.PORT || 5000;
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
}

// Export app for Vercel serverless function
module.exports = app;
