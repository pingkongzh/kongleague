import React, { useMemo, useState } from 'react';

const STT_LEVEL_OPTIONS = [
  { value: 'Hobby', label: 'Hobby (ohne Klassierung)', rank: 10 },
  { value: '≈ D-Niveau', label: '≈ D-Niveau (Selbsteinschätzung)', rank: 22 },
  { value: '≈ C-Niveau', label: '≈ C-Niveau (Selbsteinschätzung)', rank: 36 },
  { value: '≈ B-Niveau', label: '≈ B-Niveau (Selbsteinschätzung)', rank: 52 },
  { value: 'D1', label: 'D1', rank: 16 },
  { value: 'D2', label: 'D2', rank: 18 },
  { value: 'D3', label: 'D3', rank: 20 },
  { value: 'D4', label: 'D4', rank: 22 },
  { value: 'D5', label: 'D5', rank: 24 },
  { value: 'C6', label: 'C6', rank: 30 },
  { value: 'C7', label: 'C7', rank: 32 },
  { value: 'C8', label: 'C8', rank: 34 },
  { value: 'C9', label: 'C9', rank: 36 },
  { value: 'C10', label: 'C10', rank: 38 },
  { value: 'B11', label: 'B11', rank: 45 },
  { value: 'B12', label: 'B12', rank: 47 },
  { value: 'B13', label: 'B13', rank: 49 },
  { value: 'B14', label: 'B14', rank: 51 },
  { value: 'B15', label: 'B15', rank: 53 },
  { value: 'A16+', label: 'A16+', rank: 65 },
];

const LANGUAGE_OPTIONS = [
  { value: 'Deutsch', label: 'Deutsch', shortLabel: 'DE' },
  { value: 'Englisch', label: 'Englisch', shortLabel: 'EN' },
  { value: 'Beides', label: 'Beides (DE & EN)', shortLabel: 'DE/EN' },
];

const PLAYSTYLE_OPTIONS = [
  { value: 'Offensiv', label: 'Offensiv' },
  { value: 'Allround', label: 'Allround' },
  { value: 'Abwehr / Noppen', label: 'Abwehr / Noppen' },
];

function normalizeWhatsAppPhone(rawPhone = '') {
  const trimmed = String(rawPhone || '').trim();
  if (!trimmed) return '';
  if (trimmed.startsWith('00')) {
    return '+' + trimmed.slice(2).replace(/[^\d\s]/g, '');
  }
  return trimmed;
}

function validateWhatsAppPhone(rawPhone = '') {
  const normalized = normalizeWhatsAppPhone(rawPhone);
  if (!normalized) {
    return { valid: false, error: 'Bitte WhatsApp-Telefonnummer mit Ländervorwahl eingeben (z. B. +41 79 123 45 67).' };
  }
  if (normalized.startsWith('0') && !normalized.startsWith('00')) {
    return {
      valid: false,
      error: 'Bitte statt der führenden «0» die Ländervorwahl eingeben (z. B. +41 79... oder +49 170...).',
    };
  }
  if (!normalized.startsWith('+')) {
    return {
      valid: false,
      error: 'Bitte die Nummer mit «+» und Ländervorwahl beginnen (z. B. +41..., +49..., +33...).',
    };
  }
  if (/^\+\d{1,3}\s*0/.test(normalized)) {
    return {
      valid: false,
      error: 'Bitte die erste «0» nach der Ländervorwahl weglassen (z. B. +41 79... statt +41 079...).',
    };
  }
  const digitsOnly = normalized.replace(/\D/g, '');
  if (digitsOnly.length < 8 || digitsOnly.length > 15) {
    return {
      valid: false,
      error: 'Die Telefonnummer scheint unvollständig oder zu lang zu sein (8–15 Ziffern inkl. Ländervorwahl).',
    };
  }
  return { valid: true, normalized, digitsOnly };
}

function getWhatsAppPhoneHint(rawPhone = '') {
  const trimmed = String(rawPhone || '').trim();
  if (!trimmed) {
    return {
      status: 'neutral',
      text: 'Mit Ländervorwahl eingeben, z. B. +41 79 123 45 67 oder +49 170 1234567',
    };
  }
  if (trimmed.startsWith('00')) {
    return {
      status: 'info',
      text: '«00...» wird automatisch in «+...» umgewandelt (ohne erste Null der Ortsvorwahl).',
    };
  }
  const check = validateWhatsAppPhone(trimmed);
  if (!check.valid) {
    return {
      status: 'warning',
      text: check.error,
    };
  }
  return {
    status: 'valid',
    text: `Gültige internationale Nummer (wa.me/${check.digitsOnly}) ✓`,
  };
}

function WhatsAppPhoneField({ value, onChange, required = false, placeholder = '+41 79 123 45 67' }) {
  const hint = getWhatsAppPhoneHint(value);

  return (
    <div className="space-y-1.5">
      <label className="block text-[11px] font-semibold text-[#8E95A2]">
        WhatsApp-Nummer (mit Ländervorwahl){required ? ' *' : ''}
      </label>

      <input
        type="tel"
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full min-w-0 rounded-xl border bg-[#0F1114] px-3 py-2 text-base sm:text-xs text-[#F3F4F6] focus:outline-none ${
          hint.status === 'warning'
            ? 'border-amber-500/60'
            : hint.status === 'valid'
            ? 'border-[#6FB3A2]/60'
            : 'border-[#2B2F37]'
        }`}
      />

      <div
        className={`flex items-start gap-1.5 rounded-lg px-2.5 py-1.5 text-[10px] leading-snug ${
          hint.status === 'warning'
            ? 'border border-amber-500/35 bg-amber-950/25 text-amber-200'
            : hint.status === 'valid'
            ? 'border border-[#6FB3A2]/35 bg-[#152622]/60 text-[#A8D0B1]'
            : 'bg-[#0F1114]/80 text-[#8E95A2]'
        }`}
      >
        <span className="shrink-0">
          {hint.status === 'warning' ? '⚠️' : hint.status === 'valid' ? '✓' : '🌍'}
        </span>
        <span>{hint.text}</span>
      </div>
    </div>
  );
}

const getLanguageShortLabel = (lang) => {
  const found = LANGUAGE_OPTIONS.find((opt) => opt.value === lang);
  return found ? found.shortLabel : 'DE';
};

const getSttRankValue = (sttClass) => {
  const found = STT_LEVEL_OPTIONS.find((opt) => opt.value === sttClass);
  return found ? found.rank : 15;
};

const getInitialRatingForStt = (sttClass) => {
  const r = getSttRankValue(sttClass);
  return Math.round(1080 + r * 9.5);
};

const getConnectRatingTier = (elo) => {
  if (elo >= 1520) {
    return {
      key: 'master',
      label: 'Master',
      symbol: '★',
      badgeClass: 'border-[#DE754B]/60 bg-[#2C1912] text-[#F4ECC2]',
    };
  }
  if (elo >= 1420) {
    return {
      key: 'platin',
      label: 'Platin',
      symbol: '◆',
      badgeClass: 'border-[#6FB3A2]/60 bg-[#152622] text-[#A8D0B1]',
    };
  }
  if (elo >= 1320) {
    return {
      key: 'gold',
      label: 'Gold',
      symbol: '▲',
      badgeClass: 'border-[#F4ECC2]/45 bg-[#2A2718] text-[#F4ECC2]',
    };
  }
  if (elo >= 1220) {
    return {
      key: 'silber',
      label: 'Silber',
      symbol: '●',
      badgeClass: 'border-[#A8D0B1]/40 bg-[#17211A] text-[#A8D0B1]',
    };
  }
  return {
    key: 'rookie',
    label: 'Rookie',
    symbol: '○',
    badgeClass: 'border-[#2B2F37] bg-[#121417] text-[#9CA3AF]',
  };
};

const computeConnectRatings = (players, connectMatches) => {
  const map = {};
  players.forEach((p) => {
    map[p.id] = {
      elo: getInitialRatingForStt(p.sttClass),
      played: 0,
      wins: 0,
      losses: 0,
    };
  });

  const chronological = [...connectMatches].reverse();
  const matchDeltas = {};

  chronological.forEach((m) => {
    const p1 = map[m.player1Id];
    const p2 = map[m.player2Id];
    if (!p1 || !p2) return;

    const p1Won = m.winnerId === m.player1Id;
    const expected1 = 1 / (1 + Math.pow(10, (p2.elo - p1.elo) / 400));
    const expected2 = 1 - expected1;
    const kFactor = 24;

    const delta1 = Math.round(kFactor * ((p1Won ? 1 : 0) - expected1));
    const delta2 = Math.round(kFactor * ((p1Won ? 0 : 1) - expected2));

    p1.elo += delta1;
    p2.elo += delta2;
    p1.played += 1;
    p2.played += 1;
    if (p1Won) {
      p1.wins += 1;
      p2.losses += 1;
    } else {
      p2.wins += 1;
      p1.losses += 1;
    }

    matchDeltas[m.id] = { delta1, delta2 };
  });

  Object.keys(map).forEach((id) => {
    map[id].tier = getConnectRatingTier(map[id].elo);
  });

  return { ratingsByPlayer: map, matchDeltas };
};

const INITIAL_PLAYERS = [
  {
    id: 'p1',
    firstName: 'Lukas',
    lastName: 'Meier',
    nickname: 'SpinMaster',
    pin: '1234',
    avatarUrl:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80',
    phone: '+41 79 111 22 33',
    sttClass: 'B11',
    language: 'Beides',
    playstyle: 'Offensiv',
    connectOnly: false,
    isNewMember: false,
    joinedLabel: '2022',
    bio: 'Spiele gerne lange Topspin-Ballwechsel und bin oft dienstags & donnerstags in der Halle.',
    typicalHallDays: ['Di', 'Do'],
  },
  {
    id: 'p2',
    firstName: 'Sarah',
    lastName: 'Keller',
    nickname: 'BackhandQueen',
    pin: '1234',
    avatarUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80',
    phone: '+41 79 222 33 44',
    sttClass: 'C9',
    language: 'Deutsch',
    playstyle: 'Offensiv',
    connectOnly: false,
    isNewMember: false,
    joinedLabel: '2023',
    bio: 'Suche jederzeit unkomplizierte Trainingspartner für Sätze oder Systemtraining.',
    typicalHallDays: ['Mo', 'Do'],
  },
  {
    id: 'p3',
    firstName: 'Marco',
    lastName: 'Brunner',
    nickname: 'TopspinMarco',
    pin: '1234',
    avatarUrl:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80',
    phone: '+41 79 333 44 55',
    sttClass: 'C8',
    language: 'Deutsch',
    playstyle: 'Allround',
    connectOnly: false,
    isNewMember: false,
    joinedLabel: '2021',
    bio: 'Immer für ein Best-of-5 oder ein lockeres Einspielen vor dem Feierabend zu haben.',
    typicalHallDays: ['Di', 'Fr'],
  },
  {
    id: 'p4',
    firstName: 'Elena',
    lastName: 'Vogt',
    nickname: 'NetEdgeElena',
    pin: '1234',
    avatarUrl:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=160&q=80',
    phone: '+41 79 444 55 66',
    sttClass: 'C7',
    language: 'Beides',
    playstyle: 'Allround',
    connectOnly: false,
    isNewMember: false,
    joinedLabel: '2024',
    bio: 'Freue mich über neue Gesichter im Club – meldet euch gerne spontan!',
    typicalHallDays: ['Mi', 'Fr'],
  },
  {
    id: 'p5',
    firstName: 'Timo',
    lastName: 'Steiner',
    nickname: 'SmashTimo',
    pin: '1234',
    avatarUrl:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=160&q=80',
    phone: '+41 79 555 66 77',
    sttClass: 'D4',
    language: 'Deutsch',
    playstyle: 'Offensiv',
    connectOnly: false,
    isNewMember: false,
    joinedLabel: '2024',
    bio: 'Gerne lockeres Matchplay unter der Woche ab 19:00 Uhr.',
    typicalHallDays: ['Mo', 'Mi'],
  },
  {
    id: 'p6',
    firstName: 'Nina',
    lastName: 'Baumann',
    nickname: 'ChopNina',
    pin: '1234',
    avatarUrl:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=160&q=80',
    phone: '+41 79 666 77 88',
    sttClass: 'D3',
    language: 'Deutsch',
    playstyle: 'Abwehr / Noppen',
    connectOnly: false,
    isNewMember: true,
    joinedLabel: 'Nov 2026',
    bio: 'Neu im Verein – spiele Abwehr mit langen Noppen und freue mich auf Trainingspartner!',
    typicalHallDays: ['Di', 'Do'],
  },
  {
    id: 'p7',
    firstName: 'David',
    lastName: 'Frei',
    nickname: 'RallyRunner',
    pin: '1234',
    avatarUrl:
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=160&q=80',
    phone: '+41 79 777 88 99',
    sttClass: '≈ C-Niveau',
    language: 'Englisch',
    playstyle: 'Allround',
    connectOnly: true,
    isNewMember: true,
    joinedLabel: 'Okt 2026',
    bio: 'Seit Oktober dabei! Spiele aktuell keine Monatsliga, komme aber oft frei in die Halle.',
    typicalHallDays: ['Mi', 'Sa'],
  },
  {
    id: 'p8',
    firstName: 'Lea',
    lastName: 'Zimmermann',
    nickname: 'DropShotLea',
    pin: '1234',
    avatarUrl:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
    phone: '+41 79 888 99 00',
    sttClass: 'Hobby',
    language: 'Beides',
    playstyle: 'Allround',
    connectOnly: true,
    isNewMember: true,
    joinedLabel: 'Nov 2026',
    bio: 'Ganz frisch im Club und suche unkomplizierte Leute zum Einspielen und Sätze zählen.',
    typicalHallDays: ['Do', 'So'],
  },
];

const INITIAL_CONNECT_MATCHES = [
  {
    id: 'cm1',
    player1Id: 'p1',
    player2Id: 'p3',
    winnerId: 'p1',
    score: '3:1',
    dateLabel: 'Gestern, 20:15',
  },
  {
    id: 'cm2',
    player1Id: 'p2',
    player2Id: 'p7',
    winnerId: 'p7',
    score: '3:2',
    dateLabel: 'Vor 2 Tagen',
  },
  {
    id: 'cm3',
    player1Id: 'p6',
    player2Id: 'p5',
    winnerId: 'p6',
    score: '3:1',
    dateLabel: 'Vor 4 Tagen',
  },
];

const INITIAL_CLUB_EVENINGS = [
  {
    id: 'ce1',
    title: 'Freitags-Rundlauf & Doppel-Plausch',
    dateLabel: 'Freitag, 27. Nov · 19:30 Uhr',
    tables: 'Tisch 1–4 reserviert',
    hostId: 'p2',
    maxParticipants: 12,
    description:
      'Lockere Doppel-Rotation & Kaiser-Tisch für alle Spielstärken – perfekt zum Kennenlernen!',
    attendeeIds: ['p2', 'p3', 'p6', 'p7', 'p8'],
  },
  {
    id: 'ce2',
    title: 'Balleimer & Aufschlag-Workshop',
    dateLabel: 'Dienstag, 1. Dez · 19:00 Uhr',
    tables: 'Tisch 1 & 2',
    hostId: 'p1',
    maxParticipants: 8,
    description:
      '45 Min gezieltes Topspin- & Aufschlagtraining, danach freies Matchplay.',
    attendeeIds: ['p1', 'p4', 'p5'],
  },
];

const INITIAL_SEASONS = [
  {
    id: '2026-10',
    label: 'Oktober 2026',
    shortLabel: 'Okt 26',
    status: 'completed',
    leagues: [
      { id: '2026-10-l1', name: 'Liga 1', tier: 1, playerIds: ['p1', 'p2', 'p3'] },
      { id: '2026-10-l2', name: 'Liga 2', tier: 2, playerIds: ['p4', 'p5', 'p6'] },
    ],
    pausedPlayerIds: ['p7', 'p8'],
    matches: [
      { id: 'om1', leagueId: '2026-10-l1', player1Id: 'p1', player2Id: 'p2', score1: 3, score2: 1 },
      { id: 'om2', leagueId: '2026-10-l1', player1Id: 'p1', player2Id: 'p3', score1: 3, score2: 2 },
      { id: 'om3', leagueId: '2026-10-l1', player1Id: 'p2', player2Id: 'p3', score1: 3, score2: 0 },
      { id: 'om4', leagueId: '2026-10-l2', player1Id: 'p4', player2Id: 'p5', score1: 3, score2: 1 },
      { id: 'om5', leagueId: '2026-10-l2', player1Id: 'p4', player2Id: 'p6', score1: 3, score2: 0 },
      { id: 'om6', leagueId: '2026-10-l2', player1Id: 'p5', player2Id: 'p6', score1: 3, score2: 2 },
    ],
  },
  {
    id: '2026-11',
    label: 'November 2026',
    shortLabel: 'Nov 26',
    status: 'active',
    leagues: [
      { id: '2026-11-l1', name: 'Liga 1', tier: 1, playerIds: ['p1', 'p2', 'p4'] },
      { id: '2026-11-l2', name: 'Liga 2', tier: 2, playerIds: ['p3', 'p5', 'p6'] },
    ],
    pausedPlayerIds: ['p7', 'p8'],
    matches: [
      { id: 'm1', leagueId: '2026-11-l1', player1Id: 'p1', player2Id: 'p2', score1: 3, score2: 2 },
      { id: 'm2', leagueId: '2026-11-l1', player1Id: 'p1', player2Id: 'p4', score1: null, score2: null },
      { id: 'm3', leagueId: '2026-11-l1', player1Id: 'p2', player2Id: 'p4', score1: 3, score2: 1 },
      { id: 'm4', leagueId: '2026-11-l2', player1Id: 'p3', player2Id: 'p5', score1: 3, score2: 0 },
      { id: 'm5', leagueId: '2026-11-l2', player1Id: 'p3', player2Id: 'p6', score1: null, score2: null },
      { id: 'm6', leagueId: '2026-11-l2', player1Id: 'p5', player2Id: 'p6', score1: 2, score2: 3 },
    ],
  },
];

const INITIAL_LIVE_CHECKINS = [
  {
    id: 'lc1',
    playerId: 'p3',
    tableInfo: 'Tisch 2',
    untilTime: '21:30',
    note: 'Lockeres Einspielen & Sätze zählen – komm gern vorbei!',
    checkedInAt: 'vor 18 Min.',
  },
  {
    id: 'lc2',
    playerId: 'p7',
    tableInfo: 'Tisch 4',
    untilTime: '21:00',
    note: 'Suche noch jemanden für 30 Min Matchtraining.',
    checkedInAt: 'vor 7 Min.',
  },
];

const INITIAL_SESSIONS = [
  {
    id: 's1',
    type: 'announcement',
    authorId: 'p2',
    dateLabel: 'Morgen, Do · 19:30 Uhr',
    note: 'Bin ab 19:30 in der Halle – wer hat Lust auf 3–4 Sätze Topspin-Training?',
    joinedIds: ['p2', 'p4'],
    createdAt: 'vor 1 Std.',
  },
  {
    id: 's2',
    type: 'spontaneous',
    authorId: 'p1',
    dateLabel: 'Heute · 19:00 Uhr',
    note: 'Spontan ab 19:00 an Tisch 1 – noch 1 Platz frei!',
    joinedIds: ['p1'],
    createdAt: 'vor 25 Min.',
  },
  {
    id: 's3',
    type: 'announcement',
    authorId: 'p8',
    dateLabel: 'Sonntag · 10:30 Uhr',
    note: 'Sonntags-Session für alle, die entspannt Bälle schlagen wollen.',
    joinedIds: ['p8', 'p5'],
    createdAt: 'Gestern',
  },
];

const INITIAL_CHALLENGES = [
  {
    id: 'ch1',
    challengerId: 'p3',
    targetId: 'p1',
    format: 'Best of 5 Match',
    whenLabel: 'Jetzt in der Halle (Tisch 2)',
    note: 'Revanche für letzten Monat! Bist du heute noch da?',
    status: 'open',
    createdAt: 'vor 9 Min.',
  },
  {
    id: 'ch2',
    challengerId: 'p7',
    targetId: null,
    format: '3 Sätze locker',
    whenLabel: 'Heute Abend ab 20:00 Uhr',
    note: 'Offene Challenge an alle im Club – wer traut sich an Tisch 4?',
    status: 'open',
    createdAt: 'vor 22 Min.',
  },
];

const GERMAN_MONTH_NAMES = [
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

function getDaysRemainingInMonth() {
  const now = new Date();
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  return Math.max(0, lastDay - now.getDate());
}

function getNextMonthLabel(currentLabel = 'November 2026') {
  const parts = String(currentLabel).trim().split(/\s+/);
  const monthIdx = GERMAN_MONTH_NAMES.findIndex(
    (m) => m.toLowerCase() === (parts[0] || '').toLowerCase()
  );
  const year = parseInt(parts[1], 10) || new Date().getFullYear();
  if (monthIdx === -1) return 'Dezember 2026';
  const nextIdx = (monthIdx + 1) % 12;
  const nextYear = monthIdx === 11 ? year + 1 : year;
  return `${GERMAN_MONTH_NAMES[nextIdx]} ${nextYear}`;
}

const DAYS_OF_WEEK = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

const HALL_TIME_SLOTS = [
  { id: 'Morgen', label: 'Morgen', shortLabel: 'Mo.' },
  { id: 'Nachmittag', label: 'Nachmittag', shortLabel: 'Na.' },
  { id: 'Abend', label: 'Abend', shortLabel: 'Ab.' },
];

function getNormalizedHallSchedule(player) {
  if (
    player?.hallSchedule &&
    typeof player.hallSchedule === 'object' &&
    Object.keys(player.hallSchedule).length > 0
  ) {
    return player.hallSchedule;
  }
  const legacyDays = player?.typicalHallDays || [];
  const schedule = {};
  legacyDays.forEach((d) => {
    schedule[d] = ['Abend'];
  });
  return schedule;
}

function formatHallScheduleSummary(player) {
  const schedule = getNormalizedHallSchedule(player);
  const parts = [];
  DAYS_OF_WEEK.forEach((d) => {
    const slots = schedule[d];
    if (Array.isArray(slots) && slots.length > 0) {
      parts.push(`${d} (${slots.join(', ')})`);
    }
  });
  return parts.join(' · ');
}

function HallSchedulePicker({ schedule, onChange }) {
  const activeDays = DAYS_OF_WEEK.filter(
    (d) => Array.isArray(schedule[d]) && schedule[d].length > 0
  );

  const toggleDay = (day) => {
    const currentSlots = schedule[day] || [];
    const next = { ...schedule };
    if (currentSlots.length > 0) {
      delete next[day];
    } else {
      next[day] = ['Abend'];
    }
    onChange(next);
  };

  const toggleSlot = (day, slotId) => {
    const currentSlots = schedule[day] || [];
    const exists = currentSlots.includes(slotId);
    const updatedSlots = exists
      ? currentSlots.filter((s) => s !== slotId)
      : [...currentSlots, slotId];

    const next = { ...schedule };
    if (updatedSlots.length === 0) {
      delete next[day];
    } else {
      next[day] = HALL_TIME_SLOTS.map((s) => s.id).filter((id) =>
        updatedSlots.includes(id)
      );
    }
    onChange(next);
  };

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-7 gap-1">
        {DAYS_OF_WEEK.map((d) => {
          const isDayActive = (schedule[d] || []).length > 0;
          return (
            <button
              key={d}
              type="button"
              onClick={() => toggleDay(d)}
              className={`rounded-lg py-1.5 text-[11px] font-black transition ${
                isDayActive
                  ? 'bg-[#6FB3A2] text-[#060708]'
                  : 'border border-[#2B2F37] bg-[#0F1114] text-[#8E95A2] hover:text-[#F4ECC2]'
              }`}
            >
              {d}
            </button>
          );
        })}
      </div>

      {activeDays.length > 0 && (
        <div className="space-y-1.5 rounded-xl border border-[#22252B] bg-[#0F1114] p-2.5">
          {activeDays.map((day) => {
            const selectedSlots = schedule[day] || [];
            return (
              <div
                key={day}
                className="flex items-center justify-between gap-2 text-xs"
              >
                <span className="w-8 shrink-0 font-black text-[#F4ECC2]">
                  {day}
                </span>
                <div className="grid flex-1 grid-cols-3 gap-1">
                  {HALL_TIME_SLOTS.map((slot) => {
                    const active = selectedSlots.includes(slot.id);
                    return (
                      <button
                        key={slot.id}
                        type="button"
                        onClick={() => toggleSlot(day, slot.id)}
                        className={`rounded-md py-1 text-[10px] font-bold transition ${
                          active
                            ? 'bg-[#DE754B] text-[#060708]'
                            : 'bg-[#15171B] text-[#8E95A2] ring-1 ring-[#262A31] hover:text-[#F4ECC2]'
                        }`}
                      >
                        {slot.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const getInitials = (player) => {
  if (!player) return '?';
  const f = (player.firstName || player.nickname || '?')[0] || '';
  const l = (player.lastName || '')[0] || '';
  return (f + l).toUpperCase();
};

const FUNNY_NICKNAME_TEMPLATES = [
  'TopspinTorpedo',
  'NetzrollerKönig',
  'KantenballMagier',
  'SchmetterBär',
  'NoppenNinja',
  'ZelluloidZauberer',
  'RückhandRakete',
  'SpinDoctor',
  'BallonabwehrBoss',
  'PingPongPanda',
  'SchnittMeister',
  'FlummiFuchs',
  'TischFlüsterer',
  'BlockBuster',
  'SchupfSultan',
  'SidespinSamurai',
  'KellerKelle',
  'NetzKüsser',
];

function generateFunnyNickname(firstName = '', currentNickname = '') {
  const cleanFirst = firstName.trim().replace(/[^a-zA-ZäöüÄÖÜß-]/g, '');
  const personalTemplates = cleanFirst
    ? [
        `Topspin${cleanFirst}`,
        `Schmetter${cleanFirst}`,
        `Netzroller${cleanFirst}`,
        `Spin${cleanFirst}`,
        `Kanten${cleanFirst}`,
        `Super${cleanFirst}`,
      ]
    : [];

  const pool = [...personalTemplates, ...FUNNY_NICKNAME_TEMPLATES].filter(
    (name) => name.toLowerCase() !== currentNickname.trim().toLowerCase()
  );

  return pool[Math.floor(Math.random() * pool.length)] || 'TopspinTorpedo';
}

function PlayerAvatar({ player, sizeClass = 'h-8 w-8 text-xs', isConnectAccent = false }) {
  const ringClass = isConnectAccent
    ? 'ring-1 ring-[#6FB3A2]/55 bg-[#152420] text-[#A8D0B1]'
    : 'ring-1 ring-[#DE754B]/55 bg-[#291711] text-[#F4ECC2]';

  if (player?.avatarUrl) {
    return (
      <img
        src={player.avatarUrl}
        alt={player.nickname || 'Avatar'}
        className={`${sizeClass} shrink-0 rounded-full object-cover ${ringClass}`}
      />
    );
  }

  return (
    <div
      className={`${sizeClass} flex shrink-0 items-center justify-center rounded-full font-black ${ringClass}`}
    >
      {getInitials(player)}
    </div>
  );
}

function PlayerBadge({ player, season, ratingInfo }) {
  if (!player) return null;
  const league = season?.leagues?.find((l) => l.playerIds.includes(player.id));

  return (
    <div className="flex flex-wrap items-center gap-1">
      {league ? (
        <span className="rounded bg-[#2C1912] px-1.5 py-0.5 text-[9px] font-bold text-[#F4ECC2] ring-1 ring-[#DE754B]/40">
          {league.name}
        </span>
      ) : (
        <span className="rounded bg-[#152622] px-1.5 py-0.5 text-[9px] font-bold text-[#A8D0B1]">
          CLUB
        </span>
      )}

      {player.sttClass && (
        <span className="rounded bg-[#131417] px-1.5 py-0.5 text-[9px] font-semibold text-[#9CA3AF]">
          {player.sttClass}
        </span>
      )}

      {player.playstyle && (
        <span className="rounded bg-[#131417] px-1.5 py-0.5 text-[9px] font-semibold text-[#F4ECC2]">
          {player.playstyle}
        </span>
      )}

      <span className="rounded bg-[#131417] px-1 py-0.5 text-[9px] font-bold text-[#A8D0B1]">
        {getLanguageShortLabel(player.language)}
      </span>

      {ratingInfo?.tier && (
        <span
          className={`rounded border px-1 py-0.5 text-[9px] font-bold leading-none ${ratingInfo.tier.badgeClass}`}
        >
          {ratingInfo.tier.symbol} {ratingInfo.elo}
        </span>
      )}
    </div>
  );
}

function isMatchingLevel(userA, userB, season) {
  if (!userA || !userB) return true;
  const leagueA = season?.leagues.find((l) => l.playerIds.includes(userA.id));
  const leagueB = season?.leagues.find((l) => l.playerIds.includes(userB.id));
  if (leagueA && leagueB) {
    return Math.abs(leagueA.tier - leagueB.tier) <= 1;
  }
  const rankA = getSttRankValue(userA.sttClass);
  const rankB = getSttRankValue(userB.sttClass);
  return Math.abs(rankA - rankB) <= 14;
}

function buildWhatsAppLink(phone, message) {
  const digits = (phone || '').replace(/\D/g, '');
  const encoded = encodeURIComponent(message || '');
  return digits ? `https://wa.me/${digits}?text=${encoded}` : `https://wa.me/?text=${encoded}`;
}

function getContextWhatsAppMessage(context, currentUser, targetPlayer, extra = {}) {
  const targetName = targetPlayer?.firstName || targetPlayer?.nickname || 'du';
  const myName = currentUser?.nickname || 'ein Clubmitglied';

  switch (context) {
    case 'league_match':
      return `Hoi ${targetName}, ich bin ${myName} – wollen wir unser Liga-Spiel (${
        extra.leagueName || 'Monatsliga'
      } · ${extra.seasonLabel || ''}) diese Woche in der Halle spielen?`;
    case 'league_reminder':
      return `Hoi ${targetName}, kleine Erinnerung von ${myName}: Unser Liga-Spiel im ${
        extra.seasonLabel || ''
      } steht noch aus (noch ${extra.daysRemaining ?? ''} Tage bis Monatsende). Wann passt es dir?`;
    case 'league_table':
      return `Hoi ${targetName}, ich bin ${myName} aus ${
        extra.leagueName || 'der Monatsliga'
      } – hast du Lust, uns bald für unser Liga-Match oder ein Einspielen in der Halle zu treffen?`;
    case 'league_paused':
      return `Hoi ${targetName}, ich bin ${myName} aus dem Club – auch wenn du diesen Monat in der Liga pausierst: Hast du Lust auf ein lockeres Match in der Halle?`;
    case 'live_hall':
      return `Hoi ${targetName}, ich bin ${myName} – habe in PINGKONG gesehen, dass du gerade LIVE in der Halle bist (${
        extra.tableInfo || 'an den Tischen'
      }). Ich komme gleich vorbei!`;
    case 'club_evening':
      return `Hoi ${targetName}, ich bin ${myName} – sehe dich auch beim Club-Abend «${
        extra.title || ''
      }»! Wollen wir dort mal zusammen ein paar Sätze spielen?`;
    case 'new_member':
      return `Hoi ${targetName}, herzlich willkommen im Club! Ich bin ${myName} – hast du Lust, demnächst mal zusammen ein paar Bälle zu schlagen?`;
    case 'hall_day':
      return `Hoi ${targetName}, ich bin ${myName} – habe gesehen du bist oft am ${
        extra.day || ''
      }${
        extra.timeSlot ? ` (${extra.timeSlot})` : ''
      } in der Halle. Wollen wir uns mal für ein paar Sätze verabreden?`;
    case 'rating_directory':
      return `Hoi ${targetName}, ich bin ${myName} aus unserem Tischtennis-Club – hast du demnächst mal Lust auf ein freies CONNECT-Match in der Halle?`;
    case 'rematch':
      return `Hoi ${targetName}, danke nochmals für unser letztes Match (${
        extra.score || ''
      })! Wann spielen wir die Revanche in der Halle?`;
    case 'challenge_reply':
      return `Hoi ${targetName}, ich nehme deine Herausforderung (${extra.format || ''} · ${
        extra.whenLabel || ''
      }) in PINGKONG gerne an!`;
    case 'session_join':
      return `Hoi ${targetName}, ich habe deinen Post «${
        extra.dateLabel || ''
      }» in PINGKONG gesehen – ich wäre gerne dabei!`;
    default:
      return `Hoi ${targetName}, ich bin ${myName} aus unserem Tischtennis-Club – hast du demnächst Lust, zusammen in der Halle zu spielen?`;
  }
}

function WhatsAppActionButton({
  phone,
  message,
  label = 'WhatsApp',
  compact = false,
  title,
}) {
  return (
    <a
      href={buildWhatsAppLink(phone, message)}
      target="_blank"
      rel="noopener noreferrer"
      title={title || message}
      className={`inline-flex shrink-0 items-center justify-center gap-1 rounded-lg bg-[#1F3A2E] font-bold text-emerald-300 ring-1 ring-emerald-500/30 transition hover:bg-[#27493A] hover:text-emerald-200 ${
        compact ? 'px-2 py-1 text-[10px]' : 'px-2.5 py-1.5 text-[11px]'
      }`}
    >
      <span>💬</span>
      {label && <span>{label}</span>}
    </a>
  );
}

function computeStandings(league, matches, playersById) {
  const stats = {};
  league.playerIds.forEach((pid) => {
    stats[pid] = {
      playerId: pid,
      player: playersById[pid],
      played: 0,
      won: 0,
      lost: 0,
      setsWon: 0,
      setsLost: 0,
      points: 0,
    };
  });

  matches
    .filter((m) => m.leagueId === league.id && m.score1 !== null && m.score2 !== null)
    .forEach((m) => {
      const s1 = stats[m.player1Id];
      const s2 = stats[m.player2Id];
      if (!s1 || !s2) return;

      s1.played += 1;
      s2.played += 1;
      s1.setsWon += m.score1;
      s1.setsLost += m.score2;
      s2.setsWon += m.score2;
      s2.setsLost += m.score1;

      if (m.score1 > m.score2) {
        s1.won += 1;
        s2.lost += 1;
        s1.points += 2;
      } else {
        s2.won += 1;
        s1.lost += 1;
        s2.points += 2;
      }
    });

  return Object.values(stats).sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    const diffA = a.setsWon - a.setsLost;
    const diffB = b.setsWon - b.setsLost;
    if (diffB !== diffA) return diffB - diffA;
    return b.setsWon - a.setsWon;
  });
}

