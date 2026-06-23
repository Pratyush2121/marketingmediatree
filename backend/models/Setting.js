const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
  key: {
    type: String,
    required: [true, 'Setting key is required'],
    unique: true,
    trim: true,
    lowercase: true
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: [true, 'Setting payload data is required']
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

settingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Setting', settingSchema);
