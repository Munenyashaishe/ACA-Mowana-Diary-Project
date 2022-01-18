const Entry = require('../models/Entry');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors');

const getAllEntries = async (req, res) => {
  const entries = await Entry.find({ createdBy: req.user.userId }).sort(
    'createdAt'
  );
  res.status(StatusCodes.OK).json({ entries, nbHits: entries.length });
};

const getEntry = async (req, res) => {
  const {
    user: { userId },
    params: { id: entryId },
  } = req;

  const entry = await Entry.findOne({ _id: entryId, createdBy: userId });

  if (!entry) {
    throw new NotFoundError(`No entry with id ${entryId}`);
  }

  res.status(StatusCodes.OK).json({ entry });
};

const createEntry = async (req, res) => {
  req.body.createdBy = req.user.userId;

  const entry = await Entry.create(req.body);
  res.status(StatusCodes.CREATED).json({ entry });
};

const editEntry = async (req, res) => {
  const {
    user: { userId },
    params: { id: entryId },
  } = req;

  const entry = await Entry.findByIdAndUpdate(
    { _id: entryId, createdBy: userId },
    req.body,
    { new: true, runValidators: true }
  );

  if (!entry) {
    throw new NotFoundError(`No entry with id ${entryId}`);
  }

  res.status(StatusCodes.CREATED).json({ entry });
};

const deleteEntry = async (req, res) => {
  const {
    user: { userId },
    params: { id: entryId },
  } = req;

  const entry = await Entry.findOneAndRemove({
    _id: entryId,
    createdBy: userId,
  });

  if (!entry) {
    throw new NotFoundError(`No entry with id ${entryId}`);
  }
  res.status(StatusCodes.OK).send();
};

const addToFavorites = async (req, res) => {
  res.send('adding to favorites');
};

const getFavorites = async (req, res) => {
  res.send('getting favorites');
};

module.exports = {
  getFavorites,
  addToFavorites,
  deleteEntry,
  editEntry,
  createEntry,
  getAllEntries,
  getEntry,
};
