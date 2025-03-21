const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  images: [String],
  title: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  date: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isFavorite: { type: Boolean, default: false },
  isTop: { type: Boolean, default: false },
  isPremium: { type: Boolean, default: false },
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true
    },
    address: { type: String, required: true }
  }
});

// Создаем гео-индекс
cardSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Card', cardSchema);
