const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  date: { 
    type: Date, 
    default: Date.now 
},
});

module.exports = mongoose.model("Message", MessageSchema);
