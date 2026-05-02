const router = require('express').Router();
const db = require('../db');
const { authenticate } = require('../middleware/auth');

// Get all vehicles (public)
router.get('/', async (req, res) => {
  try {
    const { mandi } = req.query;
    let q = `SELECT v.*, m.name as mandi_name, m.district
             FROM vehicles v LEFT JOIN mandis m ON v.mandi_id = m.id WHERE 1=1`;
    const params = [];
    if (mandi) { params.push(mandi); q += ` AND m.name = $${params.length}`; }
    q += ' ORDER BY v.updated_at DESC';
    const result = await db.query(q, params);
    res.json(result.rows);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch vehicles' });
  }
});

// Get supplier's vehicles
router.get('/my', authenticate, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT v.*, m.name as mandi_name FROM vehicles v
       LEFT JOIN mandis m ON v.mandi_id = m.id
       WHERE v.supplier_id = $1 ORDER BY v.updated_at DESC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch vehicles' });
  }
});

// Update vehicle (supplier only)
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { gross_weight_tonnes, availability } = req.body;

    const vehicle = await db.query('SELECT * FROM vehicles WHERE id = $1 AND supplier_id = $2', [id, req.user.id]);
    if (vehicle.rows.length === 0) return res.status(403).json({ error: 'Not your vehicle' });

    const updates = [];
    const params = [];
    if (gross_weight_tonnes !== undefined) { params.push(gross_weight_tonnes); updates.push(`gross_weight_tonnes = $${params.length}`); }
    if (availability !== undefined) { params.push(availability); updates.push(`availability = $${params.length}`); }
    updates.push('updated_at = NOW()');
    params.push(id);

    await db.query(`UPDATE vehicles SET ${updates.join(', ')} WHERE id = $${params.length}`, params);

    const updated = await db.query('SELECT v.*, m.name as mandi_name FROM vehicles v LEFT JOIN mandis m ON v.mandi_id = m.id WHERE v.id = $1', [id]);
    res.json({ success: true, vehicle: updated.rows[0] });
  } catch (e) {
    res.status(500).json({ error: 'Failed to update vehicle' });
  }
});

// Delete vehicle (admin — removes vehicle and its listings)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM gitti_listings WHERE vehicle_id = $1', [id]);
    await db.query('DELETE FROM morang_listings WHERE vehicle_id = $1', [id]);
    await db.query('DELETE FROM vehicles WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (e) {
    console.error('Delete vehicle error:', e);
    res.status(500).json({ error: 'Failed to delete vehicle' });
  }
});

// Get vehicles by mandi with their loads
router.get('/by-mandi/:mandiName', async (req, res) => {
  try {
    const { mandiName } = req.params;
    const vehicles = await db.query(
      `SELECT v.*, m.name as mandi_name FROM vehicles v
       LEFT JOIN mandis m ON v.mandi_id = m.id WHERE m.name = $1`,
      [mandiName]
    );

    const result = [];
    for (const v of vehicles.rows) {
      const gitti = await db.query('SELECT * FROM gitti_listings WHERE vehicle_id = $1', [v.id]);
      const morang = await db.query('SELECT * FROM morang_listings WHERE vehicle_id = $1', [v.id]);
      result.push({ ...v, gitti: gitti.rows, morang: morang.rows });
    }
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch vehicles' });
  }
});

module.exports = router;
