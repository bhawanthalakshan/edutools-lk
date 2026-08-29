const express = require('express');
const router = express.Router();
const {
  getArticles,
  getArticleBySlug,
  createArticle,
  updateArticle,
  deleteArticle,
  toggleArticleStatus,
} = require('../controllers/articleController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .get(getArticles)
  .post(protect, admin, createArticle);

router.route('/:slug')
  .get(getArticleBySlug);

router.route('/:id')
  .put(protect, admin, updateArticle)
  .delete(protect, admin, deleteArticle);

router.route('/:id/status')
  .patch(protect, admin, toggleArticleStatus);

module.exports = router;
