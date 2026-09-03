const PaperRequest = require('../models/PaperRequest');
const PaperContribution = require('../models/PaperContribution');
const ContentReport = require('../models/ContentReport');
const ExamSchedule = require('../models/ExamSchedule');
const PastPaper = require('../models/PastPaper');
const { uploadToCloudinary } = require('../utils/storage');

// ----------------------------------------------------
// 1. PAPER REQUESTS
// ----------------------------------------------------

// @desc    Submit a missing paper request
// @route   POST /api/interactions/requests
// @access  Public
const createPaperRequest = async (req, res, next) => {
  try {
    const { examType, subject, year, medium, paperType, university, course, module, email, message } = req.body;

    if (!examType || !subject || !year || !medium || !email) {
      res.status(400);
      throw new Error('Please provide exam type, subject, year, medium, and email');
    }

    const newRequest = await PaperRequest.create({
      examType: examType.toUpperCase(),
      subject,
      year: Number(year),
      medium,
      paperType: paperType || 'Past Paper',
      university: university || '',
      course: course || '',
      module: module || '',
      email,
      message: message || '',
    });

    res.status(201).json({
      success: true,
      message: 'Paper request submitted successfully. Our team will notify you when added.',
      data: newRequest,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all paper requests (Admin)
// @route   GET /api/interactions/requests
// @access  Private/Admin
const getPaperRequests = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = {};
    if (status) query.status = status;

    const requests = await PaperRequest.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update paper request status (Admin)
// @route   PUT /api/interactions/requests/:id
// @access  Private/Admin
const updatePaperRequestStatus = async (req, res, next) => {
  try {
    const { status, adminNotes } = req.body;
    const item = await PaperRequest.findById(req.params.id);

    if (!item) {
      res.status(404);
      throw new Error('Paper request not found');
    }

    if (status) item.status = status;
    if (adminNotes !== undefined) item.adminNotes = adminNotes;

    await item.save();

    res.status(200).json({
      success: true,
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

// ----------------------------------------------------
// 2. PAPER CONTRIBUTIONS (USER UPLOADS)
// ----------------------------------------------------

// @desc    Submit a paper contribution with PDF file
// @route   POST /api/interactions/contributions
// @access  Public
const submitPaperContribution = async (req, res, next) => {
  try {
    const { name, email, examType, subject, year, medium, paperType, notes } = req.body;

    if (!email || !examType || !subject || !year || !medium || !req.file) {
      res.status(400);
      throw new Error('Please fill in required fields and attach a PDF document');
    }

    const uploadResult = await uploadToCloudinary(req.file.buffer, 'examora/contributions', req.file.originalname);

    const contribution = await PaperContribution.create({
      name: name || 'Anonymous Student',
      email,
      examType: examType.toUpperCase(),
      subject,
      year: Number(year),
      medium,
      paperType: paperType || 'Past Paper',
      fileUrl: uploadResult.secure_url,
      cloudinaryPublicId: uploadResult.public_id || '',
      fileName: req.file.originalname,
      fileSize: req.file.size,
      notes: notes || '',
      status: 'pending',
    });

    res.status(201).json({
      success: true,
      message: 'Paper contribution submitted for review. Thank you for supporting Sri Lankan students!',
      data: contribution,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all paper contributions (Admin)
// @route   GET /api/interactions/contributions
// @access  Private/Admin
const getPaperContributions = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = {};
    if (status) query.status = status;

    const contributions = await PaperContribution.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: contributions.length,
      data: contributions,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Moderate contribution (Approve & Publish to PastPaper collection, or Reject)
// @route   PUT /api/interactions/contributions/:id
// @access  Private/Admin
const moderatePaperContribution = async (req, res, next) => {
  try {
    const { action, adminNotes } = req.body; // action: 'approve' or 'reject'
    const item = await PaperContribution.findById(req.params.id);

    if (!item) {
      res.status(404);
      throw new Error('Contribution record not found');
    }

    if (action === 'approve') {
      const slug = `${item.year}-${item.examType.toLowerCase()}-${item.subject.toLowerCase()}-${item.medium.toLowerCase()}-${item.paperType.toLowerCase()}`
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      // Check slug uniqueness
      let uniqueSlug = slug;
      const count = await PastPaper.countDocuments({ slug: uniqueSlug });
      if (count > 0) uniqueSlug = `${slug}-${Date.now()}`;

      await PastPaper.create({
        title: `${item.year} ${item.examType} ${item.subject} ${item.paperType} (${item.medium})`,
        slug: uniqueSlug,
        examType: item.examType,
        subject: item.subject,
        year: item.year,
        medium: item.medium,
        paperType: item.paperType,
        fileUrl: item.fileUrl,
        cloudinaryPublicId: item.cloudinaryPublicId,
        fileName: item.fileName,
        fileSize: item.fileSize,
        source: `Community Contribution by ${item.name}`,
        sourceType: 'Community Contribution',
        verificationStatus: 'Community Upload',
        permissionConfirmed: true,
        status: 'published',
      });

      item.status = 'approved';
    } else if (action === 'reject') {
      item.status = 'rejected';
    }

    if (adminNotes !== undefined) item.adminNotes = adminNotes;
    await item.save();

    res.status(200).json({
      success: true,
      message: action === 'approve' ? 'Contribution approved and published to Past Papers!' : 'Contribution marked as rejected.',
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

// ----------------------------------------------------
// 3. CONTENT REPORTS (REPORT A PROBLEM)
// ----------------------------------------------------

// @desc    Report an issue on a paper page
// @route   POST /api/interactions/reports
// @access  Public
const createContentReport = async (req, res, next) => {
  try {
    const { paperId, paperTitle, reason, details, userEmail } = req.body;

    if (!paperId || !reason) {
      res.status(400);
      throw new Error('Paper ID and report reason are required');
    }

    const report = await ContentReport.create({
      paperId,
      paperTitle: paperTitle || '',
      reason,
      details: details || '',
      userEmail: userEmail || '',
    });

    res.status(201).json({
      success: true,
      message: 'Report submitted successfully. Our team will review this paper.',
      data: report,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all content reports (Admin)
// @route   GET /api/interactions/reports
// @access  Private/Admin
const getContentReports = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = {};
    if (status) query.status = status;

    const reports = await ContentReport.find(query).populate('paperId', 'title slug').sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reports.length,
      data: reports,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update content report status (Admin)
// @route   PUT /api/interactions/reports/:id
// @access  Private/Admin
const updateContentReportStatus = async (req, res, next) => {
  try {
    const { status, adminNotes } = req.body;
    const report = await ContentReport.findById(req.params.id);

    if (!report) {
      res.status(404);
      throw new Error('Content report not found');
    }

    if (status) report.status = status;
    if (adminNotes !== undefined) report.adminNotes = adminNotes;

    await report.save();

    res.status(200).json({
      success: true,
      data: report,
    });
  } catch (error) {
    next(error);
  }
};

// ----------------------------------------------------
// 4. EXAM SCHEDULES & COUNTDOWNS
// ----------------------------------------------------

// @desc    Get active verified exam schedules & countdowns
// @route   GET /api/interactions/schedules
// @access  Public
const getExamSchedules = async (req, res, next) => {
  try {
    const schedules = await ExamSchedule.find({ isVerified: true, startDate: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } }).sort({ startDate: 1 });

    res.status(200).json({
      success: true,
      count: schedules.length,
      data: schedules,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create or update exam schedule (Admin)
// @route   POST /api/interactions/schedules
// @access  Private/Admin
const createOrUpdateExamSchedule = async (req, res, next) => {
  try {
    const { id, examType, year, examTitle, startDate, endDate, officialSourceUrl, isVerified, timetable } = req.body;

    let schedule;
    if (id) {
      schedule = await ExamSchedule.findByIdAndUpdate(
        id,
        { examType, year, examTitle, startDate, endDate, officialSourceUrl, isVerified, timetable },
        { new: true }
      );
    } else {
      schedule = await ExamSchedule.create({
        examType,
        year,
        examTitle,
        startDate,
        endDate,
        officialSourceUrl,
        isVerified,
        timetable: timetable || [],
      });
    }

    res.status(200).json({
      success: true,
      data: schedule,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
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
};
