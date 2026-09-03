const mongoose = require('mongoose');

const contentReportSchema = new mongoose.Schema(
  {
    paperId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PastPaper',
      required: true,
    },
    paperTitle: {
      type: String,
      default: '',
    },
    reason: {
      type: String,
      enum: [
        'Wrong paper',
        'Wrong year',
        'Wrong subject',
        'Wrong medium',
        'Broken PDF',
        'Duplicate',
        'Incorrect metadata',
        'Copyright concern',
        'Other',
      ],
      required: true,
    },
    details: {
      type: String,
      default: '',
    },
    userEmail: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'resolved', 'dismissed'],
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

contentReportSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('ContentReport', contentReportSchema);
