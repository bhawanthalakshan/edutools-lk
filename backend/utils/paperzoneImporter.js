const crypto = require('crypto');
const PastPaper = require('../models/PastPaper');
const Subject = require('../models/Subject');
const { uploadToCloudinary } = require('./storage');

// Configurable paper sources
const sources = [
  {
    name: 'PaperZone',
    baseUrl: 'https://paperzone.lk',
    sitemapUrl: 'https://paperzone.lk/sitemap.xml',
    apiUrl: 'https://api.paperzone.lk/api/papers',
    enabled: true,
  },
];

// Helper delay to prevent aggressive requests
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Short-lived in-memory cache for paper discovery (optimization only)
let discoveryCache = {
  key: null,
  data: null,
  timestamp: 0,
};
const DISCOVERY_CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

// Helper HTTP fetcher using global fetch
const fetchText = async (url, options = {}) => {
  const headers = {
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 EduToolsLK-Importer/1.0',
    Accept: 'application/json,text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} ${response.statusText} from ${url}`);
  }
  return await response.text();
};

// Helper buffer fetcher for PDF downloads
const fetchBuffer = async (url, options = {}) => {
  const headers = {
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 EduToolsLK-Importer/1.0',
    Accept: 'application/pdf,*/*',
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} ${response.statusText} when fetching file from ${url}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
};

// Validate that buffer starts with %PDF- (magic bytes 0x25 0x50 0x44 0x46)
const isPdfBuffer = (buffer) => {
  if (!buffer || buffer.length < 4) return false;
  return (
    buffer[0] === 0x25 && // %
    buffer[1] === 0x50 && // P
    buffer[2] === 0x44 && // D
    buffer[3] === 0x46    // F
  );
};

// Normalize Exam Type (OL or AL)
const normalizeExamType = (str) => {
  if (!str) return 'OL';
  const upper = str.toUpperCase();
  if (upper.includes('AL') || upper.includes('A/L') || upper.includes('ADVANCED')) return 'AL';
  if (upper.includes('OL') || upper.includes('O/L') || upper.includes('ORDINARY')) return 'OL';
  return 'OL';
};

// Normalize Medium
const normalizeMedium = (str) => {
  if (!str) return 'English';
  const lower = str.toLowerCase();
  if (lower.includes('sinhala') || lower.includes('si')) return 'Sinhala';
  if (lower.includes('tamil') || lower.includes('ta')) return 'Tamil';
  return 'English';
};

// Normalize Paper Type / Resource Type
const normalizePaperType = (str) => {
  if (!str) return 'Past Paper';
  const lower = str.toLowerCase();
  if (lower.includes('scheme') || lower.includes('marking')) return 'Marking Scheme';
  if (lower.includes('model')) return 'Model Paper';
  if (lower.includes('term')) return 'Term Test';
  if (lower.includes('paper 1') || lower.includes('paper i') || lower.includes('mcq')) return 'Paper I';
  if (lower.includes('paper 2') || lower.includes('paper ii') || lower.includes('essay')) return 'Paper II';
  return 'Past Paper';
};

// Generate clean slug
const generateUniqueSlug = async (year, examType, subject, medium, paperType) => {
  const base = `${year}-${examType.toLowerCase()}-${subject
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')}-${medium.toLowerCase()}-${paperType
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')}`.replace(/(^-|-$)/g, '');

  let slug = base;
  let counter = 1;
  while (await PastPaper.findOne({ slug })) {
    slug = `${base}-${counter}`;
    counter++;
  }
  return slug;
};

/**
 * Fetch raw items from a single PaperZone API page
 */
const fetchPaperZoneApiPage = async (pageNumber) => {
  const apiUrl = `https://api.paperzone.lk/api/papers?page=${pageNumber}`;
  try {
    const jsonText = await fetchText(apiUrl, {
      headers: { Accept: 'application/json' },
    });
    const responseData = JSON.parse(jsonText);
    return {
      data: responseData?.data || [],
      lastPage: responseData?.meta?.last_page || 1,
    };
  } catch (pageErr) {
    console.warn(`[AutoImport API] Page ${pageNumber} fetch warning:`, pageErr.message);
    return { data: [], lastPage: 1 };
  }
};

/**
 * Discover PaperZone resources via API
 * Filtering strictly for 2016-2025 and O/L & A/L (No University papers)
 */
