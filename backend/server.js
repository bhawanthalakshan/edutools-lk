const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Route Imports
const healthRoutes = require('./routes/healthRoutes');
const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const articleRoutes = require('./routes/articleRoutes');
const toolRoutes = require('./routes/toolRoutes');
const contactRoutes = require('./routes/contactRoutes');
const pastPaperRoutes = require('./routes/pastPaperRoutes');

// Middleware Imports
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Load environment variables
dotenv.config();

// Environment Variable Validation Check
if (!process.env.JWT_SECRET) {
  console.warn('⚠️  Warning: JWT_SECRET environment variable is not defined. Using default fallback key.');
}
if (!process.env.MONGODB_URI) {
  console.warn('⚠️  Warning: MONGODB_URI environment variable is not defined. Using default mongodb://localhost:27017/edutools-lk');
}

// Connect to MongoDB
connectDB();

const app = express();

// Security HTTP Headers Middleware (allowing cross-origin resource sharing for static PDFs)
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// Rate Limiting Security
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP. Please try again after 15 minutes.',
  },
});

const strictFormLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many submission attempts. Please try again after 15 minutes.',
  },
});

app.use(globalLimiter);

// Secure CORS Configuration
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }
      return callback(new Error('CORS policy violation: Access from this origin is blocked.'));
    },
    credentials: true,
  })
);

app.use(express.json());

// Serve Static Upload Files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/health', healthRoutes);
app.use('/api/auth', strictFormLimiter, authRoutes);
app.use('/api/contact', strictFormLimiter, contactRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/tools', toolRoutes);
app.use('/api/past-papers', pastPaperRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to EduTools LK API',
    tagline: 'Learn Smart. Achieve More.',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      contact: '/api/contact',
      categories: '/api/categories',
      articles: '/api/articles',
      tools: '/api/tools',
      pastPapers: '/api/past-papers',
    },
  });
});

// Centralized Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

// Port configuration
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`EduTools LK Backend server running on port ${PORT}`);
});
