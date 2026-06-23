const { Setting } = require('../models/dbAdapter');

// @desc    Get settings by key
// @route   GET /api/settings/:key
// @access  Public
const getSettings = async (req, res) => {
  try {
    const key = req.params.key.toLowerCase();
    let setting = await Setting.findOne({ key });

    // Fallbacks to avoid crashing frontend if seeder hasn't run
    if (!setting) {
      let defaultData = {};
      if (key === 'header') {
        defaultData = { logoUrl: '', email: 'info@marketingmediatree.com', phone: '+91 96962 17440', socialLinks: { instagram: '', facebook: '', linkedin: '' } };
      } else if (key === 'footer') {
        defaultData = { email: 'info@marketingmediatree.com', phone: '+91 96962 17440', address: '', copyright: 'Marketing Media Tree. All Rights Reserved.', socialLinks: { instagram: '', facebook: '', linkedin: '' } };
      } else if (key === 'contactinfo') {
        defaultData = { companyName: 'Marketing Media Tree', address: '', email: 'info@marketingmediatree.com', phone: '+91 96962 17440', whatsapp: '919696217440' };
      } else if (key === 'seo') {
        defaultData = { siteTitle: 'Marketing Media Tree', metaTitle: 'Marketing Media Tree', metaDescription: '', metaKeywords: '', ogImageUrl: '', canonicalUrl: '' };
      } else if (key === 'clients') {
        defaultData = [
          { id: 'c1', name: 'Acme Corp', logoUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200&h=200&fit=crop', details: 'Logistics and delivery solutions' },
          { id: 'c2', name: 'GlobalTech', logoUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=200&h=200&fit=crop', details: 'Enterprise IT solutions' },
          { id: 'c3', name: 'Vortex Co', logoUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=200&h=200&fit=crop', details: 'Digital marketing services' },
          { id: 'c4', name: 'Innovate Ltd', logoUrl: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&h=200&fit=crop', details: 'Creative brand architectures' },
          { id: 'c5', name: 'Synergy digital', logoUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=200&h=200&fit=crop', details: 'Web strategy coordinates' },
          { id: 'c6', name: 'Apex Group', logoUrl: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=200&h=200&fit=crop', details: 'Corporate growth advisory' },
          { id: 'c7', name: 'Zenith Marketing', logoUrl: 'https://images.unsplash.com/photo-1542744094-3a31f103e35f?w=200&h=200&fit=crop', details: 'Search presence amplification' },
          { id: 'c8', name: 'Skyline Ventures', logoUrl: 'https://images.unsplash.com/photo-1554469384-e58fac16e23a?w=200&h=200&fit=crop', details: 'Venture investments & development' }
        ];
      } else if (key === 'projects') {
        defaultData = [
          { id: 'p1', title: 'SEO Rankings Boost', description: 'Improved search visibility and organic traffic by 150% in 90 days.', imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600', link: 'https://google.com', category: 'SEO' },
          { id: 'p2', title: 'PPC Conversion Optimization', description: 'Reduced acquisition cost by 35% using high-intent keyword match triggers.', imageUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600', link: 'https://google.com', category: 'PPC' }
        ];
      }

      setting = await Setting.create({ key, data: defaultData });
    }

    res.status(200).json({ success: true, key: setting.key, data: setting.data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update settings by key
// @route   POST /api/settings/:key
// @access  Private (Admin only)
const updateSettings = async (req, res) => {
  try {
    const key = req.params.key.toLowerCase();
    const { data } = req.body;

    if (!data) {
      return res.status(400).json({ success: false, message: 'Please provide the data payload to update' });
    }

    let setting = await Setting.findOne({ key });
    if (setting) {
      setting.data = data;
      await setting.save();
    } else {
      setting = await Setting.create({ key, data });
    }

    res.status(200).json({ success: true, key: setting.key, data: setting.data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getSettings,
  updateSettings
};
