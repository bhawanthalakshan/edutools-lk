const express = require('express');
const router = express.Router();
const {
  getTools,
  getToolBySlug,
  createTool,
  updateTool,
  deleteTool,
} = require('../controllers/toolController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .get(getTools)
  .post(protect, admin, createTool);

router.route('/:slug')
  .get(getToolBySlug);

router.route('/:id')
  .put(protect, admin, updateTool)
  .delete(protect, admin, deleteTool);

module.exports = router;
