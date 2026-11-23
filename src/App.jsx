import React, { useState, useMemo, useEffect } from 'react';

// ============================================================================
// KONSTANTEN & DEMO-DATEN
// ============================================================================
const WEEKDAYS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
const DAY_SLOTS = ['Mittag', 'Nachmittag', 'Abend'];
const PLAY_STYLES = ['Allround', 'Offensiv / Topspin', 'Abwehr / Schnitt', 'Konter / Block'];
const CHECKIN_MOODS = [
  'Ligaspiel gesucht 🏓',
  'Offen für Liga & Training',
  'Nur Training / Einspielen',
  'Spontanes Match bis 21:00',
];

const INITIAL_MEMBERS = {
  m1: {
    id: 'm1',
    nickname: 'SpinMaster',
    firstName: 'Lukas',
    lastName: 'Meier',
    pin: '1111',
    whatsapp: '079 269 66 89',
    language: 'DE',
    style: 'Offensiv / Topspin',
    bio: 'Vorhand-Topspin, meistens ab 18:30 in der Halle.',
    status: 'Dabei',
    nextMonthOptIn: true,
    usualDays: ['Di', 'Do'],
    usualSlots: ['Abend'],
    annualPoints: 142,
    seasonTitles: 2,
    avatarBg: 'from-emerald-500 to-teal-700',
    checkedInUntil: Date.now() + 95 * 60 * 1000,
    checkInMood: 'Ligaspiel gesucht 🏓',
  },
  m2: {
    id: 'm2',
    nickname: 'BlockQueen',
    firstName: 'Elena',
    lastName: 'Keller',
    pin: '2222',
    whatsapp: '078 412 33 10',
    language: 'Beides',
    style: 'Konter / Block',
    bio: 'Schnelles Blockspiel am Tisch, flexibel unter der Woche.',
    status: 'Dabei',
    nextMonthOptIn: true,
    usualDays: ['Mo', 'Mi', 'Fr'],
    usualSlots: ['Abend'],
    annualPoints: 136,
    seasonTitles: 1,
    avatarBg: 'from-sky-500 to-indigo-700',
    checkedInUntil: Date.now() + 65 * 60 * 1000,
    checkInMood: 'Offen für Liga & Training',
  },
  m3: {
    id: 'm3',
    nickname: 'ChopKing',
    firstName: 'Marco',
    lastName: 'Brunner',
    pin: '3333',
    whatsapp: '076 555 19 04',
    language: 'DE',
    style: 'Abwehr / Schnitt',
    bio: 'Unterschnitt-Abwehr & Geduldsspiel.',
    status: 'Dabei',
    nextMonthOptIn: true,
    usualDays: ['Di', 'Fr'],
    usualSlots: ['Abend'],
    annualPoints: 124,
    seasonTitles: 0,
    avatarBg: 'from-amber-500 to-orange-700',
    checkedInUntil: null,
    checkInMood: '',
  },
  m4: {
    id: 'm4',
    nickname: 'FlashDrive',
    firstName: 'David',
    lastName: 'Hofmann',
    pin: '4444',
    whatsapp: '079 810 44 21',
    language: 'EN',
    style: 'Offensiv / Topspin',
    bio: 'Always up for fast 5-set matches!',
    status: 'Dabei',
    nextMonthOptIn: true,
    usualDays: ['Mo', 'Do'],
    usualSlots: ['Abend'],
    annualPoints: 118,
    seasonTitles: 0,
    avatarBg: 'from-purple-500 to-fuchsia-700',
    checkedInUntil: null,
    checkInMood: '',
  },
  m5: {
    id: 'm5',
    nickname: 'NetEdge',
    firstName: 'Nina',
    lastName: 'Steiner',
    pin: '5555',
    whatsapp: '077 320 98 12',
    language: 'DE',
    style: 'Allround',
    bio: 'Sicheres Allroundspiel, gerne auch am Wochenende.',
    status: 'Dabei',
    nextMonthOptIn: true,
    usualDays: ['Mi', 'Sa'],
    usualSlots: ['Nachmittag', 'Abend'],
    annualPoints: 109,
    seasonTitles: 0,
    avatarBg: 'from-rose-500 to-pink-700',
    checkedInUntil: null,
    checkInMood: '',
  },
  m6: {
    id: 'm6',
    nickname: 'RallyAce',
    firstName: 'Tobias',
    lastName: 'Weber',
    pin: '6666',
    whatsapp: '079 601 77 50',
    language: 'DE',
    style: 'Allround',
    bio: 'Aufsteiger in der 2. Liga.',
    status: 'Dabei',
    nextMonthOptIn: true,
    usualDays: ['Di', 'Do'],
    usualSlots: ['Abend'],
    annualPoints: 96,
    seasonTitles: 0,
    avatarBg: 'from-cyan-500 to-blue-700',
    checkedInUntil: null,
    checkInMood: '',
  },
  m7: {
    id: 'm7',
    nickname: 'TopspinTom',
    firstName: 'Thomas',
    lastName: 'Frei',
    pin: '7777',
    whatsapp: '078 902 11 38',
    language: 'Beides',
    style: 'Offensiv / Topspin',
    bio: 'Beidseitiger Topspin.',
    status: 'Dabei',
    nextMonthOptIn: true,
    usualDays: ['Mo', 'Mi'],
    usualSlots: ['Abend'],
    annualPoints: 88,
    seasonTitles: 0,
    avatarBg: 'from-lime-500 to-emerald-700',
    checkedInUntil: null,
    checkInMood: '',
  },
  m8: {
    id: 'm8',
    nickname: 'ServePro',
    firstName: 'Jonas',
    lastName: 'Baumann',
    pin: '8888',
    whatsapp: '076 340 82 91',
    language: 'DE',
    style: 'Konter / Block',
    bio: 'Gefährliche Aufschläge & kurzer Rückschlag.',
    status: 'Dabei',
    nextMonthOptIn: false,
    usualDays: ['Fr'],
    usualSlots: ['Abend'],
    annualPoints: 82,
    seasonTitles: 0,
    avatarBg: 'from-indigo-500 to-violet-700',
    checkedInUntil: null,
    checkInMood: '',
  },
  m9: {
    id: 'm9',
    nickname: 'LoopStar',
    firstName: 'Sarah',
    lastName: 'Brunner',
    pin: '9999',
    whatsapp: '079 445 60 17',
    language: 'DE',
    style: 'Allround',
    bio: 'Aktuell in Trainingspause.',
    status: 'Pausiert',
    nextMonthOptIn: false,
    usualDays: ['Do'],
    usualSlots: ['Abend'],
    annualPoints: 74,
    seasonTitles: 0,
    avatarBg: 'from-slate-500 to-slate-700',
    checkedInUntil: null,
    checkInMood: '',
  },
};

function createRoundRobinMatches(seasonId, leagueLevel, playerIds) {
  const matches = [];
  for (let i = 0; i < playerIds.length; i++) {
    for (let j = i + 1; j < playerIds.length; j++) {
      matches.push({
        id: `${seasonId}_L${leagueLevel}_${playerIds[i]}_${playerIds[j]}`,
        seasonId,
        leagueLevel,
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
          { id: '2026-11_L1_m1_m2', seasonId: '2026-11', leagueLevel: 1, player1Id: 'm1', player2Id: 'm2', setsP1: 3, setsP2: 2, playedAt: '2026-11-05' },
          { id: '2026-11_L1_m1_m3', seasonId: '2026-11', leagueLevel: 1, player1Id: 'm1', player2Id: 'm3', setsP1: 3, setsP2: 1, playedAt: '2026-11-09' },
          { id: '2026-11_L1_m1_m4', seasonId: '2026-11', leagueLevel: 1, player1Id: 'm1', player2Id: 'm4', setsP1: null, setsP2: null, playedAt: null },
          { id: '2026-11_L1_m1_m5', seasonId: '2026-11', leagueLevel: 1, player1Id: 'm1', player2Id: 'm5', setsP1: null, setsP2: null, playedAt: null },
          { id: '2026-11_L1_m2_m3', seasonId: '2026-11', leagueLevel: 1, player1Id: 'm2', player2Id: 'm3', setsP1: 3, setsP2: 0, playedAt: '2026-11-11' },
          { id: '2026-11_L1_m2_m4', seasonId: '2026-11', leagueLevel: 1, player1Id: 'm2', player2Id: 'm4', setsP1: 3, setsP2: 1, playedAt: '2026-11-14' },
          { id: '2026-11_L1_m2_m5', seasonId: '2026-11', leagueLevel: 1, player1Id: 'm2', player2Id: 'm5', setsP1: null, setsP2: null, playedAt: null },
          { id: '2026-11_L1_m3_m4', seasonId: '2026-11', leagueLevel: 1, player1Id: 'm3', player2Id: 'm4', setsP1: 2, setsP2: 3, playedAt: '2026-11-16' },
          { id: '2026-11_L1_m3_m5', seasonId: '2026-11', leagueLevel: 1, player1Id: 'm3', player2Id: 'm5', setsP1: null, setsP2: null, playedAt: null },
          { id: '2026-11_L1_m4_m5', seasonId: '2026-11', leagueLevel: 1, player1Id: 'm4', player2Id: 'm5', setsP1: 3, setsP2: 1, playedAt: '2026-11-18' },
        ],
      },
      {
        level: 2,
        name: '2. Liga',
        playerIds: ['m6', 'm7', 'm8'],
        matches: [
          { id: '2026-11_L2_m6_m7', seasonId: '2026-11', leagueLevel: 2, player1Id: 'm6', player2Id: 'm7', setsP1: 3, setsP2: 2, playedAt: '2026-11-10' },
          { id: '2026-11_L2_m6_m8', seasonId: '2026-11', leagueLevel: 2, player1Id: 'm6', player2Id: 'm8', setsP1: null, setsP2: null, playedAt: null },
          { id: '2026-11_L2_m7_m8', seasonId: '2026-11', leagueLevel: 2, player1Id: 'm7', player2Id: 'm8', setsP1: 3, setsP2: 1, playedAt: '2026-11-15' },
        ],
      },
    ],
  },
];

