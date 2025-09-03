const { Pool } = require('pg');
require('dotenv').config();

// Get database configuration from environment variables with fallbacks
const getDbConfig = () => {
  return {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME || 'student_management',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    max: parseInt(process.env.DB_MAX_CONNECTIONS) || 20,
    idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT) || 30000,
    connectionTimeoutMillis: parseInt(process.env.DB_CONNECTION_TIMEOUT) || 2000,
    // Add retry configuration for better resilience
    retryDelay: parseInt(process.env.DB_RETRY_DELAY) || 1000,
    maxRetries: parseInt(process.env.DB_MAX_RETRIES) || 3,
  };
};

const dbConfig = getDbConfig();

console.log('Database Configuration:', {
  host: dbConfig.host,
  port: dbConfig.port,
  database: dbConfig.database,
  user: dbConfig.user,
  maxConnections: dbConfig.max
});

const pool = new Pool(dbConfig);

// Test the connection
pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  // Don't exit the process immediately, let the health check handle it
  // process.exit(-1);
});

// Add a method to test database connectivity
const testConnection = async () => {
  try {
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    return true;
  } catch (error) {
    console.error('Database connection test failed:', error.message);
    return false;
  }
};

module.exports = { pool, testConnection };
