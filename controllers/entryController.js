const Entry = require('../models/Entry');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors');

const getAllEntries = async (req, res) => {
  res.send('all jobs');
};

const getEntry = async (req, res) => {
  res.send('single job');
};

const createEntry = async (req, res) => {
  res.send('creating entry');
};

const editEntry = async (req, res) => {
  res.send('editing entry');
};

const deleteEntry = async (req, res) => {
  res.send('deleting entry');
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
