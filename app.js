const express = require('express');
const mongoose = require('mongoose');
const app = express();
require('dotenv').config();

// ROUTERS
const authRouter = require('./routes/authRoutes');
const entriesRouter = require('./routes/entryRoutes');

app.use(express.json());

// ROUTES
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/entries', entriesRouter);

const port = process.env.PORT || 5000;
const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    app.listen(port, () => console.log(`Server is listening on port ${port}`));
  } catch (error) {
    console.log(error);
  }
};

start();
