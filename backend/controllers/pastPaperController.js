const PastPaper = require('../models/PastPaper');
const Subject = require('../models/Subject');
const University = require('../models/University');
const Course = require('../models/Course');
const Module = require('../models/Module');
const { uploadToCloudinary, deleteStoredFile } = require('../utils/storage');

// @desc    Get past papers with server-side filtering, search & pagination
// @route   GET /api/past-papers
// @access  Public
const getPastPapers = async (req, res, next) => {
  try {
    const {
      examType,
      subject,
      subjectSlug,
      subjectId,
      universitySlug,
      universityId,
      courseSlug,
      courseId,
      moduleSlug,
      moduleId,
      year,
      medium,
      paperType,
      resourceType,
      term,
      search,
      page = 1,
      limit = 12,
      all,
      sort = '-createdAt',
    } = req.query;

    const query = {};

    // Filter by published status unless admin explicitly requests all
    if (all !== 'true') {
      query.status = 'published';
    }

    if (examType) {
      query.examType = examType.toUpperCase();
    }

    // Resolve subject by ID, slug, or name regex
    if (subjectId) {
      query.subjectId = subjectId;
    } else if (subjectSlug) {
      const subjectDoc = await Subject.findOne({
        slug: subjectSlug.toLowerCase(),
        ...(examType ? { examType: examType.toUpperCase() } : {}),
      });
      if (subjectDoc) {
        query.$or = [
          { subjectId: subjectDoc._id },
          { subject: { $regex: new RegExp(`^${subjectDoc.name}$`, 'i') } },
        ];
      } else {
        query.subject = { $regex: subjectSlug.replace(/-/g, ' '), $options: 'i' };
      }
    } else if (subject) {
      query.subject = { $regex: subject, $options: 'i' };
    }

    // Resolve University / Course / Module filters
    if (universityId) query.universityId = universityId;
    if (universitySlug) {
      const uniDoc = await University.findOne({ slug: universitySlug.toLowerCase() });
      if (uniDoc) query.universityId = uniDoc._id;
    }

    if (courseId) query.courseId = courseId;
    if (courseSlug) {
      const courseDoc = await Course.findOne({ slug: courseSlug.toLowerCase() });
      if (courseDoc) query.courseId = courseDoc._id;
    }

    if (moduleId) query.moduleId = moduleId;
    if (moduleSlug) {
      const moduleDoc = await Module.findOne({ slug: moduleSlug.toLowerCase() });
      if (moduleDoc) query.moduleId = moduleDoc._id;
    }

    if (year) query.year = Number(year);
    if (medium) query.medium = { $regex: medium, $options: 'i' };
    if (paperType) query.paperType = { $regex: paperType, $options: 'i' };
    if (resourceType) query.resourceType = { $regex: resourceType, $options: 'i' };
    if (term) query.term = { $regex: term, $options: 'i' };

    // Smart search filter across title, subject, year, medium, description
    if (search) {
      const searchTrimmed = search.trim();
      const yearMatch = searchTrimmed.match(/\b(19\d\d|20\d\d)\b/);
      const searchRegex = new RegExp(searchTrimmed.replace(/[^a-zA-Z0-9\s]/g, ''), 'i');

      const searchConditions = [
        { title: searchRegex },
        { subject: searchRegex },
        { description: searchRegex },
      ];

      if (yearMatch) {
        searchConditions.push({ year: Number(yearMatch[1]) });
      }

      query.$or = searchConditions;
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 12;
    const skip = (pageNum - 1) * limitNum;

    const totalPapers = await PastPaper.countDocuments(query);
    const papers = await PastPaper.find(query)
      .populate('subjectId', 'name slug icon')
      .populate('universityId', 'name slug logo')
      .populate('courseId', 'name slug')
      .populate('moduleId', 'name slug code')
      .populate('relatedPaperId', 'title slug fileUrl')
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    const totalPages = Math.ceil(totalPapers / limitNum);

    res.status(200).json({
      success: true,
      count: papers.length,
      pagination: {
        page: pageNum,
        limit: limitNum,
        totalPages,
        totalPapers,
      },
      data: papers,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get aggregate stats for Admin & Landing Hub
// @route   GET /api/past-papers/stats
// @access  Public
const getPastPaperStats = async (req, res, next) => {
  try {
    const totalPapers = await PastPaper.countDocuments({ status: 'published' });
    const olPapers = await PastPaper.countDocuments({ examType: 'OL', status: 'published' });
    const alPapers = await PastPaper.countDocuments({ examType: 'AL', status: 'published' });
    const universityPapers = await PastPaper.countDocuments({ examType: 'UNIVERSITY', status: 'published' });

    const olSubjectsCount = await Subject.countDocuments({ examType: 'OL', active: true });
    const alSubjectsCount = await Subject.countDocuments({ examType: 'AL', active: true });
    const universityCount = await University.countDocuments({ active: true });

    const downloadsAggregate = await PastPaper.aggregate([
      { $group: { _id: null, totalDownloads: { $sum: '$downloadCount' } } },
    ]);

    const totalDownloads = downloadsAggregate[0]?.totalDownloads || 0;

    res.status(200).json({
      success: true,
      data: {
        totalPapers,
        olPapers,
        alPapers,
        universityPapers,
        olSubjectsCount,
        alSubjectsCount,
        universityCount,
        totalDownloads,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single past paper by slug
// @route   GET /api/past-papers/slug/:slug
// @access  Public
const getPastPaperBySlug = async (req, res, next) => {
  try {
    const paper = await PastPaper.findOne({
      slug: req.params.slug.toLowerCase(),
    })
      .populate('subjectId', 'name slug icon')
      .populate('universityId', 'name slug logo')
      .populate('courseId', 'name slug')
      .populate('moduleId', 'name slug code')
      .populate('relatedPaperId', 'title slug paperType resourceType fileUrl');

    if (!paper) {
      res.status(404);
      throw new Error(`Past paper with slug '${req.params.slug}' not found`);
    }

    // Related papers from same subject / examType
    const relatedQuery = {
      _id: { $ne: paper._id },
      examType: paper.examType,
      status: 'published',
    };
    if (paper.subjectId) {
      relatedQuery.subjectId = paper.subjectId;
    } else {
      relatedQuery.subject = paper.subject;
    }

    const relatedPapers = await PastPaper.find(relatedQuery)
      .limit(4)
      .sort({ year: -1 });

    // Previous year paper
    const previousPaper = await PastPaper.findOne({
      ...relatedQuery,
      year: { $lt: paper.year },
    }).sort({ year: -1 });

    // Next year paper
    const nextPaper = await PastPaper.findOne({
      ...relatedQuery,
      year: { $gt: paper.year },
    }).sort({ year: 1 });

    // Automatic Marking Scheme / Question Paper link if not explicitly set
    let linkedScheme = paper.relatedPaperId;
    if (!linkedScheme) {
      const schemeQuery = {
        _id: { $ne: paper._id },
        subject: paper.subject,
        year: paper.year,
        examType: paper.examType,
        status: 'published',
      };
      if (paper.paperType === 'Marking Scheme' || paper.resourceType === 'Marking Scheme') {
        schemeQuery.paperType = { $ne: 'Marking Scheme' };
      } else {
        schemeQuery.$or = [{ paperType: 'Marking Scheme' }, { resourceType: 'Marking Scheme' }];
      }
      linkedScheme = await PastPaper.findOne(schemeQuery);
    }

    res.status(200).json({
      success: true,
      data: paper,
      related: relatedPapers,
      previousPaper: previousPaper ? { title: previousPaper.title, slug: previousPaper.slug, year: previousPaper.year } : null,
      nextPaper: nextPaper ? { title: nextPaper.title, slug: nextPaper.slug, year: nextPaper.year } : null,
      linkedScheme: linkedScheme ? { title: linkedScheme.title, slug: linkedScheme.slug, paperType: linkedScheme.paperType, resourceType: linkedScheme.resourceType } : null,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Download PDF file & increment download counter
// @route   GET /api/past-papers/:id/download
// @access  Public
const downloadPastPaper = async (req, res, next) => {
  try {
    const paper = await PastPaper.findById(req.params.id);

    if (!paper) {
      res.status(404);
      throw new Error('Past paper record not found');
    }

    // Increment download count
    await PastPaper.findByIdAndUpdate(req.params.id, {
      $inc: { downloadCount: 1 },
    });

    if (!paper.fileUrl) {
      res.status(404);
      throw new Error('PDF document URL is missing.');
    }

    return res.redirect(paper.fileUrl);
  } catch (error) {
    next(error);
  }
};

// @desc    Create / Upload new past paper
// @route   POST /api/past-papers
// @access  Private/Admin
const createPastPaper = async (req, res, next) => {
  try {
    const {
      title,
      slug,
      examType,
      level,
      stream,
      subject,
      subjectId,
      universityId,
      courseId,
      moduleId,
      year,
      medium,
      paperType,
      term,
      description,
      source,
      permissionConfirmed,
      status,
    } = req.body;

    const isPermissionConfirmed =
      permissionConfirmed === true || permissionConfirmed === 'true';

    if (!isPermissionConfirmed) {
      res.status(400);
      throw new Error(
        'You must explicitly confirm that you have permission to distribute this file.'
      );
    }

    if (!title || !examType || !subject || !year || !medium) {
      res.status(400);
      throw new Error(
        'Please provide title, examType, subject, year, and medium.'
      );
    }

    if (!req.file) {
      res.status(400);
      throw new Error('Please upload a PDF document file.');
    }

    // Generate clean slug
    const finalSlug = slug
      ? slug
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')
      : `${year}-${examType.toLowerCase()}-${subject
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')}-${medium.toLowerCase()}-medium`
          .replace(/(^-|-$)/g, '');

    // Check duplicate slug
    const existing = await PastPaper.findOne({ slug: finalSlug });
    if (existing) {
      res.status(400);
      throw new Error(`Past paper with slug '${finalSlug}' already exists.`);
    }

    // Cloudinary folder
    const examFolder = ['ol', 'al', 'university'].includes(examType.toLowerCase())
      ? examType.toLowerCase()
      : 'other';

    const cloudinaryFolder = `edutools-lk/past-papers/${examFolder}`;

    // Upload PDF to Cloudinary
    const cloudinaryResult = await uploadToCloudinary(
      req.file.buffer,
      cloudinaryFolder,
      req.file.originalname
    );

    // Resolve subjectId if missing
    let resolvedSubjectId = subjectId || null;
    if (!resolvedSubjectId && ['OL', 'AL'].includes(examType.toUpperCase())) {
      const subjectDoc = await Subject.findOne({
        examType: examType.toUpperCase(),
        name: { $regex: new RegExp(`^${subject}$`, 'i') },
      });
      if (subjectDoc) {
        resolvedSubjectId = subjectDoc._id;
      }
    }

    const paper = await PastPaper.create({
      title,
      slug: finalSlug,
      examType: examType.toUpperCase(),
      level: level || examType,
      stream: stream || 'General',
      subject,
      subjectId: resolvedSubjectId,
      universityId: universityId || null,
      courseId: courseId || null,
      moduleId: moduleId || null,
      year: Number(year),
      medium,
      paperType: paperType || 'Past Paper',
      term: term || 'Final',
      description: description || '',
      fileUrl: cloudinaryResult.secure_url,
      cloudinaryPublicId: cloudinaryResult.public_id,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      status: status || 'published',
      source: source || 'Official Exam Board',
      permissionConfirmed: true,
      uploadedBy: req.user?._id,
    });

    res.status(201).json({
      success: true,
      message: 'Past paper uploaded successfully to Cloudinary',
      data: paper,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update past paper metadata or file (SAFE CLOUDINARY FILE SWAP SEQUENCE)
// @route   PUT /api/past-papers/:id
// @access  Private/Admin
const updatePastPaper = async (req, res, next) => {
  try {
    let paper = await PastPaper.findById(req.params.id);

    if (!paper) {
      res.status(404);
      throw new Error('Past paper not found');
    }

    const oldCloudinaryPublicId = paper.cloudinaryPublicId;

    if (req.body.slug) {
      req.body.slug = req.body.slug
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    // SAFE CLOUDINARY REPLACEMENT: Upload new file first!
    if (req.file) {
      const examType = (req.body.examType || paper.examType).toLowerCase();
      const examFolder = ['ol', 'al', 'university'].includes(examType)
        ? examType
        : 'other';

      const cloudinaryFolder = `edutools-lk/past-papers/${examFolder}`;

      // Step 1: Upload new file to Cloudinary first
      const cloudinaryResult = await uploadToCloudinary(
        req.file.buffer,
        cloudinaryFolder,
        req.file.originalname
      );

      // Step 2: Attach new file URLs to update body
      req.body.fileUrl = cloudinaryResult.secure_url;
      req.body.cloudinaryPublicId = cloudinaryResult.public_id;
      req.body.fileName = req.file.originalname;
      req.body.fileSize = req.file.size;
    }

    // Step 3: Update MongoDB record
    paper = await PastPaper.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    // Step 4: ONLY after DB update succeeds, destroy the old Cloudinary file
    if (req.file && oldCloudinaryPublicId && oldCloudinaryPublicId !== paper.cloudinaryPublicId) {
      await deleteStoredFile(oldCloudinaryPublicId);
    }

    res.status(200).json({
      success: true,
      message: 'Past paper updated successfully',
      data: paper,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete past paper & remove Cloudinary file
// @route   DELETE /api/past-papers/:id
// @access  Private/Admin
const deletePastPaper = async (req, res, next) => {
  try {
    const paper = await PastPaper.findById(req.params.id);

    if (!paper) {
      res.status(404);
      throw new Error('Past paper not found');
    }

    if (paper.cloudinaryPublicId) {
      await deleteStoredFile(paper.cloudinaryPublicId);
    }

    await paper.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Past paper deleted successfully',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle past paper status (published / draft)
// @route   PATCH /api/past-papers/:id/status
// @access  Private/Admin
const togglePastPaperStatus = async (req, res, next) => {
  try {
    const paper = await PastPaper.findById(req.params.id);
    if (!paper) {
      res.status(404);
      throw new Error('Past paper not found');
    }

    paper.status = paper.status === 'published' ? 'draft' : 'published';
    await paper.save();

    res.status(200).json({
      success: true,
      message: `Past paper status updated to ${paper.status}`,
      data: paper,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Auto-import past papers in batches (2016-2025) from PaperZone
// @route   POST /api/past-papers/auto-import
// @access  Private/Admin
const autoImportPastPapers = async (req, res, next) => {
  try {
    const { startYear = 2016, endYear = 2025, batchSize = 10, cursor = 0 } = req.body || {};
    const userId = req.user?._id;

    const { autoImportPastPapersService } = require('../utils/paperzoneImporter');

    const result = await autoImportPastPapersService({
      startYear: Number(startYear),
      endYear: Number(endYear),
      batchSize: Number(batchSize),
      cursor: Number(cursor),
      userId,
    });

    res.status(200).json({
      success: true,
      summary: result.summary,
      nextCursor: result.nextCursor,
      hasMore: result.hasMore,
      failedItems: result.failedItems,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPastPapers,
  getPastPaperStats,
  getPastPaperBySlug,
  downloadPastPaper,
  createPastPaper,
  updatePastPaper,
  deletePastPaper,
  togglePastPaperStatus,
  autoImportPastPapers,
};
