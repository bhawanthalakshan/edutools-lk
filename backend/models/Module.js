const mongoose = require('mongoose');

const moduleSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'Module must belong to a course'],
    },
    name: {
      type: String,
      required: [true, 'Please enter module or subject name'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Please enter module slug'],
      lowercase: true,
      trim: true,
    },
    code: {
      type: String,
      default: '',
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

moduleSchema.index({ course: 1, slug: 1 }, { unique: true });

module.exports = mongoose.model('Module', moduleSchema);
