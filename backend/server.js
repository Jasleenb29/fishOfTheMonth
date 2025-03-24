const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const app = express();
const port = process.env.PORT || 3001;

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? ['https://fish-fame-c12ytl8fr-jasleens-projects-9f78d231.vercel.app', /\.vercel\.app$/]
    : ['http://localhost:8080', 'http://localhost:8081', 'http://localhost:8082', 'http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

const DB_FILE = path.join(__dirname, 'db.json');

// Initialize database file if it doesn't exist
async function initDB() {
    try {
        await fs.access(DB_FILE);
    } catch {
        await fs.writeFile(DB_FILE, JSON.stringify({ sessions: {}, nominations: {} }));
    }
}

// Read database
async function readDB() {
    const data = await fs.readFile(DB_FILE, 'utf8');
    return JSON.parse(data);
}

// Write to database
async function writeDB(data) {
    await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2));
}

// Health check endpoint with detailed status
app.get('/health', (req, res) => {
  const healthcheck = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    memory: process.memoryUsage(),
    version: process.env.npm_package_version || '1.0.0'
  };
  
  try {
    res.status(200).json(healthcheck);
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Create a new session
app.post('/api/sessions', async (req, res) => {
    try {
        const { hostName, sessionId } = req.body;
        const db = await readDB();
        
        db.sessions[sessionId] = {
            hostName,
            createdAt: new Date().toISOString(),
            isActive: true
        };
        
        await writeDB(db);
        res.json({ success: true, sessionId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get session details
app.get('/api/sessions/:sessionId', async (req, res) => {
    try {
        const { sessionId } = req.params;
        const db = await readDB();
        
        if (!db.sessions[sessionId]) {
            return res.status(404).json({ error: 'Session not found' });
        }
        
        res.json(db.sessions[sessionId]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Submit nomination
app.post('/api/nominations', async (req, res) => {
    try {
        const { sessionId, nominatorName, nomineeName, reason } = req.body;
        const db = await readDB();
        
        if (!db.sessions[sessionId]) {
            return res.status(404).json({ error: 'Session not found' });
        }
        
        if (!db.nominations[sessionId]) {
            db.nominations[sessionId] = [];
        }
        
        db.nominations[sessionId].push({
            nominatorName,
            nomineeName,
            reason,
            timestamp: new Date().toISOString()
        });
        
        await writeDB(db);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get session results
app.get('/api/results/:sessionId', async (req, res) => {
    try {
        const { sessionId } = req.params;
        const db = await readDB();
        
        if (!db.sessions[sessionId]) {
            return res.status(404).json({ error: 'Session not found' });
        }
        
        const nominations = db.nominations[sessionId] || [];
        res.json(nominations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Close session
app.post('/api/sessions/:sessionId/close', async (req, res) => {
    try {
        const { sessionId } = req.params;
        const db = await readDB();
        
        if (!db.sessions[sessionId]) {
            return res.status(404).json({ error: 'Session not found' });
        }
        
        db.sessions[sessionId].isActive = false;
        await writeDB(db);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

initDB().then(() => {
    app.listen(port, '0.0.0.0', () => {
        console.log(`Server running at http://localhost:${port}`);
    });
}); 