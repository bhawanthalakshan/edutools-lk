const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

const User = require('./models/User');
const Category = require('./models/Category');
const Tool = require('./models/Tool');
const Article = require('./models/Article');
const PastPaper = require('./models/PastPaper');

dotenv.config();

// Helper to ensure sample PDF files exist for demo downloads
const ensureSamplePdf = (relativePath) => {
  const fullPath = path.join(__dirname, relativePath);
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(fullPath)) {
    // Minimal valid PDF binary content for testing
    const samplePdfBuffer = Buffer.from(
      '%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Count 1/Kids[3 0 R]>>endobj\n3 0 obj<</Type/Page/MediaBox[0 0 612 792]/Parent 2 0 R/Resources<<>>>>endobj\nxref\n0 4\n0000000000 65535 f\n0000000009 00000 n\n0000000052 00000 n\n0000000102 00000 n\ntrailer<</Size 4/Root 1 0 R>>\nstartxref\n178\n%%EOF\n'
    );
    fs.writeFileSync(fullPath, samplePdfBuffer);
  }
};

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/edutools-lk';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Category.deleteMany({});
    await Tool.deleteMany({});
    await Article.deleteMany({});
    await PastPaper.deleteMany({});

    console.log('Cleared existing database collections.');

    // 1. Seed Admin User
    const adminUser = await User.create({
      name: 'EduTools Admin',
      email: 'admin@edutools.lk',
      password: 'adminpassword123',
      role: 'admin',
    });
    console.log(`Created default Admin User: ${adminUser.email}`);

    // 2. Seed Categories
    const categoriesData = [
      {
        name: 'O/L',
        slug: 'o-l',
        description: 'Resources and past papers for G.C.E. Ordinary Level students',
        icon: 'FaBookReader',
        type: 'education',
      },
      {
        name: 'A/L',
        slug: 'a-l',
        description: 'Syllabus and revision materials for G.C.E. Advanced Level students',
        icon: 'FaGraduationCap',
        type: 'education',
      },
      {
        name: 'University',
        slug: 'university',
        description: 'Undergraduate lecture notes, GPA tools, and research resources',
        icon: 'FaUniversity',
        type: 'education',
      },
      {
        name: 'IT & Programming',
        slug: 'it-programming',
        description: 'Coding tutorials, web development roadmaps, and cheat sheets',
        icon: 'FaCode',
        type: 'education',
      },
      {
        name: 'AI Tools',
        slug: 'ai-tools',
        description: 'AI-assisted utilities and student learning tools',
        icon: 'FaRobot',
        type: 'ai',
      },
      {
        name: 'AI Guides',
        slug: 'ai-guides',
        description: 'Step-by-step guides on using AI ethically for study routines',
        icon: 'FaBook',
        type: 'ai',
      },
    ];

    const insertedCategories = await Category.insertMany(categoriesData);
    console.log(`Inserted ${insertedCategories.length} categories.`);

    const catMap = {};
    insertedCategories.forEach((cat) => {
      catMap[cat.slug] = cat._id;
    });

    // 3. Seed Tools
    const toolsData = [
      {
        name: 'GPA Calculator',
        slug: 'gpa-calculator',
        description: 'Calculate semester Grade Point Average based on course credits and grades.',
        category: catMap['university'] || null,
        icon: 'FaCalculator',
        status: 'active',
      },
      {
        name: 'CGPA Calculator',
        slug: 'cgpa-calculator',
        description: 'Compute overall Cumulative GPA across all academic years effortlessly.',
        category: catMap['university'] || null,
        icon: 'FaChartLine',
        status: 'active',
      },
      {
        name: 'Percentage Calculator',
        slug: 'percentage-calculator',
        description: 'Quickly calculate exam score percentages, marks distribution, and grade ratios.',
        category: catMap['o-l'] || null,
        icon: 'FaPercent',
        status: 'active',
      },
      {
        name: 'Age Calculator',
        slug: 'age-calculator',
        description: 'Calculate exact age in years, months, days, and hours for official applications.',
        category: catMap['university'] || null,
        icon: 'FaHourglassHalf',
        status: 'active',
      },
      {
        name: 'Word Counter',
        slug: 'word-counter',
        description: 'Count words, characters, sentences, and paragraphs for essays and research papers.',
        category: catMap['university'] || null,
        icon: 'FaFont',
        status: 'active',
      },
      {
        name: 'QR Code Generator',
        slug: 'qr-code-generator',
        description: 'Generate high-quality custom QR codes for study links, assignments, and portfolios.',
        category: catMap['it-programming'] || null,
        icon: 'FaQrcode',
        status: 'active',
      },
    ];

    const insertedTools = await Tool.insertMany(toolsData);
    console.log(`Inserted ${insertedTools.length} tools.`);

    // 4. Seed Articles
    const articlesData = [
      {
        title: 'Top 10 Study Techniques for G.C.E. A/L Exam Success',
        slug: 'top-10-study-techniques-for-gce-al-exam-success',
        excerpt: 'Discover active recall, spaced repetition, and timetable structuring methods proven to boost exam scores.',
        content: 'Comprehensive guide covering active recall, Feynman technique, and pomodoro study routines for Advanced Level students.',
        category: catMap['a-l'],
        tags: ['Study Strategy', 'A/L', 'Exams'],
        author: 'EduTools LK Academic Team',
        status: 'published',
        seoTitle: 'Top A/L Exam Study Techniques - EduTools LK',
        seoDescription: 'Proven study strategies for G.C.E. Advanced Level success.',
      },
      {
        title: 'How to Calculate Your GPA Accurately for University Applications',
        slug: 'how-to-calculate-your-gpa-accurately-for-university-applications',
        excerpt: 'A complete step-by-step breakdown of credit weighting, grade points, and GPA formula calculations.',
        content: 'Detailed tutorial on computing semester GPA and cumulative CGPA using standard credit point tables.',
        category: catMap['university'],
        tags: ['GPA', 'University', 'Calculators'],
        author: 'EduTools LK Team',
        status: 'published',
        seoTitle: 'How to Calculate University GPA - EduTools LK',
        seoDescription: 'Learn step by step how to calculate semester GPA and CGPA.',
      },
      {
        title: 'Ethical AI Tools Every Student Should Master in 2026',
        slug: 'ethical-ai-tools-every-student-should-master-in-2026',
        excerpt: 'Leveraging modern AI assistants for research outline preparation and study material summary creation.',
        content: 'Explore how students can ethically use AI tools for summary generation, study schedule planning, and concept understanding.',
        category: catMap['ai-guides'],
        tags: ['AI', 'Productivity', 'Student Tech'],
        author: 'AI Learning Editor',
        status: 'published',
        seoTitle: 'Ethical AI Tools for Students in 2026 - EduTools LK',
        seoDescription: 'Guide to using artificial intelligence tools ethically in education.',
      },
    ];

    const insertedArticles = await Article.insertMany(articlesData);
    console.log(`Inserted ${insertedArticles.length} sample articles.`);

    // 5. Seed Past Papers (DEMO / SAMPLE RECORDS)
    ensureSamplePdf('uploads/past-papers/ol/2025-ol-mathematics-english.pdf');
    ensureSamplePdf('uploads/past-papers/ol/2024-ol-science-sinhala.pdf');
    ensureSamplePdf('uploads/past-papers/al/2025-al-physics-english.pdf');
    ensureSamplePdf('uploads/past-papers/al/2024-al-chemistry-english.pdf');
    ensureSamplePdf('uploads/past-papers/al/2025-al-ict-english.pdf');

    const pastPapersData = [
      {
        title: '2025 O/L Mathematics Past Paper',
        slug: '2025-ol-mathematics-english-medium',
        examType: 'OL',
        level: 'O/L',
        stream: 'General',
        subject: 'Mathematics',
        year: 2025,
        medium: 'English',
        paperType: 'Past Paper',
        term: 'Final',
        description: 'Official 2025 G.C.E. Ordinary Level Mathematics examination question paper with marking scheme guidelines.',
        fileUrl: '/uploads/past-papers/ol/2025-ol-mathematics-english.pdf',
        fileName: '2025-ol-mathematics-english.pdf',
        fileSize: 1250000,
        downloadCount: 42,
        status: 'published',
        source: 'Department of Examinations, Sri Lanka [Demo Record]',
        permissionConfirmed: true,
        uploadedBy: adminUser._id,
      },
      {
        title: '2024 O/L Science Past Paper',
        slug: '2024-ol-science-sinhala-medium',
        examType: 'OL',
        level: 'O/L',
        stream: 'General',
        subject: 'Science',
        year: 2024,
        medium: 'Sinhala',
        paperType: 'Past Paper',
        term: 'Final',
        description: '2024 G.C.E. O/L Science question paper covering Physics, Chemistry, and Biology sections.',
        fileUrl: '/uploads/past-papers/ol/2024-ol-science-sinhala.pdf',
        fileName: '2024-ol-science-sinhala.pdf',
        fileSize: 1850000,
        downloadCount: 38,
        status: 'published',
        source: 'Department of Examinations, Sri Lanka [Demo Record]',
        permissionConfirmed: true,
        uploadedBy: adminUser._id,
      },
      {
        title: '2025 A/L Physics Past Paper',
        slug: '2025-al-physics-english-medium',
        examType: 'AL',
        level: 'A/L',
        stream: 'Physical Science',
        subject: 'Physics',
        year: 2025,
        medium: 'English',
        paperType: 'Past Paper',
        term: 'Final',
        description: '2025 G.C.E. Advanced Level Physics Paper I & II structured question paper.',
        fileUrl: '/uploads/past-papers/al/2025-al-physics-english.pdf',
        fileName: '2025-al-physics-english.pdf',
        fileSize: 2400000,
        downloadCount: 89,
        status: 'published',
        source: 'Department of Examinations, Sri Lanka [Demo Record]',
        permissionConfirmed: true,
        uploadedBy: adminUser._id,
      },
      {
        title: '2024 A/L Chemistry Past Paper',
        slug: '2024-al-chemistry-english-medium',
        examType: 'AL',
        level: 'A/L',
        stream: 'Physical Science',
        subject: 'Chemistry',
        year: 2024,
        medium: 'English',
        paperType: 'Past Paper',
        term: 'Final',
        description: '2024 G.C.E. A/L Chemistry Paper I (MCQ) & Paper II (Structured Essay).',
        fileUrl: '/uploads/past-papers/al/2024-al-chemistry-english.pdf',
        fileName: '2024-al-chemistry-english.pdf',
        fileSize: 2100000,
        downloadCount: 65,
        status: 'published',
        source: 'Department of Examinations, Sri Lanka [Demo Record]',
        permissionConfirmed: true,
        uploadedBy: adminUser._id,
      },
      {
        title: '2025 A/L ICT Past Paper',
        slug: '2025-al-ict-english-medium',
        examType: 'AL',
        level: 'A/L',
        stream: 'Technology',
        subject: 'ICT',
        year: 2025,
        medium: 'English',
        paperType: 'Past Paper',
        term: 'Final',
        description: '2025 G.C.E. Advanced Level Information & Communication Technology question paper.',
        fileUrl: '/uploads/past-papers/al/2025-al-ict-english.pdf',
        fileName: '2025-al-ict-english.pdf',
        fileSize: 1950000,
        downloadCount: 54,
        status: 'published',
        source: 'Department of Examinations, Sri Lanka [Demo Record]',
        permissionConfirmed: true,
        uploadedBy: adminUser._id,
      },
    ];

    const insertedPastPapers = await PastPaper.insertMany(pastPapersData);
    console.log(`Inserted ${insertedPastPapers.length} sample past paper records.`);

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error.message);
    process.exit(1);
  }
};

seedData();
