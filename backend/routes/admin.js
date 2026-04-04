const router = require('express').Router();
const db = require('../db');
const { authenticate, adminOnly } = require('../middleware/auth');

// Dashboard stats
router.get('/dashboard', authenticate, async (req, res) => {
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

// Get all onboarding requests
router.get('/onboarding', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM onboarding_requests ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch requests' });
  }
});

// Approve onboarding request
router.put('/onboarding/:id/approve', async (req, res) => {
  try {
    const { id } = req.params;
    const request = await db.query('SELECT * FROM onboarding_requests WHERE id = $1', [id]);
    if (request.rows.length === 0) return res.status(404).json({ error: 'Request not found' });

    const r = request.rows[0];

    // Create supplier if not exists
    let supplier = await db.query('SELECT * FROM suppliers WHERE phone = $1', [r.driver_phone]);
    if (supplier.rows.length === 0) {
      supplier = await db.query(
        'INSERT INTO suppliers (phone, name, is_verified) VALUES ($1, $2, true) RETURNING *',
        [r.driver_phone, r.owner_name]
      );
    }

    // Create vehicle
    const mandi = await db.query('SELECT id FROM mandis WHERE name = $1', [r.mandi]);
    const mandiId = mandi.rows.length > 0 ? mandi.rows[0].id : 1;

    await db.query(
      `INSERT INTO vehicles (registration_number, vehicle_type, gross_weight_tonnes, driver_name, driver_phone, owner_name, owner_phone, mandi_id, supplier_id, parivahan_verified, parivahan_data)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) ON CONFLICT (registration_number) DO NOTHING`,
      [r.registration_number, 'Tata Signa', r.gross_weight_tonnes || 40, r.driver_name, r.driver_phone, r.owner_name, r.owner_phone, mandiId, supplier.rows[0].id, r.parivahan_verified, r.parivahan_data]
    );

    await db.query("UPDATE onboarding_requests SET status = 'approved', updated_at = NOW() WHERE id = $1", [id]);
    res.json({ success: true, message: 'Request approved' });
  } catch (e) {
    console.error('Approve error:', e);
    res.status(500).json({ error: 'Failed to approve' });
  }
});

// Reject onboarding request
router.put('/onboarding/:id/reject', async (req, res) => {
  try {
    await db.query("UPDATE onboarding_requests SET status = 'rejected', updated_at = NOW() WHERE id = $1", [req.params.id]);
    res.json({ success: true, message: 'Request rejected' });
  } catch (e) {
    res.status(500).json({ error: 'Failed to reject' });
  }
});

// Price history
router.get('/price-history', authenticate, async (req, res) => {
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
