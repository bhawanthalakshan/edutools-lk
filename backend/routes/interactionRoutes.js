const express = require('express');
const router = express.Router();
const multer = require('multer');
const { protect } = require('../middleware/authMiddleware');
const {
  createPaperRequest,
  getPaperRequests,
  updatePaperRequestStatus,
  submitPaperContribution,
  getPaperContributions,
  moderatePaperContribution,
  createContentReport,
  getContentReports,
  updateContentReportStatus,
  getExamSchedules,
  createOrUpdateExamSchedule,
} = require('../controllers/interactionController');

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25 MB max limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF documents are allowed'), false);
    }
  },
});

// Paper Requests
router.post('/requests', createPaperRequest);
router.get('/requests', protect, getPaperRequests);
router.put('/requests/:id', protect, updatePaperRequestStatus);

// Paper Contributions
router.post('/contributions', upload.single('file'), submitPaperContribution);
router.get('/contributions', protect, getPaperContributions);
router.put('/contributions/:id', protect, moderatePaperContribution);

// Content Reports
router.post('/reports', createContentReport);
router.get('/reports', protect, getContentReports);
router.put('/reports/:id', protect, updateContentReportStatus);

// Exam Schedules
router.get('/schedules', getExamSchedules);
router.post('/schedules', protect, createOrUpdateExamSchedule);

module.exports = router;
