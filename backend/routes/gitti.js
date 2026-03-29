const router = require('express').Router();
const db = require('../db');
const { authenticate } = require('../middleware/auth');

// Get all gitti listings (public)
router.get('/', async (req, res) => {
  try {
    const { size, crusher } = req.query;
    let q = `SELECT g.*, v.registration_number, v.gross_weight_tonnes, v.driver_phone, v.owner_phone, v.driver_name, v.owner_name, v.availability as vehicle_availability
             FROM gitti_listings g
             LEFT JOIN vehicles v ON g.vehicle_id = v.id
             WHERE 1=1`;
    const params = [];
    if (size) { params.push(size); q += ` AND g.size = $${params.length}`; }
    if (crusher) { params.push(crusher); q += ` AND g.crusher_name = $${params.length}`; }
    q += ' ORDER BY g.updated_at DESC';
    const result = await db.query(q, params);
    res.json(result.rows);
  } catch (e) {
    console.error('Get gitti error:', e);
    res.status(500).json({ error: 'Failed to fetch gitti listings' });
  }
});

// Get supplier's gitti listings
router.get('/my', authenticate, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT g.*, v.registration_number, v.gross_weight_tonnes, v.driver_phone, v.owner_phone
       FROM gitti_listings g
       LEFT JOIN vehicles v ON g.vehicle_id = v.id
       WHERE g.supplier_id = $1 ORDER BY g.updated_at DESC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch listings' });
  }
});

// Update gitti price (supplier only)
router.put('/:id/price', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { price_per_cft, gross_weight_tonnes } = req.body;

    // Verify ownership
    const listing = await db.query('SELECT * FROM gitti_listings WHERE id = $1 AND supplier_id = $2', [id, req.user.id]);
    if (listing.rows.length === 0) return res.status(403).json({ error: 'Not your listing' });

    const old = listing.rows[0];

    // Update price
    if (price_per_cft !== undefined) {
      await db.query('UPDATE gitti_listings SET price_per_cft = $1, updated_at = NOW() WHERE id = $2', [price_per_cft, id]);
      // Log price change
      await db.query(
        'INSERT INTO price_history (listing_type, listing_id, old_price, new_price, changed_by) VALUES ($1, $2, $3, $4, $5)',
        ['gitti', id, old.price_per_cft, price_per_cft, req.user.id]
      );
    }

    // Update vehicle tonnes if provided
    if (gross_weight_tonnes !== undefined && old.vehicle_id) {
      await db.query('UPDATE vehicles SET gross_weight_tonnes = $1, updated_at = NOW() WHERE id = $2', [gross_weight_tonnes, old.vehicle_id]);
    }

    const updated = await db.query(
      `SELECT g.*, v.registration_number, v.gross_weight_tonnes
       FROM gitti_listings g LEFT JOIN vehicles v ON g.vehicle_id = v.id WHERE g.id = $1`, [id]
    );
    res.json({ success: true, listing: updated.rows[0] });
  } catch (e) {
    console.error('Update gitti price error:', e);
    res.status(500).json({ error: 'Failed to update price' });
  }
});

// Create gitti listing (supplier)
router.post('/', authenticate, async (req, res) => {
  try {
    const { size, crusher_name, crusher_location, price_per_cft, vehicle_id } = req.body;
    const result = await db.query(
      `INSERT INTO gitti_listings (size, crusher_name, crusher_location, price_per_cft, vehicle_id, supplier_id)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [size, crusher_name, crusher_location, price_per_cft, vehicle_id, req.user.id]
    );
    res.status(201).json(result.rows[0]);
  } catch (e) {
    res.status(500).json({ error: 'Failed to create listing' });
  }
});

module.exports = router;
