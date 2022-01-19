const express = require('express');
const router = express.Router();

const {
  createEntry,
  deleteEntry,
  editEntry,
  getAllEntries,
  getEntry,
} = require('../controllers/entryController');

// localhost:5000/api/v1/entries
router.route('/').post(createEntry).get(getAllEntries);

// localhost:5000/api/v1/entries/:id
router.route('/:id').get(getEntry).delete(deleteEntry).patch(editEntry);

module.exports = router;
