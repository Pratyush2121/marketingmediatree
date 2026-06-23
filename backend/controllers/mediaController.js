const { Media } = require('../models/dbAdapter');

// @desc    Get all uploaded media assets
// @route   GET /api/media
// @access  Private (Admin only)
const getMedia = async (req, res) => {
  try {
    const media = await Media.find({}).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: media.length, media });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Upload image to Database (stored as base64)
// @route   POST /api/media/upload
// @access  Private (Admin only)
const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload an image file' });
    }

    // Convert file buffer to base64 Data URI
    const base64Data = req.file.buffer.toString('base64');
    const mimeType = req.file.mimetype;
    const url = `data:${mimeType};base64,${base64Data}`;

    // Generate unique representation for publicId (reusing filename formatting)
    const cleanName = req.file.originalname
      .split('.')[0]
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_');
    const publicId = `${cleanName}_${Date.now()}`;

    // Save metadata to Mongoose Media collection
    const media = await Media.create({
      url: url,
      publicId: publicId,
      filename: req.file.originalname
    });

    res.status(201).json({
      success: true,
      message: 'Image uploaded successfully to database',
      media
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete media asset
// @route   DELETE /api/media/:id
// @access  Private (Admin only)
const deleteMedia = async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);

    if (!media) {
      return res.status(404).json({ success: false, message: 'Media asset not found' });
    }

    // Delete from MongoDB only
    await Media.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: 'Media asset deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getMedia,
  uploadImage,
  deleteMedia
};
