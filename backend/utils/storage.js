const fs = require('fs');
const path = require('path');
const multer = require('multer');
const crypto = require('crypto');

// Max file size limit from environment variable (default: 10MB)
const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE, 10) || 10 * 1024 * 1024;

// Ensure uploads subdirectories exist
const ensureDirExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Disk Storage Engine for local uploads (Organized into ol, al, university)
const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const examType = (req.body.examType || 'OL').toLowerCase();
    const targetFolder = ['ol', 'al', 'university'].includes(examType) ? examType : 'ol';
    const uploadPath = path.join(__dirname, '..', 'uploads', 'past-papers', targetFolder);
    
    ensureDirExists(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generate safe filename: <hash>-<timestamp>.pdf
    const randomHash = crypto.randomBytes(6).toString('hex');
    const sanitizedOriginal = file.originalname.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
    const filename = `${sanitizedOriginal}-${randomHash}-${Date.now()}.pdf`;
    cb(null, filename);
  },
});

// File Filter: Enforce PDF only
const pdfFileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const isPdfMime = file.mimetype === 'application/pdf';
  const isPdfExt = ext === '.pdf';

  if (isPdfMime && isPdfExt) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file format. Only PDF (.pdf) documents are permitted for past papers.'), false);
  }
};

// Multer Middleware Export
const uploadPdf = multer({
  storage: diskStorage,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
  fileFilter: pdfFileFilter,
});

// Helper abstraction to delete a file from storage (supports local, expandable to Cloudinary/S3)
const deleteStoredFile = (relativeOrAbsolutePath) => {
  if (!relativeOrAbsolutePath) return;
  try {
    const fullPath = path.isAbsolute(relativeOrAbsolutePath)
      ? relativeOrAbsolutePath
      : path.join(__dirname, '..', relativeOrAbsolutePath.replace(/^\//, ''));

    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  } catch (err) {
    console.error('Storage File Unlink Error:', err.message);
  }
};

module.exports = {
  uploadPdf,
  deleteStoredFile,
  MAX_FILE_SIZE,
};
