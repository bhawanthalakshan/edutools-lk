const mongoose = require('mongoose');

const timetableItemSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  date: { type: Date, required: true },
  startTime: { type: String, default: '' },
  endTime: { type: String, default: '' },
  paper: { type: String, default: '' },
});

const examScheduleSchema = new mongoose.Schema(
  {
    examType: {
      type: String,
      enum: ['OL', 'AL'],
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    examTitle: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
    },
    officialSourceUrl: {
      type: String,
      default: '',
    },
    isVerified: {
      type: Boolean,
      default: true,
    },
    timetable: [timetableItemSchema],
  },
  {
    timestamps: true,
  }
);

examScheduleSchema.index({ examType: 1, year: -1 });

module.exports = mongoose.model('ExamSchedule', examScheduleSchema);
