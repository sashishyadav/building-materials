const router = require('express').Router();
const db = require('../db');

// Submit onboarding request (public)
router.post('/', async (req, res) => {
  try {
    const { owner_name, driver_name, driver_phone, owner_phone, registration_number,
            gross_weight_tonnes, product_type, product_variant, price,
            source_location, mandi, parivahan_verified, parivahan_data } = req.body;

    if (!owner_name || !driver_phone || !registration_number) {
      return res.status(400).json({ error: 'owner_name, driver_phone, registration_number required' });
    }

    const result = await db.query(
      `INSERT INTO onboarding_requests 
       (owner_name, driver_name, driver_phone, owner_phone, registration_number,
        gross_weight_tonnes, product_type, product_variant, price,
        source_location, mandi, parivahan_verified, parivahan_data)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *`,
      [owner_name, driver_name, driver_phone, owner_phone, registration_number,
       gross_weight_tonnes, product_type, product_variant, price,
       source_location, mandi, parivahan_verified || false, parivahan_data || null]
    );

    res.status(201).json({ success: true, request: result.rows[0] });
  } catch (e) {
    console.error('Onboarding error:', e);
    res.status(500).json({ error: 'Failed to submit request' });
  }
});

// Verify vehicle with Parivahan (simulated)
router.post('/verify-vehicle', async (req, res) => {
  try {
    const { registration_number } = req.body;
    if (!registration_number) return res.status(400).json({ error: 'Registration number required' });

    const reg = registration_number.replace(/\s/g, '').toUpperCase();

    // Simulated Parivahan DB — replace with real API in production
    const PARIVAHAN_DB = {
      'BR28GB8126': { owner: 'Rajan', vehicle_type: 'Tata Signa 4923.S', fuel: 'Diesel', rto: 'BR28 - Sasaram', status: 'Active', fitness_upto: '2027-03-14' },
      'UP45AT9694': { owner: 'Ram Kumar', vehicle_type: 'Tata Signa 4923.S', fuel: 'Diesel', rto: 'UP45 - Faizabad', status: 'Active', fitness_upto: '2026-08-21' },
      'UP45AT7064': { owner: 'Raj Bhadur', vehicle_type: 'Tata Signa 4923.S', fuel: 'Diesel', rto: 'UP45 - Faizabad', status: 'Active', fitness_upto: '2028-01-09' },
      'UP42TC0135': { owner: 'Prayag Udyog Pvt Ltd', vehicle_type: 'Tata Signa 4825.TK', fuel: 'Diesel', rto: 'UP42 - Ambedkar Nagar', status: 'Active', fitness_upto: '2029-02-19' },
    };

    // Simulate API delay
    await new Promise(r => setTimeout(r, 1000));

    const data = PARIVAHAN_DB[reg];
    if (data) {
      res.json({ verified: true, data });
    } else {
      res.json({ verified: false, error: 'Vehicle not found in Parivahan database' });
    }
  } catch (e) {
    res.status(500).json({ error: 'Verification failed' });
  }
});

module.exports = router;
