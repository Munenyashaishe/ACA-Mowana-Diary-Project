// AUTH ROUTES USES THE CONTROLLERS DEFINED IN authController

const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const User = require('../models/User');

// localhost:5000/api/v1/auth... (BEFORE DEPLOYMENT ON LOCAL ENVIRONMENT)

router.post('/register', register);
router.post('/login', login);

router.get('/users', async (req, res) => {
  const users = await User.find({});
  res.status(200).json({ users });
});

module.exports = router;
