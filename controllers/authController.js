const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthenticatedError } = require('../errors');

const register = async (req, res) => {
  res.send('registering user');
};

const login = async (req, res) => {
  res.send('logging in');
};

module.exports = { register, login };
