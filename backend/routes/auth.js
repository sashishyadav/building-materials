const router = require('express').Router();
const jwt = require('jsonwebtoken');
const db = require('../db');

// Send OTP
router.post('/send-otp', async (req, res) => {
  try {
    const { phone, type } = req.body;
    if (!phone || phone.length !== 10) return res.status(400).json({ error: 'Valid 10-digit phone required' });

    const otp = String(Math.floor(1000 + Math.random() * 9000));
    const expiresAt = new Date(Date.now() + (process.env.OTP_EXPIRY_MINUTES || 3) * 60 * 1000);

    await db.query('DELETE FROM otps WHERE phone = $1', [phone]);
    await db.query('INSERT INTO otps (phone, otp, expires_at) VALUES ($1, $2, $3)', [phone, otp, expiresAt]);

    // TODO: Integrate real SMS (MSG91/Twilio)
    // For now, return OTP in response (remove in production)
    console.log(`OTP for ${phone}: ${otp}`);

    res.json({ 
      success: true, 
      message: 'OTP sent successfully',
      otp, // Remove this in production
      expires_in: (process.env.OTP_EXPIRY_MINUTES || 3) * 60
    });
  } catch (e) {
    console.error('Send OTP error:', e);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});

// Verify OTP & Login
router.post('/verify-otp', async (req, res) => {
  try {
    const { phone, otp, type } = req.body;
    if (!phone || !otp) return res.status(400).json({ error: 'Phone and OTP required' });

    const result = await db.query(
      'SELECT * FROM otps WHERE phone = $1 AND otp = $2 AND expires_at > NOW() AND verified = false ORDER BY created_at DESC LIMIT 1',
      [phone, otp]
    );

    if (result.rows.length === 0) return res.status(400).json({ error: 'Invalid or expired OTP' });

    await db.query('UPDATE otps SET verified = true WHERE id = $1', [result.rows[0].id]);

    // Find or create supplier
    let supplier = await db.query('SELECT * FROM suppliers WHERE phone = $1', [phone]);
    if (supplier.rows.length === 0) {
      supplier = await db.query(
        'INSERT INTO suppliers (phone, type) VALUES ($1, $2) RETURNING *',
        [phone, type || 'supplier']
      );
    }

    const user = supplier.rows[0];
    const token = jwt.sign(
      { id: user.id, phone: user.phone, type: user.type, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      user: { id: user.id, phone: user.phone, name: user.name, type: user.type }
    });
  } catch (e) {
    console.error('Verify OTP error:', e);
    res.status(500).json({ error: 'Verification failed' });
  }
});

// Get current user profile
router.get('/me', require('../middleware/auth').authenticate, async (req, res) => {
  try {
    const result = await db.query('SELECT id, phone, name, type, is_verified, created_at FROM suppliers WHERE id = $1', [req.user.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json(result.rows[0]);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

module.exports = router;
