const express = require('express');
const router = express.Router();

const {
  addToFavorites,
  createEntry,
  deleteEntry,
  editEntry,
  getAllEntries,
  getEntry,
  getFavorites,
} = require('../controllers/entryController');

router.route('/').post(createEntry).get(getAllEntries);
router
  .route('/:id')
  .get(getEntry)
  .delete(deleteEntry)
  .patch(editEntry)
  .patch(addToFavorites);

module.exports = router;
