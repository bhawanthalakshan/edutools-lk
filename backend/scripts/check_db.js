const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

async function check() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/edutools-lk';
    console.log('Connecting to Mongo URI...');
    await mongoose.connect(mongoUri);
    console.log('Connected!');

    const PastPaper = mongoose.model('PastPaper', new mongoose.Schema({}, { strict: false }));
    const count = await PastPaper.countDocuments({});
    console.log(`Total PastPaper records: ${count}`);

    const sample = await PastPaper.find({}).limit(5);
    console.log('Sample papers:', JSON.stringify(sample, null, 2));

    await mongoose.disconnect();
  } catch (err) {
    console.error('Check failed:', err.message);
  }
}

check();
