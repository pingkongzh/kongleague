import React, { useState, useMemo, useEffect } from 'react';

// ============================================================================
// KONSTANTEN & STAMMDATEN
// ============================================================================
const WEEKDAYS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
const TIME_SLOTS = ['Mittag', 'Nachmittag', 'Abend'];
const PLAY_STYLES = [
  'Allround',
  'Offensiv / Topspin',
  'Defensiv / Abwehr',
  'Block & Konter',
  'Noppen / Material',
];
const CHECKIN_MOODS = [
  'Ligaspiel gesucht 🏓',
  'Freies Training / Sparring 🔥',
  'Offen für alles 🤝',
  'Nur kurzes Einspielen ⚡',
];
const MEETUP_MODES = [
  'Freies Spiel / Sparring',
  'Ligaspiel',
  'Doppel (2 vs 2)',
  'Technik / Einspielen',
];

const INITIAL_MEMBERS = {
  m1: {
    id: 'm1',
    playMode: 'league',
    nickname: 'TopspinTobi',
    firstName: 'Tobias',
    lastName: 'Meier',
    pin: '1111',
    whatsapp: '+41 79 312 44 10',
    language: 'Deutsch',
    style: 'Offensiv / Topspin',
    bio: 'Vorhand-Topspin aus der Halbdistanz. Immer bereit für ein spontanes Match!',
    status: 'Dabei',
    nextMonthOptIn: true,
    usualDays: ['Di', 'Do'],
    usualSlots: ['Abend'],
    annualPoints: 148,
    seasonTitles: 2,
    avatarBg: 'from-emerald-500 to-teal-700',
    checkedInUntil: Date.now() + 95 * 60 * 1000,
    checkInMood: 'Ligaspiel gesucht 🏓',
  },
  m2: {
    id: 'm2',
    playMode: 'league',
    nickname: 'SpinDoctor',
    firstName: 'Lukas',
    lastName: 'Weber',
    pin: '2222',
    whatsapp: '+41 78 654 19 82',
    language: 'Deutsch / English',
    style: 'Allround',
    bio: 'Konstantes Block- und Platzierungsspiel. Spiele gerne abends ab 18:30.',
    status: 'Dabei',
    nextMonthOptIn: true,
    usualDays: ['Mo', 'Mi', 'Fr'],
    usualSlots: ['Abend'],
    annualPoints: 141,
    seasonTitles: 1,
    avatarBg: 'from-sky-500 to-indigo-700',
    checkedInUntil: Date.now() + 60 * 60 * 1000,
    checkInMood: 'Freies Training / Sparring 🔥',
  },
  m3: {
    id: 'm3',
    playMode: 'league',
    nickname: 'ChopperNina',
    firstName: 'Nina',
    lastName: 'Keller',
    pin: '3333',
    whatsapp: '+41 76 411 90 23',
    language: 'Deutsch',
    style: 'Defensiv / Abwehr',
    bio: 'Lange Abwehr mit Unterschnitt und plötzlichen Kontern.',
    status: 'Dabei',
    nextMonthOptIn: true,
    usualDays: ['Di', 'Fr'],
    usualSlots: ['Nachmittag', 'Abend'],
    annualPoints: 136,
    seasonTitles: 1,
    avatarBg: 'from-purple-500 to-fuchsia-700',
    checkedInUntil: null,
    checkInMood: '',
  },
  m4: {
    id: 'm4',
    playMode: 'league',
    nickname: 'PingKing',
    firstName: 'Marco',
    lastName: 'Brunner',
    pin: '4444',
    whatsapp: '+41 79 880 12 55',
    language: 'Deutsch / English',
    style: 'Block & Konter',
    bio: 'Schnelles Tischnah-Spiel. Suche meistens Dienstag oder Donnerstag Gegner.',
    status: 'Dabei',
    nextMonthOptIn: false,
    usualDays: ['Do', 'Sa'],
    usualSlots: ['Mittag', 'Abend'],
    annualPoints: 122,
    seasonTitles: 0,
    avatarBg: 'from-amber-500 to-orange-700',
    checkedInUntil: null,
    checkInMood: '',
  },
  m5: {
    id: 'm5',
    playMode: 'league',
    nickname: 'BackhandBen',
    firstName: 'Benjamin',
    lastName: 'Frei',
    pin: '5555',
    whatsapp: '+41 77 209 34 71',
    language: 'Deutsch',
    style: 'Offensiv / Topspin',
    bio: 'Rückhand-Flip & schnelle Eröffnungen.',
    status: 'Dabei',
    nextMonthOptIn: true,
    usualDays: ['Mo', 'Do'],
    usualSlots: ['Abend'],
    annualPoints: 115,
    seasonTitles: 0,
    avatarBg: 'from-rose-500 to-pink-700',
    checkedInUntil: null,
    checkInMood: '',
  },
  m6: {
    id: 'm6',
    playMode: 'league',
    nickname: 'SliceSarah',
    firstName: 'Sarah',
    lastName: 'Steiner',
    pin: '6666',
    whatsapp: '+41 79 512 67 04',
    language: 'Deutsch / English',
    style: 'Allround',
    bio: 'Ziel für diesen Monat: Aufstieg in die 1. Liga!',
    status: 'Dabei',
    nextMonthOptIn: true,
    usualDays: ['Mi', 'Fr'],
    usualSlots: ['Abend'],
    annualPoints: 109,
    seasonTitles: 0,
    avatarBg: 'from-cyan-500 to-blue-700',
    checkedInUntil: null,
    checkInMood: '',
  },
  m7: {
    id: 'm7',
    playMode: 'league',
    nickname: 'RocketRemo',
    firstName: 'Remo',
    lastName: 'Hofmann',
    pin: '7777',
    whatsapp: '+41 78 903 11 48',
    language: 'Deutsch',
    style: 'Offensiv / Topspin',
    bio: 'Vollgas ab dem ersten Aufschlag.',
    status: 'Dabei',
    nextMonthOptIn: true,
    usualDays: ['Di', 'Mi'],
    usualSlots: ['Abend'],
    annualPoints: 98,
    seasonTitles: 0,
    avatarBg: 'from-lime-500 to-emerald-700',
    checkedInUntil: null,
    checkInMood: '',
  },
  m8: {
    id: 'm8',
    playMode: 'league',
    nickname: 'WallWalter',
    firstName: 'Walter',
    lastName: 'Baumann',
    pin: '8888',
    whatsapp: '+41 79 440 78 19',
    language: 'Deutsch',
    style: 'Noppen / Material',
    bio: 'Störspiel am Tisch – Geduld zahlt sich aus.',
    status: 'Dabei',
    nextMonthOptIn: true,
    usualDays: ['Mo', 'Fr'],
    usualSlots: ['Nachmittag', 'Abend'],
    annualPoints: 91,
    seasonTitles: 0,
    avatarBg: 'from-violet-500 to-purple-700',
    checkedInUntil: null,
    checkInMood: '',
  },
};

function createRoundRobinMatches(seasonId, level, playerIds) {
  const matches = [];
  for (let i = 0; i < playerIds.length; i++) {
    for (let j = i + 1; j < playerIds.length; j++) {
      matches.push({
        id: `${seasonId}_L${level}_${playerIds[i]}_${playerIds[j]}`,
        seasonId,
        leagueLevel: level,
        player1Id: playerIds[i],
        player2Id: playerIds[j],
        setsP1: null,
        setsP2: null,
        playedAt: null,
      });
    }
  }
  return matches;
}

const INITIAL_SEASONS = [
  {
    id: '2026-11',
    label: 'November 2026',
    shortLabel: "Nov '26",
    groups: [
      {
        level: 1,
        name: '1. Liga',
        playerIds: ['m1', 'm2', 'm3', 'm4', 'm5'],
        matches: [
          {
            id: '2026-11_L1_m1_m2',
            seasonId: '2026-11',
            leagueLevel: 1,
            player1Id: 'm1',
            player2Id: 'm2',
            setsP1: 3,
            setsP2: 1,
            playedAt: '2026-11-05',
          },
          {
            id: '2026-11_L1_m1_m3',
            seasonId: '2026-11',
            leagueLevel: 1,
            player1Id: 'm1',
            player2Id: 'm3',
            setsP1: 3,
            setsP2: 2,
            playedAt: '2026-11-09',
          },
          {
            id: '2026-11_L1_m1_m4',
            seasonId: '2026-11',
            leagueLevel: 1,
            player1Id: 'm1',
            player2Id: 'm4',
            setsP1: null,
            setsP2: null,
            playedAt: null,
          },
          {
            id: '2026-11_L1_m1_m5',
            seasonId: '2026-11',
            leagueLevel: 1,
            player1Id: 'm1',
            player2Id: 'm5',
            setsP1: null,
            setsP2: null,
            playedAt: null,
          },
          {
            id: '2026-11_L1_m2_m3',
            seasonId: '2026-11',
            leagueLevel: 1,
            player1Id: 'm2',
            player2Id: 'm3',
            setsP1: 3,
            setsP2: 0,
            playedAt: '2026-11-11',
          },
          {
            id: '2026-11_L1_m2_m4',
            seasonId: '2026-11',
            leagueLevel: 1,
            player1Id: 'm2',
            player2Id: 'm4',
            setsP1: 3,
            setsP2: 1,
            playedAt: '2026-11-14',
          },
          {
            id: '2026-11_L1_m2_m5',
            seasonId: '2026-11',
            leagueLevel: 1,
            player1Id: 'm2',
            player2Id: 'm5',
            setsP1: null,
            setsP2: null,
            playedAt: null,
          },
          {
            id: '2026-11_L1_m3_m4',
            seasonId: '2026-11',
            leagueLevel: 1,
            player1Id: 'm3',
            player2Id: 'm4',
            setsP1: 3,
            setsP2: 1,
            playedAt: '2026-11-16',
          },
          {
            id: '2026-11_L1_m3_m5',
            seasonId: '2026-11',
            leagueLevel: 1,
            player1Id: 'm3',
            player2Id: 'm5',
            setsP1: null,
            setsP2: null,
            playedAt: null,
          },
          {
            id: '2026-11_L1_m4_m5',
            seasonId: '2026-11',
            leagueLevel: 1,
            player1Id: 'm4',
            player2Id: 'm5',
            setsP1: 2,
            setsP2: 3,
            playedAt: '2026-11-18',
          },
        ],
      },
      {
        level: 2,
        name: '2. Liga',
        playerIds: ['m6', 'm7', 'm8'],
        matches: [
          {
            id: '2026-11_L2_m6_m7',
            seasonId: '2026-11',
            leagueLevel: 2,
            player1Id: 'm6',
            player2Id: 'm7',
            setsP1: 3,
            setsP2: 1,
            playedAt: '2026-11-12',
          },
          {
            id: '2026-11_L2_m6_m8',
            seasonId: '2026-11',
            leagueLevel: 2,
            player1Id: 'm6',
            player2Id: 'm8',
            setsP1: null,
            setsP2: null,
            playedAt: null,
          },
          {
            id: '2026-11_L2_m7_m8',
            seasonId: '2026-11',
            leagueLevel: 2,
            player1Id: 'm7',
            player2Id: 'm8',
            setsP1: 3,
            setsP2: 2,
            playedAt: '2026-11-19',
          },
        ],
      },
    ],
  },
];

const INITIAL_MEETUP_POSTS = [
  {
    id: 'post_1',
    authorId: 'm3',
    whenText: 'Morgen Di · ab 18:30',
    mode: 'Freies Spiel / Sparring',
    note: 'Suche jemanden für 1h Topspin-Block-Training und ein paar lockere Sätze.',
    joinedIds: ['m6'],
    createdAt: Date.now() - 3600 * 1000,
  },
  {
    id: 'post_2',
    authorId: 'm7',
    whenText: 'Donnerstag · 19:00',
    mode: 'Doppel (2 vs 2)',
    note: 'Wir sind schon zu zweit – noch 2 Leute für ein schnelles Doppel gesucht!',
    joinedIds: ['m2'],
    createdAt: Date.now() - 7200 * 1000,
  },
];

const INITIAL_HALL_ANNOUNCEMENTS = [
  {
    id: 'ann_1',
    memberId: 'm4',
    dayLabel: 'Morgen',
    timeText: '17:30',
    note: 'Bis ca. 20:00 in der Halle – offen für Liga oder Sparring!',
    meTooIds: ['m1'],
    createdAt: Date.now() - 1800 * 1000,
  },
  {
    id: 'ann_2',
    memberId: 'm6',
    dayLabel: 'Mi',
    timeText: '18:15',
    note: 'Suche noch 1–2 Sätze zum Einspielen.',
    meTooIds: [],
    createdAt: Date.now() - 5400 * 1000,
  },
];

// ============================================================================
// HILFSFUNKTIONEN
// ============================================================================
function isMemberCheckedIn(member, nowTick = Date.now()) {
  if (!member || !member.checkedInUntil) return false;
  return member.checkedInUntil > nowTick;
}

function formatRemainingTime(untilMs, nowTick = Date.now()) {
  const diff = Math.max(0, untilMs - nowTick);
  const mins = Math.ceil(diff / 60000);
  if (mins >= 60) {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  }
  return `${mins} Min.`;
}

function buildWhatsAppUrl(phone, text) {
  if (!phone) return '';
  const digits = String(phone).replace(/[^\d]/g, '');
  if (!digits) return '';
  return `https://wa.me/${digits}?text=${encodeURIComponent(text || '')}`;
}

function isConnectOnlyMember(member, activeSeason = null) {
  if (!member) return false;
  if (member.playMode === 'connect') return true;
  if (member.playMode === 'league') return false;
  const inAnyGroup = (activeSeason?.groups || []).some(g =>
    g.playerIds.includes(member.id)
  );
  return !inAnyGroup && member.status === 'Pausiert' && !member.nextMonthOptIn;
}

function getNextMonthInfo(seasonId) {
  const monthNames = [
    'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
    'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember',
  ];
  const [yrStr, moStr] = String(seasonId || '2026-11').split('-');
  let yr = Number(yrStr) || 2026;
  let mo = (Number(moStr) || 11) + 1;
  if (mo > 12) {
    mo = 1;
    yr += 1;
  }
  const monthName = monthNames[mo - 1];
  return {
    id: `${yr}-${String(mo).padStart(2, '0')}`,
    monthName,
    label: `${monthName} ${yr}`,
  };
}

function computeGroupStandings(group, membersMap) {
  const stats = {};
  (group?.playerIds || []).forEach(pid => {
    stats[pid] = {
      playerId: pid,
      member: membersMap[pid],
      played: 0,
      won: 0,
      lost: 0,
      setsWon: 0,
      setsLost: 0,
      points: 0,
    };
  });

  (group?.matches || []).forEach(m => {
    if (m.setsP1 === null || m.setsP2 === null) return;
    const p1 = stats[m.player1Id];
    const p2 = stats[m.player2Id];
    if (!p1 || !p2) return;

    p1.played += 1;
    p2.played += 1;
    p1.setsWon += m.setsP1;
    p1.setsLost += m.setsP2;
    p2.setsWon += m.setsP2;
    p2.setsLost += m.setsP1;

    if (m.setsP1 > m.setsP2) {
      p1.won += 1;
      p1.points += 3;
      p2.lost += 1;
      p2.points += m.setsP2 >= 2 ? 1 : 0;
    } else if (m.setsP2 > m.setsP1) {
      p2.won += 1;
      p2.points += 3;
      p1.lost += 1;
      p1.points += m.setsP1 >= 2 ? 1 : 0;
    }
  });

  return Object.values(stats)
    .filter(s => Boolean(s.member))
    .sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      const diffA = a.setsWon - a.setsLost;
      const diffB = b.setsWon - b.setsLost;
      if (diffB !== diffA) return diffB - diffA;
      if (b.setsWon !== a.setsWon) return b.setsWon - a.setsWon;
      return (b.member?.annualPoints || 0) - (a.member?.annualPoints || 0);
    });
}

