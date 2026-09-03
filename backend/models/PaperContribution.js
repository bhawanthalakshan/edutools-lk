const mongoose = require('mongoose');

const paperContributionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: 'Anonymous Student',
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    examType: {
      type: String,
      enum: ['OL', 'AL', 'UNIVERSITY'],
      required: true,
    },
    subject: {
      type: String,
      required: true,
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
    fileUrl: {
      type: String,
      required: true,
    },
    cloudinaryPublicId: {
      type: String,
      default: '',
    },
    fileName: {
      type: String,
      default: '',
    },
    fileSize: {
      type: Number,
      default: 0,
    },
    source: {
      type: String,
      default: 'Student Contribution',
    },
    notes: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
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

paperContributionSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('PaperContribution', paperContributionSchema);
