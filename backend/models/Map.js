const mongoose = require('mongoose');

const mapSchema = new mongoose.Schema({
  embedUrl: {
    type: String,
    trim: true,
    default: ''
  },
  iframeCode: {
    type: String,
    trim: true,
    default: ''
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

mapSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Map', mapSchema);
