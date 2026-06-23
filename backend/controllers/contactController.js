const { Contact } = require('../models/dbAdapter');

// @desc    Submit contact form
// @route   POST /api/contacts
// @access  Public
const submitForm = async (req, res) => {
  try {
    const { firstName, lastName, name, email, phone, message, description } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Please provide at least an email address' });
    }

    // Adapt to either combined name or firstName/lastName format
    let finalName = name;
    if (!finalName && firstName) {
      finalName = `${firstName} ${lastName || ''}`.trim();
    }
    if (!finalName) {
      finalName = 'Anonymous';
    }

    const finalMessage = message || description || 'No message provided';

    const submission = await Contact.create({
      name: finalName,
      email: email.toLowerCase(),
      phone: phone || '',
      message: finalMessage
    });

    res.status(201).json({ success: true, submission });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all submissions / Search leads
// @route   GET /api/contacts
// @access  Private (Admin only)
const getSubmissions = async (req, res) => {
  try {
    const searchQuery = req.query.search;
    let filter = {};

    if (searchQuery) {
      filter = {
        $or: [
          { name: { $regex: searchQuery, $options: 'i' } },
          { email: { $regex: searchQuery, $options: 'i' } },
          { phone: { $regex: searchQuery, $options: 'i' } },
          { message: { $regex: searchQuery, $options: 'i' } }
        ]
      };
    }

    const submissions = await Contact.find(filter).sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: submissions.length, submissions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete contact submission
// @route   DELETE /api/contacts/:id
// @access  Private (Admin only)
const deleteSubmission = async (req, res) => {
  try {
    const submission = await Contact.findById(req.params.id);

    if (!submission) {
      return res.status(404).json({ success: false, message: 'Submission not found' });
    }

    await Contact.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: 'Submission deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Export leads to CSV
// @route   GET /api/contacts/export
// @access  Private (Admin only)
const exportSubmissions = async (req, res) => {
  try {
    const submissions = await Contact.find({}).sort({ createdAt: -1 });

    // Build CSV Content
    let csvContent = 'ID,Name,Email,Phone,Message,Date Submitted\n';
    
    submissions.forEach((sub) => {
      // Escape commas and double quotes in CSV fields
      const name = `"${(sub.name || '').replace(/"/g, '""')}"`;
      const email = `"${(sub.email || '').replace(/"/g, '""')}"`;
      const phone = `"${(sub.phone || '').replace(/"/g, '""')}"`;
      const message = `"${(sub.message || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`;
      const date = `"${(sub.date || '').replace(/"/g, '""')}"`;
      
      csvContent += `${sub._id},${name},${email},${phone},${message},${date}\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=leads_export.csv');
    res.status(200).send(csvContent);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  submitForm,
  getSubmissions,
  deleteSubmission,
  exportSubmissions
};
