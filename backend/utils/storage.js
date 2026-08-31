const multer = require('multer');
const path = require('path');
const cloudinary = require('./cloudinary');

const MAX_FILE_SIZE =
  parseInt(process.env.MAX_FILE_SIZE, 10) || 10 * 1024 * 1024;

// Use memory storage because the PDF will be uploaded directly to Cloudinary.
const memoryStorage = multer.memoryStorage();

// PDF-only validation
const pdfFileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const isPdfMime = file.mimetype === 'application/pdf';
  const isPdfExt = ext === '.pdf';

  if (isPdfMime && isPdfExt) {
    cb(null, true);
  } else {
    cb(
      new Error(
        'Invalid file format. Only PDF (.pdf) documents are permitted for past papers.'
      ),
      false
    );
  }
};

const uploadPdf = multer({
  storage: memoryStorage,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
  fileFilter: pdfFileFilter,
});

// Upload PDF buffer to Cloudinary
const uploadToCloudinary = (buffer, folder, originalName) => {
  return new Promise((resolve, reject) => {
    const safeName = path
      .basename(originalName, path.extname(originalName))
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const publicId = `${safeName}-${Date.now()}`;

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: publicId,
        resource_type: 'raw',
        format: 'pdf',
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    uploadStream.end(buffer);
  });
};

// Delete PDF from Cloudinary
const deleteStoredFile = async (publicId) => {
  if (!publicId) return;

  try {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: 'raw',
    });
  } catch (error) {
    console.error('Cloudinary File Delete Error:', error.message);
  }
};

module.exports = {
  uploadPdf,
  uploadToCloudinary,
  deleteStoredFile,
  MAX_FILE_SIZE,
};