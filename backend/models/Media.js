const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  url: {
    type: String,
    required: [true, 'URL is required']
  },
  publicId: {
    type: String,
    required: [true, 'Public ID is required'],
    unique: true
  },
  filename: {
    type: String,
    required: [true, 'Filename is required']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Media', mediaSchema);
