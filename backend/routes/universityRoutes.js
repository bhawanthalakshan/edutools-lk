const express = require('express');
const router = express.Router();
const {
  getUniversities,
  getUniversityBySlug,
  createUniversity,
  getCourses,
  createCourse,
  getModules,
  createModule,
} = require('../controllers/universityController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .get(getUniversities)
  .post(protect, admin, createUniversity);

router.route('/slug/:slug')
  .get(getUniversityBySlug);

router.route('/courses')
  .get(getCourses)
  .post(protect, admin, createCourse);

router.route('/modules')
  .get(getModules)
  .post(protect, admin, createModule);

module.exports = router;
