const express = require('express');
const router = express.Router();
const { getMedia, uploadImage, deleteMedia } = require('../controllers/mediaController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', protect, getMedia);
router.post('/upload', protect, upload.single('file'), uploadImage);
router.delete('/:id', protect, deleteMedia);

module.exports = router;
