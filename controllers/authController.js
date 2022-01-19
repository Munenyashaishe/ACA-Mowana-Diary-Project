/*
  THE CONTROLLER CLASS FOR THE AUTHENTICATION ROUTES.
  PROVIDES FUNCTIONALITY TO CREATE A NEW USER THROUGH REGISTERING THEM AND LOGGING THEM IN.
*/

const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthenticatedError } = require('../errors');

const register = async (req, res) => {
  const user = await User.create({ ...req.body });
  const token = user.createJWT(); // DEFINED AS A MONGOOSE INSTANCE METHOD INSIDE THE USER SCHEMA
  res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token }); // SENDING BACK THE NAME SHOULD WE NEED IT ON THE FRONT END
};

const login = async (req, res) => {
  const { email, password } = req.body;

  // CHECKS FOR EMPTY VALUES
  if (!email || !password) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: 'Please provide email and password' });
    return;
  }

  const user = await User.findOne({ email });

  // CHECKS TO SEE IF USER EMAIL MATCHES ANY IN DATABASE
  if (!user) {
    res.status(StatusCodes.UNAUTHORIZED).json({ msg: 'Invalid credentials' });
    return;
  }

  // DECRYPTS AND COMPARES HASHED PASSWORD
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    res.status(StatusCodes.UNAUTHORIZED).json({ msg: 'Invalid credentials' });
    return;
  }

  // IF SUCCEESSFUL, CREATE TOKEN AND SEND IT BACK
  const token = user.createJWT();
  res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
};

module.exports = { register, login };