const discoverPaperZoneResources = async (startYear = 2016, endYear = 2025) => {
  const cacheKey = `${startYear}-${endYear}`;
  if (
    discoveryCache.key === cacheKey &&
    discoveryCache.data &&
    Date.now() - discoveryCache.timestamp < DISCOVERY_CACHE_TTL_MS
  ) {
    return discoveryCache.data;
  }

  const finalPaperItems = [];
  const itemKeys = new Set();

  try {
    const firstPageResult = await fetchPaperZoneApiPage(1);
    const lastPage = firstPageResult.lastPage;
    let allRawItems = [...firstPageResult.data];

    if (lastPage > 1) {
      const pageNumbers = [];
      for (let p = 2; p <= lastPage; p++) pageNumbers.push(p);

      const chunkSize = 5;
      for (let i = 0; i < pageNumbers.length; i += chunkSize) {
        const chunk = pageNumbers.slice(i, i + chunkSize);
        const chunkResults = await Promise.all(chunk.map((p) => fetchPaperZoneApiPage(p)));
        for (const res of chunkResults) {
          allRawItems.push(...res.data);
        }
      }
    }

    for (const item of allRawItems) {
      const itemYear = parseInt(item.year, 10);
      if (!itemYear || itemYear < startYear || itemYear > endYear) continue;

      const gradeName = (item.grade_name || '').toUpperCase();
      const combinedText = `${item.title || ''} ${item.description || ''}`.toUpperCase();

      // Requirement 12: Strict University exclusion
      if (
        gradeName.includes('UNI') ||
        gradeName.includes('DEGREE') ||
        combinedText.includes('UNIVERSITY') ||
        combinedText.includes('DEGREE')
      ) {
        continue;
      }

      let examType = null;
      if (gradeName.includes('A/L') || gradeName.includes('AL') || item.grade_id === 11 || item.grade_id === 13) {
        examType = 'AL';
      } else if (gradeName.includes('O/L') || gradeName.includes('OL') || item.grade_id === 10) {
        examType = 'OL';
      }

      if (!examType) {
        if (combinedText.includes('A/L') || combinedText.includes('AL')) examType = 'AL';
        else if (combinedText.includes('O/L') || combinedText.includes('OL')) examType = 'OL';
      }

      // Skip if not strictly OL or AL
      if (!examType || (examType !== 'OL' && examType !== 'AL')) continue;

      let fileUrl = item.file_path || item.pdf_url || item.url;
      if (!fileUrl) continue;
      if (!fileUrl.startsWith('http')) {
        fileUrl = new URL(fileUrl, 'https://paperzone.lk').toString();
      }

      const subject = item.subject_name || item.title || 'General';
      const medium = normalizeMedium(item.medium);
      const isMarking =
        item.is_marking_scheme === 1 ||
        item.paper_type === 'marking' ||
        (item.title || '').toLowerCase().includes('marking');
      const paperType = isMarking ? 'Marking Scheme' : 'Past Paper';

      const sourcePageUrl = `https://paperzone.lk/papers?grade=${examType}&subject=${encodeURIComponent(
        subject
      )}&year=${itemYear}`;
      const key = `${examType}-${itemYear}-${subject.toLowerCase()}-${medium}-${paperType}-${fileUrl}`;

      if (!itemKeys.has(key)) {
        itemKeys.add(key);
        finalPaperItems.push({
          sourceUrl: sourcePageUrl,
          downloadUrl: fileUrl,
          title: item.title || `${itemYear} G.C.E. ${examType} ${subject} (${medium} Medium)`,
          examType,
          year: itemYear,
          subject: subject.trim(),
          medium,
          paperType,
          stream: item.description || 'General',
        });
      }
    }
  } catch (apiErr) {
    console.warn('[AutoImport API] Discovery warning:', apiErr.message);
  }

  discoveryCache = {
    key: cacheKey,
    data: finalPaperItems,
    timestamp: Date.now(),
  };

  return finalPaperItems;
};

/**
 * Main Auto-Import Service: Processes ONE bounded batch per call
 */
