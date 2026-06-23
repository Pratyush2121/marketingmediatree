const express = require('express');
const router = express.Router();
const {
  submitForm,
  getSubmissions,
  deleteSubmission,
  exportSubmissions
} = require('../controllers/contactController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(submitForm)
  .get(protect, getSubmissions);

router.get('/export', protect, exportSubmissions);
router.delete('/:id', protect, deleteSubmission);

module.exports = router;
