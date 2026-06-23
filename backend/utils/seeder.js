const { Admin, Setting, Map, Blog } = require('../models/dbAdapter');

const seedData = async () => {
  try {
    // 1. Seed Admin
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      await Admin.create({
        email: 'admin@marketingmediatree.com',
        password: 'jasmine',
        name: 'Administrator'
      });
      console.log('Seeded default admin credentials: admin@marketingmediatree.com / jasmine');
    }

    // 2. Seed Settings
    const defaultSettings = [
      {
        key: 'header',
        data: {
          logoUrl: '', // Default fallback will be frontend local image
          email: 'info@marketingmediatree.com',
          phone: '+91 96962 17440',
          socialLinks: {
            instagram: 'https://www.instagram.com/marketingmediatree/',
            facebook: 'https://www.facebook.com/people/Marketing-Media-Tree/61573917923386/',
            linkedin: 'https://www.linkedin.com/company/marketing-media-tree/?viewAsMember=true'
          }
        }
      },
      {
        key: 'footer',
        data: {
          email: 'info@marketingmediatree.com',
          phone: '+91 96962 17440',
          address: 'Plot no 307 Third Floor, Kakrola Market 16/6 Housing Complex, Main Road, New Delhi 110078',
          copyright: 'Marketing Media Tree. All Rights Reserved.',
          socialLinks: {
            instagram: 'https://www.instagram.com/marketingmediatree/',
            facebook: 'https://www.facebook.com/people/Marketing-Media-Tree/61573917923386/',
            linkedin: 'https://www.linkedin.com/company/marketing-media-tree/?viewAsMember=true'
          }
        }
      },
      {
        key: 'contactinfo',
        data: {
          companyName: 'Marketing Media Tree',
          address: 'Plot no 307 Third Floor, Kakrola Market 16/6 Housing Complex, Main Road, New Delhi 110078',
          email: 'info@marketingmediatree.com',
          phone: '+91 96962 17440',
          whatsapp: '919696217440'
        }
      },
      {
        key: 'seo',
        data: {
          siteTitle: 'Marketing Media Tree',
          metaTitle: 'Marketing Media Tree | Premium Digital Marketing & SEO Agency',
          metaDescription: "Dwarka Mor's premier results-driven marketing agency. Providing data-backed SEO, creative social media management, targeted PPC, and secure web development solutions.",
          metaKeywords: 'digital marketing, seo, ppc, social media marketing, dwarka mor marketing, marketing agency new delhi',
          ogImageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
          canonicalUrl: 'https://www.marketingmediatree.com'
        }
      },
      {
        key: 'clients',
        data: [
          { id: 'c1', name: 'Acme Corp', logoUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200&h=200&fit=crop', details: 'Logistics and delivery solutions' },
          { id: 'c2', name: 'GlobalTech', logoUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=200&h=200&fit=crop', details: 'Enterprise IT solutions' },
          { id: 'c3', name: 'Vortex Co', logoUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=200&h=200&fit=crop', details: 'Digital marketing services' },
          { id: 'c4', name: 'Innovate Ltd', logoUrl: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&h=200&fit=crop', details: 'Creative brand architectures' },
          { id: 'c5', name: 'Synergy digital', logoUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=200&h=200&fit=crop', details: 'Web strategy coordinates' },
          { id: 'c6', name: 'Apex Group', logoUrl: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=200&h=200&fit=crop', details: 'Corporate growth advisory' },
          { id: 'c7', name: 'Zenith Marketing', logoUrl: 'https://images.unsplash.com/photo-1542744094-3a31f103e35f?w=200&h=200&fit=crop', details: 'Search presence amplification' },
          { id: 'c8', name: 'Skyline Ventures', logoUrl: 'https://images.unsplash.com/photo-1554469384-e58fac16e23a?w=200&h=200&fit=crop', details: 'Venture investments & development' }
        ]
      },
      {
        key: 'projects',
        data: [
          { id: 'p1', title: 'SEO Rankings Boost', description: 'Improved search visibility and organic traffic by 150% in 90 days.', imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600', link: 'https://google.com', category: 'SEO' },
          { id: 'p2', title: 'PPC Conversion Optimization', description: 'Reduced acquisition cost by 35% using high-intent keyword match triggers.', imageUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600', link: 'https://google.com', category: 'PPC' }
        ]
      }
    ];

    for (const setting of defaultSettings) {
      const exists = await Setting.findOne({ key: setting.key });
      if (!exists) {
        await Setting.create(setting);
        console.log(`Seeded default settings for: ${setting.key}`);
      }
    }

    // 3. Seed Google Map Setup
    const mapCount = await Map.countDocuments();
    if (mapCount === 0) {
      await Map.create({
        embedUrl: '',
        iframeCode: ''
      });
      console.log('Seeded default map settings.');
    }

    // 4. Seed Blogs
    const blogCount = await Blog.countDocuments();
    if (blogCount === 0) {
      const initialBlogs = [
        {
          title: 'Best Email Marketing Services in Dwarka Mor, New Delhi',
          slug: 'best-email-marketing-services-in-dwarka-mor',
          category: 'Email Marketing',
          date: 'June 10, 2026',
          author: 'Jasmine',
          image: 'https://images.unsplash.com/photo-1557200134-90327ee9fafa?w=800&auto=format&fit=crop&q=60',
          excerpt: 'Discover the best email marketing solutions in Dwarka Mor to nurture your leads, construct automated sequences, and amplify your conversion rates.',
          content: `<h2>Why Email Marketing Matters for Local Businesses in Dwarka Mor</h2>
<p>In the bustling business landscape of Dwarka Mor and Kakrola, standing out requires direct and personalized customer communication. Email marketing remains the channel with the absolute highest ROI, yielding average returns of $36 for every $1 spent.</p>
<h3>How Marketing Media Tree Drives Email Success</h3>
<p>As a local-first marketing agency based in Dwarka Mor, New Delhi, we understand how to construct email lists that translate into real clinic bookings, e-commerce orders, and service signups. Here is how we build high-performing email campaigns:</p>
<ul>
  <li><strong>Automated Welcomes:</strong> Initiate instant relationships with prospective clients the second they sign up.</li>
  <li><strong>Lead Nurturing Sequences:</strong> Keep your brand top of mind by serving helpful tips, local guides, and timely promotions.</li>
  <li><strong>Cart Recovery Funnels:</strong> Re-engage online shoppers who left products in their checkout carts.</li>
  <li><strong>Clean List Auditing:</strong> Filter out inactive email addresses to secure maximum inbox placement grades.</li>
</ul>
<p>Ready to upgrade your marketing? Reach out to Marketing Media Tree, Dwarka Mor's premier marketing agency, and let's structure an email funnel that converts.</p>`,
          published: true,
          tags: ['Email Marketing', 'Dwarka Mor', 'Lead Nurturing'],
          metaTitle: 'Best Email Marketing Services in Dwarka Mor, New Delhi',
          metaDescription: 'Discover the best email marketing solutions in Dwarka Mor to nurture your leads, construct automated sequences, and amplify your conversion rates.',
          comments: [
            {
              author: 'Rajesh Kumar',
              text: "Very informative article! We've been looking to start email newsletters for our Dwarka Mor retail shop. Will reach out soon.",
              date: 'June 11, 2026'
            }
          ]
        },
        {
          title: 'Top SEO Ranking Strategies for 2026',
          slug: 'top-seo-ranking-strategies-for-digital-marketing',
          category: 'SEO',
          date: 'June 05, 2026',
          author: 'Anjali Sharma',
          image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60',
          excerpt: 'Learn the latest search engine optimization techniques to increase search visibility, handle Core Web Vitals, and dominate local search rankings.',
          content: `<h2>The Shift in Search Algorithms: What to Expect in 2026</h2>
<p>SEO is no longer just about keyword density. Google's focus has shifted entirely to semantic relevance, AI-assisted content accuracy, and user interaction signals. If your site isn't fast and readable, it won't stand on the first page.</p>
<h3>1. Secure High Core Web Vitals Grade</h3>
<p>Page load speed and visual stability are major ranking factors. Building your frontend with React and Vite ensures highly responsive client interaction and fast loads. Ensure images are served in WebP formats and scripts are deferred.</p>
<h3>2. Leverage Semantic Search & Content Depth</h3>
<p>Focus on comprehensive topics instead of single-phrase strings. Add FAQs to your service pages, use structured Schema markup to label key properties, and address user questions directly.</p>
<h3>3. Boost Local SEO Footprint</h3>
<p>For shops in New Delhi, local presence is vital. Secure a Google Business Profile, ensure uniform NAP (Name, Address, Phone) citation formatting across online directories, and ask local clients for reviews.</p>`,
          published: true,
          tags: ['SEO', 'Google Rankings', 'Core Web Vitals'],
          metaTitle: 'Top SEO Ranking Strategies for 2026',
          metaDescription: 'Learn the latest search engine optimization techniques to increase search visibility, handle Core Web Vitals, and dominate local search rankings.'
        },
        {
          title: 'Harnessing Social Media for Organic Brand Engagement',
          slug: 'harnessing-social-media-organic-engagement',
          category: 'Social Media Marketing',
          date: 'May 28, 2026',
          author: 'Pooja Roy',
          image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&auto=format&fit=crop&q=60',
          excerpt: 'How digital marketing agencies construct active customer bases across Meta platforms and LinkedIn using micro-video strategies.',
          content: `<h2>The Rise of Short-Form Video Content</h2>
<p>Instagram Reels, YouTube Shorts, and TikTok have transformed user attention spans. Brands that build raw, human, and informative short-form videos achieve 10x higher organic reach than static graphic uploads.</p>
<h3>Creating a Balanced Social Content Strategy</h3>
<p>We advise following the 70-20-10 distribution guideline:</p>
<ul>
  <li><strong>70% Informative Content:</strong> Serve helpful tips, agency walkthroughs, and industry guides.</li>
  <li><strong>20% Shared Community:</strong> Show behind-the-scenes office stories, client milestones, and spotlight reviews.</li>
  <li><strong>10% Direct CTAs:</strong> Share details of your digital services and prompt viewers to book consult calls.</li>
</ul>`,
          published: true,
          tags: ['SMM', 'Organic Engagement', 'Short Form Video'],
          metaTitle: 'Harnessing Social Media for Organic Brand Engagement',
          metaDescription: 'How digital marketing agencies construct active customer bases across Meta platforms and LinkedIn using micro-video strategies.'
        },
        {
          title: 'The Power of PPC: Maximizing ROI on Google Ads',
          slug: 'the-power-of-ppc-maximizing-roi-on-google-ads',
          category: 'Pay-Per-Click',
          date: 'May 20, 2026',
          author: 'Jasmine',
          image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&auto=format&fit=crop&q=60',
          excerpt: 'Learn how to structure highly optimized PPC campaigns on Google and social media to capture high-intent leads instantly.',
          content: `<h2>Structuring Campaigns for Instant Lead Capture</h2>
<p>PPC allows businesses to reach potential customers at the exact moment they are looking for a service. However, high competition can lead to inflated click costs if campaigns are set up incorrectly.</p>
<h3>Keys to High-Converting Ads</h3>
<p>Focus on setting clean search-intent match types, utilizing negative keyword lists to prevent wasted budget, and testing responsive ad variations frequently.</p>`,
          published: true,
          tags: ['PPC', 'Google Ads', 'ROI'],
          metaTitle: 'The Power of PPC: Maximizing ROI on Google Ads',
          metaDescription: 'Learn how to structure highly optimized PPC campaigns on Google and social media to capture high-intent leads instantly.'
        },
        {
          title: 'Why Responsive Web Design is Critical for Local Sales',
          slug: 'why-responsive-web-design-is-critical-for-local-sales',
          category: 'Website Development',
          date: 'May 12, 2026',
          author: 'Vikram Sen',
          image: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?w=800&auto=format&fit=crop&q=60',
          excerpt: 'Mobile screens command over 60% of all search queries. Check how responsive design parameters directly scale local retail sales.',
          content: `<h2>Mobile Optimizations are No Longer Optional</h2>
<p>Most local users searching for service addresses or shop hours are browsing on mobile devices. A website that loads slowly or displays layout breakages will immediately drive visitors back to search results.</p>
<h3>Core Focus Areas for Web Developers</h3>
<p>Prioritize responsive layouts, fast page loads using modular components, and visible CTA touchpoints like 'Call Now' and booking fields.</p>`,
          published: true,
          tags: ['Web Development', 'Mobile Optimization', 'UX'],
          metaTitle: 'Why Responsive Web Design is Critical for Local Sales',
          metaDescription: 'Mobile screens command over 60% of all search queries. Check how responsive design parameters directly scale local retail sales.'
        },
        {
          title: 'How Content Marketing Establishes Lasting Customer Trust',
          slug: 'how-content-marketing-establishes-lasting-customer-trust',
          category: 'Content Marketing',
          date: 'May 03, 2026',
          author: 'Jasmine',
          image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=60',
          excerpt: 'Discover how to draft articles, FAQs, and whitepapers that solve client problems and position your brand as a sector authority.',
          content: `<h2>Publishing Value-Driven Content Regularly</h2>
<p>Content marketing is about building relationships. By providing answers to common buyer queries on your blog, you establish authority and establish credibility before a salesperson ever connects with a prospect.</p>`,
          published: true,
          tags: ['Content Marketing', 'Trust Building', 'Blogging'],
          metaTitle: 'How Content Marketing Establishes Lasting Customer Trust',
          metaDescription: 'Discover how to draft articles, FAQs, and whitepapers that solve client problems and position your brand as a sector authority.'
        },
        {
          title: 'Google Business Profile Optimization Guidelines',
          slug: 'google-business-profile-optimization-guidelines',
          category: 'SEO',
          date: 'April 25, 2026',
          author: 'Anjali Sharma',
          image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&auto=format&fit=crop&q=60',
          excerpt: 'Maximize your maps placement visibility and organic phone call acquisitions with these essential profile optimization checkpoints.',
          content: `<h2>Ranking High in Local Maps Searches</h2>
<p>For service practices and physical stores, showing up in the Google Local Pack (Maps results) is the single most valuable SEO achievement. Set consistent NAP citations, request reviews, and add profile updates regularly.</p>`,
          published: true,
          tags: ['Google Business Profile', 'Local SEO', 'Maps SEO'],
          metaTitle: 'Google Business Profile Optimization Guidelines',
          metaDescription: 'Maximize your maps placement visibility and organic phone call acquisitions with these essential profile optimization checkpoints.'
        },
        {
          title: 'A Guide to High-Conversion Landing Pages',
          slug: 'a-guide-to-high-conversion-landing-pages',
          category: 'Website Development',
          date: 'April 18, 2026',
          author: 'Vikram Sen',
          image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60',
          excerpt: 'How layout structures, loading benchmarks, and single focused action prompts turn cold campaign clicks into active leads.',
          content: `<h2>The Anatomy of a High-Conversion Landing Page</h2>
<p>A landing page should have a single goal: converting a visitor into a lead. Keep layouts minimal, ensure fast visual load times, and place forms above the page fold with simple call-to-actions.</p>`,
          published: true,
          tags: ['Landing Page', 'Conversion Rate Optimization', 'CRO'],
          metaTitle: 'A Guide to High-Conversion Landing Pages',
          metaDescription: 'How layout structures, loading benchmarks, and single focused action prompts turn cold campaign clicks into active leads.'
        },
        {
          title: 'Understanding Remarketing: Turning Clicks into Clients',
          slug: 'understanding-remarketing-turning-clicks-into-clients',
          category: 'Pay-Per-Click',
          date: 'April 09, 2026',
          author: 'Jasmine',
          image: 'https://images.unsplash.com/photo-1557200134-90327ee9fafa?w=800&auto=format&fit=crop&q=60',
          excerpt: 'Most website visitors leave without buying. Learn how targeted remarketing loops keep your brand top-of-mind.',
          content: `<h2>Re-Engaging High-Intent Website Visitors</h2>
<p>Remarketing campaigns allow you to display targeted ads to users who have previously visited your site. By showing relevant ads, you remind them of their intent and guide them back to complete their purchase.</p>`,
          published: true,
          tags: ['Remarketing', 'Targeted Ads', 'PPC Retargeting'],
          metaTitle: 'Understanding Remarketing: Turning Clicks into Clients',
          metaDescription: 'Most website visitors leave without buying. Learn how targeted remarketing loops keep your brand top-of-mind.'
        },
        {
          title: 'The Role of AI in Modern Digital Campaigns',
          slug: 'the-role-of-ai-in-modern-digital-campaigns',
          category: 'Content Marketing',
          date: 'April 02, 2026',
          author: 'Pooja Roy',
          image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60',
          excerpt: 'How smart algorithms scale audience modeling, budget distribution, and copy optimization for digital marketing agencies.',
          content: `<h2>Integrating Smart Tech Safely in Creative Workflows</h2>
<p>Smart tools are revolutionizing marketing workflows. Learn how agencies deploy these tools for deep data modeling, campaign budget optimization, and semantic draft generation while keeping original brand tones.</p>`,
          published: true,
          tags: ['AI in Marketing', 'Campaign Automation', 'Smart Tech'],
          metaTitle: 'The Role of AI in Modern Digital Campaigns',
          metaDescription: 'How smart algorithms scale audience modeling, budget distribution, and copy optimization for digital marketing agencies.'
        },
        {
          title: '10 Proven Ways to Improve Your E-commerce Conversion Rate',
          slug: 'e-commerce-conversion-optimization-strategies',
          category: 'Website Development',
          date: 'March 28, 2026',
          author: 'Vikram Sen',
          image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=60',
          excerpt: "Struggling to convert website traffic into sales? These actionable e-commerce optimizations will boost your online shop's checkout efficiency.",
          content: `<h2>Boosting Sales with Practical UX Revisions</h2>
<p>Driving traffic to your online store is only half the battle. If your conversion rate is low, you are wasting valuable ad spend. Optimization is the key to turning casual browsers into buyers.</p>
<h3>Core Optimizations for High Sales Rates</h3>
<ul>
  <li><strong>Simplify Checkout paths:</strong> Minimize form fields and offer guest checkout modes to lower cart abandonment.</li>
  <li><strong>Load Responsive Designs:</strong> Ensure the payment gateway works seamlessly on smartphones.</li>
  <li><strong>Build Trust:</strong> Highlight security badges, return policies, and clear client reviews near checkout zones.</li>
</ul>`,
          published: true,
          tags: ['E-commerce', 'Checkout optimization', 'Conversion Rates'],
          metaTitle: '10 Proven Ways to Improve Your E-commerce Conversion Rate',
          metaDescription: "Struggling to convert website traffic into sales? These actionable e-commerce optimizations will boost your online shop's checkout efficiency."
        },
        {
          title: 'The Importance of Brand Identity in Digital Marketing',
          slug: 'importance-of-brand-identity-in-marketing',
          category: 'Content Marketing',
          date: 'March 15, 2026',
          author: 'Jasmine',
          image: 'https://images.unsplash.com/photo-1557838923-2985c318be48?w=800&auto=format&fit=crop&q=60',
          excerpt: 'A cohesive brand identity forms the foundation of all marketing channels. Explore how alignment builds customer loyalty and trust.',
          content: `<h2>The Core Pillars of a Unified Brand Strategy</h2>
<p>Brand identity is much more than just a logo design or color choices. It is the collective personality, voice, values, and reputation of your company across all digital platforms.</p>
<h3>Aligning Your Brand Coordinates</h3>
<p>Consistency builds credibility. Ensure your SMM captions, email content, and web development layouts match your core brand guidelines to deliver a reliable, familiar customer experience.</p>`,
          published: true,
          tags: ['Brand Identity', 'Marketing Strategy', 'Consistency'],
          metaTitle: 'The Importance of Brand Identity in Digital Marketing',
          metaDescription: 'A cohesive brand identity forms the foundation of all marketing channels. Explore how alignment builds customer loyalty and trust.'
        }
      ];

      await Blog.insertMany(initialBlogs);
      console.log('Seeded default blog posts dataset.');
    }

  } catch (error) {
    console.error(`Database seeding failed: ${error.message}`);
  }
};

module.exports = seedData;
