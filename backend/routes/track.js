const router = require('express').Router();
const db = require('../db');

// Track a page view (public)
router.post('/', async (req, res) => {
  try {
    const { page } = req.body;
    await db.query('INSERT INTO page_views (page) VALUES ($1)', [page || 'home']);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: 'Failed to track' });
  }
});

// Get visit analytics (admin)
router.get('/stats', async (req, res) => {
  try {
    const [total, today, byPage] = await Promise.all([
      db.query('SELECT COUNT(*)::int as count FROM page_views'),
      db.query("SELECT COUNT(*)::int as count FROM page_views WHERE viewed_at > NOW() - INTERVAL '24 hours'"),
      db.query('SELECT page, COUNT(*)::int as count FROM page_views GROUP BY page ORDER BY count DESC LIMIT 10'),
    ]);
    res.json({ total: total.rows[0].count, today: today.rows[0].count, by_page: byPage.rows });
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

module.exports = router;
