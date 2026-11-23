import React, { useState, useMemo, useEffect } from 'react';

// ============================================================================
// INLINE-SVG ICONS (keine externen Icon-Library-Shim-Probleme)
// ============================================================================
const IconBase = ({ className = 'w-4 h-4', children }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    {children}
  </svg>
);

const KlHomeIcon = ({ className }) => (
  <IconBase className={className}>
    <path d="M3 10.5 12 3l9 7.5" />
    <path d="M5 9.5V21h14V9.5" />
    <path d="M9 21v-6h6v6" />
  </IconBase>
);

const KlTrophyIcon = ({ className }) => (
  <IconBase className={className}>
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
  </IconBase>
);

const KlHistoryIcon = ({ className }) => (
  <IconBase className={className}>
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
    <path d="M12 7v5l4 2" />
  </IconBase>
);

const KlAwardIcon = ({ className }) => (
  <IconBase className={className}>
    <circle cx="12" cy="8" r="6" />
    <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
  </IconBase>
);

const KlUsersIcon = ({ className }) => (
  <IconBase className={className}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </IconBase>
);

const KlMapPinIcon = ({ className }) => (
  <IconBase className={className}>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </IconBase>
);

const KlCalendarIcon = ({ className }) => (
  <IconBase className={className}>
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
    <line x1="16" x2="16" y1="2" y2="6" />
    <line x1="8" x2="8" y1="2" y2="6" />
    <line x1="3" x2="21" y1="10" y2="10" />
  </IconBase>
);

const KlCheckCircleIcon = ({ className }) => (
  <IconBase className={className}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <path d="m9 11 3 3L22 4" />
  </IconBase>
);

const KlClockIcon = ({ className }) => (
  <IconBase className={className}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </IconBase>
);

const KlEditIcon = ({ className }) => (
  <IconBase className={className}>
    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
    <path d="m15 5 4 4" />
  </IconBase>
);

const KlUserPlusIcon = ({ className }) => (
  <IconBase className={className}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <line x1="19" x2="19" y1="8" y2="14" />
    <line x1="22" x2="16" y1="11" y2="11" />
  </IconBase>
);

const KlShieldIcon = ({ className }) => (
  <IconBase className={className}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </IconBase>
);

const KlSearchIcon = ({ className }) => (
  <IconBase className={className}>
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </IconBase>
);

const KlXIcon = ({ className }) => (
  <IconBase className={className}>
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </IconBase>
);

const KlChevronDownIcon = ({ className }) => (
  <IconBase className={className}>
    <path d="m6 9 6 6 6-6" />
  </IconBase>
);

const KlArrowUpRightIcon = ({ className }) => (
  <IconBase className={className}>
    <path d="M7 17 17 7" />
    <path d="M7 7h10v10" />
  </IconBase>
);

const KlArrowDownRightIcon = ({ className }) => (
  <IconBase className={className}>
    <path d="m7 7 10 10" />
    <path d="M17 7v10H7" />
  </IconBase>
);

const KlTrashIcon = ({ className }) => (
  <IconBase className={className}>
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
  </IconBase>
);

const KlMessageIcon = ({ className }) => (
  <IconBase className={className}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </IconBase>
);

const KlLockIcon = ({ className }) => (
  <IconBase className={className}>
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </IconBase>
);

const KlKeyIcon = ({ className }) => (
  <IconBase className={className}>
    <circle cx="7.5" cy="15.5" r="5.5" />
    <path d="m21 2-9.6 9.6" />
    <path d="m15.5 7.5 3 3L22 7l-3-3" />
  </IconBase>
);

// ============================================================================
// KONSTANTEN & STAMMDATEN
// ============================================================================
const WEEKDAYS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
const DAY_SLOTS = ['Vormittag', 'Nachmittag', 'Abend'];
const PLAY_STYLES = ['Allround', 'Offensiv', 'Defensiv', 'Noppen / Anti'];
const CHECKIN_MOODS = [
  'Ligaspiel gesucht 🏓',
  'Warm-up & Training 💪',
  'Spontan für Matches 🔥',
  'Lockeres Einspielen 😎',
];

const INITIAL_MEMBERS = {
  m1: {
    id: 'm1',
    nickname: 'SmashKing',
    firstName: 'Lukas',
    lastName: 'Meier',
    pin: '1111',
    whatsapp: '079 269 66 89',
    language: 'DE',
    style: 'Offensiv',
    bio: 'Schneller Vorhand-Topspin, meistens Dienstag & Donnerstag ab 18:30 in der Halle.',
    status: 'Dabei',
    nextMonthOptIn: true,
    usualDays: ['Di', 'Do'],
    usualSlots: ['Abend'],
    annualPoints: 64,
    seasonTitles: 2,
    avatarBg: 'from-emerald-500 to-teal-700',
    checkedInUntil: Date.now() + 95 * 60 * 1000,
    checkInMood: 'Ligaspiel gesucht 🏓',
  },
  m2: {
    id: 'm2',
    nickname: 'SpinDoctor',
    firstName: 'Marco',
    lastName: 'Keller',
    pin: '2222',
    whatsapp: '078 412 33 10',
    language: 'Beides',
    style: 'Allround',
    bio: 'Variabler Aufschlag-Spin und sichere Blocks. Immer bereit für ein spontanes Match.',
    status: 'Dabei',
    nextMonthOptIn: true,
    usualDays: ['Mo', 'Mi', 'Fr'],
    usualSlots: ['Abend'],
    annualPoints: 58,
    seasonTitles: 1,
    avatarBg: 'from-sky-500 to-indigo-700',
    checkedInUntil: Date.now() + 55 * 60 * 1000,
    checkInMood: 'Spontan für Matches 🔥',
  },
  m3: {
    id: 'm3',
    nickname: 'TopSpinTobi',
    firstName: 'Tobias',
    lastName: 'Weber',
    pin: '3333',
    whatsapp: '076 551 89 20',
    language: 'DE',
    style: 'Offensiv',
    bio: 'Spielt gerne lange Ballwechsel aus der Halbdistanz.',
    status: 'Dabei',
    nextMonthOptIn: true,
    usualDays: ['Di', 'Sa'],
    usualSlots: ['Nachmittag', 'Abend'],
    annualPoints: 53,
    seasonTitles: 1,
    avatarBg: 'from-amber-500 to-orange-700',
    checkedInUntil: null,
    checkInMood: '',
  },
  m4: {
    id: 'm4',
    nickname: 'BlockWall',
    firstName: 'Elena',
    lastName: 'Vogt',
    pin: '4444',
    whatsapp: '079 810 44 12',
    language: 'EN',
    style: 'Defensiv',
    bio: 'Ruhe am Tisch, platziertes Blockspiel und schnelle Konter.',
    status: 'Dabei',
    nextMonthOptIn: true,
    usualDays: ['Mi', 'Do'],
    usualSlots: ['Abend'],
    annualPoints: 49,
    seasonTitles: 0,
    avatarBg: 'from-purple-500 to-fuchsia-700',
    checkedInUntil: null,
    checkInMood: '',
  },
  m5: {
    id: 'm5',
    nickname: 'BackhandBen',
    firstName: 'Benjamin',
    lastName: 'Frei',
    pin: '5555',
    whatsapp: '077 320 19 88',
    language: 'Beides',
    style: 'Allround',
    bio: 'Starker Rückhand-Flip und hohe Konstanz.',
    status: 'Dabei',
    nextMonthOptIn: false,
    usualDays: ['Do', 'So'],
    usualSlots: ['Vormittag', 'Abend'],
    annualPoints: 45,
    seasonTitles: 0,
    avatarBg: 'from-rose-500 to-red-700',
    checkedInUntil: null,
    checkInMood: '',
  },
  m6: {
    id: 'm6',
    nickname: 'ChopperNina',
    firstName: 'Nina',
    lastName: 'Steiner',
    pin: '6666',
    whatsapp: '079 644 71 05',
    language: 'DE',
    style: 'Noppen / Anti',
    bio: 'Unterschnitt-Abwehr mit plötzlichen Vorhand-Angriffen.',
    status: 'Dabei',
    nextMonthOptIn: true,
    usualDays: ['Mo', 'Do'],
    usualSlots: ['Abend'],
    annualPoints: 42,
    seasonTitles: 0,
    avatarBg: 'from-cyan-500 to-blue-700',
    checkedInUntil: null,
    checkInMood: '',
  },
  m7: {
    id: 'm7',
    nickname: 'AceAlex',
    firstName: 'Alexander',
    lastName: 'Baumann',
    pin: '7777',
    whatsapp: '078 903 12 45',
    language: 'EN',
    style: 'Offensiv',
    bio: 'Aggressives Eröffnungsspiel auf jeden kurzen Aufschlag.',
    status: 'Dabei',
    nextMonthOptIn: true,
    usualDays: ['Di', 'Fr'],
    usualSlots: ['Abend'],
    annualPoints: 38,
    seasonTitles: 0,
    avatarBg: 'from-lime-500 to-green-700',
    checkedInUntil: null,
    checkInMood: '',
  },
  m8: {
    id: 'm8',
    nickname: 'RallyRemo',
    firstName: 'Remo',
    lastName: 'Zürcher',
    pin: '8888',
    whatsapp: '079 311 50 67',
    language: 'DE',
    style: 'Allround',
    bio: 'Liebt 5-Satz-Krimis und fair umkämpfte Punkte.',
    status: 'Dabei',
    nextMonthOptIn: true,
    usualDays: ['Mi', 'Sa'],
    usualSlots: ['Nachmittag'],
    annualPoints: 34,
    seasonTitles: 0,
    avatarBg: 'from-orange-500 to-amber-700',
    checkedInUntil: null,
    checkInMood: '',
  },
  m9: {
    id: 'm9',
    nickname: 'FlickFiona',
    firstName: 'Fiona',
    lastName: 'Hartmann',
    pin: '9999',
    whatsapp: '079 519 42 78',
    language: 'DE',
    style: 'Offensiv',
    bio: 'Schnelle Beinarbeit und präzise Platzierung.',
    status: 'Dabei',
    nextMonthOptIn: true,
    usualDays: ['Mo', 'Mi'],
    usualSlots: ['Abend'],
    annualPoints: 31,
    seasonTitles: 0,
    avatarBg: 'from-indigo-500 to-violet-700',
    checkedInUntil: null,
    checkInMood: '',
  },
  m10: {
    id: 'm10',
    nickname: 'ControlChris',
    firstName: 'Christian',
    lastName: 'Bühler',
    pin: '1212',
    whatsapp: '078 604 88 19',
    language: 'Beides',
    style: 'Allround',
    bio: 'Solides Allroundspiel mit viel Geduld.',
    status: 'Dabei',
    nextMonthOptIn: true,
    usualDays: ['Fr', 'Sa'],
    usualSlots: ['Nachmittag', 'Abend'],
    annualPoints: 28,
    seasonTitles: 0,
    avatarBg: 'from-teal-500 to-cyan-700',
    checkedInUntil: null,
    checkInMood: '',
  },
  m11: {
    id: 'm11',
    nickname: 'ServeSarah',
    firstName: 'Sarah',
    lastName: 'Brunner',
    pin: '3434',
    whatsapp: '076 208 99 31',
    language: 'Beides',
    style: 'Allround',
    bio: 'Aktuell im November pausiert, im Dezember wieder bereit.',
    status: 'Pausiert',
    nextMonthOptIn: false,
    usualDays: ['Di'],
    usualSlots: ['Abend'],
    annualPoints: 24,
    seasonTitles: 0,
    avatarBg: 'from-pink-500 to-rose-700',
    checkedInUntil: null,
    checkInMood: '',
  },
  m12: {
    id: 'm12',
    nickname: 'RookieJan',
    firstName: 'Jan',
    lastName: 'Hofmann',
    pin: '1010',
    whatsapp: '079 772 18 40',
    language: 'DE',
    style: 'Allround',
    bio: 'Neu im Club – freue mich auf die ersten Ligaspiele!',
    status: 'Offen',
    nextMonthOptIn: true,
    usualDays: ['Do'],
    usualSlots: ['Abend'],
    annualPoints: 0,
    seasonTitles: 0,
    avatarBg: 'from-emerald-500 to-green-700',
    checkedInUntil: null,
    checkInMood: '',
  },
};

function createRoundRobinMatches(seasonId, leagueLevel, playerIds, presetResults = {}) {
  const matches = [];
  for (let i = 0; i < playerIds.length; i++) {
    for (let j = i + 1; j < playerIds.length; j++) {
      const p1 = playerIds[i];
      const p2 = playerIds[j];
      const key = `${p1}_${p2}`;
      const preset = presetResults[key];
      matches.push({
        id: `${seasonId}_L${leagueLevel}_${p1}_${p2}`,
        seasonId,
        leagueLevel,
        player1Id: p1,
        player2Id: p2,
        setsP1: preset ? preset.setsP1 : null,
        setsP2: preset ? preset.setsP2 : null,
        playedAt: preset ? preset.playedAt : null,
      });
    }
  }
  return matches;
}

const INITIAL_SEASONS = [
  {
    id: '2026-10',
    label: 'Oktober 2026',
    shortLabel: "Okt '26",
    groups: [
      {
        level: 1,
        name: '1. Liga',
        playerIds: ['m1', 'm2', 'm3', 'm4', 'm6'],
        matches: createRoundRobinMatches('2026-10', 1, ['m1', 'm2', 'm3', 'm4', 'm6'], {
          m1_m2: { setsP1: 3, setsP2: 2, playedAt: '2026-10-08' },
          m1_m3: { setsP1: 3, setsP2: 1, playedAt: '2026-10-12' },
          m1_m4: { setsP1: 3, setsP2: 0, playedAt: '2026-10-18' },
          m1_m6: { setsP1: 3, setsP2: 1, playedAt: '2026-10-25' },
          m2_m3: { setsP1: 3, setsP2: 1, playedAt: '2026-10-14' },
          m2_m4: { setsP1: 3, setsP2: 2, playedAt: '2026-10-21' },
          m2_m6: { setsP1: 3, setsP2: 0, playedAt: '2026-10-27' },
          m3_m4: { setsP1: 3, setsP2: 2, playedAt: '2026-10-19' },
          m3_m6: { setsP1: 3, setsP2: 1, playedAt: '2026-10-24' },
          m4_m6: { setsP1: 3, setsP2: 1, playedAt: '2026-10-28' },
        }),
      },
      {
        level: 2,
        name: '2. Liga',
        playerIds: ['m5', 'm7', 'm8', 'm9', 'm10'],
        matches: createRoundRobinMatches('2026-10', 2, ['m5', 'm7', 'm8', 'm9', 'm10'], {
          m5_m7: { setsP1: 3, setsP2: 1, playedAt: '2026-10-09' },
          m5_m8: { setsP1: 3, setsP2: 0, playedAt: '2026-10-15' },
          m5_m9: { setsP1: 3, setsP2: 2, playedAt: '2026-10-22' },
          m5_m10: { setsP1: 3, setsP2: 1, playedAt: '2026-10-26' },
          m7_m8: { setsP1: 3, setsP2: 2, playedAt: '2026-10-16' },
          m7_m9: { setsP1: 3, setsP2: 1, playedAt: '2026-10-20' },
          m7_m10: { setsP1: 3, setsP2: 0, playedAt: '2026-10-28' },
          m8_m9: { setsP1: 3, setsP2: 1, playedAt: '2026-10-23' },
          m8_m10: { setsP1: 3, setsP2: 2, playedAt: '2026-10-27' },
          m9_m10: { setsP1: 3, setsP2: 1, playedAt: '2026-10-29' },
        }),
      },
    ],
  },
  {
    id: '2026-11',
    label: 'November 2026',
    shortLabel: "Nov '26",
    groups: [
      {
        level: 1,
        name: '1. Liga',
        playerIds: ['m1', 'm2', 'm3', 'm4', 'm5'],
        matches: createRoundRobinMatches('2026-11', 1, ['m1', 'm2', 'm3', 'm4', 'm5'], {
          m1_m2: { setsP1: 3, setsP2: 1, playedAt: '2026-11-05' },
          m1_m3: { setsP1: 3, setsP2: 2, playedAt: '2026-11-11' },
          m2_m3: { setsP1: 3, setsP2: 0, playedAt: '2026-11-14' },
          m2_m4: { setsP1: 2, setsP2: 3, playedAt: '2026-11-17' },
          m3_m5: { setsP1: 3, setsP2: 1, playedAt: '2026-11-19' },
          m4_m5: { setsP1: 3, setsP2: 0, playedAt: '2026-11-21' },
        }),
      },
      {
        level: 2,
        name: '2. Liga',
        playerIds: ['m6', 'm7', 'm8', 'm9', 'm10'],
        matches: createRoundRobinMatches('2026-11', 2, ['m6', 'm7', 'm8', 'm9', 'm10'], {
          m6_m7: { setsP1: 3, setsP2: 2, playedAt: '2026-11-10' },
          m7_m8: { setsP1: 3, setsP2: 1, playedAt: '2026-11-15' },
          m8_m9: { setsP1: 2, setsP2: 3, playedAt: '2026-11-18' },
          m6_m10: { setsP1: 3, setsP2: 1, playedAt: '2026-11-20' },
        }),
      },
    ],
  },
];

