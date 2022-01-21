/* CONTROLLERS FOR THE ENTRY ROUTES
  CONTAINS NECESSARY CRUD (CREATE, READ, UPDATE AND DELETE OPERATIONS)
  TO MANIPULATE DIARY ENTRIES.

  I IMAGINE NAMES ARE FAIRLY DESCRIPTIVE AS TO THEIR PURPOSE
*/

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
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: `No entry with id ${entryId}` });
  }

  res.status(StatusCodes.OK).json({ entry });
};

const createEntry = async (req, res) => {
  req.body.createdBy = req.user.userId; // ASSIGNS THE POST TO THE USER WHO CREATED IT.

  if (!req.body.title || !req.body.body) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: 'Please provide all values' });
  }

  const entry = await Entry.create(req.body);
  res.status(StatusCodes.CREATED).json({ entry });
};

// USES PATCH TO EDIT WHAT WAS CHANGED AND KEEP THE REST
// EDITABLES INCLUDE THE TITLE, THE BODY, AND WHETHER OR NOT IT IS BOOKMARKED
const editEntry = async (req, res) => {
  const {
    user: { userId },
    params: { id: entryId },
  } = req;

  if (!req.body.title || !req.body.body) {
    res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Please provide values' });
    return;
  }

  const entry = await Entry.findByIdAndUpdate(
    { _id: entryId, createdBy: userId },
    req.body,
    { new: true, runValidators: true }
  );

  if (!entry) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: `No entry with id ${entryId}` });
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
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: `No entry with id ${entryId}` });
  }
  res.status(StatusCodes.OK).send();
};

module.exports = {
  deleteEntry,
  editEntry,
  createEntry,
  getAllEntries,
  getEntry,
};