// ============================================================================
// HILFSFUNKTIONEN
// ============================================================================
function isMemberCheckedIn(member, nowTick) {
  if (!member || !member.checkedInUntil) return false;
  return Number(member.checkedInUntil) > nowTick;
}

function formatRemainingTime(untilMs, nowTick) {
  const diffMin = Math.max(1, Math.round((Number(untilMs) - nowTick) / 60000));
  if (diffMin >= 60) {
    const h = Math.floor(diffMin / 60);
    const m = diffMin % 60;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  }
  return `${diffMin}m`;
}

function buildWhatsAppUrl(rawNumber, text) {
  if (!rawNumber) return '';
  let digits = String(rawNumber).replace(/[^\d+]/g, '');
  if (!digits) return '';
  if (digits.startsWith('+')) digits = digits.slice(1);
  else if (digits.startsWith('00')) digits = digits.slice(2);
  else if (digits.startsWith('0')) digits = `41${digits.slice(1)}`;
  const encoded = text ? `?text=${encodeURIComponent(text)}` : '';
  return `https://wa.me/${digits}${encoded}`;
}

function computeGroupStandings(group, membersMap) {
  const stats = {};
  group.playerIds.forEach(pid => {
    stats[pid] = {
      playerId: pid,
      member: membersMap[pid],
      played: 0,
      wins: 0,
      losses: 0,
      setsWon: 0,
      setsLost: 0,
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
    s1.setsWon += m.setsP1;
    s1.setsLost += m.setsP2;
    s2.setsWon += m.setsP2;
    s2.setsLost += m.setsP1;

    if (m.setsP1 > m.setsP2) {
      s1.wins += 1;
      s1.points += 3;
      s2.losses += 1;
      s2.points += 1;
    } else {
      s2.wins += 1;
      s2.points += 3;
      s1.losses += 1;
      s1.points += 1;
    }
  });

  return Object.values(stats)
    .filter(item => item.member)
    .sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      const diffA = a.setsWon - a.setsLost;
      const diffB = b.setsWon - b.setsLost;
      if (diffB !== diffA) return diffB - diffA;
      return b.setsWon - a.setsWon;
    });
}

// ============================================================================
// MINIMALISTISCHE INLINE-SVG ICONS
// ============================================================================
function KlIcon({ children, className = 'w-4 h-4' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {children}
    </svg>
  );
}

function KlHomeIcon({ className }) {
  return (
    <KlIcon className={className}>
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1V9.5z" />
    </KlIcon>
  );
}

function KlTrophyIcon({ className }) {
  return (
    <KlIcon className={className}>
      <path d="M6 9H4a2 2 0 0 1-2-2V5h4" />
      <path d="M18 9h2a2 2 0 0 0 2-2V5h-4" />
      <path d="M6 4h12v6a6 6 0 0 1-12 0V4z" />
      <path d="M12 16v4" />
      <path d="M8 20h8" />
    </KlIcon>
  );
}

function KlMapPinIcon({ className }) {
  return (
    <KlIcon className={className}>
      <path d="M12 21s-6-5.3-6-10a6 6 0 1 1 12 0c0 4.7-6 10-6 10z" />
      <circle cx="12" cy="11" r="2.2" />
    </KlIcon>
  );
}

function KlCalendarIcon({ className }) {
  return (
    <KlIcon className={className}>
      <rect x="3" y="4" width="18" height="17" rx="2" />
      <path d="M8 2v4M16 2v4M3 10h18" />
    </KlIcon>
  );
}

function KlHistoryIcon({ className }) {
  return (
    <KlIcon className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </KlIcon>
  );
}

function KlAwardIcon({ className }) {
  return (
    <KlIcon className={className}>
      <circle cx="12" cy="8" r="5" />
      <path d="M8.5 13l-1.5 8 5-3 5 3-1.5-8" />
    </KlIcon>
  );
}

function KlUsersIcon({ className }) {
  return (
    <KlIcon className={className}>
      <circle cx="9" cy="7" r="3" />
      <path d="M3 20v-1a5 5 0 0 1 10 0v1" />
      <circle cx="17" cy="8" r="2.5" />
      <path d="M16 20v-1a4 4 0 0 1 5-3.8" />
    </KlIcon>
  );
}

function KlUserPlusIcon({ className }) {
  return (
    <KlIcon className={className}>
      <circle cx="9" cy="7" r="3.5" />
      <path d="M2 20v-1a6 6 0 0 1 12 0v1" />
      <path d="M19 8v6M16 11h6" />
    </KlIcon>
  );
}

function KlSearchIcon({ className }) {
  return (
    <KlIcon className={className}>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </KlIcon>
  );
}

function KlMessageIcon({ className }) {
  return (
    <KlIcon className={className}>
      <path d="M21 11.5a8.5 8.5 0 0 1-12.4 7.5L3 20l1.2-5.2A8.5 8.5 0 1 1 21 11.5z" />
    </KlIcon>
  );
}

function KlShieldIcon({ className }) {
  return (
    <KlIcon className={className}>
      <path d="M12 3l7 3v6c0 4.5-3 7.8-7 9-4-1.2-7-4.5-7-9V6l7-3z" />
    </KlIcon>
  );
}

function KlTrashIcon({ className }) {
  return (
    <KlIcon className={className}>
      <path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" />
    </KlIcon>
  );
}

function KlXIcon({ className }) {
  return (
    <KlIcon className={className}>
      <path d="M18 6L6 18M6 6l12 12" />
    </KlIcon>
  );
}

function KlEditIcon({ className }) {
  return (
    <KlIcon className={className}>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </KlIcon>
  );
}

function KlChevronDownIcon({ className }) {
  return (
    <KlIcon className={className}>
      <path d="M6 9l6 6 6-6" />
    </KlIcon>
  );
}

function KlLockIcon({ className }) {
  return (
    <KlIcon className={className}>
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </KlIcon>
  );
}

