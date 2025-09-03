const http = require('http');
const { testConnection } = require('./database/connection');

// Database connection test
const testDatabaseConnection = async () => {
  try {
    const result = await testConnection();
    if (result) {
      console.log('Database connection test: SUCCESS');
      return true;
    } else {
      console.log('Database connection test: FAILED');
      return false;
    }
  } catch (error) {
    console.error('Database connection test: FAILED -', error.message);
    return false;
  }
};

// HTTP health check
const testHttpHealth = () => {
  return new Promise((resolve) => {
    const options = {
      host: 'localhost',
      port: process.env.PORT || 5000,
      path: '/health',
      timeout: 5000
    };

    const request = http.request(options, (res) => {
      console.log(`HTTP health check status: ${res.statusCode}`);
      if (res.statusCode === 200) {
        resolve(true);
      } else {
        resolve(false);
      }
    });

    request.on('error', (err) => {
      console.log('HTTP health check failed:', err.message);
      resolve(false);
    });

    request.on('timeout', () => {
      console.log('HTTP health check timeout');
      request.destroy();
      resolve(false);
    });

    request.end();
  });
};

// Main health check function
const runHealthCheck = async () => {
  try {
    // Test HTTP health first
    const httpHealthy = await testHttpHealth();
    if (!httpHealthy) {
      console.log('Health check failed: HTTP endpoint not responding');
      process.exit(1);
    }

    // Test database connection
    const dbHealthy = await testDatabaseConnection();
    if (!dbHealthy) {
      console.log('Health check failed: Database not accessible');
      process.exit(1);
    }

    console.log('Health check passed: Both HTTP and database are healthy');
    process.exit(0);
  } catch (error) {
    console.error('Health check error:', error.message);
    process.exit(1);
  }
};

// Run health check
runHealthCheck();
