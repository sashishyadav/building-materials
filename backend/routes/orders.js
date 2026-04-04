const router = require('express').Router();
const db = require('../db');

// Book an order (public)
router.post('/', async (req, res) => {
  try {
    const { listing_type, listing_id, customer_name, customer_phone, quantity, message } = req.body;
    if (!customer_phone || !listing_type || !listing_id) {
      return res.status(400).json({ error: 'listing_type, listing_id, customer_phone required' });
    }
    const result = await db.query(
      `INSERT INTO orders (listing_type, listing_id, customer_name, customer_phone, quantity, message)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [listing_type, listing_id, customer_name || null, customer_phone, quantity || null, message || null]
    );
    res.status(201).json({ success: true, order: result.rows[0] });
  } catch (e) {
    console.error('Order error:', e);
    res.status(500).json({ error: 'Failed to book order' });
  }
});

// Get all orders (admin)
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM orders ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Update order status (admin)
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    await db.query('UPDATE orders SET status = $1 WHERE id = $2', [status, req.params.id]);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: 'Failed to update order' });
  }
});

module.exports = router;