// ============================================================================
// HOME TAB (MOBILE-FIRST MINIMALISTISCH)
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
  const activeEligibleMembers = useMemo(
    () => Object.values(membersMap).filter(m => m.status === 'Dabei'),
    [membersMap]
  );

  const openFeedbackMembers = useMemo(
    () =>
      Object.values(membersMap).filter(
        m => m.status === 'Offen' || (m.status === 'Dabei' && !m.nextMonthOptIn)
      ),
    [membersMap]
  );

  const confirmedNextMonthCount = useMemo(
    () =>
      Object.values(membersMap).filter(
        m => m.status === 'Dabei' && m.nextMonthOptIn
      ).length,
    [membersMap]
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

  const myGroup = useMemo(() => {
    if (!currentUser || !activeSeason) return null;
    return (
      activeSeason.groups.find(g => g.playerIds.includes(currentUser.id)) || null
    );
  }, [currentUser, activeSeason]);

  const myOpenMatches = useMemo(() => {
    if (!currentUser || !myGroup) return [];
    return myGroup.matches.filter(
      m =>
        (m.player1Id === currentUser.id || m.player2Id === currentUser.id) &&
        (m.setsP1 === null || m.setsP2 === null)
    );
  }, [currentUser, myGroup]);

  const isUserLive = isMemberCheckedIn(currentUser, nowTick);

  return (
    <div className="space-y-4">
      {/* MINIMALISTISCHER HERO & 4 KOMPAKTE METRIKEN */}
      <section className="rounded-3xl bg-[#12151C] border border-white/[0.07] p-4 sm:p-5 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-[#34D399]">
              {activeSeason?.label}
            </p>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-0.5">
              KONGLeague <span className="text-slate-500 font-semibold text-base">by pingkong</span>
            </h1>
          </div>

          <button
            type="button"
            onClick={onOpenAddMember}
            className="min-h-[40px] px-3.5 rounded-2xl bg-[#10B981] active:scale-[0.98] text-slate-950 text-xs font-black inline-flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <KlUserPlusIcon className="w-4 h-4" />
            <span>NEW PLAYER</span>
          </button>
        </div>

        <div className="grid grid-cols-4 gap-2">
          <button
            type="button"
            onClick={() => onNavigateTab('players')}
            className="p-2.5 rounded-2xl bg-[#090B0F] border border-white/[0.06] text-center active:scale-[0.98] cursor-pointer"
          >
            <p className="text-base sm:text-lg font-black text-white">
              {activeEligibleMembers.length}
            </p>
            <p className="text-[10px] font-semibold text-slate-400">Spieler</p>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab('leagues')}
            className="p-2.5 rounded-2xl bg-[#090B0F] border border-white/[0.06] text-center active:scale-[0.98] cursor-pointer"
          >
            <p className="text-base sm:text-lg font-black text-white">
              {activeSeason?.groups.length || 0}
            </p>
            <p className="text-[10px] font-semibold text-slate-400">Ligen</p>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab('recent')}
            className="p-2.5 rounded-2xl bg-[#090B0F] border border-white/[0.06] text-center active:scale-[0.98] cursor-pointer"
          >
            <p className="text-base sm:text-lg font-black text-white">
              {seasonMatchStats.played}/{seasonMatchStats.total}
            </p>
            <p className="text-[10px] font-semibold text-slate-400">Spiele</p>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab('hall')}
            className="p-2.5 rounded-2xl bg-[#090B0F] border border-[#10B981]/30 text-center active:scale-[0.98] cursor-pointer"
          >
            <p className="text-base sm:text-lg font-black text-[#34D399]">
              {liveCount}
            </p>
            <p className="text-[10px] font-semibold text-[#34D399]">LIVE</p>
          </button>
        </div>
      </section>

      {/* SPIELER-COCKPIT ODER SCHNELLAUSWAHL */}
      {!currentUser ? (
        <section className="rounded-3xl bg-[#12151C] border border-white/[0.07] p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-black text-white">Profil wählen</h2>
              <p className="text-xs text-slate-400">
                Tippe auf deinen Nickname (PIN-geschützt)
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {Object.values(membersMap).map(m => (
              <button
                key={m.id}
                type="button"
                onClick={() => onRequestSelectUser(m.id)}
                className="min-h-[40px] px-3.5 rounded-2xl bg-[#090B0F] border border-white/10 hover:border-[#10B981] text-xs font-black text-white cursor-pointer"
              >
                {m.nickname}
              </button>
            ))}
          </div>
        </section>
      ) : (
        <section className="rounded-3xl bg-[#12151C] border border-white/[0.07] p-4 sm:p-5 space-y-4">
          {currentUser.status === 'Offen' && (
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200">
              Profil <strong>{currentUser.nickname}</strong> wartet noch auf Freigabe im Admin-Bereich.
            </div>
          )}

          {/* PROFILZEILE */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${currentUser.avatarBg} flex items-center justify-center text-white font-black text-sm shrink-0`}
              >
                {currentUser.nickname.slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-black text-white truncate">
                    {currentUser.nickname}
                  </h2>
                  <span className="px-2 py-0.5 rounded-lg bg-white/[0.06] text-[10px] font-bold text-slate-300 shrink-0">
                    {myGroup ? myGroup.name : currentUser.status}
                  </span>
                </div>
                <p className="text-xs text-slate-400 truncate">
                  {currentUser.annualPoints} Pkt · {currentUser.style}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onOpenProfile(currentUser.id, true)}
              className="min-h-[38px] px-3 rounded-xl bg-white/[0.06] hover:bg-white/10 text-xs font-bold text-slate-200 shrink-0 cursor-pointer"
            >
              Stammdaten
            </button>
          </div>

          {/* PROMINENTER FOLGEMONAT TOGGLE */}
          {currentUser.status === 'Dabei' && (
            <div className="p-3 rounded-2xl bg-[#090B0F] border border-white/[0.06] flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-black text-white">Folgemonat</p>
                <p className="text-[11px] text-slate-400 truncate">
                  {currentUser.nextMonthOptIn
                    ? 'Du bist nächste Runde dabei'
                    : 'Nächste Runde pausiert'}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-1.5 w-44 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    if (!currentUser.nextMonthOptIn) onToggleNextMonth();
                  }}
                  className={`min-h-[38px] rounded-xl text-xs font-black transition cursor-pointer ${
                    currentUser.nextMonthOptIn
                      ? 'bg-[#10B981] text-slate-950'
                      : 'bg-[#12151C] text-slate-400'
                  }`}
                >
                  Dabei
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (currentUser.nextMonthOptIn) onToggleNextMonth();
                  }}
                  className={`min-h-[38px] rounded-xl text-xs font-black transition cursor-pointer ${
                    !currentUser.nextMonthOptIn
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-[#12151C] text-slate-400'
                  }`}
                >
                  Pause
                </button>
              </div>
            </div>
          )}

          {/* SCHNELL-CHECK-IN / CHECK-OUT */}
          {isUserLive ? (
            <button
              type="button"
              onClick={() => onCheckOut(currentUser.id)}
              className="w-full min-h-[44px] rounded-2xl bg-rose-500/15 border border-rose-500/35 text-rose-200 text-xs font-black flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
              <span>
                LIVE vor Ort ({formatRemainingTime(currentUser.checkedInUntil, nowTick)}) · CHECK-OUT
              </span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onCheckIn(currentUser.id, 120, CHECKIN_MOODS[0])}
              className="w-full min-h-[44px] rounded-2xl bg-[#10B981]/12 hover:bg-[#10B981]/20 border border-[#10B981]/30 text-[#34D399] text-xs font-black cursor-pointer"
            >
              + Jetzt in der Halle einchecken (2h)
            </button>
          )}

          {/* OFFENE LIGASPIELE */}
          {myGroup && (
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between">
                <h3 className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                  Deine offenen Spiele ({myOpenMatches.length})
                </h3>
                <button
                  type="button"
                  onClick={() => onNavigateTab('leagues')}
                  className="text-xs font-bold text-[#34D399] cursor-pointer"
                >
                  Tabelle →
                </button>
              </div>

              {myOpenMatches.length === 0 ? (
                <div className="p-3 rounded-2xl bg-[#090B0F] text-xs text-slate-400">
                  Alle Pflichtspiele in {myGroup.name} erledigt.
                </div>
              ) : (
                <div className="space-y-2">
                  {myOpenMatches.map(match => {
                    const oppId =
                      match.player1Id === currentUser.id
                        ? match.player2Id
                        : match.player1Id;
                    const opp = membersMap[oppId];
                    if (!opp) return null;
                    const waUrl = buildWhatsAppUrl(
                      opp.whatsapp,
                      `Hoi ${opp.nickname}, wann wollen wir unser PINGKONG-Ligaspiel in ${myGroup.name} spielen?`
                    );

                    return (
                      <div
                        key={match.id}
                        className="p-3 rounded-2xl bg-[#090B0F] border border-white/[0.06] flex items-center justify-between gap-2"
                      >
                        <button
                          type="button"
                          onClick={() => onOpenProfile(opp.id)}
                          className="text-left min-w-0 cursor-pointer"
                        >
                          <p className="text-xs font-black text-white truncate">
                            vs. {opp.nickname}
                          </p>
                          <p className="text-[11px] text-slate-400 truncate">
                            Hallentage: {opp.usualDays?.join(', ') || '–'}
                          </p>
                        </button>
                        <div className="flex items-center gap-2 shrink-0">
                          {waUrl && (
                            <a
                              href={waUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-9 h-9 rounded-xl bg-[#10B981]/15 text-[#34D399] flex items-center justify-center"
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
            </div>
          )}
        </section>
      )}

      {/* MONATSENDE-CHECK (AB DEM 26. ODER MANUELL IM ADMIN-BEREICH) */}
      {showMonthEndCheck && (
        <section className="rounded-3xl bg-[#12151C] border border-amber-500/35 p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h2 className="text-sm font-black text-white">
                Monatsende-Check ({activeSeason?.shortLabel})
              </h2>
              <p className="text-[11px] text-slate-400">
                Offene Rückmeldungen & Pflichtspiele vor Abschluss
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-[#10B981]/15 text-[#34D399] text-[11px] font-black">
              {confirmedNextMonthCount} Zusagen
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-2xl bg-[#090B0F] space-y-2">
              <p className="font-bold text-slate-300">
                Pausiert / Offen ({openFeedbackMembers.length})
              </p>
              <div className="flex flex-wrap gap-1.5">
                {openFeedbackMembers.map(m => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => onOpenProfile(m.id)}
                    className="px-2.5 py-1 rounded-lg bg-amber-500/15 text-amber-300 text-[11px] font-bold cursor-pointer"
                  >
                    {m.nickname} ({m.status === 'Offen' ? 'Offen' : 'Pause'})
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-[#090B0F] space-y-1.5">
              <div className="flex justify-between text-[11px] font-bold text-slate-300">
                <span>Pflichtspiel-Fortschritt</span>
                <span className="text-[#34D399]">
                  {seasonMatchStats.total > 0
                    ? Math.round(
                        (seasonMatchStats.played / seasonMatchStats.total) * 100
                      )
                    : 0}
                  %
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full bg-[#10B981]"
                  style={{
                    width: `${
                      seasonMatchStats.total > 0
                        ? (seasonMatchStats.played / seasonMatchStats.total) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* KOMPAKTE TABELLEN-VORSCHAU */}
      {activeSeason && (
        <section className="space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-400">
              Tabellen · {activeSeason.shortLabel}
            </h2>
            <button
              type="button"
              onClick={() => onNavigateTab('leagues')}
              className="text-xs font-bold text-[#34D399] cursor-pointer"
            >
              Alle Details →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {activeSeason.groups.map(group => {
              const standings = computeGroupStandings(group, membersMap);
              return (
                <div
                  key={group.level}
                  className="rounded-3xl bg-[#12151C] border border-white/[0.07] p-4 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black text-[#34D399]">
                      {group.name}
                    </h3>
                    <span className="text-[11px] text-slate-500">
                      {standings.length} Spieler
                    </span>
                  </div>
                  <div className="space-y-1">
                    {standings.map((row, idx) => (
                      <button
                        key={row.playerId}
                        type="button"
                        onClick={() => onOpenProfile(row.playerId)}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-[#090B0F] hover:bg-white/[0.04] text-xs cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="font-black text-slate-500 w-4">
                            {idx + 1}
                          </span>
                          <span className="font-bold text-white truncate">
                            {row.member.nickname}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 shrink-0 text-[11px]">
                          <span className="text-slate-400">
                            {row.setsWon}:{row.setsLost}
                          </span>
                          <span className="font-black text-[#34D399]">
                            {row.points} Pkt
                          </span>
                        </div>
                      </button>
                    ))}
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
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-black text-white">Ligen & Tabellen</h2>
          <p className="text-xs text-slate-400">
            Hinweis: Die Gruppengrösse kann je nach Teilnehmerzahl variieren (z. B. 4er-, 5er- oder 6er-Gruppen).
          </p>
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {seasons.map(s => (
            <button
              key={s.id}
              type="button"
              onClick={() => onSelectSeason(s.id)}
              className={`min-h-[36px] px-3 rounded-xl text-xs font-black shrink-0 cursor-pointer ${
                activeSeason?.id === s.id
                  ? 'bg-[#10B981] text-slate-950'
                  : 'bg-[#12151C] border border-white/[0.07] text-slate-300'
              }`}
            >
              {s.shortLabel}
            </button>
          ))}
        </div>
      </div>

      {activeSeason?.groups.map(group => {
        const standings = computeGroupStandings(group, membersMap);
        return (
          <section
            key={group.level}
            className="rounded-3xl bg-[#12151C] border border-white/[0.07] p-4 sm:p-5 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-[#34D399]">{group.name}</h3>
              <span className="text-xs text-slate-400">
                {standings.length} Teilnehmer
              </span>
            </div>

            <div className="overflow-x-auto -mx-1 px-1">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-slate-500 border-b border-white/[0.07]">
                    <th className="py-2 pr-2">#</th>
                    <th className="py-2 pr-2">Spieler</th>
                    <th className="py-2 px-1.5 text-center">Sp.</th>
                    <th className="py-2 px-1.5 text-center">S:N</th>
                    <th className="py-2 px-1.5 text-center">Sätze</th>
                    <th className="py-2 pl-2 text-right">Pkt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.05]">
                  {standings.map((row, idx) => {
                    const isMe = currentUser?.id === row.playerId;
                    return (
                      <tr
                        key={row.playerId}
                        className={isMe ? 'bg-[#10B981]/10' : ''}
                      >
                        <td className="py-2.5 pr-2 font-black text-slate-500">
                          {idx + 1}
                        </td>
                        <td className="py-2.5 pr-2">
                          <button
                            type="button"
                            onClick={() => onOpenProfile(row.playerId)}
                            className="font-bold text-white hover:text-[#34D399] cursor-pointer"
                          >
                            {row.member.nickname}
                          </button>
                        </td>
                        <td className="py-2.5 px-1.5 text-center text-slate-300">
                          {row.played}
                        </td>
                        <td className="py-2.5 px-1.5 text-center text-slate-300">
                          {row.wins}:{row.losses}
                        </td>
                        <td className="py-2.5 px-1.5 text-center text-slate-300">
                          {row.setsWon}:{row.setsLost}
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

            <div className="space-y-2 pt-2 border-t border-white/[0.07]">
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
                    <div
                      key={match.id}
                      className="p-2.5 rounded-2xl bg-[#090B0F] border border-white/[0.06] flex items-center justify-between gap-2 text-xs"
                    >
                      <span className="font-bold text-white truncate">
                        {p1.nickname} vs. {p2.nickname}
                      </span>
                      <button
                        type="button"
                        onClick={() => onOpenResultModal(match)}
                        className={`min-h-[32px] px-2.5 rounded-xl text-[11px] font-black shrink-0 cursor-pointer ${
                          played
                            ? 'bg-white/[0.07] text-[#34D399]'
                            : 'bg-[#10B981] text-slate-950'
                        }`}
                      >
                        {played ? `${match.setsP1}:${match.setsP2}` : 'Eintragen'}
                      </button>
                    </div>
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
// LIVE HALLEN TAB
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

  const checkedInPlayers = useMemo(
    () =>
      Object.values(membersMap).filter(m => isMemberCheckedIn(m, nowTick)),
    [membersMap, nowTick]
  );

  const isCurrentLive = isMemberCheckedIn(currentUser, nowTick);

  return (
    <div className="space-y-4">
      <section className="rounded-3xl bg-[#12151C] border border-white/[0.07] p-4 sm:p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-white">LIVE in der Halle</h2>
            <p className="text-xs text-slate-400">
              Wer ist gerade vor Ort eingecheckt?
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-[#10B981]/15 text-[#34D399] text-xs font-black">
            {checkedInPlayers.length} live
          </span>
        </div>

        {!currentUser ? (
          <div className="p-3.5 rounded-2xl bg-[#090B0F] space-y-2.5">
            <p className="text-xs text-slate-300">
              Wähle zuerst dein Profil zum Einchecken:
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
        ) : isCurrentLive ? (
          <div className="p-3.5 rounded-2xl bg-[#090B0F] border border-[#10B981]/35 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black text-[#34D399]">
                Du bist eingecheckt ({currentUser.nickname}) · noch{' '}
                {formatRemainingTime(currentUser.checkedInUntil, nowTick)}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                {currentUser.checkInMood || CHECKIN_MOODS[0]}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onCheckOut(currentUser.id)}
              className="min-h-[42px] px-4 rounded-xl bg-rose-500 text-white text-xs font-black cursor-pointer"
            >
              CHECK-OUT
            </button>
          </div>
        ) : (
          <div className="p-3.5 rounded-2xl bg-[#090B0F] space-y-3">
            <div className="grid grid-cols-4 gap-1.5">
              {[60, 90, 120, 180].map(m => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMinutes(m)}
                  className={`min-h-[40px] rounded-xl text-xs font-black cursor-pointer ${
                    minutes === m
                      ? 'bg-[#10B981] text-slate-950'
                      : 'bg-[#12151C] text-slate-300'
                  }`}
                >
                  {m >= 60 ? `${m / 60}h` : `${m}m`}
                </button>
              ))}
            </div>

            <select
              value={mood}
              onChange={e => setMood(e.target.value)}
              className="w-full min-h-[42px] px-3 rounded-xl bg-[#12151C] border border-white/10 text-xs font-bold text-white"
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
              className="w-full min-h-[44px] rounded-2xl bg-[#10B981] text-slate-950 text-xs font-black cursor-pointer"
            >
              Jetzt einchecken
            </button>
          </div>
        )}

        {/* LISTE DER ANWESENDEN SPIELER */}
        <div className="space-y-2 pt-1">
          <h3 className="text-[11px] font-black uppercase tracking-wider text-slate-400">
            Anwesende Spieler ({checkedInPlayers.length})
          </h3>
          {checkedInPlayers.length === 0 ? (
            <div className="p-4 rounded-2xl bg-[#090B0F] text-xs text-slate-400">
              Aktuell ist niemand eingecheckt.
            </div>
          ) : (
            <div className="space-y-2">
              {checkedInPlayers.map(player => {
                const playerGroup = activeSeason?.groups.find(g =>
                  g.playerIds.includes(player.id)
                );
                const isMe = currentUser?.id === player.id;
                const waUrl = buildWhatsAppUrl(
                  player.whatsapp,
                  `Hoi ${player.nickname}, ich sehe du bist gerade in der Halle – wollen wir ein Match spielen?`
                );

                return (
                  <div
                    key={player.id}
                    className={`p-3.5 rounded-2xl bg-[#090B0F] border flex items-center justify-between gap-3 ${
                      isMe ? 'border-[#10B981]' : 'border-white/[0.07]'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => onOpenProfile(player.id)}
                      className="flex items-center gap-3 min-w-0 text-left cursor-pointer"
                    >
                      <div
                        className={`w-10 h-10 rounded-xl bg-gradient-to-br ${player.avatarBg} flex items-center justify-center text-white font-black text-xs shrink-0`}
                      >
                        {player.nickname.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-sm font-black text-white truncate">
                            {player.nickname}
                          </p>
                          {playerGroup && (
                            <span className="px-1.5 py-0.5 rounded bg-white/[0.07] text-[10px] font-bold text-slate-300 shrink-0">
                              {playerGroup.name}
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-semibold text-[#34D399] truncate">
                          {player.checkInMood || CHECKIN_MOODS[0]}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          Noch {formatRemainingTime(player.checkedInUntil, nowTick)} vor Ort
                        </p>
                      </div>
                    </button>

                    <div className="flex items-center gap-2 shrink-0">
                      {!isMe && waUrl && (
                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-9 h-9 rounded-xl bg-[#10B981]/15 text-[#34D399] flex items-center justify-center"
                          title={`WhatsApp an ${player.nickname}`}
                        >
                          <KlMessageIcon className="w-4 h-4" />
                        </a>
                      )}
                      <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse" />
                    </div>
                  </div>
                );
              })}
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
    <div className="space-y-4">
      <section className="rounded-3xl bg-[#12151C] border border-white/[0.07] p-4 sm:p-5 space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-black text-white">Folgemonat</h2>
            <p className="text-xs text-slate-400">
              Teilnehmer nach {activeSeason?.shortLabel}
            </p>
          </div>
          <div className="flex gap-1.5">
            <span className="px-2.5 py-1 rounded-full bg-[#10B981]/15 text-[#34D399] text-xs font-black">
              {confirmedMembers.length} Dabei
            </span>
            <span className="px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-300 text-xs font-black">
              {pausedMembers.length} Pause
            </span>
          </div>
        </div>

        {currentUser && currentUser.status === 'Dabei' && (
          <div className="p-3.5 rounded-2xl bg-[#090B0F] border border-[#10B981]/30 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-black text-white truncate">
                Dein Status ({currentUser.nickname})
              </p>
              <p className="text-[11px] text-slate-400">
                {currentUser.nextMonthOptIn ? 'Dabei' : 'Pause'}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-1.5 w-44 shrink-0">
              <button
                type="button"
                onClick={() => {
                  if (!currentUser.nextMonthOptIn) onToggleNextMonth();
                }}
                className={`min-h-[38px] rounded-xl text-xs font-black cursor-pointer ${
                  currentUser.nextMonthOptIn
                    ? 'bg-[#10B981] text-slate-950'
                    : 'bg-[#12151C] text-slate-400'
                }`}
              >
                Dabei
              </button>
              <button
                type="button"
                onClick={() => {
                  if (currentUser.nextMonthOptIn) onToggleNextMonth();
                }}
                className={`min-h-[38px] rounded-xl text-xs font-black cursor-pointer ${
                  !currentUser.nextMonthOptIn
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-[#12151C] text-slate-400'
                }`}
              >
                Pause
              </button>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <h3 className="text-[11px] font-black uppercase tracking-wider text-[#34D399]">
            Dabei ({confirmedMembers.length})
          </h3>
          <div className="space-y-1.5">
            {confirmedMembers.map((m, i) => (
              <button
                key={m.id}
                type="button"
                onClick={() => onOpenProfile(m.id)}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-[#090B0F] text-left cursor-pointer"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-xs font-black text-slate-500 w-5">
                    {i + 1}
                  </span>
                  <span className="text-xs font-black text-white truncate">
                    {m.nickname}
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-lg bg-[#10B981]/15 text-[#34D399] text-[10px] font-black">
                  Dabei
                </span>
              </button>
            ))}
          </div>
        </div>

        {pausedMembers.length > 0 && (
          <div className="space-y-1.5 pt-1">
            <h3 className="text-[11px] font-black uppercase tracking-wider text-amber-300">
              Pause ({pausedMembers.length})
            </h3>
            {pausedMembers.map(m => (
              <button
                key={m.id}
                type="button"
                onClick={() => onOpenProfile(m.id)}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-[#090B0F] text-left cursor-pointer"
              >
                <span className="text-xs font-bold text-slate-300 truncate">
                  {m.nickname}
                </span>
                <span className="px-2 py-0.5 rounded-lg bg-amber-500/15 text-amber-300 text-[10px] font-black">
                  Pause
                </span>
              </button>
            ))}
          </div>
        )}

        {pendingMembers.length > 0 && (
          <div className="space-y-1.5 pt-1">
            <h3 className="text-[11px] font-black uppercase tracking-wider text-slate-400">
              Offen · Admin-Freigabe ({pendingMembers.length})
            </h3>
            {pendingMembers.map(m => (
              <div
                key={m.id}
                className="flex items-center justify-between p-3 rounded-2xl bg-[#090B0F]"
              >
                <span className="text-xs font-bold text-slate-300 truncate">
                  {m.nickname}
                </span>
                <span className="px-2 py-0.5 rounded-lg bg-white/10 text-slate-300 text-[10px] font-black">
                  Offen
                </span>
              </div>
            ))}
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
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-lg font-black text-white">Gespielte Matches</h2>
        <div className="flex gap-1.5">
          {seasons.map(s => (
            <button
              key={s.id}
              type="button"
              onClick={() => onSelectSeason(s.id)}
              className={`min-h-[34px] px-3 rounded-xl text-xs font-black cursor-pointer ${
                activeSeason?.id === s.id
                  ? 'bg-[#10B981] text-slate-950'
                  : 'bg-[#12151C] text-slate-300'
              }`}
            >
              {s.shortLabel}
            </button>
          ))}
        </div>
      </div>

      {playedMatches.length === 0 ? (
        <div className="rounded-3xl bg-[#12151C] p-5 text-xs text-slate-400">
          Noch keine Resultate eingetragen.
        </div>
      ) : (
        <div className="space-y-2">
          {playedMatches.map(match => {
            const p1 = membersMap[match.player1Id];
            const p2 = membersMap[match.player2Id];
            if (!p1 || !p2) return null;
            const p1Won = match.setsP1 > match.setsP2;

            return (
              <div
                key={match.id}
                className="rounded-2xl bg-[#12151C] border border-white/[0.07] p-3.5 flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <p className="text-[11px] text-slate-400">
                    <span className="font-bold text-[#34D399]">{match.groupName}</span>
                    {match.playedAt ? ` · ${match.playedAt}` : ''}
                  </p>
                  <div className="flex items-center gap-1.5 text-sm mt-0.5">
                    <button
                      type="button"
                      onClick={() => onOpenProfile(p1.id)}
                      className={`font-black truncate cursor-pointer ${
                        p1Won ? 'text-white' : 'text-slate-400'
                      }`}
                    >
                      {p1.nickname}
                    </button>
                    <span className="text-slate-600">vs</span>
                    <button
                      type="button"
                      onClick={() => onOpenProfile(p2.id)}
                      className={`font-black truncate cursor-pointer ${
                        !p1Won ? 'text-white' : 'text-slate-400'
                      }`}
                    >
                      {p2.nickname}
                    </button>
                  </div>
                </div>
                <span className="px-3 py-1.5 rounded-xl bg-[#090B0F] text-sm font-black text-[#34D399] shrink-0">
                  {match.setsP1}:{match.setsP2}
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
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-black text-white">Jahresrangliste 2026</h2>
        <p className="text-xs text-slate-400">Gesamtwertung aller Monatsrunden</p>
      </div>

      <div className="space-y-2">
        {rankedMembers.map((member, index) => {
          const isMe = currentUser?.id === member.id;
          return (
            <button
              key={member.id}
              type="button"
              onClick={() => onOpenProfile(member.id)}
              className={`w-full flex items-center justify-between gap-3 p-3.5 rounded-2xl border text-left cursor-pointer ${
                isMe
                  ? 'bg-[#10B981]/12 border-[#10B981]/40'
                  : 'bg-[#12151C] border-white/[0.07]'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${
                    index === 0
                      ? 'bg-amber-400 text-slate-950'
                      : index === 1
                      ? 'bg-slate-300 text-slate-950'
                      : index === 2
                      ? 'bg-amber-700 text-white'
                      : 'bg-[#090B0F] text-slate-400'
                  }`}
                >
                  {index + 1}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-black text-white truncate">
                    {member.nickname}
                  </p>
                  <p className="text-[11px] text-slate-400 truncate">
                    {member.style}
                  </p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-black text-[#34D399]">
                  {member.annualPoints} Pkt
                </p>
                {member.seasonTitles > 0 && (
                  <p className="text-[10px] font-bold text-amber-300">
                    {member.seasonTitles}× Titel
                  </p>
                )}
              </div>
            </button>
          );
        })}
      </div>
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
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-lg font-black text-white">
          Spieler ({Object.keys(membersMap).length})
        </h2>
        <button
          type="button"
          onClick={onOpenAddMember}
          className="min-h-[38px] px-3.5 rounded-xl bg-[#10B981] text-slate-950 text-xs font-black inline-flex items-center gap-1.5 cursor-pointer"
        >
          <KlUserPlusIcon className="w-4 h-4" />
          <span>NEW PLAYER</span>
        </button>
      </div>

      <div className="relative">
        <KlSearchIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Spieler suchen..."
          className="w-full min-h-[44px] pl-10 pr-4 rounded-2xl bg-[#12151C] border border-white/[0.07] text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#10B981]"
        />
      </div>

      <div className="space-y-2">
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
              className="w-full p-3.5 rounded-2xl bg-[#12151C] border border-white/[0.07] text-left flex items-center justify-between gap-3 cursor-pointer"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${member.avatarBg} flex items-center justify-center text-white font-black text-xs shrink-0`}
                >
                  {member.nickname.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-black text-white truncate">
                      {member.nickname}
                    </p>
                    {live && (
                      <span className="w-2 h-2 rounded-full bg-[#10B981] shrink-0" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 truncate">
                    {member.language} · {member.style} · Hallentage:{' '}
                    {member.usualDays?.join(', ') || '–'}
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-[#090B0F] text-[11px] font-black text-slate-300 shrink-0">
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
  onAddPlayerToLeague,
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
      // ignore
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
    setAdminFeedback(`Admin-PIN auf "${cleaned}" überschrieben.`);
  };

  const allMembers = useMemo(() => Object.values(membersMap), [membersMap]);
  const pendingApprovalMembers = useMemo(
    () => allMembers.filter(m => m.status === 'Offen'),
    [allMembers]
  );

  const unassignedActiveMembers = useMemo(() => {
    if (!activeSeason) return [];
    const assignedIds = new Set(
      activeSeason.groups.flatMap(g => g.playerIds)
    );
    return allMembers.filter(
      m => m.status === 'Dabei' && !assignedIds.has(m.id)
    );
  }, [allMembers, activeSeason]);

  const [selectedUnassignedId, setSelectedUnassignedId] = useState('');
  const [selectedTargetLevel, setSelectedTargetLevel] = useState(1);

  if (!unlocked) {
    return (
      <section className="max-w-sm mx-auto rounded-3xl bg-[#12151C] border border-white/[0.07] p-5 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#10B981]/15 text-[#34D399] flex items-center justify-center">
            <KlShieldIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-black text-white">Admin-Bereich</h2>
            <p className="text-xs text-slate-400">Standard-PIN: 1234</p>
          </div>
        </div>

        <form onSubmit={handleUnlock} className="space-y-3">
          <input
            type="password"
            value={pinInput}
            onChange={e => setPinInput(e.target.value)}
            placeholder="Admin-PIN"
            className="w-full min-h-[44px] px-4 rounded-2xl bg-[#090B0F] border border-white/10 text-sm text-white focus:outline-none focus:border-[#10B981]"
          />
          {pinError && <p className="text-xs font-bold text-rose-400">{pinError}</p>}
          <button
            type="submit"
            className="w-full min-h-[44px] rounded-2xl bg-[#10B981] text-slate-950 text-xs font-black cursor-pointer"
          >
            Entsperren
          </button>
        </form>
      </section>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-black text-white">Admin</h2>
        <button
          type="button"
          onClick={() => setUnlocked(false)}
          className="min-h-[34px] px-3 rounded-xl bg-[#12151C] text-xs font-bold text-slate-300 cursor-pointer"
        >
          Sperren
        </button>
      </div>

      {adminFeedback && (
        <div className="p-3 rounded-2xl bg-[#10B981]/15 border border-[#10B981]/35 text-xs font-bold text-[#34D399] flex items-center justify-between">
          <span>{adminFeedback}</span>
          <button
            type="button"
            onClick={() => setAdminFeedback('')}
            className="cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* NEUE PROFILE FREIGEBEN */}
      <section className="rounded-3xl bg-[#12151C] border border-amber-500/35 p-4 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-black text-white">
            Freigaben ({pendingApprovalMembers.length})
          </h3>
          <button
            type="button"
            onClick={onToggleDirectEntry}
            className={`min-h-[32px] px-3 rounded-full text-[11px] font-black cursor-pointer ${
              allowDirectEntry
                ? 'bg-[#10B981]/20 text-[#34D399]'
                : 'bg-[#090B0F] text-slate-400'
            }`}
          >
            Direkteinstieg: {allowDirectEntry ? 'AN' : 'AUS'}
          </button>
        </div>

        {pendingApprovalMembers.length === 0 ? (
          <p className="text-xs text-slate-400">Keine offenen Neuanmeldungen.</p>
        ) : (
          <div className="space-y-2">
            {pendingApprovalMembers.map(member => (
              <div
                key={member.id}
                className="p-3 rounded-2xl bg-[#090B0F] space-y-2.5"
              >
                <div>
                  <p className="text-sm font-black text-white">
                    {member.nickname}{' '}
                    <span className="text-xs font-normal text-slate-400">
                      ({member.firstName} {member.lastName})
                    </span>
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {member.whatsapp || 'Kein WhatsApp'} · {member.language} ·
                    Folgemonat: {member.nextMonthOptIn ? 'Dabei' : 'Warten'}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      onApproveMember(member.id);
                      setAdminFeedback(`${member.nickname} freigegeben.`);
                    }}
                    className="min-h-[36px] px-3 rounded-xl bg-[#10B981] text-slate-950 text-xs font-black cursor-pointer"
                  >
                    Freigeben
                  </button>

                  {allowDirectEntry && (
                    <button
                      type="button"
                      onClick={() => {
                        onDirectEntryMember(member.id);
                        setAdminFeedback(
                          `${member.nickname} freigegeben & direkt eingeteilt.`
                        );
                      }}
                      className="min-h-[36px] px-3 rounded-xl bg-sky-500 text-slate-950 text-xs font-black cursor-pointer"
                    >
                      + Direkteinstieg
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => onDeleteMember(member.id)}
                    className="min-h-[36px] px-3 rounded-xl bg-rose-500/20 text-rose-200 text-xs font-black cursor-pointer"
                  >
                    Ablehnen
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* MONATSABSCHLUSS-CHECK */}
      <section className="rounded-3xl bg-[#12151C] border border-white/[0.07] p-4 space-y-2.5">
        <h3 className="text-sm font-black text-white">Monatsabschluss auf Home</h3>
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
              className={`min-h-[38px] px-2 rounded-xl text-xs font-black cursor-pointer ${
                monthEndMode === opt.id
                  ? 'bg-[#10B981] text-slate-950'
                  : 'bg-[#090B0F] text-slate-300'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </section>

      {/* MONATSWECHSEL */}
      <section className="rounded-3xl bg-[#12151C] border border-white/[0.07] p-4 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-black text-white">Monatsrunden</h3>
            <p className="text-[11px] text-slate-400">
              Nächsten Monat mit Auf-/Abstieg generieren
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              const createdLabel = onCreateNextMonth();
              if (createdLabel) {
                setAdminFeedback(`Neuer Monat "${createdLabel}" erstellt.`);
              }
            }}
            className="min-h-[38px] px-3.5 rounded-xl bg-[#10B981] text-slate-950 text-xs font-black shrink-0 cursor-pointer"
          >
            + Neuer Monat
          </button>
        </div>

        <div className="space-y-1.5">
          {seasons.map(season => (
            <div
              key={season.id}
              className="p-2.5 rounded-2xl bg-[#090B0F] flex items-center justify-between gap-2"
            >
              <span className="text-xs font-bold text-white">{season.label}</span>
              {seasons.length > 1 && (
                <div>
                  {confirmDeleteSeasonId === season.id ? (
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          onDeleteSeason(season.id);
                          setConfirmDeleteSeasonId(null);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-rose-500 text-white text-[11px] font-black cursor-pointer"
                      >
                        Löschen
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteSeasonId(null)}
                        className="px-2 py-1 rounded-lg bg-white/10 text-slate-300 text-[11px] cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteSeasonId(season.id)}
                      className="px-2.5 py-1 rounded-lg bg-rose-500/15 text-rose-300 text-[11px] font-bold cursor-pointer"
                    >
                      Löschen
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* LIGAZUTEILUNG & MATCH-RESET */}
      {activeSeason && (
        <section className="rounded-3xl bg-[#12151C] border border-white/[0.07] p-4 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-black text-white">
              Ligen & Matches ({activeSeason.shortLabel})
            </h3>
          </div>

          {unassignedActiveMembers.length > 0 && activeSeason.groups.length > 0 && (
            <div className="p-3 rounded-2xl bg-[#090B0F] border border-[#10B981]/30 space-y-2">
              <p className="text-[11px] font-black text-[#34D399]">
                Nicht zugeteilte Spieler in {activeSeason.shortLabel} ({unassignedActiveMembers.length})
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <select
                  value={
                    unassignedActiveMembers.some(m => m.id === selectedUnassignedId)
                      ? selectedUnassignedId
                      : unassignedActiveMembers[0]?.id || ''
                  }
                  onChange={e => setSelectedUnassignedId(e.target.value)}
                  className="flex-1 min-h-[38px] px-2.5 rounded-xl bg-[#12151C] border border-white/10 text-xs font-bold text-white"
                >
                  {unassignedActiveMembers.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.nickname} ({m.firstName} {m.lastName})
                    </option>
                  ))}
                </select>

                <select
                  value={
                    activeSeason.groups.some(g => g.level === selectedTargetLevel)
                      ? selectedTargetLevel
                      : activeSeason.groups[activeSeason.groups.length - 1]?.level || 1
                  }
                  onChange={e => setSelectedTargetLevel(Number(e.target.value))}
                  className="min-h-[38px] px-2.5 rounded-xl bg-[#12151C] border border-white/10 text-xs font-bold text-white"
                >
                  {activeSeason.groups.map(g => (
                    <option key={g.level} value={g.level}>
                      {g.name}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={() => {
                    const pid = unassignedActiveMembers.some(
                      m => m.id === selectedUnassignedId
                    )
                      ? selectedUnassignedId
                      : unassignedActiveMembers[0]?.id;
                    const lvl = activeSeason.groups.some(
                      g => g.level === selectedTargetLevel
                    )
                      ? selectedTargetLevel
                      : activeSeason.groups[activeSeason.groups.length - 1]?.level || 1;
                    if (!pid) return;
                    onAddPlayerToLeague(activeSeason.id, lvl, pid);
                    const memberName = membersMap[pid]?.nickname || 'Spieler';
                    setAdminFeedback(
                      `${memberName} zur ${lvl}. Liga (${activeSeason.shortLabel}) hinzugefügt.`
                    );
                  }}
                  className="min-h-[38px] px-3.5 rounded-xl bg-[#10B981] text-slate-950 text-xs font-black shrink-0 cursor-pointer"
                >
                  + Hinzufügen
                </button>
              </div>
            </div>
          )}

          {activeSeason.groups.map(group => (
            <div
              key={group.level}
              className="p-3 rounded-2xl bg-[#090B0F] space-y-2.5"
            >
              <p className="text-xs font-black text-[#34D399]">{group.name}</p>
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
                            className="px-2 py-1 rounded-lg bg-[#12151C] text-[11px] text-white"
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
                          className="px-2 py-1 rounded-lg bg-rose-500/15 text-rose-300 text-[11px] cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 border-t border-white/[0.07] space-y-1">
                {group.matches.map(match => {
                  const p1 = membersMap[match.player1Id];
                  const p2 = membersMap[match.player2Id];
                  if (!p1 || !p2) return null;
                  const hasResult = match.setsP1 !== null && match.setsP2 !== null;
                  return (
                    <div
                      key={match.id}
                      className="flex items-center justify-between gap-2 text-xs py-0.5"
                    >
                      <span className="text-slate-400 truncate">
                        {p1.nickname} vs {p2.nickname}
                      </span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="font-bold text-white">
                          {hasResult ? `${match.setsP1}:${match.setsP2}` : 'Offen'}
                        </span>
                        {hasResult && (
                          <button
                            type="button"
                            onClick={() => onAdminUpdateMatch(match.id, null, null)}
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

      {/* MITGLIEDERVERWALTUNG */}
      <section className="rounded-3xl bg-[#12151C] border border-white/[0.07] p-4 space-y-2.5">
        <h3 className="text-sm font-black text-white">
          Mitglieder ({allMembers.length})
        </h3>
        <div className="space-y-2">
          {allMembers.map(member => (
            <div
              key={member.id}
              className="p-3 rounded-2xl bg-[#090B0F] flex flex-col sm:flex-row sm:items-center justify-between gap-2"
            >
              <p className="text-xs font-black text-white">
                {member.nickname}{' '}
                <span className="text-slate-500 font-normal">
                  · PIN {member.pin}
                </span>
              </p>

              <div className="flex flex-wrap items-center gap-1.5">
                <select
                  value={member.status}
                  onChange={e => onUpdateMemberStatus(member.id, e.target.value)}
                  className="min-h-[32px] px-2 rounded-lg bg-[#12151C] text-xs font-bold text-white"
                >
                  <option value="Dabei">Dabei</option>
                  <option value="Offen">Offen</option>
                  <option value="Pausiert">Pausiert</option>
                  <option value="Gesperrt">Gesperrt</option>
                </select>

                <button
                  type="button"
                  onClick={() => onToggleMemberNextMonth(member.id)}
                  className={`min-h-[32px] px-2.5 rounded-lg text-xs font-black cursor-pointer ${
                    member.nextMonthOptIn
                      ? 'bg-[#10B981]/15 text-[#34D399]'
                      : 'bg-amber-500/15 text-amber-300'
                  }`}
                >
                  {member.nextMonthOptIn ? 'Folgemonat: Dabei' : 'Folgemonat: Pause'}
                </button>

                {confirmDeleteMemberId === member.id ? (
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        onDeleteMember(member.id);
                        setConfirmDeleteMemberId(null);
                      }}
                      className="min-h-[32px] px-2 rounded-lg bg-rose-500 text-white text-[11px] font-black cursor-pointer"
                    >
                      Löschen
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteMemberId(null)}
                      className="min-h-[32px] px-2 rounded-lg bg-white/10 text-slate-300 text-[11px] cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmDeleteMemberId(member.id)}
                    className="w-8 h-8 rounded-lg bg-rose-500/15 text-rose-300 flex items-center justify-center cursor-pointer"
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

      {/* ADMIN-PIN ÄNDERN */}
      <section className="rounded-3xl bg-[#12151C] border border-white/[0.07] p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-white">Admin-PIN</h3>
          <span className="text-[11px] font-mono text-slate-400">
            Aktiv: {adminPin}
          </span>
        </div>

        <form onSubmit={handleChangePin} className="flex gap-2">
          <input
            type="text"
            value={newPinInput}
            onChange={e => setNewPinInput(e.target.value)}
            placeholder="Neuer Admin-PIN"
            className="flex-1 min-h-[42px] px-3 rounded-xl bg-[#090B0F] border border-white/10 text-xs text-white"
          />
          <button
            type="submit"
            className="min-h-[42px] px-4 rounded-xl bg-[#10B981] text-slate-950 text-xs font-black shrink-0 cursor-pointer"
          >
            Überschreiben
          </button>
        </form>
        {pinSavedMsg && (
          <p className="text-xs font-bold text-[#34D399]">{pinSavedMsg}</p>
        )}

        <div className="pt-2 border-t border-white/[0.07] flex items-center justify-between">
          <span className="text-xs text-slate-400">Demo-Daten zurücksetzen</span>
          <button
            type="button"
            onClick={() => {
              onResetDemoData();
              setAdminFeedback('Demo-Daten zurückgesetzt.');
            }}
            className="min-h-[34px] px-3 rounded-xl bg-rose-500/15 text-rose-200 text-xs font-black cursor-pointer"
          >
            Reset
          </button>
        </div>
      </section>
    </div>
  );
}

// ============================================================================
// MODALS (MOBILE-FIRST BOTTOM-SHEET / CENTER DIALOGE)
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
      setError('Falscher Spieler-PIN.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full sm:max-w-sm rounded-t-3xl sm:rounded-3xl bg-[#12151C] border-t sm:border border-white/15 p-5 space-y-4">
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
            className="w-9 h-9 rounded-xl bg-white/5 text-slate-400 flex items-center justify-center cursor-pointer"
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
            placeholder="••••"
            className="w-full min-h-[48px] px-4 rounded-2xl bg-[#090B0F] border border-white/10 text-center text-lg font-mono tracking-widest text-white focus:outline-none focus:border-[#10B981]"
          />
          {error && <p className="text-xs font-bold text-rose-400">{error}</p>}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 min-h-[46px] rounded-2xl bg-white/5 text-xs font-bold text-slate-300 cursor-pointer"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              className="flex-1 min-h-[46px] rounded-2xl bg-[#10B981] text-slate-950 text-xs font-black cursor-pointer"
            >
              Öffnen
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
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl bg-[#12151C] border-t sm:border border-white/15 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black text-white">Resultat eintragen</h3>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/5 text-slate-400 flex items-center justify-center cursor-pointer"
          >
            <KlXIcon className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 rounded-2xl bg-[#090B0F] text-center space-y-1">
          <p className="text-sm font-black text-white">
            {p1.nickname} <span className="text-slate-500">vs</span> {p2.nickname}
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
              className={`min-h-[46px] rounded-2xl text-sm font-black cursor-pointer ${
                setsP1 === s1 && setsP2 === s2
                  ? 'bg-[#10B981] text-slate-950'
                  : 'bg-[#090B0F] text-slate-200'
              }`}
            >
              {s1} : {s2}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 min-h-[46px] rounded-2xl bg-white/5 text-xs font-bold text-slate-300 cursor-pointer"
          >
            Abbrechen
          </button>
          <button
            type="button"
            onClick={() => {
              onSaveResult(match.id, setsP1, setsP2);
              onClose();
            }}
            className="flex-1 min-h-[46px] rounded-2xl bg-[#10B981] text-slate-950 text-xs font-black cursor-pointer"
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
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto">
      <div className="w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl bg-[#12151C] border-t sm:border border-white/15 p-5 space-y-4 max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${member.avatarBg} flex items-center justify-center text-white font-black text-sm`}
            >
              {member.nickname.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h3 className="text-base font-black text-white">{member.nickname}</h3>
              <p className="text-xs text-slate-400">
                {memberGroup ? memberGroup.name : member.status} · {member.annualPoints}{' '}
                Pkt
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/5 text-slate-400 flex items-center justify-center cursor-pointer"
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
                  className="w-full min-h-[42px] px-3 rounded-xl bg-[#090B0F] border border-white/10 text-xs text-white"
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
                  className="w-full min-h-[42px] px-3 rounded-xl bg-[#090B0F] border border-white/10 text-xs text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">
                  WhatsApp (CH)
                </label>
                <input
                  type="text"
                  value={whatsapp}
                  onChange={e => setWhatsapp(e.target.value)}
                  placeholder="079 269 66 89"
                  className="w-full min-h-[42px] px-3 rounded-xl bg-[#090B0F] border border-white/10 text-xs text-white"
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
                  className="w-full min-h-[42px] px-3 rounded-xl bg-[#090B0F] border border-white/10 text-xs text-white"
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
                  className="w-full min-h-[42px] px-3 rounded-xl bg-[#090B0F] border border-white/10 text-xs text-white"
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
                  className="w-full min-h-[42px] px-3 rounded-xl bg-[#090B0F] border border-white/10 text-xs text-white"
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
                Kurzbeschreibung
              </label>
              <input
                type="text"
                value={bio}
                onChange={e => setBio(e.target.value)}
                className="w-full min-h-[42px] px-3 rounded-xl bg-[#090B0F] border border-white/10 text-xs text-white"
              />
            </div>

            {/* HALLENTAGE IN STAMMDATEN */}
            <div className="p-3 rounded-2xl bg-[#090B0F] space-y-2.5">
              <p className="text-[11px] font-black uppercase tracking-wider text-[#34D399]">
                Übliche Hallentage & Zeiten
              </p>
              <div className="flex flex-wrap gap-1.5">
                {WEEKDAYS.map(day => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    className={`min-h-[36px] px-3 rounded-xl text-xs font-black cursor-pointer ${
                      usualDays.includes(day)
                        ? 'bg-[#10B981] text-slate-950'
                        : 'bg-[#12151C] text-slate-300'
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
                    className={`min-h-[36px] px-3 rounded-xl text-xs font-bold cursor-pointer ${
                      usualSlots.includes(slot)
                        ? 'bg-sky-500 text-slate-950'
                        : 'bg-[#12151C] text-slate-300'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="flex-1 min-h-[46px] rounded-2xl bg-white/5 text-xs font-bold text-slate-300 cursor-pointer"
              >
                Abbrechen
              </button>
              <button
                type="submit"
                className="flex-1 min-h-[46px] rounded-2xl bg-[#10B981] text-slate-950 text-xs font-black cursor-pointer"
              >
                Speichern
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-[#090B0F] space-y-2">
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
                <span className="text-slate-500 font-bold">Hallentage:</span>{' '}
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

            <div className="flex gap-2">
              {waUrl && (
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 min-h-[46px] px-4 rounded-2xl bg-[#10B981] text-slate-950 font-black inline-flex items-center justify-center gap-1.5"
                >
                  <KlMessageIcon className="w-4 h-4" />
                  <span>WhatsApp</span>
                </a>
              )}
              {isOwnProfile && (
                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  className="flex-1 min-h-[46px] px-4 rounded-2xl bg-white/10 text-white font-black inline-flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <KlEditIcon className="w-4 h-4" />
                  <span>Bearbeiten</span>
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
      setError('Bitte einen PIN mit mindestens 4 Zeichen festlegen.');
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
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto">
      <div className="w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl bg-[#12151C] border-t sm:border border-white/15 p-5 space-y-3.5 max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-white">NEW PLAYER</h3>
            <p className="text-[11px] text-slate-400">
              Admin-Freigabe nach Erstellung erforderlich
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/5 text-slate-400 flex items-center justify-center cursor-pointer"
          >
            <KlXIcon className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
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
              className="w-full min-h-[44px] px-3.5 rounded-2xl bg-[#090B0F] border border-[#10B981]/40 text-sm text-white focus:outline-none focus:border-[#10B981]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-300 mb-1">
              Persönlicher PIN (mind. 4 Zeichen) *
            </label>
            <input
              type="text"
              required
              value={pin}
              onChange={e => setPin(e.target.value)}
              placeholder="z.B. 4821"
              className="w-full min-h-[44px] px-3.5 rounded-2xl bg-[#090B0F] border border-white/10 text-sm text-white focus:outline-none focus:border-[#10B981]"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              placeholder="Vorname"
              className="w-full min-h-[42px] px-3 rounded-xl bg-[#090B0F] border border-white/10 text-xs text-white"
            />
            <input
              type="text"
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              placeholder="Nachname"
              className="w-full min-h-[42px] px-3 rounded-xl bg-[#090B0F] border border-white/10 text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 mb-1">
              WhatsApp Nummer (Schweizer Format)
            </label>
            <input
              type="tel"
              value={whatsapp}
              onChange={e => setWhatsapp(e.target.value)}
              placeholder="079 269 66 89"
              className="w-full min-h-[42px] px-3.5 rounded-xl bg-[#090B0F] border border-white/10 text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 mb-1">
              Welche Sprache wird gesprochen?
            </label>
            <div className="grid grid-cols-2 gap-2">
              <label className="min-h-[42px] flex items-center gap-2 px-3 rounded-xl bg-[#090B0F] border border-white/10 text-xs font-bold text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={langDe}
                  onChange={e => setLangDe(e.target.checked)}
                  className="accent-[#10B981] w-4 h-4"
                />
                <span>Deutsch (DE)</span>
              </label>
              <label className="min-h-[42px] flex items-center gap-2 px-3 rounded-xl bg-[#090B0F] border border-white/10 text-xs font-bold text-white cursor-pointer">
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
              className="w-full min-h-[42px] px-3 rounded-xl bg-[#090B0F] border border-white/10 text-xs text-white"
            >
              {PLAY_STYLES.map(s => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="p-3 rounded-2xl bg-[#090B0F] space-y-2">
            <label className="flex items-center gap-2.5 text-xs text-white cursor-pointer">
              <input
                type="checkbox"
                checked={startOption === 'nextMonth'}
                onChange={() => setStartOption('nextMonth')}
                className="accent-[#10B981] w-4 h-4"
              />
              <span className="font-bold">Ich möchte direkt im Folgemonat starten</span>
            </label>
            <label className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={startOption === 'wait'}
                onChange={() => setStartOption('wait')}
                className="accent-amber-500 w-4 h-4"
              />
              <span className="font-bold">Ich möchte noch warten (Pause)</span>
            </label>
          </div>

          {error && <p className="text-xs font-bold text-rose-400">{error}</p>}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 min-h-[46px] rounded-2xl bg-white/5 text-xs font-bold text-slate-300 cursor-pointer"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              className="flex-1 min-h-[46px] rounded-2xl bg-[#10B981] text-slate-950 text-xs font-black cursor-pointer"
            >
              Erstellen
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
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl bg-[#12151C] border-t sm:border border-white/15 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black text-white">Hallen Check-in</h3>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/5 text-slate-400 flex items-center justify-center cursor-pointer"
          >
            <KlXIcon className="w-4 h-4" />
          </button>
        </div>

        {!currentUser ? (
          <div className="space-y-2.5">
            <p className="text-xs text-slate-300">Wähle zuerst dein Profil:</p>
            <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto">
              {Object.values(membersMap).map(m => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    onClose();
                    onRequestSelectUser(m.id);
                  }}
                  className="min-h-[38px] px-3 rounded-xl bg-[#090B0F] text-xs font-bold text-white cursor-pointer"
                >
                  {m.nickname}
                </button>
              ))}
            </div>
          </div>
        ) : isLive ? (
          <div className="space-y-3">
            <div className="p-3.5 rounded-2xl bg-[#090B0F] border border-[#10B981]/35">
              <p className="text-xs font-black text-[#34D399]">
                Eingecheckt · noch{' '}
                {formatRemainingTime(currentUser.checkedInUntil, nowTick)}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {currentUser.checkInMood || CHECKIN_MOODS[0]}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                onCheckOut(currentUser.id);
                onClose();
              }}
              className="w-full min-h-[46px] rounded-2xl bg-rose-500 text-white text-xs font-black cursor-pointer"
            >
              CHECK-OUT
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="grid grid-cols-4 gap-1.5">
              {[60, 90, 120, 180].map(m => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMinutes(m)}
                  className={`min-h-[42px] rounded-xl text-xs font-black cursor-pointer ${
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
              className="w-full min-h-[44px] px-3 rounded-xl bg-[#090B0F] border border-white/10 text-xs font-bold text-white"
            >
              {CHECKIN_MOODS.map(item => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onGoToHallTab();
                }}
                className="flex-1 min-h-[46px] rounded-2xl bg-white/5 text-xs font-bold text-slate-300 cursor-pointer"
              >
                LIVE-Ansicht
              </button>
              <button
                type="button"
                onClick={() => {
                  onCheckIn(currentUser.id, minutes, mood);
                  onClose();
                }}
                className="flex-1 min-h-[46px] rounded-2xl bg-[#10B981] text-slate-950 text-xs font-black cursor-pointer"
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
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl bg-[#12151C] border-t sm:border border-white/15 p-5 space-y-3.5 max-h-[88vh] flex flex-col">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black text-white">Spielerprofil</h3>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/5 text-slate-400 flex items-center justify-center cursor-pointer"
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
          className="w-full min-h-[44px] rounded-2xl bg-[#10B981] text-slate-950 text-xs font-black inline-flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
        >
          <KlUserPlusIcon className="w-4 h-4" />
          <span>NEW PLAYER</span>
        </button>

        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Nickname suchen..."
          className="w-full min-h-[42px] px-3.5 rounded-xl bg-[#090B0F] border border-white/10 text-xs text-white shrink-0"
        />

        <div className="overflow-y-auto space-y-1.5 flex-1">
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
                className={`w-full flex items-center justify-between p-3 rounded-2xl border text-left cursor-pointer ${
                  selected
                    ? 'bg-[#10B981]/15 border-[#10B981]/40'
                    : 'bg-[#090B0F] border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-xl bg-gradient-to-br ${m.avatarBg} flex items-center justify-center text-white font-black text-xs shrink-0`}
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
                  <span className="text-[11px] font-black text-[#34D399]">Aktiv</span>
                ) : (
                  <span className="text-[11px] font-bold text-slate-400">PIN →</span>
                )}
              </button>
            );
          })}
        </div>

        {currentUser && (
          <div className="flex gap-2 pt-2 border-t border-white/10 shrink-0">
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenOwnDetails(currentUser.id);
              }}
              className="flex-1 min-h-[42px] rounded-xl bg-white/10 text-xs font-bold text-white cursor-pointer"
            >
              Stammdaten
            </button>
            <button
              type="button"
              onClick={() => {
                onClearUser();
                onClose();
              }}
              className="px-3.5 min-h-[42px] rounded-xl bg-rose-500/15 text-xs font-bold text-rose-300 cursor-pointer"
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
// HAUPTKOMPONENTE APP (MOBILE-FIRST BOTTOM NAV + CLEAN HEADER)
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
    setSelectedSeasonId('2026-11');
    setCurrentUserId('m1');
    setMonthEndMode('auto');
  };

  const primaryTabs = [
    { id: 'home', label: 'Home', Icon: KlHomeIcon },
    { id: 'leagues', label: 'Liga', Icon: KlTrophyIcon },
    { id: 'hall', label: 'LIVE', Icon: KlMapPinIcon, badge: liveCount },
    { id: 'nextmonth', label: 'Folgemonat', Icon: KlCalendarIcon },
  ];

  const secondaryTabs = [
    { id: 'recent', label: 'Spiele', Icon: KlHistoryIcon },
    { id: 'annual', label: 'Rangliste', Icon: KlAwardIcon },
    { id: 'players', label: 'Spieler', Icon: KlUsersIcon },
  ];

  return (
    <div className="min-h-screen bg-[#090B0F] text-slate-100 flex flex-col pb-20 sm:pb-8">
      {/* KOMPAKTER MOBILE-FIRST HEADER */}
      <header className="sticky top-0 z-30 bg-[#090B0F]/90 backdrop-blur-md border-b border-white/[0.07]">
        <div className="max-w-3xl mx-auto px-4 py-2.5 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2 text-left cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-[#10B981] flex items-center justify-center text-slate-950 font-black text-xs">
              KL
            </div>
            <span className="text-sm font-black tracking-tight text-white">
              KONGLeague
            </span>
          </button>

          <div className="flex items-center gap-2">
            {isCurrentUserLive && currentUser ? (
              <button
                type="button"
                onClick={() => handleCheckOut(currentUser.id)}
                className="min-h-[36px] px-3 rounded-xl bg-rose-500 text-white text-xs font-black inline-flex items-center gap-1.5 cursor-pointer"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                <span>CHECK-OUT</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setShowQuickCheckInModal(true)}
                className="min-h-[36px] px-3 rounded-xl bg-[#12151C] border border-[#10B981]/35 text-[#34D399] text-xs font-black inline-flex items-center gap-1.5 cursor-pointer"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                <span>LIVE ({liveCount})</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setShowProfileSwitchModal(true)}
              className="min-h-[36px] px-2.5 rounded-xl bg-[#12151C] border border-white/10 text-xs font-black text-white inline-flex items-center gap-1.5 cursor-pointer"
            >
              {currentUser ? (
                <>
                  <span
                    className={`w-5 h-5 rounded-md bg-gradient-to-br ${currentUser.avatarBg} flex items-center justify-center text-[9px] font-black text-white shrink-0`}
                  >
                    {currentUser.nickname.slice(0, 2).toUpperCase()}
                  </span>
                  <span className="max-w-[85px] sm:max-w-[130px] truncate">
                    {currentUser.nickname}
                  </span>
                </>
              ) : (
                <span className="text-[#34D399]">Profil</span>
              )}
              <KlChevronDownIcon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            </button>
          </div>
        </div>

        {/* SUB-NAVIGATION FÜR WEITERE ANSICHTEN (MOBILE SCROLLBAR, DESKTOP ALLES IN EINER LEISTE) */}
        <div className="max-w-3xl mx-auto px-4 pb-2 flex items-center gap-1.5 overflow-x-auto">
          <div className="hidden sm:flex items-center gap-1.5">
            {primaryTabs.map(tab => {
              const Icon = tab.Icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`min-h-[34px] px-3 rounded-xl text-xs font-black inline-flex items-center gap-1.5 cursor-pointer ${
                    active
                      ? 'bg-[#10B981] text-slate-950'
                      : 'bg-[#12151C] text-slate-300 hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                  {typeof tab.badge === 'number' && tab.badge > 0 && (
                    <span
                      className={`px-1.5 rounded-full text-[10px] ${
                        active
                          ? 'bg-slate-950 text-[#34D399]'
                          : 'bg-[#10B981]/20 text-[#34D399]'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {secondaryTabs.map(tab => {
            const Icon = tab.Icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`min-h-[32px] px-2.5 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shrink-0 cursor-pointer ${
                  active
                    ? 'bg-white text-slate-950 font-black'
                    : 'bg-[#12151C] text-slate-400 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => setActiveTab('admin')}
            className={`min-h-[32px] px-2.5 rounded-xl text-xs font-bold inline-flex items-center gap-1 shrink-0 ml-auto cursor-pointer ${
              activeTab === 'admin'
                ? 'bg-amber-400 text-slate-950 font-black'
                : 'bg-[#12151C] text-slate-500 hover:text-slate-300'
            }`}
          >
            <KlLockIcon className="w-3 h-3" />
            <span>Admin</span>
          </button>
        </div>
      </header>

      {/* HAUPTINHALT */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-4">
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

      {/* MOBILE-FIRST FIXED BOTTOM NAVIGATION */}
      <nav className="sm:hidden fixed bottom-0 inset-x-0 z-30 bg-[#090B0F]/95 backdrop-blur-md border-t border-white/[0.08] px-2 py-1.5">
        <div className="grid grid-cols-4 gap-1">
          {primaryTabs.map(tab => {
            const Icon = tab.Icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`min-h-[48px] rounded-2xl flex flex-col items-center justify-center gap-0.5 relative cursor-pointer ${
                  active
                    ? 'bg-[#10B981]/15 text-[#34D399]'
                    : 'text-slate-400'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-black">{tab.label}</span>
                {typeof tab.badge === 'number' && tab.badge > 0 && (
                  <span className="absolute top-1.5 right-4 px-1.5 rounded-full bg-[#10B981] text-slate-950 text-[9px] font-black">
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
