// AUTH ROUTES USES THE CONTROLLERS DEFINED IN authController

const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

// localhost:5000/api/v1/auth... (BEFORE DEPLOYMENT ON LOCAL ENVIRONMENT)

router.post('/register', register);
router.post('/login', login);

module.exports = router;
