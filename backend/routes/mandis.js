const router = require('express').Router();
const db = require('../db');

// Get all mandis with vehicle counts
router.get('/', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT m.*, COUNT(v.id)::int as vehicle_count
       FROM mandis m LEFT JOIN vehicles v ON v.mandi_id = m.id
       GROUP BY m.id ORDER BY m.name`
    );
    res.json(result.rows);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch mandis' });
  }
});

// Get single mandi with vehicles and loads
router.get('/:slug', async (req, res) => {
  try {
    const mandi = await db.query('SELECT * FROM mandis WHERE slug = $1', [req.params.slug]);
    if (mandi.rows.length === 0) return res.status(404).json({ error: 'Mandi not found' });

    const vehicles = await db.query(
      `SELECT v.* FROM vehicles v WHERE v.mandi_id = $1`, [mandi.rows[0].id]
    );

    const result = [];
    for (const v of vehicles.rows) {
      const gitti = await db.query('SELECT * FROM gitti_listings WHERE vehicle_id = $1', [v.id]);
      const morang = await db.query('SELECT * FROM morang_listings WHERE vehicle_id = $1', [v.id]);
      result.push({ ...v, gitti: gitti.rows, morang: morang.rows });
    }

    res.json({ mandi: mandi.rows[0], vehicles: result });
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch mandi' });
  }
});

module.exports = router;
