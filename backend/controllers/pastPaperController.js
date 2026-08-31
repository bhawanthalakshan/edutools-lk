const PastPaper = require('../models/PastPaper');
const {
  uploadToCloudinary,
  deleteStoredFile,
} = require('../utils/storage');

// @desc    Get past papers with filtering, search & pagination
// @route   GET /api/past-papers
// @access  Public
const getPastPapers = async (req, res, next) => {
  try {
    const {
      examType,
      level,
      stream,
      subject,
      year,
      medium,
      paperType,
      term,
      search,
      page = 1,
      limit = 12,
      all,
      sort = '-createdAt',
    } = req.query;

    const query = {};

    // Filter by status (unless admin requests all)
    if (all !== 'true') {
      query.status = 'published';
    }

    if (examType) query.examType = examType.toUpperCase();
    if (level) query.level = { $regex: level, $options: 'i' };
    if (stream) query.stream = { $regex: stream, $options: 'i' };
    if (subject) query.subject = { $regex: subject, $options: 'i' };
    if (year) query.year = Number(year);
    if (medium) query.medium = { $regex: medium, $options: 'i' };
    if (paperType) query.paperType = { $regex: paperType, $options: 'i' };
    if (term) query.term = { $regex: term, $options: 'i' };

    // Search filter across title, subject, description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 12;
    const skip = (pageNum - 1) * limitNum;

    const totalPapers = await PastPaper.countDocuments(query);
    const papers = await PastPaper.find(query)
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

// @desc    Get single past paper by slug
// @route   GET /api/past-papers/:slug
// @access  Public
const getPastPaperBySlug = async (req, res, next) => {
  try {
    const paper = await PastPaper.findOne({
      slug: req.params.slug.toLowerCase(),
    });

    if (!paper) {
      res.status(404);
      throw new Error(`Past paper with slug '${req.params.slug}' not found`);
    }

    res.status(200).json({
      success: true,
      data: paper,
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

    // Make sure a PDF URL exists
    if (!paper.fileUrl) {
      res.status(404);
      throw new Error('PDF document URL is missing.');
    }

    // Debug: show the stored PDF URL in backend terminal
    console.log('DOWNLOAD URL:', paper.fileUrl);

    // Redirect user to the stored Cloudinary PDF
    return res.redirect(paper.fileUrl);
  } catch (error) {
    console.error('DOWNLOAD ERROR:', error.message);
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
      year,
      medium,
      paperType,
      term,
      description,
      source,
      permissionConfirmed,
      status,
    } = req.body;

    // Permission confirmation
    const isPermissionConfirmed =
      permissionConfirmed === true ||
      permissionConfirmed === 'true';

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

    // Generate slug
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
    const existing = await PastPaper.findOne({
      slug: finalSlug,
    });

    if (existing) {
      res.status(400);
      throw new Error(
        `Past paper with slug '${finalSlug}' already exists.`
      );
    }

    // Cloudinary folder
    const examFolder = ['ol', 'al', 'university'].includes(
      examType.toLowerCase()
    )
      ? examType.toLowerCase()
      : 'other';

    const cloudinaryFolder = `edutools-lk/past-papers/${examFolder}`;

    // Upload PDF to Cloudinary
    const cloudinaryResult = await uploadToCloudinary(
      req.file.buffer,
      cloudinaryFolder,
      req.file.originalname
    );

    const paper = await PastPaper.create({
      title,
      slug: finalSlug,
      examType: examType.toUpperCase(),
      level: level || examType,
      stream: stream || 'General',
      subject,
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

// @desc    Update past paper metadata or file
// @route   PUT /api/past-papers/:id
// @access  Private/Admin
const updatePastPaper = async (req, res, next) => {
  try {
    let paper = await PastPaper.findById(req.params.id);

    if (!paper) {
      res.status(404);
      throw new Error('Past paper not found');
    }

    // Update slug if provided
    if (req.body.slug) {
      req.body.slug = req.body.slug
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    // If a new PDF is uploaded
    if (req.file) {
      const examType = (
        req.body.examType || paper.examType
      ).toLowerCase();

      const examFolder = ['ol', 'al', 'university'].includes(examType)
        ? examType
        : 'other';

      const cloudinaryFolder = `edutools-lk/past-papers/${examFolder}`;

      // Upload new PDF first
      const cloudinaryResult = await uploadToCloudinary(
        req.file.buffer,
        cloudinaryFolder,
        req.file.originalname
      );

      // Delete old Cloudinary PDF after successful upload
      if (paper.cloudinaryPublicId) {
        await deleteStoredFile(paper.cloudinaryPublicId);
      }

      req.body.fileUrl = cloudinaryResult.secure_url;
      req.body.cloudinaryPublicId = cloudinaryResult.public_id;
      req.body.fileName = req.file.originalname;
      req.body.fileSize = req.file.size;
    }

    paper = await PastPaper.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: 'Past paper updated successfully',
      data: paper,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete past paper & remove local file
// @route   DELETE /api/past-papers/:id
// @access  Private/Admin
const deletePastPaper = async (req, res, next) => {
  try {
    const paper = await PastPaper.findById(req.params.id);

    if (!paper) {
      res.status(404);
      throw new Error('Past paper not found');
    }

    // Delete PDF from Cloudinary
    if (paper.cloudinaryPublicId) {
      await deleteStoredFile(paper.cloudinaryPublicId);
    }

    // Delete database record
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

module.exports = {
  getPastPapers,
  getPastPaperBySlug,
  downloadPastPaper,
  createPastPaper,
  updatePastPaper,
  deletePastPaper,
  togglePastPaperStatus,
};
