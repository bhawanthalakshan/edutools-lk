const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
  {
    university: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'University',
      required: [true, 'Course must belong to a university'],
    },
    name: {
      type: String,
      required: [true, 'Please enter degree or course name'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Please enter course slug'],
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
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

courseSchema.index({ university: 1, slug: 1 }, { unique: true });

module.exports = mongoose.model('Course', courseSchema);
