const path = require('path');
const fs = require('fs');
const PastPaper = require('../models/PastPaper');
const { deleteStoredFile } = require('../utils/storage');

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

    // Atomically increment download count
    paper.downloadCount += 1;
    await paper.save();

    // Construct full file path on server
    const relativePath = paper.fileUrl.startsWith('/') ? paper.fileUrl.substring(1) : paper.fileUrl;
    const filePath = path.join(__dirname, '..', relativePath);

    if (!fs.existsSync(filePath)) {
      res.status(404);
      throw new Error('Requested PDF document file is missing on the server storage.');
    }

    // Sanitize download filename
    const downloadName = paper.fileName || `${paper.slug}.pdf`;

    res.download(filePath, downloadName, (err) => {
      if (err && !res.headersSent) {
        return next(err);
      }
    });
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
      year,
      medium,
      paperType,
      term,
      description,
      source,
      permissionConfirmed,
      status,
    } = req.body;

    // Verify permission confirmation
    const isPermissionConfirmed = permissionConfirmed === true || permissionConfirmed === 'true';
    if (!isPermissionConfirmed) {
      // Unlink uploaded file if permission is not confirmed
      if (req.file) {
        deleteStoredFile(req.file.path);
      }
      res.status(400);
      throw new Error('You must explicitly confirm that you have permission to distribute this file.');
    }

    if (!title || !examType || !subject || !year || !medium) {
      if (req.file) deleteStoredFile(req.file.path);
      res.status(400);
      throw new Error('Please provide title, examType, subject, year, and medium.');
    }

    if (!req.file && !req.body.fileUrl) {
      res.status(400);
      throw new Error('Please upload a PDF document file.');
    }

    // Auto-generate slug if not provided
    const finalSlug = slug
      ? slug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      : `${year}-${examType.toLowerCase()}-${subject.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${medium.toLowerCase()}-medium`
          .toLowerCase()
          .replace(/(^-|-$)/g, '');

    // Check slug uniqueness
    const existing = await PastPaper.findOne({ slug: finalSlug });
    if (existing) {
      if (req.file) deleteStoredFile(req.file.path);
      res.status(400);
      throw new Error(`Past paper with slug '${finalSlug}' already exists.`);
    }

    // Determine storage fileUrl
    let fileUrl = '';
    let fileName = '';
    let fileSize = 0;

    if (req.file) {
      const examFolder = ['ol', 'al', 'university'].includes(examType.toLowerCase())
        ? examType.toLowerCase()
        : 'ol';
      fileUrl = `/uploads/past-papers/${examFolder}/${req.file.filename}`;
      fileName = req.file.originalname;
      fileSize = req.file.size;
    } else {
      fileUrl = req.body.fileUrl;
      fileName = req.body.fileName || `${finalSlug}.pdf`;
      fileSize = req.body.fileSize || 0;
    }

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
      fileUrl,
      fileName,
      fileSize,
      status: status || 'published',
      source: source || 'Official Exam Board',
      permissionConfirmed: true,
      uploadedBy: req.user?._id,
    });

    res.status(201).json({
      success: true,
      message: 'Past paper uploaded successfully',
      data: paper,
    });
  } catch (error) {
    if (req.file) deleteStoredFile(req.file.path);
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
      if (req.file) deleteStoredFile(req.file.path);
      res.status(404);
      throw new Error('Past paper not found');
    }

    if (req.body.slug) {
      req.body.slug = req.body.slug.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }

    // Handle new file upload if provided
    if (req.file) {
      // Unlink old file
      deleteStoredFile(paper.fileUrl);

      const examType = req.body.examType || paper.examType;
      const examFolder = ['ol', 'al', 'university'].includes(examType.toLowerCase())
        ? examType.toLowerCase()
        : 'ol';
      req.body.fileUrl = `/uploads/past-papers/${examFolder}/${req.file.filename}`;
      req.body.fileName = req.file.originalname;
      req.body.fileSize = req.file.size;
    }

    paper = await PastPaper.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Past paper updated successfully',
      data: paper,
    });
  } catch (error) {
    if (req.file) deleteStoredFile(req.file.path);
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

    // Delete file from storage
    deleteStoredFile(paper.fileUrl);

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
