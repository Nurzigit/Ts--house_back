const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  nickname: { type: String, required: true },
  password: { type: String, required: true },
  sex: { type: String, required: true },
  role: { type: String, enum: ['user', 'advertiser', 'admin'], default: 'user' },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Card' }] // Массив с карточками, которые находятся в избранном
});

module.exports = mongoose.model('User', userSchema);