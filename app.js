require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();

// ROUTERS
const authRouter = require('./routes/authRoutes');
const entriesRouter = require('./routes/entryRoutes');

const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
const authenticationMiddleware = require('./middleware/authentication');
const res = require('express/lib/response');

app.use(express.static('./public'));
app.use(express.json());

// ROUTES
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/entries', authenticationMiddleware, entriesRouter);

app.use('*', (req, res) => {
  res
    .status(404)
    .send(
      '<div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: #e5dada;"><a href="/">404, no page here, back home</a></div>'
    );
});

// MIDDLEWARE
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

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
