// Konfigurasi Periode Pemilihan SMOCCE 2025
const ElectionPeriod = require('../models/electionPeriod');
const electionConfig = {
  periods: {
    PJ: {
      name: 'Pemilihan PJ Bidang',
      startDate: new Date('2025-07-23T02:30:00+07:00'), // 23 Juli 2025 jam 2.30 pagi
      endDate: new Date('2025-07-31T01:00:00+07:00'),   // 31 Juli 2025 jam 1 pagi
      type: 'pj',
      description: 'Pemilihan Penanggung Jawab Bidang'
    },
    KETUA: {
      name: 'Pemilihan Ketua SOC',
      startDate: new Date('2025-07-31T01:00:00+07:00'), // 31 Juli 2025 jam 1 pagi (langsung setelah PJ)
      endDate: new Date('2025-07-31T23:59:59+07:00'),   // 31 Juli 2025 akhir hari
      type: 'ketua',
      description: 'Pemilihan Ketua SMANESI Olympiad Club'
    }
  }
};

// Fungsi untuk mendapatkan periode pemilihan aktif
function getCurrentElectionPeriod() {
  const now = new Date();
  
  // Cek periode PJ
  if (now >= electionConfig.periods.PJ.startDate && now <= electionConfig.periods.PJ.endDate) {
    return {
      active: true,
      period: 'PJ',
      config: electionConfig.periods.PJ
    };
  }
  
  // Cek periode Ketua
  if (now >= electionConfig.periods.KETUA.startDate && now <= electionConfig.periods.KETUA.endDate) {
    return {
      active: true,
      period: 'KETUA',
      config: electionConfig.periods.KETUA
    };
  }
  
  // Tidak ada periode aktif
  return {
    active: false,
    period: null,
    config: null,
    nextPeriod: getNextElectionPeriod()
  };
}

// Fungsi untuk mendapatkan periode pemilihan berikutnya
function getNextElectionPeriod() {
  const now = new Date();
  
  if (now < electionConfig.periods.PJ.startDate) {
    return {
      period: 'PJ',
      config: electionConfig.periods.PJ
    };
  }
  
  if (now < electionConfig.periods.KETUA.startDate) {
    return {
      period: 'KETUA',
      config: electionConfig.periods.KETUA
    };
  }
  
  return null; // Semua periode sudah selesai
}

// Versi async yang membaca dari DB jika tersedia, fallback ke config di atas
async function getCurrentElectionPeriodAsync() {
  try {
    const [pj, ketua] = await Promise.all([
      ElectionPeriod.findOne({ period: 'PJ' }),
      ElectionPeriod.findOne({ period: 'KETUA' }),
    ])
    const now = new Date();
    const PJ = pj || electionConfig.periods.PJ
    const KETUA = ketua || electionConfig.periods.KETUA

    if (now >= new Date(PJ.startDate) && now <= new Date(PJ.endDate)) {
      return { active: true, period: 'PJ', config: PJ }
    }
    if (now >= new Date(KETUA.startDate) && now <= new Date(KETUA.endDate)) {
      return { active: true, period: 'KETUA', config: KETUA }
    }
    return { active: false, period: null, config: null, nextPeriod: await getNextElectionPeriodAsync() }
  } catch (e) {
    // Fallback sync
    return getCurrentElectionPeriod()
  }
}

async function getNextElectionPeriodAsync() {
  try {
    const [pj, ketua] = await Promise.all([
      ElectionPeriod.findOne({ period: 'PJ' }),
      ElectionPeriod.findOne({ period: 'KETUA' }),
    ])
    const now = new Date();
    const PJ = pj || electionConfig.periods.PJ
    const KETUA = ketua || electionConfig.periods.KETUA

    if (now < new Date(PJ.startDate)) {
      return { period: 'PJ', config: PJ }
    }
    if (now < new Date(KETUA.startDate)) {
      return { period: 'KETUA', config: KETUA }
    }
    return null
  } catch (e) {
    return getNextElectionPeriod()
  }
}

// Kembalikan kedua periode (PJ dan KETUA) dari DB jika ada, fallback ke config statis
async function getAllElectionPeriodsAsync() {
  try {
    const [pj, ketua] = await Promise.all([
      ElectionPeriod.findOne({ period: 'PJ' }),
      ElectionPeriod.findOne({ period: 'KETUA' }),
    ])
    return {
      PJ: pj || electionConfig.periods.PJ,
      KETUA: ketua || electionConfig.periods.KETUA,
    }
  } catch (e) {
    return {
      PJ: electionConfig.periods.PJ,
      KETUA: electionConfig.periods.KETUA,
    }
  }
}

// Fungsi untuk cek apakah user sudah vote di periode tertentu
function hasUserVotedInPeriod(userVotes, period) {
  if (!userVotes) return false;
  
  if (period === 'PJ') {
    return !!userVotes.pjId;
  }
  
  if (period === 'KETUA') {
    return !!userVotes.ketuaId;
  }
  
  return false;
}

module.exports = {
  electionConfig,
  getCurrentElectionPeriod,
  getNextElectionPeriod,
  getCurrentElectionPeriodAsync,
  getNextElectionPeriodAsync,
  getAllElectionPeriodsAsync,
  hasUserVotedInPeriod
};
