const router = require('express').Router();
const db = require('../db');
const { authenticate } = require('../middleware/auth');

// Get all morang listings (public)
router.get('/', async (req, res) => {
  try {
    const { type } = req.query;
    let q = `SELECT m.*, v.registration_number, v.gross_weight_tonnes, v.driver_phone, v.owner_phone, v.driver_name, v.owner_name, v.availability as vehicle_availability
             FROM morang_listings m
             LEFT JOIN vehicles v ON m.vehicle_id = v.id
             WHERE 1=1`;
    const params = [];
    if (type) { params.push(type); q += ` AND m.type = $${params.length}`; }
    q += ' ORDER BY m.updated_at DESC';
    const result = await db.query(q, params);
    res.json(result.rows);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch morang listings' });
  }
});

// Get supplier's morang listings
router.get('/my', authenticate, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT m.*, v.registration_number, v.gross_weight_tonnes, v.driver_phone, v.owner_phone
       FROM morang_listings m
       LEFT JOIN vehicles v ON m.vehicle_id = v.id
       WHERE m.supplier_id = $1 ORDER BY m.updated_at DESC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch listings' });
  }
});

// Update morang price (supplier only)
router.put('/:id/price', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { price_per_tonne, gross_weight_tonnes } = req.body;

    const listing = await db.query('SELECT * FROM morang_listings WHERE id = $1 AND supplier_id = $2', [id, req.user.id]);
    if (listing.rows.length === 0) return res.status(403).json({ error: 'Not your listing' });

    const old = listing.rows[0];

    // Rate limit: max 3 price changes per 24h per listing
    if (price_per_tonne !== undefined) {
      const last24h = new Date(Date.now() - 86400000);
      const rateCheck = await db.query(
        `SELECT COUNT(*)::int as count FROM price_history WHERE listing_type = 'morang' AND listing_id = $1 AND created_at > $2`,
        [id, last24h]
      );
      if (rateCheck.rows[0].count >= 3) {
        return res.status(429).json({ error: 'Price can only be changed 3 times in 24 hours' });
      }
    }

    if (price_per_tonne !== undefined) {
      await db.query('UPDATE morang_listings SET price_per_tonne = $1, updated_at = NOW() WHERE id = $2', [price_per_tonne, id]);
      await db.query(
        'INSERT INTO price_history (listing_type, listing_id, old_price, new_price, changed_by) VALUES ($1, $2, $3, $4, $5)',
        ['morang', id, old.price_per_tonne, price_per_tonne, req.user.id]
      );
    }

    if (gross_weight_tonnes !== undefined && old.vehicle_id) {
      await db.query('UPDATE vehicles SET gross_weight_tonnes = $1, updated_at = NOW() WHERE id = $2', [gross_weight_tonnes, old.vehicle_id]);
    }

    const updated = await db.query(
      `SELECT m.*, v.registration_number, v.gross_weight_tonnes
       FROM morang_listings m LEFT JOIN vehicles v ON m.vehicle_id = v.id WHERE m.id = $1`, [id]
    );
    res.json({ success: true, listing: updated.rows[0] });
  } catch (e) {
    res.status(500).json({ error: 'Failed to update price' });
  }
});

// Create morang listing
router.post('/', authenticate, async (req, res) => {
  try {
    const { type, use_case, source_location, price_per_tonne, vehicle_id } = req.body;
    const result = await db.query(
      `INSERT INTO morang_listings (type, use_case, source_location, price_per_tonne, vehicle_id, supplier_id)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [type, use_case, source_location, price_per_tonne, vehicle_id, req.user.id]
    );
    res.status(201).json(result.rows[0]);
  } catch (e) {
    res.status(500).json({ error: 'Failed to create listing' });
  }
});

module.exports = router;
