const University = require('../models/University');
const Course = require('../models/Course');
const Module = require('../models/Module');
const PastPaper = require('../models/PastPaper');

// --- UNIVERSITIES ---

const getUniversities = async (req, res, next) => {
  try {
    const { all } = req.query;
    const query = all === 'true' ? {} : { active: true };

    const universities = await University.find(query).sort({ order: 1, name: 1 });

    const data = await Promise.all(
      universities.map(async (uni) => {
        const paperCount = await PastPaper.countDocuments({
          examType: 'UNIVERSITY',
          $or: [{ universityId: uni._id }, { level: { $regex: uni.name, $options: 'i' } }],
          status: 'published',
        });
        const courseCount = await Course.countDocuments({ university: uni._id, active: true });

        return {
          ...uni.toObject(),
          paperCount,
          courseCount,
        };
      })
    );

    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    next(error);
  }
};

const getUniversityBySlug = async (req, res, next) => {
  try {
    const uni = await University.findOne({ slug: req.params.slug.toLowerCase() });
    if (!uni) {
      res.status(404);
      throw new Error(`University '${req.params.slug}' not found`);
    }

    const courses = await Course.find({ university: uni._id, active: true }).sort({ name: 1 });

    res.status(200).json({
      success: true,
      data: {
        ...uni.toObject(),
        courses,
      },
    });
  } catch (error) {
    next(error);
  }
};

const createUniversity = async (req, res, next) => {
  try {
    const { name, slug, description, logo, order, active } = req.body;
    if (!name) {
      res.status(400);
      throw new Error('Please enter university name');
    }

    const finalSlug = slug
      ? slug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      : name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const uni = await University.create({
      name,
      slug: finalSlug,
      description: description || '',
      logo: logo || '',
      order: Number(order) || 0,
      active: active !== undefined ? active : true,
    });

    res.status(201).json({ success: true, message: 'University created', data: uni });
  } catch (error) {
    next(error);
  }
};

// --- COURSES ---

const getCourses = async (req, res, next) => {
  try {
    const { universitySlug } = req.query;
    const query = { active: true };

    if (universitySlug) {
      const uni = await University.findOne({ slug: universitySlug.toLowerCase() });
      if (uni) {
        query.university = uni._id;
      }
    }

    const courses = await Course.find(query).populate('university', 'name slug').sort({ name: 1 });

    const data = await Promise.all(
      courses.map(async (c) => {
        const moduleCount = await Module.countDocuments({ course: c._id, active: true });
        const paperCount = await PastPaper.countDocuments({
          examType: 'UNIVERSITY',
          $or: [{ courseId: c._id }, { stream: { $regex: c.name, $options: 'i' } }],
          status: 'published',
        });
        return {
          ...c.toObject(),
          moduleCount,
          paperCount,
        };
      })
    );

    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    next(error);
  }
};

const createCourse = async (req, res, next) => {
  try {
    const { universityId, name, slug, description } = req.body;
    if (!universityId || !name) {
      res.status(400);
      throw new Error('Please provide universityId and degree/course name');
    }

    const finalSlug = slug
      ? slug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      : name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const course = await Course.create({
      university: universityId,
      name,
      slug: finalSlug,
      description: description || '',
    });

    res.status(201).json({ success: true, message: 'Course created', data: course });
  } catch (error) {
    next(error);
  }
};

// --- MODULES ---

const getModules = async (req, res, next) => {
  try {
    const { courseSlug } = req.query;
    const query = { active: true };

    if (courseSlug) {
      const course = await Course.findOne({ slug: courseSlug.toLowerCase() });
      if (course) {
        query.course = course._id;
      }
    }

    const modules = await Module.find(query).populate('course', 'name slug').sort({ name: 1 });

    const data = await Promise.all(
      modules.map(async (m) => {
        const paperCount = await PastPaper.countDocuments({
          examType: 'UNIVERSITY',
          $or: [{ moduleId: m._id }, { subject: { $regex: m.name, $options: 'i' } }],
          status: 'published',
        });
        return {
          ...m.toObject(),
          paperCount,
        };
      })
    );

    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    next(error);
  }
};

const createModule = async (req, res, next) => {
  try {
    const { courseId, name, slug, code, description } = req.body;
    if (!courseId || !name) {
      res.status(400);
      throw new Error('Please provide courseId and module name');
    }

    const finalSlug = slug
      ? slug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      : name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const mod = await Module.create({
      course: courseId,
      name,
      slug: finalSlug,
      code: code || '',
      description: description || '',
    });

    res.status(201).json({ success: true, message: 'Module created', data: mod });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUniversities,
  getUniversityBySlug,
  createUniversity,
  getCourses,
  createCourse,
  getModules,
  createModule,
};