function isMemberCheckedIn(member, nowTick = Date.now()) {
  return Boolean(member && member.checkedInUntil && member.checkedInUntil > nowTick);
}

function formatRemainingTime(checkedInUntil, nowTick = Date.now()) {
  if (!checkedInUntil || checkedInUntil <= nowTick) return '0 Min.';
  const diffMins = Math.max(1, Math.round((checkedInUntil - nowTick) / 60000));
  const hrs = Math.floor(diffMins / 60);
  const mins = diffMins % 60;
  if (hrs > 0 && mins > 0) return `${hrs}h ${mins}m`;
  if (hrs > 0) return `${hrs}h`;
  return `${mins} Min.`;
}

function buildWhatsAppUrl(phoneRaw, text = '') {
  if (!phoneRaw) return '';
  let digits = String(phoneRaw).replace(/[^\d+]/g, '');
  if (digits.startsWith('+')) {
    digits = digits.slice(1);
  } else if (digits.startsWith('00')) {
    digits = digits.slice(2);
  } else if (digits.startsWith('0')) {
    digits = '41' + digits.slice(1);
  }
  const query = text ? `?text=${encodeURIComponent(text)}` : '';
  return `https://wa.me/${digits}${query}`;
}

function computeStandings(group, membersMap) {
  const stats = {};
  group.playerIds.forEach(id => {
    stats[id] = {
      playerId: id,
      played: 0,
      won: 0,
      lost: 0,
      setsFor: 0,
      setsAgainst: 0,
      points: 0,
    };
  });

  group.matches.forEach(m => {
    if (m.setsP1 === null || m.setsP2 === null) return;
    const s1 = stats[m.player1Id];
    const s2 = stats[m.player2Id];
    if (!s1 || !s2) return;

    s1.played += 1;
    s2.played += 1;
    s1.setsFor += m.setsP1;
    s1.setsAgainst += m.setsP2;
    s2.setsFor += m.setsP2;
    s2.setsAgainst += m.setsP1;

    if (m.setsP1 > m.setsP2) {
      s1.won += 1;
      s1.points += 3;
      s2.lost += 1;
      if (m.setsP2 === 2) s2.points += 1;
    } else if (m.setsP2 > m.setsP1) {
      s2.won += 1;
      s2.points += 3;
      s1.lost += 1;
      if (m.setsP1 === 2) s1.points += 1;
    }
  });

  return Object.values(stats)
    .filter(s => membersMap[s.playerId])
    .sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      const diffA = a.setsFor - a.setsAgainst;
      const diffB = b.setsFor - b.setsAgainst;
      if (diffB !== diffA) return diffB - diffA;
      if (b.setsFor !== a.setsFor) return b.setsFor - a.setsFor;
      return (membersMap[b.playerId]?.annualPoints || 0) - (membersMap[a.playerId]?.annualPoints || 0);
    });
}

