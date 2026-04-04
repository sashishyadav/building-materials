const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const path = require('path');
const fs = require('fs');
const db = require('./db');
const authRoutes = require('./routes/auth');
const gittiRoutes = require('./routes/gitti');
const morangRoutes = require('./routes/morang');
const vehicleRoutes = require('./routes/vehicles');
const mandiRoutes = require('./routes/mandis');
const onboardingRoutes = require('./routes/onboarding');
const adminRoutes = require('./routes/admin');
const uploadsRoutes = require('./routes/uploads');

const UPLOAD_DIR = process.env.UPLOAD_DIR || '/app/uploads';
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const app = express();
const PORT = process.env.PORT || 4000;

app.use(helmet());
app.use(cors({ origin: '*' }));
app.use(express.json());

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 500 });
app.use(limiter);

app.get('/api/health', async (req, res) => {
  try {
    const r = await db.query('SELECT NOW()');
    res.json({ status: 'ok', db: 'connected', time: r.rows[0].now });
  } catch (e) {
    res.status(500).json({ status: 'error', db: 'disconnected', error: e.message });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/gitti', gittiRoutes);
app.use('/api/morang', morangRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/mandis', mandiRoutes);
app.use('/api/onboarding', onboardingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/uploads', uploadsRoutes);
app.use('/uploads', express.static(UPLOAD_DIR));

app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Building Materials API running on port ${PORT}`);
});
