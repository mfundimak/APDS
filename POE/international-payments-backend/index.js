// index.js
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const helmet = require('helmet');
const { check, validationResult } = require('express-validator');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// User schema and model
const UserSchema = new mongoose.Schema({
  fullName: String,
  idNumber: String,
  accountNumber: { type: String, unique: true }, // Ensure account numbers are unique
  password: String
});

const User = mongoose.model('User', UserSchema);

// Payment schema and model
const PaymentSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  amount: Number,
  currency: String,
  swiftCode: String,
  recipientAccount: String,
  status: { type: String, default: 'pending' }, // Add a status field for payment tracking
});

const Payment = mongoose.model('Payment', PaymentSchema);

// Middleware to verify JWT
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1]; // Bearer token
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user data to request
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Register route
app.post('/api/register', [
  check('fullName').isAlpha().withMessage('Full Name should only contain letters'),
  check('idNumber').isNumeric().withMessage('ID should be numeric'),
  check('accountNumber').isNumeric().withMessage('Account Number should be numeric'),
  check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { fullName, idNumber, accountNumber, password } = req.body;

  try {
    // Hash password with salt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      idNumber,
      accountNumber,
      password: hashedPassword
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Login route
app.post('/api/login', async (req, res) => {
  const { accountNumber, password } = req.body;

  try {
    const user = await User.findOne({ accountNumber });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create Payment route
app.post('/api/payments', authMiddleware, [
  check('amount').isNumeric().withMessage('Amount should be a number'),
  check('currency').isString().withMessage('Currency should be a string'),
  check('swiftCode').isString().withMessage('SWIFT Code should be a string'),
  check('recipientAccount').isString().withMessage('Recipient Account should be a string'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { amount, currency, swiftCode, recipientAccount } = req.body;

  try {
    const newPayment = new Payment({
      customerId: req.user.userId, // Associate the payment with the logged-in user
      amount,
      currency,
      swiftCode,
      recipientAccount,
    });

    await newPayment.save();
    res.status(201).json({ message: 'Payment created successfully', payment: newPayment });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get Pending Payments route
app.get('/api/payments', authMiddleware, async (req, res) => {
  try {
    const payments = await Payment.find({ customerId: req.user.userId, status: 'pending' }).populate('customerId');
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Verify Payment route
app.put('/api/payments/verify/:id', authMiddleware, async (req, res) => {
  try {
    const payment = await Payment.findByIdAndUpdate(req.params.id, { status: 'verified' }, { new: true });
    if (!payment) return res.status(404).json({ message: 'Payment not found' });

    res.json({ message: 'Payment verified successfully', payment });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Payment route (to be expanded)
app.post('/api/pay', (req, res) => {
  // Ensure proper validation and security practices
  res.json({ message: 'Payment processed' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

