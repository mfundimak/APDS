// routes/payments.js
const express = require('express');
const Payment = require('../models/Payment');

const router = express.Router();

// Get all payments
router.get('/', async (req, res) => {
  try {
    const payments = await Payment.find({ verified: false });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching payments' });
  }
});

// Verify Payment
router.put('/verify/:id', async (req, res) => {
  try {
    const payment = await Payment.findByIdAndUpdate(req.params.id, { verified: true }, { new: true });
    if (!payment) return res.status(404).json({ error: 'Payment not found' });
    
    res.json(payment);
  } catch (err) {
    res.status(500).json({ error: 'Error verifying payment' });
  }
});

module.exports = router;
