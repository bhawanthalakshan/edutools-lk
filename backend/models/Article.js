const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Article title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Article slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    excerpt: {
      type: String,
      default: '',
    },
    content: {
      type: String,
      required: [true, 'Article content is required'],
    },
    featuredImage: {
      type: String,
      default: '',
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Article category is required'],
    },
    tags: {
      type: [String],
      default: [],
    },
    author: {
      type: String,
      default: 'EduTools LK Team',
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'published',
    },
    seoTitle: {
      type: String,
      default: '',
    },
    seoDescription: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Add index for fast title & excerpt text search
articleSchema.index({ title: 'text', excerpt: 'text', tags: 'text' });

module.exports = mongoose.model('Article', articleSchema);