// ============================================================================
// MINIMALISTISCHE INLINE-SVG-ICONS
// ============================================================================
function KlHomeIcon({ className = 'w-4 h-4' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" className={className}>
      <path d="M3 10.5L12 3l9 7.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 9.5V20h14V9.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function KlTrophyIcon({ className = 'w-4 h-4' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" className={className}>
      <path d="M8 4h8v6a4 4 0 01-8 0V4z" strokeLinejoin="round" />
      <path d="M8 6H5a2 2 0 00-2 2v1a3 3 0 003 3h2M16 6h3a2 2 0 012 2v1a3 3 0 01-3 3h-2" strokeLinecap="round" />
      <path d="M12 14v5M8 20h8" strokeLinecap="round" />
    </svg>
  );
}

function KlHandshakeIcon({ className = 'w-4 h-4' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" className={className}>
      <path d="M11 17l-4-4 5-5 4 4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 11l4-4 3 3M21 11l-4-4-3 3M8 14l4 4 5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function KlCalendarIcon({ className = 'w-4 h-4' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" className={className}>
      <rect x="3" y="5" width="18" height="16" rx="3" />
      <path d="M8 3v4M16 3v4M3 10h18" strokeLinecap="round" />
    </svg>
  );
}

function KlHistoryIcon({ className = 'w-4 h-4' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function KlAwardIcon({ className = 'w-4 h-4' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" className={className}>
      <circle cx="12" cy="8" r="5" />
      <path d="M8.5 12.5L7 21l5-3 5 3-1.5-8.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function KlUsersIcon({ className = 'w-4 h-4' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" className={className}>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M3 19c0-3 2.7-5 6-5s6 2 6 5" strokeLinecap="round" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M16.5 14.2c2.4.4 4.5 2 4.5 4.8" strokeLinecap="round" />
    </svg>
  );
}

function KlMapPinIcon({ className = 'w-4 h-4' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" className={className}>
      <path d="M12 21s7-5.7 7-11a7 7 0 10-14 0c0 5.3 7 11 7 11z" strokeLinejoin="round" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function KlLockIcon({ className = 'w-4 h-4' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" className={className}>
      <rect x="4" y="11" width="16" height="10" rx="2.5" />
      <path d="M8 11V7a4 4 0 018 0v4" strokeLinecap="round" />
    </svg>
  );
}

function KlChevronDownIcon({ className = 'w-4 h-4' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" className={className}>
      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function KlMessageIcon({ className = 'w-4 h-4' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" className={className}>
      <path d="M21 11.5a8.5 8.5 0 01-12.4 7.5L3 20.5l1.5-5.3A8.5 8.5 0 1121 11.5z" strokeLinejoin="round" />
    </svg>
  );
}

function KlTrashIcon({ className = 'w-4 h-4' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" className={className}>
      <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ============================================================================
// HOME TAB (LEAGUE ÜBERSICHT)
// ============================================================================
function HomeTab({
  membersMap,
  activeSeason,
  nextMonthInfo,
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
  const userGroup = useMemo(() => {
    if (!currentUser || !activeSeason) return null;
    return (
      activeSeason.groups.find(g => g.playerIds.includes(currentUser.id)) || null
    );
  }, [currentUser, activeSeason]);

  const userOpenMatches = useMemo(() => {
    if (!currentUser || !userGroup) return [];
    return userGroup.matches.filter(
      m =>
        (m.player1Id === currentUser.id || m.player2Id === currentUser.id) &&
        (m.setsP1 === null || m.setsP2 === null)
    );
  }, [currentUser, userGroup]);

  const isLive = isMemberCheckedIn(currentUser, nowTick);

  const monthEndEligible = useMemo(
    () =>
      Object.values(membersMap).filter(
        m => m.status === 'Dabei' && m.nextMonthOptIn
      ),
    [membersMap]
  );

  return (
    <div className="space-y-4">
      {/* SPIELER-COCKPIT */}
      {!currentUser ? (
        <section className="rounded-3xl bg-[#12151C] border border-white/[0.08] p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h1 className="text-lg font-black text-white">Willkommen im Club</h1>
              <p className="text-xs text-slate-400">
                Wähle dein Spielerprofil oder registriere dich neu.
              </p>
            </div>
            <button
              type="button"
              onClick={onOpenAddMember}
              className="min-h-[40px] px-3.5 rounded-2xl bg-[#10B981] text-slate-950 text-xs font-black shrink-0 cursor-pointer"
            >
              + NEW PLAYER
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {Object.values(membersMap).map(m => (
              <button
                key={m.id}
                type="button"
                onClick={() => onRequestSelectUser(m.id)}
                className="min-h-[38px] px-3 rounded-xl bg-[#090B0F] border border-white/10 text-xs font-bold text-white cursor-pointer"
              >
                {m.nickname}
              </button>
            ))}
          </div>
        </section>
      ) : (
        <section className="rounded-3xl bg-[#12151C] border border-white/[0.08] p-4 sm:p-5 space-y-3.5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${currentUser.avatarBg} flex items-center justify-center text-white font-black text-sm shrink-0`}
              >
                {currentUser.nickname.slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-black text-white truncate">
                    {currentUser.nickname}
                  </h1>
                  <span className="px-2 py-0.5 rounded-lg bg-[#10B981]/15 text-[#34D399] text-[10px] font-black shrink-0">
                    {userGroup ? userGroup.name : currentUser.status}
                  </span>
                </div>
                <p className="text-xs text-slate-400 truncate">
                  {currentUser.annualPoints} Jahrespunkte · {activeSeason?.label}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onOpenProfile(currentUser.id, true)}
              className="min-h-[38px] px-3 rounded-xl bg-[#090B0F] border border-white/10 text-xs font-bold text-slate-200 shrink-0 cursor-pointer"
            >
              Stammdaten
            </button>
          </div>

          {/* QUICK ACTIONS: FOLGEMONAT & LIVE */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              type="button"
              onClick={onToggleNextMonth}
              className={`min-h-[44px] px-3.5 rounded-2xl border text-left flex items-center justify-between gap-2 cursor-pointer ${
                currentUser.nextMonthOptIn
                  ? 'bg-[#10B981]/15 border-[#10B981]/40 text-[#34D399]'
                  : 'bg-[#090B0F] border-white/10 text-slate-300'
              }`}
            >
              <div>
                <p className="text-[10px] uppercase tracking-wider font-bold opacity-80">
                  {nextMonthInfo.label}
                </p>
                <p className="text-xs font-black">
                  {currentUser.nextMonthOptIn ? 'Dabei ✓' : 'Pause (Tippen für Dabei)'}
                </p>
              </div>
              <span className="text-xs font-black">
                {currentUser.nextMonthOptIn ? 'AKTIV' : 'OFF'}
              </span>
            </button>

            {isLive ? (
              <button
                type="button"
                onClick={() => onCheckOut(currentUser.id)}
                className="min-h-[44px] px-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-rose-300 flex items-center justify-between gap-2 cursor-pointer"
              >
                <div className="text-left">
                  <p className="text-[10px] uppercase tracking-wider font-bold">
                    LIVE in der Halle
                  </p>
                  <p className="text-xs font-black">
                    Noch {formatRemainingTime(currentUser.checkedInUntil, nowTick)}
                  </p>
                </div>
                <span className="text-xs font-black">CHECK-OUT</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() =>
                  onCheckIn(currentUser.id, 120, 'Ligaspiel gesucht 🏓')
                }
                className="min-h-[44px] px-3.5 rounded-2xl bg-[#090B0F] border border-white/10 text-slate-200 flex items-center justify-between gap-2 cursor-pointer"
              >
                <div className="text-left">
                  <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                    Hallen-Status ({liveCount} LIVE)
                  </p>
                  <p className="text-xs font-black text-white">
                    Jetzt 2h einchecken
                  </p>
                </div>
                <span className="text-xs font-black text-[#34D399]">CHECK-IN</span>
              </button>
            )}
          </div>
        </section>
      )}

      {/* MONATSENDE-CHECK (AB DEM 26. AUTOMATISCH ODER MANUELL IM ADMIN) */}
      {showMonthEndCheck && (
        <section className="rounded-3xl bg-amber-500/10 border border-amber-400/35 p-4 sm:p-5 space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-black text-amber-300">
              Monatsabschluss · Kader für {nextMonthInfo.label}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-200 text-[11px] font-black">
              {monthEndEligible.length} dabei
            </span>
          </div>
          <p className="text-xs text-slate-300">
            Bitte prüfe jetzt deinen Status für {nextMonthInfo.label}, damit die neuen
            Ligagruppen pünktlich eingeteilt werden können.
          </p>
          <button
            type="button"
            onClick={() => onNavigateTab('nextmonth')}
            className="min-h-[38px] px-3.5 rounded-xl bg-amber-400 text-slate-950 text-xs font-black cursor-pointer"
          >
            Kader {nextMonthInfo.monthName} öffnen
          </button>
        </section>
      )}

      {/* OFFENE EIGENE PFLICHTSPIELE */}
      {currentUser && userGroup && (
        <section className="rounded-3xl bg-[#12151C] border border-white/[0.08] p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-black text-white">
              Deine offenen Spiele ({userOpenMatches.length})
            </h2>
            <button
              type="button"
              onClick={() => onNavigateTab('leagues')}
              className="text-xs font-black text-[#34D399] cursor-pointer"
            >
              Alle Ligen →
            </button>
          </div>

          {userOpenMatches.length === 0 ? (
            <p className="text-xs text-slate-400">
              Alle deine Pflichtspiele in {activeSeason?.label} sind bereits gespielt!
            </p>
          ) : (
            <div className="space-y-2">
              {userOpenMatches.map(match => {
                const oppId =
                  match.player1Id === currentUser.id
                    ? match.player2Id
                    : match.player1Id;
                const opp = membersMap[oppId];
                if (!opp) return null;
                const waUrl = buildWhatsAppUrl(
                  opp.whatsapp,
                  `Hoi ${opp.nickname}, wann wollen wir unser ${userGroup.name}-Spiel (${activeSeason?.label}) spielen?`
                );

                return (
                  <div
                    key={match.id}
                    className="p-3 rounded-2xl bg-[#090B0F] border border-white/[0.06] flex items-center justify-between gap-2"
                  >
                    <button
                      type="button"
                      onClick={() => onOpenProfile(opp.id)}
                      className="flex items-center gap-2.5 min-w-0 text-left cursor-pointer"
                    >
                      <div
                        className={`w-9 h-9 rounded-xl bg-gradient-to-br ${opp.avatarBg} flex items-center justify-center text-white font-black text-xs shrink-0`}
                      >
                        {opp.nickname.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-black text-white truncate">
                          vs. {opp.nickname}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate">
                          {(opp.usualDays || []).join(', ') || 'Flexibel'}
                        </p>
                      </div>
                    </button>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {waUrl && (
                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-9 h-9 rounded-xl bg-[#25D366] text-slate-950 flex items-center justify-center"
                          title={`WhatsApp an ${opp.nickname}`}
                        >
                          <KlMessageIcon className="w-4 h-4" />
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={() => onOpenResultModal(match)}
                        className="min-h-[36px] px-3 rounded-xl bg-[#10B981] text-slate-950 text-xs font-black cursor-pointer"
                      >
                        Resultat
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* AKTUELLE LIGEN-ÜBERSICHT */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-black uppercase tracking-wider text-slate-400">
            Tabellen · {activeSeason?.label}
          </h2>
          <button
            type="button"
            onClick={() => onNavigateTab('board')}
            className="text-xs font-black text-sky-400 cursor-pointer"
          >
            Zur Pinnwand →
          </button>
        </div>

        {(activeSeason?.groups || []).map(group => {
          const standings = computeGroupStandings(group, membersMap);
          return (
            <div
              key={group.level}
              className="rounded-3xl bg-[#12151C] border border-white/[0.08] p-4 space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-white">{group.name}</h3>
                <span className="text-[11px] text-slate-400">
                  {standings.length} Spieler
                </span>
              </div>

              <div className="divide-y divide-white/[0.06]">
                {standings.map((row, idx) => (
                  <div
                    key={row.playerId}
                    className="py-2 flex items-center justify-between gap-2 text-xs"
                  >
                    <button
                      type="button"
                      onClick={() => onOpenProfile(row.playerId)}
                      className="flex items-center gap-2.5 min-w-0 text-left cursor-pointer"
                    >
                      <span
                        className={`w-5 h-5 rounded-md flex items-center justify-center text-[11px] font-black shrink-0 ${
                          idx === 0
                            ? 'bg-[#10B981]/20 text-[#34D399]'
                            : 'bg-white/[0.06] text-slate-300'
                        }`}
                      >
                        {idx + 1}
                      </span>
                      <span className="font-bold text-white truncate">
                        {row.member.nickname}
                      </span>
                    </button>
                    <div className="flex items-center gap-3 text-[11px] shrink-0">
                      <span className="text-slate-400">{row.played} Sp.</span>
                      <span className="text-slate-300">
                        {row.setsWon}:{row.setsLost}
                      </span>
                      <span className="font-black text-[#34D399] w-8 text-right">
                        {row.points} P
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}

// ============================================================================
// LEAGUES TAB (ALLE LIGEN & SPIELPLÄNE)
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
    <div className="space-y-4">
      <section className="rounded-3xl bg-[#12151C] border border-white/[0.08] p-4 sm:p-5 space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-black text-white">Monatsligen</h2>
            <p className="text-xs text-slate-400">
              Hinweis: Die Gruppengrösse kann je nach Anzahl aktiver Teilnehmer pro
              Monat variieren (z. B. 4er-, 5er- oder 6er-Gruppen).
            </p>
          </div>
          <select
            value={activeSeason?.id || ''}
            onChange={e => onSelectSeason(e.target.value)}
            className="min-h-[40px] px-3 rounded-xl bg-[#090B0F] border border-white/10 text-xs font-black text-white"
          >
            {seasons.map(s => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </section>

      {(activeSeason?.groups || []).map(group => {
        const standings = computeGroupStandings(group, membersMap);
        return (
          <section
            key={group.level}
            className="rounded-3xl bg-[#12151C] border border-white/[0.08] p-4 sm:p-5 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-white">{group.name}</h3>
              <span className="px-2.5 py-1 rounded-full bg-white/[0.06] text-[11px] font-bold text-slate-300">
                {group.playerIds.length}er-Gruppe
              </span>
            </div>

            {/* TABELLE */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-[11px] text-slate-400 border-b border-white/[0.07]">
                    <th className="py-2 text-left font-bold">#</th>
                    <th className="py-2 text-left font-bold">Spieler</th>
                    <th className="py-2 text-center font-bold">Sp</th>
                    <th className="py-2 text-center font-bold">Sätze</th>
                    <th className="py-2 text-right font-bold">Pkt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.05]">
                  {standings.map((row, idx) => (
                    <tr key={row.playerId}>
                      <td className="py-2.5 font-black text-slate-300">
                        {idx + 1}
                      </td>
                      <td className="py-2.5">
                        <button
                          type="button"
                          onClick={() => onOpenProfile(row.playerId)}
                          className="font-bold text-white hover:text-[#34D399] cursor-pointer"
                        >
                          {row.member.nickname}
                        </button>
                      </td>
                      <td className="py-2.5 text-center text-slate-400">
                        {row.played}
                      </td>
                      <td className="py-2.5 text-center text-slate-300">
                        {row.setsWon}:{row.setsLost}
                      </td>
                      <td className="py-2.5 text-right font-black text-[#34D399]">
                        {row.points}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* BEGEGNUNGEN */}
            <div className="space-y-2 pt-2 border-t border-white/[0.07]">
              <p className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                Begegnungen
              </p>
              {group.matches.map(match => {
                const p1 = membersMap[match.player1Id];
                const p2 = membersMap[match.player2Id];
                if (!p1 || !p2) return null;
                const isPlayed = match.setsP1 !== null && match.setsP2 !== null;
                const isMyMatch =
                  currentUser &&
                  (currentUser.id === p1.id || currentUser.id === p2.id);

                return (
                  <div
                    key={match.id}
                    className={`p-3 rounded-2xl border flex items-center justify-between gap-2 text-xs ${
                      isMyMatch
                        ? 'bg-[#090B0F] border-[#10B981]/30'
                        : 'bg-[#090B0F] border-white/[0.05]'
                    }`}
                  >
                    <div className="min-w-0 truncate">
                      <span className="font-bold text-white">{p1.nickname}</span>
                      <span className="text-slate-500 mx-1.5">vs</span>
                      <span className="font-bold text-white">{p2.nickname}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => onOpenResultModal(match)}
                      className={`min-h-[34px] px-3 rounded-xl font-black shrink-0 cursor-pointer ${
                        isPlayed
                          ? 'bg-white/[0.07] text-slate-200'
                          : 'bg-[#10B981] text-slate-950'
                      }`}
                    >
                      {isPlayed ? `${match.setsP1} : ${match.setsP2}` : 'Eintragen'}
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}

// ============================================================================
// NEXT MONTH TAB (FOLGEMONAT-KADER)
// ============================================================================
function NextMonthTab({
  membersMap,
  activeSeason,
  nextMonthInfo,
  currentUser,
  onToggleNextMonth,
  onOpenProfile,
}) {
  const confirmed = useMemo(
    () =>
      Object.values(membersMap)
        .filter(m => m.status === 'Dabei' && m.nextMonthOptIn)
        .sort((a, b) => b.annualPoints - a.annualPoints),
    [membersMap]
  );

  const paused = useMemo(
    () =>
      Object.values(membersMap).filter(
        m => m.status !== 'Dabei' || !m.nextMonthOptIn
      ),
    [membersMap]
  );

  return (
    <div className="space-y-4">
      <section className="rounded-3xl bg-[#12151C] border border-white/[0.08] p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-black text-white">{nextMonthInfo.label}</h2>
            <p className="text-xs text-slate-400">
              {confirmed.length} Spieler sind für {nextMonthInfo.monthName} angemeldet
            </p>
          </div>
          {currentUser && (
            <button
              type="button"
              onClick={onToggleNextMonth}
              className={`min-h-[40px] px-3.5 rounded-2xl text-xs font-black cursor-pointer ${
                currentUser.nextMonthOptIn
                  ? 'bg-[#10B981] text-slate-950'
                  : 'bg-[#090B0F] border border-white/10 text-slate-200'
              }`}
            >
              {currentUser.nextMonthOptIn ? 'Ich bin dabei ✓' : 'Jetzt zusagen'}
            </button>
          )}
        </div>
      </section>

      <section className="rounded-3xl bg-[#12151C] border border-white/[0.08] p-4 sm:p-5 space-y-2.5">
        <h3 className="text-xs font-black uppercase tracking-wider text-[#34D399]">
          Dabei in {nextMonthInfo.monthName} ({confirmed.length})
        </h3>
        {confirmed.length === 0 ? (
          <p className="text-xs text-slate-400">Noch keine Zusagen vorhanden.</p>
        ) : (
          <div className="divide-y divide-white/[0.06]">
            {confirmed.map((m, idx) => {
              const currentGroup = activeSeason?.groups.find(g =>
                g.playerIds.includes(m.id)
              );
              return (
                <div
                  key={m.id}
                  className="py-2.5 flex items-center justify-between gap-2 text-xs"
                >
                  <button
                    type="button"
                    onClick={() => onOpenProfile(m.id)}
                    className="flex items-center gap-2.5 text-left cursor-pointer"
                  >
                    <span className="text-slate-500 font-black w-5">{idx + 1}.</span>
                    <span className="font-bold text-white">{m.nickname}</span>
                  </button>
                  <span className="text-[11px] text-slate-400">
                    {currentGroup ? `Aktuell ${currentGroup.name}` : 'Neueinsteiger'}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="rounded-3xl bg-[#12151C] border border-white/[0.08] p-4 sm:p-5 space-y-2">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
          Pause / Nur CONNECT ({paused.length})
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {paused.map(m => (
            <button
              key={m.id}
              type="button"
              onClick={() => onOpenProfile(m.id)}
              className="px-3 py-1.5 rounded-xl bg-[#090B0F] text-xs text-slate-400 cursor-pointer"
            >
              {m.nickname}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

// ============================================================================
// RECENT MATCHES TAB (LETZTE RESULTATE)
// ============================================================================
function RecentMatchesTab({
  membersMap,
  seasons,
  activeSeason,
  onSelectSeason,
  onOpenProfile,
}) {
  const playedMatches = useMemo(() => {
    const list = [];
    (activeSeason?.groups || []).forEach(g => {
      g.matches.forEach(m => {
        if (m.setsP1 !== null && m.setsP2 !== null) {
          list.push({ ...m, groupName: g.name });
        }
      });
    });
    return list.sort((a, b) =>
      String(b.playedAt || '').localeCompare(String(a.playedAt || ''))
    );
  }, [activeSeason]);

  return (
    <div className="space-y-4">
      <section className="rounded-3xl bg-[#12151C] border border-white/[0.08] p-4 sm:p-5 flex items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-black text-white">Gespielte Matches</h2>
          <p className="text-xs text-slate-400">
            {playedMatches.length} Resultate in {activeSeason?.label}
          </p>
        </div>
        <select
          value={activeSeason?.id || ''}
          onChange={e => onSelectSeason(e.target.value)}
          className="min-h-[40px] px-3 rounded-xl bg-[#090B0F] border border-white/10 text-xs font-black text-white"
        >
          {seasons.map(s => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
      </section>

      {playedMatches.length === 0 ? (
        <div className="rounded-3xl bg-[#12151C] border border-white/[0.08] p-5 text-xs text-slate-400">
          In diesem Monat wurden noch keine Resultate eingetragen.
        </div>
      ) : (
        <div className="space-y-2">
          {playedMatches.map(m => {
            const p1 = membersMap[m.player1Id];
            const p2 = membersMap[m.player2Id];
            if (!p1 || !p2) return null;
            return (
              <div
                key={m.id}
                className="p-3.5 rounded-2xl bg-[#12151C] border border-white/[0.07] flex items-center justify-between gap-2 text-xs"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => onOpenProfile(p1.id)}
                      className={`font-black cursor-pointer ${
                        m.setsP1 > m.setsP2 ? 'text-[#34D399]' : 'text-white'
                      }`}
                    >
                      {p1.nickname}
                    </button>
                    <span className="text-slate-500">vs</span>
                    <button
                      type="button"
                      onClick={() => onOpenProfile(p2.id)}
                      className={`font-black cursor-pointer ${
                        m.setsP2 > m.setsP1 ? 'text-[#34D399]' : 'text-white'
                      }`}
                    >
                      {p2.nickname}
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    {m.groupName} · {m.playedAt}
                  </p>
                </div>
                <span className="px-3 py-1.5 rounded-xl bg-[#090B0F] font-black text-white shrink-0">
                  {m.setsP1} : {m.setsP2}
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
// ANNUAL RANKING TAB (JAHRESRANGLISTE)
// ============================================================================
function AnnualRankingTab({ membersMap, currentUser, onOpenProfile }) {
  const ranked = useMemo(
    () =>
      Object.values(membersMap).sort((a, b) => b.annualPoints - a.annualPoints),
    [membersMap]
  );

  return (
    <div className="space-y-4">
      <section className="rounded-3xl bg-[#12151C] border border-white/[0.08] p-4 sm:p-5">
        <h2 className="text-lg font-black text-white">Jahresrangliste</h2>
        <p className="text-xs text-slate-400">
          Gesamtpunkte über alle gespielten Monatsligen
        </p>
      </section>

      <div className="rounded-3xl bg-[#12151C] border border-white/[0.08] divide-y divide-white/[0.06] overflow-hidden">
        {ranked.map((m, idx) => {
          const isMe = currentUser?.id === m.id;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => onOpenProfile(m.id)}
              className={`w-full p-3.5 flex items-center justify-between gap-3 text-left cursor-pointer ${
                isMe ? 'bg-[#10B981]/10' : ''
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${
                    idx === 0
                      ? 'bg-amber-400 text-slate-950'
                      : idx === 1
                      ? 'bg-slate-300 text-slate-950'
                      : idx === 2
                      ? 'bg-amber-700 text-white'
                      : 'bg-[#090B0F] text-slate-400'
                  }`}
                >
                  {idx + 1}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-black text-white truncate">
                    {m.nickname}
                  </p>
                  <p className="text-[11px] text-slate-400 truncate">
                    {m.style} · {m.seasonTitles}× Monatssieger
                  </p>
                </div>
              </div>
              <span className="text-sm font-black text-[#34D399] shrink-0">
                {m.annualPoints} Pkt
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================================
// PLAYERS TAB (CLUB-SPIELER VERZEICHNIS)
// ============================================================================
function PlayersTab({
  membersMap,
  activeSeason,
  nowTick,
  onOpenProfile,
  onOpenAddMember,
}) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return Object.values(membersMap).filter(m => {
      if (!q) return true;
      return (
        m.nickname.toLowerCase().includes(q) ||
        `${m.firstName} ${m.lastName}`.toLowerCase().includes(q) ||
        (m.style || '').toLowerCase().includes(q)
      );
    });
  }, [membersMap, query]);

  return (
    <div className="space-y-4">
      <section className="rounded-3xl bg-[#12151C] border border-white/[0.08] p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-black text-white">
              Club-Spieler ({Object.keys(membersMap).length})
            </h2>
            <p className="text-xs text-slate-400">
              Alle Mitglieder inklusive direktem WhatsApp-Kontakt
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenAddMember}
            className="min-h-[40px] px-3.5 rounded-2xl bg-[#10B981] text-slate-950 text-xs font-black shrink-0 cursor-pointer"
          >
            + NEW PLAYER
          </button>
        </div>

        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Nach Nickname, Name oder Spielstil suchen..."
          className="w-full min-h-[42px] px-3.5 rounded-2xl bg-[#090B0F] border border-white/10 text-xs text-white"
        />
      </section>

      <div className="space-y-2.5">
        {filtered.map(member => {
          const group = activeSeason?.groups.find(g =>
            g.playerIds.includes(member.id)
          );
          const isLive = isMemberCheckedIn(member, nowTick);
          const waUrl = buildWhatsAppUrl(
            member.whatsapp,
            `Hoi ${member.nickname}, wollen wir mal im Club zusammen Tischtennis spielen?`
          );

          return (
            <div
              key={member.id}
              className="p-4 rounded-3xl bg-[#12151C] border border-white/[0.07] flex items-center justify-between gap-3"
            >
              <button
                type="button"
                onClick={() => onOpenProfile(member.id)}
                className="flex items-center gap-3 text-left min-w-0 cursor-pointer"
              >
                <div
                  className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${member.avatarBg} flex items-center justify-center text-white font-black text-xs shrink-0 relative`}
                >
                  {member.nickname.slice(0, 2).toUpperCase()}
                  {isLive && (
                    <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] ring-2 ring-[#12151C] absolute -bottom-0.5 -right-0.5" />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-black text-white truncate">
                      {member.nickname}
                    </p>
                    <span className="px-2 py-0.5 rounded bg-white/[0.07] text-[10px] font-bold text-slate-300 shrink-0">
                      {group ? group.name : 'CONNECT'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate">
                    {member.style} · {member.language}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">
                    Hallentage: {(member.usualDays || []).join(', ') || 'Flexibel'}
                  </p>
                </div>
              </button>

              {waUrl && (
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-2xl bg-[#25D366] text-slate-950 flex items-center justify-center shrink-0"
                  title={`WhatsApp an ${member.nickname}`}
                >
                  <KlMessageIcon className="w-4 h-4" />
                </a>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================================
// HALL LIVE TAB (JETZT LIVE VOR ORT)
// ============================================================================
function HallLiveTab({
  membersMap,
  activeSeason,
  currentUser,
  nowTick,
  onRequestSelectUser,
  onCheckIn,
  onCheckOut,
  onOpenProfile,
}) {
  const [minutes, setMinutes] = useState(120);
  const [mood, setMood] = useState(CHECKIN_MOODS[0]);

  const liveMembers = useMemo(
    () =>
      Object.values(membersMap).filter(m => isMemberCheckedIn(m, nowTick)),
    [membersMap, nowTick]
  );

  const isLive = isMemberCheckedIn(currentUser, nowTick);

  return (
    <div className="space-y-4">
      {/* JETZT LIVE VOR ORT */}
      <section className="rounded-3xl bg-[#12151C] border border-white/[0.07] p-4 sm:p-5 space-y-3.5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-white">LIVE in der Halle</h2>
            <p className="text-xs text-slate-400">
              {liveMembers.length} Spieler aktuell vor Ort eingecheckt
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-[#10B981]/15 text-[#34D399] text-xs font-black">
            {liveMembers.length} LIVE
          </span>
        </div>

        {!currentUser ? (
          <div className="p-3 rounded-2xl bg-[#090B0F] space-y-2">
            <p className="text-xs text-slate-300">
              Wähle dein Profil, um dich live einzuchecken:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {Object.values(membersMap).map(m => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => onRequestSelectUser(m.id)}
                  className="min-h-[36px] px-3 rounded-xl bg-[#12151C] border border-white/10 text-xs font-bold text-white cursor-pointer"
                >
                  {m.nickname}
                </button>
              ))}
            </div>
          </div>
        ) : isLive ? (
          <div className="p-3.5 rounded-2xl bg-[#090B0F] border border-[#10B981]/35 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black text-[#34D399]">
                Du bist eingecheckt · noch{' '}
                {formatRemainingTime(currentUser.checkedInUntil, nowTick)}
              </p>
              <p className="text-[11px] text-slate-400">
                {currentUser.checkInMood || CHECKIN_MOODS[0]}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onCheckOut(currentUser.id)}
              className="min-h-[38px] px-3.5 rounded-xl bg-rose-500 text-white text-xs font-black shrink-0 cursor-pointer"
            >
              CHECK-OUT
            </button>
          </div>
        ) : (
          <div className="p-3.5 rounded-2xl bg-[#090B0F] space-y-2.5">
            <div className="grid grid-cols-4 gap-1.5">
              {[60, 90, 120, 180].map(m => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMinutes(m)}
                  className={`min-h-[36px] rounded-xl text-xs font-black cursor-pointer ${
                    minutes === m
                      ? 'bg-[#10B981] text-slate-950'
                      : 'bg-[#12151C] text-slate-300'
                  }`}
                >
                  {m >= 60 ? `${m / 60}h` : `${m}m`}
                </button>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <select
                value={mood}
                onChange={e => setMood(e.target.value)}
                className="flex-1 min-h-[40px] px-3 rounded-xl bg-[#12151C] border border-white/10 text-xs font-bold text-white"
              >
                {CHECKIN_MOODS.map(item => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => onCheckIn(currentUser.id, minutes, mood)}
                className="min-h-[40px] px-4 rounded-xl bg-[#10B981] text-slate-950 text-xs font-black shrink-0 cursor-pointer"
              >
                Jetzt einchecken
              </button>
            </div>
          </div>
        )}
      </section>

      {liveMembers.length === 0 ? (
        <div className="rounded-3xl bg-[#12151C] border border-white/[0.07] p-4 text-xs text-slate-400">
          Aktuell ist niemand live vor Ort eingecheckt.
        </div>
      ) : (
        <div className="space-y-2.5">
          {liveMembers.map(member => {
            const group = activeSeason?.groups.find(g =>
              g.playerIds.includes(member.id)
            );
            const waUrl = buildWhatsAppUrl(
              member.whatsapp,
              `Hoi ${member.nickname}, ich sehe du bist gerade in der Halle – wollen wir zusammen spielen?`
            );

            return (
              <div
                key={member.id}
                className="rounded-3xl bg-[#12151C] border border-[#10B981]/30 p-4 flex items-center justify-between gap-3"
              >
                <button
                  type="button"
                  onClick={() => onOpenProfile(member.id)}
                  className="flex items-center gap-3 text-left min-w-0 cursor-pointer"
                >
                  <div
                    className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${member.avatarBg} flex items-center justify-center text-white font-black text-xs shrink-0 relative`}
                  >
                    {member.nickname.slice(0, 2).toUpperCase()}
                    <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] ring-2 ring-[#12151C] absolute -bottom-0.5 -right-0.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-black text-white truncate">
                        {member.nickname}
                      </p>
                      <span className="px-2 py-0.5 rounded bg-white/[0.07] text-[10px] font-bold text-slate-300 shrink-0">
                        {group ? group.name : member.status}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-[#34D399] truncate">
                      {member.checkInMood || CHECKIN_MOODS[0]}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Noch {formatRemainingTime(member.checkedInUntil, nowTick)} vor Ort
                    </p>
                  </div>
                </button>

                {waUrl && currentUser?.id !== member.id && (
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-2xl bg-[#10B981] text-slate-950 flex items-center justify-center shrink-0"
                    title={`WhatsApp an ${member.nickname}`}
                  >
                    <KlMessageIcon className="w-4 h-4" />
                  </a>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// VORANKÜNDIGUNGEN TAB ("BIN DA AM...")
// ============================================================================
function AnnouncementsTab({
  membersMap,
  activeSeason,
  currentUser,
  announcements,
  onRequestSelectUser,
  onSaveAnnouncement,
  onDeleteAnnouncement,
  onToggleAnnouncementMeToo,
  onOpenProfile,
}) {
  const myAnnouncement = useMemo(
    () =>
      currentUser
        ? announcements.find(a => a.memberId === currentUser.id) || null
        : null,
    [announcements, currentUser]
  );

  const [showAnnounceForm, setShowAnnounceForm] = useState(false);
  const [annDay, setAnnDay] = useState('Morgen');
  const [annTime, setAnnTime] = useState('17:30');
  const [annNote, setAnnNote] = useState('Offen für Liga & Training');

  const openEditAnnouncement = () => {
    if (myAnnouncement) {
      setAnnDay(myAnnouncement.dayLabel);
      setAnnTime(myAnnouncement.timeText);
      setAnnNote(myAnnouncement.note || '');
    } else {
      setAnnDay('Morgen');
      setAnnTime('17:30');
      setAnnNote('Offen für Liga & Training');
    }
    setShowAnnounceForm(true);
  };

  const handleSaveAnn = e => {
    e.preventDefault();
    if (!currentUser || !annTime.trim()) return;
    onSaveAnnouncement(currentUser.id, {
      dayLabel: annDay,
      timeText: annTime.trim(),
      note: annNote.trim(),
    });
    setShowAnnounceForm(false);
  };

  return (
    <div className="space-y-4">
      <section className="rounded-3xl bg-[#12151C] border border-sky-400/25 p-4 sm:p-5 space-y-3.5">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-black text-white">
              Vorankündigungen ({announcements.length})
            </h2>
            <p className="text-xs text-slate-400">
              Kurz Bescheid geben, wann du in die Halle kommst
            </p>
          </div>
          {currentUser && !showAnnounceForm && (
            <button
              type="button"
              onClick={openEditAnnouncement}
              className="min-h-[40px] px-3.5 rounded-2xl bg-sky-400 text-slate-950 text-xs font-black shrink-0 cursor-pointer"
            >
              {myAnnouncement ? 'Anpassen' : '+ Bin da am...'}
            </button>
          )}
        </div>

        {!currentUser && (
          <div className="p-3 rounded-2xl bg-[#090B0F] space-y-2">
            <p className="text-xs text-slate-300">
              Wähle dein Profil, um dich voranzukündigen:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {Object.values(membersMap).map(m => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => onRequestSelectUser(m.id)}
                  className="min-h-[36px] px-3 rounded-xl bg-[#12151C] border border-white/10 text-xs font-bold text-white cursor-pointer"
                >
                  {m.nickname}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* EIGENE AKTIVE VORANKÜNDIGUNG */}
        {currentUser && myAnnouncement && !showAnnounceForm && (
          <div className="p-3 rounded-2xl bg-sky-400/10 border border-sky-400/30 flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="text-xs font-black text-sky-300">
                Deine Ankündigung: {myAnnouncement.dayLabel} ab {myAnnouncement.timeText}
              </p>
              {myAnnouncement.note && (
                <p className="text-[11px] text-slate-300 truncate">
                  {myAnnouncement.note}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => onDeleteAnnouncement(currentUser.id)}
              className="w-8 h-8 rounded-xl bg-rose-500/15 text-rose-300 flex items-center justify-center shrink-0 cursor-pointer"
              title="Vorankündigung entfernen"
            >
              <KlTrashIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* FORMULAR FÜR VORANKÜNDIGUNG */}
        {currentUser && showAnnounceForm && (
          <form
            onSubmit={handleSaveAnn}
            className="p-3.5 rounded-2xl bg-[#090B0F] border border-sky-400/35 space-y-3"
          >
            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1.5">
                Welcher Tag?
              </label>
              <div className="flex flex-wrap gap-1.5">
                {['Heute', 'Morgen', ...WEEKDAYS].map(day => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => setAnnDay(day)}
                    className={`min-h-[34px] px-3 rounded-xl text-xs font-black cursor-pointer ${
                      annDay === day
                        ? 'bg-sky-400 text-slate-950'
                        : 'bg-[#12151C] text-slate-300'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">
                  Ab welcher Uhrzeit? *
                </label>
                <input
                  type="time"
                  required
                  value={annTime}
                  onChange={e => setAnnTime(e.target.value)}
                  className="w-full min-h-[42px] px-3 rounded-xl bg-[#12151C] border border-white/10 text-xs font-bold text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">
                  Hinweis (optional)
                </label>
                <input
                  type="text"
                  value={annNote}
                  onChange={e => setAnnNote(e.target.value)}
                  placeholder="z.B. Bis ca. 20:00 da"
                  className="w-full min-h-[42px] px-3 rounded-xl bg-[#12151C] border border-white/10 text-xs text-white"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowAnnounceForm(false)}
                className="flex-1 min-h-[42px] rounded-2xl bg-white/5 text-xs font-bold text-slate-300 cursor-pointer"
              >
                Abbrechen
              </button>
              <button
                type="submit"
                className="flex-1 min-h-[42px] rounded-2xl bg-sky-400 text-slate-950 text-xs font-black cursor-pointer"
              >
                Vorankündigen
              </button>
            </div>
          </form>
        )}
      </section>

      {/* LISTE ALLER VORANKÜNDIGUNGEN */}
      {announcements.length === 0 ? (
        <div className="rounded-3xl bg-[#12151C] border border-white/[0.07] p-5 text-xs text-slate-400">
          Noch keine Vorankündigungen eingetragen.
        </div>
      ) : (
        <div className="space-y-2.5">
          {announcements.map(ann => {
            const member = membersMap[ann.memberId];
            if (!member) return null;
            const group = activeSeason?.groups.find(g =>
              g.playerIds.includes(member.id)
            );
            const isMe = currentUser?.id === member.id;
            const hasMeToo = currentUser
              ? (ann.meTooIds || []).includes(currentUser.id)
              : false;
            const waUrl = buildWhatsAppUrl(
              member.whatsapp,
              `Hoi ${member.nickname}, ich habe gesehen du bist ${ann.dayLabel} ab ${ann.timeText} in der Halle – ich komme auch!`
            );

            return (
              <div
                key={ann.id}
                className="p-4 rounded-3xl bg-[#12151C] border border-white/[0.07] space-y-2.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => onOpenProfile(member.id)}
                    className="flex items-center gap-2.5 text-left min-w-0 cursor-pointer"
                  >
                    <div
                      className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${member.avatarBg} flex items-center justify-center text-white font-black text-xs shrink-0`}
                    >
                      {member.nickname.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-sm font-black text-white truncate">
                          {member.nickname}
                        </p>
                        <span className="px-2 py-0.5 rounded bg-white/[0.07] text-[10px] font-bold text-slate-300 shrink-0">
                          {group ? group.name : 'Clubspieler'}
                        </span>
                      </div>
                      <p className="text-xs font-black text-sky-300">
                        {ann.dayLabel} · ab {ann.timeText} Uhr
                      </p>
                      {ann.note && (
                        <p className="text-[11px] text-slate-400 truncate">
                          {ann.note}
                        </p>
                      )}
                    </div>
                  </button>

                  {!isMe && (
                    <div className="flex items-center gap-1.5 shrink-0">
                      {currentUser && (
                        <button
                          type="button"
                          onClick={() =>
                            onToggleAnnouncementMeToo(ann.id, currentUser.id)
                          }
                          className={`min-h-[38px] px-3 rounded-xl text-xs font-black cursor-pointer ${
                            hasMeToo
                              ? 'bg-sky-400 text-slate-950'
                              : 'bg-[#090B0F] border border-white/10 text-slate-200'
                          }`}
                        >
                          {hasMeToo ? 'Komme auch ✓' : '+ Komme auch'}
                        </button>
                      )}
                      {waUrl && (
                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 rounded-xl bg-[#25D366] text-slate-950 flex items-center justify-center"
                          title={`WhatsApp an ${member.nickname}`}
                        >
                          <KlMessageIcon className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  )}
                </div>

                {(ann.meTooIds || []).length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 text-[11px] pt-1.5 border-t border-white/[0.06]">
                    <span className="text-slate-400 font-bold">Kommen auch:</span>
                    {ann.meTooIds.map(pid => {
                      const m = membersMap[pid];
                      if (!m) return null;
                      return (
                        <span
                          key={pid}
                          className="px-2 py-0.5 rounded-lg bg-sky-400/15 text-sky-300 font-black"
                        >
                          {m.nickname}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// HALL SCHEDULE TAB (WER IST WANN IN DER HALLE?)
// ============================================================================
function HallScheduleTab({
  membersMap,
  activeSeason,
  currentUser,
  nowTick,
  onToggleUserDay,
  onOpenProfile,
}) {
  const todayIndex = (new Date(nowTick).getDay() + 6) % 7;
  const [selectedDay, setSelectedDay] = useState(WEEKDAYS[todayIndex] || 'Di');

  const dayPlayers = useMemo(
    () =>
      Object.values(membersMap).filter(m =>
        (m.usualDays || []).includes(selectedDay)
      ),
    [membersMap, selectedDay]
  );

  return (
    <div className="space-y-4">
      <section className="rounded-3xl bg-[#12151C] border border-white/[0.08] p-4 sm:p-5 space-y-3.5">
        <div>
          <h2 className="text-lg font-black text-white">
            Wer ist wann in der Halle?
          </h2>
          <p className="text-xs text-slate-400">
            Wähle einen Wochentag, um regelmässige Hallenspieler zu finden
          </p>
        </div>

        {/* WOCHENTAGS-FILTER */}
        <div className="grid grid-cols-7 gap-1.5">
          {WEEKDAYS.map(day => {
            const count = Object.values(membersMap).filter(m =>
              (m.usualDays || []).includes(day)
            ).length;
            const active = selectedDay === day;
            return (
              <button
                key={day}
                type="button"
                onClick={() => setSelectedDay(day)}
                className={`min-h-[48px] rounded-2xl flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
                  active
                    ? 'bg-sky-400 text-slate-950 font-black'
                    : 'bg-[#090B0F] text-slate-300 font-bold'
                }`}
              >
                <span className="text-xs">{day}</span>
                <span
                  className={`text-[10px] ${
                    active ? 'text-slate-900' : 'text-slate-500'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* EIGENE HALLENTAGE SCHNELL PFLEGEN */}
        {currentUser && (
          <div className="p-3 rounded-2xl bg-[#090B0F] space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-bold text-slate-400">
                Deine Hallentage ({currentUser.nickname}):
              </p>
              <button
                type="button"
                onClick={() => onOpenProfile(currentUser.id, true)}
                className="text-[11px] font-black text-sky-400 cursor-pointer"
              >
                Zeiten bearbeiten
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {WEEKDAYS.map(day => {
                const mine = (currentUser.usualDays || []).includes(day);
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => onToggleUserDay(currentUser.id, day)}
                    className={`min-h-[32px] px-3 rounded-xl text-xs font-black cursor-pointer ${
                      mine
                        ? 'bg-sky-400 text-slate-950'
                        : 'bg-[#12151C] text-slate-400'
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {dayPlayers.length === 0 ? (
        <div className="rounded-3xl bg-[#12151C] border border-white/[0.07] p-5 text-xs text-slate-400">
          Am {selectedDay} hat noch niemand einen fixen Hallentag eingetragen.
        </div>
      ) : (
        <div className="space-y-2.5">
          {dayPlayers.map(member => {
            const group = activeSeason?.groups.find(g =>
              g.playerIds.includes(member.id)
            );
            const waUrl = buildWhatsAppUrl(
              member.whatsapp,
              `Hoi ${member.nickname}, ich habe gesehen du bist am ${selectedDay} oft in der Halle – wollen wir zusammen spielen?`
            );

            return (
              <div
                key={member.id}
                className="p-4 rounded-3xl bg-[#12151C] border border-white/[0.07] flex items-center justify-between gap-3"
              >
                <button
                  type="button"
                  onClick={() => onOpenProfile(member.id)}
                  className="flex items-center gap-3 text-left min-w-0 cursor-pointer"
                >
                  <div
                    className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${member.avatarBg} flex items-center justify-center text-white font-black text-xs shrink-0`}
                  >
                    {member.nickname.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-black text-white truncate">
                        {member.nickname}
                      </p>
                      <span className="px-2 py-0.5 rounded bg-white/[0.07] text-[10px] font-bold text-slate-300 shrink-0">
                        {group ? group.name : 'Clubspieler'}
                      </span>
                    </div>
                    <p className="text-xs text-sky-300 font-bold truncate">
                      {(member.usualSlots || []).join(' & ') || 'Nach Absprache'}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate">
                      {member.style} · {member.language}
                    </p>
                  </div>
                </button>

                {waUrl && currentUser?.id !== member.id && (
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-2xl bg-[#25D366] text-slate-950 flex items-center justify-center shrink-0"
                    title={`WhatsApp an ${member.nickname}`}
                  >
                    <KlMessageIcon className="w-4 h-4" />
                  </a>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// MEETUP BOARD TAB (SPIELPARTNER PINNWAND)
// ============================================================================
function MeetupBoardTab({
  posts,
  membersMap,
  activeSeason,
  currentUser,
  onRequestSelectUser,
  onCreatePost,
  onToggleJoinPost,
  onDeletePost,
  onOpenProfile,
}) {
  const [showForm, setShowForm] = useState(false);
  const [whenText, setWhenText] = useState('');
  const [mode, setMode] = useState(MEETUP_MODES[0]);
  const [note, setNote] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    if (!currentUser || !whenText.trim()) return;
    onCreatePost({
      authorId: currentUser.id,
      whenText: whenText.trim(),
      mode,
      note: note.trim(),
    });
    setWhenText('');
    setNote('');
    setShowForm(false);
  };

  return (
    <div className="space-y-4">
      <section className="rounded-3xl bg-[#12151C] border border-sky-400/25 p-4 sm:p-5 space-y-3.5">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-black text-white">Pinnwand</h2>
            <p className="text-xs text-slate-400">
              Sessions für Training, Sparring, Doppel oder Ligaspiele posten
            </p>
          </div>
          {currentUser && !showForm && (
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="min-h-[40px] px-3.5 rounded-2xl bg-sky-400 text-slate-950 text-xs font-black shrink-0 cursor-pointer"
            >
              + Session
            </button>
          )}
        </div>

        {!currentUser && (
          <div className="p-3 rounded-2xl bg-[#090B0F] space-y-2">
            <p className="text-xs text-slate-300">
              Wähle dein Profil, um eine Session zu posten oder zuzusagen:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {Object.values(membersMap).map(m => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => onRequestSelectUser(m.id)}
                  className="min-h-[36px] px-3 rounded-xl bg-[#12151C] border border-white/10 text-xs font-bold text-white cursor-pointer"
                >
                  {m.nickname}
                </button>
              ))}
            </div>
          </div>
        )}

        {currentUser && showForm && (
          <form
            onSubmit={handleSubmit}
            className="p-3.5 rounded-2xl bg-[#090B0F] border border-sky-400/35 space-y-3"
          >
            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1">
                Wann? (Tag & Uhrzeit) *
              </label>
              <input
                type="text"
                required
                value={whenText}
                onChange={e => setWhenText(e.target.value)}
                placeholder="z.B. Freitag · 18:30 – 20:30"
                className="w-full min-h-[42px] px-3 rounded-xl bg-[#12151C] border border-white/10 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1">
                Modus
              </label>
              <select
                value={mode}
                onChange={e => setMode(e.target.value)}
                className="w-full min-h-[42px] px-3 rounded-xl bg-[#12151C] border border-white/10 text-xs font-bold text-white"
              >
                {MEETUP_MODES.map(m => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1">
                Kurze Info (optional)
              </label>
              <input
                type="text"
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="z.B. Gerne Balleimer oder 3 Gewinnsätze"
                className="w-full min-h-[42px] px-3 rounded-xl bg-[#12151C] border border-white/10 text-xs text-white"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 min-h-[42px] rounded-2xl bg-white/5 text-xs font-bold text-slate-300 cursor-pointer"
              >
                Abbrechen
              </button>
              <button
                type="submit"
                className="flex-1 min-h-[42px] rounded-2xl bg-sky-400 text-slate-950 text-xs font-black cursor-pointer"
              >
                Session posten
              </button>
            </div>
          </form>
        )}
      </section>

      {posts.length === 0 ? (
        <div className="rounded-3xl bg-[#12151C] border border-white/[0.07] p-5 text-xs text-slate-400">
          Aktuell keine offenen Sessions auf der Pinnwand.
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map(post => {
            const author = membersMap[post.authorId];
            if (!author) return null;
            const group = activeSeason?.groups.find(g =>
              g.playerIds.includes(author.id)
            );
            const isAuthor = currentUser?.id === author.id;
            const isJoined = currentUser
              ? post.joinedIds.includes(currentUser.id)
              : false;
            const isSingles = !post.mode.toLowerCase().includes('doppel');
            const maxPlayers = isSingles ? 1 : 3;
            const isLocked = post.joinedIds.length >= maxPlayers;

            const waUrl = buildWhatsAppUrl(
              author.whatsapp,
              `Hoi ${author.nickname}, wegen deiner Session auf der Pinnwand (${post.whenText} · ${post.mode}): Bist du noch frei?`
            );

            return (
              <div
                key={post.id}
                className={`p-4 rounded-3xl bg-[#12151C] border space-y-3 ${
                  isLocked ? 'border-amber-400/30' : 'border-white/[0.08]'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => onOpenProfile(author.id)}
                    className="flex items-center gap-2.5 text-left min-w-0 cursor-pointer"
                  >
                    <div
                      className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${author.avatarBg} flex items-center justify-center text-white font-black text-xs shrink-0`}
                    >
                      {author.nickname.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-sm font-black text-white truncate">
                          {author.nickname}
                        </p>
                        <span className="px-2 py-0.5 rounded bg-white/[0.07] text-[10px] font-bold text-slate-300 shrink-0">
                          {group ? group.name : 'Clubspieler'}
                        </span>
                      </div>
                      <p className="text-xs font-black text-sky-300">
                        {post.whenText}
                      </p>
                    </div>
                  </button>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {isLocked && (
                      <span className="px-2.5 py-1 rounded-full bg-amber-400/15 text-amber-300 text-[10px] font-black">
                        Besetzt
                      </span>
                    )}
                    {isAuthor && (
                      <button
                        type="button"
                        onClick={() => onDeletePost(post.id)}
                        className="w-8 h-8 rounded-xl bg-rose-500/15 text-rose-300 flex items-center justify-center cursor-pointer"
                        title="Session löschen"
                      >
                        <KlTrashIcon className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="inline-block px-2.5 py-0.5 rounded-lg bg-sky-400/15 text-sky-300 text-[11px] font-black">
                    {post.mode}
                  </span>
                  {post.note && (
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {post.note}
                    </p>
                  )}
                </div>

                {post.joinedIds.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                    <span className="text-slate-400 font-bold">Dabei:</span>
                    {post.joinedIds.map(pid => {
                      const m = membersMap[pid];
                      if (!m) return null;
                      return (
                        <span
                          key={pid}
                          className="px-2 py-0.5 rounded-lg bg-[#10B981]/15 text-[#34D399] font-black"
                        >
                          {m.nickname}
                        </span>
                      );
                    })}
                  </div>
                )}

                {!isAuthor && (
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    {currentUser ? (
                      <button
                        type="button"
                        disabled={isLocked && !isJoined}
                        onClick={() => onToggleJoinPost(post.id, currentUser.id)}
                        className={`min-h-[42px] px-3 rounded-2xl text-xs font-black cursor-pointer ${
                          isJoined
                            ? 'bg-[#10B981] text-slate-950'
                            : isLocked
                            ? 'bg-white/[0.04] text-slate-500 cursor-not-allowed'
                            : 'bg-[#090B0F] border border-white/10 text-white'
                        }`}
                      >
                        {isJoined
                          ? 'Bin dabei ✓'
                          : isLocked
                          ? 'Gesperrt'
                          : 'Bin dabei'}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onRequestSelectUser(author.id)}
                        className="min-h-[42px] px-3 rounded-2xl bg-[#090B0F] border border-white/10 text-xs font-bold text-slate-300 cursor-pointer"
                      >
                        Profil wählen
                      </button>
                    )}

                    {waUrl && (
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="min-h-[42px] px-3 rounded-2xl bg-[#25D366] text-slate-950 text-xs font-black inline-flex items-center justify-center gap-1.5"
                      >
                        <KlMessageIcon className="w-4 h-4" />
                        <span>WhatsApp</span>
                      </a>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// ADMIN TAB (FREIGABEN, LIGEN, MONATSWECHSEL, PIN)
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
  onAddPlayerToLeague,
  onAdminUpdateMatch,
  onCreateNextMonth,
  onDeleteSeason,
  onResetDemoData,
}) {
  const [adminPin, setAdminPin] = useState(() => {
    try {
      return localStorage.getItem('kongleague_admin_pin') || '9999';
    } catch {
      return '9999';
    }
  });
  const [unlocked, setUnlocked] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [newPinInput, setNewPinInput] = useState('');
  const [pinSavedMsg, setPinSavedMsg] = useState('');
  const [adminBanner, setAdminBanner] = useState('');
  const [manageSeasonId, setManageSeasonId] = useState(
    activeSeason?.id || seasons[0]?.id || ''
  );
  const [confirmDeleteMemberId, setConfirmDeleteMemberId] = useState(null);
  const [addLeagueChoice, setAddLeagueChoice] = useState({});

  useEffect(() => {
    try {
      localStorage.setItem('kongleague_admin_pin', adminPin);
    } catch {
      // Storage ggf. in Sandbox eingeschränkt
    }
  }, [adminPin]);

  const handleUnlock = e => {
    e.preventDefault();
    let storedPin = adminPin;
    try {
      const fromStorage = localStorage.getItem('kongleague_admin_pin');
      if (fromStorage) storedPin = fromStorage;
    } catch {
      // ignore
    }
    if (pinInput.trim() === storedPin) {
      setUnlocked(true);
      setPinError('');
      setPinInput('');
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
      localStorage.setItem('kongleague_admin_pin', cleaned);
    } catch {
      // ignore
    }
    setNewPinInput('');
    setPinSavedMsg(`Neuer Admin-PIN (${cleaned}) gespeichert!`);
    setAdminBanner(`Admin-PIN erfolgreich auf ${cleaned} überschrieben.`);
  };

  if (!unlocked) {
    return (
      <section className="rounded-3xl bg-[#12151C] border border-amber-400/30 p-5 space-y-4 max-w-md mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-amber-400/20 text-amber-300 flex items-center justify-center">
            <KlLockIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-black text-white">Admin-Bereich</h2>
            <p className="text-xs text-slate-400">
              Standard-PIN: <span className="font-black text-amber-300">{adminPin}</span>
            </p>
          </div>
        </div>

        <form onSubmit={handleUnlock} className="space-y-3">
          <input
            type="password"
            inputMode="numeric"
            value={pinInput}
            onChange={e => setPinInput(e.target.value)}
            placeholder="Admin-PIN eingeben"
            className="w-full min-h-[44px] px-3.5 rounded-2xl bg-[#090B0F] border border-white/10 text-sm text-white"
          />
          {pinError && <p className="text-xs text-rose-400 font-bold">{pinError}</p>}
          <button
            type="submit"
            className="w-full min-h-[44px] rounded-2xl bg-amber-400 text-slate-950 text-xs font-black cursor-pointer"
          >
            Entsperren
          </button>
        </form>
      </section>
    );
  }

  const managedSeason =
    seasons.find(s => s.id === manageSeasonId) || activeSeason || seasons[0];
  const pendingMembers = Object.values(membersMap).filter(
    m => m.status === 'Offen'
  );
  const unassignedActiveMembers = Object.values(membersMap).filter(m => {
    if (m.status !== 'Dabei') return false;
    return !(managedSeason?.groups || []).some(g =>
      g.playerIds.includes(m.id)
    );
  });

  return (
    <div className="space-y-4">
      {adminBanner && (
        <div className="p-3.5 rounded-2xl bg-[#10B981]/15 border border-[#10B981]/40 text-xs font-bold text-[#34D399] flex items-center justify-between gap-2">
          <span>{adminBanner}</span>
          <button
            type="button"
            onClick={() => setAdminBanner('')}
            className="text-xs font-black cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* NEUE ANMELDUNGEN & DIREKTEINSTIEG */}
      <section className="rounded-3xl bg-[#12151C] border border-white/[0.08] p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-base font-black text-white">
            Freigaben ({pendingMembers.length})
          </h2>
          <button
            type="button"
            onClick={onToggleDirectEntry}
            className={`min-h-[34px] px-3 rounded-xl text-[11px] font-black cursor-pointer ${
              allowDirectEntry
                ? 'bg-[#10B981]/20 text-[#34D399]'
                : 'bg-white/10 text-slate-300'
            }`}
          >
            Direkteinstieg: {allowDirectEntry ? 'AN' : 'AUS'}
          </button>
        </div>

        {pendingMembers.length === 0 ? (
          <p className="text-xs text-slate-400">
            Keine offenen Registrierungen vorhanden.
          </p>
        ) : (
          <div className="space-y-2">
            {pendingMembers.map(m => (
              <div
                key={m.id}
                className="p-3 rounded-2xl bg-[#090B0F] border border-white/[0.06] flex flex-wrap items-center justify-between gap-2"
              >
                <div>
                  <p className="text-xs font-black text-white">
                    {m.nickname} ({m.firstName} {m.lastName})
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {m.whatsapp || 'Kein WhatsApp'} · {m.language}
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      onApproveMember(m.id);
                      setAdminBanner(`${m.nickname} freigegeben.`);
                    }}
                    className="min-h-[34px] px-3 rounded-xl bg-white/10 text-white text-xs font-black cursor-pointer"
                  >
                    Freigeben
                  </button>
                  {allowDirectEntry && (
                    <button
                      type="button"
                      onClick={() => {
                        onDirectEntryMember(m.id);
                        setAdminBanner(
                          `${m.nickname} freigegeben & direkt in die Liga eingeteilt.`
                        );
                      }}
                      className="min-h-[34px] px-3 rounded-xl bg-[#10B981] text-slate-950 text-xs font-black cursor-pointer"
                    >
                      + Direkteinstieg
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* MONATSWECHSEL & MONATSABSCHLUSS-CHECK */}
      <section className="rounded-3xl bg-[#12151C] border border-white/[0.08] p-4 sm:p-5 space-y-3.5">
        <h2 className="text-base font-black text-white">
          Monatswechsel & Monatsabschluss
        </h2>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              const created = onCreateNextMonth();
              if (created) {
                setAdminBanner(`Neuer Monat ${created} wurde erstellt!`);
              } else {
                setAdminBanner('Dieser Monat existiert bereits.');
              }
            }}
            className="min-h-[40px] px-4 rounded-2xl bg-[#10B981] text-slate-950 text-xs font-black cursor-pointer"
          >
            + Neuen Monat generieren
          </button>

          {seasons.length > 1 && managedSeason && (
            <button
              type="button"
              onClick={() => {
                onDeleteSeason(managedSeason.id);
                setAdminBanner(`Monat ${managedSeason.label} gelöscht.`);
              }}
              className="min-h-[40px] px-3.5 rounded-2xl bg-rose-500/15 text-rose-300 text-xs font-black cursor-pointer"
            >
              {managedSeason.shortLabel} löschen
            </button>
          )}
        </div>

        <div className="p-3 rounded-2xl bg-[#090B0F] space-y-2">
          <p className="text-xs font-bold text-slate-300">
            Monatsabschluss-Check auf Home:
          </p>
          <div className="grid grid-cols-3 gap-1.5">
            {[
              { id: 'auto', label: 'Auto (ab 26.)' },
              { id: 'show', label: 'Einblenden' },
              { id: 'hide', label: 'Ausblenden' },
            ].map(opt => (
              <button
                key={opt.id}
                type="button"
                onClick={() => onChangeMonthEndMode(opt.id)}
                className={`min-h-[36px] rounded-xl text-xs font-black cursor-pointer ${
                  monthEndMode === opt.id
                    ? 'bg-amber-400 text-slate-950'
                    : 'bg-[#12151C] text-slate-300'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* LIGEN & MATCHES VERWALTEN */}
      <section className="rounded-3xl bg-[#12151C] border border-white/[0.08] p-4 sm:p-5 space-y-3.5">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-base font-black text-white">Ligen & Matches</h2>
          <select
            value={managedSeason?.id || ''}
            onChange={e => setManageSeasonId(e.target.value)}
            className="min-h-[38px] px-3 rounded-xl bg-[#090B0F] border border-white/10 text-xs font-black text-white"
          >
            {seasons.map(s => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        {/* NICHT ZUGETEILTE AKTIVE SPIELER HINZUFÜGEN */}
        {unassignedActiveMembers.length > 0 && managedSeason && (
          <div className="p-3 rounded-2xl bg-sky-400/10 border border-sky-400/30 space-y-2">
            <p className="text-xs font-black text-sky-300">
              Nicht zugeteilte Spieler in {managedSeason.shortLabel}:
            </p>
            {unassignedActiveMembers.map(m => {
              const selectedLvl =
                addLeagueChoice[m.id] ||
                managedSeason.groups[managedSeason.groups.length - 1]?.level ||
                1;
              return (
                <div
                  key={m.id}
                  className="flex items-center justify-between gap-2 text-xs"
                >
                  <span className="font-bold text-white">{m.nickname}</span>
                  <div className="flex items-center gap-1.5">
                    <select
                      value={selectedLvl}
                      onChange={e =>
                        setAddLeagueChoice(prev => ({
                          ...prev,
                          [m.id]: Number(e.target.value),
                        }))
                      }
                      className="min-h-[34px] px-2.5 rounded-xl bg-[#090B0F] border border-white/10 text-xs text-white"
                    >
                      {managedSeason.groups.map(g => (
                        <option key={g.level} value={g.level}>
                          {g.name}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => {
                        onAddPlayerToLeague(
                          managedSeason.id,
                          Number(selectedLvl),
                          m.id
                        );
                        setAdminBanner(
                          `${m.nickname} der ${selectedLvl}. Liga hinzugefügt.`
                        );
                      }}
                      className="min-h-[34px] px-3 rounded-xl bg-sky-400 text-slate-950 font-black cursor-pointer"
                    >
                      + Hinzufügen
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {(managedSeason?.groups || []).map(group => (
          <div
            key={group.level}
            className="p-3.5 rounded-2xl bg-[#090B0F] border border-white/[0.06] space-y-2.5"
          >
            <h3 className="text-xs font-black text-[#34D399]">{group.name}</h3>
            <div className="space-y-1.5">
              {group.playerIds.map(pid => {
                const m = membersMap[pid];
                if (!m) return null;
                return (
                  <div
                    key={pid}
                    className="flex items-center justify-between gap-2 text-xs"
                  >
                    <span className="font-bold text-white">{m.nickname}</span>
                    <div className="flex items-center gap-1.5">
                      {managedSeason.groups.length > 1 && (
                        <select
                          value={group.level}
                          onChange={e =>
                            onMovePlayerLeague(
                              managedSeason.id,
                              pid,
                              Number(e.target.value)
                            )
                          }
                          className="min-h-[30px] px-2 rounded-lg bg-[#12151C] text-[11px] text-slate-300"
                        >
                          {managedSeason.groups.map(g => (
                            <option key={g.level} value={g.level}>
                              {g.name}
                            </option>
                          ))}
                        </select>
                      )}
                      <button
                        type="button"
                        onClick={() =>
                          onRemovePlayerFromLeague(
                            managedSeason.id,
                            group.level,
                            pid
                          )
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

            {/* MATCH-RESET */}
            <div className="pt-2 border-t border-white/[0.06] space-y-1">
              {group.matches
                .filter(m => m.setsP1 !== null && m.setsP2 !== null)
                .map(m => {
                  const p1 = membersMap[m.player1Id];
                  const p2 = membersMap[m.player2Id];
                  if (!p1 || !p2) return null;
                  return (
                    <div
                      key={m.id}
                      className="flex items-center justify-between text-[11px] text-slate-400"
                    >
                      <span>
                        {p1.nickname} {m.setsP1}:{m.setsP2} {p2.nickname}
                      </span>
                      <button
                        type="button"
                        onClick={() => onAdminUpdateMatch(m.id, null, null)}
                        className="text-amber-300 font-bold cursor-pointer"
                      >
                        Zurücksetzen
                      </button>
                    </div>
                  );
                })}
            </div>
          </div>
        ))}
      </section>

      {/* MITGLIEDERSTATUS & LÖSCHEN */}
      <section className="rounded-3xl bg-[#12151C] border border-white/[0.08] p-4 sm:p-5 space-y-3">
        <h2 className="text-base font-black text-white">
          Mitgliederstatus & Folgemonat ({Object.keys(membersMap).length})
        </h2>
        <div className="space-y-2">
          {Object.values(membersMap).map(m => (
            <div
              key={m.id}
              className="p-3 rounded-2xl bg-[#090B0F] flex flex-wrap items-center justify-between gap-2 text-xs"
            >
              <div>
                <p className="font-black text-white">{m.nickname}</p>
                <p className="text-[11px] text-slate-400">
                  PIN: {m.pin} · {m.status}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                <select
                  value={m.status}
                  onChange={e => onUpdateMemberStatus(m.id, e.target.value)}
                  className="min-h-[34px] px-2.5 rounded-xl bg-[#12151C] border border-white/10 text-xs text-white"
                >
                  <option value="Dabei">Dabei</option>
                  <option value="Pausiert">Pausiert</option>
                  <option value="Offen">Offen</option>
                </select>

                <button
                  type="button"
                  onClick={() => onToggleMemberNextMonth(m.id)}
                  className={`min-h-[34px] px-2.5 rounded-xl text-[11px] font-black cursor-pointer ${
                    m.nextMonthOptIn
                      ? 'bg-[#10B981]/20 text-[#34D399]'
                      : 'bg-white/5 text-slate-400'
                  }`}
                >
                  {m.nextMonthOptIn ? 'Folgemonat ✓' : 'Folgemonat –'}
                </button>

                {confirmDeleteMemberId === m.id ? (
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        onDeleteMember(m.id);
                        setConfirmDeleteMemberId(null);
                        setAdminBanner(`Mitglied ${m.nickname} gelöscht.`);
                      }}
                      className="min-h-[34px] px-2.5 rounded-xl bg-rose-500 text-white text-[11px] font-black cursor-pointer"
                    >
                      Endgültig löschen
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteMemberId(null)}
                      className="min-h-[34px] px-2 rounded-xl bg-white/10 text-slate-300 text-[11px] cursor-pointer"
                    >
                      Abbrechen
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmDeleteMemberId(m.id)}
                    className="min-h-[34px] px-2.5 rounded-xl bg-rose-500/15 text-rose-300 text-[11px] font-bold cursor-pointer"
                  >
                    Löschen
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ADMIN-PIN ÄNDERN & DEMO-RESET */}
      <section className="rounded-3xl bg-[#12151C] border border-white/[0.08] p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-black text-white">Admin-PIN ändern</h2>
          <span className="text-xs font-bold text-amber-300">
            Aktiv: {adminPin}
          </span>
        </div>
        <form onSubmit={handleChangePin} className="flex gap-2">
          <input
            type="text"
            inputMode="numeric"
            value={newPinInput}
            onChange={e => setNewPinInput(e.target.value)}
            placeholder="Neuer Admin-PIN (min. 4 Zeichen)"
            className="flex-1 min-h-[42px] px-3 rounded-xl bg-[#090B0F] border border-white/10 text-xs text-white"
          />
          <button
            type="submit"
            className="min-h-[42px] px-4 rounded-xl bg-amber-400 text-slate-950 text-xs font-black shrink-0 cursor-pointer"
          >
            PIN überschreiben
          </button>
        </form>
        {pinSavedMsg && (
          <p className="text-xs font-bold text-[#34D399]">{pinSavedMsg}</p>
        )}

        <div className="pt-2 border-t border-white/[0.07]">
          <button
            type="button"
            onClick={() => {
              onResetDemoData();
              setAdminBanner('Demo-Daten wurden zurückgesetzt.');
            }}
            className="min-h-[38px] px-3.5 rounded-xl bg-white/5 text-xs font-bold text-slate-400 cursor-pointer"
          >
            Demo-Daten zurücksetzen
          </button>
        </div>
      </section>
    </div>
  );
}

// ============================================================================
// MODALS (PIN-LOGIN, RESULTAT, STAMMDATEN, NEW PLAYER, LIVE-CHECKIN, PROFIL)
// ============================================================================
function PlayerPinLoginModal({ member, onSuccess, onClose }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    if (pin.trim() === String(member.pin || '1111')) {
      onSuccess(member.id);
      onClose();
    } else {
      setError('Falscher Spieler-PIN.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-3">
      <div className="w-full max-w-sm rounded-3xl bg-[#12151C] border border-white/10 p-5 space-y-4">
        <div>
          <h3 className="text-base font-black text-white">
            Profil wechseln · {member.nickname}
          </h3>
          <p className="text-xs text-slate-400">
            Demo-PIN für {member.nickname}:{' '}
            <span className="font-black text-[#34D399]">{member.pin}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="password"
            inputMode="numeric"
            autoFocus
            value={pin}
            onChange={e => setPin(e.target.value)}
            placeholder="4-stelligen PIN eingeben"
            className="w-full min-h-[44px] px-3.5 rounded-2xl bg-[#090B0F] border border-white/10 text-sm text-white"
          />
          {error && <p className="text-xs text-rose-400 font-bold">{error}</p>}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 min-h-[42px] rounded-2xl bg-white/5 text-xs font-bold text-slate-300 cursor-pointer"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              className="flex-1 min-h-[42px] rounded-2xl bg-[#10B981] text-slate-950 text-xs font-black cursor-pointer"
            >
              Anmelden
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
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-3">
      <div className="w-full max-w-sm rounded-3xl bg-[#12151C] border border-white/10 p-5 space-y-4">
        <div>
          <h3 className="text-base font-black text-white">Resultat eintragen</h3>
          <p className="text-xs text-slate-400">
            {p1.nickname} vs. {p2.nickname} (Best of 5 Sätze)
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {presets.map(([s1, s2]) => {
            const active = setsP1 === s1 && setsP2 === s2;
            return (
              <button
                key={`${s1}-${s2}`}
                type="button"
                onClick={() => {
                  setSetsP1(s1);
                  setSetsP2(s2);
                }}
                className={`min-h-[44px] rounded-2xl text-sm font-black cursor-pointer ${
                  active
                    ? 'bg-[#10B981] text-slate-950'
                    : 'bg-[#090B0F] border border-white/10 text-white'
                }`}
              >
                {s1} : {s2}
              </button>
            );
          })}
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 min-h-[42px] rounded-2xl bg-white/5 text-xs font-bold text-slate-300 cursor-pointer"
          >
            Abbrechen
          </button>
          <button
            type="button"
            onClick={() => {
              onSaveResult(match.id, setsP1, setsP2);
              onClose();
            }}
            className="flex-1 min-h-[42px] rounded-2xl bg-[#10B981] text-slate-950 text-xs font-black cursor-pointer"
          >
            Speichern ({setsP1}:{setsP2})
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
  initialEditing,
  onClose,
  onUpdateProfile,
}) {
  const [editing, setEditing] = useState(Boolean(initialEditing));
  const [playMode, setPlayMode] = useState(
    isConnectOnlyMember(member, activeSeason) ? 'connect' : 'league'
  );
  const [whatsapp, setWhatsapp] = useState(member.whatsapp || '');
  const [style, setStyle] = useState(member.style || PLAY_STYLES[0]);
  const [bio, setBio] = useState(member.bio || '');
  const [pin, setPin] = useState(member.pin || '1111');
  const [usualDays, setUsualDays] = useState(member.usualDays || []);
  const [usualSlots, setUsualSlots] = useState(member.usualSlots || []);
  const [langDe, setLangDe] = useState(
    (member.language || '').includes('Deutsch')
  );
  const [langEn, setLangEn] = useState(
    (member.language || '').includes('English')
  );

  const group = activeSeason?.groups.find(g =>
    g.playerIds.includes(member.id)
  );
  const waUrl = buildWhatsAppUrl(
    member.whatsapp,
    `Hoi ${member.nickname}, wollen wir zusammen Tischtennis spielen?`
  );

  const toggleItem = (list, setList, item) => {
    setList(prev =>
      prev.includes(item) ? prev.filter(x => x !== item) : [...prev, item]
    );
  };

  const handleSave = e => {
    e.preventDefault();
    const langs = [];
    if (langDe) langs.push('Deutsch');
    if (langEn) langs.push('English');
    onUpdateProfile(member.id, {
      playMode,
      status:
        playMode === 'connect'
          ? 'Pausiert'
          : member.status === 'Pausiert'
          ? 'Offen'
          : member.status,
      nextMonthOptIn: playMode === 'connect' ? false : member.nextMonthOptIn,
      whatsapp: whatsapp.trim(),
      style,
      bio: bio.trim(),
      pin: pin.trim().length >= 4 ? pin.trim() : member.pin,
      usualDays,
      usualSlots,
      language: langs.join(' / ') || 'Deutsch',
    });
    setEditing(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-3 overflow-y-auto">
      <div className="w-full max-w-md rounded-3xl bg-[#12151C] border border-white/10 p-5 space-y-4 my-auto">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${member.avatarBg} flex items-center justify-center text-white font-black text-sm`}
            >
              {member.nickname.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h3 className="text-base font-black text-white">{member.nickname}</h3>
              <p className="text-xs text-slate-400">
                {member.firstName} {member.lastName} ·{' '}
                {group ? group.name : isConnectOnlyMember(member, activeSeason) ? 'Nur CONNECT' : 'LEAGUE'}
              </p>
            </div>
          </div>

          {isOwnProfile && !editing && (
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="min-h-[36px] px-3 rounded-xl bg-[#10B981] text-slate-950 text-xs font-black cursor-pointer"
            >
              Bearbeiten
            </button>
          )}
        </div>

        {!editing ? (
          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-2xl bg-[#090B0F] space-y-1.5">
              <div className="flex items-center justify-between pb-1.5 mb-1 border-b border-white/[0.06]">
                <span className="text-slate-400 font-bold">Modus:</span>
                {isConnectOnlyMember(member, activeSeason) ? (
                  <span className="px-2.5 py-0.5 rounded-lg bg-sky-400/15 text-sky-300 font-black">
                    Nur CONNECT (ohne Liga)
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-lg bg-[#10B981]/15 text-[#34D399] font-black">
                    LEAGUE + CONNECT
                  </span>
                )}
              </div>
              <p className="text-slate-300">{member.bio || 'Kein Profiltext.'}</p>
              <p className="text-slate-400">
                <strong className="text-white">Spielstil:</strong> {member.style}
              </p>
              <p className="text-slate-400">
                <strong className="text-white">Sprachen:</strong> {member.language}
              </p>
              <p className="text-slate-400">
                <strong className="text-white">Hallentage:</strong>{' '}
                {(member.usualDays || []).join(', ') || 'Flexibel'} (
                {(member.usualSlots || []).join(', ') || 'Nach Absprache'})
              </p>
            </div>

            <div className="flex gap-2">
              {waUrl && (
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 min-h-[42px] rounded-2xl bg-[#25D366] text-slate-950 font-black flex items-center justify-center gap-1.5"
                >
                  <KlMessageIcon className="w-4 h-4" />
                  <span>WhatsApp</span>
                </a>
              )}
              <button
                type="button"
                onClick={onClose}
                className="flex-1 min-h-[42px] rounded-2xl bg-white/10 text-white font-bold cursor-pointer"
              >
                Schliessen
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-3 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1">
                Spielmodus im Club
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPlayMode('league')}
                  className={`p-2.5 rounded-xl border text-left cursor-pointer ${
                    playMode === 'league'
                      ? 'bg-[#10B981]/15 border-[#10B981] text-white'
                      : 'bg-[#090B0F] border-white/10 text-slate-400'
                  }`}
                >
                  <p className="font-black text-xs text-[#34D399]">LEAGUE + CONNECT</p>
                  <p className="text-[10px]">Monatsliga + Pinnwand</p>
                </button>
                <button
                  type="button"
                  onClick={() => setPlayMode('connect')}
                  className={`p-2.5 rounded-xl border text-left cursor-pointer ${
                    playMode === 'connect'
                      ? 'bg-sky-400/15 border-sky-400 text-white'
                      : 'bg-[#090B0F] border-white/10 text-slate-400'
                  }`}
                >
                  <p className="font-black text-xs text-sky-300">Nur CONNECT</p>
                  <p className="text-[10px]">Ohne Ligabetrieb</p>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1">
                WhatsApp (CH)
              </label>
              <input
                type="tel"
                value={whatsapp}
                onChange={e => setWhatsapp(e.target.value)}
                placeholder="+41 79 123 45 67"
                className="w-full min-h-[40px] px-3 rounded-xl bg-[#090B0F] border border-white/10 text-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1">
                Übliche Hallentage
              </label>
              <div className="flex flex-wrap gap-1.5">
                {WEEKDAYS.map(day => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleItem(usualDays, setUsualDays, day)}
                    className={`min-h-[32px] px-2.5 rounded-xl font-black cursor-pointer ${
                      usualDays.includes(day)
                        ? 'bg-[#10B981] text-slate-950'
                        : 'bg-[#090B0F] text-slate-400'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1">
                Tageszeiten
              </label>
              <div className="flex flex-wrap gap-1.5">
                {TIME_SLOTS.map(slot => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => toggleItem(usualSlots, setUsualSlots, slot)}
                    className={`min-h-[32px] px-3 rounded-xl font-black cursor-pointer ${
                      usualSlots.includes(slot)
                        ? 'bg-sky-400 text-slate-950'
                        : 'bg-[#090B0F] text-slate-400'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">
                  Spielstil
                </label>
                <select
                  value={style}
                  onChange={e => setStyle(e.target.value)}
                  className="w-full min-h-[40px] px-2.5 rounded-xl bg-[#090B0F] border border-white/10 text-white"
                >
                  {PLAY_STYLES.map(s => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">
                  Spieler-PIN
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={pin}
                  onChange={e => setPin(e.target.value)}
                  className="w-full min-h-[40px] px-3 rounded-xl bg-[#090B0F] border border-white/10 text-white"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <label className="inline-flex items-center gap-2 text-slate-200 font-bold cursor-pointer">
                <input
                  type="checkbox"
                  checked={langDe}
                  onChange={e => setLangDe(e.target.checked)}
                />
                <span>Deutsch (DE)</span>
              </label>
              <label className="inline-flex items-center gap-2 text-slate-200 font-bold cursor-pointer">
                <input
                  type="checkbox"
                  checked={langEn}
                  onChange={e => setLangEn(e.target.checked)}
                />
                <span>English (EN)</span>
              </label>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1">
                Kurzinfo
              </label>
              <input
                type="text"
                value={bio}
                onChange={e => setBio(e.target.value)}
                className="w-full min-h-[40px] px-3 rounded-xl bg-[#090B0F] border border-white/10 text-white"
              />
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="flex-1 min-h-[42px] rounded-2xl bg-white/5 font-bold text-slate-300 cursor-pointer"
              >
                Abbrechen
              </button>
              <button
                type="submit"
                className="flex-1 min-h-[42px] rounded-2xl bg-[#10B981] text-slate-950 font-black cursor-pointer"
              >
                Speichern
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function AddMemberModal({ onClose, onAddMember }) {
  const [playMode, setPlayMode] = useState('league');
  const [nickname, setNickname] = useState('');
  const [pin, setPin] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [whatsapp, setWhatsapp] = useState('+41 ');
  const [langDe, setLangDe] = useState(true);
  const [langEn, setLangEn] = useState(false);
  const [style, setStyle] = useState(PLAY_STYLES[0]);
  const [nextMonthOptIn, setNextMonthOptIn] = useState(true);
  const [error, setError] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    if (!nickname.trim()) {
      setError('Bitte einen Nickname eingeben.');
      return;
    }
    if (pin.trim().length < 4) {
      setError('Bitte einen persönlichen PIN mit mindestens 4 Zeichen wählen.');
      return;
    }
    const langs = [];
    if (langDe) langs.push('Deutsch');
    if (langEn) langs.push('English');

    onAddMember({
      playMode,
      nickname: nickname.trim(),
      pin: pin.trim(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      whatsapp: whatsapp.trim(),
      language: langs.join(' / ') || 'Deutsch',
      style,
      nextMonthOptIn,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-3 overflow-y-auto">
      <div className="w-full max-w-md rounded-3xl bg-[#12151C] border border-white/10 p-5 space-y-4 my-auto">
        <div>
          <h3 className="text-base font-black text-white">NEW PLAYER</h3>
          <p className="text-xs text-slate-400">
            Neues Clubprofil anlegen
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          {/* ENTSCHEIDUNG: LEAGUE + CONNECT ODER NUR CONNECT */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setPlayMode('league')}
              className={`p-3 rounded-2xl border text-left cursor-pointer ${
                playMode === 'league'
                  ? 'bg-[#10B981]/15 border-[#10B981] text-white'
                  : 'bg-[#090B0F] border-white/10 text-slate-400'
              }`}
            >
              <p className="font-black text-xs text-[#34D399]">LEAGUE + CONNECT</p>
              <p className="text-[11px] mt-0.5">Monatsliga + Pinnwand</p>
            </button>
            <button
              type="button"
              onClick={() => setPlayMode('connect')}
              className={`p-3 rounded-2xl border text-left cursor-pointer ${
                playMode === 'connect'
                  ? 'bg-sky-400/15 border-sky-400 text-white'
                  : 'bg-[#090B0F] border-white/10 text-slate-400'
              }`}
            >
              <p className="font-black text-xs text-sky-300">Nur CONNECT</p>
              <p className="text-[11px] mt-0.5">Freies Spielen ohne Liga</p>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1">
                Nickname *
              </label>
              <input
                type="text"
                required
                value={nickname}
                onChange={e => setNickname(e.target.value)}
                placeholder="z.B. SpinMaster"
                className="w-full min-h-[40px] px-3 rounded-xl bg-[#090B0F] border border-white/10 text-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1">
                Persönlicher PIN *
              </label>
              <input
                type="text"
                inputMode="numeric"
                required
                value={pin}
                onChange={e => setPin(e.target.value)}
                placeholder="min. 4 Ziffern"
                className="w-full min-h-[40px] px-3 rounded-xl bg-[#090B0F] border border-white/10 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1">
                Vorname
              </label>
              <input
                type="text"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                className="w-full min-h-[40px] px-3 rounded-xl bg-[#090B0F] border border-white/10 text-white"
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
                className="w-full min-h-[40px] px-3 rounded-xl bg-[#090B0F] border border-white/10 text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 mb-1">
              WhatsApp (Schweiz +41)
            </label>
            <input
              type="tel"
              value={whatsapp}
              onChange={e => setWhatsapp(e.target.value)}
              placeholder="+41 79 123 45 67"
              className="w-full min-h-[40px] px-3 rounded-xl bg-[#090B0F] border border-white/10 text-white"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 mb-1">
              Gesprochene Sprachen
            </label>
            <div className="flex items-center gap-4 p-2.5 rounded-xl bg-[#090B0F] border border-white/10">
              <label className="inline-flex items-center gap-2 text-slate-200 font-bold cursor-pointer">
                <input
                  type="checkbox"
                  checked={langDe}
                  onChange={e => setLangDe(e.target.checked)}
                />
                <span>Deutsch (DE)</span>
              </label>
              <label className="inline-flex items-center gap-2 text-slate-200 font-bold cursor-pointer">
                <input
                  type="checkbox"
                  checked={langEn}
                  onChange={e => setLangEn(e.target.checked)}
                />
                <span>English (EN)</span>
              </label>
            </div>
          </div>

          {playMode === 'league' && (
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setNextMonthOptIn(true)}
                className={`min-h-[38px] rounded-xl font-black cursor-pointer ${
                  nextMonthOptIn
                    ? 'bg-[#10B981] text-slate-950'
                    : 'bg-[#090B0F] text-slate-400'
                }`}
              >
                Direkt starten
              </button>
              <button
                type="button"
                onClick={() => setNextMonthOptIn(false)}
                className={`min-h-[38px] rounded-xl font-black cursor-pointer ${
                  !nextMonthOptIn
                    ? 'bg-amber-400 text-slate-950'
                    : 'bg-[#090B0F] text-slate-400'
                }`}
              >
                Noch warten
              </button>
            </div>
          )}

          {error && <p className="text-xs text-rose-400 font-bold">{error}</p>}

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 min-h-[42px] rounded-2xl bg-white/5 font-bold text-slate-300 cursor-pointer"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              className="flex-1 min-h-[42px] rounded-2xl bg-[#10B981] text-slate-950 font-black cursor-pointer"
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
  const liveMembers = Object.values(membersMap).filter(m =>
    isMemberCheckedIn(m, nowTick)
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-3">
      <div className="w-full max-w-sm rounded-3xl bg-[#12151C] border border-white/10 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-white">
              LIVE in der Halle ({liveMembers.length})
            </h3>
            <p className="text-xs text-slate-400">
              Schneller Check-in vor Ort
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              onClose();
              onGoToHallTab();
            }}
            className="text-xs font-black text-[#34D399] cursor-pointer"
          >
            Alle ansehen →
          </button>
        </div>

        {!currentUser ? (
          <div className="space-y-2">
            <p className="text-xs text-slate-300">Wähle zuerst dein Profil:</p>
            <div className="flex flex-wrap gap-1.5">
              {Object.values(membersMap).map(m => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    onClose();
                    onRequestSelectUser(m.id);
                  }}
                  className="min-h-[36px] px-3 rounded-xl bg-[#090B0F] border border-white/10 text-xs font-bold text-white cursor-pointer"
                >
                  {m.nickname}
                </button>
              ))}
            </div>
          </div>
        ) : isMemberCheckedIn(currentUser, nowTick) ? (
          <button
            type="button"
            onClick={() => {
              onCheckOut(currentUser.id);
              onClose();
            }}
            className="w-full min-h-[44px] rounded-2xl bg-rose-500 text-white text-xs font-black cursor-pointer"
          >
            Jetzt auschecken (CHECK-OUT)
          </button>
        ) : (
          <div className="space-y-3">
            <div className="grid grid-cols-4 gap-1.5">
              {[60, 90, 120, 180].map(m => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMinutes(m)}
                  className={`min-h-[38px] rounded-xl text-xs font-black cursor-pointer ${
                    minutes === m
                      ? 'bg-[#10B981] text-slate-950'
                      : 'bg-[#090B0F] text-slate-300'
                  }`}
                >
                  {m >= 60 ? `${m / 60}h` : `${m}m`}
                </button>
              ))}
            </div>
            <select
              value={mood}
              onChange={e => setMood(e.target.value)}
              className="w-full min-h-[42px] px-3 rounded-xl bg-[#090B0F] border border-white/10 text-xs font-bold text-white"
            >
              {CHECKIN_MOODS.map(item => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => {
                onCheckIn(currentUser.id, minutes, mood);
                onClose();
              }}
              className="w-full min-h-[44px] rounded-2xl bg-[#10B981] text-slate-950 text-xs font-black cursor-pointer"
            >
              Jetzt einchecken
            </button>
          </div>
        )}

        <button
          type="button"
          onClick={onClose}
          className="w-full min-h-[40px] rounded-2xl bg-white/5 text-xs font-bold text-slate-400 cursor-pointer"
        >
          Schliessen
        </button>
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
  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-3 overflow-y-auto">
      <div className="w-full max-w-sm rounded-3xl bg-[#12151C] border border-white/10 p-5 space-y-4 my-auto">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-black text-white">Spielerprofil</h3>
            <p className="text-xs text-slate-400">
              Profil wechseln oder neu registrieren
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenAddMember();
            }}
            className="min-h-[36px] px-3 rounded-xl bg-[#10B981] text-slate-950 text-xs font-black cursor-pointer"
          >
            + NEW PLAYER
          </button>
        </div>

        {currentUser && (
          <div className="p-3 rounded-2xl bg-[#090B0F] border border-[#10B981]/30 flex items-center justify-between gap-2">
            <div>
              <p className="text-xs font-black text-white">
                Aktiv: {currentUser.nickname}
              </p>
              <p className="text-[11px] text-slate-400">
                Stammdaten & Hallentage bearbeiten
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenOwnDetails(currentUser.id);
              }}
              className="min-h-[34px] px-3 rounded-xl bg-white/10 text-xs font-black text-white cursor-pointer"
            >
              Öffnen
            </button>
          </div>
        )}

        <div className="space-y-1.5 max-h-60 overflow-y-auto">
          {Object.values(membersMap).map(m => {
            const group = activeSeason?.groups.find(g =>
              g.playerIds.includes(m.id)
            );
            const active = currentUser?.id === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => {
                  onClose();
                  if (!active) onRequestSelectUser(m.id);
                }}
                className={`w-full p-2.5 rounded-2xl flex items-center justify-between text-left cursor-pointer ${
                  active
                    ? 'bg-[#10B981]/15 border border-[#10B981]/40'
                    : 'bg-[#090B0F] border border-white/[0.05]'
                }`}
              >
                <span className="text-xs font-black text-white">{m.nickname}</span>
                <span className="text-[11px] text-slate-400">
                  {group ? group.name : 'CONNECT'} · PIN {m.pin}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex gap-2">
          {currentUser && (
            <button
              type="button"
              onClick={() => {
                onClearUser();
                onClose();
              }}
              className="flex-1 min-h-[40px] rounded-2xl bg-rose-500/15 text-rose-300 text-xs font-bold cursor-pointer"
            >
              Abmelden
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="flex-1 min-h-[40px] rounded-2xl bg-white/10 text-xs font-bold text-white cursor-pointer"
          >
            Schliessen
          </button>
        </div>
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
  const [meetupPosts, setMeetupPosts] = useState(INITIAL_MEETUP_POSTS);
  const [hallAnnouncements, setHallAnnouncements] = useState(
    INITIAL_HALL_ANNOUNCEMENTS
  );
  const [selectedSeasonId, setSelectedSeasonId] = useState('2026-11');
  const [currentUserId, setCurrentUserId] = useState('m1');
  const [appWorld, setAppWorld] = useState('league');
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

  const isCurrentUserConnectOnly = useMemo(
    () => isConnectOnlyMember(currentUser, activeSeason),
    [currentUser, activeSeason]
  );

  useEffect(() => {
    if (isCurrentUserConnectOnly && appWorld === 'league') {
      setAppWorld('connect');
      if (!['board', 'announcements', 'schedule', 'hall', 'players', 'admin'].includes(activeTab)) {
        setActiveTab('board');
      }
    }
  }, [isCurrentUserConnectOnly, appWorld, activeTab]);

  const nextMonthInfo = useMemo(() => {
    const latest = seasons[seasons.length - 1];
    return getNextMonthInfo(latest?.id || activeSeason?.id);
  }, [seasons, activeSeason]);

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
    setHallAnnouncements(prev => prev.filter(a => a.memberId !== memberId));
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
    if (!currentUserId) return;
    handleToggleMemberNextMonth(currentUserId);
  };

  const handleSaveMatchResult = (matchId, setsP1, setsP2) => {
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
                  playedAt:
                    setsP1 === null || setsP2 === null
                      ? null
                      : new Date().toISOString().slice(0, 10),
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
        [memberId]: {
          ...m,
          ...updates,
        },
      };
    });
    if (memberId === currentUserId && updates.playMode === 'connect') {
      setAppWorld('connect');
      setActiveTab('board');
    }
  };

  const handleAddMember = data => {
    const newId = `m_${Date.now()}`;
    const isConnectOnly = data.playMode === 'connect';
    const gradients = [
      'from-emerald-500 to-teal-700',
      'from-sky-500 to-indigo-700',
      'from-amber-500 to-orange-700',
      'from-purple-500 to-fuchsia-700',
      'from-rose-500 to-pink-700',
    ];
    const avatarBg = gradients[Object.keys(membersMap).length % gradients.length];

    const newMember = {
      id: newId,
      playMode: isConnectOnly ? 'connect' : 'league',
      nickname: data.nickname,
      firstName: data.firstName,
      lastName: data.lastName,
      pin: data.pin,
      whatsapp: data.whatsapp,
      language: data.language,
      style: data.style,
      bio: isConnectOnly ? 'Nur CONNECT · Pinnwand & Training' : 'Neues Clubmitglied',
      status: isConnectOnly ? 'Pausiert' : 'Offen',
      nextMonthOptIn: isConnectOnly ? false : Boolean(data.nextMonthOptIn),
      usualDays: [],
      usualSlots: [],
      annualPoints: 0,
      seasonTitles: 0,
      avatarBg,
      checkedInUntil: null,
      checkInMood: '',
    };

    setMembersMap(prev => ({ ...prev, [newId]: newMember }));
    setCurrentUserId(newId);
    if (isConnectOnly) {
      setAppWorld('connect');
      setActiveTab('board');
    }
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
        },
      };
    });
  };

  const handleDirectEntryMember = memberId => {
    handleApproveMember(memberId);
    if (activeSeason && activeSeason.groups.length > 0) {
      const lowestGroup = activeSeason.groups[activeSeason.groups.length - 1];
      handleAddPlayerToLeague(activeSeason.id, lowestGroup.level, memberId);
    }
  };

  const handleSaveHallAnnouncement = (memberId, { dayLabel, timeText, note }) => {
    setHallAnnouncements(prev => {
      const existing = prev.find(a => a.memberId === memberId);
      if (existing) {
        return prev.map(a =>
          a.memberId === memberId
            ? { ...a, dayLabel, timeText, note }
            : a
        );
      }
      return [
        {
          id: `ann_${Date.now()}`,
          memberId,
          dayLabel,
          timeText,
          note,
          meTooIds: [],
          createdAt: Date.now(),
        },
        ...prev,
      ];
    });
  };

  const handleDeleteHallAnnouncement = memberId => {
    setHallAnnouncements(prev => prev.filter(a => a.memberId !== memberId));
  };

  const handleToggleAnnouncementMeToo = (annId, memberId) => {
    setHallAnnouncements(prev =>
      prev.map(ann => {
        if (ann.id !== annId) return ann;
        const list = ann.meTooIds || [];
        const has = list.includes(memberId);
        return {
          ...ann,
          meTooIds: has
            ? list.filter(id => id !== memberId)
            : [...list, memberId],
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
    if (currentUserId === memberId) setCurrentUserId('');
    if (profileModalState?.memberId === memberId) setProfileModalState(null);
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

  const handleAddPlayerToLeague = (seasonId, level, playerId) => {
    setSeasons(prev =>
      prev.map(season => {
        if (season.id !== seasonId) return season;
        return {
          ...season,
          groups: season.groups.map(g => {
            if (g.level !== level || g.playerIds.includes(playerId)) return g;
            const newMatches = g.playerIds.map(existingId => ({
              id: `${season.id}_L${g.level}_${existingId}_${playerId}`,
              seasonId: season.id,
              leagueLevel: g.level,
              player1Id: existingId,
              player2Id: playerId,
              setsP1: null,
              setsP2: null,
              playedAt: null,
            }));
            return {
              ...g,
              playerIds: [...g.playerIds, playerId],
              matches: [...g.matches, ...newMatches],
            };
          }),
        };
      })
    );
  };

  const handleCreateNextMonth = () => {
    const monthNames = [
      'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
      'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember',
    ];
    const shortNames = [
      'Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun',
      'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez',
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
    setMeetupPosts(INITIAL_MEETUP_POSTS);
    setHallAnnouncements(INITIAL_HALL_ANNOUNCEMENTS);
    setSelectedSeasonId('2026-11');
    setCurrentUserId('m1');
    setMonthEndMode('auto');
  };

  const handleCreateMeetupPost = ({ authorId, whenText, mode, note }) => {
    const newPost = {
      id: `post_${Date.now()}`,
      authorId,
      whenText,
      mode,
      note,
      joinedIds: [],
      createdAt: Date.now(),
    };
    setMeetupPosts(prev => [newPost, ...prev]);
  };

  const handleToggleJoinMeetupPost = (postId, memberId) => {
    setMeetupPosts(prev =>
      prev.map(post => {
        if (post.id !== postId) return post;
        const already = post.joinedIds.includes(memberId);
        if (already) {
          return {
            ...post,
            joinedIds: post.joinedIds.filter(id => id !== memberId),
          };
        }
        const isSingles = !post.mode.toLowerCase().includes('doppel');
        const maxPlayers = isSingles ? 1 : 3;
        if (post.joinedIds.length >= maxPlayers) return post;
        return {
          ...post,
          joinedIds: [...post.joinedIds, memberId],
        };
      })
    );
  };

  const handleDeleteMeetupPost = postId => {
    setMeetupPosts(prev => prev.filter(post => post.id !== postId));
  };

  const handleToggleUserDay = (memberId, day) => {
    setMembersMap(prev => {
      const m = prev[memberId];
      if (!m) return prev;
      const currentDays = m.usualDays || [];
      const nextDays = currentDays.includes(day)
        ? currentDays.filter(d => d !== day)
        : [...currentDays, day];
      return {
        ...prev,
        [memberId]: {
          ...m,
          usualDays: nextDays,
        },
      };
    });
  };

  const leagueTabs = [
    { id: 'home', label: 'Home', Icon: KlHomeIcon },
    { id: 'leagues', label: 'Liga', Icon: KlTrophyIcon },
    { id: 'nextmonth', label: nextMonthInfo.monthName, Icon: KlCalendarIcon },
    { id: 'recent', label: 'Spiele', Icon: KlHistoryIcon },
    { id: 'annual', label: 'Rangliste', Icon: KlAwardIcon },
    { id: 'players', label: 'Spieler', Icon: KlUsersIcon },
  ];

  const connectTabs = [
    { id: 'board', label: 'Pinnwand', Icon: KlHandshakeIcon, badge: meetupPosts.length },
    {
      id: 'announcements',
      label: 'Vorankündigungen',
      Icon: KlHistoryIcon,
      badge: hallAnnouncements.length,
    },
    { id: 'schedule', label: 'Hallentage', Icon: KlCalendarIcon },
    {
      id: 'hall',
      label: 'LIVE',
      Icon: KlMapPinIcon,
      badge: liveCount,
    },
    { id: 'players', label: 'Club-Spieler', Icon: KlUsersIcon },
  ];

  const activeWorldTabs = appWorld === 'connect' ? connectTabs : leagueTabs;

  const mobileBottomTabs =
    appWorld === 'connect'
      ? [
          { id: 'board', label: 'Pinnwand', Icon: KlHandshakeIcon, badge: meetupPosts.length },
          {
            id: 'announcements',
            label: 'Ankündigen',
            Icon: KlHistoryIcon,
            badge: hallAnnouncements.length,
          },
          { id: 'schedule', label: 'Hallentage', Icon: KlCalendarIcon },
          { id: 'hall', label: 'LIVE', Icon: KlMapPinIcon, badge: liveCount },
        ]
      : [
          { id: 'home', label: 'Home', Icon: KlHomeIcon },
          { id: 'leagues', label: 'Liga', Icon: KlTrophyIcon },
          { id: 'nextmonth', label: nextMonthInfo.monthName, Icon: KlCalendarIcon },
          { id: 'annual', label: 'Rangliste', Icon: KlAwardIcon },
        ];

  const handleSwitchWorld = targetWorld => {
    if (targetWorld === 'league' && isCurrentUserConnectOnly) {
      return;
    }
    setAppWorld(targetWorld);
    if (targetWorld === 'connect') {
      if (!['board', 'announcements', 'schedule', 'hall', 'players'].includes(activeTab)) {
        setActiveTab('board');
      }
    } else {
      if (!['home', 'leagues', 'nextmonth', 'recent', 'annual', 'players'].includes(activeTab)) {
        setActiveTab('home');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#090B0F] text-slate-100 flex flex-col pb-24 sm:pb-8">
      {/* GROSSZÜGIGER MOBILE-FIRST HEADER MIT LEAGUE / CONNECT SWITCH */}
      <header className="sticky top-0 z-30 bg-[#090B0F]/95 backdrop-blur-xl border-b border-white/[0.08]">
        <div className="max-w-3xl mx-auto px-4 pt-3.5 pb-2.5 flex items-center justify-between gap-2.5">
          <button
            type="button"
            onClick={() =>
              handleSwitchWorld(isCurrentUserConnectOnly ? 'connect' : 'league')
            }
            aria-label="Zur Startseite"
            className="w-11 h-11 rounded-2xl bg-[#10B981] flex items-center justify-center text-slate-950 font-black text-sm shadow-lg shadow-[#10B981]/20 shrink-0 active:scale-[0.98] cursor-pointer"
          >
            KL
          </button>

          <div className="flex items-center gap-2.5 min-w-0">
            {isCurrentUserLive && currentUser ? (
              <button
                type="button"
                onClick={() => handleCheckOut(currentUser.id)}
                className="min-h-[44px] px-3.5 rounded-2xl bg-rose-500 active:scale-[0.98] text-white text-xs font-black inline-flex items-center gap-2 shadow-lg shadow-rose-500/20 shrink-0 cursor-pointer"
              >
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                <span>CHECK-OUT</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setShowQuickCheckInModal(true)}
                className="min-h-[44px] px-3.5 rounded-2xl bg-[#12151C] border border-[#10B981]/40 active:scale-[0.98] text-[#34D399] text-xs font-black inline-flex items-center gap-2 shrink-0 cursor-pointer"
              >
                <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                <span>LIVE ({liveCount})</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setShowProfileSwitchModal(true)}
              className="min-h-[44px] px-3.5 rounded-2xl bg-[#12151C] border border-white/10 active:scale-[0.98] text-xs font-black text-white inline-flex items-center gap-2 min-w-0 cursor-pointer"
            >
              {currentUser ? (
                <>
                  <span
                    className={`w-6 h-6 rounded-lg bg-gradient-to-br ${currentUser.avatarBg} flex items-center justify-center text-[10px] font-black text-white shrink-0`}
                  >
                    {currentUser.nickname.slice(0, 2).toUpperCase()}
                  </span>
                  <span className="max-w-[120px] sm:max-w-[160px] truncate">
                    {currentUser.nickname}
                  </span>
                </>
              ) : (
                <span className="text-[#34D399]">Profil</span>
              )}
              <KlChevronDownIcon className="w-4 h-4 text-slate-400 shrink-0" />
            </button>
          </div>
        </div>

        {/* HAUPT-UMSCHALTER: LEAGUE vs CONNECT */}
        <div className="max-w-3xl mx-auto px-4 pb-2.5">
          <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-[#12151C] border border-white/[0.08]">
            <button
              type="button"
              disabled={isCurrentUserConnectOnly}
              onClick={() => handleSwitchWorld('league')}
              title={
                isCurrentUserConnectOnly
                  ? 'In deinen Stammdaten ist «Nur CONNECT» gewählt'
                  : 'Zur Monatsliga wechseln'
              }
              className={`min-h-[42px] rounded-xl text-xs font-black tracking-wide inline-flex items-center justify-center gap-2 transition ${
                isCurrentUserConnectOnly
                  ? 'bg-white/[0.02] text-slate-600 opacity-55 cursor-not-allowed'
                  : appWorld === 'league'
                  ? 'bg-[#10B981] text-slate-950 shadow-md shadow-[#10B981]/20 cursor-pointer'
                  : 'text-slate-400 hover:text-white cursor-pointer'
              }`}
            >
              {isCurrentUserConnectOnly ? (
                <KlLockIcon className="w-3.5 h-3.5" />
              ) : (
                <KlTrophyIcon className="w-4 h-4" />
              )}
              <span>LEAGUE</span>
            </button>

            <button
              type="button"
              onClick={() => handleSwitchWorld('connect')}
              className={`min-h-[42px] rounded-xl text-xs font-black tracking-wide inline-flex items-center justify-center gap-2 transition cursor-pointer ${
                appWorld === 'connect'
                  ? 'bg-sky-400 text-slate-950 shadow-md shadow-sky-400/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <KlHandshakeIcon className="w-4 h-4" />
              <span>CONNECT</span>
              {(meetupPosts.length > 0 || liveCount > 0) && (
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] leading-none ${
                    appWorld === 'connect'
                      ? 'bg-slate-950 text-sky-300'
                      : 'bg-sky-400/20 text-sky-300'
                  }`}
                >
                  {meetupPosts.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* SUB-NAVIGATION JE NACH WELT (LEAGUE ODER CONNECT) */}
        {activeTab !== 'admin' && (
          <nav aria-label="Bereichsnavigation" className="max-w-3xl mx-auto px-4 pb-3.5 pt-0.5">
            <div
              className={`grid ${
                appWorld === 'connect' ? 'grid-cols-2' : 'grid-cols-3'
              } sm:flex sm:flex-wrap items-center gap-2`}
            >
              {activeWorldTabs.map(tab => {
                const Icon = tab.Icon;
                const active = activeTab === tab.id;
                const activeClasses =
                  appWorld === 'connect'
                    ? 'bg-sky-400/20 border-sky-400/50 text-sky-300'
                    : 'bg-[#10B981]/20 border-[#10B981]/50 text-[#34D399]';

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`min-h-[40px] px-3 sm:px-3.5 rounded-2xl border text-xs font-black inline-flex items-center justify-center gap-2 transition active:scale-[0.98] cursor-pointer ${
                      active
                        ? activeClasses
                        : 'bg-[#12151C] border-white/[0.07] text-slate-300 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{tab.label}</span>
                    {typeof tab.badge === 'number' && tab.badge > 0 && (
                      <span className="px-1.5 py-0.5 rounded-full bg-white/10 text-[10px] leading-none shrink-0">
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </nav>
        )}
      </header>

      {/* HAUPTINHALT */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-4">
        {activeTab === 'home' && (
          <HomeTab
            membersMap={membersMap}
            activeSeason={activeSeason}
            nextMonthInfo={nextMonthInfo}
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
            onNavigateTab={tab => {
              if (tab === 'hall' || tab === 'board') {
                setAppWorld('connect');
              }
              setActiveTab(tab);
            }}
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
            nextMonthInfo={nextMonthInfo}
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
            activeSeason={activeSeason}
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

        {activeTab === 'announcements' && (
          <AnnouncementsTab
            membersMap={membersMap}
            activeSeason={activeSeason}
            currentUser={currentUser}
            announcements={hallAnnouncements}
            onRequestSelectUser={id => setPendingLoginMemberId(id)}
            onSaveAnnouncement={handleSaveHallAnnouncement}
            onDeleteAnnouncement={handleDeleteHallAnnouncement}
            onToggleAnnouncementMeToo={handleToggleAnnouncementMeToo}
            onOpenProfile={id =>
              setProfileModalState({ memberId: id, startEditing: false })
            }
          />
        )}

        {activeTab === 'schedule' && (
          <HallScheduleTab
            membersMap={membersMap}
            activeSeason={activeSeason}
            currentUser={currentUser}
            nowTick={nowTick}
            onToggleUserDay={handleToggleUserDay}
            onOpenProfile={(id, startEditing = false) =>
              setProfileModalState({ memberId: id, startEditing })
            }
          />
        )}

        {activeTab === 'board' && (
          <MeetupBoardTab
            posts={meetupPosts}
            membersMap={membersMap}
            activeSeason={activeSeason}
            currentUser={currentUser}
            onRequestSelectUser={id => setPendingLoginMemberId(id)}
            onCreatePost={handleCreateMeetupPost}
            onToggleJoinPost={handleToggleJoinMeetupPost}
            onDeletePost={handleDeleteMeetupPost}
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
            onAddPlayerToLeague={handleAddPlayerToLeague}
            onAdminUpdateMatch={handleSaveMatchResult}
            onCreateNextMonth={handleCreateNextMonth}
            onDeleteSeason={handleDeleteSeason}
            onResetDemoData={handleResetDemoData}
          />
        )}
      </main>

      {/* FOOTER MIT ADMIN-ZUGANG */}
      <footer className="max-w-3xl w-full mx-auto px-4 pt-2 pb-6 border-t border-white/[0.07] flex items-center justify-between gap-3 text-xs text-slate-500">
        <span>KONGLeague · by pingkong</span>
        <button
          type="button"
          onClick={() => {
            setActiveTab('admin');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`min-h-[38px] px-3.5 rounded-xl text-xs font-black inline-flex items-center gap-1.5 transition cursor-pointer ${
            activeTab === 'admin'
              ? 'bg-amber-400 text-slate-950'
              : 'bg-[#12151C] border border-white/[0.08] text-slate-300 hover:text-white'
          }`}
        >
          <KlLockIcon className="w-3.5 h-3.5" />
          <span>Admin</span>
        </button>
      </footer>

      {/* MOBILE-FIRST FIXED BOTTOM NAVIGATION */}
      <nav className="sm:hidden fixed bottom-0 inset-x-0 z-30 bg-[#090B0F]/95 backdrop-blur-md border-t border-white/[0.08] px-2 py-1.5">
        <div
          className={`grid gap-1 ${
            mobileBottomTabs.length === 3 ? 'grid-cols-3' : 'grid-cols-4'
          }`}
        >
          {mobileBottomTabs.map(tab => {
            const Icon = tab.Icon;
            const active = activeTab === tab.id;
            const activeStyle =
              appWorld === 'connect'
                ? 'bg-sky-400/15 text-sky-300'
                : 'bg-[#10B981]/15 text-[#34D399]';
            const badgeStyle =
              appWorld === 'connect'
                ? 'bg-sky-400 text-slate-950'
                : 'bg-[#10B981] text-slate-950';

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`min-h-[48px] rounded-2xl flex flex-col items-center justify-center gap-0.5 relative cursor-pointer ${
                  active ? activeStyle : 'text-slate-400'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-black">{tab.label}</span>
                {typeof tab.badge === 'number' && tab.badge > 0 && (
                  <span
                    className={`absolute top-1.5 right-4 px-1.5 rounded-full text-[9px] font-black ${badgeStyle}`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

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
          onGoToHallTab={() => {
            setAppWorld('connect');
            setActiveTab('hall');
          }}
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
