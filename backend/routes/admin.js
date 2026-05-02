const router = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const rateLimit = require('express-rate-limit');
const db = require('../db');
const { authenticate, adminOnly } = require('../middleware/auth');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Too many login attempts. Try again after 15 minutes.' }
});

router.post('/login', loginLimiter, async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    if (username !== process.env.ADMIN_USERNAME) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const valid = await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { username, type: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ success: true, token, user: { username, type: 'admin' } });
  } catch (e) {
    console.error('Admin login error:', e);
    res.status(500).json({ error: 'Login failed' });
  }
});

router.get('/verify', authenticate, adminOnly, (req, res) => {
  res.json({ valid: true, user: req.user });
});

router.get('/dashboard', authenticate, adminOnly, async (req, res) => {
  try {
    const [gitti, morang, vehicles, mandis, pending] = await Promise.all([
      db.query('SELECT COUNT(*)::int as count FROM gitti_listings'),
      db.query('SELECT COUNT(*)::int as count FROM morang_listings'),
      db.query('SELECT COUNT(*)::int as count FROM vehicles'),
      db.query('SELECT COUNT(*)::int as count FROM mandis'),
      db.query("SELECT COUNT(*)::int as count FROM onboarding_requests WHERE status = 'pending'"),
    ]);
    res.json({
      gitti: gitti.rows[0].count,
      morang: morang.rows[0].count,
      vehicles: vehicles.rows[0].count,
      mandis: mandis.rows[0].count,
      pending: pending.rows[0].count,
    });
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

router.get('/onboarding', authenticate, adminOnly, async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM onboarding_requests ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch requests' });
  }
});

router.put('/onboarding/:id/approve', authenticate, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const request = await db.query('SELECT * FROM onboarding_requests WHERE id = $1', [id]);
    if (request.rows.length === 0) return res.status(404).json({ error: 'Request not found' });

    const r = request.rows[0];

    let supplier = await db.query('SELECT * FROM suppliers WHERE phone = $1', [r.driver_phone]);
    if (supplier.rows.length === 0) {
      supplier = await db.query(
        'INSERT INTO suppliers (phone, name, is_verified) VALUES ($1, $2, true) RETURNING *',
        [r.driver_phone, r.owner_name]
      );
    }

    const mandi = await db.query('SELECT id FROM mandis WHERE name = $1', [r.mandi]);
    const mandiId = mandi.rows.length > 0 ? mandi.rows[0].id : 1;

    const vehicleInsert = await db.query(
      `INSERT INTO vehicles (registration_number, vehicle_type, gross_weight_tonnes, driver_name, driver_phone, owner_name, owner_phone, mandi_id, supplier_id, parivahan_verified, parivahan_data, image_url)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) ON CONFLICT (registration_number) DO UPDATE SET updated_at = NOW() RETURNING id`,
      [r.registration_number, 'Tata Signa', r.gross_weight_tonnes || 40, r.driver_name, r.driver_phone, r.owner_name, r.owner_phone, mandiId, supplier.rows[0].id, r.parivahan_verified, r.parivahan_data, r.image_url || null]
    );
    const vehicleId = vehicleInsert.rows[0].id;

    if (r.product_type === 'gitti') {
      await db.query(
        `INSERT INTO gitti_listings (size, crusher_name, crusher_location, price_per_cft, vehicle_id, supplier_id)
         VALUES ($1,$2,$3,$4,$5,$6) ON CONFLICT DO NOTHING`,
        [r.product_variant || '12mm (Half-Inch)', r.source_location || 'Local', r.source_location || 'Local', r.price || 50, vehicleId, supplier.rows[0].id]
      );
    } else if (r.product_type === 'morang') {
      await db.query(
        `INSERT INTO morang_listings (type, use_case, source_location, price_per_tonne, vehicle_id, supplier_id)
         VALUES ($1,$2,$3,$4,$5,$6)`,
        [r.product_variant || 'mota', 'General use', r.source_location || 'Local', r.price || 1200, vehicleId, supplier.rows[0].id]
      );
    }

    await db.query("UPDATE onboarding_requests SET status = 'approved', updated_at = NOW() WHERE id = $1", [id]);
    res.json({ success: true, message: 'Request approved' });
  } catch (e) {
    console.error('Approve error:', e);
    res.status(500).json({ error: 'Failed to approve' });
  }
});

router.put('/onboarding/:id/reject', authenticate, adminOnly, async (req, res) => {
  try {
    await db.query("UPDATE onboarding_requests SET status = 'rejected', updated_at = NOW() WHERE id = $1", [req.params.id]);
    res.json({ success: true, message: 'Request rejected' });
  } catch (e) {
    res.status(500).json({ error: 'Failed to reject' });
  }
});

router.get('/price-history', authenticate, adminOnly, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT ph.*, s.name as changed_by_name, s.phone as changed_by_phone
       FROM price_history ph LEFT JOIN suppliers s ON ph.changed_by = s.id
       ORDER BY ph.created_at DESC LIMIT 100`
    );
    res.json(result.rows);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

module.exports = router;
