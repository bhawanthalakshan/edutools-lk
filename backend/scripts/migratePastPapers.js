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

// Default initial subjects for Sri Lanka O/L & A/L
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

const migrateData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/edutools-lk';
    console.log('--- PAST PAPERS MIGRATION START ---');
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB successfully.');

    // Step 1: Pre-migration Audit
    const totalCountInitial = await PastPaper.countDocuments({});
    console.log(`[AUDIT BEFORE] Total PastPaper records: ${totalCountInitial}`);

    const sampleBefore = await PastPaper.find({}).select('title fileUrl cloudinaryPublicId downloadCount').limit(5);
    console.log('[AUDIT BEFORE] Sample paper references:', JSON.stringify(sampleBefore, null, 2));

    // Step 2: Seed default subjects if empty
    console.log('Ensuring default O/L subjects exist...');
    for (const sub of DEFAULT_OL_SUBJECTS) {
      await Subject.updateOne(
        { examType: 'OL', slug: sub.slug },
        { $setOnInsert: { name: sub.name, examType: 'OL', icon: sub.icon } },
        { upsert: true }
      );
    }

    console.log('Ensuring default A/L subjects exist...');
    for (const sub of DEFAULT_AL_SUBJECTS) {
      await Subject.updateOne(
        { examType: 'AL', slug: sub.slug },
        { $setOnInsert: { name: sub.name, examType: 'AL', icon: sub.icon } },
        { upsert: true }
      );
    }

    // Step 3: Iterate through existing PastPaper records
    const papers = await PastPaper.find({});
    let updatedCount = 0;

    for (const paper of papers) {
      let modified = false;

      // Handle O/L and A/L papers
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
            });
            console.log(`Created new Subject doc: ${subjectDoc.name} (${paper.examType})`);
          }

          paper.subjectId = subjectDoc._id;
          modified = true;
        }
      }

      // Handle University papers
      if (paper.examType === 'UNIVERSITY') {
        if (!paper.universityId) {
          let uniDoc = await University.findOne({ slug: 'general-university' });
          if (!uniDoc) {
            uniDoc = await University.create({
              name: 'General University Resources',
              slug: 'general-university',
              description: 'General undergraduate university past papers and study materials.',
            });
          }
          paper.universityId = uniDoc._id;
          modified = true;
        }

        if (!paper.courseId && paper.universityId) {
          let courseDoc = await Course.findOne({ university: paper.universityId, slug: 'general-course' });
          if (!courseDoc) {
            courseDoc = await Course.create({
              university: paper.universityId,
              name: 'General Degree Course',
              slug: 'general-course',
            });
          }
          paper.courseId = courseDoc._id;
          modified = true;
        }

        if (!paper.moduleId && paper.courseId) {
          let moduleDoc = await Module.findOne({ course: paper.courseId, slug: 'general-module' });
          if (!moduleDoc) {
            moduleDoc = await Module.create({
              course: paper.courseId,
              name: paper.subject || 'General Module',
              slug: 'general-module',
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

    console.log(`[MIGRATION SUCCESS] Updated ${updatedCount} paper documents with relational links.`);

    // Step 4: Post-migration Audit & Integrity Check
    const totalCountFinal = await PastPaper.countDocuments({});
    console.log(`[AUDIT AFTER] Total PastPaper records: ${totalCountFinal}`);

    if (totalCountInitial !== totalCountFinal) {
      console.error('CRITICAL WARNING: Paper counts mismatch before and after migration!');
    } else {
      console.log('✅ AUDIT PASSED: 100% of PastPaper records preserved!');
    }

    const sampleAfter = await PastPaper.find({}).select('title fileUrl cloudinaryPublicId downloadCount subjectId').limit(5);
    console.log('[AUDIT AFTER] Sample paper references:', JSON.stringify(sampleAfter, null, 2));

    console.log('--- PAST PAPERS MIGRATION END ---');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

migrateData();
