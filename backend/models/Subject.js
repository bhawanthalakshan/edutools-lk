const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter subject name'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Please enter subject slug'],
      lowercase: true,
      trim: true,
    },
    examType: {
      type: String,
      enum: ['OL', 'AL'],
      required: [true, 'Please specify exam level (OL or AL)'],
    },
    description: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: 'FaBook',
    },
    order: {
      type: Number,
      default: 0,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure uniqueness of slug per examType
subjectSchema.index({ examType: 1, slug: 1 }, { unique: true });

module.exports = mongoose.model('Subject', subjectSchema);
