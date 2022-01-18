// HOW A DIARY ENTRY IS STRUCTURED
// createdBy DEFINES THE USER THAT MADE THE ENTRY AND HENCE BELONGS TO THEM

const mongoose = require('mongoose');

const EntrySchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide a user'],
    },
    title: {
      type: String,
      required: [true, 'Title Must Be Provided'],
      maxlength: 40,
    },
    body: {
      type: String,
      required: [true, 'Body cannot be empty'],
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },

    // title, body, date
  },
  { timestamps: true }
);

module.exports = mongoose.model('Entry', EntrySchema);
