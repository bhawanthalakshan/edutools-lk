const mongoose = require('mongoose');

const pastPaperSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please enter past paper title'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Please enter past paper slug'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    examType: {
      type: String,
      enum: ['OL', 'AL', 'UNIVERSITY'],
      required: [true, 'Please select exam type (OL, AL, or UNIVERSITY)'],
    },
    level: {
      type: String,
      default: 'General',
    },
    stream: {
      type: String,
      default: 'General',
    },
    subject: {
      type: String,
      required: [true, 'Please specify the subject'],
      trim: true,
    },
    year: {
      type: Number,
      required: [true, 'Please enter exam year'],
    },
    medium: {
      type: String,
      enum: ['Sinhala', 'Tamil', 'English'],
      required: [true, 'Please select medium (Sinhala, Tamil, or English)'],
    },
    paperType: {
      type: String,
      enum: ['Past Paper', 'Model Paper', 'Term Test', 'Revision Paper', 'Other'],
      default: 'Past Paper',
    },
    term: {
      type: String,
      default: 'Final',
    },
    description: {
      type: String,
      default: '',
    },
    fileUrl: {
      type: String,
      required: [true, 'PDF file URL or path is required'],
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
    thumbnail: {
      type: String,
      default: '',
    },
    downloadCount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['published', 'draft'],
      default: 'published',
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    source: {
      type: String,
      default: 'Official Department / Teacher Contribution',
    },
    permissionConfirmed: {
      type: Boolean,
      required: [true, 'Permission confirmation is required'],
      default: false,
    },
    // Relational Hierarchy Fields (Optional / Linked)
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      default: null,
    },
    universityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'University',
      default: null,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      default: null,
    },
    moduleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Module',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for fast server-side filtering & search
pastPaperSchema.index({ title: 'text', subject: 'text', description: 'text' });
pastPaperSchema.index({ examType: 1, status: 1 });
pastPaperSchema.index({ subjectId: 1, year: -1 });
pastPaperSchema.index({ universityId: 1, courseId: 1, moduleId: 1 });

module.exports = mongoose.model('PastPaper', pastPaperSchema);
