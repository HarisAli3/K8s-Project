const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const studentRoutes = require('./routes/students');
const errorHandler = require('./middleware/errorHandler');
const { pool } = require('./database/connection');

const app = express();
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';

// Trust proxy (required when running behind ingress/load balancer)
app.set('trust proxy', 1);

// Security middleware
app.use(helmet());

// Rate limiting - exclude health check endpoints
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for health check endpoints
    return req.path === '/health' || req.path === '/api/health';
  }
});
app.use(limiter);

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // Build allowed list from env or sensible defaults
    const rawEnv = process.env.CORS_ORIGIN;
    const allowedOrigins = rawEnv
      ? rawEnv.split(',').map((o) => o.trim())
      : ['http://localhost', 'http://localhost:3000', 'http://localhost:3001'];

    // Special-case: allow all if env contains "*"
    if (allowedOrigins.includes('*')) {
      return callback(null, true);
    }

    // Accept variations of localhost with/without port
    const normalizedOrigin = origin.replace(/\/$/, '');
    const isAllowed = allowedOrigins.some((o) => o.replace(/\/$/, '') === normalizedOrigin);

    if (isAllowed) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin, 'Allowed:', allowedOrigins);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};

app.use(cors(corsOptions));
// Handle CORS preflight for all routes
app.options('*', cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint with database connectivity check
app.get('/health', async (req, res) => {
  try {
    // Test database connection
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    
    // Check pool status
    const poolStatus = {
      totalCount: pool.totalCount,
      idleCount: pool.idleCount,
      waitingCount: pool.waitingCount
    };
    
    res.json({
      success: true,
      message: 'Server is running and database is connected',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      database: 'connected',
      poolStatus: poolStatus
    });
  } catch (error) {
    console.error('Health check failed - Database connection error:', error.message);
    
    // Check if it's a connection error vs other database errors
    const isConnectionError = error.code === 'ECONNREFUSED' || 
                             error.code === 'ENOTFOUND' || 
                             error.message.includes('connection') ||
                             error.message.includes('timeout');
    
    res.status(503).json({
      success: false,
      message: isConnectionError ? 'Server is running but database is not accessible' : 'Server is running but database has errors',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      database: 'disconnected',
      error: error.message,
      errorCode: error.code,
      isConnectionError: isConnectionError
    });
  }
});

// API root - helpful for ingress path `/api`
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'API root',
    endpoints: ['/api/students', '/api/health']
  });
});

// API health under `/api` prefix (useful when exposed via ingress `/api`)
app.get('/api/health', async (req, res) => {
  try {
    // Test database connection
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    
    // Check pool status
    const poolStatus = {
      totalCount: pool.totalCount,
      idleCount: pool.idleCount,
      waitingCount: pool.waitingCount
    };
    
    res.json({
      success: true,
      message: 'Server is running and database is connected',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      database: 'connected',
      poolStatus: poolStatus
    });
  } catch (error) {
    console.error('API health check failed - Database connection error:', error.message);
    
    // Check if it's a connection error vs other database errors
    const isConnectionError = error.code === 'ECONNREFUSED' || 
                             error.code === 'ENOTFOUND' || 
                             error.message.includes('connection') ||
                             error.message.includes('timeout');
    
    res.status(503).json({
      success: false,
      message: isConnectionError ? 'Server is running but database is not accessible' : 'Server is running but database has errors',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      database: 'disconnected',
      error: error.message,
      errorCode: error.code,
      isConnectionError: isConnectionError
    });
  }
});

// API routes
app.use('/api/students', studentRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, HOST, () => {
  console.log(`🚀 Server running on ${HOST}:${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://${HOST}:${PORT}/health`);
  console.log(`🌐 Accessible from: http://0.0.0.0:${PORT}`);
});

module.exports = app;
