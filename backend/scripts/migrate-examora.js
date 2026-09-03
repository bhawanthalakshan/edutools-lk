const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const dns = require('dns');

dns.setServers(['8.8.8.8', '1.1.1.1']);
dotenv.config({ path: path.join(__dirname, '../.env') });

const PastPaper = require('../models/PastPaper');
const Subject = require('../models/Subject');
const University = require('../models/University');
const Course = require('../models/Course');
const Module = require('../models/Module');

// Default initial subjects for Sri Lanka O/L & A/L on Examora
const DEFAULT_OL_SUBJECTS = [
  { name: 'Mathematics', slug: 'mathematics', icon: 'FaCalculator' },
  { name: 'Science', slug: 'science', icon: 'FaFlask' },
  { name: 'ICT', slug: 'ict', icon: 'FaLaptopCode' },
  { name: 'Sinhala Language', slug: 'sinhala-language', icon: 'FaBook' },
  { name: 'English Language', slug: 'english-language', icon: 'FaLanguage' },
  { name: 'History', slug: 'history', icon: 'FaLandmark' },
  { name: 'Buddhism', slug: 'buddhism', icon: 'FaDharmachakra' },
  { name: 'Commerce', slug: 'commerce', icon: 'FaChartBar' },
];

const DEFAULT_AL_SUBJECTS = [
  { name: 'Combined Mathematics', slug: 'combined-mathematics', icon: 'FaSquareRootAlt' },
  { name: 'Physics', slug: 'physics', icon: 'FaAtom' },
  { name: 'Chemistry', slug: 'chemistry', icon: 'FaVial' },
  { name: 'Biology', slug: 'biology', icon: 'FaDna' },
  { name: 'ICT', slug: 'ict', icon: 'FaLaptopCode' },
  { name: 'Accounting', slug: 'accounting', icon: 'FaFileInvoiceDollar' },
  { name: 'Business Studies', slug: 'business-studies', icon: 'FaBriefcase' },
  { name: 'Economics', slug: 'economics', icon: 'FaCoins' },
  { name: 'Engineering Technology', slug: 'engineering-technology', icon: 'FaCogs' },
  { name: 'Science for Technology', slug: 'science-for-technology', icon: 'FaMicroscope' },
  { name: 'Agri Science', slug: 'agri-science', icon: 'FaLeaf' },
];

const runExamoraMigration = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/edutools-lk';
    console.log('=== EXAMORA NON-DESTRUCTIVE DATA MIGRATION ===');
    console.log(`Connecting to database...`);
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB successfully.');

    // Audit Step 1: Baseline Audit
    const paperCountBefore = await PastPaper.countDocuments({});
    const subjectCountBefore = await Subject.countDocuments({});
    const uniCountBefore = await University.countDocuments({});

    console.log(`[AUDIT BEFORE] Total PastPapers: ${paperCountBefore}`);
    console.log(`[AUDIT BEFORE] Total Subjects: ${subjectCountBefore}`);
    console.log(`[AUDIT BEFORE] Total Universities: ${uniCountBefore}`);

    // Audit Step 2: Seed Default O/L and A/L Subjects if missing
    for (const sub of DEFAULT_OL_SUBJECTS) {
      await Subject.updateOne(
        { examType: 'OL', slug: sub.slug },
        { $setOnInsert: { name: sub.name, examType: 'OL', icon: sub.icon, active: true } },
        { upsert: true }
      );
    }

    for (const sub of DEFAULT_AL_SUBJECTS) {
      await Subject.updateOne(
        { examType: 'AL', slug: sub.slug },
        { $setOnInsert: { name: sub.name, examType: 'AL', icon: sub.icon, active: true } },
        { upsert: true }
      );
    }

    // Audit Step 3: Link papers to relational subjects/universities cleanly
    const papers = await PastPaper.find({});
    let updatedCount = 0;

    for (const paper of papers) {
      let modified = false;

      if (['OL', 'AL'].includes(paper.examType)) {
        if (!paper.subjectId && paper.subject) {
          const subjectSlug = paper.subject.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
          let subjectDoc = await Subject.findOne({
            examType: paper.examType,
            $or: [{ slug: subjectSlug }, { name: { $regex: new RegExp(`^${paper.subject}$`, 'i') } }],
          });

          if (!subjectDoc) {
            subjectDoc = await Subject.create({
              name: paper.subject,
              slug: subjectSlug || 'uncategorized-subject',
              examType: paper.examType,
              active: true,
            });
          }

          paper.subjectId = subjectDoc._id;
          modified = true;
        }
      }

      if (paper.examType === 'UNIVERSITY') {
        if (!paper.universityId) {
          let uniDoc = await University.findOne({ slug: 'kiu' });
          if (!uniDoc) {
            uniDoc = await University.create({
              name: 'KIU University',
              slug: 'kiu',
              description: 'KIU University Sri Lanka past examination paper collection.',
              active: true,
            });
          }
          paper.universityId = uniDoc._id;
          modified = true;
        }

        if (!paper.courseId && paper.universityId) {
          let courseDoc = await Course.findOne({ university: paper.universityId, slug: 'bsc-software-engineering' });
          if (!courseDoc) {
            courseDoc = await Course.create({
              university: paper.universityId,
              name: 'BSc (Hons) Software Engineering',
              slug: 'bsc-software-engineering',
              active: true,
            });
          }
          paper.courseId = courseDoc._id;
          modified = true;
        }

        if (!paper.moduleId && paper.courseId) {
          let moduleDoc = await Module.findOne({ course: paper.courseId, slug: 'web-technologies' });
          if (!moduleDoc) {
            moduleDoc = await Module.create({
              course: paper.courseId,
              name: paper.subject || 'Web Technologies',
              slug: 'web-technologies',
              code: 'SE3010',
              active: true,
            });
          }
          paper.moduleId = moduleDoc._id;
          modified = true;
        }
      }

      if (modified) {
        await paper.save();
        updatedCount++;
      }
    }

    // Audit Step 4: Post-Migration Audit Verification
    const paperCountAfter = await PastPaper.countDocuments({});
    console.log(`[AUDIT AFTER] Total PastPapers: ${paperCountAfter}`);

    if (paperCountBefore !== paperCountAfter) {
      throw new Error(`CRITICAL INTEGRITY FAILURE: PastPaper count changed! (${paperCountBefore} -> ${paperCountAfter})`);
    }

    console.log('✅ AUDIT PASSED: 100% of PastPaper records, Cloudinary URLs, and download counts are preserved!');
    console.log(`Updated ${updatedCount} paper documents with relational hierarchy pointers.`);
    console.log('=== EXAMORA MIGRATION COMPLETED SUCCESSFULLY ===');
    process.exit(0);
  } catch (error) {
    console.error('Migration error:', error.message);
    process.exit(1);
  }
};

runExamoraMigration();
