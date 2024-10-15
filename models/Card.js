const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  image: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isFavorite: { type: Boolean, default: false },
});

module.exports = mongoose.model('Card', cardSchema);
