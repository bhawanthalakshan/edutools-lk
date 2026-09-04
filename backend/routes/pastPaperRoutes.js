const express = require('express');
const router = express.Router();
const {
  getPastPapers,
  getPastPaperStats,
  getPastPaperBySlug,
  downloadPastPaper,
  createPastPaper,
  updatePastPaper,
  deletePastPaper,
  togglePastPaperStatus,
  autoImportPastPapers,
} = require('../controllers/pastPaperController');
const { protect, admin } = require('../middleware/authMiddleware');
const { uploadPdf } = require('../utils/storage');

// Public endpoints
router.route('/')
  .get(getPastPapers)
  .post(protect, admin, uploadPdf.single('file'), createPastPaper);

router.route('/auto-import')
  .post(protect, admin, autoImportPastPapers);

router.route('/stats')
  .get(getPastPaperStats);

router.route('/slug/:slug')
  .get(getPastPaperBySlug);

router.route('/:id/download')
  .get(downloadPastPaper);

router.route('/:id')
  .put(protect, admin, uploadPdf.single('file'), updatePastPaper)
  .delete(protect, admin, deletePastPaper);

router.route('/:id/status')
  .patch(protect, admin, togglePastPaperStatus);

module.exports = router;
