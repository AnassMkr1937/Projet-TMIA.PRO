const express = require('express');
const cors = require('cors');
const scoring = require('./scoring');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const Result = require('./models/Result');
require('dotenv').config();

const PORT = process.env.PORT || 4000;

const app = express();

// Configure CORS to accept requests from frontend domain(s)
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (e.g. mobile apps, curl)
        if (!origin) return callback(null, true);
        const allowed = [FRONTEND_URL, 'http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:5173'];
        if (allowed.indexOf(origin) !== -1) callback(null, true);
        else callback(new Error('Not allowed by CORS'));
    }
};

app.use(cors(corsOptions));
app.use(express.json());

// MongoDB connection (if MONGO_URI provided)
const MONGO_URI = process.env.MONGO_URI;
let dbConnected = false;
if (MONGO_URI) {
    mongoose.connect(MONGO_URI)
        .then(() => {
            dbConnected = true;
            console.log('✅ Connected to MongoDB');
        })
        .catch(err => {
            console.error('❌ MongoDB connection error:', err.message);
        });
} else {
    console.warn('⚠️  No MONGO_URI provided. Running in demo in-memory mode.');
}

// In-memory fallback (keeps behavior for local/dev when no DB)
let MEMORY_DB = [];

// Vérification de santé
app.get('/api/health', (req, res) => res.json({ ok: true, mode: dbConnected ? 'mongo' : 'demo' }));

// Recevoir une réponse
app.post('/api/submit', async (req, res) => {
    try {
        const payload = req.body;

        // 1. Calculer le score via votre intelligence (scoring.js)
        const result = scoring.computeFinalScore(payload);

        // 2. Persist into MongoDB if available, otherwise memory
        const doc = {
            persona: result.persona,
            confidence: result.confidence,
            scores: result.scores,
            normalized: result.normalized || null,
            marketSegment: result.marketSegment || null,
            recommendation: result.recommendation || null,
            metadata: result.metadata || {},
            payload: payload || {}
        };

        if (dbConnected) {
            const r = new Result(doc);
            await r.save();
            console.log(`✅ Nouvelle réponse reçue : ${result.persona} (Stockée en MongoDB)`);
        } else {
            const savedRecord = Object.assign({ id: Date.now(), createdAt: new Date() }, doc);
            MEMORY_DB.push(savedRecord);
            console.log(`✅ Nouvelle réponse reçue : ${result.persona} (Stockée en RAM)`);
        }

        res.json({ ok: true, result });
    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false, error: err.message });
    }
});

// Admin : Statistiques (lecture depuis la mémoire)
app.get('/api/admin/stats', async (req, res) => {
    try {
        if (dbConnected) {
            // Group by persona using MongoDB aggregation
            const agg = await Result.aggregate([
                { $group: { _id: '$persona', count: { $sum: 1 } } },
                { $sort: { count: -1 } }
            ]);
            const total = agg.reduce((s, a) => s + a.count, 0);
            return res.json({ ok: true, total, distribution: agg });
        }

        // Fallback to memory
        const total = MEMORY_DB.length;
        const distribution = {};
        MEMORY_DB.forEach(doc => {
            const p = doc.persona || (doc.result && doc.result.persona);
            distribution[p] = (distribution[p] || 0) + 1;
        });
        const agg = Object.keys(distribution).map(key => ({ _id: key, count: distribution[key] }));
        res.json({ ok: true, total, distribution: agg });
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message });
    }
});

// Serve static frontend build if it exists (so visiting backend root shows the frontend)
const FRONT_DIST = path.join(__dirname, '..', 'frontend', 'dist');
if (fs.existsSync(FRONT_DIST)) {
    const FRONT_INDEX = path.join(FRONT_DIST, 'index.html');
    let frontHtml = null;
    try {
        frontHtml = fs.readFileSync(FRONT_INDEX, 'utf8');
    } catch (e) {
        console.warn('Could not read index.html into memory, will fallback to sendFile', e.message);
    }

    app.use(express.static(FRONT_DIST));

    // Ensure GET / is explicitly handled (helps when proxies or other servers are involved)
    app.get('/', (req, res) => {
        console.log('[frontend-root] GET /');
        if (frontHtml) return res.type('html').send(frontHtml);
        const file = FRONT_INDEX;
        if (fs.existsSync(file)) return res.sendFile(file);
        res.status(404).send('Frontend index not found');
    });

    // Catch-all middleware: forward non-/api requests to frontend index.html
    app.use((req, res, next) => {
        console.log('[frontend-middleware] incoming request:', req.method, req.path);
        if (req.path.startsWith('/api')) return next();
        if (frontHtml) return res.type('html').send(frontHtml);
        const file = FRONT_INDEX;
        if (fs.existsSync(file)) return res.sendFile(file);
        res.status(404).send('Frontend index not found');
    });
    console.log(`✅ Serving frontend from ${FRONT_DIST}`);
} else {
    // Helpful root route for developers who forgot to build or start the frontend
    app.get('/', (req, res) => {
        res.send(`Frontend not found on server. Start the dev server with \`cd frontend && npm run dev\` or build the frontend (\`npm run build\`) to generate \`frontend/dist\`.`);
    });
}

app.listen(PORT, () => console.log(`🚀 Serveur (Mode Démo) prêt sur http://localhost:${PORT}`));
