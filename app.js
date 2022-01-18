const express = require('express');
const mongoose = require('mongoose');
const app = express();
require('dotenv').config();

const port = process.env.PORT || 5000;

app.use(express.json());

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    app.listen(port, () => console.log(`Server is listening on port ${port}`));
  } catch (error) {
    console.log(error);
  }
};

start();
