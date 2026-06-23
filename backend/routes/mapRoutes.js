const express = require('express');
const router = express.Router();
const { getMap, updateMap } = require('../controllers/mapController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(getMap)
  .post(protect, updateMap);

module.exports = router;