const autoImportPastPapersService = async ({
  startYear = 2016,
  endYear = 2025,
  batchSize = 10,
  cursor = 0,
  userId = null,
} = {}) => {
  const parsedBatchSize = Math.max(1, Math.min(Number(batchSize) || 10, 50));
  const parsedCursor = Math.max(0, Number(cursor) || 0);

  const stats = {
    discovered: 0,
    imported: 0,
    skipped: 0,
    failed: 0,
    failedItems: [],
  };

  const discoveredItems = await discoverPaperZoneResources(startYear, endYear);
  const totalDiscovered = discoveredItems.length;
  stats.discovered = totalDiscovered;

  if (parsedCursor >= totalDiscovered) {
    return {
      success: true,
      summary: {
        discovered: totalDiscovered,
        imported: 0,
        skipped: 0,
        failed: 0,
      },
      nextCursor: parsedCursor,
      hasMore: false,
      failedItems: [],
    };
  }

  const batchItems = discoveredItems.slice(parsedCursor, parsedCursor + parsedBatchSize);

  // Pre-cache subjects by name & examType
  const existingSubjects = await Subject.find({});
  const subjectMap = new Map();
  existingSubjects.forEach((s) => {
    subjectMap.set(`${s.examType}-${s.name.toLowerCase()}`, s._id);
  });

  const startTime = Date.now();
  const MAX_BATCH_TIME_MS = 8000; // 8 seconds timeout guard for serverless
  let processedCount = 0;

  for (let i = 0; i < batchItems.length; i++) {
    if (Date.now() - startTime > MAX_BATCH_TIME_MS) {
      console.log(`[AutoImport Batch] Time limit reached (${Date.now() - startTime}ms). Yielding batch early.`);
      break;
    }

    const item = batchItems[i];
    processedCount++;

    try {
      // Duplicate Check 1: DB Lookup by sourceUrl, fileUrl, or metadata match
      const existingRecord = await PastPaper.findOne({
        $or: [
          { sourceUrl: item.sourceUrl },
          { fileUrl: item.downloadUrl },
          {
            examType: item.examType,
            year: item.year,
            subject: { $regex: new RegExp(`^${item.subject.replace(/[^a-zA-Z0-9\s]/g, '')}$`, 'i') },
            medium: item.medium,
            paperType: item.paperType,
          },
        ],
      });

      if (existingRecord) {
        stats.skipped++;
        console.log(`[AutoImport Batch] Skipped duplicate: ${item.year} ${item.examType} ${item.subject} (${item.medium})`);
        continue;
      }

      // Download PDF document buffer
      let pdfBuffer;
      try {
        pdfBuffer = await fetchBuffer(item.downloadUrl);
      } catch (dlErr) {
        throw new Error(`Failed to download PDF file from ${item.downloadUrl}: ${dlErr.message}`);
      }

      // Validate PDF format using magic bytes
      if (!isPdfBuffer(pdfBuffer)) {
        throw new Error(`Downloaded content from ${item.downloadUrl} is not a valid PDF file.`);
      }

      // Duplicate Check 2: SHA256 File Hash
      const fileHash = crypto.createHash('sha256').update(pdfBuffer).digest('hex');
      const hashRecord = await PastPaper.findOne({ fileHash });
      if (hashRecord) {
        stats.skipped++;
        console.log(`[AutoImport Batch] Skipped duplicate file hash: ${item.year} ${item.subject}`);
        continue;
      }

      // Upload PDF to Cloudinary storage
      const examFolder = item.examType.toLowerCase();
      const cloudinaryFolder = `edutools-lk/past-papers/${examFolder}`;
      const safeFilename = `${item.year}-${item.examType.toLowerCase()}-${item.subject
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')}-${item.medium.toLowerCase()}`.replace(/(^-|-$)/g, '');

      const cloudinaryResult = await uploadToCloudinary(
        pdfBuffer,
        cloudinaryFolder,
        `${safeFilename}.pdf`
      );

      // Resolve subjectId in MongoDB
      let resolvedSubjectId = subjectMap.get(`${item.examType}-${item.subject.toLowerCase()}`) || null;
      if (!resolvedSubjectId) {
        const foundSub = await Subject.findOne({
          examType: item.examType,
          name: { $regex: new RegExp(`^${item.subject}$`, 'i') },
        });
        if (foundSub) {
          resolvedSubjectId = foundSub._id;
          subjectMap.set(`${item.examType}-${item.subject.toLowerCase()}`, foundSub._id);
        }
      }

      // Generate Slug & Create PastPaper Record
      const paperTitle = item.title || `${item.year} G.C.E. ${item.examType} ${item.subject} Past Paper (${item.medium} Medium)`;
      const finalSlug = await generateUniqueSlug(item.year, item.examType, item.subject, item.medium, item.paperType);

      await PastPaper.create({
        title: paperTitle,
        slug: finalSlug,
        examType: item.examType,
        level: item.examType === 'OL' ? 'O/L' : 'A/L',
        stream: item.stream || 'General',
        subject: item.subject,
        subjectId: resolvedSubjectId,
        year: item.year,
        medium: item.medium,
        paperType: item.paperType,
        resourceType: item.paperType,
        term: 'Final',
        description: `Automatically imported past paper from PaperZone repository (${item.year} ${item.examType} ${item.medium} Medium).`,
        fileUrl: cloudinaryResult.secure_url,
        cloudinaryPublicId: cloudinaryResult.public_id,
        fileName: `${finalSlug}.pdf`,
        fileSize: pdfBuffer.length,
        fileHash,
        status: 'draft', // MUST initially be draft per requirement 10
        permissionConfirmed: false, // MUST NOT automatically confirm permission per requirement 10
        source: 'PaperZone Auto Import',
        sourceName: 'PaperZone',
        sourceUrl: item.sourceUrl,
        sourceType: 'Reference Archive',
        verificationStatus: 'Unverified',
        uploadedBy: userId,
      });

      stats.imported++;
      console.log(`[AutoImport Batch] Successfully imported: ${paperTitle}`);
    } catch (paperError) {
      stats.failed++;
      stats.failedItems.push({
        year: item.year || 'N/A',
        subject: item.subject || 'Unknown',
        url: item.sourceUrl || item.downloadUrl || 'N/A',
        error: paperError.message || 'Unknown processing error',
      });
      console.error(`[AutoImport Error] ${item.year} ${item.subject}:`, paperError.message);
    }
  }

  const nextCursor = parsedCursor + processedCount;
  const hasMore = nextCursor < totalDiscovered;

  return {
    success: true,
    summary: {
      discovered: totalDiscovered,
      imported: stats.imported,
      skipped: stats.skipped,
      failed: stats.failed,
    },
    nextCursor,
    hasMore,
    failedItems: stats.failedItems,
  };
};

module.exports = {
  sources,
  discoverPaperZoneResources,
  autoImportPastPapersService,
};