function PingkongLogo({ className = 'h-12 w-12', accentHead = false, animated = false }) {
  const [burst, setBurst] = useState(false);

  const triggerBurst = () => {
    if (!animated) return;
    setBurst(false);
    requestAnimationFrame(() => setBurst(true));
  };

  return (
    <>
      {animated && (
        <style>{`
          @keyframes pingkongPowerStance {
            0%, 100% {
              transform: translateY(0px) scale(1, 1);
            }
            45% {
              transform: translateY(-7px) scale(1.035, 1.045);
            }
            75% {
              transform: translateY(2px) scale(1.02, 0.985);
            }
          }
          @keyframes pingkongHeadAssert {
            0%, 100% {
              transform: rotate(0deg) translate(0px, 0px);
            }
            30% {
              transform: rotate(-7deg) translate(-1.5px, -2px);
            }
            65% {
              transform: rotate(4deg) translate(1px, 1.5px);
            }
          }
          @keyframes pingkongBurstPop {
            0% { transform: scale(1); }
            30% { transform: scale(1.16) rotate(-4deg); }
            60% { transform: scale(0.95) rotate(2deg); }
            100% { transform: scale(1) rotate(0deg); }
          }
          .pk-logo-stance {
            transform-origin: 50px 96px;
            animation: pingkongPowerStance 2.8s cubic-bezier(0.37, 0, 0.63, 1) infinite;
          }
          .pk-logo-head {
            transform-origin: 32px 30px;
            animation: pingkongHeadAssert 2.8s cubic-bezier(0.37, 0, 0.63, 1) infinite;
          }
          .pk-logo-burst {
            animation: pingkongBurstPop 0.55s cubic-bezier(0.22, 1, 0.36, 1);
          }
        `}</style>
      )}
      <div
        onClick={triggerBurst}
        onMouseEnter={triggerBurst}
        className={`relative inline-flex flex-col items-center justify-center ${
          animated ? 'cursor-pointer select-none' : ''
        } ${burst ? 'pk-logo-burst' : ''}`}
      >
        <svg
          viewBox="0 0 100 102"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`${className} ${animated ? 'pk-logo-stance' : ''}`}
          aria-label="PINGKONG Logo"
        >
          <polygon
            className={animated ? 'pk-logo-head' : ''}
            points="24.2,3.4 39.8,14.8 24.4,44.0 14.8,37.2 17.6,23.6 14.6,20.0"
            fill={accentHead ? '#DE754B' : 'currentColor'}
          />
          <polygon
            points="42.4,15.6 56.0,21.0 32.8,96.6 4.0,96.6"
            fill="currentColor"
          />
          <polygon
            points="40.6,72.4 49.4,74.8 47.0,96.6 35.6,96.6"
            fill="currentColor"
          />
          <polygon
            points="56.6,31.2 66.8,54.6 78.6,56.6 64.0,74.8 42.0,69.6"
            fill="currentColor"
          />
          <polygon
            points="80.8,58.8 92.6,68.2 78.4,84.4 81.4,96.6 71.8,96.6 66.2,78.0"
            fill="currentColor"
          />
          <polygon
            points="93.2,71.4 96.4,96.6 88.2,96.6 81.6,84.6"
            fill="currentColor"
          />
        </svg>
      </div>
    </>
  );
}

function PingkongFullLogo({ className = 'w-56', customSrc = '' }) {
  if (customSrc) {
    return (
      <img
        src={customSrc}
        alt="PINGKONG Signet"
        className={`${className} h-auto object-contain select-none`}
      />
    );
  }

  return (
    <div className={`${className} inline-flex items-center justify-center text-[#DE754B]`}>
      <PingkongLogo className="h-auto w-full" accentHead={false} animated={true} />
    </div>
  );
}

function PlatformInfoModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 p-3 sm:items-center">
      <div className="max-h-[88vh] w-full max-w-md space-y-3.5 overflow-y-auto rounded-2xl border border-[#DE754B]/45 bg-[#14161A] p-4 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#DE754B] text-xs font-black text-[#060708]">
              i
            </span>
            <h3 className="text-sm font-black text-[#F4ECC2]">Was ist CONNECT?</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-[#202329] px-2.5 py-1 text-xs font-bold text-[#9CA3AF] hover:text-[#F4ECC2]"
          >
            ✕
          </button>
        </div>

        <p className="text-xs leading-relaxed text-[#D1D5DB]">
          <strong className="text-[#F4ECC2]">CONNECT</strong> verbindet unseren
          ganzen Tischtennis-Club in einer einzigen App – egal ob du einfach
          spontan Bälle schlagen willst oder zusätzlich in der monatlichen
          Club-Liga mitspielst.
        </p>

        <div className="space-y-2.5">
          <div className="rounded-xl border border-[#6FB3A2]/40 bg-[#152622]/55 p-3">
            <div className="text-xs font-black uppercase tracking-wider text-[#6FB3A2]">
              1. CLUB · Halle &amp; Community
            </div>
            <ul className="mt-1.5 space-y-1 text-[11px] text-[#E5E7EB]">
              <li>• Sieh live, wer gerade in der Halle an welchem Tisch steht</li>
              <li>• Plane Club-Abende, Trainings &amp; spontane Herausforderungen</li>
              <li>• Finde Trainingspartner nach Spielstärke, Spielstil, Sprache &amp; Hallentagen</li>
              <li>• Sammle Punkte im freien CONNECT-Rating – ganz ohne Ligapflicht</li>
            </ul>
          </div>

          <div className="rounded-xl border border-[#DE754B]/40 bg-[#291711]/55 p-3">
            <div className="text-xs font-black uppercase tracking-wider text-[#DE754B]">
              2. LEAGUE · Freiwillige Monatsliga
            </div>
            <ul className="mt-1.5 space-y-1 text-[11px] text-[#E5E7EB]">
              <li>• Kleine, ausgeglichene 3er-/4er-Ligen pro Kalendermonat</li>
              <li>• Flexible Terminabsprache direkt per 1-Klick-WhatsApp</li>
              <li>• Auf- &amp; Abstieg am Monatsende – und jederzeit pausierbar</li>
            </ul>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full rounded-xl bg-[#6FB3A2] py-2.5 text-xs font-black text-[#060708]"
        >
          Verstanden ✓
        </button>
      </div>
    </div>
  );
}

