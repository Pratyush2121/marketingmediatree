const { Blog } = require('../models/dbAdapter');

// @desc    Get all blogs
// @route   GET /api/blogs
// @access  Public (Optional admin view for all blogs)
const getBlogs = async (req, res) => {
  try {
    const showAll = req.query.all === 'true';
    const filter = showAll ? {} : { published: true };
    
    // Sort by date/createdAt descending
    const blogs = await Blog.find(filter).sort({ createdAt: -1 });
    
    res.status(200).json({ success: true, count: blogs.length, blogs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single blog by slug
// @route   GET /api/blogs/:slug
// @access  Public
const getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });
    
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }
    
    res.status(200).json({ success: true, blog });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new blog post
// @route   POST /api/blogs
// @access  Private (Admin only)
const createBlog = async (req, res) => {
  try {
    const { title, category, author, image, excerpt, content, published, tags, metaTitle, metaDescription } = req.body;

    if (!title || !excerpt || !content) {
      return res.status(400).json({ success: false, message: 'Please enter all required fields (title, excerpt, content)' });
    }

    const blog = await Blog.create({
      title,
      category: category || 'Digital Marketing',
      author: author || 'Jasmine',
      image: image || '',
      excerpt,
      content,
      published: published !== undefined ? published : true,
      tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()) : []),
      metaTitle: metaTitle || title,
      metaDescription: metaDescription || excerpt
    });

    res.status(201).json({ success: true, blog });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update existing blog post
// @route   PUT /api/blogs/:id
// @access  Private (Admin only)
const updateBlog = async (req, res) => {
  try {
    let blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }

    // Handle tags if it's sent as a string list
    if (req.body.tags && typeof req.body.tags === 'string') {
      req.body.tags = req.body.tags.split(',').map(t => t.trim());
    }

    blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, blog });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete blog post
// @route   DELETE /api/blogs/:id
// @access  Private (Admin only)
const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }

    await Blog.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: 'Blog post deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add public comment to a blog
// @route   POST /api/blogs/:slug/comments
// @access  Public
const addComment = async (req, res) => {
  try {
    const { author, text } = req.body;

    if (!author || !text) {
      return res.status(400).json({ success: false, message: 'Please provide comment author and text' });
    }

    const blog = await Blog.findOne({ slug: req.params.slug });
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }

    const newComment = {
      author,
      text,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    };

    blog.comments.push(newComment);
    await blog.save();

    res.status(201).json({ success: true, comment: newComment, comments: blog.comments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getBlogs,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
  addComment
};
