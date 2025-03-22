const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const app = express();
const port = process.env.PORT || 3001;

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? ['https://fish-fame.vercel.app', /\.vercel\.app$/]  // Update this with your actual frontend domain
    : 'http://localhost:8080',
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
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
}); 