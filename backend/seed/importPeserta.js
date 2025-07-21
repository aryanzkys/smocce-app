const mongoose = require('mongoose');
const xlsx = require('xlsx');
require('dotenv').config();
const User = require('../models/User');

const importData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const workbook = xlsx.readFile('./seed/peserta.xlsx');
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const peserta = xlsx.utils.sheet_to_json(sheet);

    // Format: { nisn: '123', token: 'ABC', bidang: 'Matematika' }
    const formatted = peserta.map((item) => ({
      nisn: item.nisn.toString(),
      token: item.token,
      bidang: item.bidang,
      hasVoted: false,
    }));

    await User.deleteMany(); // Kosongkan dulu kalau mau clean import
    await User.insertMany(formatted);
    console.log('✅ Data peserta berhasil diimport!');
    process.exit();
  } catch (error) {
    console.error('❌ Gagal import data:', error);
    process.exit(1);
  }
};

importData();
