const mongoose = require('mongoose');

const paperRequestSchema = new mongoose.Schema(
  {
    examType: {
      type: String,
      enum: ['OL', 'AL', 'UNIVERSITY'],
      required: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    year: {
      type: Number,
      required: true,
    },
    medium: {
      type: String,
      enum: ['Sinhala', 'Tamil', 'English'],
      required: true,
    },
    paperType: {
      type: String,
      default: 'Past Paper',
    },
    university: {
      type: String,
      default: '',
    },
    course: {
      type: String,
      default: '',
    },
    module: {
      type: String,
      default: '',
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'reviewing', 'fulfilled', 'rejected'],
      default: 'pending',
    },
    adminNotes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

paperRequestSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('PaperRequest', paperRequestSchema);
