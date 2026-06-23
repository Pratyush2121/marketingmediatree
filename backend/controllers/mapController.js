const { Map } = require('../models/dbAdapter');

// @desc    Get Google Map setup
// @route   GET /api/maps
// @access  Public
const getMap = async (req, res) => {
  try {
    let map = await Map.findOne({});
    if (!map) {
      map = await Map.create({ embedUrl: '', iframeCode: '' });
    }
    res.status(200).json({ success: true, map });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update Google Map setup
// @route   POST /api/maps
// @access  Private (Admin only)
const updateMap = async (req, res) => {
  try {
    const { embedUrl, iframeCode } = req.body;
    let map = await Map.findOne({});
    
    if (map) {
      map.embedUrl = embedUrl !== undefined ? embedUrl : map.embedUrl;
      map.iframeCode = iframeCode !== undefined ? iframeCode : map.iframeCode;
      await map.save();
    } else {
      map = await Map.create({ embedUrl, iframeCode });
    }
    
    res.status(200).json({ success: true, map });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getMap,
  updateMap
};