// ============================================================================
// HOME TAB (MIT HERO-KPI-KARTE, PIN-LOGIN, DEINE MATCH-LISTE & LIGEN-ÜBERSICHT)
// ============================================================================
function HomeTab({
  membersMap,
  activeSeason,
  currentUser,
  nowTick,
  liveCount,
  showMonthEndCheck,
  onRequestSelectUser,
  onCheckIn,
  onCheckOut,
  onToggleNextMonth,
  onOpenResultModal,
  onOpenProfile,
  onOpenAddMember,
  onNavigateTab,
}) {
  const [welcomeSearch, setWelcomeSearch] = useState('');
  const [checkInMinutes, setCheckInMinutes] = useState(120);
  const [checkInMood, setCheckInMood] = useState(CHECKIN_MOODS[0]);

  const allMembers = useMemo(() => Object.values(membersMap), [membersMap]);

  const activeEligibleMembers = useMemo(
    () => allMembers.filter(m => m.status === 'Dabei'),
    [allMembers]
  );

  const openFeedbackMembers = useMemo(
    () => allMembers.filter(m => m.status === 'Offen' || !m.nextMonthOptIn),
    [allMembers]
  );

  const confirmedNextMonthCount = useMemo(
    () => allMembers.filter(m => m.status === 'Dabei' && m.nextMonthOptIn).length,
    [allMembers]
  );

  const seasonMatchStats = useMemo(() => {
    if (!activeSeason) return { total: 0, played: 0 };
    let total = 0;
    let played = 0;
    activeSeason.groups.forEach(g => {
      g.matches.forEach(m => {
        total += 1;
        if (m.setsP1 !== null && m.setsP2 !== null) played += 1;
      });
    });
    return { total, played };
  }, [activeSeason]);

  const userGroup = useMemo(() => {
    if (!currentUser || !activeSeason) return null;
    return activeSeason.groups.find(g => g.playerIds.includes(currentUser.id)) || null;
  }, [currentUser, activeSeason]);

  const userGroupStandings = useMemo(() => {
    if (!userGroup) return [];
    return computeStandings(userGroup, membersMap);
  }, [userGroup, membersMap]);

  const userMatches = useMemo(() => {
    if (!currentUser || !userGroup) return [];
    return userGroup.matches.filter(
      m => m.player1Id === currentUser.id || m.player2Id === currentUser.id
    );
  }, [currentUser, userGroup]);

  // HERO BANNER MIT 4 STATISTIK-KACHELN (IMMER SICHTBAR OBEN)
  const renderHeroStatsCard = () => (
    <section className="rounded-3xl bg-gradient-to-br from-[#161A23] via-[#151B26] to-[#111820] border border-white/10 p-5 sm:p-6 shadow-2xl space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#10B981]/15 border border-[#10B981]/30 text-[#34D399] text-[11px] font-black uppercase tracking-wider">
            <KlTrophyIcon className="w-3.5 h-3.5" />
            <span>{activeSeason?.label || 'Monatsliga'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            KONGLeague <span className="text-[#10B981]">by pingkong</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Monatliche Clubliga mit Auf- und Abstieg · Best of 5 (3 Gewinnsätze)
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenAddMember}
          className="min-h-[44px] px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#10B981] to-emerald-400 hover:from-emerald-400 hover:to-[#10B981] text-slate-950 font-black text-xs tracking-wider uppercase shadow-lg shadow-[#10B981]/25 inline-flex items-center gap-2 transition cursor-pointer"
        >
          <KlUserPlusIcon className="w-4 h-4 shrink-0" />
          <span>NEW PLAYER</span>
        </button>
      </div>

      {/* 4 KPI KACHELN */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <button
          type="button"
          onClick={() => onNavigateTab('players')}
          className="p-3.5 rounded-2xl bg-[#0B0D12]/90 hover:bg-[#0B0D12] border border-white/10 text-left transition cursor-pointer"
        >
          <p className="text-[11px] font-bold text-slate-400">Aktive Spieler</p>
          <p className="text-xl sm:text-2xl font-black text-white mt-0.5">
            {activeEligibleMembers.length}
          </p>
          <p className="text-[10px] text-[#34D399] font-semibold mt-0.5">
            Kader ansehen →
          </p>
        </button>

        <button
          type="button"
          onClick={() => onNavigateTab('leagues')}
          className="p-3.5 rounded-2xl bg-[#0B0D12]/90 hover:bg-[#0B0D12] border border-white/10 text-left transition cursor-pointer"
        >
          <p className="text-[11px] font-bold text-slate-400">Ligen</p>
          <p className="text-xl sm:text-2xl font-black text-white mt-0.5">
            {activeSeason?.groups.length || 0}
          </p>
          <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
            Tabellen →
          </p>
        </button>

        <button
          type="button"
          onClick={() => onNavigateTab('recent')}
          className="p-3.5 rounded-2xl bg-[#0B0D12]/90 hover:bg-[#0B0D12] border border-white/10 text-left transition cursor-pointer"
        >
          <p className="text-[11px] font-bold text-slate-400">Pflichtspiele</p>
          <p className="text-xl sm:text-2xl font-black text-white mt-0.5">
            {seasonMatchStats.played}
            <span className="text-sm text-slate-500 font-bold">
              /{seasonMatchStats.total}
            </span>
          </p>
          <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
            Resultate →
          </p>
        </button>

        <button
          type="button"
          onClick={() => onNavigateTab('hall')}
          className="p-3.5 rounded-2xl bg-[#0B0D12]/90 hover:bg-[#0B0D12] border border-[#10B981]/30 text-left transition cursor-pointer"
        >
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            <p className="text-[11px] font-bold text-[#34D399]">LIVE in der Halle</p>
          </div>
          <p className="text-xl sm:text-2xl font-black text-white mt-0.5">
            {liveCount}
          </p>
          <p className="text-[10px] text-[#34D399] font-semibold mt-0.5">
            Check-in & Status →
          </p>
        </button>
      </div>
    </section>
  );

  // FALLS NOCH KEIN PROFIL GEWÄHLT WURDE -> PROFILAUSWAHL MIT PIN-ABFRAGE
  if (!currentUser) {
    const filteredWelcomeMembers = allMembers.filter(m => {
      const q = welcomeSearch.trim().toLowerCase();
      if (!q) return true;
      return (
        m.nickname.toLowerCase().includes(q) ||
        `${m.firstName} ${m.lastName}`.toLowerCase().includes(q)
      );
    });

    return (
      <div className="space-y-5">
        {renderHeroStatsCard()}

        <section className="rounded-3xl bg-[#161A23] border border-white/10 p-5 sm:p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white">
                Spielerprofil auswählen
              </h2>
              <p className="text-xs text-slate-400">
                Wähle deinen Nickname und bestätige mit deinem persönlichen Spieler-PIN.
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[11px] font-mono text-slate-300 self-start">
              Demo-PIN SmashKing: 1111
            </span>
          </div>

          <div className="relative">
            <KlSearchIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={welcomeSearch}
              onChange={e => setWelcomeSearch(e.target.value)}
              placeholder="Nickname oder Name suchen..."
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#0B0D12] border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#10B981]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {filteredWelcomeMembers.map(member => {
              const memberGroup = activeSeason?.groups.find(g =>
                g.playerIds.includes(member.id)
              );
              return (
                <button
                  key={member.id}
                  type="button"
                  onClick={() => onRequestSelectUser(member.id)}
                  className="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#0B0D12] hover:bg-[#1E2430] border border-white/10 hover:border-[#10B981]/50 text-left transition cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-xl bg-gradient-to-br ${member.avatarBg} flex items-center justify-center text-white font-black text-sm shrink-0`}
                    >
                      {member.nickname.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-black text-white truncate">
                        {member.nickname}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate">
                        {member.firstName} {member.lastName} ·{' '}
                        {memberGroup ? memberGroup.name : member.status}
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-[#10B981]/15 text-[#34D399] text-[11px] font-black inline-flex items-center gap-1 shrink-0">
                    <KlKeyIcon className="w-3 h-3" />
                    <span>Login</span>
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      </div>
    );
  }

  const isUserLive = isMemberCheckedIn(currentUser, nowTick);
  const usualDaysText =
    currentUser.usualDays?.length > 0
      ? `${currentUser.usualDays.join(', ')}${
          currentUser.usualSlots?.length ? ` (${currentUser.usualSlots.join(', ')})` : ''
        }`
      : 'Noch keine Hallentage hinterlegt';

  const userRankIdx = userGroupStandings.findIndex(s => s.playerId === currentUser.id);
  const userPlayedMatches = userMatches.filter(m => m.setsP1 !== null && m.setsP2 !== null);

  return (
    <div className="space-y-5">
      {renderHeroStatsCard()}

      {/* HINWEIS FALLS PROFIL NOCH AUF ADMIN-FREIGABE WARTET */}
      {currentUser.status === 'Offen' && (
        <div className="rounded-2xl bg-amber-500/15 border border-amber-500/40 p-4 flex items-start gap-3">
          <KlClockIcon className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-xs sm:text-sm font-black text-amber-200">
              Dein Profil wartet noch auf Admin-Freigabe
            </p>
            <p className="text-xs text-amber-100/80 leading-relaxed">
              Sobald der Admin dein Profil im Admin-Bereich auf «Dabei» freigibt, wirst du für die Ligaspiele eingeteilt.
            </p>
          </div>
        </div>
      )}

      {/* SPIELER-HAUPTKARTE */}
      <section className="rounded-3xl bg-[#161A23] border border-white/10 p-5 shadow-xl">
        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-3.5">
            <div
              className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${currentUser.avatarBg} flex items-center justify-center text-white font-black text-lg shadow-lg shrink-0`}
            >
              {currentUser.nickname.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-white truncate">
                  {currentUser.nickname}
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-[#10B981]/15 text-[#34D399] border border-[#10B981]/30">
                  {userGroup ? userGroup.name : currentUser.status}
                </span>
                {userRankIdx >= 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-white/10 text-slate-200">
                    Rang #{userRankIdx + 1}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {currentUser.firstName} {currentUser.lastName} · {currentUser.style} ·{' '}
                {currentUser.annualPoints} Jahrespunkte
              </p>

              {/* Übliche Hallentage direkt unterhalb vom Namen */}
              <div className="mt-1.5">
                <p className="text-xs text-slate-300 leading-relaxed">
                  <span className="text-slate-400 font-bold">
                    Übliche Hallentage:{' '}
                  </span>
                  <span className="font-semibold">{usualDaysText}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2.5 pt-1">
            {/* PROMINENTE FOLGEMONAT-AUSWAHL: DABEI ODER PAUSE */}
            <div className="p-3 rounded-2xl bg-[#0B0D12] border border-[#10B981]/30 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-300">
                  Folgemonat · Teilnahme
                </span>
                <span
                  className={`text-[11px] font-extrabold ${
                    currentUser.nextMonthOptIn
                      ? 'text-[#34D399]'
                      : 'text-amber-300'
                  }`}
                >
                  {currentUser.nextMonthOptIn
                    ? 'Du spielst mit'
                    : 'Du setzt aus'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (!currentUser.nextMonthOptIn) onToggleNextMonth();
                  }}
                  className={`min-h-[44px] px-3 py-2 rounded-xl text-xs font-black border inline-flex items-center justify-center gap-1.5 transition cursor-pointer ${
                    currentUser.nextMonthOptIn
                      ? 'bg-[#10B981] border-[#10B981] text-slate-950 shadow-lg shadow-[#10B981]/20'
                      : 'bg-[#161A23] border-white/10 text-slate-300 hover:border-[#10B981]/50'
                  }`}
                >
                  <KlCheckCircleIcon className="w-4 h-4 shrink-0" />
                  <span>Dabei</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (currentUser.nextMonthOptIn) onToggleNextMonth();
                  }}
                  className={`min-h-[44px] px-3 py-2 rounded-xl text-xs font-black border inline-flex items-center justify-center gap-1.5 transition cursor-pointer ${
                    !currentUser.nextMonthOptIn
                      ? 'bg-amber-500 border-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                      : 'bg-[#161A23] border-white/10 text-slate-300 hover:border-amber-500/50'
                  }`}
                >
                  <KlClockIcon className="w-4 h-4 shrink-0" />
                  <span>Pause</span>
                </button>
              </div>
            </div>

            {/* Stammdaten (inkl. Hallentage bearbeiten) */}
            <button
              type="button"
              onClick={() => onOpenProfile(currentUser.id, true)}
              className="w-full min-h-[42px] px-3.5 py-2 rounded-xl bg-[#0B0D12] border border-white/10 hover:border-[#10B981]/50 text-xs font-extrabold text-slate-200 inline-flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <KlEditIcon className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
              <span>Stammdaten & Hallentage</span>
            </button>
          </div>
        </div>
      </section>

      {/* MONATSENDE-CHECK (AB 26. DES MONATS ODER MANUELL VIA ADMIN) */}
      {showMonthEndCheck && (
        <section className="rounded-3xl bg-gradient-to-br from-[#161A23] to-[#121922] border border-amber-500/35 p-5 shadow-xl space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 text-[10px] font-black uppercase tracking-wider">
                <KlCalendarIcon className="w-3 h-3" />
                Monatsabschluss
              </span>
              <h3 className="text-base sm:text-lg font-black text-white mt-1">
                Monatsende-Check ({activeSeason?.shortLabel || "Nov '26"})
              </h3>
              <p className="text-xs text-slate-400">
                Offene Rückmeldungen für Dezember 2026 & Pflichtspiel-Status vor Monatsabschluss
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab('nextmonth')}
              className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 text-xs font-black transition cursor-pointer"
            >
              Folgemonat öffnen →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-[#0B0D12] border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-300">
                  Zusagen Dezember 2026
                </span>
                <span className="text-xs font-black text-[#34D399]">
                  {confirmedNextMonthCount} / {activeEligibleMembers.length} Dabei
                </span>
              </div>
              {openFeedbackMembers.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {openFeedbackMembers.map(m => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => onOpenProfile(m.id, false)}
                      className="px-2 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-[11px] font-bold text-amber-200 hover:bg-amber-500/25 cursor-pointer"
                    >
                      {m.nickname} ({m.status === 'Offen' ? 'Offen' : 'Pause'})
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-[11px] text-[#34D399] font-semibold">
                  Alle aktiven Spieler haben für Dezember zugesagt!
                </p>
              )}
            </div>

            <div className="p-3.5 rounded-2xl bg-[#0B0D12] border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-300">
                  Pflichtspiel-Status Liga
                </span>
                <span className="text-xs font-black text-white">
                  {seasonMatchStats.played} / {seasonMatchStats.total} gespielt
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full bg-[#10B981] rounded-full transition-all"
                  style={{
                    width: `${
                      seasonMatchStats.total > 0
                        ? Math.round(
                            (seasonMatchStats.played / seasonMatchStats.total) * 100
                          )
                        : 0
                    }%`,
                  }}
                />
              </div>
              <p className="text-[11px] text-slate-400">
                Deine Spiele: {userPlayedMatches.length} von {userMatches.length}{' '}
                abgeschlossen
              </p>
            </div>
          </div>
        </section>
      )}

      {/* LIVE HALLEN CHECK-IN BOX (OHNE NAMENSANZEIGE, NUR DAUER & STATUS) */}
      <section className="rounded-3xl bg-[#161A23] border border-white/10 p-5 shadow-xl space-y-3.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isUserLive ? 'bg-[#10B981] animate-pulse' : 'bg-slate-500'
              }`}
            />
            <h3 className="text-sm sm:text-base font-black text-white">
              LIVE Hallen Check-in
            </h3>
          </div>
          {isUserLive && (
            <span className="px-2.5 py-1 rounded-full bg-[#10B981]/15 text-[#34D399] text-[11px] font-black">
              Aktiv · noch {formatRemainingTime(currentUser.checkedInUntil, nowTick)}
            </span>
          )}
        </div>

        {isUserLive ? (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#0B0D12] border border-[#10B981]/30">
            <div className="space-y-0.5">
              <p className="text-xs font-black text-[#34D399]">
                Du bist aktuell in der Halle eingecheckt
              </p>
              <p className="text-xs text-slate-400">
                Status: {currentUser.checkInMood || CHECKIN_MOODS[0]}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onCheckOut(currentUser.id)}
              className="min-h-[42px] px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-200 text-xs font-black transition cursor-pointer"
            >
              Jetzt auschecken
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">
                  Dauer in der Halle
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[60, 90, 120, 180].map(mins => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => setCheckInMinutes(mins)}
                      className={`min-h-[38px] rounded-xl text-xs font-black border transition cursor-pointer ${
                        checkInMinutes === mins
                          ? 'bg-[#10B981] border-[#10B981] text-slate-950'
                          : 'bg-[#0B0D12] border-white/10 text-slate-300 hover:border-white/25'
                      }`}
                    >
                      {mins >= 60 ? `${mins / 60}h` : `${mins}m`}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">
                  Status
                </label>
                <select
                  value={checkInMood}
                  onChange={e => setCheckInMood(e.target.value)}
                  className="w-full min-h-[38px] px-3 rounded-xl bg-[#0B0D12] border border-white/10 text-xs font-bold text-white focus:outline-none focus:border-[#10B981]"
                >
                  {CHECKIN_MOODS.map(mood => (
                    <option key={mood} value={mood}>
                      {mood}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onCheckIn(currentUser.id, checkInMinutes, checkInMood)}
              className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-[#10B981] hover:bg-emerald-400 text-slate-950 text-xs font-black tracking-wide transition cursor-pointer"
            >
              LIVE Check-in starten
            </button>
          </div>
        )}
      </section>

      {/* DEINE GRUPPENSPIELE IM AKTUELLEN MONAT */}
      <section className="rounded-3xl bg-[#161A23] border border-white/10 p-5 shadow-xl space-y-3.5">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-black text-white">
              Deine Ligaspiele ({activeSeason?.shortLabel || "Nov '26"})
            </h3>
            <p className="text-xs text-slate-400">
              {userGroup
                ? `${userGroup.name} · Tippe auf ein Spiel zum Eintragen oder Anpassen`
                : 'Aktuell keiner Gruppe zugeteilt'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigateTab('leagues')}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-200 transition cursor-pointer"
          >
            Alle Tabellen →
          </button>
        </div>

        {userMatches.length === 0 ? (
          <div className="p-4 rounded-2xl bg-[#0B0D12] border border-white/10 text-xs text-slate-400">
            Für diesen Monat sind keine Ligaspiele für dein Profil hinterlegt.
          </div>
        ) : (
          <div className="space-y-2.5">
            {userMatches.map(match => {
              const opponentId =
                match.player1Id === currentUser.id ? match.player2Id : match.player1Id;
              const opponent = membersMap[opponentId];
              if (!opponent) return null;

              const isPlayed = match.setsP1 !== null && match.setsP2 !== null;
              const mySets =
                match.player1Id === currentUser.id ? match.setsP1 : match.setsP2;
              const oppSets =
                match.player1Id === currentUser.id ? match.setsP2 : match.setsP1;
              const didWin = isPlayed && mySets > oppSets;
              const waUrl = buildWhatsAppUrl(
                opponent.whatsapp,
                `Hoi ${opponent.nickname}, wann wollen wir unser PINGKONG-Ligaspiel (${activeSeason?.label}) spielen?`
              );

              return (
                <div
                  key={match.id}
                  className="p-3.5 rounded-2xl bg-[#0B0D12] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-xl bg-gradient-to-br ${opponent.avatarBg} flex items-center justify-center text-white font-black text-xs shrink-0`}
                    >
                      {opponent.nickname.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <button
                        type="button"
                        onClick={() => onOpenProfile(opponent.id, false)}
                        className="text-sm font-black text-white hover:text-[#34D399] truncate block text-left cursor-pointer"
                      >
                        vs. {opponent.nickname}
                      </button>
                      <p className="text-[11px] text-slate-400 truncate">
                        {opponent.firstName} {opponent.lastName} · Hallentage:{' '}
                        {opponent.usualDays?.join(', ') || '–'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {waUrl && (
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="min-h-[38px] px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-[#34D399] text-xs font-black inline-flex items-center gap-1.5 transition"
                      >
                        <KlMessageIcon className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </a>
                    )}

                    <button
                      type="button"
                      onClick={() => onOpenResultModal(match)}
                      className={`min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-black border transition cursor-pointer ${
                        isPlayed
                          ? didWin
                            ? 'bg-[#10B981]/20 border-[#10B981]/40 text-[#34D399]'
                            : 'bg-rose-500/15 border-rose-500/35 text-rose-200'
                          : 'bg-[#10B981] border-[#10B981] text-slate-950 hover:bg-emerald-400'
                      }`}
                    >
                      {isPlayed ? `${mySets} : ${oppSets}` : 'Resultat eintragen'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* KOMPAKTE ÜBERSICHT ALLER LIGEN AUF HOME */}
      {activeSeason && (
        <section className="rounded-3xl bg-[#161A23] border border-white/10 p-5 shadow-xl space-y-3.5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-white">
                Ligen-Überblick ({activeSeason.shortLabel})
              </h3>
              <p className="text-xs text-slate-400">
                Aktuelle Tabellenstände aller Gruppen
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab('leagues')}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-200 cursor-pointer"
            >
              Details →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {activeSeason.groups.map(group => {
              const standings = computeStandings(group, membersMap);
              return (
                <div
                  key={group.level}
                  className="p-3.5 rounded-2xl bg-[#0B0D12] border border-white/10 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-[#34D399]">
                      {group.name}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {standings.length} Spieler
                    </span>
                  </div>
                  <div className="space-y-1">
                    {standings.map((row, idx) => {
                      const m = membersMap[row.playerId];
                      if (!m) return null;
                      return (
                        <div
                          key={row.playerId}
                          className="flex items-center justify-between text-xs py-1 border-b border-white/5 last:border-none"
                        >
                          <span
                            className={`truncate ${
                              m.id === currentUser.id
                                ? 'font-black text-[#34D399]'
                                : 'font-bold text-slate-200'
                            }`}
                          >
                            {idx + 1}. {m.nickname}
                          </span>
                          <span className="font-black text-white shrink-0">
                            {row.points} Pkt
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}

// ============================================================================
// LIGA TAB
// ============================================================================
function LeaguesTab({
  membersMap,
  seasons,
  activeSeason,
  onSelectSeason,
  currentUser,
  onOpenResultModal,
  onOpenProfile,
}) {
  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-white">Ligen & Tabellen</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Hinweis: Die Gruppengrösse kann je nach Anzahl aktiver Teilnehmer pro Monat variieren.
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {seasons.map(s => (
            <button
              key={s.id}
              type="button"
              onClick={() => onSelectSeason(s.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black border transition cursor-pointer ${
                activeSeason?.id === s.id
                  ? 'bg-[#10B981] border-[#10B981] text-slate-950'
                  : 'bg-[#161A23] border-white/10 text-slate-300 hover:border-white/25'
              }`}
            >
              {s.shortLabel}
            </button>
          ))}
        </div>
      </div>

      {activeSeason?.groups.map(group => {
        const standings = computeStandings(group, membersMap);
        return (
          <section
            key={group.level}
            className="rounded-3xl bg-[#161A23] border border-white/10 p-5 shadow-xl space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <KlTrophyIcon className="w-5 h-5 text-[#10B981]" />
                <h3 className="text-base sm:text-lg font-black text-white">
                  {group.name}
                </h3>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-white/5 text-[11px] font-bold text-slate-300">
                {standings.length} Spieler
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-[11px] font-black uppercase text-slate-400">
                    <th className="py-2 pr-2">#</th>
                    <th className="py-2 px-2">Spieler</th>
                    <th className="py-2 px-2 text-center">Sp</th>
                    <th className="py-2 px-2 text-center">S/N</th>
                    <th className="py-2 px-2 text-center">Sätze</th>
                    <th className="py-2 pl-2 text-right">Pkt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-xs">
                  {standings.map((row, idx) => {
                    const member = membersMap[row.playerId];
                    if (!member) return null;
                    const isMe = currentUser?.id === member.id;
                    const isPromo = idx === 0 && group.level > 1;
                    const isReleg =
                      idx === standings.length - 1 &&
                      standings.length > 2 &&
                      group.level < activeSeason.groups.length;

                    return (
                      <tr
                        key={row.playerId}
                        className={isMe ? 'bg-[#10B981]/10' : 'hover:bg-white/5'}
                      >
                        <td className="py-2.5 pr-2 font-black text-slate-300">
                          <div className="inline-flex items-center gap-1">
                            <span>{idx + 1}</span>
                            {isPromo && (
                              <KlArrowUpRightIcon className="w-3.5 h-3.5 text-[#34D399]" />
                            )}
                            {isReleg && (
                              <KlArrowDownRightIcon className="w-3.5 h-3.5 text-rose-400" />
                            )}
                          </div>
                        </td>
                        <td className="py-2.5 px-2">
                          <button
                            type="button"
                            onClick={() => onOpenProfile(member.id)}
                            className="font-black text-white hover:text-[#34D399] text-left cursor-pointer"
                          >
                            {member.nickname}
                          </button>
                        </td>
                        <td className="py-2.5 px-2 text-center text-slate-300">
                          {row.played}
                        </td>
                        <td className="py-2.5 px-2 text-center text-slate-300">
                          {row.won}/{row.lost}
                        </td>
                        <td className="py-2.5 px-2 text-center text-slate-300">
                          {row.setsFor}:{row.setsAgainst}
                        </td>
                        <td className="py-2.5 pl-2 text-right font-black text-[#34D399]">
                          {row.points}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="pt-2 border-t border-white/10 space-y-2">
              <p className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                Begegnungen
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {group.matches.map(match => {
                  const p1 = membersMap[match.player1Id];
                  const p2 = membersMap[match.player2Id];
                  if (!p1 || !p2) return null;
                  const played = match.setsP1 !== null && match.setsP2 !== null;

                  return (
                    <button
                      key={match.id}
                      type="button"
                      onClick={() => onOpenResultModal(match)}
                      className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-[#0B0D12] hover:bg-[#1E2430] border border-white/10 text-xs transition cursor-pointer"
                    >
                      <span className="font-bold text-slate-200 truncate">
                        {p1.nickname} vs. {p2.nickname}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-lg font-black shrink-0 ${
                          played
                            ? 'bg-[#10B981]/15 text-[#34D399]'
                            : 'bg-white/5 text-slate-400'
                        }`}
                      >
                        {played ? `${match.setsP1}:${match.setsP2}` : 'Offen'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}

// ============================================================================
// LIVE HALLEN TAB (OHNE NAMENSANZEIGE, NUR DAUER & STATUS)
// ============================================================================
function HallLiveTab({
  membersMap,
  currentUser,
  nowTick,
  onRequestSelectUser,
  onCheckIn,
  onCheckOut,
}) {
  const [minutes, setMinutes] = useState(120);
  const [mood, setMood] = useState(CHECKIN_MOODS[0]);

  const checkedInPlayers = useMemo(
    () =>
      Object.values(membersMap).filter(m => isMemberCheckedIn(m, nowTick)),
    [membersMap, nowTick]
  );

  const isCurrentLive = isMemberCheckedIn(currentUser, nowTick);

  return (
    <div className="space-y-5">
      <section className="rounded-3xl bg-[#161A23] border border-white/10 p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-white">LIVE Halle</h2>
            <p className="text-xs text-slate-400">
              Anonyme Live-Auslastung – nur Dauer & Spielstatus sichtbar
            </p>
          </div>
          <span className="px-3 py-1.5 rounded-full bg-[#10B981]/15 border border-[#10B981]/30 text-[#34D399] text-xs font-black">
            {checkedInPlayers.length} in der Halle
          </span>
        </div>

        {!currentUser ? (
          <div className="p-4 rounded-2xl bg-[#0B0D12] border border-white/10 space-y-2.5">
            <p className="text-xs text-slate-300 font-semibold">
              Wähle zuerst dein Profil aus, um dich in der Halle einzuchecken:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {Object.values(membersMap).map(m => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => onRequestSelectUser(m.id)}
                  className="px-3 py-1.5 rounded-xl bg-[#161A23] hover:border-[#10B981] border border-white/10 text-xs font-bold text-white cursor-pointer"
                >
                  {m.nickname}
                </button>
              ))}
            </div>
          </div>
        ) : isCurrentLive ? (
          <div className="p-4 rounded-2xl bg-[#0B0D12] border border-[#10B981]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black text-[#34D399]">
                Dein Check-in läuft · noch{' '}
                {formatRemainingTime(currentUser.checkedInUntil, nowTick)}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                Status: {currentUser.checkInMood || CHECKIN_MOODS[0]}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onCheckOut(currentUser.id)}
              className="min-h-[42px] px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-200 text-xs font-black cursor-pointer"
            >
              CHECK-OUT
            </button>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-[#0B0D12] border border-white/10 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">
                  Dauer
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[60, 90, 120, 180].map(m => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMinutes(m)}
                      className={`min-h-[40px] rounded-xl text-xs font-black border cursor-pointer ${
                        minutes === m
                          ? 'bg-[#10B981] border-[#10B981] text-slate-950'
                          : 'bg-[#161A23] border-white/10 text-slate-300'
                      }`}
                    >
                      {m >= 60 ? `${m / 60}h` : `${m}m`}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">
                  Status
                </label>
                <select
                  value={mood}
                  onChange={e => setMood(e.target.value)}
                  className="w-full min-h-[40px] px-3 rounded-xl bg-[#161A23] border border-white/10 text-xs font-bold text-white"
                >
                  {CHECKIN_MOODS.map(item => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onCheckIn(currentUser.id, minutes, mood)}
              className="w-full min-h-[44px] rounded-xl bg-[#10B981] hover:bg-emerald-400 text-slate-950 text-xs font-black cursor-pointer"
            >
              Jetzt einchecken
            </button>
          </div>
        )}

        <div className="space-y-2.5 pt-2">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
            Aktuell in der Halle ({checkedInPlayers.length})
          </h3>
          {checkedInPlayers.length === 0 ? (
            <div className="p-4 rounded-2xl bg-[#0B0D12] border border-white/10 text-xs text-slate-400">
              Momentan ist niemand eingecheckt.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {checkedInPlayers.map((player, index) => (
                <div
                  key={player.id}
                  className="p-3.5 rounded-2xl bg-[#0B0D12] border border-[#10B981]/30 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-xl bg-[#10B981]/15 text-[#34D399] font-black text-xs flex items-center justify-center">
                      #{index + 1}
                    </span>
                    <div>
                      <p className="text-xs font-black text-white">
                        {player.checkInMood || CHECKIN_MOODS[0]}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Noch {formatRemainingTime(player.checkedInUntil, nowTick)}
                      </p>
                    </div>
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse" />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

// ============================================================================
// FOLGEMONAT TAB
// ============================================================================
function NextMonthTab({
  membersMap,
  activeSeason,
  currentUser,
  onToggleNextMonth,
  onOpenProfile,
}) {
  const allMembers = useMemo(() => Object.values(membersMap), [membersMap]);

  const confirmedMembers = useMemo(
    () =>
      allMembers
        .filter(m => m.status === 'Dabei' && m.nextMonthOptIn)
        .sort((a, b) => b.annualPoints - a.annualPoints),
    [allMembers]
  );

  const pausedMembers = useMemo(
    () =>
      allMembers.filter(
        m => m.status === 'Pausiert' || (m.status === 'Dabei' && !m.nextMonthOptIn)
      ),
    [allMembers]
  );

  const pendingMembers = useMemo(
    () => allMembers.filter(m => m.status === 'Offen'),
    [allMembers]
  );

  return (
    <div className="space-y-5">
      <section className="rounded-3xl bg-[#161A23] border border-white/10 p-5 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-black text-white">Folgemonat Übersicht</h2>
            <p className="text-xs text-slate-400">
              Teilnehmerstatus für die nächste Monatsrunde nach {activeSeason?.label}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-[#10B981]/15 text-[#34D399] text-xs font-black">
              {confirmedMembers.length} Dabei
            </span>
            <span className="px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 text-xs font-black">
              {pausedMembers.length} Pause
            </span>
          </div>
        </div>

        {currentUser && currentUser.status === 'Dabei' && (
          <div className="p-3.5 rounded-2xl bg-[#0B0D12] border border-[#10B981]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black text-white">
                Dein Status für den Folgemonat ({currentUser.nickname})
              </p>
              <p className="text-[11px] text-slate-400">
                {currentUser.nextMonthOptIn
                  ? 'Du bist automatisch für die nächste Runde eingeplant.'
                  : 'Du setzt im nächsten Monat aus.'}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:w-56">
              <button
                type="button"
                onClick={() => {
                  if (!currentUser.nextMonthOptIn) onToggleNextMonth();
                }}
                className={`min-h-[40px] px-3 rounded-xl text-xs font-black border cursor-pointer ${
                  currentUser.nextMonthOptIn
                    ? 'bg-[#10B981] border-[#10B981] text-slate-950'
                    : 'bg-[#161A23] border-white/10 text-slate-300'
                }`}
              >
                Dabei
              </button>
              <button
                type="button"
                onClick={() => {
                  if (currentUser.nextMonthOptIn) onToggleNextMonth();
                }}
                className={`min-h-[40px] px-3 rounded-xl text-xs font-black border cursor-pointer ${
                  !currentUser.nextMonthOptIn
                    ? 'bg-amber-500 border-amber-500 text-slate-950'
                    : 'bg-[#161A23] border-white/10 text-slate-300'
                }`}
              >
                Pause
              </button>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <h3 className="text-xs font-black uppercase tracking-wider text-[#34D399]">
            Dabei ({confirmedMembers.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {confirmedMembers.map((m, i) => (
              <button
                key={m.id}
                type="button"
                onClick={() => onOpenProfile(m.id)}
                className="flex items-center justify-between p-3 rounded-2xl bg-[#0B0D12] hover:bg-[#1E2430] border border-white/10 text-left cursor-pointer"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-xs font-black text-slate-400 w-5">
                    {i + 1}.
                  </span>
                  <span className="text-sm font-black text-white truncate">
                    {m.nickname}
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-lg bg-[#10B981]/15 text-[#34D399] text-[11px] font-black">
                  Dabei
                </span>
              </button>
            ))}
          </div>
        </div>

        {pausedMembers.length > 0 && (
          <div className="space-y-2 pt-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-amber-300">
              Pause ({pausedMembers.length})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {pausedMembers.map(m => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => onOpenProfile(m.id)}
                  className="flex items-center justify-between p-3 rounded-2xl bg-[#0B0D12] border border-white/10 text-left cursor-pointer"
                >
                  <span className="text-sm font-bold text-slate-300 truncate">
                    {m.nickname}
                  </span>
                  <span className="px-2 py-0.5 rounded-lg bg-amber-500/15 text-amber-300 text-[11px] font-black">
                    Pause
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {pendingMembers.length > 0 && (
          <div className="space-y-2 pt-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
              Offen · Wartet auf Admin-Freigabe ({pendingMembers.length})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {pendingMembers.map(m => (
                <div
                  key={m.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-[#0B0D12] border border-white/10"
                >
                  <span className="text-sm font-bold text-slate-300 truncate">
                    {m.nickname}
                  </span>
                  <span className="px-2 py-0.5 rounded-lg bg-white/10 text-slate-300 text-[11px] font-black">
                    Offen
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

// ============================================================================
// LETZTE SPIELE TAB
// ============================================================================
function RecentMatchesTab({
  membersMap,
  seasons,
  activeSeason,
  onSelectSeason,
  onOpenProfile,
}) {
  const playedMatches = useMemo(() => {
    if (!activeSeason) return [];
    const list = [];
    activeSeason.groups.forEach(group => {
      group.matches.forEach(m => {
        if (m.setsP1 !== null && m.setsP2 !== null) {
          list.push({ ...m, groupName: group.name });
        }
      });
    });
    return list.sort((a, b) => (b.playedAt || '').localeCompare(a.playedAt || ''));
  }, [activeSeason]);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-white">Gespielte Matches</h2>
          <p className="text-xs text-slate-400">
            Alle eingetragenen Resultate in {activeSeason?.label}
          </p>
        </div>
        <div className="flex gap-1.5">
          {seasons.map(s => (
            <button
              key={s.id}
              type="button"
              onClick={() => onSelectSeason(s.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black border cursor-pointer ${
                activeSeason?.id === s.id
                  ? 'bg-[#10B981] border-[#10B981] text-slate-950'
                  : 'bg-[#161A23] border-white/10 text-slate-300'
              }`}
            >
              {s.shortLabel}
            </button>
          ))}
        </div>
      </div>

      {playedMatches.length === 0 ? (
        <div className="rounded-3xl bg-[#161A23] border border-white/10 p-6 text-xs text-slate-400">
          In diesem Monat wurden noch keine Resultate eingetragen.
        </div>
      ) : (
        <div className="space-y-2.5">
          {playedMatches.map(match => {
            const p1 = membersMap[match.player1Id];
            const p2 = membersMap[match.player2Id];
            if (!p1 || !p2) return null;
            const p1Won = match.setsP1 > match.setsP2;

            return (
              <div
                key={match.id}
                className="rounded-2xl bg-[#161A23] border border-white/10 p-4 flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                    <span className="font-bold text-[#34D399]">{match.groupName}</span>
                    {match.playedAt && <span>· {match.playedAt}</span>}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <button
                      type="button"
                      onClick={() => onOpenProfile(p1.id)}
                      className={`font-black cursor-pointer ${
                        p1Won ? 'text-white' : 'text-slate-400'
                      }`}
                    >
                      {p1.nickname}
                    </button>
                    <span className="text-slate-500">vs.</span>
                    <button
                      type="button"
                      onClick={() => onOpenProfile(p2.id)}
                      className={`font-black cursor-pointer ${
                        !p1Won ? 'text-white' : 'text-slate-400'
                      }`}
                    >
                      {p2.nickname}
                    </button>
                  </div>
                </div>
                <span className="px-3 py-1.5 rounded-xl bg-[#0B0D12] border border-white/10 text-sm font-black text-[#34D399] shrink-0">
                  {match.setsP1} : {match.setsP2}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// JAHRESRANGLISTE TAB
// ============================================================================
function AnnualRankingTab({ membersMap, currentUser, onOpenProfile }) {
  const rankedMembers = useMemo(
    () =>
      Object.values(membersMap)
        .filter(m => m.status !== 'Gesperrt')
        .sort((a, b) => b.annualPoints - a.annualPoints),
    [membersMap]
  );

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-black text-white">Jahresrangliste 2026</h2>
        <p className="text-xs text-slate-400">
          Gesamtwertung über alle gespielten Monatsrunden
        </p>
      </div>

      <section className="rounded-3xl bg-[#161A23] border border-white/10 p-5 shadow-xl space-y-2.5">
        {rankedMembers.map((member, index) => {
          const isMe = currentUser?.id === member.id;
          return (
            <button
              key={member.id}
              type="button"
              onClick={() => onOpenProfile(member.id)}
              className={`w-full flex items-center justify-between gap-3 p-3.5 rounded-2xl border text-left transition cursor-pointer ${
                isMe
                  ? 'bg-[#10B981]/15 border-[#10B981]/40'
                  : 'bg-[#0B0D12] hover:bg-[#1E2430] border-white/10'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black shrink-0 ${
                    index === 0
                      ? 'bg-amber-400 text-slate-950'
                      : index === 1
                      ? 'bg-slate-300 text-slate-950'
                      : index === 2
                      ? 'bg-amber-700 text-white'
                      : 'bg-white/5 text-slate-400'
                  }`}
                >
                  {index + 1}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-black text-white truncate">
                    {member.nickname}
                  </p>
                  <p className="text-[11px] text-slate-400 truncate">
                    {member.firstName} {member.lastName} · {member.style}
                  </p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-black text-[#34D399]">
                  {member.annualPoints} Pkt
                </p>
                {member.seasonTitles > 0 && (
                  <p className="text-[10px] font-bold text-amber-300">
                    {member.seasonTitles}× Monatssieger
                  </p>
                )}
              </div>
            </button>
          );
        })}
      </section>
    </div>
  );
}

// ============================================================================
// SPIELER VERZEICHNIS TAB
// ============================================================================
function PlayersTab({
  membersMap,
  activeSeason,
  nowTick,
  onOpenProfile,
  onOpenAddMember,
}) {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return Object.values(membersMap).filter(m => {
      if (!q) return true;
      return (
        m.nickname.toLowerCase().includes(q) ||
        `${m.firstName} ${m.lastName}`.toLowerCase().includes(q) ||
        m.style.toLowerCase().includes(q)
      );
    });
  }, [membersMap, search]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-white">Spielerkader</h2>
          <p className="text-xs text-slate-400">
            {Object.keys(membersMap).length} registrierte Spieler
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenAddMember}
          className="px-3.5 py-2 rounded-xl bg-[#10B981] hover:bg-emerald-400 text-slate-950 text-xs font-black inline-flex items-center gap-1.5 cursor-pointer"
        >
          <KlUserPlusIcon className="w-4 h-4" />
          <span>NEW PLAYER</span>
        </button>
      </div>

      <div className="relative">
        <KlSearchIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Nach Nickname, Name oder Spielstil filtern..."
          className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#161A23] border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#10B981]"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filtered.map(member => {
          const group = activeSeason?.groups.find(g =>
            g.playerIds.includes(member.id)
          );
          const live = isMemberCheckedIn(member, nowTick);

          return (
            <button
              key={member.id}
              type="button"
              onClick={() => onOpenProfile(member.id)}
              className="p-4 rounded-2xl bg-[#161A23] hover:bg-[#1C212D] border border-white/10 text-left flex items-start justify-between gap-3 transition cursor-pointer"
            >
              <div className="flex items-start gap-3 min-w-0">
                <div
                  className={`w-11 h-11 rounded-xl bg-gradient-to-br ${member.avatarBg} flex items-center justify-center text-white font-black text-sm shrink-0`}
                >
                  {member.nickname.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0 space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-black text-white truncate">
                      {member.nickname}
                    </p>
                    {live && (
                      <span className="w-2 h-2 rounded-full bg-[#10B981] shrink-0" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 truncate">
                    {member.firstName} {member.lastName} · {member.language} ·{' '}
                    {member.style}
                  </p>
                  {member.bio && (
                    <p className="text-[11px] text-slate-300 line-clamp-2">
                      {member.bio}
                    </p>
                  )}
                  <p className="text-[11px] text-slate-500 truncate">
                    Hallentage: {member.usualDays?.join(', ') || '–'}
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-white/5 text-[11px] font-black text-slate-200 shrink-0">
                {group ? group.name : member.status}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================================
// ADMIN TAB
// ============================================================================
function AdminTab({
  membersMap,
  seasons,
  activeSeason,
  allowDirectEntry,
  onToggleDirectEntry,
  monthEndMode,
  onChangeMonthEndMode,
  onApproveMember,
  onDirectEntryMember,
  onUpdateMemberStatus,
  onToggleMemberNextMonth,
  onDeleteMember,
  onMovePlayerLeague,
  onRemovePlayerFromLeague,
  onAdminUpdateMatch,
  onCreateNextMonth,
  onDeleteSeason,
  onResetDemoData,
}) {
  const [adminPin, setAdminPin] = useState(() => {
    try {
      return window.localStorage?.getItem('kongleague_admin_pin') || '1234';
    } catch {
      return '1234';
    }
  });
  const [unlocked, setUnlocked] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [newPinInput, setNewPinInput] = useState('');
  const [pinSavedMsg, setPinSavedMsg] = useState('');
  const [adminFeedback, setAdminFeedback] = useState('');
  const [confirmDeleteSeasonId, setConfirmDeleteSeasonId] = useState(null);
  const [confirmDeleteMemberId, setConfirmDeleteMemberId] = useState(null);

  useEffect(() => {
    try {
      window.localStorage?.setItem('kongleague_admin_pin', adminPin);
    } catch {
      // Speicherzugriff optional
    }
  }, [adminPin]);

  const handleUnlock = e => {
    e.preventDefault();
    let currentStoredPin = adminPin;
    try {
      const fromStorage = window.localStorage?.getItem('kongleague_admin_pin');
      if (fromStorage) currentStoredPin = fromStorage;
    } catch {
      // ignore
    }
    if (pinInput.trim() === currentStoredPin) {
      setUnlocked(true);
      setPinError('');
    } else {
      setPinError('Falscher Admin-PIN.');
    }
  };

  const handleChangePin = e => {
    e.preventDefault();
    const cleaned = newPinInput.trim();
    if (cleaned.length < 4) {
      setPinSavedMsg('Bitte mindestens 4 Zeichen eingeben.');
      return;
    }
    setAdminPin(cleaned);
    try {
      window.localStorage?.setItem('kongleague_admin_pin', cleaned);
    } catch {
      // ignore
    }
    setNewPinInput('');
    setPinSavedMsg(`Neuer Admin-PIN (${cleaned}) gespeichert!`);
    setAdminFeedback(`Admin-PIN erfolgreich auf "${cleaned}" überschrieben.`);
  };

  const allMembers = useMemo(() => Object.values(membersMap), [membersMap]);
  const pendingApprovalMembers = useMemo(
    () => allMembers.filter(m => m.status === 'Offen'),
    [allMembers]
  );

  if (!unlocked) {
    return (
      <section className="max-w-md mx-auto rounded-3xl bg-[#161A23] border border-white/10 p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-[#10B981]/15 text-[#34D399] flex items-center justify-center">
            <KlShieldIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white">Admin-Bereich</h2>
            <p className="text-xs text-slate-400">Standard-PIN: 1234</p>
          </div>
        </div>

        <form onSubmit={handleUnlock} className="space-y-3">
          <input
            type="password"
            value={pinInput}
            onChange={e => setPinInput(e.target.value)}
            placeholder="Admin-PIN eingeben..."
            className="w-full px-4 py-3 rounded-2xl bg-[#0B0D12] border border-white/10 text-sm text-white focus:outline-none focus:border-[#10B981]"
          />
          {pinError && <p className="text-xs font-bold text-rose-400">{pinError}</p>}
          <button
            type="submit"
            className="w-full min-h-[44px] rounded-2xl bg-[#10B981] hover:bg-emerald-400 text-slate-950 text-xs font-black cursor-pointer"
          >
            Entsperren
          </button>
        </form>
      </section>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-white">Liga-Administration</h2>
          <p className="text-xs text-slate-400">
            Freigaben, Direkteinstieg, Monatswechsel & Ligaverwaltung
          </p>
        </div>
        <button
          type="button"
          onClick={() => setUnlocked(false)}
          className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-slate-300 cursor-pointer"
        >
          Sperren
        </button>
      </div>

      {adminFeedback && (
        <div className="p-3.5 rounded-2xl bg-[#10B981]/15 border border-[#10B981]/40 text-xs font-bold text-[#34D399] flex items-center justify-between">
          <span>{adminFeedback}</span>
          <button
            type="button"
            onClick={() => setAdminFeedback('')}
            className="text-slate-300 hover:text-white cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* NEUE PROFILE FREIGEBEN */}
      <section className="rounded-3xl bg-[#161A23] border border-amber-500/35 p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm sm:text-base font-black text-white">
            Neue Profile freigeben ({pendingApprovalMembers.length})
          </h3>
          <button
            type="button"
            onClick={onToggleDirectEntry}
            className={`px-3 py-1 rounded-full text-[11px] font-black border cursor-pointer ${
              allowDirectEntry
                ? 'bg-[#10B981]/20 border-[#10B981]/40 text-[#34D399]'
                : 'bg-white/5 border-white/10 text-slate-400'
            }`}
          >
            Direkteinstieg: {allowDirectEntry ? 'AN' : 'AUS'}
          </button>
        </div>

        {pendingApprovalMembers.length === 0 ? (
          <p className="text-xs text-slate-400">
            Aktuell warten keine neuen Spielerprofile auf Freigabe.
          </p>
        ) : (
          <div className="space-y-2">
            {pendingApprovalMembers.map(member => (
              <div
                key={member.id}
                className="p-3.5 rounded-2xl bg-[#0B0D12] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <p className="text-sm font-black text-white">
                    {member.nickname}{' '}
                    <span className="text-xs font-normal text-slate-400">
                      ({member.firstName} {member.lastName})
                    </span>
                  </p>
                  <p className="text-[11px] text-slate-400">
                    WhatsApp: {member.whatsapp || '–'} · Sprache: {member.language} ·
                    Folgemonat: {member.nextMonthOptIn ? 'Dabei' : 'Warten'}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onApproveMember(member.id);
                      setAdminFeedback(`${member.nickname} wurde auf «Dabei» freigegeben.`);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-[#10B981] text-slate-950 text-xs font-black cursor-pointer"
                  >
                    Freigeben (Dabei)
                  </button>

                  {allowDirectEntry && (
                    <button
                      type="button"
                      onClick={() => {
                        onDirectEntryMember(member.id);
                        setAdminFeedback(
                          `${member.nickname} wurde freigegeben und direkt in die laufende Liga eingeteilt.`
                        );
                      }}
                      className="px-3 py-1.5 rounded-xl bg-sky-500 text-slate-950 text-xs font-black cursor-pointer"
                    >
                      Freigeben & Direkteinstieg
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => onDeleteMember(member.id)}
                    className="px-3 py-1.5 rounded-xl bg-rose-500/20 text-rose-200 text-xs font-black cursor-pointer"
                  >
                    Ablehnen
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* MONATSABSCHLUSS-CHECK STEUERUNG */}
      <section className="rounded-3xl bg-[#161A23] border border-white/10 p-5 shadow-xl space-y-3">
        <h3 className="text-sm sm:text-base font-black text-white">
          Monatsabschluss-Check auf Home
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'auto', label: 'Auto (ab 26.)' },
            { id: 'show', label: 'Einblenden' },
            { id: 'hide', label: 'Ausblenden' },
          ].map(opt => (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChangeMonthEndMode(opt.id)}
              className={`min-h-[40px] px-3 rounded-xl text-xs font-black border cursor-pointer ${
                monthEndMode === opt.id
                  ? 'bg-[#10B981] border-[#10B981] text-slate-950'
                  : 'bg-[#0B0D12] border-white/10 text-slate-300'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </section>

      {/* MONATSWECHSEL & VORHANDENE MONATE */}
      <section className="rounded-3xl bg-[#161A23] border border-white/10 p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm sm:text-base font-black text-white">
              Monatswechsel & Auf-/Abstieg
            </h3>
            <p className="text-xs text-slate-400">
              Erstellt den nächsten Monat basierend auf den aktuellen Tabellen und Folgemonat-Zusagen.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              const createdLabel = onCreateNextMonth();
              if (createdLabel) {
                setAdminFeedback(`Neuer Monat "${createdLabel}" wurde erstellt!`);
              }
            }}
            className="px-4 py-2.5 rounded-xl bg-[#10B981] hover:bg-emerald-400 text-slate-950 text-xs font-black shrink-0 cursor-pointer"
          >
            + Neuen Monat starten
          </button>
        </div>

        <div className="space-y-2 pt-2 border-t border-white/10">
          <p className="text-[11px] font-black uppercase tracking-wider text-slate-400">
            Vorhandene Monate ({seasons.length})
          </p>
          {seasons.map(season => (
            <div
              key={season.id}
              className="p-3 rounded-2xl bg-[#0B0D12] border border-white/10 flex items-center justify-between gap-2"
            >
              <span className="text-xs font-black text-white">{season.label}</span>
              {seasons.length > 1 && (
                <div>
                  {confirmDeleteSeasonId === season.id ? (
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          onDeleteSeason(season.id);
                          setConfirmDeleteSeasonId(null);
                          setAdminFeedback(`Monat "${season.label}" wurde gelöscht.`);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-rose-500 text-white text-[11px] font-black cursor-pointer"
                      >
                        Endgültig löschen
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteSeasonId(null)}
                        className="px-2 py-1 rounded-lg bg-white/10 text-slate-300 text-[11px] font-bold cursor-pointer"
                      >
                        Abbrechen
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteSeasonId(season.id)}
                      className="px-2.5 py-1 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 text-[11px] font-black cursor-pointer"
                    >
                      Monat löschen
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* LIGAZUTEILUNG & MATCH-KORREKTUR IM AKTUELLEN MONAT */}
      {activeSeason && (
        <section className="rounded-3xl bg-[#161A23] border border-white/10 p-5 shadow-xl space-y-4">
          <h3 className="text-sm sm:text-base font-black text-white">
            Ligazuteilung & Match-Resultate ({activeSeason.label})
          </h3>

          {activeSeason.groups.map(group => (
            <div
              key={group.level}
              className="p-3.5 rounded-2xl bg-[#0B0D12] border border-white/10 space-y-3"
            >
              <p className="text-xs font-black text-[#34D399]">{group.name}</p>

              <div className="space-y-1.5">
                {group.playerIds.map(pid => {
                  const m = membersMap[pid];
                  if (!m) return null;
                  return (
                    <div
                      key={pid}
                      className="flex items-center justify-between gap-2 text-xs py-1"
                    >
                      <span className="font-bold text-white">{m.nickname}</span>
                      <div className="flex items-center gap-1.5">
                        {activeSeason.groups.length > 1 && (
                          <select
                            value={group.level}
                            onChange={e =>
                              onMovePlayerLeague(
                                activeSeason.id,
                                pid,
                                Number(e.target.value)
                              )
                            }
                            className="px-2 py-1 rounded-lg bg-[#161A23] border border-white/10 text-[11px] text-white"
                          >
                            {activeSeason.groups.map(targetG => (
                              <option key={targetG.level} value={targetG.level}>
                                {targetG.name}
                              </option>
                            ))}
                          </select>
                        )}
                        <button
                          type="button"
                          onClick={() =>
                            onRemovePlayerFromLeague(activeSeason.id, group.level, pid)
                          }
                          className="px-2 py-1 rounded-lg bg-rose-500/15 text-rose-300 text-[11px] font-bold cursor-pointer"
                        >
                          Entfernen
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 border-t border-white/10 space-y-1.5">
                <p className="text-[11px] font-bold text-slate-400">Begegnungen</p>
                {group.matches.map(match => {
                  const p1 = membersMap[match.player1Id];
                  const p2 = membersMap[match.player2Id];
                  if (!p1 || !p2) return null;
                  const hasResult = match.setsP1 !== null && match.setsP2 !== null;
                  return (
                    <div
                      key={match.id}
                      className="flex items-center justify-between gap-2 text-xs py-1"
                    >
                      <span className="text-slate-300 truncate">
                        {p1.nickname} vs. {p2.nickname}
                      </span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="font-black text-white">
                          {hasResult ? `${match.setsP1}:${match.setsP2}` : 'Offen'}
                        </span>
                        {hasResult && (
                          <button
                            type="button"
                            onClick={() =>
                              onAdminUpdateMatch(match.id, null, null)
                            }
                            className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-black cursor-pointer"
                          >
                            Reset
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* MITGLIEDERSTATUS & FOLGEMONAT */}
      <section className="rounded-3xl bg-[#161A23] border border-white/10 p-5 shadow-xl space-y-3">
        <h3 className="text-sm sm:text-base font-black text-white">
          Mitgliederstatus & Folgemonat ({allMembers.length})
        </h3>
        <div className="space-y-2">
          {allMembers.map(member => (
            <div
              key={member.id}
              className="p-3 rounded-2xl bg-[#0B0D12] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
            >
              <div>
                <p className="text-xs font-black text-white">
                  {member.nickname}{' '}
                  <span className="text-slate-400 font-normal">
                    ({member.firstName} {member.lastName} · PIN: {member.pin})
                  </span>
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                <select
                  value={member.status}
                  onChange={e => onUpdateMemberStatus(member.id, e.target.value)}
                  className="px-2.5 py-1 rounded-lg bg-[#161A23] border border-white/10 text-xs font-bold text-white"
                >
                  <option value="Dabei">Dabei</option>
                  <option value="Offen">Offen</option>
                  <option value="Pausiert">Pausiert</option>
                  <option value="Gesperrt">Gesperrt</option>
                </select>

                <button
                  type="button"
                  onClick={() => onToggleMemberNextMonth(member.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-black border cursor-pointer ${
                    member.nextMonthOptIn
                      ? 'bg-[#10B981]/15 border-[#10B981]/35 text-[#34D399]'
                      : 'bg-amber-500/15 border-amber-500/35 text-amber-300'
                  }`}
                >
                  Folgemonat: {member.nextMonthOptIn ? 'Dabei' : 'Pause'}
                </button>

                {confirmDeleteMemberId === member.id ? (
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        onDeleteMember(member.id);
                        setConfirmDeleteMemberId(null);
                      }}
                      className="px-2 py-1 rounded-lg bg-rose-500 text-white text-[11px] font-black cursor-pointer"
                    >
                      Endgültig löschen
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteMemberId(null)}
                      className="px-2 py-1 rounded-lg bg-white/10 text-slate-300 text-[11px] cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmDeleteMemberId(member.id)}
                    className="p-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 cursor-pointer"
                    title="Mitglied löschen"
                  >
                    <KlTrashIcon className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ADMIN-PIN ÄNDERN & DEMO RESET */}
      <section className="rounded-3xl bg-[#161A23] border border-white/10 p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm sm:text-base font-black text-white">
            Admin-PIN ändern
          </h3>
          <span className="px-2.5 py-1 rounded-lg bg-white/5 text-[11px] font-mono text-slate-300">
            Aktiv: {adminPin}
          </span>
        </div>

        <form onSubmit={handleChangePin} className="flex gap-2">
          <input
            type="text"
            value={newPinInput}
            onChange={e => setNewPinInput(e.target.value)}
            placeholder="Neuer Admin-PIN (mind. 4 Zeichen)"
            className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#0B0D12] border border-white/10 text-xs text-white focus:outline-none focus:border-[#10B981]"
          />
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-[#10B981] text-slate-950 text-xs font-black shrink-0 cursor-pointer"
          >
            PIN überschreiben
          </button>
        </form>
        {pinSavedMsg && (
          <p className="text-xs font-bold text-[#34D399]">{pinSavedMsg}</p>
        )}

        <div className="pt-3 border-t border-white/10 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Alle Demo-Daten auf Ausgangszustand zurücksetzen
          </span>
          <button
            type="button"
            onClick={() => {
              onResetDemoData();
              setAdminFeedback('Demo-Daten wurden zurückgesetzt.');
            }}
            className="px-3 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-200 text-xs font-black cursor-pointer"
          >
            Reset Demo
          </button>
        </div>
      </section>
    </div>
  );
}

// ============================================================================
// MODALS (PIN-LOGIN, MATCH RESULTAT, STAMMDATEN & HALLENTAGE, NEW PLAYER, ETC.)
// ============================================================================
function PlayerPinLoginModal({ member, onSuccess, onClose }) {
  const [pinInput, setPinInput] = useState('');
  const [error, setError] = useState('');

  if (!member) return null;

  const handleSubmit = e => {
    e.preventDefault();
    if (pinInput.trim() === String(member.pin || '')) {
      onSuccess(member.id);
      onClose();
    } else {
      setError('Falscher Spieler-PIN. Bitte erneut versuchen.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-3xl bg-[#161A23] border border-white/15 p-5 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-10 h-10 rounded-xl bg-gradient-to-br ${member.avatarBg} flex items-center justify-center text-white font-black text-sm`}
            >
              {member.nickname.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h3 className="text-base font-black text-white">{member.nickname}</h3>
              <p className="text-[11px] text-slate-400">
                Spieler-PIN eingeben (Demo: {member.pin})
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/5 text-slate-400 hover:text-white cursor-pointer"
          >
            <KlXIcon className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="password"
            inputMode="numeric"
            autoFocus
            value={pinInput}
            onChange={e => {
              setPinInput(e.target.value);
              setError('');
            }}
            placeholder="4-stelliger Spieler-PIN"
            className="w-full px-4 py-3 rounded-2xl bg-[#0B0D12] border border-white/10 text-center text-base font-mono tracking-widest text-white focus:outline-none focus:border-[#10B981]"
          />
          {error && <p className="text-xs font-bold text-rose-400">{error}</p>}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 min-h-[42px] rounded-xl bg-white/5 text-xs font-bold text-slate-300 cursor-pointer"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              className="flex-1 min-h-[42px] rounded-xl bg-[#10B981] text-slate-950 text-xs font-black cursor-pointer"
            >
              Profil öffnen
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function MatchResultModal({ match, membersMap, onClose, onSaveResult }) {
  const p1 = membersMap[match.player1Id];
  const p2 = membersMap[match.player2Id];
  const [setsP1, setSetsP1] = useState(match.setsP1 ?? 3);
  const [setsP2, setSetsP2] = useState(match.setsP2 ?? 0);

  if (!p1 || !p2) return null;

  const presets = [
    [3, 0],
    [3, 1],
    [3, 2],
    [2, 3],
    [1, 3],
    [0, 3],
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-3xl bg-[#161A23] border border-white/15 p-5 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black text-white">Spielresultat eintragen</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/5 text-slate-400 hover:text-white cursor-pointer"
          >
            <KlXIcon className="w-4 h-4" />
          </button>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#0B0D12] border border-white/10 text-center space-y-1">
          <p className="text-sm font-black text-white">
            {p1.nickname} <span className="text-slate-500">vs.</span> {p2.nickname}
          </p>
          <p className="text-2xl font-black text-[#34D399]">
            {setsP1} : {setsP2}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {presets.map(([s1, s2]) => (
            <button
              key={`${s1}-${s2}`}
              type="button"
              onClick={() => {
                setSetsP1(s1);
                setSetsP2(s2);
              }}
              className={`min-h-[42px] rounded-xl text-xs font-black border cursor-pointer ${
                setsP1 === s1 && setsP2 === s2
                  ? 'bg-[#10B981] border-[#10B981] text-slate-950'
                  : 'bg-[#0B0D12] border-white/10 text-slate-200'
              }`}
            >
              {s1} : {s2}
            </button>
          ))}
        </div>

        <div className="flex gap-2 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 min-h-[44px] rounded-xl bg-white/5 text-xs font-bold text-slate-300 cursor-pointer"
          >
            Abbrechen
          </button>
          <button
            type="button"
            onClick={() => {
              onSaveResult(match.id, setsP1, setsP2);
              onClose();
            }}
            className="flex-1 min-h-[44px] rounded-xl bg-[#10B981] text-slate-950 text-xs font-black cursor-pointer"
          >
            Speichern
          </button>
        </div>
      </div>
    </div>
  );
}

function PlayerProfileModal({
  member,
  activeSeason,
  isOwnProfile,
  initialEditing = false,
  onClose,
  onUpdateProfile,
}) {
  const [editing, setEditing] = useState(Boolean(initialEditing && isOwnProfile));
  const [firstName, setFirstName] = useState(member.firstName);
  const [lastName, setLastName] = useState(member.lastName);
  const [whatsapp, setWhatsapp] = useState(member.whatsapp || '');
  const [language, setLanguage] = useState(member.language || 'DE');
  const [style, setStyle] = useState(member.style || 'Allround');
  const [bio, setBio] = useState(member.bio || '');
  const [pin, setPin] = useState(member.pin || '');
  const [usualDays, setUsualDays] = useState(member.usualDays || []);
  const [usualSlots, setUsualSlots] = useState(member.usualSlots || []);

  const toggleDay = day => {
    setUsualDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const toggleSlot = slot => {
    setUsualSlots(prev =>
      prev.includes(slot) ? prev.filter(s => s !== slot) : [...prev, slot]
    );
  };

  const handleSave = e => {
    e.preventDefault();
    onUpdateProfile(member.id, {
      firstName: firstName.trim() || member.firstName,
      lastName: lastName.trim() || member.lastName,
      whatsapp: whatsapp.trim(),
      language,
      style,
      bio: bio.trim(),
      pin: pin.trim() || member.pin,
      usualDays,
      usualSlots,
    });
    setEditing(false);
  };

  const waUrl = buildWhatsAppUrl(
    member.whatsapp,
    `Hoi ${member.nickname}, wollen wir in der PINGKONG Liga zusammen spielen?`
  );
  const memberGroup = activeSeason?.groups.find(g => g.playerIds.includes(member.id));

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-lg rounded-3xl bg-[#161A23] border border-white/15 p-5 shadow-2xl space-y-4 my-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-11 h-11 rounded-xl bg-gradient-to-br ${member.avatarBg} flex items-center justify-center text-white font-black text-sm`}
            >
              {member.nickname.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h3 className="text-base font-black text-white">{member.nickname}</h3>
              <p className="text-xs text-slate-400">
                {memberGroup ? memberGroup.name : member.status} · {member.annualPoints}{' '}
                Jahrespunkte
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/5 text-slate-400 hover:text-white cursor-pointer"
          >
            <KlXIcon className="w-4 h-4" />
          </button>
        </div>

        {editing ? (
          <form onSubmit={handleSave} className="space-y-3">
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">
                  Vorname
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0B0D12] border border-white/10 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">
                  Nachname
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0B0D12] border border-white/10 text-xs text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">
                  WhatsApp (CH-Format)
                </label>
                <input
                  type="text"
                  value={whatsapp}
                  onChange={e => setWhatsapp(e.target.value)}
                  placeholder="079 269 66 89"
                  className="w-full px-3 py-2 rounded-xl bg-[#0B0D12] border border-white/10 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">
                  Spieler-PIN
                </label>
                <input
                  type="text"
                  value={pin}
                  onChange={e => setPin(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0B0D12] border border-white/10 text-xs text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">
                  Sprache
                </label>
                <select
                  value={language}
                  onChange={e => setLanguage(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0B0D12] border border-white/10 text-xs text-white"
                >
                  <option value="DE">DE</option>
                  <option value="EN">EN</option>
                  <option value="Beides">Beides</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">
                  Spielstil
                </label>
                <select
                  value={style}
                  onChange={e => setStyle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0B0D12] border border-white/10 text-xs text-white"
                >
                  {PLAY_STYLES.map(s => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1">
                Kurzbeschreibung / Spielstärke
              </label>
              <input
                type="text"
                value={bio}
                onChange={e => setBio(e.target.value)}
                placeholder="z.B. Vorhand-Topspin, meistens ab 18:30"
                className="w-full px-3 py-2 rounded-xl bg-[#0B0D12] border border-white/10 text-xs text-white"
              />
            </div>

            {/* HALLENTAGE IN STAMMDATEN */}
            <div className="p-3 rounded-2xl bg-[#0B0D12] border border-white/10 space-y-2.5">
              <p className="text-[11px] font-black uppercase tracking-wider text-[#34D399]">
                Übliche Hallentage & Zeiten
              </p>
              <div className="flex flex-wrap gap-1.5">
                {WEEKDAYS.map(day => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black border cursor-pointer ${
                      usualDays.includes(day)
                        ? 'bg-[#10B981] border-[#10B981] text-slate-950'
                        : 'bg-[#161A23] border-white/10 text-slate-300'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {DAY_SLOTS.map(slot => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => toggleSlot(slot)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border cursor-pointer ${
                      usualSlots.includes(slot)
                        ? 'bg-sky-500 border-sky-500 text-slate-950'
                        : 'bg-[#161A23] border-white/10 text-slate-300'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="flex-1 min-h-[42px] rounded-xl bg-white/5 text-xs font-bold text-slate-300 cursor-pointer"
              >
                Abbrechen
              </button>
              <button
                type="submit"
                className="flex-1 min-h-[42px] rounded-xl bg-[#10B981] text-slate-950 text-xs font-black cursor-pointer"
              >
                Speichern
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-[#0B0D12] border border-white/10 space-y-2">
              <p className="text-slate-300">
                <span className="text-slate-500 font-bold">Name:</span>{' '}
                {member.firstName} {member.lastName}
              </p>
              <p className="text-slate-300">
                <span className="text-slate-500 font-bold">Spielstil:</span>{' '}
                {member.style}
              </p>
              <p className="text-slate-300">
                <span className="text-slate-500 font-bold">Sprache:</span>{' '}
                {member.language}
              </p>
              {member.bio && (
                <p className="text-slate-300">
                  <span className="text-slate-500 font-bold">Info:</span>{' '}
                  {member.bio}
                </p>
              )}
              <p className="text-slate-300">
                <span className="text-slate-500 font-bold">Übliche Hallentage:</span>{' '}
                {member.usualDays?.length
                  ? `${member.usualDays.join(', ')}${
                      member.usualSlots?.length
                        ? ` (${member.usualSlots.join(', ')})`
                        : ''
                    }`
                  : 'Keine angegeben'}
              </p>
              {isOwnProfile && member.pin && (
                <p className="text-slate-300">
                  <span className="text-slate-500 font-bold">Dein PIN:</span>{' '}
                  <span className="font-mono">{member.pin}</span>
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {waUrl && (
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 min-h-[42px] px-4 rounded-xl bg-[#10B981] text-slate-950 font-black inline-flex items-center justify-center gap-1.5"
                >
                  <KlMessageIcon className="w-4 h-4" />
                  <span>WhatsApp schreiben</span>
                </a>
              )}
              {isOwnProfile && (
                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  className="flex-1 min-h-[42px] px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-black inline-flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <KlEditIcon className="w-4 h-4" />
                  <span>Stammdaten bearbeiten</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function AddMemberModal({ onClose, onAddMember }) {
  const [nickname, setNickname] = useState('');
  const [pin, setPin] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [langDe, setLangDe] = useState(true);
  const [langEn, setLangEn] = useState(false);
  const [style, setStyle] = useState('Allround');
  const [startOption, setStartOption] = useState('nextMonth');
  const [error, setError] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    if (!nickname.trim()) {
      setError('Bitte einen Nickname eingeben.');
      return;
    }
    if (pin.trim().length < 4) {
      setError('Bitte einen persönlichen PIN mit mindestens 4 Zeichen festlegen.');
      return;
    }
    if (!langDe && !langEn) {
      setError('Bitte mindestens eine Sprache auswählen.');
      return;
    }

    const language = langDe && langEn ? 'Beides' : langDe ? 'DE' : 'EN';
    onAddMember({
      nickname: nickname.trim(),
      pin: pin.trim(),
      firstName: firstName.trim() || nickname.trim(),
      lastName: lastName.trim(),
      whatsapp: whatsapp.trim(),
      language,
      style,
      nextMonthOptIn: startOption === 'nextMonth',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-md rounded-3xl bg-[#161A23] border border-white/15 p-5 shadow-2xl space-y-4 my-auto">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-white">NEW PLAYER</h3>
            <p className="text-xs text-slate-400">
              Neues Spielerprofil anlegen (Admin-Freigabe erforderlich)
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/5 text-slate-400 hover:text-white cursor-pointer"
          >
            <KlXIcon className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* 1. NICKNAME OBLIGATORISCH ALS ERSTES */}
          <div>
            <label className="block text-[11px] font-black text-[#34D399] mb-1">
              Nickname *
            </label>
            <input
              type="text"
              required
              value={nickname}
              onChange={e => setNickname(e.target.value)}
              placeholder="z.B. SpinMaster"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0D12] border border-[#10B981]/40 text-sm text-white focus:outline-none focus:border-[#10B981]"
            />
          </div>

          {/* 2. PIN FESTLEGEN */}
          <div>
            <label className="block text-[11px] font-black text-slate-300 mb-1">
              Persönlicher PIN festlegen (mind. 4 Zeichen) *
            </label>
            <input
              type="text"
              required
              value={pin}
              onChange={e => setPin(e.target.value)}
              placeholder="z.B. 4821"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0D12] border border-white/10 text-sm text-white focus:outline-none focus:border-[#10B981]"
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1">
                Vorname
              </label>
              <input
                type="text"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                placeholder="Vorname"
                className="w-full px-3 py-2 rounded-xl bg-[#0B0D12] border border-white/10 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1">
                Nachname
              </label>
              <input
                type="text"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                placeholder="Nachname"
                className="w-full px-3 py-2 rounded-xl bg-[#0B0D12] border border-white/10 text-xs text-white"
              />
            </div>
          </div>

          {/* WHATSAPP SCHWEIZER FORMAT */}
          <div>
            <label className="block text-[11px] font-bold text-slate-400 mb-1">
              WhatsApp Nummer (Schweizer Format)
            </label>
            <input
              type="tel"
              value={whatsapp}
              onChange={e => setWhatsapp(e.target.value)}
              placeholder="079 269 66 89"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0D12] border border-white/10 text-xs text-white"
            />
          </div>

          {/* SPRACHAUSWAHL PER CHECKBOX */}
          <div>
            <label className="block text-[11px] font-bold text-slate-400 mb-1.5">
              Welche Sprache wird gesprochen?
            </label>
            <div className="grid grid-cols-2 gap-2">
              <label className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#0B0D12] border border-white/10 text-xs font-bold text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={langDe}
                  onChange={e => setLangDe(e.target.checked)}
                  className="accent-[#10B981] w-4 h-4"
                />
                <span>Deutsch (DE)</span>
              </label>
              <label className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#0B0D12] border border-white/10 text-xs font-bold text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={langEn}
                  onChange={e => setLangEn(e.target.checked)}
                  className="accent-[#10B981] w-4 h-4"
                />
                <span>English (EN)</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 mb-1">
              Spielstil
            </label>
            <select
              value={style}
              onChange={e => setStyle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#0B0D12] border border-white/10 text-xs text-white"
            >
              {PLAY_STYLES.map(s => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* CHECKBOX: DIREKT IM FOLGEMONAT STARTEN ODER NOCH WARTEN */}
          <div className="p-3 rounded-2xl bg-[#0B0D12] border border-white/10 space-y-2">
            <label className="flex items-start gap-2.5 text-xs text-white cursor-pointer">
              <input
                type="checkbox"
                checked={startOption === 'nextMonth'}
                onChange={() => setStartOption('nextMonth')}
                className="accent-[#10B981] w-4 h-4 mt-0.5"
              />
              <span className="font-bold">
                Ich möchte direkt im Folgemonat starten
              </span>
            </label>
            <label className="flex items-start gap-2.5 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={startOption === 'wait'}
                onChange={() => setStartOption('wait')}
                className="accent-amber-500 w-4 h-4 mt-0.5"
              />
              <span className="font-bold">Ich möchte noch warten (Pause)</span>
            </label>
          </div>

          {error && <p className="text-xs font-bold text-rose-400">{error}</p>}

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 min-h-[44px] rounded-xl bg-white/5 text-xs font-bold text-slate-300 cursor-pointer"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              className="flex-1 min-h-[44px] rounded-xl bg-[#10B981] text-slate-950 text-xs font-black cursor-pointer"
            >
              Profil erstellen
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function QuickCheckInModal({
  membersMap,
  currentUser,
  nowTick,
  onRequestSelectUser,
  onCheckIn,
  onCheckOut,
  onGoToHallTab,
  onClose,
}) {
  const [minutes, setMinutes] = useState(120);
  const [mood, setMood] = useState(CHECKIN_MOODS[0]);
  const isLive = isMemberCheckedIn(currentUser, nowTick);

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-3xl bg-[#161A23] border border-white/15 p-5 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black text-white">LIVE Hallen Check-in</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/5 text-slate-400 hover:text-white cursor-pointer"
          >
            <KlXIcon className="w-4 h-4" />
          </button>
        </div>

        {!currentUser ? (
          <div className="space-y-2.5">
            <p className="text-xs text-slate-300">
              Wähle zuerst dein Spielerprofil aus:
            </p>
            <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto">
              {Object.values(membersMap).map(m => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    onClose();
                    onRequestSelectUser(m.id);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-[#0B0D12] border border-white/10 text-xs font-bold text-white cursor-pointer"
                >
                  {m.nickname}
                </button>
              ))}
            </div>
          </div>
        ) : isLive ? (
          <div className="space-y-3">
            <div className="p-3.5 rounded-2xl bg-[#0B0D12] border border-[#10B981]/35">
              <p className="text-xs font-black text-[#34D399]">
                Aktiver Check-in · noch{' '}
                {formatRemainingTime(currentUser.checkedInUntil, nowTick)}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Status: {currentUser.checkInMood || CHECKIN_MOODS[0]}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                onCheckOut(currentUser.id);
                onClose();
              }}
              className="w-full min-h-[44px] rounded-xl bg-rose-500 text-white text-xs font-black cursor-pointer"
            >
              CHECK-OUT
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1">
                Dauer
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {[60, 90, 120, 180].map(m => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMinutes(m)}
                    className={`min-h-[40px] rounded-xl text-xs font-black border cursor-pointer ${
                      minutes === m
                        ? 'bg-[#10B981] border-[#10B981] text-slate-950'
                        : 'bg-[#0B0D12] border-white/10 text-slate-300'
                    }`}
                  >
                    {m >= 60 ? `${m / 60}h` : `${m}m`}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1">
                Status
              </label>
              <select
                value={mood}
                onChange={e => setMood(e.target.value)}
                className="w-full min-h-[40px] px-3 rounded-xl bg-[#0B0D12] border border-white/10 text-xs font-bold text-white"
              >
                {CHECKIN_MOODS.map(item => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onGoToHallTab();
                }}
                className="flex-1 min-h-[44px] rounded-xl bg-white/5 text-xs font-bold text-slate-300 cursor-pointer"
              >
                Zum LIVE-Tab
              </button>
              <button
                type="button"
                onClick={() => {
                  onCheckIn(currentUser.id, minutes, mood);
                  onClose();
                }}
                className="flex-1 min-h-[44px] rounded-xl bg-[#10B981] text-slate-950 text-xs font-black cursor-pointer"
              >
                Einchecken
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ProfileSwitcherModal({
  membersMap,
  activeSeason,
  currentUser,
  onRequestSelectUser,
  onClearUser,
  onOpenOwnDetails,
  onOpenAddMember,
  onClose,
}) {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return Object.values(membersMap).filter(m => {
      if (!q) return true;
      return (
        m.nickname.toLowerCase().includes(q) ||
        `${m.firstName} ${m.lastName}`.toLowerCase().includes(q)
      );
    });
  }, [membersMap, search]);

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-md rounded-3xl bg-[#161A23] border border-white/15 p-5 shadow-2xl space-y-4 my-auto">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black text-white">Spielerprofil wählen</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/5 text-slate-400 hover:text-white cursor-pointer"
          >
            <KlXIcon className="w-4 h-4" />
          </button>
        </div>

        <button
          type="button"
          onClick={() => {
            onClose();
            onOpenAddMember();
          }}
          className="w-full min-h-[44px] rounded-xl bg-[#10B981] text-slate-950 text-xs font-black inline-flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <KlUserPlusIcon className="w-4 h-4" />
          <span>NEW PLAYER</span>
        </button>

        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Nickname suchen..."
          className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0D12] border border-white/10 text-xs text-white"
        />

        <div className="max-h-60 overflow-y-auto space-y-1.5">
          {filtered.map(m => {
            const g = activeSeason?.groups.find(gr => gr.playerIds.includes(m.id));
            const selected = currentUser?.id === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => {
                  onClose();
                  if (!selected) {
                    onRequestSelectUser(m.id);
                  }
                }}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left cursor-pointer ${
                  selected
                    ? 'bg-[#10B981]/15 border-[#10B981]/40'
                    : 'bg-[#0B0D12] border-white/10 hover:border-white/25'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-lg bg-gradient-to-br ${m.avatarBg} flex items-center justify-center text-white font-black text-xs shrink-0`}
                  >
                    {m.nickname.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-black text-white truncate">
                      {m.nickname}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate">
                      {g ? g.name : m.status}
                    </p>
                  </div>
                </div>
                {selected ? (
                  <span className="text-[10px] font-black text-[#34D399]">Aktiv</span>
                ) : (
                  <span className="text-[10px] font-bold text-slate-400">PIN →</span>
                )}
              </button>
            );
          })}
        </div>

        {currentUser && (
          <div className="flex gap-2 pt-2 border-t border-white/10">
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenOwnDetails(currentUser.id);
              }}
              className="flex-1 min-h-[40px] rounded-xl bg-white/10 text-xs font-bold text-white cursor-pointer"
            >
              Meine Stammdaten
            </button>
            <button
              type="button"
              onClick={() => {
                onClearUser();
                onClose();
              }}
              className="px-3 min-h-[40px] rounded-xl bg-rose-500/15 text-xs font-bold text-rose-300 cursor-pointer"
            >
              Abmelden
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// HAUPTKOMPONENTE APP
// ============================================================================
export default function App() {
  const [membersMap, setMembersMap] = useState(INITIAL_MEMBERS);
  const [seasons, setSeasons] = useState(INITIAL_SEASONS);
  const [selectedSeasonId, setSelectedSeasonId] = useState('2026-11');
  const [currentUserId, setCurrentUserId] = useState('m1');
  const [activeTab, setActiveTab] = useState('home');
  const [nowTick, setNowTick] = useState(() => Date.now());
  const [allowDirectEntry, setAllowDirectEntry] = useState(true);
  const [monthEndMode, setMonthEndMode] = useState('auto');

  const [pendingLoginMemberId, setPendingLoginMemberId] = useState(null);
  const [resultModalMatch, setResultModalMatch] = useState(null);
  const [profileModalState, setProfileModalState] = useState(null);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showQuickCheckInModal, setShowQuickCheckInModal] = useState(false);
  const [showProfileSwitchModal, setShowProfileSwitchModal] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setNowTick(Date.now()), 30000);
    return () => clearInterval(timer);
  }, []);

  const currentUser = currentUserId ? membersMap[currentUserId] || null : null;

  const activeSeason = useMemo(
    () => seasons.find(s => s.id === selectedSeasonId) || seasons[0] || null,
    [seasons, selectedSeasonId]
  );

  const liveCount = useMemo(
    () =>
      Object.values(membersMap).filter(m => isMemberCheckedIn(m, nowTick)).length,
    [membersMap, nowTick]
  );

  const isCurrentUserLive = isMemberCheckedIn(currentUser, nowTick);

  const isMonthEndCheckVisible = useMemo(() => {
    if (monthEndMode === 'show') return true;
    if (monthEndMode === 'hide') return false;
    return new Date(nowTick).getDate() >= 26;
  }, [monthEndMode, nowTick]);

  const handleCheckIn = (memberId, durationMinutes, moodText) => {
    setMembersMap(prev => {
      const m = prev[memberId];
      if (!m) return prev;
      return {
        ...prev,
        [memberId]: {
          ...m,
          checkedInUntil: Date.now() + durationMinutes * 60 * 1000,
          checkInMood: moodText,
        },
      };
    });
  };

  const handleCheckOut = memberId => {
    setMembersMap(prev => {
      const m = prev[memberId];
      if (!m) return prev;
      return {
        ...prev,
        [memberId]: {
          ...m,
          checkedInUntil: null,
          checkInMood: '',
        },
      };
    });
  };

  const handleToggleNextMonth = () => {
    if (!currentUser) return;
    setMembersMap(prev => ({
      ...prev,
      [currentUser.id]: {
        ...prev[currentUser.id],
        nextMonthOptIn: !prev[currentUser.id].nextMonthOptIn,
      },
    }));
  };

  const handleSaveMatchResult = (matchId, setsP1, setsP2) => {
    const todayStr = new Date().toISOString().slice(0, 10);
    setSeasons(prev =>
      prev.map(season => ({
        ...season,
        groups: season.groups.map(group => ({
          ...group,
          matches: group.matches.map(m =>
            m.id === matchId
              ? {
                  ...m,
                  setsP1,
                  setsP2,
                  playedAt: setsP1 === null ? null : todayStr,
                }
              : m
          ),
        })),
      }))
    );
  };

  const handleUpdateProfile = (memberId, updates) => {
    setMembersMap(prev => {
      const m = prev[memberId];
      if (!m) return prev;
      return {
        ...prev,
        [memberId]: { ...m, ...updates },
      };
    });
  };

  const handleAddMember = data => {
    const id = `m_${Date.now()}`;
    const gradients = [
      'from-emerald-500 to-teal-700',
      'from-sky-500 to-indigo-700',
      'from-amber-500 to-orange-700',
      'from-purple-500 to-fuchsia-700',
    ];
    const avatarBg = gradients[Object.keys(membersMap).length % gradients.length];
    const newMember = {
      id,
      nickname: data.nickname,
      firstName: data.firstName,
      lastName: data.lastName,
      pin: data.pin,
      whatsapp: data.whatsapp,
      language: data.language,
      style: data.style,
      bio: '',
      status: 'Offen',
      nextMonthOptIn: data.nextMonthOptIn,
      usualDays: [],
      usualSlots: [],
      annualPoints: 0,
      seasonTitles: 0,
      avatarBg,
      checkedInUntil: null,
      checkInMood: '',
    };
    setMembersMap(prev => ({ ...prev, [id]: newMember }));
    setCurrentUserId(id);
  };

  const handleApproveMember = memberId => {
    setMembersMap(prev => {
      const m = prev[memberId];
      if (!m) return prev;
      return {
        ...prev,
        [memberId]: {
          ...m,
          status: 'Dabei',
          nextMonthOptIn: true,
        },
      };
    });
  };

  const handleDirectEntryMember = memberId => {
    handleApproveMember(memberId);
    setSeasons(prev =>
      prev.map(season => {
        if (season.id !== activeSeason?.id || season.groups.length === 0) return season;
        const lastIdx = season.groups.length - 1;
        return {
          ...season,
          groups: season.groups.map((g, idx) => {
            if (idx !== lastIdx || g.playerIds.includes(memberId)) return g;
            const newMatches = g.playerIds.map(existingId => ({
              id: `${season.id}_L${g.level}_${existingId}_${memberId}`,
              seasonId: season.id,
              leagueLevel: g.level,
              player1Id: existingId,
              player2Id: memberId,
              setsP1: null,
              setsP2: null,
              playedAt: null,
            }));
            return {
              ...g,
              playerIds: [...g.playerIds, memberId],
              matches: [...g.matches, ...newMatches],
            };
          }),
        };
      })
    );
  };

  const handleUpdateMemberStatus = (memberId, status) => {
    setMembersMap(prev => {
      const m = prev[memberId];
      if (!m) return prev;
      return {
        ...prev,
        [memberId]: {
          ...m,
          status,
          nextMonthOptIn: status === 'Dabei' ? true : false,
        },
      };
    });
  };

  const handleToggleMemberNextMonth = memberId => {
    setMembersMap(prev => {
      const m = prev[memberId];
      if (!m) return prev;
      return {
        ...prev,
        [memberId]: {
          ...m,
          nextMonthOptIn: !m.nextMonthOptIn,
        },
      };
    });
  };

  const handleDeleteMember = memberId => {
    setMembersMap(prev => {
      const next = { ...prev };
      delete next[memberId];
      return next;
    });
    setSeasons(prev =>
      prev.map(season => ({
        ...season,
        groups: season.groups.map(g => ({
          ...g,
          playerIds: g.playerIds.filter(id => id !== memberId),
          matches: g.matches.filter(
            m => m.player1Id !== memberId && m.player2Id !== memberId
          ),
        })),
      }))
    );
    if (currentUserId === memberId) {
      setCurrentUserId('');
    }
    if (profileModalState?.memberId === memberId) {
      setProfileModalState(null);
    }
  };

  const handleMovePlayerLeague = (seasonId, playerId, targetLevel) => {
    setSeasons(prev =>
      prev.map(season => {
        if (season.id !== seasonId) return season;
        return {
          ...season,
          groups: season.groups.map(g => {
            const without = g.playerIds.filter(id => id !== playerId);
            const nextIds =
              g.level === targetLevel ? [...without, playerId] : without;
            return {
              ...g,
              playerIds: nextIds,
              matches: createRoundRobinMatches(season.id, g.level, nextIds),
            };
          }),
        };
      })
    );
  };

  const handleRemovePlayerFromLeague = (seasonId, level, playerId) => {
    setSeasons(prev =>
      prev.map(season => {
        if (season.id !== seasonId) return season;
        return {
          ...season,
          groups: season.groups.map(g => {
            if (g.level !== level) return g;
            const nextIds = g.playerIds.filter(id => id !== playerId);
            return {
              ...g,
              playerIds: nextIds,
              matches: g.matches.filter(
                m => m.player1Id !== playerId && m.player2Id !== playerId
              ),
            };
          }),
        };
      })
    );
  };

  const handleCreateNextMonth = () => {
    const monthNames = [
      'Januar',
      'Februar',
      'März',
      'April',
      'Mai',
      'Juni',
      'Juli',
      'August',
      'September',
      'Oktober',
      'November',
      'Dezember',
    ];
    const shortNames = [
      'Jan',
      'Feb',
      'Mär',
      'Apr',
      'Mai',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Okt',
      'Nov',
      'Dez',
    ];
    const latest = seasons[seasons.length - 1];
    const [yrStr, moStr] = (latest?.id || '2026-11').split('-');
    let yr = Number(yrStr);
    let mo = Number(moStr) + 1;
    if (mo > 12) {
      mo = 1;
      yr += 1;
    }
    const nextId = `${yr}-${String(mo).padStart(2, '0')}`;
    if (seasons.some(s => s.id === nextId)) return null;

    const label = `${monthNames[mo - 1]} ${yr}`;
    const shortLabel = `${shortNames[mo - 1]} '${String(yr).slice(-2)}`;

    const eligible = Object.values(membersMap)
      .filter(m => m.status === 'Dabei' && m.nextMonthOptIn)
      .sort((a, b) => b.annualPoints - a.annualPoints)
      .map(m => m.id);

    const groups = [];
    const chunkSize = 5;
    for (let i = 0; i < eligible.length; i += chunkSize) {
      const level = groups.length + 1;
      const chunk = eligible.slice(i, i + chunkSize);
      groups.push({
        level,
        name: `${level}. Liga`,
        playerIds: chunk,
        matches: createRoundRobinMatches(nextId, level, chunk),
      });
    }

    const newSeason = { id: nextId, label, shortLabel, groups };
    setSeasons(prev => [...prev, newSeason]);
    setSelectedSeasonId(nextId);
    return label;
  };

  const handleDeleteSeason = seasonId => {
    setSeasons(prev => {
      if (prev.length <= 1) return prev;
      const next = prev.filter(s => s.id !== seasonId);
      if (selectedSeasonId === seasonId && next[0]) {
        setSelectedSeasonId(next[0].id);
      }
      return next;
    });
  };

  const handleResetDemoData = () => {
    setMembersMap(INITIAL_MEMBERS);
    setSeasons(INITIAL_SEASONS);
    setSelectedSeasonId('2026-11');
    setCurrentUserId('m1');
    setMonthEndMode('auto');
  };

  const navItems = [
    { id: 'home', label: 'Home', Icon: KlHomeIcon },
    { id: 'leagues', label: 'Liga', Icon: KlTrophyIcon },
    { id: 'hall', label: 'LIVE', Icon: KlMapPinIcon, badge: liveCount },
    { id: 'nextmonth', label: 'Folgemonat', Icon: KlCalendarIcon },
    { id: 'recent', label: 'Spiele', Icon: KlHistoryIcon },
    { id: 'annual', label: 'Rangliste', Icon: KlAwardIcon },
    { id: 'players', label: 'Spieler', Icon: KlUsersIcon },
  ];

  return (
    <div className="min-h-screen bg-[#0B0D12] text-slate-100 flex flex-col">
      {/* STICKY HEADER */}
      <header className="sticky top-0 z-30 bg-[#0B0D12]/90 backdrop-blur-md border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2.5 text-left cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#10B981] to-emerald-700 flex items-center justify-center text-slate-950 font-black text-sm shadow-lg shadow-[#10B981]/20">
              KL
            </div>
            <div>
              <div className="text-sm sm:text-base font-black tracking-tight text-white leading-none">
                KONGLeague
              </div>
              <div className="text-[10px] font-bold text-[#34D399] tracking-wider uppercase mt-0.5">
                by PINGKONG
              </div>
            </div>
          </button>

          <div className="flex items-center gap-2">
            {/* LIVE / CHECK-OUT BUTTON IM HEADER */}
            {isCurrentUserLive && currentUser ? (
              <button
                type="button"
                onClick={() => handleCheckOut(currentUser.id)}
                className="min-h-[38px] px-3 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-white text-xs font-black tracking-wide inline-flex items-center gap-1.5 shadow-lg shadow-rose-500/20 transition cursor-pointer"
              >
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                <span>CHECK-OUT</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setShowQuickCheckInModal(true)}
                className="min-h-[38px] px-3 py-1.5 rounded-xl bg-[#161A23] hover:bg-[#1E2430] border border-[#10B981]/40 text-[#34D399] text-xs font-black inline-flex items-center gap-1.5 transition cursor-pointer"
              >
                <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                <span>LIVE ({liveCount})</span>
              </button>
            )}

            {/* SPIELERPROFIL AUSWÄHLEN / WECHSELN IM HEADER */}
            <button
              type="button"
              onClick={() => setShowProfileSwitchModal(true)}
              className="min-h-[38px] px-2.5 py-1.5 rounded-xl bg-[#161A23] hover:bg-[#1E2430] border border-white/10 text-xs font-black text-white inline-flex items-center gap-2 transition cursor-pointer"
            >
              {currentUser ? (
                <>
                  <span
                    className={`w-6 h-6 rounded-lg bg-gradient-to-br ${currentUser.avatarBg} flex items-center justify-center text-[10px] font-black text-white shrink-0`}
                  >
                    {currentUser.nickname.slice(0, 2).toUpperCase()}
                  </span>
                  <span className="max-w-[90px] sm:max-w-[130px] truncate">
                    {currentUser.nickname}
                  </span>
                </>
              ) : (
                <span className="text-[#34D399]">Profil wählen</span>
              )}
              <KlChevronDownIcon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            </button>
          </div>
        </div>

        {/* NAVIGATION */}
        <nav className="max-w-4xl mx-auto px-3 pb-2.5 flex items-center gap-1.5 overflow-x-auto">
          {navItems.map(item => {
            const NavIcon = item.Icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`min-h-[36px] px-3 py-1.5 rounded-xl text-xs font-black inline-flex items-center gap-1.5 shrink-0 transition cursor-pointer ${
                  active
                    ? 'bg-[#10B981] text-slate-950 shadow-md shadow-[#10B981]/20'
                    : 'bg-[#161A23] text-slate-300 hover:text-white border border-white/5'
                }`}
              >
                <NavIcon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
                {typeof item.badge === 'number' && item.badge > 0 && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                      active
                        ? 'bg-slate-950 text-[#34D399]'
                        : 'bg-[#10B981]/20 text-[#34D399]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </header>

      {/* HAUPTINHALT */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-5">
        {activeTab === 'home' && (
          <HomeTab
            membersMap={membersMap}
            activeSeason={activeSeason}
            currentUser={currentUser}
            nowTick={nowTick}
            liveCount={liveCount}
            showMonthEndCheck={isMonthEndCheckVisible}
            onRequestSelectUser={id => setPendingLoginMemberId(id)}
            onCheckIn={handleCheckIn}
            onCheckOut={handleCheckOut}
            onToggleNextMonth={handleToggleNextMonth}
            onOpenResultModal={match => setResultModalMatch(match)}
            onOpenProfile={(id, startEditing = false) =>
              setProfileModalState({ memberId: id, startEditing })
            }
            onOpenAddMember={() => setShowAddMemberModal(true)}
            onNavigateTab={tab => setActiveTab(tab)}
          />
        )}

        {activeTab === 'leagues' && (
          <LeaguesTab
            membersMap={membersMap}
            seasons={seasons}
            activeSeason={activeSeason}
            onSelectSeason={id => setSelectedSeasonId(id)}
            currentUser={currentUser}
            onOpenResultModal={match => setResultModalMatch(match)}
            onOpenProfile={id =>
              setProfileModalState({ memberId: id, startEditing: false })
            }
          />
        )}

        {activeTab === 'nextmonth' && (
          <NextMonthTab
            membersMap={membersMap}
            activeSeason={activeSeason}
            currentUser={currentUser}
            onToggleNextMonth={handleToggleNextMonth}
            onOpenProfile={id =>
              setProfileModalState({ memberId: id, startEditing: false })
            }
          />
        )}

        {activeTab === 'recent' && (
          <RecentMatchesTab
            membersMap={membersMap}
            seasons={seasons}
            activeSeason={activeSeason}
            onSelectSeason={id => setSelectedSeasonId(id)}
            onOpenProfile={id =>
              setProfileModalState({ memberId: id, startEditing: false })
            }
          />
        )}

        {activeTab === 'annual' && (
          <AnnualRankingTab
            membersMap={membersMap}
            activeSeason={activeSeason}
            currentUser={currentUser}
            onOpenProfile={id =>
              setProfileModalState({ memberId: id, startEditing: false })
            }
          />
        )}

        {activeTab === 'players' && (
          <PlayersTab
            membersMap={membersMap}
            activeSeason={activeSeason}
            nowTick={nowTick}
            onOpenProfile={id =>
              setProfileModalState({ memberId: id, startEditing: false })
            }
            onOpenAddMember={() => setShowAddMemberModal(true)}
          />
        )}

        {activeTab === 'hall' && (
          <HallLiveTab
            membersMap={membersMap}
            currentUser={currentUser}
            nowTick={nowTick}
            onRequestSelectUser={id => setPendingLoginMemberId(id)}
            onCheckIn={handleCheckIn}
            onCheckOut={handleCheckOut}
            onOpenProfile={id =>
              setProfileModalState({ memberId: id, startEditing: false })
            }
          />
        )}

        {activeTab === 'admin' && (
          <AdminTab
            membersMap={membersMap}
            seasons={seasons}
            activeSeason={activeSeason}
            allowDirectEntry={allowDirectEntry}
            onToggleDirectEntry={() => setAllowDirectEntry(prev => !prev)}
            monthEndMode={monthEndMode}
            onChangeMonthEndMode={setMonthEndMode}
            onApproveMember={handleApproveMember}
            onDirectEntryMember={handleDirectEntryMember}
            onUpdateMemberStatus={handleUpdateMemberStatus}
            onToggleMemberNextMonth={handleToggleMemberNextMonth}
            onDeleteMember={handleDeleteMember}
            onMovePlayerLeague={handleMovePlayerLeague}
            onRemovePlayerFromLeague={handleRemovePlayerFromLeague}
            onAdminUpdateMatch={handleSaveMatchResult}
            onCreateNextMonth={handleCreateNextMonth}
            onDeleteSeason={handleDeleteSeason}
            onResetDemoData={handleResetDemoData}
          />
        )}
      </main>

      {/* FOOTER MIT ADMIN ZUGANG */}
      <footer className="border-t border-white/10 bg-[#0B0D12] py-4 px-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between text-xs text-slate-500">
          <span>KONGLeague · Tischtennis Monatsliga</span>
          <button
            type="button"
            onClick={() => setActiveTab('admin')}
            className={`inline-flex items-center gap-1.5 font-bold cursor-pointer ${
              activeTab === 'admin'
                ? 'text-[#34D399]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <KlLockIcon className="w-3.5 h-3.5" />
            <span>Admin</span>
          </button>
        </div>
      </footer>

      {/* MODALS */}
      {pendingLoginMemberId && membersMap[pendingLoginMemberId] && (
        <PlayerPinLoginModal
          member={membersMap[pendingLoginMemberId]}
          onSuccess={id => setCurrentUserId(id)}
          onClose={() => setPendingLoginMemberId(null)}
        />
      )}

      {resultModalMatch && (
        <MatchResultModal
          match={resultModalMatch}
          membersMap={membersMap}
          onClose={() => setResultModalMatch(null)}
          onSaveResult={handleSaveMatchResult}
        />
      )}

      {profileModalState && membersMap[profileModalState.memberId] && (
        <PlayerProfileModal
          member={membersMap[profileModalState.memberId]}
          activeSeason={activeSeason}
          isOwnProfile={currentUser?.id === profileModalState.memberId}
          initialEditing={profileModalState.startEditing}
          onClose={() => setProfileModalState(null)}
          onUpdateProfile={handleUpdateProfile}
        />
      )}

      {showAddMemberModal && (
        <AddMemberModal
          onClose={() => setShowAddMemberModal(false)}
          onAddMember={handleAddMember}
        />
      )}

      {showQuickCheckInModal && (
        <QuickCheckInModal
          membersMap={membersMap}
          currentUser={currentUser}
          nowTick={nowTick}
          onRequestSelectUser={id => setPendingLoginMemberId(id)}
          onCheckIn={handleCheckIn}
          onCheckOut={handleCheckOut}
          onGoToHallTab={() => setActiveTab('hall')}
          onClose={() => setShowQuickCheckInModal(false)}
        />
      )}

      {showProfileSwitchModal && (
        <ProfileSwitcherModal
          membersMap={membersMap}
          activeSeason={activeSeason}
          currentUser={currentUser}
          onRequestSelectUser={id => setPendingLoginMemberId(id)}
          onClearUser={() => setCurrentUserId('')}
          onOpenOwnDetails={id =>
            setProfileModalState({ memberId: id, startEditing: false })
          }
          onOpenAddMember={() => setShowAddMemberModal(true)}
          onClose={() => setShowProfileSwitchModal(false)}
        />
      )}
    </div>
  );
}