function AuthGateScreen({
  players,
  activeSeason,
  onSelectProfile,
  onRegisterProfile,
  onOpenPlatformInfo,
  customLogoUrl,
}) {
  const [mode, setMode] = useState('select');
  const [search, setSearch] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [nickname, setNickname] = useState('');
  const [phone, setPhone] = useState('');
  const [sttClass, setSttClass] = useState('Hobby');
  const [playstyle, setPlaystyle] = useState('Allround');
  const [language, setLanguage] = useState('Deutsch');
  const [pin, setPin] = useState('');
  const [pinConfirm, setPinConfirm] = useState('');
  const [formError, setFormError] = useState('');
  const [connectOnly, setConnectOnly] = useState(true);
  const [leagueJoinTiming, setLeagueJoinTiming] = useState('current');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [hallSchedule, setHallSchedule] = useState({
    Mi: ['Abend'],
    Fr: ['Abend'],
  });

  const [pendingProfile, setPendingProfile] = useState(null);
  const [loginPin, setLoginPin] = useState('');
  const [loginPinError, setLoginPinError] = useState('');

  const filteredPlayers = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return players;
    return players.filter((p) =>
      `${p.nickname} ${p.firstName} ${p.lastName} ${p.sttClass || ''}`
        .toLowerCase()
        .includes(q)
    );
  }, [players, search]);

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') setAvatarUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    if (!avatarUrl) {
      setFormError('Bitte ein Profilfoto hochladen, damit dich alle in der Halle erkennen.');
      return;
    }
    if (!firstName.trim()) {
      setFormError('Bitte Vorname eingeben.');
      return;
    }
    if (!lastName.trim()) {
      setFormError('Bitte Nachname eingeben.');
      return;
    }
    if (!nickname.trim()) {
      setFormError('Bitte Nickname eingeben.');
      return;
    }
    const phoneCheck = validateWhatsAppPhone(phone);
    if (!phoneCheck.valid) {
      setFormError(phoneCheck.error);
      return;
    }
    const activeDays = DAYS_OF_WEEK.filter(
      (d) => Array.isArray(hallSchedule[d]) && hallSchedule[d].length > 0
    );
    if (activeDays.length === 0) {
      setFormError('Bitte mindestens einen typischen Hallentag mit Tageszeit auswählen.');
      return;
    }
    if (!/^\d{4}$/.test(pin)) {
      setFormError('Bitte einen 4-stelligen Zahlen-PIN (z. B. 4821) definieren.');
      return;
    }
    if (pin !== pinConfirm) {
      setFormError('Die beiden PIN-Eingaben stimmen nicht überein.');
      return;
    }

    const summaryText = activeDays
      .map((d) => `${d} (${hallSchedule[d].join('/')})`)
      .join(', ');

    const newPlayer = {
      id: `p-${Date.now()}`,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      nickname: nickname.trim(),
      pin,
      avatarUrl,
      phone: phoneCheck.normalized,
      sttClass,
      playstyle,
      language,
      connectOnly,
      leagueStartNextMonth: !connectOnly && leagueJoinTiming === 'next',
      isNewMember: true,
      joinedLabel: 'Nov 2026',
      bio: `Neu im Club – meistens am ${summaryText} in der Halle!`,
      typicalHallDays: activeDays,
      hallSchedule,
    };

    const defaultEntryLeagueId =
      [...activeSeason.leagues].sort((a, b) => b.tier - a.tier)[0]?.id ||
      activeSeason.leagues[0]?.id ||
      '';

    onRegisterProfile(
      newPlayer,
      !connectOnly && leagueJoinTiming === 'current' ? defaultEntryLeagueId : ''
    );
  };

  const verifyPinAndUnlock = (profile, enteredPin) => {
    if (!profile) return;
    const expectedPin = profile.pin || '1234';
    if (enteredPin !== expectedPin) {
      setLoginPinError('Falscher PIN. Bitte erneut versuchen.');
      return;
    }
    setLoginPinError('');
    const targetId = profile.id;
    setPendingProfile(null);
    setLoginPin('');
    onSelectProfile(targetId);
  };

  const handlePinInputChange = (rawValue) => {
    const cleaned = rawValue.replace(/\D/g, '').slice(0, 4);
    setLoginPin(cleaned);
    if (loginPinError) setLoginPinError('');
    if (cleaned.length === 4 && pendingProfile) {
      verifyPinAndUnlock(pendingProfile, cleaned);
    }
  };

  const handleVerifyProfilePin = (e) => {
    e.preventDefault();
    if (!pendingProfile) return;
    verifyPinAndUnlock(pendingProfile, loginPin.trim());
  };

  return (
    <div
      className={`overflow-x-hidden bg-[#060708] px-3.5 text-[#F3F4F6] sm:px-4 ${
        mode === 'select'
          ? 'flex h-[100dvh] flex-col overflow-hidden py-3 sm:min-h-screen sm:h-auto sm:overflow-visible sm:py-6'
          : 'min-h-screen py-4 sm:py-6'
      }`}
    >
      <style>{`
        @media (max-width: 639px) {
          .pk-mobile-nozoom-wrap {
            height: 34px;
            overflow: hidden;
          }
          .pk-mobile-nozoom-input {
            font-size: 16px !important;
            line-height: 20px !important;
            width: 123.08% !important;
            transform: scale(0.8125);
            transform-origin: left top;
            padding-top: 10px !important;
            padding-bottom: 10px !important;
          }
          .pk-mobile-nozoom-input::placeholder {
            font-size: 15px !important;
          }
        }
      `}</style>
      <div
        className={`mx-auto flex w-full max-w-md flex-col overflow-x-hidden ${
          mode === 'select'
            ? 'min-h-0 flex-1 space-y-2.5 sm:flex-initial sm:space-y-4'
            : 'space-y-3 sm:space-y-4'
        }`}
      >
        <div className="shrink-0 rounded-2xl border border-[#22252B] bg-[#121417] px-4 py-3.5 text-center sm:rounded-3xl sm:px-6 sm:py-6">
          <div className="flex flex-col items-center">
            <PingkongFullLogo
              className="w-16 max-w-full sm:w-28"
              customSrc={customLogoUrl}
            />

            <h1
              style={{
                fontFamily: "'Avenir Next', 'Montserrat', 'Trebuchet MS', 'Segoe UI', sans-serif",
              }}
              className="mt-1.5 text-center text-2xl font-black tracking-[0.22em] text-[#F4ECC2] uppercase sm:mt-3 sm:text-4xl"
            >
              CONNECT
            </h1>

            <p className="mt-1 max-w-[270px] text-[11px] leading-snug text-[#9CA3AF] sm:mt-2 sm:text-xs sm:leading-relaxed">
              Wähle dein PINGKONG Club Profil aus oder registriere dich neu.
            </p>

            <button
              type="button"
              onClick={onOpenPlatformInfo}
              className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-[#2B2F37] bg-[#15171B] px-3 py-1 text-[10px] font-bold text-[#F4ECC2] transition hover:border-[#DE754B] hover:text-[#DE754B] sm:mt-3.5 sm:px-3.5 sm:py-1.5 sm:text-[11px]"
            >
              <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#DE754B] text-[9px] font-black text-[#060708] sm:h-4 sm:w-4 sm:text-[10px]">
                i
              </span>
              <span>Was ist CONNECT?</span>
            </button>
          </div>
        </div>

        <div className="grid shrink-0 grid-cols-2 gap-1.5 rounded-2xl border border-[#24272E] bg-[#14161A] p-1 sm:p-1.5">
          <button
            type="button"
            onClick={() => {
              setMode('select');
              setPendingProfile(null);
            }}
            className={`rounded-xl py-2 text-xs font-black transition sm:py-2.5 ${
              mode === 'select'
                ? 'bg-[#6FB3A2] text-[#060708]'
                : 'text-[#9CA3AF] hover:text-[#F4ECC2]'
            }`}
          >
            Profil auswählen ({players.length})
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setPendingProfile(null);
            }}
            className={`rounded-xl py-2 text-xs font-black transition sm:py-2.5 ${
              mode === 'register'
                ? 'bg-[#6FB3A2] text-[#060708]'
                : 'text-[#9CA3AF] hover:text-[#F4ECC2]'
            }`}
          >
            + Neu registrieren
          </button>
        </div>

        {mode === 'select' && (
          <div className="flex min-h-0 flex-1 flex-col gap-2.5 rounded-2xl border border-[#24272E] bg-[#14161A] p-3 sm:flex-initial sm:gap-3 sm:p-4">
            {pendingProfile ? (
              <form onSubmit={handleVerifyProfilePin} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <PlayerAvatar
                      player={pendingProfile}
                      sizeClass="h-10 w-10 text-xs"
                      isConnectAccent={pendingProfile.connectOnly}
                    />
                    <div>
                      <div className="text-xs font-black text-[#F3F4F6]">
                        {pendingProfile.nickname}
                      </div>
                      <div className="text-[10px] text-[#8E95A2]">
                        {pendingProfile.firstName} {pendingProfile.lastName}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setPendingProfile(null);
                      setLoginPin('');
                      setLoginPinError('');
                    }}
                    className="rounded-lg bg-[#0F1114] px-2.5 py-1 text-[11px] font-bold text-[#9CA3AF]"
                  >
                    ← Zurück
                  </button>
                </div>

                <div>
                  <label className="mb-1 block text-[11px] font-semibold text-[#8E95A2]">
                    4-stelligen Profil-PIN eingeben *
                  </label>
                  <input
                    type="password"
                    inputMode="numeric"
                    maxLength={4}
                    required
                    autoFocus
                    value={loginPin}
                    onChange={(e) => handlePinInputChange(e.target.value)}
                    placeholder="••••"
                    className="w-full rounded-xl border border-[#2B2F37] bg-[#0F1114] px-3 py-2.5 text-center text-base font-black tracking-[0.4em] text-[#F4ECC2]"
                  />
                </div>

                {loginPinError && (
                  <div className="rounded-xl border border-rose-500/40 bg-rose-950/30 px-3 py-2 text-[11px] font-bold text-rose-300">
                    {loginPinError}
                  </div>
                )}
              </form>
            ) : (
              <>
                <div className="pk-mobile-nozoom-wrap w-full shrink-0 overflow-hidden">
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Profil suchen nach Name oder Spielername..."
                    className="pk-mobile-nozoom-input w-full rounded-xl border border-[#2B2F37] bg-[#0F1114] px-3 py-2 text-xs text-[#F3F4F6] placeholder:text-[#6B7280] focus:border-[#6FB3A2] focus:outline-none"
                  />
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pr-0.5 sm:max-h-[420px] sm:flex-initial">
                  {filteredPlayers.length === 0 ? (
                    <div className="rounded-xl border border-[#22252B] bg-[#0F1114] p-3 text-center text-xs text-[#8E95A2]">
                      Kein Profil gefunden.{' '}
                      <button
                        type="button"
                        onClick={() => setMode('register')}
                        className="font-bold text-[#6FB3A2] underline"
                      >
                        Jetzt neu registrieren
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                      {filteredPlayers.map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => {
                            setPendingProfile(p);
                            setLoginPin('');
                            setLoginPinError('');
                          }}
                          className="flex flex-col justify-between rounded-xl border border-[#24272E] bg-[#0F1114] p-2 text-left transition hover:border-[#DE754B] hover:bg-[#1E1410] sm:p-2.5"
                        >
                          <div className="flex items-center gap-2">
                            <PlayerAvatar
                              player={p}
                              sizeClass="h-8 w-8 text-[11px]"
                              isConnectAccent={p.connectOnly}
                            />
                            <div className="min-w-0 flex-1">
                              <div className="truncate text-xs font-extrabold text-[#F3F4F6]">
                                {p.nickname}
                              </div>
                              <div className="truncate text-[10px] text-[#8E95A2]">
                                ({p.firstName} {p.lastName})
                              </div>
                            </div>
                          </div>

                          <div className="mt-2 flex items-center justify-between gap-1">
                            {p.connectOnly ? (
                              <span className="truncate rounded bg-[#6FB3A2] px-1.5 py-0.5 text-[9px] font-black text-[#060708]">
                                Nur CLUB
                              </span>
                            ) : (
                              <span className="truncate rounded bg-[#2C1912] px-1.5 py-0.5 text-[9px] font-bold text-[#F4ECC2] ring-1 ring-[#DE754B]/45">
                                CLUB &amp; LEAGUE
                              </span>
                            )}
                            <span className="shrink-0 text-[10px] font-black text-[#DE754B]">
                              →
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {mode === 'register' && (
          <form
            onSubmit={handleRegisterSubmit}
            className="w-full max-w-full space-y-3 overflow-x-hidden rounded-2xl border border-[#24272E] bg-[#14161A] p-4"
          >
            <div className="flex items-start gap-2.5 rounded-2xl border border-[#6FB3A2]/40 bg-[#152622]/70 px-3.5 py-2.5 text-left">
              <span className="mt-0.5 text-sm">⚡</span>
              <p className="text-[11px] leading-relaxed text-[#F4ECC2]">
                <strong className="font-black text-[#A8D0B1]">
                  In 1 Minute startklar – ganz ohne E-Mail:
                </strong>{' '}
                Kein langes Formular, keine Bestätigungs-Mail. Du teilst dir nur
                einen persönlichen 4-stelligen PIN zu.
              </p>
            </div>

            <div className="space-y-2 rounded-2xl border border-[#2B2F37] bg-[#0F1114] p-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider text-[#F4ECC2]">
                  1. Wie möchtest du mitmachen? *
                </span>
                <span className="text-[10px] text-[#8E95A2]">
                  Jederzeit änderbar
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setConnectOnly(true)}
                  className={`flex flex-col justify-between rounded-xl border p-3 text-left transition ${
                    connectOnly
                      ? 'border-[#6FB3A2] bg-[#152622] shadow-lg shadow-[#6FB3A2]/15'
                      : 'border-[#24272E] bg-[#14161A] opacity-75 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="rounded bg-[#6FB3A2] px-1.5 py-0.5 text-[10px] font-black text-[#060708]">
                      CLUB
                    </span>
                    <span className="text-xs font-black text-[#A8D0B1]">
                      {connectOnly ? '✓' : '○'}
                    </span>
                  </div>
                  <div className="mt-2 text-xs font-black text-[#F3F4F6]">
                    Nur CLUB
                  </div>
                  <div className="mt-0.5 text-[10px] leading-snug text-[#9CA3AF]">
                    Halle, Club-Abende &amp; freie Spiele – ohne Monatsliga
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setConnectOnly(false)}
                  className={`flex flex-col justify-between rounded-xl border p-3 text-left transition ${
                    !connectOnly
                      ? 'border-[#DE754B] bg-[#291711] shadow-lg shadow-[#DE754B]/15'
                      : 'border-[#24272E] bg-[#14161A] opacity-75 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="rounded bg-[#DE754B] px-1.5 py-0.5 text-[10px] font-black text-[#060708]">
                      CLUB + LEAGUE
                    </span>
                    <span className="text-xs font-black text-[#F4ECC2]">
                      {!connectOnly ? '✓' : '○'}
                    </span>
                  </div>
                  <div className="mt-2 text-xs font-black text-[#F3F4F6]">
                    CLUB &amp; LEAGUE
                  </div>
                  <div className="mt-0.5 text-[10px] leading-snug text-[#9CA3AF]">
                    Inkl. freiwilliger Monatsliga mit Auf- &amp; Abstieg
                  </div>
                </button>
              </div>

              {!connectOnly && (
                <div className="space-y-2 pt-1.5">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#F4ECC2]">
                    Wann möchtest du in die Liga einsteigen?
                  </label>
                  <div className="grid grid-cols-1 gap-1.5">
                    <button
                      type="button"
                      onClick={() => setLeagueJoinTiming('current')}
                      className={`flex items-center justify-between rounded-xl border px-3 py-2 text-left text-[11px] font-bold transition ${
                        leagueJoinTiming === 'current'
                          ? 'border-[#DE754B] bg-[#291711] text-[#F4ECC2]'
                          : 'border-[#24272E] bg-[#14161A] text-[#9CA3AF]'
                      }`}
                    >
                      <span>Wenn möglich im laufenden Monat einspringen</span>
                      <span className="font-black text-[#DE754B]">
                        {leagueJoinTiming === 'current' ? '✓' : '○'}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setLeagueJoinTiming('next')}
                      className={`flex items-center justify-between rounded-xl border px-3 py-2 text-left text-[11px] font-bold transition ${
                        leagueJoinTiming === 'next'
                          ? 'border-[#DE754B] bg-[#291711] text-[#F4ECC2]'
                          : 'border-[#24272E] bg-[#14161A] text-[#9CA3AF]'
                      }`}
                    >
                      <span>Ich starte die Liga auf den nächsten Monat</span>
                      <span className="font-black text-[#DE754B]">
                        {leagueJoinTiming === 'next' ? '✓' : '○'}
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#A8D0B1]">
                2. Profil-Pflichtfelder (*)
              </span>
              <span className="text-[10px] text-[#8E95A2]">
                Inkl. eigenem 4-stelligen PIN
              </span>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-[#24272E] bg-[#0F1114] p-2.5">
              <PlayerAvatar
                player={{ firstName, lastName, nickname, avatarUrl }}
                sizeClass="h-12 w-12 text-sm"
                isConnectAccent={connectOnly}
              />
              <div>
                <label className="inline-block cursor-pointer rounded-lg bg-[#6FB3A2] px-2.5 py-1 text-[11px] font-black text-[#060708]">
                  {avatarUrl ? 'Profilfoto ändern *' : 'Profilfoto wählen *'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
                <div className="mt-1 text-[10px] text-[#8E95A2]">
                  {avatarUrl
                    ? 'Profilfoto hinterlegt ✓'
                    : 'Pflichtfeld – zum Erkennen in der Halle'}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Vorname *"
                className="w-full min-w-0 rounded-xl border border-[#2E323B] bg-[#131417] px-3 py-2 text-base sm:text-xs text-[#F3F4F6]"
              />
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Nachname *"
                className="w-full min-w-0 rounded-xl border border-[#2E323B] bg-[#131417] px-3 py-2 text-base sm:text-xs text-[#F3F4F6]"
              />
            </div>

            <div className="space-y-1">
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="Nickname *"
                  className="min-w-0 flex-1 rounded-xl border border-[#2B2F37] bg-[#0F1114] px-3 py-2 text-base sm:text-xs font-bold text-[#F3F4F6]"
                />
                <button
                  type="button"
                  onClick={() =>
                    setNickname(generateFunnyNickname(firstName, nickname))
                  }
                  className="inline-flex shrink-0 items-center justify-center gap-1 rounded-xl border border-[#DE754B]/40 bg-[#23140F] px-3 py-2 text-[11px] font-bold text-[#F4ECC2] transition hover:border-[#DE754B] hover:bg-[#2F1B14]"
                >
                  <span>🎲</span>
                  <span>Lustiger Vorschlag</span>
                </button>
              </div>
            </div>

            <WhatsAppPhoneField
              value={phone}
              onChange={setPhone}
              required
              placeholder="+41 79 123 45 67 / +49 170 1234567"
            />

            <div>
              <label className="mb-1 block text-[11px] font-semibold text-[#8E95A2]">
                Spielstärke / Klassierung *
              </label>
              <select
                required
                value={sttClass}
                onChange={(e) => setSttClass(e.target.value)}
                className="w-full min-w-0 rounded-xl border border-[#2B2F37] bg-[#0F1114] px-2.5 py-2 text-base sm:text-xs font-bold text-[#F3F4F6]"
              >
                {STT_LEVEL_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-[11px] font-semibold text-[#8E95A2]">
                Spielstil *
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {PLAYSTYLE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setPlaystyle(opt.value)}
                    className={`rounded-xl py-2 text-[11px] font-black transition ${
                      playstyle === opt.value
                        ? 'bg-[#6FB3A2] text-[#060708]'
                        : 'border border-[#2B2F37] bg-[#0F1114] text-[#9CA3AF] hover:text-[#F4ECC2]'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-1 block text-[11px] font-semibold text-[#8E95A2]">
                Sprache *
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {LANGUAGE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setLanguage(opt.value)}
                    className={`rounded-xl py-2 text-[11px] font-black transition ${
                      language === opt.value
                        ? 'bg-[#6FB3A2] text-[#060708]'
                        : 'border border-[#2B2F37] bg-[#0F1114] text-[#9CA3AF] hover:text-[#F4ECC2]'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-1 block text-[11px] font-semibold text-[#8E95A2]">
                Typische Hallentage &amp; Tageszeit (min. 1 Tag) *
              </label>
              <HallSchedulePicker
                schedule={hallSchedule}
                onChange={setHallSchedule}
              />
            </div>

            <div className="rounded-xl border border-[#DE754B]/40 bg-[#0F1114] p-2.5">
              <label className="mb-1.5 block text-[11px] font-bold text-[#F4ECC2]">
                Eigenen 4-stelligen Profil-PIN festlegen *
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="password"
                  inputMode="numeric"
                  maxLength={4}
                  required
                  value={pin}
                  onChange={(e) =>
                    setPin(e.target.value.replace(/\D/g, '').slice(0, 4))
                  }
                  placeholder="PIN (4 Ziffern) *"
                  className="w-full min-w-0 rounded-xl border border-[#2B2F37] bg-[#14161A] px-3 py-2 text-center text-base sm:text-xs font-black tracking-[0.25em] text-[#F4ECC2]"
                />
                <input
                  type="password"
                  inputMode="numeric"
                  maxLength={4}
                  required
                  value={pinConfirm}
                  onChange={(e) =>
                    setPinConfirm(e.target.value.replace(/\D/g, '').slice(0, 4))
                  }
                  placeholder="PIN bestätigen *"
                  className="w-full min-w-0 rounded-xl border border-[#2B2F37] bg-[#14161A] px-3 py-2 text-center text-base sm:text-xs font-black tracking-[0.25em] text-[#F4ECC2]"
                />
              </div>
            </div>

            {formError && (
              <div className="rounded-xl border border-rose-500/40 bg-rose-950/30 px-3 py-2 text-[11px] font-bold text-rose-300">
                {formError}
              </div>
            )}

            <button
              type="submit"
              className="w-full rounded-xl bg-[#6FB3A2] py-3 text-xs font-black text-[#060708] transition hover:bg-[#82C1B1]"
            >
              {connectOnly
                ? 'Für CLUB registrieren →'
                : 'Für CLUB & LEAGUE registrieren →'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [players, setPlayers] = useState(INITIAL_PLAYERS);
  const [seasons, setSeasons] = useState(INITIAL_SEASONS);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [world, setWorld] = useState('connect');
  const [leagueTab, setLeagueTab] = useState('matches');
  const [connectTab, setConnectTab] = useState('overview');
  const [selectedSeasonId, setSelectedSeasonId] = useState('2026-11');

  const [liveCheckins, setLiveCheckins] = useState(INITIAL_LIVE_CHECKINS);
  const [sessions, setSessions] = useState(INITIAL_SESSIONS);
  const [challenges, setChallenges] = useState(INITIAL_CHALLENGES);
  const [connectMatches, setConnectMatches] = useState(INITIAL_CONNECT_MATCHES);
  const [clubEvenings, setClubEvenings] = useState(INITIAL_CLUB_EVENINGS);

  const [showPlatformInfo, setShowPlatformInfo] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [createSessionType, setCreateSessionType] = useState(null);
  const [recordingLeagueMatch, setRecordingLeagueMatch] = useState(null);
  const [recordConnectTargetId, setRecordConnectTargetId] = useState(null);
  const [challengeTargetId, setChallengeTargetId] = useState(undefined);
  const [toastMessage, setToastMessage] = useState('');
  const customLogoUrl = '';

  const [adminPinCode, setAdminPinCode] = useState('9999');
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [showAdminPinPrompt, setShowAdminPinPrompt] = useState(false);
  const [adminPinInput, setAdminPinInput] = useState('');
  const [adminPinError, setAdminPinError] = useState('');
  const [adminTab, setAdminTab] = useState('members');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2600);
  };

  const playersById = useMemo(() => {
    const map = {};
    players.forEach((p) => {
      map[p.id] = p;
    });
    return map;
  }, [players]);

  const { ratingsByPlayer, matchDeltas } = useMemo(
    () => computeConnectRatings(players, connectMatches),
    [players, connectMatches]
  );

  const currentUser = currentUserId ? playersById[currentUserId] || null : null;

  const activeSeason = useMemo(
    () => seasons.find((s) => s.status === 'active') || seasons[seasons.length - 1],
    [seasons]
  );

  const viewedSeason = useMemo(
    () => seasons.find((s) => s.id === selectedSeasonId) || activeSeason,
    [seasons, selectedSeasonId, activeSeason]
  );

  const daysRemaining = useMemo(() => getDaysRemainingInMonth(), []);
  const isEndOfMonthReminderWindow = daysRemaining <= 3;

  const openLeagueMatchesCount = useMemo(() => {
    if (!currentUser) return 0;
    return activeSeason.matches.filter(
      (m) =>
        m.score1 === null &&
        (m.player1Id === currentUser.id || m.player2Id === currentUser.id)
    ).length;
  }, [activeSeason, currentUser]);

  const openChallengesCount = useMemo(() => {
    if (!currentUser) return 0;
    return challenges.filter(
      (c) =>
        c.status === 'open' &&
        (c.targetId === currentUser.id ||
          (c.targetId === null && c.challengerId !== currentUser.id))
    ).length;
  }, [challenges, currentUser]);

  if (!currentUser) {
    return (
      <>
        <AuthGateScreen
          players={players}
          activeSeason={activeSeason}
          onSelectProfile={(id) => {
            setCurrentUserId(id);
            setWorld('connect');
            setConnectTab('overview');
            showToast(`Willkommen zurück, ${playersById[id]?.nickname || ''}!`);
          }}
          onRegisterProfile={(newPlayer, leagueId) => {
            setPlayers((prev) => [...prev, newPlayer]);
            setSeasons((prev) =>
              prev.map((s) => {
                if (s.id !== activeSeason.id) return s;
                if (leagueId) {
                  const targetLeague = s.leagues.find((l) => l.id === leagueId);
                  const addedMatches = (targetLeague?.playerIds || []).map((otherId) => ({
                    id: `m-reg-${Date.now()}-${otherId}`,
                    leagueId,
                    player1Id: otherId,
                    player2Id: newPlayer.id,
                    score1: null,
                    score2: null,
                  }));
                  return {
                    ...s,
                    leagues: s.leagues.map((l) =>
                      l.id === leagueId
                        ? { ...l, playerIds: [...l.playerIds, newPlayer.id] }
                        : l
                    ),
                    matches: [...s.matches, ...addedMatches],
                  };
                }
                return {
                  ...s,
                  pausedPlayerIds: Array.from(
                    new Set([...s.pausedPlayerIds, newPlayer.id])
                  ),
                };
              })
            );
            setCurrentUserId(newPlayer.id);
            setWorld('connect');
            setConnectTab('overview');
            showToast(
              newPlayer.leagueStartNextMonth
                ? `Profil ${newPlayer.nickname} erstellt – Liga-Start auf nächsten Monat vorgemerkt!`
                : `Profil ${newPlayer.nickname} mit PIN erstellt!`
            );
          }}
          onOpenPlatformInfo={() => setShowPlatformInfo(true)}
          customLogoUrl={customLogoUrl}
        />
        {showPlatformInfo && (
          <PlatformInfoModal onClose={() => setShowPlatformInfo(false)} />
        )}
      </>
    );
  }

  const isCurrentUserLive = liveCheckins.some((c) => c.playerId === currentUser.id);
  const currentUserLeague = activeSeason.leagues.find((l) =>
    l.playerIds.includes(currentUser.id)
  );
  const isCurrentUserPaused = activeSeason.pausedPlayerIds.includes(currentUser.id);

  const handleUpdatePlayer = (updated) => {
    const cleaned = {
      ...updated,
      phone: normalizeWhatsAppPhone(updated.phone),
    };
    setPlayers((prev) => prev.map((p) => (p.id === cleaned.id ? cleaned : p)));
    showToast('Stammdaten gespeichert');
  };

  const handleAddMember = (newPlayer, leagueId) => {
    const cleanedPlayer = {
      ...newPlayer,
      phone: normalizeWhatsAppPhone(newPlayer.phone),
    };
    setPlayers((prev) => [...prev, cleanedPlayer]);
    if (leagueId) {
      setSeasons((prev) =>
        prev.map((s) =>
          s.id !== activeSeason.id
            ? s
            : {
                ...s,
                leagues: s.leagues.map((l) =>
                  l.id === leagueId
                    ? { ...l, playerIds: [...l.playerIds, cleanedPlayer.id] }
                    : l
                ),
              }
        )
      );
    }
    setShowAddMemberModal(false);
    showToast(`${cleanedPlayer.nickname} wurde hinzugefügt`);
  };

  const handleTogglePauseCurrentUser = () => {
    setSeasons((prev) =>
      prev.map((s) => {
        if (s.id !== activeSeason.id) return s;
        const alreadyPaused = s.pausedPlayerIds.includes(currentUser.id);
        if (alreadyPaused) {
          const targetLeague = s.leagues[s.leagues.length - 1];
          return {
            ...s,
            pausedPlayerIds: s.pausedPlayerIds.filter((id) => id !== currentUser.id),
            leagues: s.leagues.map((l) =>
              l.id === targetLeague?.id
                ? {
                    ...l,
                    playerIds: Array.from(new Set([...l.playerIds, currentUser.id])),
                  }
                : l
            ),
          };
        }
        return {
          ...s,
          pausedPlayerIds: Array.from(new Set([...s.pausedPlayerIds, currentUser.id])),
          leagues: s.leagues.map((l) => ({
            ...l,
            playerIds: l.playerIds.filter((id) => id !== currentUser.id),
          })),
        };
      })
    );
    showToast(isCurrentUserPaused ? 'Wieder aktiv gemeldet' : 'Für diesen Monat pausiert');
  };

  const handleOpenAdmin = () => {
    if (isAdminUnlocked) {
      setWorld('admin');
    } else {
      setAdminPinInput('');
      setAdminPinError('');
      setShowAdminPinPrompt(true);
    }
  };

  const handleAdminPinChange = (raw) => {
    const cleaned = raw.replace(/\D/g, '').slice(0, 4);
    setAdminPinInput(cleaned);
    if (adminPinError) setAdminPinError('');
    if (cleaned.length === 4) {
      if (cleaned === adminPinCode) {
        setIsAdminUnlocked(true);
        setShowAdminPinPrompt(false);
        setAdminPinInput('');
        setWorld('admin');
        showToast('Admin-Bereich freigeschaltet');
      } else {
        setAdminPinError('Falscher Admin-PIN.');
      }
    }
  };

  const handleAdminAssignPlayerLeague = (playerId, targetLeagueId) => {
    setSeasons((prev) =>
      prev.map((s) => {
        if (s.id !== activeSeason.id) return s;

        const cleanedLeagues = s.leagues.map((l) => ({
          ...l,
          playerIds: l.playerIds.filter((id) => id !== playerId),
        }));

        if (!targetLeagueId || targetLeagueId === 'paused') {
          return {
            ...s,
            leagues: cleanedLeagues,
            pausedPlayerIds: Array.from(new Set([...s.pausedPlayerIds, playerId])),
            matches: s.matches.filter(
              (m) => m.player1Id !== playerId && m.player2Id !== playerId
            ),
          };
        }

        const updatedLeagues = cleanedLeagues.map((l) =>
          l.id === targetLeagueId
            ? { ...l, playerIds: [...l.playerIds, playerId] }
            : l
        );

        const targetLeague = updatedLeagues.find((l) => l.id === targetLeagueId);
        const existingMatches = s.matches.filter(
          (m) =>
            m.leagueId !== targetLeagueId ||
            (targetLeague.playerIds.includes(m.player1Id) &&
              targetLeague.playerIds.includes(m.player2Id))
        );

        const addedMatches = [];
        if (targetLeague) {
          targetLeague.playerIds.forEach((otherId) => {
            if (otherId === playerId) return;
            const alreadyExists = existingMatches.some(
              (m) =>
                m.leagueId === targetLeagueId &&
                ((m.player1Id === playerId && m.player2Id === otherId) ||
                  (m.player1Id === otherId && m.player2Id === playerId))
            );
            if (!alreadyExists) {
              addedMatches.push({
                id: `m-adm-${Date.now()}-${otherId}`,
                leagueId: targetLeagueId,
                player1Id: otherId,
                player2Id: playerId,
                score1: null,
                score2: null,
              });
            }
          });
        }

        return {
          ...s,
          leagues: updatedLeagues,
          pausedPlayerIds: s.pausedPlayerIds.filter((id) => id !== playerId),
          matches: [...existingMatches, ...addedMatches],
        };
      })
    );

    setPlayers((prev) =>
      prev.map((p) =>
        p.id === playerId
          ? { ...p, connectOnly: !targetLeagueId || targetLeagueId === 'paused' }
          : p
      )
    );
    showToast('Liga-Zuteilung aktualisiert');
  };

  const handleAdminCreateLeague = (leagueName) => {
    const trimmed = leagueName.trim();
    if (!trimmed) return;
    setSeasons((prev) =>
      prev.map((s) => {
        if (s.id !== activeSeason.id) return s;
        const nextTier = s.leagues.length + 1;
        return {
          ...s,
          leagues: [
            ...s.leagues,
            {
              id: `${s.id}-l${nextTier}-${Date.now()}`,
              name: trimmed,
              tier: nextTier,
              playerIds: [],
            },
          ],
        };
      })
    );
    showToast(`${trimmed} erstellt`);
  };

  const handleAdminDeletePlayer = (playerId) => {
    if (playerId === currentUser.id) {
      showToast('Eigenes aktives Profil kann nicht gelöscht werden');
      return;
    }
    setPlayers((prev) => prev.filter((p) => p.id !== playerId));
    setSeasons((prev) =>
      prev.map((s) => ({
        ...s,
        leagues: s.leagues.map((l) => ({
          ...l,
          playerIds: l.playerIds.filter((id) => id !== playerId),
        })),
        pausedPlayerIds: s.pausedPlayerIds.filter((id) => id !== playerId),
        matches: s.matches.filter(
          (m) => m.player1Id !== playerId && m.player2Id !== playerId
        ),
      }))
    );
    setLiveCheckins((prev) => prev.filter((c) => c.playerId !== playerId));
    showToast('Mitglied entfernt');
  };

  const handleAdminResetLeagueMatch = (matchId) => {
    setSeasons((prev) =>
      prev.map((s) =>
        s.id !== viewedSeason.id
          ? s
          : {
              ...s,
              matches: s.matches.map((m) =>
                m.id === matchId ? { ...m, score1: null, score2: null } : m
              ),
            }
      )
    );
    showToast('Liga-Resultat zurückgesetzt');
  };

  const handleAdminDeleteConnectMatch = (matchId) => {
    setConnectMatches((prev) => prev.filter((m) => m.id !== matchId));
    showToast('CONNECT-Partie gelöscht');
  };

  const handleSaveLeagueMatchScore = (matchId, score1, score2) => {
    setSeasons((prev) =>
      prev.map((s) =>
        s.id !== viewedSeason.id
          ? s
          : {
              ...s,
              matches: s.matches.map((m) =>
                m.id === matchId ? { ...m, score1, score2 } : m
              ),
            }
      )
    );
    setRecordingLeagueMatch(null);
    showToast('Liga-Resultat eingetragen');
  };

  const handleRecordConnectMatch = (opponentId, winnerId, score) => {
    const newMatch = {
      id: `cm-${Date.now()}`,
      player1Id: currentUser.id,
      player2Id: opponentId,
      winnerId,
      score,
      dateLabel: 'Gerade eben',
    };
    setConnectMatches((prev) => [newMatch, ...prev]);
    setRecordConnectTargetId(null);
    showToast('CONNECT-Partie gespeichert & Rating aktualisiert!');
  };

  const handleCreateClubEvening = (eveningData) => {
    setClubEvenings((prev) => [
      {
        id: `ce-${Date.now()}`,
        hostId: currentUser.id,
        attendeeIds: [currentUser.id],
        ...eveningData,
      },
      ...prev,
    ]);
    showToast('Club-Abend angekündigt!');
  };

  const handleToggleClubEveningJoin = (eveningId) => {
    setClubEvenings((prev) =>
      prev.map((ev) => {
        if (ev.id !== eveningId) return ev;
        const joined = ev.attendeeIds.includes(currentUser.id);
        if (!joined && ev.attendeeIds.length >= ev.maxParticipants) return ev;
        return {
          ...ev,
          attendeeIds: joined
            ? ev.attendeeIds.filter((id) => id !== currentUser.id)
            : [...ev.attendeeIds, currentUser.id],
        };
      })
    );
  };

  const handleAdvanceMonth = () => {
    const currentIdx = seasons.findIndex((s) => s.id === activeSeason.id);
    if (currentIdx < seasons.length - 1) {
      setSelectedSeasonId(seasons[currentIdx + 1].id);
      return;
    }

    const sortedLeagues = [...activeSeason.leagues].sort((a, b) => a.tier - b.tier);
    const standingsByTier = sortedLeagues.map((l) => ({
      league: l,
      rows: computeStandings(l, activeSeason.matches, playersById),
    }));

    const nextRosters = standingsByTier.map((item) => item.rows.map((r) => r.playerId));

    for (let i = 0; i < standingsByTier.length - 1; i += 1) {
      const upper = nextRosters[i];
      const lower = nextRosters[i + 1];
      if (upper.length >= 2 && lower.length >= 2) {
        const relegated = upper[upper.length - 1];
        const promoted = lower[0];
        nextRosters[i] = [...upper.slice(0, -1), promoted];
        nextRosters[i + 1] = [relegated, ...lower.slice(1)];
      }
    }

    const nextLabel = getNextMonthLabel(activeSeason.label);
    const nextId = `season-${Date.now()}`;
    const nextMonthStarters = players.filter((p) => p.leagueStartNextMonth);
    const nextMonthStarterIds = new Set(nextMonthStarters.map((p) => p.id));

    const newLeagues = sortedLeagues.map((l, idx) => {
      const joiningInThisTier = nextMonthStarters
        .filter((p) =>
          p.preferredLeagueId
            ? p.preferredLeagueId === l.id
            : idx === sortedLeagues.length - 1
        )
        .map((p) => p.id);

      return {
        id: `${nextId}-l${l.tier}`,
        name: l.name,
        tier: l.tier,
        playerIds: Array.from(new Set([...nextRosters[idx], ...joiningInThisTier])),
      };
    });

    const newMatches = [];
    newLeagues.forEach((l) => {
      for (let i = 0; i < l.playerIds.length; i += 1) {
        for (let j = i + 1; j < l.playerIds.length; j += 1) {
          newMatches.push({
            id: `m-${nextId}-${l.tier}-${i}-${j}`,
            leagueId: l.id,
            player1Id: l.playerIds[i],
            player2Id: l.playerIds[j],
            score1: null,
            score2: null,
          });
        }
      }
    });

    const newSeason = {
      id: nextId,
      label: nextLabel,
      shortLabel: nextLabel.slice(0, 3) + ' ' + nextLabel.slice(-2),
      status: 'active',
      leagues: newLeagues,
      pausedPlayerIds: activeSeason.pausedPlayerIds.filter(
        (id) => !nextMonthStarterIds.has(id)
      ),
      matches: newMatches,
    };

    if (nextMonthStarterIds.size > 0) {
      setPlayers((prev) =>
        prev.map((p) =>
          nextMonthStarterIds.has(p.id)
            ? { ...p, leagueStartNextMonth: false }
            : p
        )
      );
    }

    setSeasons((prev) =>
      prev.map((s) => (s.id === activeSeason.id ? { ...s, status: 'completed' } : s)).concat(newSeason)
    );
    setSelectedSeasonId(nextId);
    showToast(`${nextLabel} mit Auf-/Abstieg gestartet!`);
  };

  const handleCheckIn = ({ tableInfo, untilTime, note }) => {
    setLiveCheckins((prev) => [
      {
        id: `lc-${Date.now()}`,
        playerId: currentUser.id,
        tableInfo,
        untilTime,
        note,
        checkedInAt: 'Gerade eben',
      },
      ...prev.filter((item) => item.playerId !== currentUser.id),
    ]);
    setShowCheckInModal(false);
    setWorld('connect');
    setConnectTab('live');
    showToast('Du bist jetzt LIVE in der Halle!');
  };

  const handleCheckOut = () => {
    setLiveCheckins((prev) => prev.filter((item) => item.playerId !== currentUser.id));
    showToast('Aus der Halle ausgecheckt');
  };

  const handleCreateSession = ({ type, dateLabel, note }) => {
    setSessions((prev) => [
      {
        id: `s-${Date.now()}`,
        type,
        authorId: currentUser.id,
        dateLabel,
        note,
        joinedIds: [currentUser.id],
        createdAt: 'Gerade eben',
      },
      ...prev,
    ]);
    setCreateSessionType(null);
    setWorld('connect');
    setConnectTab('board');
    showToast(type === 'announcement' ? 'Vorankündigung gepostet' : 'Spontan-Session gepostet');
  };

  const handleToggleJoinSession = (sessionId) => {
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id !== sessionId) return s;
        const joined = s.joinedIds.includes(currentUser.id);
        return {
          ...s,
          joinedIds: joined
            ? s.joinedIds.filter((id) => id !== currentUser.id)
            : [...s.joinedIds, currentUser.id],
        };
      })
    );
  };

  const handleSendChallenge = ({ targetId, format, whenLabel, note, sendWhatsApp }) => {
    const newChallenge = {
      id: `ch-${Date.now()}`,
      challengerId: currentUser.id,
      targetId: targetId || null,
      format,
      whenLabel,
      note,
      status: 'open',
      createdAt: 'Gerade eben',
    };
    setChallenges((prev) => [newChallenge, ...prev]);
    setChallengeTargetId(undefined);
    setWorld('connect');
    setConnectTab('board');

    if (sendWhatsApp && targetId && playersById[targetId]) {
      const target = playersById[targetId];
      const msg = `Hoi ${target.firstName}, ich (${currentUser.nickname}) fordere dich in LEAGUE & CONNECT heraus: ${format} (${whenLabel})${
        note ? ` – "${note}"` : ''
      }. Bist du dabei?`;
      window.open(buildWhatsAppLink(target.phone, msg), '_blank', 'noopener,noreferrer');
    }

    showToast(
      targetId
        ? `Herausforderung an ${playersById[targetId]?.nickname} gesendet!`
        : 'Offene Herausforderung im Club gepostet!'
    );
  };

  const handleRespondChallenge = (challengeId, nextStatus) => {
    setChallenges((prev) =>
      prev.map((c) =>
        c.id === challengeId
          ? {
              ...c,
              status: nextStatus,
              acceptedById: nextStatus === 'accepted' ? currentUser.id : c.acceptedById,
            }
          : c
      )
    );
    showToast(
      nextStatus === 'accepted'
        ? 'Herausforderung angenommen – viel Erfolg!'
        : 'Herausforderung abgelehnt'
    );
  };

  return (
    <div className="min-h-screen bg-[#060708] pb-24 text-[#F3F4F6] antialiased selection:bg-[#DE754B] selection:text-[#060708]">
      <header className="sticky top-0 z-30 border-b border-[#22252B] bg-[#060708]/95 backdrop-blur-md">
        <div className="mx-auto max-w-2xl px-4 pt-3 pb-2.5">
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => {
                setWorld('connect');
                setConnectTab('overview');
              }}
              className="flex items-center gap-2.5 text-left"
            >
              <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-[#2B2F37] bg-[#0C0D10] p-1 text-[#DE754B]">
                {customLogoUrl ? (
                  <img
                    src={customLogoUrl}
                    alt="PINGKONG Signet"
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <PingkongLogo className="h-full w-full" accentHead={false} />
                )}
              </div>
              <div>
                <div className="text-sm font-black tracking-[0.14em] text-[#F4ECC2] uppercase">
                  CONNECT
                </div>
                <div className="text-[10px] font-bold tracking-[0.16em] text-[#6FB3A2] uppercase">
                  CLUB <span className="text-[#6B7280]">/</span>{' '}
                  <span className="text-[#DE754B]">LEAGUE</span>
                </div>
              </div>
            </button>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setShowPlatformInfo(true)}
                title="Was ist CONNECT?"
                aria-label="Was ist CONNECT?"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#15171B] text-xs font-black text-[#F4ECC2] ring-1 ring-[#2B2F37] transition hover:border-[#DE754B] hover:text-[#DE754B]"
              >
                i
              </button>

              <button
                type="button"
                onClick={handleOpenAdmin}
                title="Club-Admin Bereich"
                className={`flex items-center gap-1 rounded-full px-2.5 py-1.5 text-xs font-bold transition ${
                  world === 'admin'
                    ? 'bg-[#DE754B] text-[#060708]'
                    : 'bg-[#15171B] text-[#9CA3AF] ring-1 ring-[#2B2F37] hover:border-[#DE754B] hover:text-[#F4ECC2]'
                }`}
              >
                <span>🛡️</span>
                <span className="hidden sm:inline">Admin</span>
              </button>

              <button
                type="button"
                onClick={() => (isCurrentUserLive ? handleCheckOut() : setShowCheckInModal(true))}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition ${
                  isCurrentUserLive
                    ? 'bg-[#6FB3A2]/25 text-[#A8D0B1] ring-1 ring-[#6FB3A2]/60'
                    : 'bg-[#15171B] text-[#D1D5DB] ring-1 ring-[#2B2F37] hover:border-[#6FB3A2]'
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    isCurrentUserLive ? 'animate-pulse bg-[#6FB3A2]' : 'bg-[#6B7280]'
                  }`}
                />
                <span>{isCurrentUserLive ? 'In Halle' : 'LIVE'}</span>
              </button>

              <div className="flex items-center overflow-hidden rounded-full border border-[#2B2F37] bg-[#15171B]">
                <button
                  type="button"
                  onClick={() => setShowProfileModal(true)}
                  title="Mein Profil anzeigen"
                  className="flex items-center gap-2 py-1.5 pl-1.5 pr-3 text-xs font-bold text-[#F4ECC2] transition hover:bg-[#1E2127]"
                >
                  <PlayerAvatar
                    player={currentUser}
                    sizeClass="h-6 w-6 text-[10px]"
                    isConnectAccent={currentUser.connectOnly}
                  />
                  <span className="max-w-[90px] truncate">{currentUser.nickname}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentUserId(null)}
                  title="Abmelden & zur Startseite"
                  aria-label="Abmelden"
                  className="flex items-center justify-center border-l border-[#2E323B] px-3 py-2 text-[#D1D5DB] transition hover:bg-rose-950/40 hover:text-rose-300"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div className="mt-2.5 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setWorld('connect')}
              className={`relative flex items-center justify-between rounded-xl px-3.5 py-2 text-left transition ${
                world === 'connect'
                  ? 'bg-[#6FB3A2] text-[#060708] shadow-lg shadow-[#6FB3A2]/25'
                  : 'bg-[#14161A] text-[#D1D5DB] ring-1 ring-[#6FB3A2]/35 hover:bg-[#16221F]'
              }`}
            >
              <div>
                <div className="text-xs font-black tracking-wide uppercase">CLUB</div>
                <div
                  className={`text-[10px] font-medium ${
                    world === 'connect' ? 'text-[#060708]/80' : 'text-[#8E95A2]'
                  }`}
                >
                  {liveCheckins.length} LIVE · {clubEvenings.length} Abende
                </div>
              </div>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-black ${
                  world === 'connect'
                    ? 'bg-[#060708] text-[#A8D0B1]'
                    : 'bg-[#152622] text-[#A8D0B1]'
                }`}
              >
                {openChallengesCount > 0 ? `⚡ ${openChallengesCount}` : 'Halle'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setWorld('league')}
              className={`relative flex items-center justify-between rounded-xl px-3.5 py-2 text-left transition ${
                world === 'league'
                  ? 'bg-[#DE754B] text-[#060708] shadow-lg shadow-[#DE754B]/25'
                  : 'bg-[#14161A] text-[#D1D5DB] ring-1 ring-[#DE754B]/35 hover:bg-[#231611]'
              }`}
            >
              <div>
                <div className="text-xs font-black tracking-wide uppercase">LEAGUE</div>
                <div
                  className={`text-[10px] font-medium ${
                    world === 'league' ? 'text-[#060708]/80' : 'text-[#8E95A2]'
                  }`}
                >
                  {viewedSeason.shortLabel} ·{' '}
                  {currentUserLeague
                    ? currentUserLeague.name
                    : isCurrentUserPaused
                    ? 'Pausiert'
                    : 'Info'}
                </div>
              </div>
              {openLeagueMatchesCount > 0 ? (
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-black ${
                    world === 'league'
                      ? 'bg-[#060708] text-[#F4ECC2]'
                      : 'bg-[#2C1912] text-[#F4ECC2] ring-1 ring-[#DE754B]/45'
                  }`}
                >
                  {openLeagueMatchesCount} offen
                </span>
              ) : (
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-black ${
                    world === 'league'
                      ? 'bg-[#060708] text-[#F4ECC2]'
                      : 'bg-[#2C1912] text-[#DE754B]'
                  }`}
                >
                  Liga
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {toastMessage && (
        <div className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-full border border-[#DE754B]/60 bg-[#15171B] px-4 py-2 text-xs font-bold text-[#F4ECC2] shadow-2xl">
          {toastMessage}
        </div>
      )}

      <main className="mx-auto max-w-2xl px-4 pt-4">
        {world === 'admin' && (
          <AdminPanelTab
            adminTab={adminTab}
            setAdminTab={setAdminTab}
            players={players}
            playersById={playersById}
            currentUser={currentUser}
            activeSeason={activeSeason}
            viewedSeason={viewedSeason}
            seasons={seasons}
            setSelectedSeasonId={setSelectedSeasonId}
            connectRatings={ratingsByPlayer}
            connectMatches={connectMatches}
            liveCheckins={liveCheckins}
            clubEvenings={clubEvenings}
            sessions={sessions}
            challenges={challenges}
            adminPinCode={adminPinCode}
            onChangeAdminPin={(newPin) => {
              setAdminPinCode(newPin);
              showToast('Admin-PIN geändert');
            }}
            onLockAdmin={() => {
              setIsAdminUnlocked(false);
              setWorld('connect');
              showToast('Admin-Bereich gesperrt');
            }}
            onOpenAddMember={() => setShowAddMemberModal(true)}
            onBulkImportMembers={(importedPlayers) => {
              setPlayers((prev) => [...prev, ...importedPlayers]);
              setSeasons((prev) =>
                prev.map((s) =>
                  s.id !== activeSeason.id
                    ? s
                    : {
                        ...s,
                        pausedPlayerIds: Array.from(
                          new Set([
                            ...s.pausedPlayerIds,
                            ...importedPlayers.map((p) => p.id),
                          ])
                        ),
                      }
                )
              );
              showToast(`${importedPlayers.length} Mitglieder importiert!`);
            }}
            onUpdatePlayer={handleUpdatePlayer}
            onDeletePlayer={handleAdminDeletePlayer}
            onAssignPlayerLeague={handleAdminAssignPlayerLeague}
            onCreateLeague={handleAdminCreateLeague}
            onAdvanceMonth={handleAdvanceMonth}
            onSelectMatchToRecord={(m) => setRecordingLeagueMatch(m)}
            onResetLeagueMatch={handleAdminResetLeagueMatch}
            onDeleteConnectMatch={handleAdminDeleteConnectMatch}
            onRemoveLiveCheckin={(id) => {
              setLiveCheckins((prev) => prev.filter((c) => c.id !== id));
              showToast('Check-in beendet');
            }}
            onDeleteClubEvening={(id) => {
              setClubEvenings((prev) => prev.filter((ev) => ev.id !== id));
              showToast('Club-Abend gelöscht');
            }}
            onDeleteSession={(id) => {
              setSessions((prev) => prev.filter((s) => s.id !== id));
              showToast('Pinnwand-Eintrag gelöscht');
            }}
            onDeleteChallenge={(id) => {
              setChallenges((prev) => prev.filter((c) => c.id !== id));
              showToast('Challenge gelöscht');
            }}
          />
        )}

        {world === 'league' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2 rounded-2xl border border-[#DE754B]/30 bg-[#14161A] p-2.5">
              <div className="flex items-center gap-1.5 overflow-x-auto">
                {seasons.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSelectedSeasonId(s.id)}
                    className={`whitespace-nowrap rounded-lg px-2.5 py-1.5 text-xs font-bold transition ${
                      s.id === viewedSeason.id
                        ? 'bg-[#DE754B] text-[#060708]'
                        : 'bg-[#0F1114] text-[#9CA3AF] hover:text-[#F4ECC2]'
                    }`}
                  >
                    {s.label} {s.status === 'active' ? '• Aktiv' : ''}
                  </button>
                ))}
              </div>

              {viewedSeason.status === 'active' && (
                <button
                  type="button"
                  onClick={handleAdvanceMonth}
                  className="shrink-0 rounded-lg border border-[#DE754B]/45 bg-[#291711] px-2.5 py-1.5 text-[11px] font-bold text-[#F4ECC2] hover:bg-[#361E16]"
                >
                  Monat abschliessen →
                </button>
              )}
            </div>

            {viewedSeason.status === 'active' && isEndOfMonthReminderWindow && (
              <div className="rounded-2xl border border-amber-500/40 bg-amber-950/25 p-3">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <div className="text-[11px] font-black uppercase tracking-wider text-amber-300">
                      ⏰ Noch {daysRemaining} {daysRemaining === 1 ? 'Tag' : 'Tage'} bis Monatsende
                    </div>
                    <p className="mt-0.5 text-xs text-[#E5E7EB]">
                      {openLeagueMatchesCount > 0
                        ? `Du hast noch ${openLeagueMatchesCount} offene Liga-Partie(n) in ${viewedSeason.label}.`
                        : `Alle deine Liga-Partien im ${viewedSeason.label} sind eingetragen!`}
                    </p>
                  </div>
                  {openLeagueMatchesCount > 0 && (
                    <button
                      type="button"
                      onClick={() => setLeagueTab('matches')}
                      className="shrink-0 rounded-xl bg-amber-400 px-3 py-1.5 text-[11px] font-black text-[#0F1012]"
                    >
                      Offene Spiele
                    </button>
                  )}
                </div>
              </div>
            )}

            <div className="grid grid-cols-3 gap-1.5 rounded-xl bg-[#14161A] p-1 ring-1 ring-[#DE754B]/25">
              {[
                { id: 'matches', label: 'Meine Spiele' },
                { id: 'standings', label: 'Tabelle & Aufstieg' },
                { id: 'status', label: 'Monats-Status' },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setLeagueTab(t.id)}
                  className={`rounded-lg py-2 text-xs font-bold transition ${
                    leagueTab === t.id
                      ? 'bg-[#DE754B] text-[#060708]'
                      : 'text-[#8E95A2] hover:text-[#F4ECC2]'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {leagueTab === 'matches' && (
              <LeagueMatchesTab
                season={viewedSeason}
                currentUser={currentUser}
                playersById={playersById}
                connectRatings={ratingsByPlayer}
                isEndOfMonthReminderWindow={isEndOfMonthReminderWindow}
                daysRemaining={daysRemaining}
                onSelectMatchToRecord={(m) => setRecordingLeagueMatch(m)}
              />
            )}

            {leagueTab === 'standings' && (
              <LeagueStandingsTab
                season={viewedSeason}
                playersById={playersById}
                currentUser={currentUser}
                connectRatings={ratingsByPlayer}
              />
            )}

            {leagueTab === 'status' && (
              <LeagueStatusTab
                season={activeSeason}
                currentUser={currentUser}
                players={players}
                connectRatings={ratingsByPlayer}
                isCurrentUserPaused={isCurrentUserPaused}
                onTogglePause={handleTogglePauseCurrentUser}
                onOpenAddMember={() => setShowAddMemberModal(true)}
              />
            )}
          </div>
        )}

        {world === 'connect' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setShowCheckInModal(true)}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-[#6FB3A2]/20 px-3 py-2.5 text-xs font-extrabold text-[#A8D0B1] ring-1 ring-[#6FB3A2]/45 transition hover:bg-[#6FB3A2]/30"
              >
                <span className="h-2 w-2 rounded-full bg-[#6FB3A2]" />
                <span>In Halle einchecken</span>
              </button>
              <button
                type="button"
                onClick={() => setChallengeTargetId(null)}
                className="rounded-xl bg-[#6FB3A2] px-3 py-2.5 text-xs font-black text-[#060708] transition hover:bg-[#82C1B1]"
              >
                ⚡ Herausfordern
              </button>
            </div>

            <div className="flex gap-1.5 overflow-x-auto pb-1">
              {[
                { id: 'overview', label: 'Übersicht' },
                { id: 'evenings', label: `Club-Abende (${clubEvenings.length})` },
                { id: 'live', label: `LIVE (${liveCheckins.length})` },
                {
                  id: 'board',
                  label: `Pinnwand (${sessions.length + openChallengesCount})`,
                },
                { id: 'players', label: `Rating (${players.length})` },
                { id: 'matches', label: `Partien (${connectMatches.length})` },
                {
                  id: 'newbies',
                  label: `Neu im Club (${players.filter((p) => p.isNewMember).length})`,
                },
                { id: 'halldays', label: 'Hallentage' },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setConnectTab(t.id)}
                  className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-bold transition ${
                    connectTab === t.id
                      ? 'bg-[#6FB3A2] text-[#060708]'
                      : 'bg-[#14161A] text-[#9CA3AF] ring-1 ring-[#22252B] hover:text-[#F4ECC2]'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {connectTab === 'overview' && (
              <ConnectOverviewTab
                currentUser={currentUser}
                activeSeason={activeSeason}
                players={players}
                playersById={playersById}
                liveCheckins={liveCheckins}
                challenges={challenges}
                clubEvenings={clubEvenings}
                connectMatches={connectMatches}
                connectRatings={ratingsByPlayer}
                matchDeltas={matchDeltas}
                onNavigateTab={(tab) => setConnectTab(tab)}
                onToggleJoinClubEvening={handleToggleClubEveningJoin}
                onRespondChallenge={handleRespondChallenge}
                onOpenChallenge={(targetId = null) => setChallengeTargetId(targetId)}
                onOpenCheckIn={() => setShowCheckInModal(true)}
                onOpenCreateSession={(type) => setCreateSessionType(type)}
              />
            )}

            {connectTab === 'evenings' && (
              <ClubEveningsTab
                clubEvenings={clubEvenings}
                currentUser={currentUser}
                playersById={playersById}
                onCreateEvening={handleCreateClubEvening}
                onToggleJoinEvening={handleToggleClubEveningJoin}
              />
            )}

            {connectTab === 'live' && (
              <LiveHallTab
                liveCheckins={liveCheckins}
                playersById={playersById}
                currentUser={currentUser}
                activeSeason={activeSeason}
                connectRatings={ratingsByPlayer}
                onCheckOut={handleCheckOut}
                onOpenCheckIn={() => setShowCheckInModal(true)}
                onOpenChallenge={(targetId) => setChallengeTargetId(targetId)}
              />
            )}

            {connectTab === 'board' && (
              <BoardTab
                sessions={sessions}
                challenges={challenges}
                playersById={playersById}
                currentUser={currentUser}
                activeSeason={activeSeason}
                connectRatings={ratingsByPlayer}
                onToggleJoin={handleToggleJoinSession}
                onOpenCreate={(type) => setCreateSessionType(type)}
                onOpenChallenge={(targetId = null) => setChallengeTargetId(targetId)}
                onRespondChallenge={handleRespondChallenge}
              />
            )}

            {connectTab === 'halldays' && (
              <HallDaysTab
                players={players}
                currentUser={currentUser}
                activeSeason={activeSeason}
                connectRatings={ratingsByPlayer}
                onOpenEditProfile={() => setShowProfileModal(true)}
                onOpenChallenge={(targetId) => setChallengeTargetId(targetId)}
              />
            )}

            {connectTab === 'players' && (
              <ClubPlayersTab
                players={players}
                currentUser={currentUser}
                liveCheckins={liveCheckins}
                connectRatings={ratingsByPlayer}
                onOpenAddMember={() => setShowAddMemberModal(true)}
                onOpenChallenge={(targetId) => setChallengeTargetId(targetId)}
                onOpenRecordConnectMatch={(opponentId) =>
                  setRecordConnectTargetId(opponentId)
                }
              />
            )}

            {connectTab === 'matches' && (
              <ConnectMatchesTab
                connectMatches={connectMatches}
                matchDeltas={matchDeltas}
                playersById={playersById}
                currentUser={currentUser}
                connectRatings={ratingsByPlayer}
              />
            )}

            {connectTab === 'newbies' && (
              <NewMembersTab
                players={players}
                currentUser={currentUser}
                activeSeason={activeSeason}
                connectRatings={ratingsByPlayer}
                onOpenChallenge={(targetId) => setChallengeTargetId(targetId)}
                onOpenEditProfile={() => setShowProfileModal(true)}
              />
            )}
          </div>
        )}
      </main>

      {showPlatformInfo && (
        <PlatformInfoModal onClose={() => setShowPlatformInfo(false)} />
      )}

      {showProfileModal && (
        <PlayerProfileModal
          currentUser={currentUser}
          onLogout={() => {
            setShowProfileModal(false);
            setCurrentUserId(null);
          }}
          onSave={handleUpdatePlayer}
          onClose={() => setShowProfileModal(false)}
        />
      )}

      {showAddMemberModal && (
        <AddMemberModal
          activeSeason={activeSeason}
          onAdd={handleAddMember}
          onClose={() => setShowAddMemberModal(false)}
        />
      )}

      {showCheckInModal && (
        <CheckInModal
          onSubmit={handleCheckIn}
          onClose={() => setShowCheckInModal(false)}
        />
      )}

      {createSessionType && (
        <CreateSessionModal
          defaultType={createSessionType}
          onSubmit={handleCreateSession}
          onClose={() => setCreateSessionType(null)}
        />
      )}

      {recordingLeagueMatch && (
        <RecordLeagueMatchModal
          match={recordingLeagueMatch}
          player1={playersById[recordingLeagueMatch.player1Id]}
          player2={playersById[recordingLeagueMatch.player2Id]}
          onSave={handleSaveLeagueMatchScore}
          onClose={() => setRecordingLeagueMatch(null)}
        />
      )}

      {recordConnectTargetId !== null && (
        <RecordConnectMatchModal
          players={players}
          currentUser={currentUser}
          connectRatings={ratingsByPlayer}
          defaultOpponentId={recordConnectTargetId}
          onSave={handleRecordConnectMatch}
          onClose={() => setRecordConnectTargetId(null)}
        />
      )}

      {challengeTargetId !== undefined && (
        <ChallengeModal
          players={players}
          currentUser={currentUser}
          activeSeason={activeSeason}
          connectRatings={ratingsByPlayer}
          defaultTargetId={challengeTargetId}
          onSend={handleSendChallenge}
          onClose={() => setChallengeTargetId(undefined)}
        />
      )}

      {showAdminPinPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xs space-y-3 rounded-2xl border border-[#DE754B]/45 bg-[#14161A] p-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-base">🛡️</span>
                <h3 className="text-sm font-black text-[#F4ECC2]">
                  Club-Admin Zugang
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAdminPinPrompt(false)}
                className="rounded-lg bg-[#202329] px-2 py-1 text-xs font-bold text-[#9CA3AF]"
              >
                ✕
              </button>
            </div>

            <p className="text-[11px] text-[#9CA3AF]">
              Bitte 4-stelligen Admin-PIN eingeben, um Mitglieder, Ligen und
              Resultate zu verwalten.
            </p>

            <input
              type="password"
              inputMode="numeric"
              maxLength={4}
              autoFocus
              value={adminPinInput}
              onChange={(e) => handleAdminPinChange(e.target.value)}
              placeholder="••••"
              className="w-full rounded-xl border border-[#2B2F37] bg-[#0F1114] px-3 py-2.5 text-center text-base font-black tracking-[0.4em] text-[#F4ECC2]"
            />

            {adminPinError && (
              <div className="rounded-xl border border-rose-500/40 bg-rose-950/30 px-3 py-1.5 text-center text-[11px] font-bold text-rose-300">
                {adminPinError}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function LeagueMatchesTab({
  season,
  currentUser,
  playersById,
  connectRatings,
  isEndOfMonthReminderWindow,
  daysRemaining,
  onSelectMatchToRecord,
}) {
  const [showAllLeagues, setShowAllLeagues] = useState(false);

  const visibleMatches = useMemo(() => {
    if (showAllLeagues) return season.matches;
    return season.matches.filter(
      (m) => m.player1Id === currentUser.id || m.player2Id === currentUser.id
    );
  }, [season, currentUser.id, showAllLeagues]);

  const leaguesById = useMemo(() => {
    const map = {};
    season.leagues.forEach((l) => {
      map[l.id] = l;
    });
    return map;
  }, [season]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-[#9CA3AF]">
          {showAllLeagues ? 'Alle Spiele im Monat' : 'Deine Liga-Spiele'} (
          {visibleMatches.length})
        </span>
        <button
          type="button"
          onClick={() => setShowAllLeagues((v) => !v)}
          className="text-xs font-bold text-[#DE754B] underline"
        >
          {showAllLeagues ? 'Nur meine Spiele' : 'Alle Ligen zeigen'}
        </button>
      </div>

      {visibleMatches.length === 0 ? (
        <div className="rounded-2xl border border-[#24272D] bg-[#181A1E] p-5 text-center text-xs text-[#9CA3AF]">
          Keine Liga-Spiele in dieser Ansicht vorhanden.
        </div>
      ) : (
        <div className="space-y-2.5">
          {visibleMatches.map((m) => {
            const p1 = playersById[m.player1Id];
            const p2 = playersById[m.player2Id];
            const league = leaguesById[m.leagueId];
            const isPlayed = m.score1 !== null && m.score2 !== null;
            const opponent = m.player1Id === currentUser.id ? p2 : p1;
            const waText = opponent
              ? getContextWhatsAppMessage('league_match', currentUser, opponent, {
                  leagueName: league?.name,
                  seasonLabel: season.label,
                })
              : '';
            const waReminderText = opponent
              ? getContextWhatsAppMessage('league_reminder', currentUser, opponent, {
                  seasonLabel: season.label,
                  daysRemaining,
                })
              : '';

            return (
              <div
                key={m.id}
                className="rounded-2xl border border-[#24272D] bg-[#181A1E] p-3.5"
              >
                <div className="flex items-center justify-between text-[11px] text-[#8E95A2]">
                  <span className="font-bold text-[#DE754B]">{league?.name}</span>
                  <span>{isPlayed ? 'Gespielt' : 'Offen'}</span>
                </div>

                <div className="mt-2 flex items-center justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-extrabold text-[#F3F4F6]">
                      {p1?.nickname}
                    </div>
                    <div className="mt-0.5">
                      <PlayerBadge
                        player={p1}
                        season={season}
                        ratingInfo={connectRatings[p1?.id]}
                      />
                    </div>
                  </div>

                  <div className="shrink-0 rounded-xl bg-[#111215] px-3 py-1.5 text-center ring-1 ring-[#2A2D35]">
                    {isPlayed ? (
                      <span className="text-sm font-black tracking-wider text-[#F4ECC2]">
                        {m.score1} : {m.score2}
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-[#6B7280]">vs</span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1 text-right">
                    <div className="truncate text-sm font-extrabold text-[#F3F4F6]">
                      {p2?.nickname}
                    </div>
                    <div className="mt-0.5 flex justify-end">
                      <PlayerBadge
                        player={p2}
                        season={season}
                        ratingInfo={connectRatings[p2?.id]}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap items-center justify-end gap-2">
                  {!isPlayed && opponent && opponent.id !== currentUser.id && (
                    <>
                      <WhatsAppActionButton
                        phone={opponent.phone}
                        message={waText}
                        label="WhatsApp Termin"
                      />
                      {isEndOfMonthReminderWindow && (
                        <a
                          href={buildWhatsAppLink(opponent.phone, waReminderText)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-lg bg-amber-500/20 px-2.5 py-1.5 text-[11px] font-bold text-amber-300 ring-1 ring-amber-500/40"
                        >
                          ⏰ Erinnern
                        </a>
                      )}
                    </>
                  )}
                  <button
                    type="button"
                    onClick={() => onSelectMatchToRecord(m)}
                    className={`rounded-lg px-3 py-1.5 text-[11px] font-black transition ${
                      isPlayed
                        ? 'bg-[#252830] text-[#D1D5DB] hover:bg-[#30343E]'
                        : 'bg-[#DE754B] text-[#060708] hover:bg-[#E78760]'
                    }`}
                  >
                    {isPlayed ? 'Korrigieren' : 'Resultat eintragen'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ConnectOverviewTab({
  currentUser,
  players,
  playersById,
  liveCheckins,
  challenges,
  clubEvenings,
  connectMatches,
  connectRatings,
  matchDeltas,
  onNavigateTab,
  onToggleJoinClubEvening,
  onRespondChallenge,
  onOpenChallenge,
  onOpenCheckIn,
  onOpenCreateSession,
}) {
  const newMembers = useMemo(
    () => players.filter((p) => p.isNewMember),
    [players]
  );

  const openChallenges = useMemo(
    () => challenges.filter((c) => c.status === 'open'),
    [challenges]
  );

  const topRatedPlayers = useMemo(() => {
    return [...players]
      .sort(
        (a, b) =>
          (connectRatings[b.id]?.elo || 0) - (connectRatings[a.id]?.elo || 0)
      )
      .slice(0, 3);
  }, [players, connectRatings]);

  const myRating = connectRatings[currentUser.id];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-1.5">
        <button
          type="button"
          onClick={() => onNavigateTab('live')}
          className="rounded-xl border border-emerald-500/30 bg-[#181A1E] p-2.5 text-center"
        >
          <div className="text-sm font-black text-emerald-300">
            {liveCheckins.length}
          </div>
          <div className="mt-0.5 text-[10px] font-bold text-[#9CA3AF]">
            LIVE Halle
          </div>
        </button>

        <button
          type="button"
          onClick={() => onNavigateTab('evenings')}
          className="rounded-xl border border-[#6FB3A2]/30 bg-[#181A1E] p-2.5 text-center"
        >
          <div className="text-sm font-black text-[#A8D0B1]">
            {clubEvenings.length}
          </div>
          <div className="mt-0.5 text-[10px] font-bold text-[#9CA3AF]">
            Club-Abende
          </div>
        </button>

        <button
          type="button"
          onClick={() => onNavigateTab('players')}
          className="rounded-xl border border-[#C8A26E]/30 bg-[#181A1E] p-2.5 text-center"
        >
          <div className="text-sm font-black text-[#E6C79C]">
            {myRating?.elo || 1200}
          </div>
          <div className="mt-0.5 text-[10px] font-bold text-[#9CA3AF]">
            Mein Rating
          </div>
        </button>

        <button
          type="button"
          onClick={() => onNavigateTab('newbies')}
          className="rounded-xl border border-[#24272D] bg-[#181A1E] p-2.5 text-center"
        >
          <div className="text-sm font-black text-[#F3F4F6]">
            {newMembers.length}
          </div>
          <div className="mt-0.5 text-[10px] font-bold text-[#9CA3AF]">
            Neu im Club
          </div>
        </button>
      </div>

      <div className="rounded-2xl border border-[#24272D] bg-[#181A1E] p-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span className="text-xs font-black uppercase tracking-wide text-[#F3F4F6]">
              Gerade LIVE in der Halle
            </span>
          </div>
          <button
            type="button"
            onClick={() => onNavigateTab('live')}
            className="text-[11px] font-bold text-emerald-300 underline"
          >
            Alle ({liveCheckins.length})
          </button>
        </div>

        {liveCheckins.length === 0 ? (
          <div className="mt-2.5 flex items-center justify-between rounded-xl bg-[#131417] p-3 text-xs text-[#9CA3AF]">
            <span>Aktuell niemand eingecheckt.</span>
            <button
              type="button"
              onClick={onOpenCheckIn}
              className="rounded-lg bg-emerald-500/20 px-2.5 py-1 text-[11px] font-bold text-emerald-300"
            >
              Jetzt einchecken
            </button>
          </div>
        ) : (
          <div className="mt-2.5 space-y-2">
            {liveCheckins.slice(0, 2).map((item) => {
              const p = playersById[item.playerId];
              if (!p) return null;
              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-2 rounded-xl bg-[#131417] px-3 py-2"
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <PlayerAvatar
                      player={p}
                      sizeClass="h-7 w-7 text-[10px]"
                      isConnectAccent
                    />
                    <div className="min-w-0">
                      <div className="truncate text-xs font-bold text-[#F3F4F6]">
                        {p.nickname}
                      </div>
                      <div className="truncate text-[10px] text-[#8E95A2]">
                        {item.tableInfo} · bis {item.untilTime}
                      </div>
                    </div>
                  </div>
                  {p.id !== currentUser.id && (
                    <div className="flex shrink-0 items-center gap-1.5">
                      <WhatsAppActionButton
                        phone={p.phone}
                        message={getContextWhatsAppMessage('live_hall', currentUser, p, {
                          tableInfo: item.tableInfo,
                        })}
                        label=""
                        compact
                      />
                      <button
                        type="button"
                        onClick={() => onOpenChallenge(p.id)}
                        className="shrink-0 rounded-lg bg-[#6FB3A2] px-2.5 py-1 text-[11px] font-black text-[#060708]"
                      >
                        ⚡ Duell
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-[#6FB3A2]/35 bg-[#181A1E] p-3.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wide text-[#A8D0B1]">
            🎉 Nächster Club-Abend
          </span>
          <button
            type="button"
            onClick={() => onNavigateTab('evenings')}
            className="text-[11px] font-bold text-[#A8D0B1] underline"
          >
            Alle Abende ({clubEvenings.length})
          </button>
        </div>

        {clubEvenings[0] && (
          <div className="mt-2.5 rounded-xl bg-[#131417] p-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="text-xs font-black text-[#F3F4F6]">
                  {clubEvenings[0].title}
                </div>
                <div className="mt-0.5 text-[11px] font-semibold text-[#A8D0B1]">
                  {clubEvenings[0].dateLabel} · {clubEvenings[0].tables}
                </div>
              </div>
              <span className="shrink-0 rounded-full bg-[#152622] px-2 py-0.5 text-[10px] font-bold text-[#A8D0B1]">
                {clubEvenings[0].attendeeIds.length}/
                {clubEvenings[0].maxParticipants}
              </span>
            </div>

            <p className="mt-1.5 text-[11px] text-[#D1D5DB]">
              {clubEvenings[0].description}
            </p>

            <div className="mt-2.5 flex items-center justify-between">
              <span className="text-[10px] text-[#8E95A2]">
                Organisiert von{' '}
                {playersById[clubEvenings[0].hostId]?.nickname || 'Club'}
              </span>
              <button
                type="button"
                onClick={() => onToggleJoinClubEvening(clubEvenings[0].id)}
                className={`rounded-lg px-3 py-1 text-[11px] font-black ${
                  clubEvenings[0].attendeeIds.includes(currentUser.id)
                    ? 'bg-[#6FB3A2] text-[#060708]'
                    : 'bg-[#252830] text-[#F3F4F6]'
                }`}
              >
                {clubEvenings[0].attendeeIds.includes(currentUser.id)
                  ? 'Angemeldet ✓'
                  : 'Anmelden'}
              </button>
            </div>
          </div>
        )}
      </div>

      {openChallenges.length > 0 && (
        <div className="rounded-2xl border border-[#C8A26E]/35 bg-[#1E1A14] p-3.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wide text-[#E6C79C]">
              ⚡ Offene Herausforderungen ({openChallenges.length})
            </span>
            <button
              type="button"
              onClick={() => onNavigateTab('board')}
              className="text-[11px] font-bold text-[#E6C79C] underline"
            >
              Zur Pinnwand
            </button>
          </div>

          <div className="mt-2.5 space-y-2">
            {openChallenges.slice(0, 2).map((ch) => {
              const challenger = playersById[ch.challengerId];
              const target = ch.targetId ? playersById[ch.targetId] : null;
              if (!challenger) return null;
              const canAccept =
                challenger.id !== currentUser.id &&
                (ch.targetId === currentUser.id || ch.targetId === null);

              return (
                <div
                  key={ch.id}
                  className="flex items-center justify-between gap-2 rounded-xl bg-[#131417] px-3 py-2"
                >
                  <div className="min-w-0">
                    <div className="truncate text-xs font-bold text-[#F3F4F6]">
                      {challenger.nickname} →{' '}
                      <span className="text-[#E6C79C]">
                        {target ? target.nickname : 'Alle'}
                      </span>
                    </div>
                    <div className="truncate text-[10px] text-[#8E95A2]">
                      {ch.format} · {ch.whenLabel}
                    </div>
                  </div>

                  {canAccept && (
                    <button
                      type="button"
                      onClick={() => onRespondChallenge(ch.id, 'accepted')}
                      className="shrink-0 rounded-lg bg-emerald-500 px-2.5 py-1 text-[11px] font-black text-[#0F1012]"
                    >
                      Annehmen ✓
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-[#24272D] bg-[#181A1E] p-3.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wide text-[#E6C79C]">
              ★ Top-Rating
            </span>
            <button
              type="button"
              onClick={() => onNavigateTab('players')}
              className="text-[11px] font-bold text-[#E6C79C] underline"
            >
              Rangliste
            </button>
          </div>
          <div className="mt-2 space-y-1.5">
            {topRatedPlayers.map((p, idx) => {
              const r = connectRatings[p.id];
              return (
                <div
                  key={p.id}
                  className="flex items-center justify-between rounded-lg bg-[#131417] px-2.5 py-1.5 text-xs"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="font-black text-[#C8A26E]">{idx + 1}.</span>
                    <span className="truncate font-bold text-[#F3F4F6]">
                      {p.nickname}
                    </span>
                  </div>
                  <span className="shrink-0 font-black text-[#E6C79C]">
                    {r?.elo}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-[#24272D] bg-[#181A1E] p-3.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wide text-[#F3F4F6]">
              Letzte Partien
            </span>
            <button
              type="button"
              onClick={() => onNavigateTab('matches')}
              className="text-[11px] font-bold text-[#A8D0B1] underline"
            >
              Alle ({connectMatches.length})
            </button>
          </div>
          <div className="mt-2 space-y-1.5">
            {connectMatches.slice(0, 3).map((m) => {
              const p1 = playersById[m.player1Id];
              const p2 = playersById[m.player2Id];
              const d = matchDeltas[m.id];
              return (
                <div
                  key={m.id}
                  className="flex items-center justify-between rounded-lg bg-[#131417] px-2.5 py-1.5 text-[11px]"
                >
                  <span className="truncate font-bold text-[#D1D5DB]">
                    {p1?.nickname} vs. {p2?.nickname}
                  </span>
                  <span className="shrink-0 font-black text-[#E6C79C]">
                    {m.score}{' '}
                    {d ? (
                      <span className="text-[10px] text-emerald-400">
                        ({d.delta1 >= 0 ? `+${d.delta1}` : d.delta1})
                      </span>
                    ) : null}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {newMembers.length > 0 && (
        <div className="rounded-2xl border border-[#24272D] bg-[#181A1E] p-3.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wide text-emerald-300">
              👋 Neu im Club ({newMembers.length})
            </span>
            <button
              type="button"
              onClick={() => onNavigateTab('newbies')}
              className="text-[11px] font-bold text-emerald-300 underline"
            >
              Alle vorstellen
            </button>
          </div>
          <div className="mt-2.5 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {newMembers.slice(0, 2).map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between gap-2 rounded-xl bg-[#131417] p-2.5"
              >
                <div className="flex min-w-0 items-center gap-2">
                  <PlayerAvatar
                    player={p}
                    sizeClass="h-9 w-9 text-xs"
                    isConnectAccent
                  />
                  <div className="min-w-0">
                    <div className="truncate text-xs font-black text-[#F3F4F6]">
                      {p.nickname}
                    </div>
                    <div className="truncate text-[10px] text-[#8E95A2]">
                      {p.sttClass} · {p.joinedLabel}
                    </div>
                  </div>
                </div>
                {p.id !== currentUser.id && (
                  <div className="flex shrink-0 items-center gap-1">
                    <WhatsAppActionButton
                      phone={p.phone}
                      message={getContextWhatsAppMessage('new_member', currentUser, p)}
                      label=""
                      compact
                    />
                    <button
                      type="button"
                      onClick={() => onOpenChallenge(p.id)}
                      className="shrink-0 rounded-lg bg-[#6FB3A2] px-2 py-1 text-[10px] font-black text-[#060708]"
                    >
                      ⚡ Einladen
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onOpenCreateSession('announcement')}
          className="flex-1 rounded-xl border border-[#2B2F37] bg-[#181A1E] py-2.5 text-xs font-bold text-[#A8D0B1]"
        >
          + Training ankündigen
        </button>
        <button
          type="button"
          onClick={() => onNavigateTab('halldays')}
          className="flex-1 rounded-xl border border-[#2B2F37] bg-[#181A1E] py-2.5 text-xs font-bold text-[#D1D5DB]"
        >
          📅 Hallentage prüfen
        </button>
      </div>
    </div>
  );
}

function ClubEveningsTab({
  clubEvenings,
  currentUser,
  playersById,
  onCreateEvening,
  onToggleJoinEvening,
}) {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [dateLabel, setDateLabel] = useState('Freitag · 19:30 Uhr');
  const [tables, setTables] = useState('Tisch 1–3');
  const [maxParticipants, setMaxParticipants] = useState(10);
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onCreateEvening({
      title: title.trim(),
      dateLabel: dateLabel.trim() || 'Freitag · 19:30 Uhr',
      tables: tables.trim() || 'Tisch 1 & 2',
      maxParticipants: Number(maxParticipants) || 10,
      description:
        description.trim() ||
        'Gemütlicher Club-Abend für alle Spielstärken – einfach anmelden!',
    });
    setTitle('');
    setDescription('');
    setShowForm(false);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-xs font-black tracking-wide text-[#F3F4F6] uppercase">
            Club-Abende ({clubEvenings.length})
          </h2>
          <p className="text-[11px] text-[#8E95A2]">
            Gemeinsame Spielabende ankündigen &amp; direkt anmelden
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="rounded-xl bg-[#6FB3A2] px-3 py-1.5 text-xs font-black text-[#060708]"
        >
          {showForm ? 'Schliessen' : '+ Abend ankündigen'}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="space-y-2.5 rounded-2xl border border-[#6FB3A2]/40 bg-[#181A1E] p-3.5"
        >
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Titel (z. B. Freitags-Rundlauf & Doppel) *"
            className="w-full rounded-xl border border-[#2E323B] bg-[#131417] px-3 py-2 text-xs font-bold text-[#F3F4F6]"
          />

          <div className="grid grid-cols-3 gap-2">
            <input
              type="text"
              value={dateLabel}
              onChange={(e) => setDateLabel(e.target.value)}
              placeholder="Wann?"
              className="col-span-2 rounded-xl border border-[#2E323B] bg-[#131417] px-3 py-2 text-xs text-[#F3F4F6]"
            />
            <input
              type="number"
              min={2}
              max={32}
              value={maxParticipants}
              onChange={(e) => setMaxParticipants(e.target.value)}
              placeholder="Max. Plätze"
              className="rounded-xl border border-[#2E323B] bg-[#131417] px-3 py-2 text-xs text-[#F3F4F6]"
            />
          </div>

          <input
            type="text"
            value={tables}
            onChange={(e) => setTables(e.target.value)}
            placeholder="Tische (z. B. Tisch 1–3)"
            className="w-full rounded-xl border border-[#2E323B] bg-[#131417] px-3 py-2 text-xs text-[#F3F4F6]"
          />

          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Kurze Beschreibung für die Teilnehmer..."
            className="w-full rounded-xl border border-[#2E323B] bg-[#131417] px-3 py-2 text-xs text-[#F3F4F6]"
          />

          <button
            type="submit"
            className="w-full rounded-xl bg-[#6FB3A2] py-2.5 text-xs font-black text-[#060708]"
          >
            Club-Abend veröffentlichen
          </button>
        </form>
      )}

      <div className="space-y-3">
        {clubEvenings.map((ev) => {
          const isJoined = ev.attendeeIds.includes(currentUser.id);
          const isFull =
            !isJoined && ev.attendeeIds.length >= ev.maxParticipants;
          const host = playersById[ev.hostId];

          return (
            <div
              key={ev.id}
              className="rounded-2xl border border-[#24272D] bg-[#181A1E] p-4"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-sm font-black text-[#F3F4F6]">
                    {ev.title}
                  </h3>
                  <div className="mt-0.5 text-xs font-bold text-[#A8D0B1]">
                    {ev.dateLabel} · {ev.tables}
                  </div>
                </div>
                <span className="shrink-0 rounded-full bg-[#131417] px-2.5 py-1 text-[11px] font-black text-[#E6C79C] ring-1 ring-[#2B2F37]">
                  {ev.attendeeIds.length}/{ev.maxParticipants} Plätze
                </span>
              </div>

              <p className="mt-2 text-xs text-[#D1D5DB]">{ev.description}</p>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {ev.attendeeIds.map((pid) => {
                  const attendee = playersById[pid];
                  if (!attendee) return null;
                  const isMe = attendee.id === currentUser.id;
                  const pillContent = (
                    <>
                      <PlayerAvatar
                        player={attendee}
                        sizeClass="h-4 w-4 text-[8px]"
                        isConnectAccent
                      />
                      <span>{attendee.nickname}</span>
                      {!isMe && <span className="text-[10px] text-emerald-300">💬</span>}
                    </>
                  );

                  if (isMe) {
                    return (
                      <span
                        key={pid}
                        className="inline-flex items-center gap-1 rounded-full bg-[#131417] px-2 py-0.5 text-[11px] text-[#D1D5DB] ring-1 ring-[#272A30]"
                      >
                        {pillContent}
                      </span>
                    );
                  }

                  return (
                    <a
                      key={pid}
                      href={buildWhatsAppLink(
                        attendee.phone,
                        getContextWhatsAppMessage('club_evening', currentUser, attendee, {
                          title: ev.title,
                        })
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={`${attendee.nickname} per WhatsApp anschreiben`}
                      className="inline-flex items-center gap-1 rounded-full bg-[#131417] px-2 py-0.5 text-[11px] text-[#D1D5DB] ring-1 ring-[#272A30] transition hover:border-emerald-500/40 hover:text-emerald-200"
                    >
                      {pillContent}
                    </a>
                  );
                })}
              </div>

              <div className="mt-3.5 flex items-center justify-between border-t border-[#24272D] pt-2.5">
                <span className="text-[11px] text-[#8E95A2]">
                  Host: {host?.nickname || 'Club'}
                </span>
                <button
                  type="button"
                  disabled={isFull}
                  onClick={() => onToggleJoinEvening(ev.id)}
                  className={`rounded-xl px-4 py-1.5 text-xs font-black transition ${
                    isJoined
                      ? 'bg-[#6FB3A2]/20 text-[#A8D0B1] ring-1 ring-[#6FB3A2]/45'
                      : isFull
                      ? 'bg-[#22252C] text-[#6B7280]'
                      : 'bg-[#6FB3A2] text-[#060708]'
                  }`}
                >
                  {isJoined
                    ? 'Dabei ✓ (Abmelden)'
                    : isFull
                    ? 'Ausgebucht'
                    : 'Jetzt anmelden'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function LeagueStandingsTab({ season, playersById, currentUser, connectRatings }) {
  const sortedLeagues = [...season.leagues].sort((a, b) => a.tier - b.tier);

  const funStats = useMemo(() => {
    const playedMatches = season.matches.filter(
      (m) => m.score1 !== null && m.score2 !== null
    );
    if (playedMatches.length === 0) return [];

    const playerAgg = {};
    season.leagues.forEach((l) => {
      l.playerIds.forEach((pid) => {
        playerAgg[pid] = {
          playerId: pid,
          player: playersById[pid],
          leagueName: l.name,
          played: 0,
          won: 0,
          lost: 0,
          setsWon: 0,
          setsLost: 0,
          fiveSetWins: 0,
          cleanSweeps: 0,
        };
      });
    });

    playedMatches.forEach((m) => {
      const s1 = playerAgg[m.player1Id];
      const s2 = playerAgg[m.player2Id];
      if (!s1 || !s2) return;

      s1.played += 1;
      s2.played += 1;
      s1.setsWon += m.score1;
      s1.setsLost += m.score2;
      s2.setsWon += m.score2;
      s2.setsLost += m.score1;

      const isFiveSetter = m.score1 + m.score2 >= 5;
      if (m.score1 > m.score2) {
        s1.won += 1;
        s2.lost += 1;
        if (isFiveSetter) s1.fiveSetWins += 1;
        if (m.score2 === 0) s1.cleanSweeps += 1;
      } else {
        s2.won += 1;
        s1.lost += 1;
        if (isFiveSetter) s2.fiveSetWins += 1;
        if (m.score1 === 0) s2.cleanSweeps += 1;
      }
    });

    const activeStats = Object.values(playerAgg).filter((s) => s.played > 0);
    if (activeStats.length === 0) return [];

    const cards = [];

    const undefeated = activeStats
      .filter((s) => s.won > 0 && s.lost === 0)
      .sort((a, b) => b.won - a.won || b.setsWon - a.setsWon);
    if (undefeated.length > 0) {
      const names = undefeated.map((u) => u.player?.nickname).join(', ');
      const top = undefeated[0];
      cards.push({
        id: 'undefeated',
        icon: '🛡️',
        title: 'Noch ungeschlagen',
        highlight: names,
        detail:
          undefeated.length === 1
            ? `${top.won} Sieg${top.won === 1 ? '' : 'e'}, 0 Niederlagen (${top.leagueName})`
            : `${undefeated.length} Spieler noch ohne Niederlage`,
      });
    }

    const bestDiff = [...activeStats].sort((a, b) => {
      const diffA = a.setsWon - a.setsLost;
      const diffB = b.setsWon - b.setsLost;
      if (diffB !== diffA) return diffB - diffA;
      return b.setsWon - a.setsWon;
    })[0];
    if (bestDiff) {
      const diff = bestDiff.setsWon - bestDiff.setsLost;
      cards.push({
        id: 'sets',
        icon: '🔥',
        title: 'Satz-Maschine',
        highlight: bestDiff.player?.nickname,
        detail: `Satzverhältnis ${bestDiff.setsWon}:${bestDiff.setsLost} (${
          diff >= 0 ? `+${diff}` : diff
        })`,
      });
    }

    const clutch = [...activeStats]
      .filter((s) => s.fiveSetWins > 0)
      .sort((a, b) => b.fiveSetWins - a.fiveSetWins)[0];
    if (clutch) {
      cards.push({
        id: 'clutch',
        icon: '⚡',
        title: 'Nerven aus Stahl',
        highlight: clutch.player?.nickname,
        detail: `${clutch.fiveSetWins}× im 5. Entscheidungssatz gejubelt`,
      });
    }

    const sweeper = [...activeStats]
      .filter((s) => s.cleanSweeps > 0)
      .sort((a, b) => b.cleanSweeps - a.cleanSweeps)[0];
    if (sweeper) {
      cards.push({
        id: 'sweep',
        icon: '🧹',
        title: 'Zu-Null-Abräumer',
        highlight: sweeper.player?.nickname,
        detail: `${sweeper.cleanSweeps}× glatt mit 3:0 durchmarschiert`,
      });
    }

    const busiest = [...activeStats].sort((a, b) => b.played - a.played)[0];
    if (busiest) {
      cards.push({
        id: 'busiest',
        icon: '🏃',
        title: 'Fleissbiene',
        highlight: busiest.player?.nickname,
        detail: `Bereits ${busiest.played} Liga-Partie(n) absolviert`,
      });
    }

    return cards.slice(0, 4);
  }, [season, playersById]);

  return (
    <div className="space-y-4">
      {funStats.length > 0 && (
        <div className="rounded-2xl border border-[#DE754B]/35 bg-gradient-to-br from-[#231611] to-[#16181C] p-3.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#F4ECC2]">
              ✨ Monats-Highlights · {season.label}
            </span>
            <span className="text-[10px] text-[#8E95A2]">Live-Auswertung</span>
          </div>

          <div className="mt-2.5 grid grid-cols-2 gap-2">
            {funStats.map((item) => (
              <div
                key={item.id}
                className="rounded-xl border border-[#2A2926] bg-[#121316]/90 p-2.5"
              >
                <div className="flex items-center gap-1.5">
                  <span className="text-sm">{item.icon}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wide text-[#9CA3AF]">
                    {item.title}
                  </span>
                </div>
                <div className="mt-1 truncate text-xs font-black text-[#F3F4F6]">
                  {item.highlight}
                </div>
                <div className="mt-0.5 text-[10px] leading-snug text-[#DE754B]">
                  {item.detail}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {sortedLeagues.map((league, idx) => {
        const rows = computeStandings(league, season.matches, playersById);
        const hasUpper = idx > 0;
        const hasLower = idx < sortedLeagues.length - 1;

        return (
          <div
            key={league.id}
            className="overflow-hidden rounded-2xl border border-[#24272D] bg-[#181A1E]"
          >
            <div className="flex items-center justify-between border-b border-[#24272D] bg-[#1D2025] px-3.5 py-2.5">
              <span className="text-xs font-black tracking-wide text-[#DE754B] uppercase">
                {league.name}
              </span>
              <span className="text-[11px] text-[#8E95A2]">
                {hasUpper ? '↑ Aufstieg' : ''} {hasUpper && hasLower ? '·' : ''}{' '}
                {hasLower ? '↓ Abstieg' : ''}
              </span>
            </div>

            <div className="divide-y divide-[#22252B]">
              {rows.map((r, pos) => {
                const isPromotion = hasUpper && pos === 0;
                const isRelegation = hasLower && pos === rows.length - 1 && rows.length > 1;
                const isMe = r.playerId === currentUser.id;

                return (
                  <div
                    key={r.playerId}
                    className={`flex items-center justify-between gap-2 px-3.5 py-2.5 ${
                      isMe ? 'bg-[#291711]' : ''
                    }`}
                  >
                    <div className="flex min-w-0 items-center gap-2.5">
                      <span
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-black ${
                          isPromotion
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : isRelegation
                            ? 'bg-rose-500/20 text-rose-300'
                            : 'bg-[#131417] text-[#9CA3AF]'
                        }`}
                      >
                        {pos + 1}
                      </span>
                      <div className="min-w-0">
                        <div className="truncate text-xs font-bold text-[#F3F4F6]">
                          {r.player?.nickname}{' '}
                          {isPromotion && (
                            <span className="text-[10px] text-emerald-400">↑</span>
                          )}
                          {isRelegation && (
                            <span className="text-[10px] text-rose-400">↓</span>
                          )}
                        </div>
                        <div className="mt-0.5">
                          <PlayerBadge
                            player={r.player}
                            season={season}
                            ratingInfo={connectRatings[r.playerId]}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <div className="text-right">
                        <div className="text-[11px] font-semibold text-[#9CA3AF]">
                          {r.setsWon}:{r.setsLost}
                        </div>
                        <div className="text-[10px] text-[#6B7280]">{r.played} Sp.</div>
                      </div>
                      <div className="w-8 rounded-lg bg-[#111215] py-1 text-center text-xs font-black text-[#F4ECC2]">
                        {r.points}
                      </div>
                      {!isMe && r.player && (
                        <WhatsAppActionButton
                          phone={r.player.phone}
                          message={getContextWhatsAppMessage(
                            'league_table',
                            currentUser,
                            r.player,
                            { leagueName: league.name }
                          )}
                          label=""
                          compact
                          title={`${r.player.nickname} per WhatsApp anschreiben`}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function LeagueStatusTab({
  season,
  currentUser,
  players,
  connectRatings,
  isCurrentUserPaused,
  onTogglePause,
  onOpenAddMember,
}) {
  const pausedPlayers = players.filter((p) => season.pausedPlayerIds.includes(p.id));

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-[#24272D] bg-[#181A1E] p-4">
        <div className="text-xs font-black tracking-wide text-[#DE754B] uppercase">
          Deine Monats-Teilnahme ({season.label})
        </div>
        <p className="mt-1.5 text-xs text-[#D1D5DB]">
          {isCurrentUserPaused
            ? 'Du bist aktuell für diesen Monat pausiert. Du kannst jederzeit für den nächsten Monat wieder einsteigen.'
            : 'Du spielst diesen Monat aktiv in der Liga mit.'}
        </p>

        <button
          type="button"
          onClick={onTogglePause}
          className={`mt-3 w-full rounded-xl py-2.5 text-xs font-black transition ${
            isCurrentUserPaused
              ? 'bg-[#DE754B] text-[#060708]'
              : 'bg-[#252830] text-[#F3F4F6] hover:bg-[#30343E]'
          }`}
        >
          {isCurrentUserPaused
            ? 'Jetzt wieder aktiv melden'
            : 'Diesen Monat pausieren (Abmelden)'}
        </button>
      </div>

      <div className="rounded-2xl border border-[#24272D] bg-[#181A1E] p-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#9CA3AF]">
            Pausierte / Nur-CLUB Mitglieder ({pausedPlayers.length})
          </span>
          <button
            type="button"
            onClick={onOpenAddMember}
            className="text-xs font-bold text-[#DE754B] underline"
          >
            + Neues Mitglied
          </button>
        </div>

        <div className="mt-3 space-y-2">
          {pausedPlayers.map((p) => {
            const scheduleSummary = formatHallScheduleSummary(p);
            return (
              <div
                key={p.id}
                className="flex items-center justify-between gap-2 rounded-xl bg-[#131417] px-3 py-2"
              >
                <div className="min-w-0">
                  <div className="truncate text-xs font-bold text-[#F3F4F6]">
                    {p.nickname} ({p.firstName})
                  </div>
                  {scheduleSummary && (
                    <div className="truncate text-[10px] text-[#8E95A2]">
                      Halle: {scheduleSummary}
                    </div>
                  )}
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  <PlayerBadge
                    player={p}
                    season={season}
                    ratingInfo={connectRatings[p.id]}
                  />
                  {p.id !== currentUser.id && (
                    <WhatsAppActionButton
                      phone={p.phone}
                      message={getContextWhatsAppMessage('league_paused', currentUser, p)}
                      label=""
                      compact
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function LiveHallTab({
  liveCheckins,
  playersById,
  currentUser,
  activeSeason,
  connectRatings,
  onCheckOut,
  onOpenCheckIn,
  onOpenChallenge,
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-[#9CA3AF]">
          Aktuell in der Halle ({liveCheckins.length})
        </span>
        <button
          type="button"
          onClick={onOpenCheckIn}
          className="text-xs font-bold text-emerald-300 underline"
        >
          + Einchecken
        </button>
      </div>

      {liveCheckins.length === 0 ? (
        <div className="rounded-2xl border border-[#24272D] bg-[#181A1E] p-5 text-center text-xs text-[#9CA3AF]">
          Momentan ist noch niemand LIVE eingecheckt. Mach den Anfang!
        </div>
      ) : (
        liveCheckins.map((item) => {
          const p = playersById[item.playerId];
          if (!p) return null;
          const isMe = p.id === currentUser.id;
          const waMsg = getContextWhatsAppMessage('live_hall', currentUser, p, {
            tableInfo: item.tableInfo,
          });

          return (
            <div
              key={item.id}
              className="rounded-2xl border border-emerald-500/25 bg-[#181A1E] p-3.5"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <PlayerAvatar
                    player={p}
                    sizeClass="h-9 w-9 text-xs"
                    isConnectAccent
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-emerald-400" />
                      <span className="text-sm font-black text-[#F3F4F6]">
                        {p.nickname}
                      </span>
                    </div>
                    <div className="mt-0.5">
                      <PlayerBadge
                        player={p}
                        season={activeSeason}
                        ratingInfo={connectRatings[p.id]}
                      />
                    </div>
                  </div>
                </div>

                <span className="shrink-0 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-bold text-emerald-300">
                  {item.tableInfo} · bis {item.untilTime}
                </span>
              </div>

              {item.note && (
                <p className="mt-2.5 rounded-xl bg-[#131417] px-3 py-2 text-xs text-[#D1D5DB]">
                  {item.note}
                </p>
              )}

              <div className="mt-3 flex items-center justify-between text-[11px] text-[#8E95A2]">
                <span>Check-in {item.checkedInAt}</span>
                {isMe ? (
                  <button
                    type="button"
                    onClick={onCheckOut}
                    className="rounded-lg bg-[#252830] px-2.5 py-1 font-bold text-[#F3F4F6]"
                  >
                    Auschecken
                  </button>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => onOpenChallenge(p.id)}
                      className="rounded-lg bg-[#6FB3A2] px-2.5 py-1 font-black text-[#060708]"
                    >
                      ⚡ Herausfordern
                    </button>
                    <a
                      href={buildWhatsAppLink(p.phone, waMsg)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg bg-[#1F3A2E] px-2.5 py-1 font-bold text-emerald-300"
                    >
                      WhatsApp
                    </a>
                  </div>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

function BoardTab({
  sessions,
  challenges,
  playersById,
  currentUser,
  activeSeason,
  connectRatings,
  onToggleJoin,
  onOpenCreate,
  onOpenChallenge,
  onRespondChallenge,
}) {
  const [onlyMatchingLevel, setOnlyMatchingLevel] = useState(false);

  const visibleChallenges = useMemo(() => {
    return challenges.filter((c) => {
      if (c.status === 'declined') return false;
      if (!onlyMatchingLevel) return true;
      const author = playersById[c.challengerId];
      if (!author || author.id === currentUser.id) return true;
      return isMatchingLevel(currentUser, author, activeSeason);
    });
  }, [challenges, onlyMatchingLevel, playersById, currentUser, activeSeason]);

  const visibleSessions = useMemo(() => {
    if (!onlyMatchingLevel) return sessions;
    return sessions.filter((s) => {
      const author = playersById[s.authorId];
      if (!author || author.id === currentUser.id) return true;
      return isMatchingLevel(currentUser, author, activeSeason);
    });
  }, [sessions, onlyMatchingLevel, playersById, currentUser, activeSeason]);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => setOnlyMatchingLevel((v) => !v)}
          className={`rounded-full px-3 py-1 text-[11px] font-bold transition ${
            onlyMatchingLevel
              ? 'bg-[#6FB3A2] text-[#060708]'
              : 'bg-[#181A1E] text-[#9CA3AF] ring-1 ring-[#272A30]'
          }`}
        >
          {onlyMatchingLevel ? '✓ Passt zu meinem Niveau' : 'Filter: Mein Niveau'}
        </button>

        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={() => onOpenChallenge(null)}
            className="rounded-lg bg-[#6FB3A2] px-2.5 py-1 text-[11px] font-black text-[#060708]"
          >
            ⚡ Herausfordern
          </button>
          <button
            type="button"
            onClick={() => onOpenCreate('announcement')}
            className="rounded-lg bg-[#22252C] px-2.5 py-1 text-[11px] font-bold text-[#A8D0B1]"
          >
            + Vorankündigung
          </button>
        </div>
      </div>

      {visibleChallenges.length > 0 && (
        <div className="space-y-2">
          <div className="text-[11px] font-black uppercase tracking-wider text-[#E6C79C]">
            ⚡ Spontane Herausforderungen
          </div>
          {visibleChallenges.map((ch) => {
            const challenger = playersById[ch.challengerId];
            const target = ch.targetId ? playersById[ch.targetId] : null;
            if (!challenger) return null;

            const isMyOutgoing = challenger.id === currentUser.id;
            const canAccept =
              ch.status === 'open' &&
              !isMyOutgoing &&
              (ch.targetId === currentUser.id || ch.targetId === null);

            const waReply = getContextWhatsAppMessage(
              'challenge_reply',
              currentUser,
              challenger,
              { format: ch.format, whenLabel: ch.whenLabel }
            );

            return (
              <div
                key={ch.id}
                className="rounded-2xl border border-[#C8A26E]/45 bg-[#201B14] p-3.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="rounded bg-[#C8A26E] px-1.5 py-0.5 text-[10px] font-black text-[#0F1012]">
                        ⚡ DUELL
                      </span>
                      <span className="text-xs font-black text-[#F3F4F6]">
                        {challenger.nickname}
                      </span>
                      <span className="text-xs text-[#9CA3AF]">→</span>
                      <span className="text-xs font-extrabold text-[#E6C79C]">
                        {target ? target.nickname : 'Offen an alle'}
                      </span>
                    </div>
                    <div className="mt-1">
                      <PlayerBadge
                        player={challenger}
                        season={activeSeason}
                        ratingInfo={connectRatings[challenger.id]}
                      />
                    </div>
                  </div>

                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-black ${
                      ch.status === 'accepted'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-[#2E261A] text-[#E6C79C]'
                    }`}
                  >
                    {ch.status === 'accepted' ? 'Angenommen ✓' : 'Offen'}
                  </span>
                </div>

                <div className="mt-2 text-xs font-bold text-[#E6C79C]">
                  {ch.format} · <span className="text-[#D1D5DB]">{ch.whenLabel}</span>
                </div>

                {ch.note && (
                  <p className="mt-1 text-xs text-[#D1D5DB]">«{ch.note}»</p>
                )}

                <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[11px] text-[#8E95A2]">{ch.createdAt}</span>

                  <div className="flex items-center gap-1.5">
                    {canAccept && (
                      <>
                        <button
                          type="button"
                          onClick={() => onRespondChallenge(ch.id, 'accepted')}
                          className="rounded-lg bg-emerald-500 px-3 py-1 text-xs font-black text-[#0F1012]"
                        >
                          Annehmen ✓
                        </button>
                        {ch.targetId === currentUser.id && (
                          <button
                            type="button"
                            onClick={() => onRespondChallenge(ch.id, 'declined')}
                            className="rounded-lg bg-[#252830] px-2.5 py-1 text-xs font-bold text-[#9CA3AF]"
                          >
                            Passt nicht
                          </button>
                        )}
                      </>
                    )}

                    {!isMyOutgoing && (
                      <a
                        href={buildWhatsAppLink(challenger.phone, waReply)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg bg-[#1F3A2E] px-2.5 py-1 text-xs font-bold text-emerald-300"
                      >
                        WhatsApp
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {visibleSessions.map((s) => {
        const author = playersById[s.authorId];
        if (!author) return null;
        const isJoined = s.joinedIds.includes(currentUser.id);
        const waMsg = getContextWhatsAppMessage('session_join', currentUser, author, {
          dateLabel: s.dateLabel,
        });

        return (
          <div
            key={s.id}
            className="rounded-2xl border border-[#24272D] bg-[#181A1E] p-3.5"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <PlayerAvatar
                  player={author}
                  sizeClass="h-8 w-8 text-[10px]"
                  isConnectAccent={author.connectOnly}
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-[#F3F4F6]">
                      {author.nickname}
                    </span>
                    <span
                      className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                        s.type === 'announcement'
                          ? 'bg-[#152622] text-[#A8D0B1]'
                          : 'bg-[#2C2418] text-[#E6C79C]'
                      }`}
                    >
                      {s.type === 'announcement' ? 'Vorankündigung' : 'Spontan'}
                    </span>
                  </div>
                  <div className="mt-0.5">
                    <PlayerBadge
                      player={author}
                      season={activeSeason}
                      ratingInfo={connectRatings[author.id]}
                    />
                  </div>
                </div>
              </div>

              <span className="text-[11px] text-[#8E95A2]">{s.createdAt}</span>
            </div>

            <div className="mt-2.5 text-xs font-extrabold text-[#E6C79C]">
              {s.dateLabel}
            </div>
            <p className="mt-1 text-xs text-[#D1D5DB]">{s.note}</p>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
              <div className="text-[11px] text-[#9CA3AF]">
                Dabei ({s.joinedIds.length}):{' '}
                {s.joinedIds
                  .map((id) => playersById[id]?.nickname)
                  .filter(Boolean)
                  .join(', ')}
              </div>

              <div className="flex items-center gap-1.5">
                {author.id !== currentUser.id && (
                  <>
                    <button
                      type="button"
                      onClick={() => onOpenChallenge(author.id)}
                      className="rounded-lg bg-[#2C2418] px-2 py-1 text-xs font-bold text-[#E6C79C]"
                    >
                      ⚡
                    </button>
                    <a
                      href={buildWhatsAppLink(author.phone, waMsg)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg bg-[#1F3A2E] px-2.5 py-1 text-xs font-bold text-emerald-300"
                    >
                      WhatsApp
                    </a>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => onToggleJoin(s.id)}
                  className={`rounded-lg px-3 py-1 text-xs font-bold transition ${
                    isJoined
                      ? 'bg-[#6FB3A2] text-[#060708]'
                      : 'bg-[#252830] text-[#F3F4F6] hover:bg-[#313540]'
                  }`}
                >
                  {isJoined ? 'Dabei ✓' : 'Bin dabei'}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function HallDaysTab({
  players,
  currentUser,
  activeSeason,
  connectRatings,
  onOpenEditProfile,
  onOpenChallenge,
}) {
  const [selectedDay, setSelectedDay] = useState('Do');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('Alle');

  const matchingPlayers = useMemo(() => {
    return players.filter((p) => {
      const schedule = getNormalizedHallSchedule(p);
      const slots = schedule[selectedDay] || [];
      if (slots.length === 0) return false;
      if (selectedTimeSlot === 'Alle') return true;
      return slots.includes(selectedTimeSlot);
    });
  }, [players, selectedDay, selectedTimeSlot]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-[#9CA3AF]">
          Wer ist wann in der Halle?
        </span>
        <button
          type="button"
          onClick={onOpenEditProfile}
          className="text-[11px] font-bold text-[#A8D0B1] underline"
        >
          Meine Zeiten bearbeiten
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {DAYS_OF_WEEK.map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => setSelectedDay(d)}
            className={`rounded-lg py-2 text-xs font-black ${
              selectedDay === d
                ? 'bg-[#6FB3A2] text-[#060708]'
                : 'bg-[#181A1E] text-[#9CA3AF] ring-1 ring-[#24272D]'
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-4 gap-1.5">
        {['Alle', ...HALL_TIME_SLOTS.map((s) => s.id)].map((slot) => (
          <button
            key={slot}
            type="button"
            onClick={() => setSelectedTimeSlot(slot)}
            className={`rounded-lg py-1.5 text-[11px] font-bold transition ${
              selectedTimeSlot === slot
                ? 'bg-[#6FB3A2] text-[#060708]'
                : 'bg-[#181A1E] text-[#9CA3AF] ring-1 ring-[#24272D] hover:text-[#F3F4F6]'
            }`}
          >
            {slot === 'Alle' ? 'Alle Zeiten' : slot}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        <div className="text-xs font-bold text-[#9CA3AF]">
          Oft am {selectedDay}
          {selectedTimeSlot !== 'Alle' ? ` (${selectedTimeSlot})` : ''} in der
          Halle ({matchingPlayers.length})
        </div>

        {matchingPlayers.length === 0 ? (
          <div className="rounded-2xl border border-[#24272D] bg-[#181A1E] p-4 text-center text-xs text-[#8E95A2]">
            Für {selectedDay}
            {selectedTimeSlot !== 'Alle' ? ` · ${selectedTimeSlot}` : ''} ist
            noch niemand eingetragen.
          </div>
        ) : (
          matchingPlayers.map((p) => {
            const schedule = getNormalizedHallSchedule(p);
            const daySlots = schedule[selectedDay] || [];
            const waMsg = getContextWhatsAppMessage('hall_day', currentUser, p, {
              day: selectedDay,
              timeSlot:
                selectedTimeSlot !== 'Alle'
                  ? selectedTimeSlot
                  : daySlots.join(' / '),
            });
            return (
              <div
                key={p.id}
                className="flex items-center justify-between gap-2 rounded-2xl border border-[#24272D] bg-[#181A1E] p-3"
              >
                <div className="flex min-w-0 items-center gap-2.5">
                  <PlayerAvatar
                    player={p}
                    sizeClass="h-8 w-8 text-[10px]"
                    isConnectAccent={p.connectOnly}
                  />
                  <div className="min-w-0">
                    <div className="truncate text-xs font-black text-[#F3F4F6]">
                      {p.nickname} ({p.firstName})
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-1">
                      {daySlots.map((slot) => (
                        <span
                          key={slot}
                          className="rounded bg-[#152622] px-1.5 py-0.5 text-[10px] font-bold text-[#A8D0B1] ring-1 ring-[#6FB3A2]/35"
                        >
                          {selectedDay} · {slot}
                        </span>
                      ))}
                      <PlayerBadge
                        player={p}
                        season={activeSeason}
                        ratingInfo={connectRatings[p.id]}
                      />
                    </div>
                  </div>
                </div>

                {p.id !== currentUser.id && (
                  <div className="flex shrink-0 items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => onOpenChallenge(p.id)}
                      className="rounded-lg bg-[#6FB3A2] px-2.5 py-1.5 text-[11px] font-black text-[#060708]"
                    >
                      ⚡ Duell
                    </button>
                    <a
                      href={buildWhatsAppLink(p.phone, waMsg)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg bg-[#1F3A2E] px-2.5 py-1.5 text-[11px] font-bold text-emerald-300"
                    >
                      WhatsApp
                    </a>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function ClubPlayersTab({
  players,
  currentUser,
  liveCheckins,
  connectRatings,
  onOpenAddMember,
  onOpenChallenge,
  onOpenRecordConnectMatch,
}) {
  const [search, setSearch] = useState('');

  const livePlayerIds = useMemo(
    () => new Set(liveCheckins.map((c) => c.playerId)),
    [liveCheckins]
  );

  const sortedAndFilteredPlayers = useMemo(() => {
    const q = search.trim().toLowerCase();
    return [...players]
      .filter((p) => {
        if (!q) return true;
        const tierLabel = connectRatings[p.id]?.tier?.label || '';
        const haystack =
          `${p.nickname} ${p.firstName} ${p.lastName} ${p.sttClass || ''} ${p.language || ''} ${p.playstyle || ''} ${tierLabel}`.toLowerCase();
        return haystack.includes(q);
      })
      .sort((a, b) => {
        const eloA = connectRatings[a.id]?.elo || 0;
        const eloB = connectRatings[b.id]?.elo || 0;
        if (eloB !== eloA) return eloB - eloA;
        return a.nickname.localeCompare(b.nickname);
      });
  }, [players, search, connectRatings]);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-xs font-black tracking-wide text-[#F3F4F6] uppercase">
            CONNECT-Rating ({sortedAndFilteredPlayers.length})
          </h2>
          <p className="text-[10px] text-[#8E95A2]">
            Sortiert nach Rating · Partie erfassen oder herausfordern
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onOpenRecordConnectMatch('')}
            className="rounded-lg bg-[#6FB3A2] px-2.5 py-1.5 text-[11px] font-black text-[#060708]"
          >
            + Partie eintragen
          </button>
          <button
            type="button"
            onClick={onOpenAddMember}
            className="rounded-xl bg-[#22252C] px-3 py-2 text-xs font-bold text-[#E5E7EB]"
          >
            + Mitglied
          </button>
        </div>
      </div>

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Spieler, Spielstil, Sprache oder Rating suchen..."
        className="w-full rounded-lg border border-[#2B2F37] bg-[#181A1E] px-2.5 py-1.5 text-xs text-[#F3F4F6]"
      />

      <div className="overflow-hidden rounded-xl border border-[#24272D] bg-[#181A1E] divide-y divide-[#202329]">
        {sortedAndFilteredPlayers.map((p, index) => {
          const isLive = livePlayerIds.has(p.id);
          const isMe = p.id === currentUser.id;
          const rating = connectRatings[p.id];
          const tier = rating?.tier;

          return (
            <div
              key={p.id}
              className={`flex items-center justify-between gap-2 px-2.5 py-1.5 text-xs ${
                isMe ? 'bg-[#152622]/60' : 'hover:bg-[#1D2025]'
              }`}
            >
              <div className="flex min-w-0 items-center gap-1.5">
                <span className="w-4 shrink-0 text-right text-[10px] font-black text-[#6B7280]">
                  {index + 1}
                </span>

                <PlayerAvatar
                  player={p}
                  sizeClass="h-5 w-5 text-[9px]"
                  isConnectAccent={p.connectOnly}
                />

                <span className="truncate font-bold text-[#F3F4F6]">{p.nickname}</span>

                {isLive && (
                  <span
                    title="Jetzt LIVE in der Halle"
                    className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400"
                  />
                )}

                {p.sttClass && (
                  <span className="shrink-0 text-[10px] text-[#6B7280]">
                    {p.sttClass}
                  </span>
                )}

                {p.playstyle && (
                  <span className="hidden shrink-0 rounded bg-[#131417] px-1.5 py-0.5 text-[9px] font-semibold text-[#F4ECC2] sm:inline">
                    {p.playstyle}
                  </span>
                )}

                <span className="shrink-0 rounded bg-[#131417] px-1 py-0.5 text-[9px] font-bold text-[#A8D0B1]">
                  {getLanguageShortLabel(p.language)}
                </span>
              </div>

              <div className="flex shrink-0 items-center gap-1.5">
                {rating && rating.played > 0 && (
                  <span className="hidden text-[10px] text-[#6B7280] sm:inline">
                    {rating.wins}/{rating.losses}
                  </span>
                )}

                {tier && (
                  <span
                    className={`rounded border px-1.5 py-0.5 text-[10px] font-bold leading-none ${tier.badgeClass}`}
                    title={`${tier.label} · ${rating.elo} Punkte`}
                  >
                    {tier.symbol} {rating.elo}
                  </span>
                )}

                {!isMe ? (
                  <div className="flex items-center gap-1">
                    <WhatsAppActionButton
                      phone={p.phone}
                      message={getContextWhatsAppMessage(
                        'rating_directory',
                        currentUser,
                        p
                      )}
                      label=""
                      compact
                      title={`${p.nickname} per WhatsApp anschreiben`}
                    />
                    <button
                      type="button"
                      onClick={() => onOpenChallenge(p.id)}
                      title={`${p.nickname} herausfordern`}
                      className="rounded bg-[#6FB3A2] px-2 py-0.5 text-[10px] font-black text-[#060708]"
                    >
                      ⚡
                    </button>
                  </div>
                ) : (
                  <span className="w-6 text-center text-[10px] font-bold text-[#6FB3A2]">
                    Du
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ConnectMatchesTab({
  connectMatches,
  matchDeltas,
  playersById,
  currentUser,
  connectRatings,
}) {
  const [onlyMine, setOnlyMine] = useState(false);

  const visibleMatches = useMemo(() => {
    if (!onlyMine) return connectMatches;
    return connectMatches.filter(
      (m) => m.player1Id === currentUser.id || m.player2Id === currentUser.id
    );
  }, [connectMatches, onlyMine, currentUser.id]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-xs font-black tracking-wide text-[#F3F4F6] uppercase">
            CONNECT-Partien ({visibleMatches.length})
          </h2>
          <p className="text-[11px] text-[#8E95A2]">
            Freie Spiele fliessen direkt in das CONNECT-Rating ein
          </p>
        </div>

        <button
          type="button"
          onClick={() => setOnlyMine((v) => !v)}
          className="rounded-lg bg-[#181A1E] px-2.5 py-1.5 text-[11px] font-bold text-[#A8D0B1] ring-1 ring-[#2B2F37]"
        >
          {onlyMine ? 'Alle zeigen' : 'Nur meine'}
        </button>
      </div>

      {visibleMatches.length === 0 ? (
        <div className="rounded-2xl border border-[#24272D] bg-[#181A1E] p-5 text-center text-xs text-[#9CA3AF]">
          Noch keine CONNECT-Partien in dieser Ansicht eingetragen.
        </div>
      ) : (
        <div className="space-y-2">
          {visibleMatches.map((m) => {
            const p1 = playersById[m.player1Id];
            const p2 = playersById[m.player2Id];
            if (!p1 || !p2) return null;

            const p1Won = m.winnerId === p1.id;
            const deltas = matchDeltas[m.id] || { delta1: 0, delta2: 0 };

            return (
              <div
                key={m.id}
                className="rounded-2xl border border-[#24272D] bg-[#181A1E] p-3"
              >
                <div className="flex items-center justify-between text-[10px] text-[#8E95A2]">
                  <span className="font-bold text-[#6FB3A2]">CONNECT-Partie</span>
                  <span>{m.dateLabel}</span>
                </div>

                <div className="mt-2 flex items-center justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div
                      className={`truncate text-xs font-black ${
                        p1Won ? 'text-emerald-300' : 'text-[#F3F4F6]'
                      }`}
                    >
                      {p1.nickname} {p1Won ? '🏆' : ''}
                    </div>
                    <div className="mt-0.5 flex items-center gap-1 text-[10px]">
                      <span className="text-[#8E95A2]">
                        {connectRatings[p1.id]?.tier?.symbol} {connectRatings[p1.id]?.elo}
                      </span>
                      <span
                        className={`font-bold ${
                          deltas.delta1 >= 0 ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        ({deltas.delta1 >= 0 ? `+${deltas.delta1}` : deltas.delta1})
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0 rounded-xl bg-[#111215] px-3 py-1 text-center ring-1 ring-[#2B2F37]">
                    <span className="text-xs font-black tracking-wider text-[#E6C79C]">
                      {m.score}
                    </span>
                  </div>

                  <div className="min-w-0 flex-1 text-right">
                    <div
                      className={`truncate text-xs font-black ${
                        !p1Won ? 'text-emerald-300' : 'text-[#F3F4F6]'
                      }`}
                    >
                      {!p1Won ? '🏆 ' : ''}
                      {p2.nickname}
                    </div>
                    <div className="mt-0.5 flex items-center justify-end gap-1 text-[10px]">
                      <span
                        className={`font-bold ${
                          deltas.delta2 >= 0 ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        ({deltas.delta2 >= 0 ? `+${deltas.delta2}` : deltas.delta2})
                      </span>
                      <span className="text-[#8E95A2]">
                        {connectRatings[p2.id]?.tier?.symbol} {connectRatings[p2.id]?.elo}
                      </span>
                    </div>
                  </div>
                </div>

                {(p1.id === currentUser.id || p2.id === currentUser.id) && (
                  <div className="mt-2.5 flex justify-end border-t border-[#22252B] pt-2">
                    <WhatsAppActionButton
                      phone={(p1.id === currentUser.id ? p2 : p1).phone}
                      message={getContextWhatsAppMessage(
                        'rematch',
                        currentUser,
                        p1.id === currentUser.id ? p2 : p1,
                        { score: m.score }
                      )}
                      label="Revanche per WhatsApp"
                      compact
                    />
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

function NewMembersTab({
  players,
  currentUser,
  activeSeason,
  connectRatings,
  onOpenChallenge,
  onOpenEditProfile,
}) {
  const newMembers = useMemo(
    () => players.filter((p) => p.isNewMember),
    [players]
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-xs font-black tracking-wide text-[#F3F4F6] uppercase">
            Neu im Club ({newMembers.length})
          </h2>
          <p className="text-[11px] text-[#8E95A2]">
            Neue Gesichter im Verein – ideal für ein lockeres Willkommens-Spiel
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenEditProfile}
          className="rounded-lg bg-[#181A1E] px-2.5 py-1.5 text-[11px] font-bold text-[#A8D0B1] ring-1 ring-[#2B2F37]"
        >
          Mein Status
        </button>
      </div>

      {newMembers.length === 0 ? (
        <div className="rounded-2xl border border-[#24272D] bg-[#181A1E] p-5 text-center text-xs text-[#9CA3AF]">
          Aktuell sind keine Mitglieder als «Neu im Club» markiert.
        </div>
      ) : (
        <div className="space-y-2.5">
          {newMembers.map((p) => {
            const isMe = p.id === currentUser.id;
            const waMsg = getContextWhatsAppMessage('new_member', currentUser, p);

            return (
              <div
                key={p.id}
                className="rounded-2xl border border-[#6FB3A2]/35 bg-[#181A1E] p-3.5"
              >
                <div className="flex items-start gap-3">
                  <PlayerAvatar
                    player={p}
                    sizeClass="h-14 w-14 text-base"
                    isConnectAccent
                  />

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="truncate text-sm font-black text-[#F3F4F6]">
                            {p.nickname}
                          </span>
                          <span className="text-xs text-[#9CA3AF]">
                            ({p.firstName} {p.lastName})
                          </span>
                        </div>
                        <div className="mt-1">
                          <PlayerBadge
                            player={p}
                            season={activeSeason}
                            ratingInfo={connectRatings[p.id]}
                          />
                        </div>
                      </div>

                      <span className="shrink-0 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-300 ring-1 ring-emerald-500/30">
                        Neu · {p.joinedLabel || '2026'}
                      </span>
                    </div>

                    {p.bio && (
                      <p className="mt-2 rounded-xl bg-[#131417] px-3 py-2 text-xs text-[#D1D5DB]">
                        {p.bio}
                      </p>
                    )}

                    {formatHallScheduleSummary(p) && (
                      <div className="mt-2 text-[11px] text-[#8E95A2]">
                        Oft in der Halle: {formatHallScheduleSummary(p)}
                      </div>
                    )}

                    {!isMe && (
                      <div className="mt-2.5 flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => onOpenChallenge(p.id)}
                          className="rounded-lg bg-[#6FB3A2] px-2.5 py-1.5 text-[11px] font-black text-[#060708]"
                        >
                          ⚡ Einladen
                        </button>
                        <a
                          href={buildWhatsAppLink(p.phone, waMsg)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-lg bg-[#1F3A2E] px-2.5 py-1.5 text-[11px] font-bold text-emerald-300"
                        >
                          WhatsApp
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function RecordConnectMatchModal({
  players,
  currentUser,
  connectRatings,
  defaultOpponentId = '',
  onSave,
  onClose,
}) {
  const opponents = useMemo(
    () => players.filter((p) => p.id !== currentUser.id),
    [players, currentUser.id]
  );

  const [opponentId, setOpponentId] = useState(
    defaultOpponentId || opponents[0]?.id || ''
  );
  const [winnerSide, setWinnerSide] = useState('me');
  const [score, setScore] = useState('3:1');

  const opponent = players.find((p) => p.id === opponentId);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!opponentId) return;
    const winnerId = winnerSide === 'me' ? currentUser.id : opponentId;
    onSave(opponentId, winnerId, score);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 p-3 sm:items-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-3 rounded-2xl border border-[#2E323B] bg-[#181A1E] p-4 shadow-2xl"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-[#F3F4F6]">
            CONNECT-Partie erfassen
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-bold text-[#8E95A2]"
          >
            ✕
          </button>
        </div>

        <div>
          <label className="mb-1 block text-[11px] font-semibold text-[#8E95A2]">
            1. Gegner auswählen
          </label>
          <select
            value={opponentId}
            onChange={(e) => setOpponentId(e.target.value)}
            className="w-full rounded-xl border border-[#2E323B] bg-[#131417] px-3 py-2 text-xs font-bold text-[#F3F4F6]"
          >
            {opponents.map((p) => {
              const r = connectRatings[p.id];
              return (
                <option key={p.id} value={p.id}>
                  {p.nickname} ({p.firstName}) · {r?.tier?.symbol} {r?.elo}
                </option>
              );
            })}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-[11px] font-semibold text-[#8E95A2]">
            2. Gewinner definieren
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setWinnerSide('me')}
              className={`rounded-xl py-2.5 text-xs font-black ${
                winnerSide === 'me'
                  ? 'bg-emerald-500 text-[#0F1012]'
                  : 'border border-[#2E323B] bg-[#131417] text-[#9CA3AF]'
              }`}
            >
              {currentUser.nickname}
            </button>
            <button
              type="button"
              onClick={() => setWinnerSide('opponent')}
              className={`rounded-xl py-2.5 text-xs font-black ${
                winnerSide === 'opponent'
                  ? 'bg-emerald-500 text-[#0F1012]'
                  : 'border border-[#2E323B] bg-[#131417] text-[#9CA3AF]'
              }`}
            >
              {opponent?.nickname || 'Gegner'}
            </button>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-[11px] font-semibold text-[#8E95A2]">
            3. Satzergebnis antippen
          </label>
          <div className="grid grid-cols-5 gap-1.5">
            {['3:0', '3:1', '3:2', '2:0', '2:1'].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setScore(preset)}
                className={`rounded-xl py-2 text-xs font-black ${
                  score === preset
                    ? 'bg-[#6FB3A2] text-[#060708]'
                    : 'border border-[#2E323B] bg-[#131417] text-[#9CA3AF]'
                }`}
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full rounded-xl bg-[#6FB3A2] py-2.5 text-xs font-black text-[#060708]"
        >
          Partie speichern &amp; Rating aktualisieren
        </button>
      </form>
    </div>
  );
}

function ChallengeModal({
  players,
  currentUser,
  activeSeason,
  connectRatings,
  defaultTargetId = null,
  onSend,
  onClose,
}) {
  const [targetId, setTargetId] = useState(defaultTargetId || '');
  const [format, setFormat] = useState('Best of 5 Match');
  const [whenLabel, setWhenLabel] = useState('Jetzt in der Halle');
  const [note, setNote] = useState('');
  const [sendWhatsApp, setSendWhatsApp] = useState(true);

  const otherPlayers = useMemo(
    () => players.filter((p) => p.id !== currentUser.id),
    [players, currentUser.id]
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    onSend({
      targetId: targetId || null,
      format,
      whenLabel,
      note: note.trim(),
      sendWhatsApp: Boolean(targetId) && sendWhatsApp,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 p-3 sm:items-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-3 rounded-2xl border border-[#C8A26E]/40 bg-[#181A1E] p-4 shadow-2xl"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-[#E6C79C]">
            ⚡ Spontan herausfordern
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-bold text-[#8E95A2]"
          >
            ✕
          </button>
        </div>

        <div>
          <label className="mb-1 block text-[11px] font-semibold text-[#8E95A2]">
            Wen forderst du heraus?
          </label>
          <select
            value={targetId}
            onChange={(e) => setTargetId(e.target.value)}
            className="w-full rounded-xl border border-[#2E323B] bg-[#131417] px-3 py-2 text-xs font-bold text-[#F3F4F6]"
          >
            <option value="">Offene Challenge an alle im Club</option>
            {otherPlayers.map((p) => {
              const league = activeSeason.leagues.find((l) =>
                l.playerIds.includes(p.id)
              );
              const r = connectRatings[p.id];
              return (
                <option key={p.id} value={p.id}>
                  {p.nickname} ({p.firstName}) ·{' '}
                  {league ? league.name : p.sttClass || 'CLUB'} ·{' '}
                  {r?.tier?.symbol} {r?.elo}
                </option>
              );
            })}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-[11px] font-semibold text-[#8E95A2]">
            Spielmodus
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            {['Best of 5 Match', '3 Sätze locker', '15m Warmup + Match'].map(
              (opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setFormat(opt)}
                  className={`rounded-lg px-2 py-2 text-[11px] font-bold ${
                    format === opt
                      ? 'bg-[#6FB3A2] text-[#060708]'
                      : 'border border-[#2E323B] bg-[#131417] text-[#9CA3AF]'
                  }`}
                >
                  {opt}
                </button>
              )
            )}
          </div>
        </div>

        <div>
          <label className="mb-1 block text-[11px] font-semibold text-[#8E95A2]">
            Wann?
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            {['Jetzt in der Halle', 'Heute Abend', 'Diese Woche'].map((w) => (
              <button
                key={w}
                type="button"
                onClick={() => setWhenLabel(w)}
                className={`rounded-lg px-2 py-1.5 text-[11px] font-bold ${
                  whenLabel === w
                    ? 'bg-[#6FB3A2] text-[#060708]'
                    : 'border border-[#2E323B] bg-[#131417] text-[#9CA3AF]'
                }`}
              >
                {w}
              </button>
            ))}
          </div>
        </div>

        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Kurze Kampfansage oder Tisch-Info (optional)..."
          className="w-full rounded-xl border border-[#2E323B] bg-[#131417] px-3 py-2 text-xs text-[#F3F4F6]"
        />

        {targetId && (
          <label className="flex items-center gap-2 rounded-xl bg-[#131417] px-3 py-2 text-xs text-[#D1D5DB]">
            <input
              type="checkbox"
              checked={sendWhatsApp}
              onChange={(e) => setSendWhatsApp(e.target.checked)}
            />
            <span>Gleichzeitig per WhatsApp anpingen</span>
          </label>
        )}

        <button
          type="submit"
          className="w-full rounded-xl bg-[#6FB3A2] py-2.5 text-xs font-black text-[#060708]"
        >
          ⚡ Herausforderung senden
        </button>
      </form>
    </div>
  );
}

function PlayerProfileModal({
  currentUser,
  onLogout,
  onSave,
  onClose,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    ...currentUser,
    language: currentUser.language || 'Deutsch',
    playstyle: currentUser.playstyle || 'Allround',
    typicalHallDays: currentUser.typicalHallDays || [],
    hallSchedule: getNormalizedHallSchedule(currentUser),
  });
  const [profileError, setProfileError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setProfileError('');
    if (String(form.phone || '').trim()) {
      const phoneCheck = validateWhatsAppPhone(form.phone);
      if (!phoneCheck.valid) {
        setProfileError(phoneCheck.error);
        return;
      }
    }
    const activeDays = DAYS_OF_WEEK.filter(
      (d) =>
        Array.isArray(form.hallSchedule?.[d]) && form.hallSchedule[d].length > 0
    );
    onSave({
      ...form,
      phone: normalizeWhatsAppPhone(form.phone),
      typicalHallDays: activeDays,
      hallSchedule: form.hallSchedule || {},
    });
    setIsEditing(false);
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setForm((prev) => ({ ...prev, avatarUrl: reader.result }));
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 p-3 sm:items-center">
      <div className="w-full max-w-md space-y-3.5 rounded-2xl border border-[#2E323B] bg-[#181A1E] p-4 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <PlayerAvatar
              player={isEditing ? form : currentUser}
              sizeClass="h-10 w-10 text-xs"
              isConnectAccent={currentUser.connectOnly}
            />
            <div>
              <h3 className="text-sm font-black text-[#F3F4F6]">
                {currentUser.nickname}
              </h3>
              <div className="text-[11px] text-[#8E95A2]">
                {currentUser.firstName} {currentUser.lastName}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-[#24272D] px-2.5 py-1 text-xs font-bold text-[#9CA3AF] hover:text-[#F3F4F6]"
          >
            ✕
          </button>
        </div>

        {!isEditing ? (
          <div className="space-y-3">
            <div className="space-y-2 rounded-xl border border-[#24272D] bg-[#131417] p-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#8E95A2]">Modus</span>
                <span className="font-bold text-[#E6C79C]">
                  {currentUser.connectOnly ? 'Nur CLUB' : 'CLUB & LEAGUE'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#8E95A2]">Spielstärke / Klassierung</span>
                <span className="font-bold text-[#F3F4F6]">
                  {currentUser.sttClass || 'Hobby'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#8E95A2]">Spielstil</span>
                <span className="font-bold text-[#F4ECC2]">
                  {currentUser.playstyle || 'Allround'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#8E95A2]">Sprache</span>
                <span className="font-bold text-[#A8D0B1]">
                  {currentUser.language || 'Deutsch'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#8E95A2]">WhatsApp</span>
                <span className="font-semibold text-[#D1D5DB]">
                  {currentUser.phone || '–'}
                </span>
              </div>
              <div className="flex items-start justify-between gap-3">
                <span className="shrink-0 text-[#8E95A2]">Hallentage</span>
                <span className="text-right font-bold text-[#A8D0B1]">
                  {formatHallScheduleSummary(currentUser) || 'Keine gewählt'}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setForm({
                  ...currentUser,
                  language: currentUser.language || 'Deutsch',
                  playstyle: currentUser.playstyle || 'Allround',
                  typicalHallDays: currentUser.typicalHallDays || [],
                  hallSchedule: getNormalizedHallSchedule(currentUser),
                });
                setIsEditing(true);
              }}
              className="w-full rounded-xl bg-[#6FB3A2] py-2.5 text-xs font-black text-[#060708] transition hover:bg-[#82C1B1]"
            >
              Profil bearbeiten
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex items-center gap-3 rounded-xl border border-[#24272D] bg-[#131417] p-2.5">
              <PlayerAvatar
                player={form}
                sizeClass="h-12 w-12 text-sm"
                isConnectAccent={form.connectOnly}
              />
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-[#F3F4F6]">Profilfoto</div>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  <label className="cursor-pointer rounded-lg bg-[#252830] px-2.5 py-1 text-[11px] font-bold text-[#E6C79C]">
                    Foto hochladen
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                  {form.avatarUrl && (
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, avatarUrl: '' })}
                      className="rounded-lg bg-[#1C1E24] px-2 py-1 text-[11px] text-[#9CA3AF]"
                    >
                      Entfernen
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                placeholder="Vorname"
                className="rounded-xl border border-[#2E323B] bg-[#131417] px-3 py-2 text-xs text-[#F3F4F6]"
              />
              <input
                type="text"
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                placeholder="Nachname"
                className="rounded-xl border border-[#2E323B] bg-[#131417] px-3 py-2 text-xs text-[#F3F4F6]"
              />
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={form.nickname}
                onChange={(e) => setForm({ ...form, nickname: e.target.value })}
                placeholder="Nickname"
                className="flex-1 rounded-xl border border-[#2E323B] bg-[#131417] px-3 py-2 text-xs font-bold text-[#F3F4F6]"
              />
              <button
                type="button"
                onClick={() =>
                  setForm((prev) => ({
                    ...prev,
                    nickname: generateFunnyNickname(
                      prev.firstName,
                      prev.nickname
                    ),
                  }))
                }
                className="inline-flex shrink-0 items-center justify-center gap-1 rounded-xl border border-[#C8A26E]/35 bg-[#1B1813] px-3 py-2 text-[11px] font-bold text-[#E6C79C] transition hover:border-[#C8A26E] hover:bg-[#252018]"
              >
                <span>🎲</span>
                <span>Lustiger Vorschlag</span>
              </button>
            </div>

            <WhatsAppPhoneField
              value={form.phone}
              onChange={(val) => setForm({ ...form, phone: val })}
              placeholder="+41 79 123 45 67 / +49 170 1234567"
            />

            <div>
              <label className="mb-1 block text-[11px] font-semibold text-[#8E95A2]">
                Spielstärke / Klassierung
              </label>
              <select
                value={form.sttClass || 'Hobby'}
                onChange={(e) => setForm({ ...form, sttClass: e.target.value })}
                className="w-full rounded-xl border border-[#2E323B] bg-[#131417] px-2.5 py-2 text-xs font-bold text-[#F3F4F6]"
              >
                {STT_LEVEL_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-[11px] font-semibold text-[#8E95A2]">
                Spielstil
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {PLAYSTYLE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setForm({ ...form, playstyle: opt.value })}
                    className={`rounded-xl py-2 text-[11px] font-black transition ${
                      form.playstyle === opt.value
                        ? 'bg-[#6FB3A2] text-[#060708]'
                        : 'border border-[#2E323B] bg-[#131417] text-[#9CA3AF] hover:text-[#F3F4F6]'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-1 block text-[11px] font-semibold text-[#8E95A2]">
                Sprache
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {LANGUAGE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setForm({ ...form, language: opt.value })}
                    className={`rounded-xl py-2 text-[11px] font-black transition ${
                      form.language === opt.value
                        ? 'bg-[#6FB3A2] text-[#060708]'
                        : 'border border-[#2E323B] bg-[#131417] text-[#9CA3AF] hover:text-[#F3F4F6]'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-1 block text-[11px] font-semibold text-[#8E95A2]">
                Meine typischen Hallentage &amp; Tageszeit
              </label>
              <HallSchedulePicker
                schedule={form.hallSchedule || {}}
                onChange={(nextSchedule) =>
                  setForm((prev) => ({
                    ...prev,
                    hallSchedule: nextSchedule,
                  }))
                }
              />
            </div>

            <label className="flex items-center justify-between rounded-xl border border-[#24272D] bg-[#131417] px-3 py-2 text-xs text-[#D1D5DB]">
              <span>Im Tab «Neu im Club» anzeigen</span>
              <input
                type="checkbox"
                checked={Boolean(form.isNewMember)}
                onChange={(e) =>
                  setForm({ ...form, isNewMember: e.target.checked })
                }
              />
            </label>

            {profileError && (
              <div className="rounded-xl border border-rose-500/40 bg-rose-950/30 px-3 py-2 text-[11px] font-bold text-rose-300">
                {profileError}
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="rounded-xl border border-[#2E323B] bg-[#131417] py-2.5 text-xs font-bold text-[#9CA3AF] hover:text-[#F3F4F6]"
              >
                Abbrechen
              </button>
              <button
                type="submit"
                className="rounded-xl bg-[#6FB3A2] py-2.5 text-xs font-black text-[#060708]"
              >
                Speichern ✓
              </button>
            </div>
          </form>
        )}

        <button
          type="button"
          onClick={onLogout}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-rose-500/30 bg-rose-950/20 py-2.5 text-xs font-bold text-rose-300 transition hover:bg-rose-950/35"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          <span>Abmelden &amp; zur Startseite zurück</span>
        </button>
      </div>
    </div>
  );
}

function AddMemberModal({ activeSeason, onAdd, onClose }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [nickname, setNickname] = useState('');
  const [phone, setPhone] = useState('');
  const [sttClass, setSttClass] = useState('Hobby');
  const [language, setLanguage] = useState('Deutsch');
  const [playstyle, setPlaystyle] = useState('Allround');
  const [connectOnly, setConnectOnly] = useState(true);
  const [leagueId, setLeagueId] = useState(activeSeason.leagues[1]?.id || '');
  const [avatarUrl, setAvatarUrl] = useState('');

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') setAvatarUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nickname.trim()) return;
    onAdd(
      {
        id: `p-${Date.now()}`,
        firstName: firstName.trim() || nickname.trim(),
        lastName: lastName.trim(),
        nickname: nickname.trim(),
        pin: '1234',
        avatarUrl,
        phone: normalizeWhatsAppPhone(phone),
        sttClass,
        language,
        playstyle,
        connectOnly,
        isNewMember: true,
        joinedLabel: 'Nov 2026',
        bio: 'Neu im Verein – freue mich auf gemeinsame Bälle in der Halle!',
        typicalHallDays: ['Mi'],
      },
      connectOnly ? '' : leagueId
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 p-3 sm:items-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-3 rounded-2xl border border-[#2E323B] bg-[#181A1E] p-4 shadow-2xl"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-[#F3F4F6]">
            Neues Mitglied erfassen
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-bold text-[#8E95A2]"
          >
            ✕
          </button>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-[#24272D] bg-[#131417] p-2.5">
          <PlayerAvatar
            player={{ firstName, lastName, nickname, avatarUrl }}
            sizeClass="h-12 w-12 text-sm"
            isConnectAccent
          />
          <div>
            <label className="inline-block cursor-pointer rounded-lg bg-[#6FB3A2] px-2.5 py-1 text-[11px] font-black text-[#060708]">
              Foto wählen
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </label>
            <div className="mt-1 text-[10px] text-[#8E95A2]">
              Erscheint direkt bei «Neu im Club»
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Vorname"
            className="rounded-xl border border-[#2E323B] bg-[#131417] px-3 py-2 text-xs text-[#F3F4F6]"
          />
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Nachname"
            className="rounded-xl border border-[#2E323B] bg-[#131417] px-3 py-2 text-xs text-[#F3F4F6]"
          />
        </div>

        <input
          type="text"
          required
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="Nickname *"
          className="w-full rounded-xl border border-[#2E323B] bg-[#131417] px-3 py-2 text-xs font-bold text-[#F3F4F6]"
        />

        <WhatsAppPhoneField
          value={phone}
          onChange={setPhone}
          placeholder="+41 79 123 45 67 / +49 170 1234567"
        />

        <div>
          <label className="mb-1 block text-[11px] font-semibold text-[#8E95A2]">
            Spielstärke / Klassierung
          </label>
          <select
            value={sttClass}
            onChange={(e) => setSttClass(e.target.value)}
            className="w-full rounded-xl border border-[#2E323B] bg-[#131417] px-2.5 py-2 text-xs font-bold text-[#F3F4F6]"
          >
            {STT_LEVEL_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-[11px] font-semibold text-[#8E95A2]">
            Spielstil
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            {PLAYSTYLE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setPlaystyle(opt.value)}
                className={`rounded-xl py-2 text-[11px] font-black transition ${
                  playstyle === opt.value
                    ? 'bg-[#6FB3A2] text-[#060708]'
                    : 'border border-[#2E323B] bg-[#131417] text-[#9CA3AF]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1 block text-[11px] font-semibold text-[#8E95A2]">
            Sprache
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            {LANGUAGE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setLanguage(opt.value)}
                className={`rounded-xl py-2 text-[11px] font-black transition ${
                  language === opt.value
                    ? 'bg-[#6FB3A2] text-[#060708]'
                    : 'border border-[#2E323B] bg-[#131417] text-[#9CA3AF]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2 rounded-xl border border-[#24272D] bg-[#131417] p-2.5 text-xs">
          <label className="flex items-center gap-2 text-[#E5E7EB]">
            <input
              type="radio"
              checked={connectOnly}
              onChange={() => setConnectOnly(true)}
            />
            <span>Nur CLUB (Hallen-Community)</span>
          </label>
          <label className="flex items-center gap-2 text-[#E5E7EB]">
            <input
              type="radio"
              checked={!connectOnly}
              onChange={() => setConnectOnly(false)}
            />
            <span>CLUB &amp; LEAGUE (Monatsliga)</span>
          </label>

          {!connectOnly && (
            <select
              value={leagueId}
              onChange={(e) => setLeagueId(e.target.value)}
              className="mt-1 w-full rounded-lg border border-[#2E323B] bg-[#181A1E] px-2.5 py-1.5 text-xs text-[#F3F4F6]"
            >
              {activeSeason.leagues.map((l) => (
                <option key={l.id} value={l.id}>
                  Einstieg in {l.name}
                </option>
              ))}
            </select>
          )}
        </div>

        <button
          type="submit"
          className="w-full rounded-xl bg-[#6FB3A2] py-2.5 text-xs font-black text-[#060708]"
        >
          Mitglied hinzufügen
        </button>
      </form>
    </div>
  );
}

function CheckInModal({ onSubmit, onClose }) {
  const [tableInfo, setTableInfo] = useState('Tisch 1');
  const [untilTime, setUntilTime] = useState('21:00');
  const [note, setNote] = useState('Offen für Einspielen oder ein paar Sätze!');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ tableInfo, untilTime, note });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 p-3 sm:items-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-3 rounded-2xl border border-[#2E323B] bg-[#181A1E] p-4 shadow-2xl"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-[#F3F4F6]">
            LIVE in der Halle einchecken
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-bold text-[#8E95A2]"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <input
            type="text"
            value={tableInfo}
            onChange={(e) => setTableInfo(e.target.value)}
            placeholder="Tisch (z. B. Tisch 2)"
            className="rounded-xl border border-[#2E323B] bg-[#131417] px-3 py-2 text-xs text-[#F3F4F6]"
          />
          <input
            type="text"
            value={untilTime}
            onChange={(e) => setUntilTime(e.target.value)}
            placeholder="Bis wann? (z. B. 21:00)"
            className="rounded-xl border border-[#2E323B] bg-[#131417] px-3 py-2 text-xs text-[#F3F4F6]"
          />
        </div>

        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Kurze Notiz für andere Spieler..."
          className="w-full rounded-xl border border-[#2E323B] bg-[#131417] px-3 py-2 text-xs text-[#F3F4F6]"
        />

        <button
          type="submit"
          className="w-full rounded-xl bg-[#6FB3A2] py-2.5 text-xs font-black text-[#060708]"
        >
          Jetzt LIVE schalten
        </button>
      </form>
    </div>
  );
}

function CreateSessionModal({ defaultType, onSubmit, onClose }) {
  const [type, setType] = useState(defaultType);
  const [dateLabel, setDateLabel] = useState(
    defaultType === 'announcement' ? 'Donnerstag · 19:30 Uhr' : 'Heute · 19:00 Uhr'
  );
  const [note, setNote] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      type,
      dateLabel,
      note: note.trim() || 'Wer hat Lust auf ein paar Sätze?',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 p-3 sm:items-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-3 rounded-2xl border border-[#2E323B] bg-[#181A1E] p-4 shadow-2xl"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-[#F3F4F6]">
            {type === 'announcement' ? 'Vorankündigung erstellen' : 'Spontan-Session posten'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-bold text-[#8E95A2]"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-2 gap-1.5">
          <button
            type="button"
            onClick={() => setType('announcement')}
            className={`rounded-lg py-1.5 text-xs font-bold ${
              type === 'announcement'
                ? 'bg-[#6FB3A2] text-[#060708]'
                : 'bg-[#131417] text-[#9CA3AF]'
            }`}
          >
            Vorankündigung
          </button>
          <button
            type="button"
            onClick={() => setType('spontaneous')}
            className={`rounded-lg py-1.5 text-xs font-bold ${
              type === 'spontaneous'
                ? 'bg-[#6FB3A2] text-[#060708]'
                : 'bg-[#131417] text-[#9CA3AF]'
            }`}
          >
            Spontan heute
          </button>
        </div>

        <input
          type="text"
          value={dateLabel}
          onChange={(e) => setDateLabel(e.target.value)}
          placeholder="Tag & Uhrzeit"
          className="w-full rounded-xl border border-[#2E323B] bg-[#131417] px-3 py-2 text-xs text-[#F3F4F6]"
        />

        <textarea
          rows={3}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Was möchtest du spielen? (z. B. lockeres Einspielen, Best of 5...)"
          className="w-full rounded-xl border border-[#2E323B] bg-[#131417] px-3 py-2 text-xs text-[#F3F4F6]"
        />

        <button
          type="submit"
          className="w-full rounded-xl bg-[#6FB3A2] py-2.5 text-xs font-black text-[#060708]"
        >
          Veröffentlichen
        </button>
      </form>
    </div>
  );
}

function RecordLeagueMatchModal({ match, player1, player2, onSave, onClose }) {
  const initialWinner =
    match.score1 !== null && match.score2 !== null && match.score2 > match.score1
      ? 'p2'
      : 'p1';

  const initialPreset = (() => {
    if (match.score1 === null || match.score2 === null) return '3:1';
    const high = Math.max(match.score1, match.score2);
    const low = Math.min(match.score1, match.score2);
    const combo = `${high}:${low}`;
    return ['3:0', '3:1', '3:2'].includes(combo) ? combo : '3:1';
  })();

  const [winnerSide, setWinnerSide] = useState(initialWinner);
  const [scorePreset, setScorePreset] = useState(initialPreset);

  const handleSubmit = (e) => {
    e.preventDefault();
    const [winSets, loseSets] = scorePreset.split(':').map(Number);
    const finalScore1 = winnerSide === 'p1' ? winSets : loseSets;
    const finalScore2 = winnerSide === 'p1' ? loseSets : winSets;
    onSave(match.id, finalScore1, finalScore2);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 p-3 sm:items-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-3.5 rounded-2xl border border-[#DE754B]/45 bg-[#181A1E] p-4 shadow-2xl"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-[#F4ECC2]">
            Liga-Resultat schnell eintragen
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-bold text-[#8E95A2]"
          >
            ✕
          </button>
        </div>

        <div>
          <label className="mb-1.5 block text-[11px] font-semibold text-[#8E95A2]">
            1. Gewinner antippen
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setWinnerSide('p1')}
              className={`flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-xs font-black transition ${
                winnerSide === 'p1'
                  ? 'bg-emerald-500 text-[#0F1012] shadow-lg shadow-emerald-500/20'
                  : 'border border-[#2E323B] bg-[#131417] text-[#9CA3AF] hover:text-[#F3F4F6]'
              }`}
            >
              <PlayerAvatar player={player1} sizeClass="h-6 w-6 text-[10px]" />
              <span className="truncate">{player1?.nickname}</span>
              {winnerSide === 'p1' && <span>🏆</span>}
            </button>

            <button
              type="button"
              onClick={() => setWinnerSide('p2')}
              className={`flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-xs font-black transition ${
                winnerSide === 'p2'
                  ? 'bg-emerald-500 text-[#0F1012] shadow-lg shadow-emerald-500/20'
                  : 'border border-[#2E323B] bg-[#131417] text-[#9CA3AF] hover:text-[#F3F4F6]'
              }`}
            >
              <PlayerAvatar player={player2} sizeClass="h-6 w-6 text-[10px]" />
              <span className="truncate">{player2?.nickname}</span>
              {winnerSide === 'p2' && <span>🏆</span>}
            </button>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-[11px] font-semibold text-[#8E95A2]">
            2. Satzergebnis wählen (Best of 5)
          </label>
          <div className="grid grid-cols-3 gap-2">
            {['3:0', '3:1', '3:2'].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setScorePreset(preset)}
                className={`rounded-xl py-2.5 text-sm font-black tracking-wider transition ${
                  scorePreset === preset
                    ? 'bg-[#DE754B] text-[#060708] shadow-md'
                    : 'border border-[#2E323B] bg-[#131417] text-[#9CA3AF] hover:text-[#F3F4F6]'
                }`}
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-[#24272D] bg-[#131417] px-3 py-2 text-center text-xs text-[#9CA3AF]">
          Ergebnis:{' '}
          <span className="font-black text-[#F3F4F6]">
            {winnerSide === 'p1' ? player1?.nickname : player2?.nickname}
          </span>{' '}
          gewinnt <span className="font-black text-[#DE754B]">{scorePreset}</span>
        </div>

        <button
          type="submit"
          className="w-full rounded-xl bg-[#DE754B] py-2.5 text-xs font-black text-[#060708]"
        >
          Resultat speichern ✓
        </button>
      </form>
    </div>
  );
}

function AdminPanelTab({
  adminTab,
  setAdminTab,
  players,
  playersById,
  currentUser,
  activeSeason,
  viewedSeason,
  seasons,
  setSelectedSeasonId,
  connectRatings,
  connectMatches,
  liveCheckins,
  clubEvenings,
  sessions,
  challenges,
  adminPinCode,
  onChangeAdminPin,
  onLockAdmin,
  onOpenAddMember,
  onBulkImportMembers,
  onUpdatePlayer,
  onDeletePlayer,
  onAssignPlayerLeague,
  onCreateLeague,
  onAdvanceMonth,
  onSelectMatchToRecord,
  onResetLeagueMatch,
  onDeleteConnectMatch,
  onRemoveLiveCheckin,
  onDeleteClubEvening,
  onDeleteSession,
  onDeleteChallenge,
}) {
  const [memberSearch, setMemberSearch] = useState('');
  const [editingPlayerId, setEditingPlayerId] = useState(null);
  const [editPinValue, setEditPinValue] = useState('');
  const [editSttValue, setEditSttValue] = useState('Hobby');
  const [newLeagueName, setNewLeagueName] = useState('');
  const [newAdminPin, setNewAdminPin] = useState('');
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [bulkText, setBulkText] = useState('');
  const [bulkDefaultPin, setBulkDefaultPin] = useState('1234');
  const [bulkMarkNew, setBulkMarkNew] = useState(false);

  const parseBulkLines = (rawText) => {
    const lines = rawText
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);

    const parsed = [];
    lines.forEach((line, idx) => {
      const sep = line.includes(';') ? ';' : line.includes('\t') ? '\t' : ',';
      const cols = line.split(sep).map((c) => c.trim().replace(/^"|"$/g, ''));
      if (cols.length === 0 || !cols[0]) return;

      if (idx === 0 && /^(vorname|first|name|nachname)/i.test(cols[0])) {
        return;
      }

      const firstName = cols[0] || '';
      const lastName = cols[1] || '';
      const nickname =
        cols[2] ||
        (lastName ? `${firstName}${lastName[0]}` : firstName) ||
        `Spieler${idx + 1}`;
      const phone = normalizeWhatsAppPhone(cols[3] || '');
      const rawStt = cols[4] || 'Hobby';
      const matchedStt =
        STT_LEVEL_OPTIONS.find(
          (opt) =>
            opt.value.toLowerCase() === rawStt.toLowerCase() ||
            opt.label.toLowerCase().includes(rawStt.toLowerCase())
        )?.value || 'Hobby';
      const pinCandidate = (cols[5] || '').replace(/\D/g, '');
      const pin =
        pinCandidate.length === 4
          ? pinCandidate
          : /^\d{4}$/.test(bulkDefaultPin)
          ? bulkDefaultPin
          : '1234';

      parsed.push({
        id: `p-imp-${Date.now()}-${idx}`,
        firstName,
        lastName,
        nickname,
        pin,
        avatarUrl: '',
        phone,
        sttClass: matchedStt,
        language: 'Deutsch',
        connectOnly: true,
        isNewMember: bulkMarkNew,
        joinedLabel: '2026',
        bio: 'Club-Mitglied · offen für Spiele in der Halle!',
        typicalHallDays: ['Mi'],
      });
    });
    return parsed;
  };

  const handleBulkCsvFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setBulkText(reader.result);
      }
    };
    reader.readAsText(file, 'UTF-8');
  };

  const filteredMembers = useMemo(() => {
    const q = memberSearch.trim().toLowerCase();
    if (!q) return players;
    return players.filter((p) =>
      `${p.nickname} ${p.firstName} ${p.lastName} ${p.sttClass || ''}`
        .toLowerCase()
        .includes(q)
    );
  }, [players, memberSearch]);

  const sortedLeagues = [...activeSeason.leagues].sort((a, b) => a.tier - b.tier);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2 rounded-2xl border border-[#C8A26E]/40 bg-[#1B1813] p-3.5">
        <div>
          <div className="text-[10px] font-black uppercase tracking-widest text-[#C8A26E]">
            🛡️ Club-Administration
          </div>
          <h2 className="text-sm font-black text-[#F3F4F6]">
            Mitglieder, Ligen &amp; Resultate verwalten
          </h2>
        </div>

        <button
          type="button"
          onClick={onLockAdmin}
          className="rounded-xl border border-[#2E323B] bg-[#131417] px-3 py-1.5 text-[11px] font-bold text-[#9CA3AF] hover:text-[#F3F4F6]"
        >
          🔒 Sperren
        </button>
      </div>

      <div className="grid grid-cols-4 gap-1.5 rounded-xl bg-[#181A1E] p-1 ring-1 ring-[#24272D]">
        {[
          { id: 'members', label: `Mitglieder (${players.length})` },
          { id: 'leagues', label: `Ligen (${sortedLeagues.length})` },
          { id: 'results', label: 'Resultate' },
          { id: 'moderation', label: 'Halle & PIN' },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setAdminTab(t.id)}
            className={`rounded-lg py-2 text-[11px] font-bold transition ${
              adminTab === t.id
                ? 'bg-[#6FB3A2] text-[#060708]'
                : 'text-[#8E95A2] hover:text-[#F3F4F6]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {adminTab === 'members' && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={memberSearch}
              onChange={(e) => setMemberSearch(e.target.value)}
              placeholder="Mitglied suchen..."
              className="flex-1 rounded-xl border border-[#2E323B] bg-[#181A1E] px-3 py-2 text-xs text-[#F3F4F6]"
            />
            <button
              type="button"
              onClick={() => setShowBulkImport((v) => !v)}
              className="shrink-0 rounded-xl bg-[#252830] px-3 py-2 text-xs font-black text-[#A8D0B1]"
            >
              📥 Liste-Import
            </button>
            <button
              type="button"
              onClick={onOpenAddMember}
              className="shrink-0 rounded-xl bg-[#6FB3A2] px-3 py-2 text-xs font-black text-[#060708]"
            >
              + Neu
            </button>
          </div>

          {showBulkImport && (
            <div className="space-y-2.5 rounded-2xl border border-[#6FB3A2]/40 bg-[#181A1E] p-3.5">
              <div className="flex items-center justify-between">
                <div className="text-xs font-black text-[#A8D0B1]">
                  📥 Vereinsliste importieren (CSV oder Copy-Paste)
                </div>
                <button
                  type="button"
                  onClick={() => setShowBulkImport(false)}
                  className="text-xs font-bold text-[#8E95A2]"
                >
                  ✕
                </button>
              </div>

              <p className="text-[11px] leading-relaxed text-[#9CA3AF]">
                Spaltenformat (mit <code className="text-[#E6C79C]">;</code> oder{' '}
                <code className="text-[#E6C79C]">,</code> getrennt):{' '}
                <strong className="text-[#F3F4F6]">
                  Vorname; Nachname; Nickname; Telefon (+41/+49...); Klassierung; PIN
                </strong>
              </p>

              <div className="flex flex-wrap items-center gap-2">
                <label className="cursor-pointer rounded-lg bg-[#252830] px-3 py-1.5 text-[11px] font-bold text-[#E6C79C]">
                  CSV-Datei wählen
                  <input
                    type="file"
                    accept=".csv,.txt"
                    onChange={handleBulkCsvFile}
                    className="hidden"
                  />
                </label>

                <div className="flex items-center gap-1.5 text-[11px] text-[#9CA3AF]">
                  <span>Standard-PIN:</span>
                  <input
                    type="text"
                    maxLength={4}
                    value={bulkDefaultPin}
                    onChange={(e) =>
                      setBulkDefaultPin(
                        e.target.value.replace(/\D/g, '').slice(0, 4)
                      )
                    }
                    className="w-14 rounded-lg border border-[#2E323B] bg-[#131417] px-2 py-1 text-center font-black text-[#F3F4F6]"
                  />
                </div>

                <label className="flex items-center gap-1.5 text-[11px] text-[#D1D5DB]">
                  <input
                    type="checkbox"
                    checked={bulkMarkNew}
                    onChange={(e) => setBulkMarkNew(e.target.checked)}
                  />
                  <span>Als «Neu im Club»</span>
                </label>
              </div>

              <textarea
                rows={4}
                value={bulkText}
                onChange={(e) => setBulkText(e.target.value)}
                placeholder={`Beispiel:\nMax; Muster; MaxPower; +41 79 123 45 67; C8; 1234\nAnna; Keller; AnnaK; +49 170 987 65 43; D4; 1234`}
                className="w-full rounded-xl border border-[#2E323B] bg-[#131417] px-3 py-2 font-mono text-[11px] text-[#F3F4F6]"
              />

              <button
                type="button"
                disabled={!bulkText.trim()}
                onClick={() => {
                  const imported = parseBulkLines(bulkText);
                  if (imported.length > 0) {
                    onBulkImportMembers(imported);
                    setBulkText('');
                    setShowBulkImport(false);
                  }
                }}
                className="w-full rounded-xl bg-[#6FB3A2] py-2 text-xs font-black text-[#060708] disabled:opacity-40"
              >
                {parseBulkLines(bulkText).length > 0
                  ? `${parseBulkLines(bulkText).length} Profile jetzt erstellen ✓`
                  : 'Profile erstellen'}
              </button>
            </div>
          )}

          <div className="space-y-2">
            {filteredMembers.map((p) => {
              const assignedLeague = activeSeason.leagues.find((l) =>
                l.playerIds.includes(p.id)
              );
              const isEditing = editingPlayerId === p.id;

              return (
                <div
                  key={p.id}
                  className="rounded-2xl border border-[#24272D] bg-[#181A1E] p-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2.5">
                      <PlayerAvatar
                        player={p}
                        sizeClass="h-9 w-9 text-xs"
                        isConnectAccent={p.connectOnly}
                      />
                      <div className="min-w-0">
                        <div className="truncate text-xs font-black text-[#F3F4F6]">
                          {p.nickname}{' '}
                          <span className="font-normal text-[#8E95A2]">
                            ({p.firstName} {p.lastName})
                          </span>
                        </div>
                        <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-[10px] text-[#9CA3AF]">
                          <span className="rounded bg-[#131417] px-1.5 py-0.5 font-bold text-[#E6C79C]">
                            {assignedLeague ? assignedLeague.name : 'Nur CLUB'}
                          </span>
                          <span>{p.sttClass}</span>
                          <span>· {p.language || 'Deutsch'}</span>
                          <span>· Rating {connectRatings[p.id]?.elo || 1200}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          if (isEditing) {
                            setEditingPlayerId(null);
                          } else {
                            setEditingPlayerId(p.id);
                            setEditPinValue(p.pin || '1234');
                            setEditSttValue(p.sttClass || 'Hobby');
                          }
                        }}
                        className="rounded-lg bg-[#252830] px-2.5 py-1.5 text-[11px] font-bold text-[#F3F4F6]"
                      >
                        {isEditing ? 'Schliessen' : 'Bearbeiten'}
                      </button>
                    </div>
                  </div>

                  {isEditing && (
                    <div className="mt-3 space-y-2.5 border-t border-[#24272D] pt-2.5 text-xs">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="mb-1 block text-[10px] font-semibold text-[#8E95A2]">
                            Spieler-PIN (4 Ziffern)
                          </label>
                          <input
                            type="text"
                            inputMode="numeric"
                            maxLength={4}
                            value={editPinValue}
                            onChange={(e) =>
                              setEditPinValue(
                                e.target.value.replace(/\D/g, '').slice(0, 4)
                              )
                            }
                            className="w-full rounded-lg border border-[#2E323B] bg-[#131417] px-2.5 py-1.5 text-xs font-black tracking-widest text-[#F3F4F6]"
                          />
                        </div>

                        <div>
                          <label className="mb-1 block text-[10px] font-semibold text-[#8E95A2]">
                            Spielstärke / Klassierung
                          </label>
                          <select
                            value={editSttValue}
                            onChange={(e) => setEditSttValue(e.target.value)}
                            className="w-full rounded-lg border border-[#2E323B] bg-[#131417] px-2 py-1.5 text-xs font-bold text-[#F3F4F6]"
                          >
                            {STT_LEVEL_OPTIONS.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <label className="flex items-center gap-1.5 text-[11px] text-[#D1D5DB]">
                          <input
                            type="checkbox"
                            checked={Boolean(p.isNewMember)}
                            onChange={(e) =>
                              onUpdatePlayer({
                                ...p,
                                isNewMember: e.target.checked,
                              })
                            }
                          />
                          <span>«Neu im Club» Badge</span>
                        </label>

                        <div className="flex items-center gap-1.5">
                          {p.id !== currentUser.id && (
                            <button
                              type="button"
                              onClick={() => onDeletePlayer(p.id)}
                              className="rounded-lg bg-rose-950/50 px-2.5 py-1 text-[11px] font-bold text-rose-300 ring-1 ring-rose-500/30"
                            >
                              Löschen
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              onUpdatePlayer({
                                ...p,
                                pin: /^\d{4}$/.test(editPinValue)
                                  ? editPinValue
                                  : p.pin || '1234',
                                sttClass: editSttValue,
                              });
                              setEditingPlayerId(null);
                            }}
                            className="rounded-lg bg-[#6FB3A2] px-3 py-1 text-[11px] font-black text-[#060708]"
                          >
                            Speichern ✓
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {adminTab === 'leagues' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-2xl border border-[#24272D] bg-[#181A1E] p-3">
            <div>
              <div className="text-xs font-black text-[#F3F4F6]">
                Aktiver Monat: {activeSeason.label}
              </div>
              <div className="text-[10px] text-[#8E95A2]">
                Monatswechsel inkl. automatischem Auf- &amp; Abstieg
              </div>
            </div>
            <button
              type="button"
              onClick={onAdvanceMonth}
              className="rounded-xl bg-[#DE754B] px-3 py-2 text-[11px] font-black text-[#060708]"
            >
              Monat abschliessen →
            </button>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newLeagueName}
              onChange={(e) => setNewLeagueName(e.target.value)}
              placeholder="Neue Liga (z. B. Liga 3)"
              className="flex-1 rounded-xl border border-[#2E323B] bg-[#181A1E] px-3 py-2 text-xs text-[#F3F4F6]"
            />
            <button
              type="button"
              onClick={() => {
                onCreateLeague(newLeagueName);
                setNewLeagueName('');
              }}
              className="rounded-xl bg-[#DE754B] px-3 py-2 text-xs font-black text-[#060708]"
            >
              + Liga
            </button>
          </div>

          <div className="rounded-2xl border border-[#24272D] bg-[#181A1E] p-3.5">
            <div className="mb-2 text-xs font-black text-[#DE754B]">
              Spieler-Zuteilung ({activeSeason.label})
            </div>
            <div className="space-y-2">
              {players.map((p) => {
                const currentLeague = activeSeason.leagues.find((l) =>
                  l.playerIds.includes(p.id)
                );
                return (
                  <div
                    key={p.id}
                    className="flex items-center justify-between gap-2 rounded-xl bg-[#131417] px-3 py-2"
                  >
                    <div className="min-w-0">
                      <div className="truncate text-xs font-bold text-[#F3F4F6]">
                        {p.nickname}
                      </div>
                      <div className="text-[10px] text-[#8E95A2]">
                        {p.firstName} {p.lastName} · {p.sttClass}
                      </div>
                    </div>

                    <select
                      value={currentLeague ? currentLeague.id : 'paused'}
                      onChange={(e) =>
                        onAssignPlayerLeague(p.id, e.target.value)
                      }
                      className="rounded-lg border border-[#2E323B] bg-[#181A1E] px-2.5 py-1.5 text-xs font-bold text-[#F3F4F6]"
                    >
                      {sortedLeagues.map((l) => (
                        <option key={l.id} value={l.id}>
                          {l.name}
                        </option>
                      ))}
                      <option value="paused">Pause / Nur CLUB</option>
                    </select>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {adminTab === 'results' && (
        <div className="space-y-3">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {seasons.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSelectedSeasonId(s.id)}
                className={`rounded-lg px-2.5 py-1 text-xs font-bold ${
                  s.id === viewedSeason.id
                    ? 'bg-[#DE754B] text-[#060708]'
                    : 'bg-[#181A1E] text-[#9CA3AF]'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          <div className="rounded-2xl border border-[#24272D] bg-[#181A1E] p-3.5">
            <div className="mb-2 text-xs font-black text-[#DE754B]">
              LEAGUE-Spiele ({viewedSeason.matches.length})
            </div>
            <div className="space-y-2">
              {viewedSeason.matches.map((m) => {
                const p1 = playersById[m.player1Id];
                const p2 = playersById[m.player2Id];
                const isPlayed = m.score1 !== null && m.score2 !== null;
                return (
                  <div
                    key={m.id}
                    className="flex items-center justify-between gap-2 rounded-xl bg-[#131417] px-3 py-2 text-xs"
                  >
                    <div className="min-w-0">
                      <span className="font-bold text-[#F3F4F6]">
                        {p1?.nickname} vs. {p2?.nickname}
                      </span>
                      <span className="ml-2 font-black text-[#F4ECC2]">
                        {isPlayed ? `${m.score1}:${m.score2}` : 'Offen'}
                      </span>
                    </div>

                    <div className="flex shrink-0 items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => onSelectMatchToRecord(m)}
                        className="rounded-lg bg-[#252830] px-2.5 py-1 text-[11px] font-bold text-[#F3F4F6]"
                      >
                        {isPlayed ? 'Ändern' : 'Eintragen'}
                      </button>
                      {isPlayed && (
                        <button
                          type="button"
                          onClick={() => onResetLeagueMatch(m.id)}
                          className="rounded-lg bg-rose-950/50 px-2 py-1 text-[11px] font-bold text-rose-300"
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

          <div className="rounded-2xl border border-[#24272D] bg-[#181A1E] p-3.5">
            <div className="mb-2 text-xs font-black text-[#A8D0B1]">
              CONNECT-Partien ({connectMatches.length})
            </div>
            <div className="space-y-2">
              {connectMatches.map((cm) => (
                <div
                  key={cm.id}
                  className="flex items-center justify-between gap-2 rounded-xl bg-[#131417] px-3 py-2 text-xs"
                >
                  <div>
                    <span className="font-bold text-[#F3F4F6]">
                      {playersById[cm.player1Id]?.nickname} vs.{' '}
                      {playersById[cm.player2Id]?.nickname}
                    </span>
                    <span className="ml-2 font-black text-[#E6C79C]">
                      {cm.score}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onDeleteConnectMatch(cm.id)}
                    className="rounded-lg bg-rose-950/50 px-2.5 py-1 text-[11px] font-bold text-rose-300"
                  >
                    Löschen
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {adminTab === 'moderation' && (
        <div className="space-y-3">
          <div className="rounded-2xl border border-[#24272D] bg-[#181A1E] p-3.5">
            <div className="text-xs font-black text-[#E6C79C]">
              Admin-PIN ändern
            </div>
            <div className="mt-2 flex gap-2">
              <input
                type="password"
                inputMode="numeric"
                maxLength={4}
                value={newAdminPin}
                onChange={(e) =>
                  setNewAdminPin(e.target.value.replace(/\D/g, '').slice(0, 4))
                }
                placeholder={`Neuer 4-stelliger PIN (aktuell: ${adminPinCode})`}
                className="flex-1 rounded-xl border border-[#2E323B] bg-[#131417] px-3 py-2 text-xs text-[#F3F4F6]"
              />
              <button
                type="button"
                disabled={!/^\d{4}$/.test(newAdminPin)}
                onClick={() => {
                  onChangeAdminPin(newAdminPin);
                  setNewAdminPin('');
                }}
                className="rounded-xl bg-[#6FB3A2] px-3 py-2 text-xs font-black text-[#060708] disabled:opacity-40"
              >
                Speichern
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-[#24272D] bg-[#181A1E] p-3.5">
            <div className="mb-2 text-xs font-black text-emerald-300">
              LIVE-Check-ins ({liveCheckins.length})
            </div>
            {liveCheckins.length === 0 ? (
              <div className="text-xs text-[#8E95A2]">Keine aktiven Check-ins.</div>
            ) : (
              <div className="space-y-1.5">
                {liveCheckins.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center justify-between rounded-xl bg-[#131417] px-3 py-2 text-xs"
                  >
                    <span>
                      <strong>{playersById[c.playerId]?.nickname}</strong> ·{' '}
                      {c.tableInfo} (bis {c.untilTime})
                    </span>
                    <button
                      type="button"
                      onClick={() => onRemoveLiveCheckin(c.id)}
                      className="rounded-lg bg-rose-950/50 px-2.5 py-1 text-[11px] font-bold text-rose-300"
                    >
                      Auschecken
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-[#24272D] bg-[#181A1E] p-3.5">
            <div className="mb-2 text-xs font-black text-[#A8D0B1]">
              Club-Abende ({clubEvenings.length})
            </div>
            <div className="space-y-1.5">
              {clubEvenings.map((ev) => (
                <div
                  key={ev.id}
                  className="flex items-center justify-between rounded-xl bg-[#131417] px-3 py-2 text-xs"
                >
                  <span className="truncate pr-2 font-bold text-[#F3F4F6]">
                    {ev.title}
                  </span>
                  <button
                    type="button"
                    onClick={() => onDeleteClubEvening(ev.id)}
                    className="shrink-0 rounded-lg bg-rose-950/50 px-2.5 py-1 text-[11px] font-bold text-rose-300"
                  >
                    Löschen
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-[#24272D] bg-[#181A1E] p-3.5">
            <div className="mb-2 text-xs font-black text-[#F3F4F6]">
              Pinnwand &amp; Challenges ({sessions.length + challenges.length})
            </div>
            <div className="space-y-1.5">
              {challenges.map((ch) => (
                <div
                  key={ch.id}
                  className="flex items-center justify-between rounded-xl bg-[#131417] px-3 py-2 text-xs"
                >
                  <span className="truncate pr-2">
                    ⚡ {playersById[ch.challengerId]?.nickname}: {ch.format}
                  </span>
                  <button
                    type="button"
                    onClick={() => onDeleteChallenge(ch.id)}
                    className="shrink-0 rounded-lg bg-rose-950/50 px-2.5 py-1 text-[11px] font-bold text-rose-300"
                  >
                    Löschen
                  </button>
                </div>
              ))}
              {sessions.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between rounded-xl bg-[#131417] px-3 py-2 text-xs"
                >
                  <span className="truncate pr-2">
                    📌 {playersById[s.authorId]?.nickname}: {s.dateLabel}
                  </span>
                  <button
                    type="button"
                    onClick={() => onDeleteSession(s.id)}
                    className="shrink-0 rounded-lg bg-rose-950/50 px-2.5 py-1 text-[11px] font-bold text-rose-300"
                  >
                    Löschen
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
