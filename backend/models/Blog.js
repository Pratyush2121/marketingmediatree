const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  author: {
    type: String,
    required: [true, 'Comment author name is required'],
    trim: true
  },
  text: {
    type: String,
    required: [true, 'Comment text is required'],
    trim: true
  },
  date: {
    type: String,
    default: () => new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  date: {
    type: String,
    default: () => new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  },
  author: {
    type: String,
    default: 'Jasmine'
  },
  image: {
    type: String,
    default: ''
  },
  excerpt: {
    type: String,
    required: [true, 'Excerpt is required'],
    trim: true
  },
  content: {
    type: String,
    required: [true, 'Content is required']
  },
  published: {
    type: Boolean,
    default: true
  },
  tags: [
    {
      type: String,
      trim: true
    }
  ],
  metaTitle: {
    type: String,
    trim: true
  },
  metaDescription: {
    type: String,
    trim: true
  },
  comments: [commentSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-save slug generation
blogSchema.pre('validate', function (next) {
  if (this.title && (!this.slug || this.isModified('title'))) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }
  next();
});

module.exports = mongoose.model('Blog', blogSchema);
