const axios = require('axios');
const config = require('../src/config');

const FRONTEND_URL = config.baseUrl;
const BACKEND_URL = config.apiUrl.replace('/api', '');

async function checkFrontend() {
  try {
    const response = await axios.get(FRONTEND_URL);
    console.log('Frontend Status:', response.status === 200 ? 'OK' : 'ERROR');
    return response.status === 200;
  } catch (error) {
    console.error('Frontend Error:', error.message);
    return false;
  }
}

async function checkBackend() {
  try {
    const response = await axios.get(`${BACKEND_URL}/health`);
    console.log('Backend Status:', response.data.status);
    console.log('Backend Uptime:', response.data.uptime, 'seconds');
    return response.data.status === 'ok';
  } catch (error) {
    console.error('Backend Error:', error.message);
    return false;
  }
}

async function monitor() {
  console.log('Starting health check...');
  const frontendStatus = await checkFrontend();
  const backendStatus = await checkBackend();
  
  if (!frontendStatus || !backendStatus) {
    console.error('Health check failed!');
    // Here you could add notification logic (email, Slack, etc.)
  } else {
    console.log('All systems operational!');
  }
}

// Run every 5 minutes
monitor();
setInterval(monitor, 5 * 60 * 1000); 