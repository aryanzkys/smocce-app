const mongoose = require('mongoose');
require('dotenv').config();
const Candidate = require('../models/candidate');

const candidatesData = [
  // Kandidat Ketua (6 kandidat)
  {
    candidateId: 'k1',
    name: 'Andi Pratama',
    type: 'ketua',
    photo: '/default-avatar.jpg',
    vision: 'Meningkatkan prestasi SOC melalui pelatihan intensif dan kompetisi berkualitas',
    mission: 'Mengadakan pelatihan rutin, workshop dengan mentor berpengalaman, dan kompetisi internal untuk mempersiapkan OSN',
    experience: 'Juara 1 OSN Matematika Provinsi 2023, Ketua OSIS SMA, Pengalaman organisasi 3 tahun'
  },
  {
    candidateId: 'k2',
    name: 'Rina Putri Sari',
    type: 'ketua',
    photo: '/default-avatar.jpg',
    vision: 'Membangun SOC yang inklusif, progresif, dan berprestasi tinggi',
    mission: 'Menciptakan lingkungan belajar yang nyaman, mengembangkan program mentoring, dan meningkatkan kerjasama antar bidang',
    experience: 'Juara 2 OSN Fisika Nasional 2023, Wakil Ketua SOC periode sebelumnya, Aktif dalam berbagai kompetisi sains'
  },
  {
    candidateId: 'k3',
    name: 'Budi Santoso',
    type: 'ketua',
    photo: '/default-avatar.jpg',
    vision: 'Menjadikan SOC sebagai wadah pengembangan talenta sains terdepan',
    mission: 'Mengoptimalkan fasilitas, mengadakan seminar rutin, dan membangun jaringan dengan alumni SOC',
    experience: 'Juara 3 OSN Kimia Nasional 2022, Koordinator Divisi Akademik SOC, Pengalaman kepemimpinan 2 tahun'
  },
  {
    candidateId: 'k4',
    name: 'Sari Dewi Lestari',
    type: 'ketua',
    photo: '/default-avatar.jpg',
    vision: 'Membangun SOC yang inovatif dan adaptif terhadap perkembangan zaman',
    mission: 'Mengintegrasikan teknologi dalam pembelajaran, mengembangkan platform digital, dan meningkatkan kolaborasi internasional',
    experience: 'Juara 1 OSN Biologi Nasional 2023, Ketua Tim Riset Sekolah, Pengalaman internasional exchange program'
  },
  {
    candidateId: 'k5',
    name: 'Fajar Ramadhan',
    type: 'ketua',
    photo: '/default-avatar.jpg',
    vision: 'Menciptakan SOC yang berkelanjutan dan berdampak positif bagi masyarakat',
    mission: 'Mengembangkan program community service, penelitian aplikatif, dan kemitraan dengan industri',
    experience: 'Medali Emas OSN Informatika 2022, Founder startup edtech, Aktif dalam program sosial pendidikan'
  },
  {
    candidateId: 'k6',
    name: 'Maya Indira Putri',
    type: 'ketua',
    photo: '/default-avatar.jpg',
    vision: 'Mewujudkan SOC sebagai pusat excellence dalam sains dan teknologi',
    mission: 'Membangun laboratorium modern, mengadakan kompetisi internasional, dan menciptakan alumni network yang kuat',
    experience: 'Juara 2 OSN Kimia Nasional 2023, Peneliti muda terbaik, Penerima beasiswa internasional'
  },

  // Kandidat PJ Matematika
  {
    candidateId: 'pj_mat_1',
    name: 'Ahmad Rizki',
    type: 'pj',
    bidang: 'Matematika',
    photo: '/candidates/pj_mat1.jpg',
    vision: 'Mengembangkan kemampuan problem solving dan analytical thinking',
    mission: 'Pelatihan soal-soal olimpiade tingkat tinggi, pembahasan strategi penyelesaian, dan simulasi kompetisi',
    experience: 'Medali Perunggu OSN Matematika 2023, Tutor matematika berpengalaman, Aktif dalam komunitas matematika'
  },
  {
    candidateId: 'pj_mat_2',
    name: 'Fitri Nurhaliza',
    type: 'pj',
    bidang: 'Matematika',
    photo: '/candidates/pj_mat2.jpg',
    vision: 'Menciptakan pembelajaran matematika yang menyenangkan dan efektif',
    mission: 'Menggunakan metode pembelajaran interaktif, games matematika, dan peer teaching',
    experience: 'Juara 1 Kompetisi Matematika Regional, Asisten dosen matematika, Pengalaman mengajar 2 tahun'
  },

  // Kandidat PJ Fisika
  {
    candidateId: 'pj_fis_1',
    name: 'Budi Setiawan',
    type: 'pj',
    bidang: 'Fisika',
    photo: '/candidates/pj_fis1.jpg',
    vision: 'Menguasai konsep fisika melalui eksperimen dan aplikasi praktis',
    mission: 'Praktikum rutin, demonstrasi fenomena fisika, dan penerapan teori dalam kehidupan sehari-hari',
    experience: 'Medali Emas OSN Fisika 2023, Peneliti muda bidang fisika, Pemenang Science Fair Nasional'
  },
  {
    candidateId: 'pj_fis_2',
    name: 'Sari Indah',
    type: 'pj',
    bidang: 'Fisika',
    photo: '/candidates/pj_fis2.jpg',
    vision: 'Membangun pemahaman fisika yang kuat dari dasar hingga tingkat lanjut',
    mission: 'Pembelajaran bertahap, review konsep dasar, dan latihan soal berjenjang',
    experience: 'Juara 2 OSN Fisika Provinsi, Tutor fisika online, Aktif dalam penelitian fisika eksperimental'
  },

  // Kandidat PJ Kimia
  {
    candidateId: 'pj_kim_1',
    name: 'Dedi Kurniawan',
    type: 'pj',
    bidang: 'Kimia',
    photo: '/candidates/pj_kim1.jpg',
    vision: 'Menguasai kimia melalui pemahaman konsep dan praktik laboratorium',
    mission: 'Praktikum kimia rutin, analisis reaksi kimia, dan penerapan kimia dalam industri',
    experience: 'Medali Perak OSN Kimia 2023, Asisten laboratorium kimia, Peneliti kimia organik'
  },
  {
    candidateId: 'pj_kim_2',
    name: 'Lina Marlina',
    type: 'pj',
    bidang: 'Kimia',
    photo: '/candidates/pj_kim2.jpg',
    vision: 'Mengembangkan kemampuan analisis dan sintesis dalam kimia',
    mission: 'Pembelajaran kimia terintegrasi, diskusi kasus kimia, dan kompetisi kimia internal',
    experience: 'Juara 1 Olimpiade Kimia Regional, Tutor kimia berpengalaman, Aktif dalam riset kimia analitik'
  },

  // Kandidat PJ Biologi
  {
    candidateId: 'pj_bio_1',
    name: 'Eko Prasetyo',
    type: 'pj',
    bidang: 'Biologi',
    photo: '/candidates/pj_bio1.jpg',
    vision: 'Memahami kehidupan melalui pendekatan saintifik dan observasi langsung',
    mission: 'Praktikum biologi, field study, dan penelitian biologi sederhana',
    experience: 'Medali Perunggu OSN Biologi 2023, Peneliti biologi molekuler, Aktif dalam konservasi lingkungan'
  },
  {
    candidateId: 'pj_bio_2',
    name: 'Maya Sari',
    type: 'pj',
    bidang: 'Biologi',
    photo: '/candidates/pj_bio2.jpg',
    vision: 'Mengeksplorasi keajaiban biologi dari molekuler hingga ekosistem',
    mission: 'Pembelajaran biologi holistik, praktikum mikrobiologi, dan studi kasus biodiversitas',
    experience: 'Juara 2 OSN Biologi Provinsi, Volunteer penelitian ekologi, Tutor biologi online'
  },

  // Kandidat PJ Informatika
  {
    candidateId: 'pj_inf_1',
    name: 'Reza Pratama',
    type: 'pj',
    bidang: 'Informatika',
    photo: '/candidates/pj_inf1.jpg',
    vision: 'Menguasai algoritma dan pemrograman untuk menyelesaikan masalah kompleks',
    mission: 'Pelatihan competitive programming, workshop algoritma, dan project-based learning',
    experience: 'Medali Emas OSN Informatika 2023, Software developer, Mentor programming bootcamp'
  },
  {
    candidateId: 'pj_inf_2',
    name: 'Dina Anggraini',
    type: 'pj',
    bidang: 'Informatika',
    photo: '/candidates/pj_inf2.jpg',
    vision: 'Mengembangkan computational thinking dan problem solving skills',
    mission: 'Pembelajaran algoritma step-by-step, coding challenge, dan peer programming',
    experience: 'Juara 1 Hackathon Nasional, Full-stack developer, Instruktur coding academy'
  },

  // Kandidat PJ Astronomi
  {
    candidateId: 'pj_ast_1',
    name: 'Galih Pratama',
    type: 'pj',
    bidang: 'Astronomi',
    photo: '/candidates/pj_ast1.jpg',
    vision: 'Mengeksplorasi keajaiban alam semesta melalui observasi dan penelitian',
    mission: 'Observasi astronomi rutin, workshop astrofotografi, dan studi fenomena langit',
    experience: 'Medali Perak OSN Astronomi 2023, Anggota komunitas astronomi, Peneliti astronomi amatir'
  },
  {
    candidateId: 'pj_ast_2',
    name: 'Sinta Maharani',
    type: 'pj',
    bidang: 'Astronomi',
    photo: '/candidates/pj_ast2.jpg',
    vision: 'Membangun pemahaman astronomi dari dasar hingga penelitian lanjutan',
    mission: 'Pembelajaran astronomi sistematis, praktik penggunaan teleskop, dan analisis data astronomi',
    experience: 'Juara 1 Olimpiade Astronomi Regional, Tutor astronomi, Aktif dalam observatorium'
  },

  // Kandidat PJ Ekonomi
  {
    candidateId: 'pj_eko_1',
    name: 'Arif Budiman',
    type: 'pj',
    bidang: 'Ekonomi',
    photo: '/candidates/pj_eko1.jpg',
    vision: 'Memahami dinamika ekonomi melalui analisis teori dan praktik',
    mission: 'Studi kasus ekonomi, simulasi pasar, dan analisis kebijakan ekonomi',
    experience: 'Medali Emas OSN Ekonomi 2023, Peneliti ekonomi muda, Konsultan ekonomi junior'
  },
  {
    candidateId: 'pj_eko_2',
    name: 'Ratna Sari',
    type: 'pj',
    bidang: 'Ekonomi',
    photo: '/candidates/pj_eko2.jpg',
    vision: 'Mengembangkan analytical thinking dalam memahami fenomena ekonomi',
    mission: 'Pembelajaran ekonomi aplikatif, diskusi isu ekonomi terkini, dan project research',
    experience: 'Juara 2 OSN Ekonomi Provinsi, Tutor ekonomi berpengalaman, Aktif dalam riset ekonomi'
  },

  // Kandidat PJ Kebumian
  {
    candidateId: 'pj_keb_1',
    name: 'Bayu Setiawan',
    type: 'pj',
    bidang: 'Kebumian',
    photo: '/candidates/pj_keb1.jpg',
    vision: 'Memahami sistem bumi melalui pendekatan multidisiplin',
    mission: 'Field study geologi, praktikum mineralogi, dan analisis fenomena kebumian',
    experience: 'Medali Perunggu OSN Kebumian 2023, Peneliti geologi muda, Aktif dalam ekspedisi geologi'
  },
  {
    candidateId: 'pj_keb_2',
    name: 'Dewi Kartika',
    type: 'pj',
    bidang: 'Kebumian',
    photo: '/candidates/pj_keb2.jpg',
    vision: 'Mengeksplorasi keragaman mineral dan struktur bumi',
    mission: 'Pembelajaran geologi sistematis, praktik identifikasi batuan, dan studi lingkungan',
    experience: 'Juara 1 Olimpiade Kebumian Regional, Tutor kebumian, Volunteer konservasi lingkungan'
  },

  // Kandidat PJ Geografi
  {
    candidateId: 'pj_geo_1',
    name: 'Hendra Wijaya',
    type: 'pj',
    bidang: 'Geografi',
    photo: '/candidates/pj_geo1.jpg',
    vision: 'Memahami interaksi manusia dan lingkungan secara komprehensif',
    mission: 'Studi lapangan geografi, analisis peta dan SIG, serta kajian fenomena geografis',
    experience: 'Medali Emas OSN Geografi 2023, Peneliti geografi, Aktif dalam pemetaan digital'
  },
  {
    candidateId: 'pj_geo_2',
    name: 'Indira Putri',
    type: 'pj',
    bidang: 'Geografi',
    photo: '/candidates/pj_geo2.jpg',
    vision: 'Mengembangkan spatial thinking dan environmental awareness',
    mission: 'Pembelajaran geografi interaktif, workshop GIS, dan project mapping',
    experience: 'Juara 2 OSN Geografi Provinsi, Tutor geografi online, Peneliti geografi lingkungan'
  }
];

const importCandidates = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Clear existing candidates
    await Candidate.deleteMany();
    console.log('🗑️  Existing candidates cleared');

    // Insert new candidates
    await Candidate.insertMany(candidatesData);
    console.log('✅ Candidates data imported successfully!');
    
    // Display summary
    const ketuaCount = candidatesData.filter(c => c.type === 'ketua').length;
    const pjCount = candidatesData.filter(c => c.type === 'pj').length;
    
    console.log(`📊 Summary:`);
    console.log(`   - Ketua candidates: ${ketuaCount}`);
    console.log(`   - PJ candidates: ${pjCount}`);
    console.log(`   - Total candidates: ${candidatesData.length}`);
    
    process.exit();
  } catch (error) {
    console.error('❌ Failed to import candidates:', error);
    process.exit(1);
  }
};

importCandidates();
