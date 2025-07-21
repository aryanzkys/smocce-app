const mongoose = require('mongoose');
require('dotenv').config();
const User = require('../models/User');

const sampleUsers = [
  {
    nisn: '1234567890',
    token: 'TOKEN001',
    bidang: 'Matematika',
    hasVoted: false
  },
  {
    nisn: '1234567891',
    token: 'TOKEN002',
    bidang: 'Fisika',
    hasVoted: false
  },
  {
    nisn: '1234567892',
    token: 'TOKEN003',
    bidang: 'Kimia',
    hasVoted: false
  },
  {
    nisn: '1234567893',
    token: 'TOKEN004',
    bidang: 'Biologi',
    hasVoted: false
  },
  {
    nisn: '1234567894',
    token: 'TOKEN005',
    bidang: 'Informatika',
    hasVoted: false
  }
];

const importSampleUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Clear existing users
    await User.deleteMany();
    console.log('🗑️  Existing users cleared');

    // Insert sample users
    await User.insertMany(sampleUsers);
    console.log('✅ Sample users imported successfully!');
    
    console.log('\n📋 Sample User Credentials:');
    sampleUsers.forEach((user, index) => {
      console.log(`${index + 1}. NISN: ${user.nisn} | Token: ${user.token} | Bidang: ${user.bidang}`);
    });
    
    process.exit();
  } catch (error) {
    console.error('❌ Failed to import sample users:', error);
    process.exit(1);
  }
};

importSampleUsers();
