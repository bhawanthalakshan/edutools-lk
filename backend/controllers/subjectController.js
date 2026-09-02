const Subject = require('../models/Subject');
const PastPaper = require('../models/PastPaper');

// @desc    Get all active subjects (grouped or filtered by examType)
// @route   GET /api/subjects
// @access  Public
const getSubjects = async (req, res, next) => {
  try {
    const { examType, search, all } = req.query;
    const query = {};

    if (all !== 'true') {
      query.active = true;
    }

    if (examType) {
      query.examType = examType.toUpperCase();
    }

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const subjects = await Subject.find(query).sort({ order: 1, name: 1 });

    // Calculate paper count for each subject
    const subjectsWithCounts = await Promise.all(
      subjects.map(async (subj) => {
        const paperCount = await PastPaper.countDocuments({
          examType: subj.examType,
          $or: [{ subjectId: subj._id }, { subject: { $regex: new RegExp(`^${subj.name}$`, 'i') } }],
          status: 'published',
        });

        // Find latest available paper year
        const latestPaper = await PastPaper.findOne({
          examType: subj.examType,
          $or: [{ subjectId: subj._id }, { subject: { $regex: new RegExp(`^${subj.name}$`, 'i') } }],
          status: 'published',
        }).sort({ year: -1 });

        return {
          ...subj.toObject(),
          paperCount,
          latestYear: latestPaper ? latestPaper.year : null,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: subjectsWithCounts.length,
      data: subjectsWithCounts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single subject by slug & examType
// @route   GET /api/subjects/:examType/:slug
// @access  Public
const getSubjectBySlug = async (req, res, next) => {
  try {
    const { examType, slug } = req.params;
    const subject = await Subject.findOne({
      examType: examType.toUpperCase(),
      slug: slug.toLowerCase(),
    });

    if (!subject) {
      res.status(404);
      throw new Error(`Subject '${slug}' not found for level ${examType.toUpperCase()}`);
    }

    const paperCount = await PastPaper.countDocuments({
      examType: subject.examType,
      $or: [{ subjectId: subject._id }, { subject: { $regex: new RegExp(`^${subject.name}$`, 'i') } }],
      status: 'published',
    });

    res.status(200).json({
      success: true,
      data: {
        ...subject.toObject(),
        paperCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new subject
// @route   POST /api/subjects
// @access  Private/Admin
const createSubject = async (req, res, next) => {
  try {
    const { name, slug, examType, description, icon, order, active } = req.body;

    if (!name || !examType) {
      res.status(400);
      throw new Error('Please provide subject name and exam type (OL or AL)');
    }

    const finalSlug = slug
      ? slug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      : name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const existing = await Subject.findOne({
      examType: examType.toUpperCase(),
      slug: finalSlug,
    });

    if (existing) {
      res.status(400);
      throw new Error(`Subject with slug '${finalSlug}' already exists for ${examType.toUpperCase()}`);
    }

    const subject = await Subject.create({
      name,
      slug: finalSlug,
      examType: examType.toUpperCase(),
      description: description || '',
      icon: icon || 'FaBook',
      order: Number(order) || 0,
      active: active !== undefined ? active : true,
    });

    res.status(201).json({
      success: true,
      message: 'Subject created successfully',
      data: subject,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update subject
// @route   PUT /api/subjects/:id
// @access  Private/Admin
const updateSubject = async (req, res, next) => {
  try {
    let subject = await Subject.findById(req.params.id);
    if (!subject) {
      res.status(404);
      throw new Error('Subject not found');
    }

    if (req.body.slug) {
      req.body.slug = req.body.slug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    subject = await Subject.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Subject updated successfully',
      data: subject,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete subject
// @route   DELETE /api/subjects/:id
// @access  Private/Admin
const deleteSubject = async (req, res, next) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject) {
      res.status(404);
      throw new Error('Subject not found');
    }

    await subject.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Subject deleted successfully',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSubjects,
  getSubjectBySlug,
  createSubject,
  updateSubject,
  deleteSubject,
};
