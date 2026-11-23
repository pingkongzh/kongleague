import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  Trophy,
  Users,
  Plus,
  Calendar,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Check,
  X,
  Lock,
  Unlock,
  AlertTriangle,
  Award,
  BarChart3,
  MessageCircle,
  Settings,
  ShieldCheck,
  Edit3,
  Info,
  Clock,
  Camera,
  User,
  MapPin,
  Search
} from 'lucide-react';

// ============================================================================
// STAMMDATEN & KONSTANTEN (PINGKONG CLUB LIGA)
// ============================================================================

const SUPABASE_URL =
  (typeof window !== 'undefined' && window.__SUPABASE_URL__) ||
  (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_URL) ||
  ''; // <-- Hier deine Supabase Project URL eintragen (z. B. https://xyz.supabase.co)

const SUPABASE_ANON_KEY =
  (typeof window !== 'undefined' && window.__SUPABASE_ANON_KEY__) ||
  (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_ANON_KEY) ||
  ''; // <-- Hier deinen Supabase Anon/Public Key eintragen

const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

const LEAGUE_STATE_ROW_ID = 'pingkong-main';

const ADMIN_PIN = '1999';

const GROUP_MULTIPLIERS = {
  0: 1.5, // Gruppe A (Top-Liga)
  1: 1.25, // Gruppe B
  2: 1.0, // Gruppe C
  3: 0.9 // Gruppe D (falls mehr als 3 Gruppen)
};

const PLACEMENT_BONUS = {
  1: 25,
  2: 18,
  3: 12,
  4: 8,
  5: 5,
  6: 3
};

const WEEKDAY_OPTIONS = [
  'Mo',
  'Di',
  'Mi',
  'Do',
  'Fr',
  'Sa',
  'So',
  'Nach Absprache'
];

const HALL_DURATION_OPTIONS = [
  'ca. 30 Min.',
  'ca. 1 Std.',
  'ca. 1.5 Std.',
  'ca. 2 Std.',
  'ca. 3 Std.',
  'bis 18:30',
  'bis 19:00',
  'bis 19:30',
  'bis 20:00',
  'bis 20:30',
  'bis 21:00',
  'bis 21:30',
  'bis 22:00',
  'bis 22:30',
  'bis 23:00'
];

const INITIAL_MEMBERS = [
  {
    id: 'm1',
    firstName: 'Lukas',
    lastName: 'Meier',
    nickname: 'SpinMaster',
    pin: '1111',
    phone: '+41 79 111 22 33',
    language: 'DE',
    trainingDays: ['Di', 'Do'],
    trainingTime: 'ab 19:00',
    nextMonthStatus: 'confirmed',
    autoConfirm: true,
    blockedReason: null,
    lastGroupIndex: 0,
    avatarUrl: '',
    inHallNow: true,
    inHallSince: Date.now() - 28 * 60 * 1000,
    inHallUntil: 'ca. 2 Std.',
    inHallExpiresAt: Date.now() + 92 * 60 * 1000
  },
  {
    id: 'm2',
    firstName: 'Elena',
    lastName: 'Vogt',
    nickname: 'BackhandQueen',
    pin: '2222',
    phone: '+41 78 222 33 44',
    language: 'DE / EN',
    trainingDays: ['Mo', 'Mi'],
    trainingTime: 'ab 18:30',
    nextMonthStatus: 'confirmed',
    autoConfirm: false,
    blockedReason: null,
    lastGroupIndex: 0,
    avatarUrl: '',
    inHallNow: false,
    inHallSince: null,
    inHallUntil: '',
    inHallExpiresAt: null
  },
  {
    id: 'm3',
    firstName: 'Marco',
    lastName: 'Bernasconi',
    nickname: 'TopspinMarco',
    pin: '3333',
    phone: '+41 76 333 44 55',
    language: 'DE / IT',
    trainingDays: ['Di', 'Fr'],
    trainingTime: 'ab 20:00',
    nextMonthStatus: 'open',
    autoConfirm: false,
    blockedReason: null,
    lastGroupIndex: 0,
    avatarUrl: '',
    inHallNow: false,
    inHallSince: null,
    inHallUntil: '',
    inHallExpiresAt: null
  },
  {
    id: 'm4',
    firstName: 'Jonas',
    lastName: 'Keller',
    nickname: 'ChopBlock',
    pin: '4444',
    phone: '+41 79 444 55 66',
    language: 'DE',
    trainingDays: ['Do', 'Sa'],
    trainingTime: 'ab 19:30',
    nextMonthStatus: 'confirmed',
    autoConfirm: false,
    blockedReason: null,
    lastGroupIndex: 0,
    avatarUrl: '',
    inHallNow: false,
    inHallSince: null,
    inHallUntil: '',
    inHallExpiresAt: null
  },
  {
    id: 'm5',
    firstName: 'Sarah',
    lastName: 'Baumann',
    nickname: 'SmashSarah',
    pin: '5555',
    phone: '+41 78 555 66 77',
    language: 'DE / EN',
    trainingDays: ['Mo', 'Do'],
    trainingTime: 'ab 18:00',
    nextMonthStatus: 'confirmed',
    autoConfirm: true,
    blockedReason: null,
    lastGroupIndex: 1,
    avatarUrl: '',
    inHallNow: true,
    inHallSince: Date.now() - 12 * 60 * 1000,
    inHallUntil: 'ca. 1 Std.',
    inHallExpiresAt: Date.now() + 48 * 60 * 1000
  },
  {
    id: 'm6',
    firstName: 'David',
    lastName: 'Rossi',
    nickname: 'FlickKing',
    pin: '6666',
    phone: '+41 76 666 77 88',
    language: 'DE / IT',
    trainingDays: ['Mi', 'Fr'],
    trainingTime: 'ab 19:00',
    nextMonthStatus: 'open',
    autoConfirm: false,
    blockedReason: null,
    lastGroupIndex: 1,
    avatarUrl: '',
    inHallNow: false,
    inHallSince: null,
    inHallUntil: '',
    inHallExpiresAt: null
  },
  {
    id: 'm7',
    firstName: 'Nina',
    lastName: 'Steiner',
    nickname: 'LoopNina',
    pin: '7777',
    phone: '+41 79 777 88 99',
    language: 'DE',
    trainingDays: ['Di', 'Mi'],
    trainingTime: 'ab 18:30',
    nextMonthStatus: 'confirmed',
    autoConfirm: false,
    blockedReason: null,
    lastGroupIndex: 1,
    avatarUrl: '',
    inHallNow: false,
    inHallSince: null,
    inHallUntil: '',
    inHallExpiresAt: null
  },
  {
    id: 'm8',
    firstName: 'Tim',
    lastName: 'Hofmann',
    nickname: 'NetRoller',
    pin: '8888',
    phone: '+41 77 888 99 00',
    language: 'DE / EN',
    trainingDays: ['Do'],
    trainingTime: 'ab 20:00',
    nextMonthStatus: 'paused',
    autoConfirm: false,
    blockedReason: null,
    lastGroupIndex: 1,
    avatarUrl: '',
    inHallNow: false,
    inHallSince: null,
    inHallUntil: '',
    inHallExpiresAt: null
  },
  {
    id: 'm9',
    firstName: 'Claire',
    lastName: 'Dubois',
    nickname: 'AceClaire',
    pin: '9999',
    phone: '+41 78 999 00 11',
    language: 'FR / DE',
    trainingDays: ['Mo', 'Fr'],
    trainingTime: 'ab 19:00',
    nextMonthStatus: 'confirmed',
    autoConfirm: false,
    blockedReason: null,
    lastGroupIndex: 2,
    avatarUrl: '',
    inHallNow: false,
    inHallSince: null,
    inHallUntil: '',
    inHallExpiresAt: null
  },
  {
    id: 'm10',
    firstName: 'Fabian',
    lastName: 'Weber',
    nickname: 'SliceFab',
    pin: '1010',
    phone: '+41 79 101 02 03',
    language: 'DE',
    trainingDays: ['Mi'],
    trainingTime: 'ab 19:30',
    nextMonthStatus: 'open',
    autoConfirm: false,
    blockedReason: null,
    lastGroupIndex: 2,
    avatarUrl: '',
    inHallNow: false,
    inHallSince: null,
    inHallUntil: '',
    inHallExpiresAt: null
  },
  {
    id: 'm11',
    firstName: 'Lea',
    lastName: 'Zimmermann',
    nickname: 'SideSpinLea',
    pin: '1212',
    phone: '+41 76 121 23 24',
    language: 'DE / EN',
    trainingDays: ['Di', 'Sa'],
    trainingTime: 'ab 18:00',
    nextMonthStatus: 'confirmed',
    autoConfirm: true,
    blockedReason: null,
    lastGroupIndex: 2,
    avatarUrl: '',
    inHallNow: false,
    inHallSince: null,
    inHallUntil: '',
    inHallExpiresAt: null
  },
  {
    id: 'm12',
    firstName: 'Noah',
    lastName: 'Frei',
    nickname: 'CounterNoah',
    pin: '1313',
    phone: '+41 79 131 34 35',
    language: 'DE',
    trainingDays: ['Nach Absprache'],
    trainingTime: 'ab 19:00',
    nextMonthStatus: 'blocked',
    autoConfirm: false,
    blockedReason: 'Pflichtspiele im Vormonat nicht erreicht (1 Monat Pause)',
    lastGroupIndex: 2,
    avatarUrl: '',
    inHallNow: false,
    inHallSince: null,
    inHallUntil: '',
    inHallExpiresAt: null
  }
];

const INITIAL_SEASONS = [
  {
    id: '2026-10',
    year: 2026,
    month: 10,
    name: 'Oktober 2026',
    shortName: 'Okt ’26',
    status: 'completed',
    groups: [
      {
        id: 'gA-10',
        name: 'Gruppe A',
        index: 0,
        memberIds: ['m1', 'm2', 'm3', 'm4']
      },
      {
        id: 'gB-10',
        name: 'Gruppe B',
        index: 1,
        memberIds: ['m5', 'm6', 'm7', 'm8']
      },
      {
        id: 'gC-10',
        name: 'Gruppe C',
        index: 2,
        memberIds: ['m9', 'm10', 'm11', 'm12']
      }
    ],
    matches: [
      { id: 'o1', groupId: 'gA-10', p1: 'm1', p2: 'm2', s1: 3, s2: 1, playedAt: '2026-10-08' },
      { id: 'o2', groupId: 'gA-10', p1: 'm1', p2: 'm3', s1: 3, s2: 0, playedAt: '2026-10-14' },
      { id: 'o3', groupId: 'gA-10', p1: 'm1', p2: 'm4', s1: 3, s2: 2, playedAt: '2026-10-21' },
      { id: 'o4', groupId: 'gA-10', p1: 'm2', p2: 'm3', s1: 3, s2: 1, playedAt: '2026-10-17' },
      { id: 'o5', groupId: 'gA-10', p1: 'm2', p2: 'm4', s1: 3, s2: 0, playedAt: '2026-10-25' },
      { id: 'o6', groupId: 'gA-10', p1: 'm3', p2: 'm4', s1: 3, s2: 1, playedAt: '2026-10-27' },

      { id: 'o7', groupId: 'gB-10', p1: 'm5', p2: 'm6', s1: 3, s2: 1, playedAt: '2026-10-06' },
      { id: 'o8', groupId: 'gB-10', p1: 'm5', p2: 'm7', s1: 3, s2: 2, playedAt: '2026-10-12' },
      { id: 'o9', groupId: 'gB-10', p1: 'm5', p2: 'm8', s1: 3, s2: 0, playedAt: '2026-10-19' },
      { id: 'o10', groupId: 'gB-10', p1: 'm6', p2: 'm7', s1: 3, s2: 1, playedAt: '2026-10-15' },
      { id: 'o11', groupId: 'gB-10', p1: 'm6', p2: 'm8', s1: 3, s2: 1, playedAt: '2026-10-22' },
      { id: 'o12', groupId: 'gB-10', p1: 'm7', p2: 'm8', s1: 3, s2: 2, playedAt: '2026-10-26' },

      { id: 'o13', groupId: 'gC-10', p1: 'm9', p2: 'm10', s1: 3, s2: 0, playedAt: '2026-10-09' },
      { id: 'o14', groupId: 'gC-10', p1: 'm9', p2: 'm11', s1: 3, s2: 1, playedAt: '2026-10-16' },
      { id: 'o15', groupId: 'gC-10', p1: 'm9', p2: 'm12', s1: 3, s2: 0, playedAt: '2026-10-24' },
      { id: 'o16', groupId: 'gC-10', p1: 'm10', p2: 'm11', s1: 3, s2: 2, playedAt: '2026-10-18' },
      { id: 'o17', groupId: 'gC-10', p1: 'm11', p2: 'm12', s1: 3, s2: 1, playedAt: '2026-10-23' }
    ]
  },
  {
    id: '2026-11',
    year: 2026,
    month: 11,
    name: 'November 2026',
    shortName: 'Nov ’26',
    status: 'active',
    groups: [
      {
        id: 'gA-11',
        name: 'Gruppe A',
        index: 0,
        memberIds: ['m1', 'm2', 'm3', 'm5', 'm6']
      },
      {
        id: 'gB-11',
        name: 'Gruppe B',
        index: 1,
        memberIds: ['m4', 'm7', 'm8', 'm9']
      },
      {
        id: 'gC-11',
        name: 'Gruppe C',
        index: 2,
        memberIds: ['m10', 'm11', 'm12']
      }
    ],
    matches: [
      { id: 'n1', groupId: 'gA-11', p1: 'm1', p2: 'm2', s1: 3, s2: 1, playedAt: '2026-11-04' },
      { id: 'n2', groupId: 'gA-11', p1: 'm1', p2: 'm5', s1: 3, s2: 2, playedAt: '2026-11-07' },
      { id: 'n3', groupId: 'gA-11', p1: 'm2', p2: 'm3', s1: 3, s2: 0, playedAt: '2026-11-10' },
      { id: 'n4', groupId: 'gA-11', p1: 'm5', p2: 'm3', s1: 3, s2: 1, playedAt: '2026-11-12' },
      { id: 'n5', groupId: 'gA-11', p1: 'm6', p2: 'm3', s1: 3, s2: 2, playedAt: '2026-11-15' },

      { id: 'n6', groupId: 'gB-11', p1: 'm4', p2: 'm7', s1: 3, s2: 1, playedAt: '2026-11-05' },
      { id: 'n7', groupId: 'gB-11', p1: 'm4', p2: 'm9', s1: 3, s2: 0, playedAt: '2026-11-11' },
      { id: 'n8', groupId: 'gB-11', p1: 'm7', p2: 'm9', s1: 3, s2: 2, playedAt: '2026-11-14' },

      { id: 'n9', groupId: 'gC-11', p1: 'm10', p2: 'm11', s1: 2, s2: 3, playedAt: '2026-11-06' }
    ]
  }
];

// ============================================================================
// HILFSFUNKTIONEN & BERECHNUNGEN
// ============================================================================

function getDisplayName(member) {
  if (!member) return 'Unbekannt';
  return (member.nickname && member.nickname.trim()) || `${member.firstName} ${member.lastName}`;
}

function getFullName(member) {
  if (!member) return '';
  return `${member.firstName || ''} ${member.lastName || ''}`.trim();
}

function getInitials(member) {
  if (!member) return '??';
  const f = (member.firstName || '')[0] || '';
  const l = (member.lastName || '')[0] || '';
  return (f + l).toUpperCase() || 'PK';
}

function formatPhoneForWhatsApp(phone) {
  if (!phone) return '';
  let digits = phone.replace(/[^\d+]/g, '');
  if (digits.startsWith('00')) {
    digits = digits.slice(2);
  } else if (digits.startsWith('0')) {
    digits = '41' + digits.slice(1);
  } else if (digits.startsWith('+')) {
    digits = digits.slice(1);
  }
  return digits;
}

function buildWhatsAppLink({ opponent, sender, groupName, seasonName }) {
  const digits = formatPhoneForWhatsApp(opponent?.phone);
  if (!digits) return null;
  const senderName = sender ? getDisplayName(sender) : 'einem Clubkollegen';
  const text = `Hoi ${opponent.firstName}! Hier ist ${senderName} von pingkong (${seasonName}, ${groupName}). Wann passt es dir für unser Liga-Spiel?`;
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

function getNextMonthInfo(year, month) {
  const nextMonth = month === 12 ? 1 : month + 1;
  const nextYear = month === 12 ? year + 1 : year;
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
    'Dezember'
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
    'Dez'
  ];
  const id = `${nextYear}-${String(nextMonth).padStart(2, '0')}`;
  const yrShort = String(nextYear).slice(-2);
  return {
    id,
    year: nextYear,
    month: nextMonth,
    name: `${monthNames[nextMonth - 1]} ${nextYear}`,
    shortName: `${shortNames[nextMonth - 1]} ’${yrShort}`
  };
}

function formatLiveDuration(sinceMs) {
  if (!sinceMs) return 'Gerade eben';
  const diffMins = Math.max(0, Math.floor((Date.now() - sinceMs) / 60000));
  if (diffMins < 1) return 'Gerade eben';
  if (diffMins < 60) return `seit ${diffMins} Min.`;
  const hrs = Math.floor(diffMins / 60);
  const mins = diffMins % 60;
  return mins > 0 ? `seit ${hrs} Std. ${mins} Min.` : `seit ${hrs} Std.`;
}

function computeHallExpiryTimestamp(untilLabel, baseTimestamp = Date.now()) {
  if (!untilLabel) return baseTimestamp + 2 * 60 * 60 * 1000;
  const minMatch = untilLabel.match(/(\d+)\s*Min/i);
  if (minMatch) {
    const mins = parseInt(minMatch[1], 10);
    return baseTimestamp + mins * 60 * 1000;
  }
  const relMatch = untilLabel.match(/(\d+(?:[.,]\d+)?)\s*Std/i);
  if (relMatch) {
    const hours = parseFloat(relMatch[1].replace(',', '.'));
    return baseTimestamp + Math.round(hours * 60) * 60 * 1000;
  }
  const timeMatch = untilLabel.match(/bis\s+(\d{1,2}):(\d{2})/i);
  if (timeMatch) {
    const target = new Date(baseTimestamp);
    target.setHours(
      parseInt(timeMatch[1], 10),
      parseInt(timeMatch[2], 10),
      0,
      0
    );
    if (target.getTime() <= baseTimestamp) {
      target.setDate(target.getDate() + 1);
    }
    return target.getTime();
  }
  return baseTimestamp + 2 * 60 * 60 * 1000;
}

function formatRemainingHallTime(expiresAtMs) {
  if (!expiresAtMs) return '';
  const remMins = Math.max(0, Math.ceil((expiresAtMs - Date.now()) / 60000));
  if (remMins <= 0) return 'läuft ab';
  if (remMins < 60) return `noch ${remMins} Min.`;
  const hrs = Math.floor(remMins / 60);
  const mins = remMins % 60;
  return mins > 0 ? `noch ${hrs} Std. ${mins} Min.` : `noch ${hrs} Std.`;
}

function getPromotionRelegationSlots(groupSize, groupIndex, totalGroups) {
  const quota = groupSize >= 5 ? 2 : 1;
  const promoCount = groupIndex > 0 ? Math.min(quota, groupSize) : 0;
  const relegCount =
    groupIndex < totalGroups - 1
      ? Math.min(quota, Math.max(0, groupSize - promoCount))
      : 0;
  return {
    quota,
    promoCount,
    relegCount
  };
}

function computeGroupStandings(group, matches, membersMap) {
  const stats = {};
  group.memberIds.forEach(id => {
    stats[id] = {
      memberId: id,
      member: membersMap[id],
      played: 0,
      wins: 0,
      losses: 0,
      setsWon: 0,
      setsLost: 0,
      matchPoints: 0,
      h2h: {}
    };
  });

  const groupMatches = matches.filter(m => m.groupId === group.id);

  groupMatches.forEach(m => {
    const p1 = stats[m.p1];
    const p2 = stats[m.p2];
    if (!p1 || !p2) return;

    p1.played += 1;
    p2.played += 1;
    p1.setsWon += m.s1;
    p1.setsLost += m.s2;
    p2.setsWon += m.s2;
    p2.setsLost += m.s1;

    if (m.s1 > m.s2) {
      p1.wins += 1;
      p2.losses += 1;
      p1.matchPoints += 3;
      p2.matchPoints += m.s2 === 2 ? 1 : 0;
      p1.h2h[m.p2] = 1;
      p2.h2h[m.p1] = -1;
    } else {
      p2.wins += 1;
      p1.losses += 1;
      p2.matchPoints += 3;
      p1.matchPoints += m.s1 === 2 ? 1 : 0;
      p2.h2h[m.p1] = 1;
      p1.h2h[m.p2] = -1;
    }
  });

  const list = Object.values(stats);
  list.sort((a, b) => {
    if (b.matchPoints !== a.matchPoints) return b.matchPoints - a.matchPoints;
    const diffA = a.setsWon - a.setsLost;
    const diffB = b.setsWon - b.setsLost;
    if (diffB !== diffA) return diffB - diffA;
    if (b.setsWon !== a.setsWon) return b.setsWon - a.setsWon;
    if (a.h2h[b.memberId]) return -a.h2h[b.memberId];
    return getDisplayName(a.member).localeCompare(getDisplayName(b.member));
  });

  const requiredMatches = Math.max(0, group.memberIds.length - 1);

  return list.map((row, idx) => ({
    ...row,
    rank: idx + 1,
    setDiff: row.setsWon - row.setsLost,
    requiredMatches,
    fulfilledQuota: row.played >= requiredMatches
  }));
}

function computeAnnualLeaderboard(seasons, membersMap, year) {
  const yearSeasons = seasons.filter(s => s.year === year);
  const totals = {};

  Object.values(membersMap).forEach(m => {
    totals[m.id] = {
      member: m,
      totalPoints: 0,
      monthsPlayed: 0,
      totalWins: 0,
      totalMatches: 0,
      groupAPodiums: 0,
      monthlyBreakdown: []
    };
  });

  yearSeasons.forEach(season => {
    season.groups.forEach(group => {
      const standings = computeGroupStandings(group, season.matches, membersMap);
      const mult = GROUP_MULTIPLIERS[group.index] ?? 0.9;

      standings.forEach(row => {
        if (!totals[row.memberId]) return;
        const placeBonus =
          row.played > 0 ? PLACEMENT_BONUS[row.rank] ?? 2 : 0;
        const rawPoints = row.matchPoints * 4 + placeBonus;
        const earned = Math.round(rawPoints * mult);

        totals[row.memberId].totalPoints += earned;
        if (row.played > 0) totals[row.memberId].monthsPlayed += 1;
        totals[row.memberId].totalWins += row.wins;
        totals[row.memberId].totalMatches += row.played;
        if (group.index === 0 && row.rank <= 3 && row.played > 0) {
          totals[row.memberId].groupAPodiums += 1;
        }
        totals[row.memberId].monthlyBreakdown.push({
          seasonShort: season.shortName,
          groupName: group.name,
          rank: row.rank,
          earned
        });
      });
    });
  });

  return Object.values(totals)
    .filter(item => item.totalMatches > 0 || item.member.nextMonthStatus !== 'paused')
    .sort((a, b) => {
      if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
      if (b.totalWins !== a.totalWins) return b.totalWins - a.totalWins;
      return getDisplayName(a.member).localeCompare(getDisplayName(b.member));
    });
}

// ============================================================================
// HAUPTKOMPONENTE
// ============================================================================

export default function App() {
  const [members, setMembers] = useState(INITIAL_MEMBERS);
  const [seasons, setSeasons] = useState(INITIAL_SEASONS);
  const [selectedSeasonId, setSelectedSeasonId] = useState('2026-11');
  const [myPlayerId, setMyPlayerId] = useState('m1');
  const [activeTab, setActiveTab] = useState('groups'); // 'groups' | 'recent' | 'hall' | 'nextMonth' | 'annual' | 'members'
  const [previewLateMonth, setPreviewLateMonth] = useState(false);

  // Supabase Cloud-Sync Status
  const [cloudStatus, setCloudStatus] = useState(
    isSupabaseConfigured ? 'connecting' : 'local'
  ); // 'local' | 'connecting' | 'synced' | 'saving' | 'error'
  const isRemoteApplyingRef = useRef(false);
  const hasLoadedInitialCloudRef = useRef(false);

  // PIN-Schutz & Dialoge
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [adminViewOpen, setAdminViewOpen] = useState(false);
  const [unlockedPlayerIds, setUnlockedPlayerIds] = useState({});
  const [pinPrompt, setPinPrompt] = useState(null);
  const [playerPickerOpen, setPlayerPickerOpen] = useState(false);
  const [playerPickerQuery, setPlayerPickerQuery] = useState('');
  const [liveClockTick, setLiveClockTick] = useState(0);
  const [selectedHallDuration, setSelectedHallDuration] = useState('ca. 2 Std.');

  // Club-Hinweis (Admin-gesteuert)
  const [clubNotice, setClubNotice] = useState({
    active: false,
    tone: 'info', // 'info' | 'warning' | 'success'
    title: 'Wichtige Liga-Info',
    message:
      'Bitte denkt daran, eure offenen Pflichtspiele rechtzeitig bis Monatsende einzutragen.'
  });

  // ==========================================================================
  // SUPABASE: INITIAL LADEN, POLLING-SYNC & AUTOMATISCHES SPEICHERN (REST API)
  // ==========================================================================
  const applyRemotePayload = useCallback(payload => {
    if (!payload || typeof payload !== 'object') return;
    isRemoteApplyingRef.current = true;
    if (Array.isArray(payload.members) && payload.members.length > 0) {
      setMembers(payload.members);
    }
    if (Array.isArray(payload.seasons) && payload.seasons.length > 0) {
      setSeasons(payload.seasons);
    }
    if (payload.clubNotice && typeof payload.clubNotice === 'object') {
      setClubNotice(payload.clubNotice);
    }
    if (typeof payload.previewLateMonth === 'boolean') {
      setPreviewLateMonth(payload.previewLateMonth);
    }
    window.setTimeout(() => {
      isRemoteApplyingRef.current = false;
    }, 150);
  }, []);

  const fetchSupabaseState = useCallback(async () => {
    const baseUrl = SUPABASE_URL.replace(/\/$/, '');
    const res = await fetch(
      `${baseUrl}/rest/v1/kongleague_state?id=eq.${LEAGUE_STATE_ROW_ID}&select=payload,updated_at`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`
        }
      }
    );
    if (!res.ok) {
      throw new Error(`Supabase HTTP ${res.status}`);
    }
    const rows = await res.json();
    return Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
  }, []);

  const upsertSupabaseState = useCallback(async payload => {
    const baseUrl = SUPABASE_URL.replace(/\/$/, '');
    const res = await fetch(
      `${baseUrl}/rest/v1/kongleague_state?on_conflict=id`,
      {
        method: 'POST',
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          Prefer: 'resolution=merge-duplicates,return=minimal'
        },
        body: JSON.stringify({
          id: LEAGUE_STATE_ROW_ID,
          payload,
          updated_at: new Date().toISOString()
        })
      }
    );
    if (!res.ok) {
      throw new Error(`Supabase Upsert HTTP ${res.status}`);
    }
  }, []);

  // 1. Initialer Abruf & automatischer Hintergrund-Sync alle 8 Sekunden
  useEffect(() => {
    if (!isSupabaseConfigured) {
      setCloudStatus('local');
      return;
    }

    let isMounted = true;
    let lastKnownUpdatedAt = null;

    async function initSupabaseSync() {
      try {
        setCloudStatus('connecting');
        const row = await fetchSupabaseState();
        if (!isMounted) return;

        if (row?.payload) {
          lastKnownUpdatedAt = row.updated_at || null;
          applyRemotePayload(row.payload);
        } else {
          await upsertSupabaseState({
            members: INITIAL_MEMBERS,
            seasons: INITIAL_SEASONS,
            clubNotice,
            previewLateMonth: false
          });
        }

        hasLoadedInitialCloudRef.current = true;
        setCloudStatus('synced');
      } catch (err) {
        console.error('Supabase Ladefehler:', err);
        if (isMounted) setCloudStatus('error');
      }
    }

    initSupabaseSync();

    const pollTimer = window.setInterval(async () => {
      if (!hasLoadedInitialCloudRef.current || isRemoteApplyingRef.current) {
        return;
      }
      try {
        const row = await fetchSupabaseState();
        if (!isMounted || !row?.payload) return;
        if (row.updated_at && row.updated_at !== lastKnownUpdatedAt) {
          lastKnownUpdatedAt = row.updated_at;
          applyRemotePayload(row.payload);
          setCloudStatus('synced');
        }
      } catch {
        // Stiller Retry beim nächsten Intervall
      }
    }, 8000);

    return () => {
      isMounted = false;
      window.clearInterval(pollTimer);
    };
  }, [applyRemotePayload, fetchSupabaseState, upsertSupabaseState]);

  // 2. Änderungen (Spielresultate, Zusagen, Hallen-Check-in, Profil, Hinweise) automatisch speichern
  useEffect(() => {
    if (!isSupabaseConfigured || !hasLoadedInitialCloudRef.current) return;
    if (isRemoteApplyingRef.current) return;

    const timer = window.setTimeout(async () => {
      try {
        setCloudStatus('saving');
        await upsertSupabaseState({
          members,
          seasons,
          clubNotice,
          previewLateMonth
        });
        setCloudStatus('synced');
      } catch {
        setCloudStatus('error');
      }
    }, 350);

    return () => window.clearTimeout(timer);
  }, [members, seasons, clubNotice, previewLateMonth, upsertSupabaseState]);

  const tabContentRef = React.useRef(null);

  // Modals & Toasts
  const [matchModalData, setMatchModalData] = useState(null);
  const [profileModalMemberId, setProfileModalMemberId] = useState(null);
  const [profileModalEditInitially, setProfileModalEditInitially] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showRolloverModal, setShowRolloverModal] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    if (!toastMessage) return;
    const t = setTimeout(() => setToastMessage(''), 3200);
    return () => clearTimeout(t);
  }, [toastMessage]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setLiveClockTick(t => t + 1);
      setMembers(prev => {
        const hasExpired = prev.some(
          m => m.inHallNow && m.inHallExpiresAt && m.inHallExpiresAt <= now
        );
        if (!hasExpired) return prev;
        return prev.map(m => {
          if (m.inHallNow && m.inHallExpiresAt && m.inHallExpiresAt <= now) {
            if (m.id === myPlayerId) {
              setToastMessage(
                'Deine geplante Hallenzeit ist abgelaufen – du wurdest automatisch ausgecheckt.'
              );
            }
            return {
              ...m,
              inHallNow: false,
              inHallSince: null,
              inHallUntil: '',
              inHallExpiresAt: null
            };
          }
          return m;
        });
      });
    }, 15000);
    return () => clearInterval(interval);
  }, [myPlayerId]);

  const showToast = msg => {
    setToastMessage(msg);
  };

  const navigateToTab = tabId => {
    setActiveTab(tabId);
    if (typeof window !== 'undefined') {
      window.requestAnimationFrame(() => {
        if (tabContentRef.current) {
          const top =
            tabContentRef.current.getBoundingClientRect().top +
            window.scrollY -
            88;
          window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    }
  };

  const membersMap = useMemo(() => {
    const map = {};
    members.forEach(m => {
      map[m.id] = m;
    });
    return map;
  }, [members]);

  const filteredHeaderMembers = useMemo(() => {
    const q = playerPickerQuery.trim().toLowerCase();
    if (!q) return members;
    return members.filter(m => {
      const display = getDisplayName(m).toLowerCase();
      const full = getFullName(m).toLowerCase();
      return display.includes(q) || full.includes(q);
    });
  }, [members, playerPickerQuery]);

  const currentSeason = useMemo(
    () => seasons.find(s => s.id === selectedSeasonId) || seasons[seasons.length - 1],
    [seasons, selectedSeasonId]
  );

  const nextSeason = useMemo(
    () => getNextMonthInfo(currentSeason.year, currentSeason.month),
    [currentSeason.year, currentSeason.month]
  );

  const isSeasonClosed = currentSeason.status === 'completed';

  const openMembersForNextMonth = useMemo(
    () => members.filter(m => m.nextMonthStatus === 'open'),
    [members]
  );

  const penaltyAtRiskPlayers = useMemo(() => {
    if (isSeasonClosed) return [];
    const list = [];
    currentSeason.groups.forEach(group => {
      const standings = computeGroupStandings(
        group,
        currentSeason.matches,
        membersMap
      );
      standings.forEach(row => {
        if (!row.fulfilledQuota && row.member) {
          list.push({
            member: row.member,
            groupId: group.id,
            groupName: group.name,
            played: row.played,
            requiredMatches: row.requiredMatches,
            missing: row.requiredMatches - row.played
          });
        }
      });
    });
    return list.sort((a, b) => b.missing - a.missing);
  }, [currentSeason, membersMap, isSeasonClosed]);

  const liveInHallMembers = useMemo(() => {
    const now = Date.now();
    return members
      .filter(
        m =>
          Boolean(m.inHallNow) &&
          (!m.inHallExpiresAt || m.inHallExpiresAt > now)
      )
      .sort((a, b) => (b.inHallSince || 0) - (a.inHallSince || 0));
  }, [members, liveClockTick]);

  const isLateMonthReminderActive =
    !isSeasonClosed &&
    (openMembersForNextMonth.length > 0 || penaltyAtRiskPlayers.length > 0) &&
    (new Date().getDate() >= 20 || previewLateMonth);

  const runWithPlayerPin = (member, actionLabel, callback) => {
    if (!member) return;
    if (isAdminUnlocked || unlockedPlayerIds[member.id]) {
      callback();
      return;
    }
    setPinPrompt({
      mode: 'player',
      memberId: member.id,
      playerName: getDisplayName(member),
      expectedPin: member.pin || '1234',
      actionLabel,
      onSuccess: () => {
        setUnlockedPlayerIds(prev => ({ ...prev, [member.id]: true }));
        callback();
      }
    });
  };

  // Mein Profil Kennzahlen
  const myPlayerStats = useMemo(() => {
    const member = membersMap[myPlayerId];
    if (!member) return null;
    const group = currentSeason.groups.find(g => g.memberIds.includes(myPlayerId));
    if (!group) {
      return { member, group: null, standing: null, openOpponents: [] };
    }
    const standings = computeGroupStandings(group, currentSeason.matches, membersMap);
    const standing = standings.find(s => s.memberId === myPlayerId);
    const playedAgainst = new Set();
    currentSeason.matches
      .filter(m => m.groupId === group.id && (m.p1 === myPlayerId || m.p2 === myPlayerId))
      .forEach(m => {
        playedAgainst.add(m.p1 === myPlayerId ? m.p2 : m.p1);
      });
    const openOpponents = group.memberIds
      .filter(id => id !== myPlayerId && !playedAgainst.has(id))
      .map(id => membersMap[id])
      .filter(Boolean);

    return { member, group, standing, openOpponents };
  }, [myPlayerId, membersMap, currentSeason]);

  // Teilnahme Folgemonat umschalten (PIN-geschützt)
  const handleToggleNextMonth = (memberId, explicitStatus = null) => {
    const member = membersMap[memberId];
    if (!member) return;

    if (member.nextMonthStatus === 'blocked' && !isAdminUnlocked) {
      showToast(
        `${getDisplayName(member)} ist wegen fehlender Pflichtspiele für 1 Monat gesperrt.`
      );
      return;
    }

    const nextStatus =
      explicitStatus ||
      (member.nextMonthStatus === 'confirmed' ? 'paused' : 'confirmed');

    runWithPlayerPin(
      member,
      `Teilnahme ${nextSeason.shortName} auf «${
        nextStatus === 'confirmed'
          ? 'Dabei'
          : nextStatus === 'paused'
          ? 'Pausiert'
          : 'Offen'
      }» setzen`,
      () => {
        setMembers(prev =>
          prev.map(m =>
            m.id === memberId
              ? {
                  ...m,
                  nextMonthStatus: nextStatus,
                  autoConfirm: nextStatus === 'paused' ? false : m.autoConfirm,
                  blockedReason: nextStatus !== 'blocked' ? null : m.blockedReason
                }
              : m
          )
        );
        const label =
          nextStatus === 'confirmed'
            ? 'Dabei'
            : nextStatus === 'paused'
            ? 'Pausiert'
            : 'Offen';
        showToast(
          `${getDisplayName(member)} ist für ${nextSeason.shortName} auf «${label}» gesetzt.`
        );
      }
    );
  };

  // Dauer-Zusage bis auf Widerruf umschalten (PIN-geschützt)
  const handleToggleAutoConfirm = memberId => {
    const member = membersMap[memberId];
    if (!member) return;

    if (member.nextMonthStatus === 'blocked' && !isAdminUnlocked) {
      showToast(
        `${getDisplayName(member)} ist wegen fehlender Pflichtspiele für 1 Monat gesperrt.`
      );
      return;
    }

    const nextValue = !member.autoConfirm;
    runWithPlayerPin(
      member,
      nextValue
        ? 'Dauer-Zusage (immer dabei) aktivieren'
        : 'Dauer-Zusage widerrufen',
      () => {
        setMembers(prev =>
          prev.map(m =>
            m.id === memberId
              ? {
                  ...m,
                  autoConfirm: nextValue,
                  nextMonthStatus:
                    nextValue && m.nextMonthStatus !== 'blocked'
                      ? 'confirmed'
                      : m.nextMonthStatus
                }
              : m
          )
        );
        showToast(
          nextValue
            ? `${getDisplayName(member)} ist jetzt immer dabei (bis auf Widerruf).`
            : `Dauer-Zusage für ${getDisplayName(member)} widerrufen.`
        );
      }
    );
  };

  // Echtzeit-Check-in / Check-out in der Halle (PIN-geschützt)
  const handleToggleInHallNow = (memberId, untilLabel = 'ca. 2 Std.') => {
    const member = membersMap[memberId];
    if (!member) return;
    const nextInHall = !member.inHallNow;
    runWithPlayerPin(
      member,
      nextInHall
        ? 'Als «Jetzt in der Halle» einchecken'
        : 'Aus der Halle auschecken',
      () => {
        const now = Date.now();
        const expiresAt = nextInHall
          ? computeHallExpiryTimestamp(untilLabel, now)
          : null;
        setMembers(prev =>
          prev.map(m =>
            m.id === memberId
              ? {
                  ...m,
                  inHallNow: nextInHall,
                  inHallSince: nextInHall ? now : null,
                  inHallUntil: nextInHall ? untilLabel : '',
                  inHallExpiresAt: expiresAt
                }
              : m
          )
        );
        showToast(
          nextInHall
            ? `${getDisplayName(member)} ist eingecheckt (${untilLabel}, Auto-Checkout aktiv).`
            : `${getDisplayName(member)} hat aus der Halle ausgecheckt.`
        );
      }
    );
  };

  const handleUpdateInHallUntil = (memberId, untilLabel) => {
    const member = membersMap[memberId];
    if (!member) return;
    runWithPlayerPin(member, 'Anwesenheitsdauer anpassen', () => {
      const expiresAt = computeHallExpiryTimestamp(untilLabel, Date.now());
      setMembers(prev =>
        prev.map(m =>
          m.id === memberId
            ? { ...m, inHallUntil: untilLabel, inHallExpiresAt: expiresAt }
            : m
        )
      );
      showToast(
        `Auto-Checkout auf ${untilLabel} (${formatRemainingHallTime(expiresAt)}) gesetzt.`
      );
    });
  };

  // Match speichern oder aktualisieren
  const handleSaveMatch = ({ groupId, matchId, p1, p2, s1, s2 }) => {
    setSeasons(prev =>
      prev.map(season => {
        if (season.id !== currentSeason.id) return season;
        const existingIdx = season.matches.findIndex(
          m =>
            m.id === matchId ||
            (m.groupId === groupId &&
              ((m.p1 === p1 && m.p2 === p2) || (m.p1 === p2 && m.p2 === p1)))
        );

        const matchRecord = {
          id: matchId || `m-${Date.now()}`,
          groupId,
          p1,
          p2,
          s1,
          s2,
          playedAt: new Date().toISOString().slice(0, 10)
        };

        const updatedMatches = [...season.matches];
        if (existingIdx >= 0) {
          updatedMatches[existingIdx] = matchRecord;
        } else {
          updatedMatches.push(matchRecord);
        }
        return { ...season, matches: updatedMatches };
      })
    );
    setMatchModalData(null);
    showToast(`Resultat gespeichert (${s1}:${s2} Sätze).`);
  };

  // Spielerprofil aktualisieren
  const handleUpdateMember = updated => {
    setMembers(prev => prev.map(m => (m.id === updated.id ? updated : m)));
    showToast(`Profil von ${getDisplayName(updated)} aktualisiert.`);
  };

  // Neues Mitglied anlegen
  const handleCreateMember = newMemberData => {
    const newId = `m${Date.now()}`;
    const created = {
      ...newMemberData,
      id: newId,
      pin: (newMemberData.pin || '1234').trim(),
      nextMonthStatus: 'confirmed',
      autoConfirm: Boolean(newMemberData.autoConfirm),
      blockedReason: null,
      lastGroupIndex: currentSeason.groups.length - 1,
      avatarUrl: '',
      inHallNow: false,
      inHallSince: null,
      inHallUntil: '',
      inHallExpiresAt: null
    };
    setMembers(prev => [...prev, created]);

    setSeasons(prev =>
      prev.map(s => {
        if (s.id !== currentSeason.id || s.status === 'completed') return s;
        const groupsCopy = s.groups.map((g, idx) =>
          idx === s.groups.length - 1
            ? { ...g, memberIds: [...g.memberIds, newId] }
            : g
        );
        return { ...s, groups: groupsCopy };
      })
    );

    setShowAddMemberModal(false);
    showToast(`${getDisplayName(created)} wurde aufgenommen.`);
  };

  // Monatsabschluss & Auslosung
  const handleRolloverMonth = ({ excusedIds, nextGroupSize }) => {
    const groupCount = currentSeason.groups.length;
    const targetGroupIndexByMember = {};
    const penaltyBlockedIds = new Set();

    currentSeason.groups.forEach((group, gIdx) => {
      const standings = computeGroupStandings(group, currentSeason.matches, membersMap);
      const { promoCount, relegCount } = getPromotionRelegationSlots(
        standings.length,
        gIdx,
        groupCount
      );

      standings.forEach((row, idx) => {
        let nextIdx = gIdx;
        if (!row.fulfilledQuota && !excusedIds.includes(row.memberId)) {
          penaltyBlockedIds.add(row.memberId);
          nextIdx = Math.min(groupCount - 1, gIdx + 1);
        } else {
          if (promoCount > 0 && idx < promoCount && row.fulfilledQuota) {
            nextIdx = gIdx - 1;
          } else if (
            relegCount > 0 &&
            idx >= standings.length - relegCount
          ) {
            nextIdx = gIdx + 1;
          }
        }
        targetGroupIndexByMember[row.memberId] = nextIdx;
      });
    });

    const eligibleMembers = members.filter(
      m => m.nextMonthStatus === 'confirmed' && !penaltyBlockedIds.has(m.id)
    );

    const rankedForNext = [...eligibleMembers].sort((a, b) => {
      const gA =
        targetGroupIndexByMember[a.id] !== undefined
          ? targetGroupIndexByMember[a.id]
          : a.lastGroupIndex ?? 99;
      const gB =
        targetGroupIndexByMember[b.id] !== undefined
          ? targetGroupIndexByMember[b.id]
          : b.lastGroupIndex ?? 99;
      if (gA !== gB) return gA - gB;
      return getDisplayName(a).localeCompare(getDisplayName(b));
    });

    const newGroups = [];
    const groupLetters = ['A', 'B', 'C', 'D', 'E', 'F'];
    for (let i = 0; i < rankedForNext.length; i += nextGroupSize) {
      const chunk = rankedForNext.slice(i, i + nextGroupSize);
      const gIdx = newGroups.length;
      newGroups.push({
        id: `g${groupLetters[gIdx] || gIdx + 1}-${nextSeason.id}`,
        name: `Gruppe ${groupLetters[gIdx] || gIdx + 1}`,
        index: gIdx,
        memberIds: chunk.map(m => m.id)
      });
    }

    if (newGroups.length > 1 && newGroups[newGroups.length - 1].memberIds.length === 1) {
      const loneId = newGroups.pop().memberIds[0];
      newGroups[newGroups.length - 1].memberIds.push(loneId);
    }

    const newSeasonObj = {
      id: nextSeason.id,
      year: nextSeason.year,
      month: nextSeason.month,
      name: nextSeason.name,
      shortName: nextSeason.shortName,
      status: 'active',
      groups: newGroups,
      matches: []
    };

    setSeasons(prev => [
      ...prev.map(s => (s.id === currentSeason.id ? { ...s, status: 'completed' } : s)),
      newSeasonObj
    ]);

    setMembers(prev =>
      prev.map(m => {
        const assignedGroup = newGroups.find(g => g.memberIds.includes(m.id));
        const isPenaltyBlocked = penaltyBlockedIds.has(m.id);
        return {
          ...m,
          lastGroupIndex: assignedGroup ? assignedGroup.index : m.lastGroupIndex,
          nextMonthStatus: isPenaltyBlocked
            ? 'blocked'
            : m.autoConfirm
            ? 'confirmed'
            : m.nextMonthStatus === 'confirmed'
            ? 'open'
            : m.nextMonthStatus === 'blocked'
            ? 'open'
            : m.nextMonthStatus,
          blockedReason: isPenaltyBlocked
            ? `Pflichtspiele im ${currentSeason.shortName} nicht erreicht (1 Monat Sperre)`
            : null
        };
      })
    );

    setSelectedSeasonId(newSeasonObj.id);
    setShowRolloverModal(false);
    showToast(`${nextSeason.name} ausgelost (${newGroups.length} Gruppen).`);
  };

  return (
    <div className="min-h-screen bg-[#0F1115] text-[#F8FAFC] pb-28 sm:pb-14 selection:bg-[#10B981] selection:text-[#052016]">
      {/* ====================================================================
          HEADER
         ==================================================================== */}
      <header className="sticky top-0 z-30 bg-[#0F1115]/95 backdrop-blur-md border-b border-[#222630]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-2.5 sm:py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          {/* Zeile 1 (Mobile) / Linke Seite (Desktop): Brand + Mobile-Controls */}
          <div className="flex items-center justify-between gap-2 min-w-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-[#10B981] text-[#052016] flex items-center justify-center font-black text-sm sm:text-base tracking-tight shrink-0">
                PK
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h1 className="font-bold text-base sm:text-lg tracking-tight text-[#F8FAFC] truncate">
                    KONGLeague
                  </h1>
                  <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[#10B981]/15 text-[#34D399]">
                    by pingkong
                  </span>
                  <span
                    title={
                      cloudStatus === 'synced'
                        ? 'Mit Supabase Cloud synchronisiert'
                        : cloudStatus === 'saving' || cloudStatus === 'connecting'
                        ? 'Synchronisiert mit Supabase...'
                        : cloudStatus === 'error'
                        ? 'Supabase-Verbindungsfehler (Tabellen-Setup prüfen)'
                        : 'Lokaler Modus (Supabase noch nicht verbunden)'
                    }
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                      cloudStatus === 'synced'
                        ? 'bg-[#10B981]/15 text-[#34D399]'
                        : cloudStatus === 'saving' || cloudStatus === 'connecting'
                        ? 'bg-[#38BDF8]/15 text-[#7DD3FC]'
                        : cloudStatus === 'error'
                        ? 'bg-[#F43F5E]/15 text-[#FB7185]'
                        : 'bg-[#252B37] text-[#94A3B8]'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        cloudStatus === 'synced'
                          ? 'bg-[#10B981]'
                          : cloudStatus === 'saving' ||
                            cloudStatus === 'connecting'
                          ? 'bg-[#38BDF8] animate-pulse'
                          : cloudStatus === 'error'
                          ? 'bg-[#F43F5E]'
                          : 'bg-[#64748B]'
                      }`}
                    />
                    {cloudStatus === 'synced'
                      ? 'Live Cloud'
                      : cloudStatus === 'saving'
                      ? 'Speichert...'
                      : cloudStatus === 'connecting'
                      ? 'Verbindet...'
                      : cloudStatus === 'error'
                      ? 'Sync-Fehler'
                      : 'Lokal'}
                  </span>
                </div>
                <p className="text-[11px] text-[#94A3B8] truncate">
                  {currentSeason.name} · {currentSeason.groups.length} Gruppen
                </p>
              </div>
            </div>

            {/* Saison & Admin direkt auf Mobile rechts */}
            <div className="flex sm:hidden items-center gap-1.5 shrink-0">
              <div className="relative">
                <select
                  aria-label="Monat wählen"
                  value={currentSeason.id}
                  onChange={e => setSelectedSeasonId(e.target.value)}
                  className="appearance-none min-h-[38px] bg-[#171A21] border border-[#282E3B] rounded-xl pl-2.5 pr-6 py-1.5 text-xs font-semibold text-[#F8FAFC] focus:outline-none focus:border-[#10B981] cursor-pointer"
                >
                  {seasons.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.shortName} {s.status === 'active' ? '●' : ''}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-[#94A3B8] pointer-events-none absolute right-2 top-1/2 -translate-y-1/2" />
              </div>

              {!isAdminUnlocked ? (
                <button
                  onClick={() =>
                    setPinPrompt({
                      mode: 'admin',
                      actionLabel: 'Admin-Bereich öffnen',
                      onSuccess: () => {
                        setIsAdminUnlocked(true);
                        setAdminViewOpen(true);
                        showToast('Admin-Bereich geöffnet.');
                      }
                    })
                  }
                  aria-label="Admin-Bereich öffnen"
                  className="min-h-[38px] px-2.5 rounded-xl bg-[#171A21] border border-[#282E3B] text-xs font-medium text-[#94A3B8] hover:text-[#F8FAFC] flex items-center justify-center shrink-0"
                >
                  <Lock className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={() => setAdminViewOpen(prev => !prev)}
                  className={`min-h-[38px] px-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1 shrink-0 ${
                    adminViewOpen
                      ? 'bg-[#10B981] border-[#10B981] text-[#052016]'
                      : 'bg-[#10B981]/15 border-[#10B981]/40 text-[#34D399]'
                  }`}
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>{adminViewOpen ? 'Liga' : 'Admin'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Zeile 2 (Mobile: volle Breite) / Rechte Seite (Desktop): Spieler-Filter + Saison + Admin */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Suchbares Spielerprofil-Dropdown */}
            <div className="relative flex-1 sm:flex-initial">
              <button
                type="button"
                onClick={() => {
                  setPlayerPickerOpen(prev => !prev);
                  setPlayerPickerQuery('');
                }}
                aria-label="Spielerprofil wechseln oder suchen"
                className="w-full sm:w-auto min-h-[40px] px-3 rounded-2xl bg-[#171A21] border border-[#282E3B] hover:border-[#10B981]/50 text-xs font-semibold text-[#F8FAFC] flex items-center justify-between sm:justify-start gap-2 transition"
              >
                <span className="flex items-center gap-2 min-w-0">
                  {myPlayerStats?.member && (
                    <PlayerAvatar member={myPlayerStats.member} size="xs" />
                  )}
                  <span className="sm:hidden text-[11px] font-normal text-[#94A3B8] shrink-0">
                    Profil:
                  </span>
                  <span className="truncate sm:max-w-[140px]">
                    {myPlayerStats?.member
                      ? getDisplayName(myPlayerStats.member)
                      : 'Spieler wählen'}
                  </span>
                </span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-[#94A3B8] shrink-0 transition-transform ${
                    playerPickerOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {playerPickerOpen && (
                <>
                  <div
                    className="hidden sm:block fixed inset-0 z-40"
                    onClick={() => setPlayerPickerOpen(false)}
                  />
                  <div className="hidden sm:flex fixed sm:absolute right-0 top-full mt-2 w-80 bg-[#171A21] border border-[#2C3342] rounded-3xl shadow-2xl z-50 flex-col max-h-96 overflow-hidden">
                    <div className="p-3 border-b border-[#252B37] space-y-2 shrink-0">
                      <div className="flex items-center justify-between px-1">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">
                          Spielerprofil wechseln ({members.length})
                        </span>
                        <button
                          type="button"
                          onClick={() => setPlayerPickerOpen(false)}
                          aria-label="Auswahl schliessen"
                          className="w-7 h-7 rounded-xl bg-[#11141A] flex items-center justify-center text-[#94A3B8] hover:text-[#F8FAFC]"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="text"
                          value={playerPickerQuery}
                          onChange={e => setPlayerPickerQuery(e.target.value)}
                          placeholder="Name oder Spielername suchen..."
                          className="w-full min-h-[38px] pl-9 pr-8 py-1.5 rounded-xl bg-[#11141A] border border-[#282E3B] text-xs text-[#F8FAFC] placeholder:text-[#64748B] focus:outline-none focus:border-[#10B981]"
                        />
                        {playerPickerQuery && (
                          <button
                            type="button"
                            onClick={() => setPlayerPickerQuery('')}
                            aria-label="Suche löschen"
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-[#64748B] hover:text-[#F8FAFC]"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="overflow-y-auto divide-y divide-[#252B37]/60 pb-1">
                      {filteredHeaderMembers.length === 0 ? (
                        <div className="px-4 py-8 text-center text-xs text-[#94A3B8]">
                          Kein Spieler gefunden.
                        </div>
                      ) : (
                        filteredHeaderMembers.map(m => {
                          const isCurrent = m.id === myPlayerId;
                          return (
                            <div
                              key={m.id}
                              className={`px-3.5 py-2.5 flex items-center justify-between gap-2.5 transition ${
                                isCurrent
                                  ? 'bg-[#10B981]/10'
                                  : 'hover:bg-[#1E222B]'
                              }`}
                            >
                              <button
                                type="button"
                                onClick={() => {
                                  setMyPlayerId(m.id);
                                  setPlayerPickerOpen(false);
                                  setPlayerPickerQuery('');
                                }}
                                className="flex items-center gap-3 min-w-0 flex-1 text-left"
                              >
                                <PlayerAvatar member={m} size="sm" />
                                <div className="min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-xs font-bold text-[#F8FAFC] truncate">
                                      {getDisplayName(m)}
                                    </span>
                                    {isCurrent && (
                                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#10B981]/20 text-[#34D399] shrink-0">
                                        Aktiv
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-[11px] text-[#64748B] truncate mt-0.5">
                                    {getFullName(m)}
                                  </div>
                                </div>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setProfileModalMemberId(m.id);
                                  setProfileModalEditInitially(false);
                                  setPlayerPickerOpen(false);
                                  setPlayerPickerQuery('');
                                }}
                                className="min-h-[34px] px-3 rounded-xl bg-[#11141A] border border-[#282E3B] hover:border-[#3A4254] text-[11px] font-semibold text-[#94A3B8] hover:text-[#F8FAFC] shrink-0 transition"
                              >
                                Profil
                              </button>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Desktop Saison-Auswahl & Admin */}
            <div className="hidden sm:flex items-center gap-2">
              <div className="relative">
                <select
                  aria-label="Monat wählen"
                  value={currentSeason.id}
                  onChange={e => setSelectedSeasonId(e.target.value)}
                  className="appearance-none min-h-[40px] bg-[#171A21] border border-[#282E3B] rounded-2xl pl-3 pr-7 py-2 text-xs font-semibold text-[#F8FAFC] focus:outline-none focus:border-[#10B981] cursor-pointer"
                >
                  {seasons.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.shortName} {s.status === 'active' ? '●' : ''}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-[#94A3B8] pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2" />
              </div>

              {!isAdminUnlocked ? (
                <button
                  onClick={() =>
                    setPinPrompt({
                      mode: 'admin',
                      actionLabel: 'Admin-Bereich öffnen',
                      onSuccess: () => {
                        setIsAdminUnlocked(true);
                        setAdminViewOpen(true);
                        showToast('Admin-Bereich geöffnet.');
                      }
                    })
                  }
                  title="Admin-Bereich öffnen"
                  className="min-h-[40px] px-3 rounded-2xl bg-[#171A21] border border-[#282E3B] hover:border-[#3A4254] text-xs font-medium text-[#94A3B8] hover:text-[#F8FAFC] flex items-center gap-1.5 transition"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Admin</span>
                </button>
              ) : (
                <button
                  onClick={() => setAdminViewOpen(prev => !prev)}
                  className={`min-h-[40px] px-3 rounded-2xl border text-xs font-semibold flex items-center gap-1.5 transition ${
                    adminViewOpen
                      ? 'bg-[#10B981] border-[#10B981] text-[#052016]'
                      : 'bg-[#10B981]/15 border-[#10B981]/40 text-[#34D399]'
                  }`}
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>{adminViewOpen ? 'Zur Liga' : 'Admin-Bereich'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ====================================================================
          MAIN CONTENT
         ==================================================================== */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-5 sm:pt-7 space-y-6">
        {adminViewOpen && isAdminUnlocked ? (
          <AdminDashboardView
            currentSeason={currentSeason}
            nextSeason={nextSeason}
            isSeasonClosed={isSeasonClosed}
            members={members}
            openMembersForNextMonth={openMembersForNextMonth}
            liveInHallMembers={liveInHallMembers}
            previewLateMonth={previewLateMonth}
            onTogglePreviewLateMonth={() => setPreviewLateMonth(prev => !prev)}
            clubNotice={clubNotice}
            onUpdateClubNotice={updated => {
              setClubNotice(updated);
              showToast(
                updated.active
                  ? 'Club-Hinweis eingeblendet.'
                  : 'Club-Hinweis ausgeblendet.'
              );
            }}
            onOpenRollover={() => setShowRolloverModal(true)}
            onOpenAddMember={() => setShowAddMemberModal(true)}
            onUnblockMember={memberId => {
              setMembers(prev =>
                prev.map(m =>
                  m.id === memberId
                    ? { ...m, nextMonthStatus: 'open', blockedReason: null }
                    : m
                )
              );
              showToast('Sperre aufgehoben.');
            }}
            onForceCheckoutMember={memberId => {
              setMembers(prev =>
                prev.map(m =>
                  m.id === memberId
                    ? {
                        ...m,
                        inHallNow: false,
                        inHallSince: null,
                        inHallUntil: '',
                        inHallExpiresAt: null
                      }
                    : m
                )
              );
              showToast('Spieler aus der Halle ausgecheckt.');
            }}
            onCloseAdmin={() => setAdminViewOpen(false)}
            onLockAdmin={() => {
              setIsAdminUnlocked(false);
              setAdminViewOpen(false);
              showToast('Admin-Modus gesperrt.');
            }}
          />
        ) : (
          <>
            {/* Admin-gesteuerter Club-Hinweis */}
            {clubNotice.active && (
              <div
                className={`rounded-3xl p-4 sm:p-5 border flex items-start justify-between gap-3 ${
                  clubNotice.tone === 'warning'
                    ? 'bg-[#F59E0B]/10 border-[#F59E0B]/35 text-[#FDE68A]'
                    : clubNotice.tone === 'success'
                    ? 'bg-[#10B981]/10 border-[#10B981]/35 text-[#A7F3D0]'
                    : 'bg-[#38BDF8]/10 border-[#38BDF8]/35 text-[#BAE6FD]'
                }`}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 mt-0.5 ${
                      clubNotice.tone === 'warning'
                        ? 'bg-[#F59E0B]/20 text-[#FBBF24]'
                        : clubNotice.tone === 'success'
                        ? 'bg-[#10B981]/20 text-[#34D399]'
                        : 'bg-[#38BDF8]/20 text-[#38BDF8]'
                    }`}
                  >
                    <Info className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    {clubNotice.title && (
                      <h2 className="text-xs sm:text-sm font-bold text-[#F8FAFC]">
                        {clubNotice.title}
                      </h2>
                    )}
                    <p className="text-xs text-[#CBD5E1] mt-0.5 leading-relaxed whitespace-pre-line">
                      {clubNotice.message}
                    </p>
                  </div>
                </div>

                {isAdminUnlocked && (
                  <button
                    type="button"
                    onClick={() => setAdminViewOpen(true)}
                    className="min-h-[34px] px-3 rounded-xl bg-[#11141A]/80 border border-[#282E3B] text-[11px] font-semibold text-[#F8FAFC] shrink-0"
                  >
                    Bearbeiten
                  </button>
                )}
              </div>
            )}

            {/* Echtzeit-Anzeige: Wer ist JETZT gerade in der Halle */}
            {liveInHallMembers.length > 0 && (
              <div className="bg-[#171A21] border border-[#10B981]/35 rounded-3xl p-4 sm:p-5 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#10B981]" />
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-[#F8FAFC]">
                      Jetzt live in der Halle ({liveInHallMembers.length})
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigateToTab('hall')}
                    className="text-xs font-semibold text-[#34D399] hover:underline"
                  >
                    Halle öffnen
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {liveInHallMembers.map(m => {
                    const grp = currentSeason.groups.find(g =>
                      g.memberIds.includes(m.id)
                    );
                    const waUrl = buildWhatsAppLink({
                      opponent: m,
                      sender: myPlayerStats?.member,
                      groupName: grp?.name || 'Verein',
                      seasonName: currentSeason.name
                    });
                    return (
                      <div
                        key={m.id}
                        className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-2xl bg-[#11141A] border border-[#282E3B] text-xs"
                      >
                        <button
                          type="button"
                          onClick={() => {
                            setProfileModalMemberId(m.id);
                            setProfileModalEditInitially(false);
                          }}
                          className="flex items-center gap-2 text-left"
                        >
                          <PlayerAvatar member={m} size="xs" />
                          <div>
                            <span className="font-bold text-[#F8FAFC] block leading-tight">
                              {getDisplayName(m)}
                            </span>
                            <span className="text-[10px] text-[#34D399] block leading-tight">
                              {formatLiveDuration(m.inHallSince)}
                              {m.inHallExpiresAt
                                ? ` · ${formatRemainingHallTime(
                                    m.inHallExpiresAt
                                  )}`
                                : m.inHallUntil
                                ? ` (${m.inHallUntil})`
                                : ''}
                            </span>
                          </div>
                        </button>
                        {waUrl && m.id !== myPlayerId && (
                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            title={`WhatsApp an ${getDisplayName(m)}`}
                            className="p-1.5 rounded-xl bg-[#171A21] text-[#25D366] hover:bg-[#25D366]/15 transition"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Erinnerungs-Banner ab dem 20. des Monats */}
            {isLateMonthReminderActive && (
              <div className="bg-[#171A21] border border-[#F59E0B]/30 rounded-3xl p-4 sm:p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start sm:items-center gap-2.5">
                    <AlertTriangle className="w-5 h-5 text-[#FBBF24] shrink-0 mt-0.5 sm:mt-0" />
                    <div>
                      <p className="text-xs sm:text-sm font-semibold text-[#F8FAFC]">
                        Monatsende-Check ({currentSeason.shortName})
                      </p>
                      <p className="text-[11px] text-[#94A3B8]">
                        Offene Rückmeldungen für {nextSeason.name} &
                        Pflichtspiel-Status vor Monatsabschluss
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigateToTab('nextMonth')}
                    className="min-h-[38px] px-4 rounded-xl bg-[#F59E0B]/15 border border-[#F59E0B]/35 text-[#FBBF24] text-xs font-semibold hover:bg-[#F59E0B]/25 transition w-full sm:w-auto"
                  >
                    Alle Zusagen ansehen
                  </button>
                </div>

                {/* Bereich 1: Offene Rückmeldungen für Folgemonat */}
                {openMembersForNextMonth.length > 0 && (
                  <div className="pt-3 border-t border-[#252B37] space-y-2">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#FBBF24] block">
                      Rückmeldungen für {nextSeason.name} noch offen (
                      {openMembersForNextMonth.length})
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {openMembersForNextMonth.map(m => (
                        <div
                          key={m.id}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#11141A] border border-[#252B37] text-xs"
                        >
                          <button
                            type="button"
                            onClick={() => {
                              setProfileModalMemberId(m.id);
                              setProfileModalEditInitially(false);
                            }}
                            className="font-medium text-[#F8FAFC] hover:text-[#34D399]"
                          >
                            {getDisplayName(m)}
                          </button>
                          {m.id === myPlayerId && (
                            <button
                              type="button"
                              onClick={() =>
                                handleToggleNextMonth(m.id, 'confirmed')
                              }
                              className="px-2 py-0.5 rounded-lg bg-[#10B981] text-[#052016] font-bold text-[10px] hover:bg-[#34D399] transition"
                            >
                              Zusagen
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Bereich 2: Sperre droht wegen fehlender Pflichtspiele */}
                {penaltyAtRiskPlayers.length > 0 && (
                  <div className="pt-3 border-t border-[#252B37] space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-1">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-[#FB7185]">
                        Sperre droht – Pflichtspiele noch offen (
                        {penaltyAtRiskPlayers.length})
                      </span>
                      <span className="text-[11px] text-[#94A3B8]">
                        1 Monat Pause, falls nicht gespielt
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {penaltyAtRiskPlayers.map(item => (
                        <div
                          key={item.member.id}
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#F43F5E]/10 border border-[#F43F5E]/30 text-xs"
                        >
                          <button
                            type="button"
                            onClick={() => {
                              setProfileModalMemberId(item.member.id);
                              setProfileModalEditInitially(false);
                            }}
                            className="font-semibold text-[#FECDD3] hover:text-white"
                          >
                            {getDisplayName(item.member)}
                          </button>
                          <span className="text-[11px] text-[#FDA4AF]">
                            {item.groupName.replace('Gruppe ', 'Gr. ')} ·{' '}
                            {item.played}/{item.requiredMatches} (noch{' '}
                            {item.missing})
                          </span>
                          {item.member.id === myPlayerId && (
                            <button
                              type="button"
                              onClick={() =>
                                setMatchModalData({
                                  groupId: item.groupId,
                                  p1: myPlayerId,
                                  p2: ''
                                })
                              }
                              className="px-2 py-0.5 rounded-lg bg-[#10B981] text-[#052016] font-bold text-[10px] hover:bg-[#34D399] transition"
                            >
                              Spiel eintragen
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

        {/* ==================================================================
            SPIELER-PREVIEW-CARD (MOBILE-FIRST HERO CARD)
           ================================================================== */}
        {myPlayerStats && (
          <section
            aria-label="Dein Spielerprofil"
            className="bg-[#171A21] border border-[#282E3B] rounded-3xl p-5 sm:p-6 shadow-[0_18px_40px_-18px_rgba(0,0,0,0.65)] space-y-5"
          >
            {/* Obere Zeile: grosses Spielerbild & Name */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4 min-w-0">
                <div className="relative shrink-0">
                  <PlayerAvatar member={myPlayerStats.member} size="xl" />
                  <button
                    type="button"
                    onClick={() => {
                      runWithPlayerPin(
                        myPlayerStats.member,
                        'Profilbild bearbeiten',
                        () => {
                          setProfileModalMemberId(myPlayerId);
                          setProfileModalEditInitially(true);
                        }
                      );
                    }}
                    title="Spielerfoto ändern"
                    className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[#10B981] text-[#052016] border-2 border-[#171A21] flex items-center justify-center shadow-md hover:bg-[#34D399] transition"
                  >
                    <Camera className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#34D399] bg-[#10B981]/12 px-2.5 py-0.5 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                      Dein Profil
                    </span>
                    <span className="text-[11px] text-[#94A3B8] font-medium px-2 py-0.5 rounded-full bg-[#11141A] border border-[#252B37]">
                      {myPlayerStats.member.language}
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-bold text-[#F8FAFC] tracking-tight truncate">
                    {getDisplayName(myPlayerStats.member)}
                  </h2>

                  <p className="text-xs sm:text-sm text-[#94A3B8] truncate">
                    {getFullName(myPlayerStats.member)}
                    {myPlayerStats.group ? ` · ${myPlayerStats.group.name}` : ''}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setProfileModalMemberId(myPlayerId);
                  setProfileModalEditInitially(false);
                }}
                className="min-h-[42px] px-3.5 rounded-2xl bg-[#11141A] border border-[#282E3B] hover:border-[#3A4254] text-xs font-semibold text-[#F8FAFC] flex items-center gap-1.5 shrink-0 transition"
              >
                <Edit3 className="w-3.5 h-3.5 text-[#34D399]" />
                <span>Profil</span>
              </button>
            </div>

            {/* 3er Status-Kacheln */}
            <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
              <div className="p-3.5 rounded-2xl bg-[#11141A] border border-[#252B37]">
                <span className="text-[11px] text-[#94A3B8] block">
                  {currentSeason.shortName} Liga
                </span>
                <span className="font-bold text-sm sm:text-base text-[#F8FAFC] mt-1 block truncate">
                  {myPlayerStats.group
                    ? `${myPlayerStats.group.name}${
                        myPlayerStats.standing ? ` · #${myPlayerStats.standing.rank}` : ''
                      }`
                    : 'Pausiert'}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#11141A] border border-[#252B37]">
                <span className="text-[11px] text-[#94A3B8] block">
                  Pflichtspiele
                </span>
                <span
                  className={`font-bold text-sm sm:text-base mt-1 block ${
                    myPlayerStats.standing?.fulfilledQuota
                      ? 'text-[#34D399]'
                      : 'text-[#FBBF24]'
                  }`}
                >
                  {myPlayerStats.standing
                    ? `${myPlayerStats.standing.played}/${myPlayerStats.standing.requiredMatches}`
                    : '—'}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#11141A] border border-[#252B37]">
                <span className="text-[11px] text-[#94A3B8] block">
                  Hallenpräsenz
                </span>
                <span className="font-semibold text-xs sm:text-sm text-[#F8FAFC] mt-1 block truncate">
                  {myPlayerStats.member.trainingDays.join(', ')}
                </span>
              </div>
            </div>

            {/* Sperr-Hinweis & PIN-geschützte Teilnahme Folgemonat */}
            <div className="pt-1 space-y-3">
              {/* Echtzeit Hallen-Check-in ("Jetzt in der Halle") */}
              <div className="p-4 rounded-2xl bg-[#11141A] border border-[#252B37] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#F8FAFC]">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        myPlayerStats.member.inHallNow
                          ? 'bg-[#10B981] animate-pulse'
                          : 'bg-[#475569]'
                      }`}
                    />
                    <span>
                      {myPlayerStats.member.inHallNow
                        ? 'Du bist jetzt live in der Halle'
                        : 'Live-Status: Aktuell nicht in der Halle'}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#94A3B8] pl-4.5">
                    {myPlayerStats.member.inHallNow
                      ? `Eingecheckt ${formatLiveDuration(
                          myPlayerStats.member.inHallSince
                        )}${
                          myPlayerStats.member.inHallExpiresAt
                            ? ` · Auto-Checkout ${formatRemainingHallTime(
                                myPlayerStats.member.inHallExpiresAt
                              )}`
                            : ''
                        }`
                      : 'Markiere dich in Echtzeit – Auto-Checkout erfolgt nach gewählter Dauer.'}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <select
                    aria-label="Wie lange in der Halle"
                    value={
                      myPlayerStats.member.inHallNow
                        ? myPlayerStats.member.inHallUntil || 'ca. 2 Std.'
                        : selectedHallDuration
                    }
                    onChange={e => {
                      const val = e.target.value;
                      setSelectedHallDuration(val);
                      if (myPlayerStats.member.inHallNow) {
                        handleUpdateInHallUntil(myPlayerId, val);
                      }
                    }}
                    className="min-h-[42px] bg-[#171A21] border border-[#282E3B] rounded-2xl px-3 py-2 text-xs font-semibold text-[#F8FAFC] focus:outline-none focus:border-[#10B981]"
                  >
                    {HALL_DURATION_OPTIONS.map(opt => (
                      <option key={opt} value={opt}>
                        {opt} (Auto-Out)
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() =>
                      handleToggleInHallNow(myPlayerId, selectedHallDuration)
                    }
                    className={`min-h-[42px] px-4 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition flex-1 sm:flex-initial ${
                      myPlayerStats.member.inHallNow
                        ? 'bg-[#F43F5E]/15 border border-[#F43F5E]/40 text-[#FB7185] hover:bg-[#F43F5E]/25'
                        : 'bg-[#10B981] text-[#052016] hover:bg-[#34D399]'
                    }`}
                  >
                    <span>
                      {myPlayerStats.member.inHallNow
                        ? 'Auschecken'
                        : 'Jetzt in der Halle'}
                    </span>
                  </button>
                </div>
              </div>

              {myPlayerStats.member.nextMonthStatus === 'blocked' && (
                <div className="p-3.5 rounded-2xl bg-[#F43F5E]/10 border border-[#F43F5E]/30 flex items-start gap-2.5 text-xs text-[#FDA4AF]">
                  <AlertTriangle className="w-4 h-4 text-[#FB7185] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-[#FECDD3]">
                      Für {nextSeason.name} gesperrt:
                    </span>{' '}
                    {myPlayerStats.member.blockedReason ||
                      'Pflichtspiele im Vormonat nicht erreicht (1 Monat Pause).'}
                  </div>
                </div>
              )}

              {!isSeasonClosed &&
                myPlayerStats.standing &&
                !myPlayerStats.standing.fulfilledQuota &&
                myPlayerStats.member.nextMonthStatus !== 'blocked' && (
                  <div className="p-3.5 rounded-2xl bg-[#F59E0B]/10 border border-[#F59E0B]/25 flex items-center gap-2.5 text-xs text-[#FCD34D]">
                    <AlertTriangle className="w-4 h-4 text-[#FBBF24] shrink-0" />
                    <span>
                      Noch{' '}
                      <strong>
                        {myPlayerStats.standing.requiredMatches -
                          myPlayerStats.standing.played}{' '}
                        Pflichtspiel(e)
                      </strong>{' '}
                      offen – sonst folgt 1 Monat Sperre.
                    </span>
                  </div>
                )}

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-2 text-xs text-[#94A3B8]">
                  <Lock className="w-3.5 h-3.5 text-[#34D399] shrink-0" />
                  <span>
                    Teilnahme <strong className="text-[#F8FAFC]">{nextSeason.shortName}</strong>{' '}
                    (mit PIN geschützt)
                  </span>
                </div>

                {myPlayerStats.member.nextMonthStatus === 'blocked' ? (
                  <span className="inline-flex items-center justify-center gap-1.5 min-h-[42px] px-4 rounded-2xl text-xs font-bold bg-[#F43F5E]/15 border border-[#F43F5E]/35 text-[#FB7185] w-full sm:w-auto">
                    <Lock className="w-3.5 h-3.5" />
                    Gesperrt ({nextSeason.shortName})
                  </span>
                ) : (
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                    <div className="grid grid-cols-2 sm:flex items-center bg-[#11141A] border border-[#282E3B] rounded-2xl p-1 gap-1">
                      <button
                        type="button"
                        onClick={() => handleToggleNextMonth(myPlayerId, 'confirmed')}
                        className={`min-h-[40px] px-4 rounded-xl text-xs font-bold transition ${
                          myPlayerStats.member.nextMonthStatus === 'confirmed'
                            ? 'bg-[#10B981] text-[#052016]'
                            : 'text-[#94A3B8] hover:text-[#F8FAFC]'
                        }`}
                      >
                        Dabei
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggleNextMonth(myPlayerId, 'paused')}
                        className={`min-h-[40px] px-4 rounded-xl text-xs font-bold transition ${
                          myPlayerStats.member.nextMonthStatus === 'paused'
                            ? 'bg-[#334155] text-[#F8FAFC]'
                            : 'text-[#94A3B8] hover:text-[#F8FAFC]'
                        }`}
                      >
                        Pausiert
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggleAutoConfirm(myPlayerId)}
                      title="Automatisch jeden Monat dabei, bis du es wieder ausschaltest"
                      className={`min-h-[42px] px-3.5 rounded-2xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition ${
                        myPlayerStats.member.autoConfirm
                          ? 'bg-[#10B981]/15 border-[#10B981]/45 text-[#34D399]'
                          : 'bg-[#11141A] border-[#282E3B] text-[#94A3B8] hover:text-[#F8FAFC]'
                      }`}
                    >
                      <span>∞</span>
                      <span>
                        {myPlayerStats.member.autoConfirm
                          ? 'Immer dabei (aktiv)'
                          : 'Immer dabei'}
                      </span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Offene Spiele & direkter WhatsApp-Kontakt */}
            {!isSeasonClosed && myPlayerStats.openOpponents.length > 0 && (
              <div className="pt-4 border-t border-[#252B37] space-y-2.5">
                <span className="text-xs font-medium text-[#94A3B8] block">
                  Offene Spiele im {currentSeason.shortName} ({myPlayerStats.openOpponents.length})
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {myPlayerStats.openOpponents.map(opp => {
                    const waUrl = buildWhatsAppLink({
                      opponent: opp,
                      sender: myPlayerStats.member,
                      groupName: myPlayerStats.group.name,
                      seasonName: currentSeason.name
                    });
                    return (
                      <div
                        key={opp.id}
                        className="flex items-center justify-between gap-2 p-2.5 rounded-2xl bg-[#11141A] border border-[#252B37]"
                      >
                        <button
                          type="button"
                          onClick={() => {
                            setProfileModalMemberId(opp.id);
                            setProfileModalEditInitially(false);
                          }}
                          className="flex items-center gap-2.5 min-w-0 text-left"
                        >
                          <PlayerAvatar member={opp} size="sm" />
                          <div className="min-w-0">
                            <span className="text-xs font-bold text-[#F8FAFC] truncate block">
                              {getDisplayName(opp)}
                            </span>
                            <span className="text-[11px] text-[#64748B] truncate block">
                              {opp.trainingDays.join(', ')} · {opp.trainingTime || 'Flexibel'}
                            </span>
                          </div>
                        </button>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() =>
                              setMatchModalData({
                                groupId: myPlayerStats.group.id,
                                p1: myPlayerId,
                                p2: opp.id
                              })
                            }
                            className="min-h-[36px] px-3 rounded-xl bg-[#10B981] text-[#052016] text-xs font-bold hover:bg-[#34D399] transition"
                          >
                            Resultat
                          </button>
                          {waUrl && (
                            <a
                              href={waUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              title={`WhatsApp an ${getDisplayName(opp)}`}
                              className="w-9 h-9 rounded-xl bg-[#171A21] border border-[#282E3B] hover:border-[#25D366]/50 text-[#25D366] flex items-center justify-center transition"
                            >
                              <MessageCircle className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </section>
        )}

        {/* ==================================================================
            DESKTOP NAVIGATION TABS & AKTIONEN
           ================================================================== */}
        <div
          ref={tabContentRef}
          className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-1"
        >
          <nav
            aria-label="Hauptnavigation"
            className="hidden sm:flex items-center gap-1 bg-[#171A21] border border-[#252B37] rounded-2xl p-1.5 overflow-x-auto"
          >
            <button
              onClick={() => setActiveTab('groups')}
              className={`min-h-[40px] px-4 rounded-xl text-xs font-bold flex items-center gap-2 transition shrink-0 ${
                activeTab === 'groups'
                  ? 'bg-[#10B981] text-[#052016]'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>Gruppen & Spiele</span>
            </button>
            <button
              onClick={() => setActiveTab('recent')}
              className={`min-h-[40px] px-4 rounded-xl text-xs font-bold flex items-center gap-2 transition shrink-0 ${
                activeTab === 'recent'
                  ? 'bg-[#10B981] text-[#052016]'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Letzte Spiele</span>
            </button>
            <button
              onClick={() => setActiveTab('hall')}
              className={`min-h-[40px] px-4 rounded-xl text-xs font-bold flex items-center gap-2 transition shrink-0 ${
                activeTab === 'hall'
                  ? 'bg-[#10B981] text-[#052016]'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Halle</span>
            </button>
            <button
              onClick={() => setActiveTab('nextMonth')}
              className={`min-h-[40px] px-4 rounded-xl text-xs font-bold flex items-center gap-2 transition shrink-0 ${
                activeTab === 'nextMonth'
                  ? 'bg-[#10B981] text-[#052016]'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              <Check className="w-3.5 h-3.5" />
              <span>Zusagen {nextSeason.shortName}</span>
              {openMembersForNextMonth.length > 0 && (
                <span
                  className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                    activeTab === 'nextMonth'
                      ? 'bg-[#052016] text-[#34D399]'
                      : 'bg-[#F59E0B]/20 text-[#FBBF24]'
                  }`}
                >
                  {openMembersForNextMonth.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('annual')}
              className={`min-h-[40px] px-4 rounded-xl text-xs font-bold flex items-center gap-2 transition shrink-0 ${
                activeTab === 'annual'
                  ? 'bg-[#10B981] text-[#052016]'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Jahreswertung</span>
            </button>
            <button
              onClick={() => setActiveTab('members')}
              className={`min-h-[40px] px-4 rounded-xl text-xs font-bold flex items-center gap-2 transition shrink-0 ${
                activeTab === 'members'
                  ? 'bg-[#10B981] text-[#052016]'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Alle Spieler</span>
            </button>
          </nav>

          {/* Aktions-Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            {!isSeasonClosed && (
              <button
                onClick={() =>
                  setMatchModalData({
                    groupId:
                      myPlayerStats?.group?.id || currentSeason.groups[0]?.id,
                    p1: myPlayerId,
                    p2: ''
                  })
                }
                className="min-h-[44px] px-5 rounded-2xl bg-[#10B981] hover:bg-[#34D399] text-[#052016] text-xs font-bold flex items-center justify-center gap-1.5 transition flex-1 sm:flex-initial"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Spiel eintragen</span>
              </button>
            )}
          </div>
        </div>

        {/* ==================================================================
            TAB-INHALTE
           ================================================================== */}
        {activeTab === 'groups' && (
          <div className="space-y-5">
            {isSeasonClosed && (
              <div className="p-4 rounded-2xl bg-[#171A21] border border-[#252B37] flex items-center justify-between text-xs text-[#94A3B8]">
                <span className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#34D399]" />
                  <span>
                    <strong className="text-[#F8FAFC]">{currentSeason.name}</strong>{' '}
                    ist abgeschlossen.
                  </span>
                </span>
                <button
                  onClick={() =>
                    setSelectedSeasonId(seasons[seasons.length - 1].id)
                  }
                  className="text-[#34D399] font-semibold hover:underline"
                >
                  Zum aktuellen Monat
                </button>
              </div>
            )}

            {currentSeason.groups.map((group, gIdx) => (
              <GroupCard
                key={group.id}
                group={group}
                groupIndex={gIdx}
                totalGroups={currentSeason.groups.length}
                matches={currentSeason.matches.filter(m => m.groupId === group.id)}
                membersMap={membersMap}
                myPlayerId={myPlayerId}
                isSeasonClosed={isSeasonClosed}
                seasonName={currentSeason.name}
                onSelectMember={memberId => {
                  setProfileModalMemberId(memberId);
                  setProfileModalEditInitially(false);
                }}
                onOpenMatchModal={payload => setMatchModalData(payload)}
              />
            ))}
          </div>
        )}

        {activeTab === 'recent' && (
          <RecentMatchesTab
            currentSeason={currentSeason}
            membersMap={membersMap}
            myPlayerId={myPlayerId}
            isSeasonClosed={isSeasonClosed}
            onSelectMember={memberId => {
              setProfileModalMemberId(memberId);
              setProfileModalEditInitially(false);
            }}
            onOpenMatchModal={payload => setMatchModalData(payload)}
          />
        )}

        {activeTab === 'hall' && (
          <HallPresenceTab
            members={members}
            currentSeason={currentSeason}
            myPlayerId={myPlayerId}
            selectedHallDuration={selectedHallDuration}
            onChangeHallDuration={setSelectedHallDuration}
            onToggleInHallNow={handleToggleInHallNow}
            onUpdateInHallUntil={handleUpdateInHallUntil}
            onSelectMember={memberId => {
              setProfileModalMemberId(memberId);
              setProfileModalEditInitially(false);
            }}
          />
        )}

        {activeTab === 'nextMonth' && (
          <NextMonthCommitmentsTab
            members={members}
            nextSeason={nextSeason}
            myPlayerId={myPlayerId}
            onToggleNextMonth={handleToggleNextMonth}
            onToggleAutoConfirm={handleToggleAutoConfirm}
            onSelectMember={memberId => {
              setProfileModalMemberId(memberId);
              setProfileModalEditInitially(false);
            }}
          />
        )}

        {activeTab === 'annual' && (
          <AnnualStandingsTab
            seasons={seasons}
            membersMap={membersMap}
            year={currentSeason.year}
            myPlayerId={myPlayerId}
            onSelectMember={memberId => {
              setProfileModalMemberId(memberId);
              setProfileModalEditInitially(false);
            }}
          />
        )}

        {activeTab === 'members' && (
          <MembersDirectoryTab
            members={members}
            nextSeason={nextSeason}
            isAdminUnlocked={isAdminUnlocked}
            onOpenAddMember={() => setShowAddMemberModal(true)}
            onSelectMember={memberId => {
              setProfileModalMemberId(memberId);
              setProfileModalEditInitially(false);
            }}
          />
        )}
          </>
        )}
      </main>

      {/* ====================================================================
          MOBILE BOTTOM NAVIGATION (FIXED FÜR DAUMEN-BEDIENUNG)
         ==================================================================== */}
      <nav
        aria-label="Mobile Navigation"
        className="sm:hidden fixed bottom-0 inset-x-0 z-30 bg-[#171A21]/95 backdrop-blur-md border-t border-[#252B37] px-1.5 py-1.5 grid grid-cols-6 gap-1"
      >
        <button
          onClick={() => navigateToTab('groups')}
          className={`min-h-[50px] py-1.5 rounded-xl flex flex-col items-center justify-center gap-1 text-[10px] font-semibold transition ${
            activeTab === 'groups'
              ? 'text-[#34D399] bg-[#10B981]/12'
              : 'text-[#94A3B8]'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>Liga</span>
        </button>

        <button
          onClick={() => navigateToTab('recent')}
          className={`min-h-[50px] py-1.5 rounded-xl flex flex-col items-center justify-center gap-1 text-[10px] font-semibold transition ${
            activeTab === 'recent'
              ? 'text-[#34D399] bg-[#10B981]/12'
              : 'text-[#94A3B8]'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Spiele</span>
        </button>

        <button
          onClick={() => navigateToTab('hall')}
          className={`min-h-[50px] py-1.5 rounded-xl flex flex-col items-center justify-center gap-1 text-[10px] font-semibold transition ${
            activeTab === 'hall'
              ? 'text-[#34D399] bg-[#10B981]/12'
              : 'text-[#94A3B8]'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Halle</span>
        </button>

        <button
          onClick={() => navigateToTab('nextMonth')}
          className={`relative min-h-[50px] py-1.5 rounded-xl flex flex-col items-center justify-center gap-1 text-[10px] font-semibold transition ${
            activeTab === 'nextMonth'
              ? 'text-[#34D399] bg-[#10B981]/12'
              : 'text-[#94A3B8]'
          }`}
        >
          <Check className="w-4 h-4" />
          <span>Zusagen</span>
          {openMembersForNextMonth.length > 0 && (
            <span className="absolute top-1.5 right-2.5 w-2 h-2 rounded-full bg-[#F59E0B]" />
          )}
        </button>

        <button
          onClick={() => navigateToTab('annual')}
          className={`min-h-[50px] py-1.5 rounded-xl flex flex-col items-center justify-center gap-1 text-[10px] font-semibold transition ${
            activeTab === 'annual'
              ? 'text-[#34D399] bg-[#10B981]/12'
              : 'text-[#94A3B8]'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Jahres</span>
        </button>

        <button
          onClick={() => navigateToTab('members')}
          className={`min-h-[50px] py-1.5 rounded-xl flex flex-col items-center justify-center gap-1 text-[10px] font-semibold transition ${
            activeTab === 'members'
              ? 'text-[#34D399] bg-[#10B981]/12'
              : 'text-[#94A3B8]'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Spieler</span>
        </button>
      </nav>

      {/* ====================================================================
          MODALS & TOAST
         ==================================================================== */}
      {playerPickerOpen && (
        <div className="sm:hidden fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end justify-center">
          <div
            className="fixed inset-0"
            onClick={() => setPlayerPickerOpen(false)}
          />
          <div className="relative z-10 w-full bg-[#171A21] border-t border-[#2C3342] rounded-t-3xl shadow-2xl flex flex-col max-h-[82dvh] overflow-hidden">
            <div className="w-10 h-1 rounded-full bg-[#2E3545] mx-auto mt-2.5 shrink-0" />

            <div className="p-4 border-b border-[#252B37] space-y-2.5 shrink-0">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[#94A3B8]">
                  Spielerprofil wechseln ({members.length})
                </span>
                <button
                  type="button"
                  onClick={() => setPlayerPickerOpen(false)}
                  aria-label="Auswahl schliessen"
                  className="w-8 h-8 rounded-xl bg-[#11141A] flex items-center justify-center text-[#94A3B8] hover:text-[#F8FAFC]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="relative">
                <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={playerPickerQuery}
                  onChange={e => setPlayerPickerQuery(e.target.value)}
                  placeholder="Name oder Spielername suchen..."
                  className="w-full min-h-[44px] pl-10 pr-10 py-2 rounded-2xl bg-[#11141A] border border-[#282E3B] text-sm text-[#F8FAFC] placeholder:text-[#64748B] focus:outline-none focus:border-[#10B981]"
                />
                {playerPickerQuery && (
                  <button
                    type="button"
                    onClick={() => setPlayerPickerQuery('')}
                    aria-label="Suche löschen"
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#64748B] hover:text-[#F8FAFC]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="overflow-y-auto divide-y divide-[#252B37]/60 pb-8">
              {filteredHeaderMembers.length === 0 ? (
                <div className="px-4 py-8 text-center text-xs text-[#94A3B8]">
                  Kein Spieler gefunden.
                </div>
              ) : (
                filteredHeaderMembers.map(m => {
                  const isCurrent = m.id === myPlayerId;
                  return (
                    <div
                      key={m.id}
                      className={`px-4 py-3 flex items-center justify-between gap-2.5 transition ${
                        isCurrent ? 'bg-[#10B981]/10' : 'active:bg-[#1E222B]'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setMyPlayerId(m.id);
                          setPlayerPickerOpen(false);
                          setPlayerPickerQuery('');
                        }}
                        className="flex items-center gap-3 min-w-0 flex-1 text-left"
                      >
                        <PlayerAvatar member={m} size="sm" />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-bold text-[#F8FAFC] truncate">
                              {getDisplayName(m)}
                            </span>
                            {isCurrent && (
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#10B981]/20 text-[#34D399] shrink-0">
                                Aktiv
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-[#64748B] truncate mt-0.5">
                            {getFullName(m)}
                          </div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setProfileModalMemberId(m.id);
                          setProfileModalEditInitially(false);
                          setPlayerPickerOpen(false);
                          setPlayerPickerQuery('');
                        }}
                        className="min-h-[38px] px-3.5 rounded-xl bg-[#11141A] border border-[#282E3B] text-xs font-semibold text-[#94A3B8] hover:text-[#F8FAFC] shrink-0 transition"
                      >
                        Profil
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {matchModalData && (
        <MatchEntryModal
          season={currentSeason}
          initialData={matchModalData}
          membersMap={membersMap}
          isAdminUnlocked={isAdminUnlocked}
          onClose={() => setMatchModalData(null)}
          onSave={handleSaveMatch}
        />
      )}

      {profileModalMemberId && membersMap[profileModalMemberId] && (
        <PlayerProfileModal
          member={membersMap[profileModalMemberId]}
          myPlayerId={myPlayerId}
          myPlayer={membersMap[myPlayerId]}
          nextSeason={nextSeason}
          seasons={seasons}
          isUnlocked={Boolean(
            isAdminUnlocked || unlockedPlayerIds[profileModalMemberId]
          )}
          initialEditing={profileModalEditInitially}
          onRequestUnlock={() => {
            const target = membersMap[profileModalMemberId];
            if (!target) return;
            runWithPlayerPin(target, 'Profil bearbeiten', () => {});
          }}
          onToggleNextMonth={handleToggleNextMonth}
          onToggleAutoConfirm={handleToggleAutoConfirm}
          onClose={() => {
            setProfileModalMemberId(null);
            setProfileModalEditInitially(false);
          }}
          onSave={handleUpdateMember}
        />
      )}

      {showAddMemberModal && (
        <AddMemberModal
          onClose={() => setShowAddMemberModal(false)}
          onCreate={handleCreateMember}
        />
      )}

      {showRolloverModal && (
        <RolloverModal
          currentSeason={currentSeason}
          nextSeason={nextSeason}
          members={members}
          membersMap={membersMap}
          onClose={() => setShowRolloverModal(false)}
          onConfirm={handleRolloverMonth}
        />
      )}

      {pinPrompt && (
        <PinPromptModal
          prompt={pinPrompt}
          onClose={() => setPinPrompt(null)}
        />
      )}

      {toastMessage && (
        <div className="fixed bottom-24 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#1E222B] border border-[#10B981]/40 text-[#F8FAFC] px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 text-xs font-semibold max-w-[92vw]">
          <Check className="w-4 h-4 text-[#34D399] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// SEPARATER ADMIN-BEREICH (MONATSABSCHLUSS, HINWEISE, MITGLIEDER)
// ============================================================================

function AdminDashboardView({
  currentSeason,
  nextSeason,
  isSeasonClosed,
  members,
  openMembersForNextMonth,
  liveInHallMembers,
  previewLateMonth,
  onTogglePreviewLateMonth,
  clubNotice,
  onUpdateClubNotice,
  onOpenRollover,
  onOpenAddMember,
  onUnblockMember,
  onForceCheckoutMember,
  onCloseAdmin,
  onLockAdmin
}) {
  const [noticeDraft, setNoticeDraft] = useState(clubNotice);

  useEffect(() => {
    setNoticeDraft(clubNotice);
  }, [clubNotice]);

  const blockedMembers = useMemo(
    () => members.filter(m => m.nextMonthStatus === 'blocked'),
    [members]
  );

  const handleNoticeSubmit = e => {
    e.preventDefault();
    onUpdateClubNotice(noticeDraft);
  };

  return (
    <div className="space-y-5">
      {/* Kopfzeile Admin-Bereich */}
      <div className="bg-[#171A21] border border-[#10B981]/35 rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#34D399] bg-[#10B981]/12 px-2.5 py-0.5 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Vorstand & Liga-Leitung</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#F8FAFC]">
            Admin-Bereich
          </h2>
          <p className="text-xs text-[#94A3B8]">
            Monatsabschluss ausführen, Hinweise für alle Spieler einblenden und
            Mitglieder verwalten
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onCloseAdmin}
            className="min-h-[42px] px-4 rounded-2xl bg-[#11141A] border border-[#282E3B] hover:border-[#3A4254] text-xs font-semibold text-[#F8FAFC] transition flex-1 sm:flex-initial"
          >
            Zurück zur Liga
          </button>
          <button
            type="button"
            onClick={onLockAdmin}
            className="min-h-[42px] px-4 rounded-2xl bg-[#F43F5E]/15 border border-[#F43F5E]/35 text-xs font-semibold text-[#FB7185] flex items-center justify-center gap-1.5 transition"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Sperren</span>
          </button>
        </div>
      </div>

      {/* Schnellaktionen: Monatsabschluss, Neuer Spieler, Reminder-Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Karte 1: Monat abschliessen */}
        <div className="bg-[#171A21] border border-[#252B37] rounded-3xl p-5 flex flex-col justify-between gap-4">
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#34D399]">
              Saison-Wechsel
            </span>
            <h3 className="font-bold text-base text-[#F8FAFC]">
              {currentSeason.name} abschliessen
            </h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Auf- und Abstieg berechnen, Pflichtspiel-Sperren prüfen und die
              Gruppen für <strong>{nextSeason.name}</strong> auslosen.
            </p>
          </div>

          <button
            type="button"
            disabled={isSeasonClosed}
            onClick={onOpenRollover}
            className={`min-h-[44px] px-4 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
              isSeasonClosed
                ? 'bg-[#11141A] border border-[#252B37] text-[#64748B] cursor-not-allowed'
                : 'bg-[#10B981] hover:bg-[#34D399] text-[#052016]'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>
              {isSeasonClosed
                ? 'Monat bereits abgeschlossen'
                : `${nextSeason.shortName} auslosen`}
            </span>
          </button>
        </div>

        {/* Karte 2: Reminder-Banner steuern */}
        <div className="bg-[#171A21] border border-[#252B37] rounded-3xl p-5 flex flex-col justify-between gap-4">
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#FBBF24]">
              Rückmelde-Reminder
            </span>
            <h3 className="font-bold text-base text-[#F8FAFC]">
              Zusagen-Banner ({openMembersForNextMonth.length} offen)
            </h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Erscheint automatisch ab dem 20. des Monats. Hier kannst du das
              Banner sofort für alle sichtbar schalten oder testen.
            </p>
          </div>

          <button
            type="button"
            onClick={onTogglePreviewLateMonth}
            className={`min-h-[44px] px-4 rounded-2xl text-xs font-bold border transition ${
              previewLateMonth
                ? 'bg-[#F59E0B] text-[#1C1202] border-[#F59E0B]'
                : 'bg-[#11141A] border-[#282E3B] text-[#F8FAFC] hover:border-[#F59E0B]/50'
            }`}
          >
            {previewLateMonth
              ? 'Reminder aktiv (ausblenden)'
              : 'Reminder jetzt einblenden'}
          </button>
        </div>

        {/* Karte 3: Neues Mitglied aufnehmen */}
        <div className="bg-[#171A21] border border-[#252B37] rounded-3xl p-5 flex flex-col justify-between gap-4">
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#38BDF8]">
              Kader & Mitglieder
            </span>
            <h3 className="font-bold text-base text-[#F8FAFC]">
              Neuen Spieler aufnehmen
            </h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Neues Clubmitglied mit persönlicher 4-stelliger PIN anlegen und
              direkt in die unterste Gruppe aufnehmen.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenAddMember}
            className="min-h-[44px] px-4 rounded-2xl bg-[#11141A] border border-[#282E3B] hover:border-[#10B981]/50 text-xs font-bold text-[#F8FAFC] flex items-center justify-center gap-1.5 transition"
          >
            <Plus className="w-4 h-4 text-[#34D399]" />
            <span>Spieler hinzufügen ({members.length})</span>
          </button>
        </div>
      </div>

      {/* Hinweise / Club-Ankündigung für alle einblenden */}
      <section className="bg-[#171A21] border border-[#252B37] rounded-3xl p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-base text-[#F8FAFC]">
              Club-Hinweis auf der Startseite einblenden
            </h3>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              Wird oben auf der Liga-Startseite für alle Spieler sichtbar
              angezeigt (z. B. Hallenschliessung, Turnier-Info, Fristen)
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              const next = { ...noticeDraft, active: !noticeDraft.active };
              setNoticeDraft(next);
              onUpdateClubNotice(next);
            }}
            className={`min-h-[40px] px-4 rounded-2xl text-xs font-bold transition self-start sm:self-auto ${
              noticeDraft.active
                ? 'bg-[#10B981] text-[#052016]'
                : 'bg-[#11141A] border border-[#282E3B] text-[#94A3B8]'
            }`}
          >
            {noticeDraft.active ? 'Hinweis ist eingeblendet' : 'Hinweis ist aus'}
          </button>
        </div>

        <form onSubmit={handleNoticeSubmit} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs text-[#94A3B8] mb-1">
                Titel des Hinweises
              </label>
              <input
                type="text"
                value={noticeDraft.title}
                onChange={e =>
                  setNoticeDraft({ ...noticeDraft, title: e.target.value })
                }
                placeholder="z. B. Halle am Freitag erst ab 19:30 offen"
                className="w-full min-h-[42px] bg-[#11141A] border border-[#282E3B] rounded-2xl px-3.5 py-2 text-sm text-[#F8FAFC] focus:outline-none focus:border-[#10B981]"
              />
            </div>

            <div>
              <label className="block text-xs text-[#94A3B8] mb-1">
                Darstellung
              </label>
              <select
                value={noticeDraft.tone}
                onChange={e =>
                  setNoticeDraft({ ...noticeDraft, tone: e.target.value })
                }
                className="w-full min-h-[42px] bg-[#11141A] border border-[#282E3B] rounded-2xl px-3.5 py-2 text-sm text-[#F8FAFC] focus:outline-none focus:border-[#10B981]"
              >
                <option value="info">Info (Blau)</option>
                <option value="warning">Wichtig / Warnung (Gelb)</option>
                <option value="success">Positiv / Event (Grün)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs text-[#94A3B8] mb-1">
              Nachrichtentext
            </label>
            <textarea
              rows={2}
              value={noticeDraft.message}
              onChange={e =>
                setNoticeDraft({ ...noticeDraft, message: e.target.value })
              }
              placeholder="Kurze Mitteilung für alle Clubmitglieder..."
              className="w-full bg-[#11141A] border border-[#282E3B] rounded-2xl px-3.5 py-2.5 text-sm text-[#F8FAFC] focus:outline-none focus:border-[#10B981]"
            />
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2">
            {noticeDraft.active && (
              <button
                type="button"
                onClick={() => {
                  const next = { ...noticeDraft, active: false };
                  setNoticeDraft(next);
                  onUpdateClubNotice(next);
                }}
                className="min-h-[40px] px-4 rounded-2xl bg-[#11141A] border border-[#282E3B] text-xs font-semibold text-[#94A3B8] hover:text-[#F8FAFC]"
              >
                Ausblenden
              </button>
            )}
            <button
              type="submit"
              onClick={() =>
                setNoticeDraft(prev => ({ ...prev, active: true }))
              }
              className="min-h-[40px] px-5 rounded-2xl bg-[#10B981] hover:bg-[#34D399] text-[#052016] text-xs font-bold"
            >
              Speichern & einblenden
            </button>
          </div>
        </form>
      </section>

      {/* Gesperrte Spieler & aktive Live-Check-ins */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <section className="bg-[#171A21] border border-[#252B37] rounded-3xl p-5 space-y-3">
          <h3 className="font-bold text-sm text-[#F8FAFC]">
            Gesperrte Spieler ({blockedMembers.length})
          </h3>
          {blockedMembers.length === 0 ? (
            <p className="text-xs text-[#64748B]">
              Aktuell ist kein Spieler gesperrt.
            </p>
          ) : (
            <div className="space-y-2">
              {blockedMembers.map(m => (
                <div
                  key={m.id}
                  className="p-3 rounded-2xl bg-[#11141A] border border-[#252B37] flex items-center justify-between gap-2 text-xs"
                >
                  <div className="min-w-0">
                    <div className="font-bold text-[#F8FAFC] truncate">
                      {getDisplayName(m)}
                    </div>
                    <div className="text-[#94A3B8] truncate">
                      {m.blockedReason || 'Pflichtspiel-Sperre'}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onUnblockMember(m.id)}
                    className="min-h-[34px] px-3 rounded-xl bg-[#10B981]/15 border border-[#10B981]/35 text-[#34D399] font-semibold shrink-0"
                  >
                    Entsperren
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="bg-[#171A21] border border-[#252B37] rounded-3xl p-5 space-y-3">
          <h3 className="font-bold text-sm text-[#F8FAFC]">
            Live in der Halle ({liveInHallMembers.length})
          </h3>
          {liveInHallMembers.length === 0 ? (
            <p className="text-xs text-[#64748B]">
              Niemand aktuell in der Halle eingecheckt.
            </p>
          ) : (
            <div className="space-y-2">
              {liveInHallMembers.map(m => (
                <div
                  key={m.id}
                  className="p-3 rounded-2xl bg-[#11141A] border border-[#252B37] flex items-center justify-between gap-2 text-xs"
                >
                  <div className="min-w-0">
                    <div className="font-bold text-[#F8FAFC] truncate">
                      {getDisplayName(m)}
                    </div>
                    <div className="text-[#34D399] truncate">
                      {formatLiveDuration(m.inHallSince)} ·{' '}
                      {m.inHallUntil || 'Aktiv'}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onForceCheckoutMember(m.id)}
                    className="min-h-[34px] px-3 rounded-xl bg-[#F43F5E]/15 border border-[#F43F5E]/35 text-[#FB7185] font-semibold shrink-0"
                  >
                    Auschecken
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

// ============================================================================
// KOMPONENTE: SPIELER-AVATAR MIT BILD ODER INITIALEN
// ============================================================================

function PlayerAvatar({ member, size = 'md' }) {
  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px] rounded-lg',
    sm: 'w-10 h-10 text-xs rounded-2xl',
    md: 'w-12 h-12 text-sm rounded-2xl',
    lg: 'w-20 h-20 text-xl rounded-3xl',
    xl: 'w-24 h-24 sm:w-28 sm:h-28 text-2xl sm:text-3xl rounded-3xl'
  }[size];

  if (member?.avatarUrl) {
    return (
      <img
        src={member.avatarUrl}
        alt={getDisplayName(member)}
        className={`${sizeClasses} object-cover object-center border border-[#2C3342] bg-[#11141A] shadow-inner shrink-0`}
      />
    );
  }

  return (
    <div
      className={`${sizeClasses} bg-gradient-to-br from-[#232936] to-[#141820] border border-[#2E3646] text-[#F8FAFC] font-bold flex items-center justify-center shrink-0 select-none`}
    >
      {getInitials(member)}
    </div>
  );
}

// ============================================================================
// KOMPONENTE: GRUPPENKARTE (TABELLE + MATRIX + SPIELE)
// ============================================================================

function GroupCard({
  group,
  groupIndex,
  totalGroups,
  matches,
  membersMap,
  myPlayerId,
  isSeasonClosed,
  seasonName,
  onSelectMember,
  onOpenMatchModal
}) {
  const [expanded, setExpanded] = useState(false);

  const standings = useMemo(
    () => computeGroupStandings(group, matches, membersMap),
    [group, matches, membersMap]
  );

  const { promoCount, relegCount } = useMemo(
    () =>
      getPromotionRelegationSlots(
        standings.length,
        groupIndex,
        totalGroups
      ),
    [standings.length, groupIndex, totalGroups]
  );

  const totalPossibleMatches =
    (group.memberIds.length * (group.memberIds.length - 1)) / 2;
  const mult = GROUP_MULTIPLIERS[groupIndex] ?? 0.9;

  return (
    <section className="bg-[#171A21] border border-[#252B37] rounded-3xl overflow-hidden">
      {/* Gruppen-Kopfzeile */}
      <div className="px-5 py-4 border-b border-[#252B37] flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 flex-wrap">
          <h3 className="font-bold text-base sm:text-lg text-[#F8FAFC]">
            {group.name}
          </h3>
          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#10B981]/12 text-[#34D399]">
            Faktor ×{mult}
          </span>
          <span className="text-xs text-[#94A3B8]">
            {matches.length}/{totalPossibleMatches} Spiele
          </span>
        </div>

        <button
          onClick={() => setExpanded(prev => !prev)}
          className="min-h-[38px] px-3 rounded-xl bg-[#11141A] border border-[#252B37] hover:border-[#3A4254] text-xs font-semibold text-[#94A3B8] hover:text-[#F8FAFC] flex items-center gap-1.5 transition"
        >
          <span>{expanded ? 'Weniger' : 'Kreuztabelle & Spiele'}</span>
          {expanded ? (
            <ChevronUp className="w-3.5 h-3.5" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      {/* Kompakte Tabelle */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-[11px] uppercase tracking-wider text-[#64748B] border-b border-[#252B37]">
              <th className="py-3 pl-5 pr-2 w-10">#</th>
              <th className="py-3 px-2">Spieler</th>
              <th className="py-3 px-2 text-center">Sp.</th>
              <th className="py-3 px-2 text-center hidden sm:table-cell">S / N</th>
              <th className="py-3 px-2 text-center hidden sm:table-cell">Sätze</th>
              <th className="py-3 pl-2 pr-5 text-right">Pkt</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#252B37]/60 text-sm">
            {standings.map((row, idx) => {
              const isMe = row.memberId === myPlayerId;
              const isPromotionZone = promoCount > 0 && idx < promoCount;
              const isRelegationZone =
                relegCount > 0 && idx >= standings.length - relegCount;

              return (
                <tr
                  key={row.memberId}
                  className={`transition-colors ${
                    isMe ? 'bg-[#10B981]/[0.07]' : 'hover:bg-[#1C2029]'
                  }`}
                >
                  <td className="py-3.5 pl-5 pr-2 font-bold text-xs relative">
                    {isPromotionZone && (
                      <span
                        title="Aufstiegsplatz"
                        className="absolute left-0 top-2 bottom-2 w-1 bg-[#10B981] rounded-r"
                      />
                    )}
                    {isRelegationZone && (
                      <span
                        title="Abstiegsplatz"
                        className="absolute left-0 top-2 bottom-2 w-1 bg-[#F43F5E] rounded-r"
                      />
                    )}
                    <span
                      className={
                        isPromotionZone
                          ? 'text-[#34D399]'
                          : isRelegationZone
                          ? 'text-[#FB7185]'
                          : 'text-[#94A3B8]'
                      }
                    >
                      {row.rank}
                    </span>
                  </td>

                  <td className="py-3.5 px-2">
                    <button
                      onClick={() => onSelectMember(row.memberId)}
                      className="flex items-center gap-3 text-left group min-h-[36px]"
                    >
                      <PlayerAvatar member={row.member} size="sm" />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-semibold text-[#F8FAFC] group-hover:text-[#34D399] transition truncate">
                            {getDisplayName(row.member)}
                          </span>
                          {getFullName(row.member) &&
                            getFullName(row.member) !==
                              getDisplayName(row.member) && (
                              <span className="text-[11px] font-normal text-[#64748B] truncate">
                                ({getFullName(row.member)})
                              </span>
                            )}
                          <span
                            title="Spieler-Infos öffnen"
                            className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#11141A] border border-[#282E3B] text-[#94A3B8] group-hover:border-[#10B981]/50 group-hover:text-[#34D399] transition shrink-0"
                          >
                            <Info className="w-2.5 h-2.5" />
                          </span>
                          {isMe && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#10B981]/15 text-[#34D399]">
                              Du
                            </span>
                          )}
                          {row.member?.nextMonthStatus === 'blocked' && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#F43F5E]/15 text-[#FB7185]">
                              Gesperrt
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-[#64748B] sm:hidden mt-0.5">
                          Sätze {row.setsWon}:{row.setsLost}
                        </div>
                      </div>
                    </button>
                  </td>

                  <td className="py-3.5 px-2 text-center text-xs">
                    <span
                      className={`inline-flex items-center justify-center px-2 py-0.5 rounded-lg font-semibold ${
                        row.fulfilledQuota
                          ? 'bg-[#10B981]/15 text-[#34D399]'
                          : 'bg-[#F59E0B]/15 text-[#FBBF24]'
                      }`}
                    >
                      {row.played}/{row.requiredMatches}
                    </span>
                  </td>

                  <td className="py-3.5 px-2 text-center text-xs text-[#94A3B8] hidden sm:table-cell">
                    {row.wins} / {row.losses}
                  </td>

                  <td className="py-3.5 px-2 text-center text-xs text-[#94A3B8] hidden sm:table-cell">
                    {row.setsWon}:{row.setsLost}
                  </td>

                  <td className="py-3.5 pl-2 pr-5 text-right font-bold text-[#F8FAFC]">
                    {row.matchPoints}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Auf-/Abstiegs-Legende */}
      <div className="px-5 py-2.5 bg-[#11141A]/70 border-t border-[#252B37] flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#64748B]">
        <div className="flex items-center gap-3">
          {promoCount > 0 && (
            <span className="flex items-center gap-1.5 text-[#34D399]">
              <span className="w-2 h-2 rounded-full bg-[#10B981]" />
              {promoCount === 2 ? 'Top 2 Aufstieg' : 'Aufstieg'}
            </span>
          )}
          {relegCount > 0 && (
            <span className="flex items-center gap-1.5 text-[#FB7185]">
              <span className="w-2 h-2 rounded-full bg-[#F43F5E]" />
              {relegCount === 2 ? 'Letzte 2 Abstieg' : 'Abstieg'}
            </span>
          )}
        </div>
        <span>3 Pkt Sieg · 1 Pkt bei 2:3</span>
      </div>

      {/* Erweiterter Bereich: Kreuztabelle & Spieleliste */}
      {expanded && (
        <div className="p-5 bg-[#11141A] border-t border-[#252B37] space-y-5">
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8] mb-2.5">
              Kreuztabelle (Antippen zum Eintragen)
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr>
                    <th className="p-2 text-left text-[#64748B] font-medium">
                      Spieler
                    </th>
                    {standings.map(col => (
                      <th
                        key={col.memberId}
                        className="p-2 text-center text-[#94A3B8] font-semibold min-w-[68px]"
                      >
                        {getDisplayName(col.member).slice(0, 9)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {standings.map(row => (
                    <tr
                      key={row.memberId}
                      className="border-t border-[#252B37]"
                    >
                      <td className="p-2 font-semibold text-[#F8FAFC] whitespace-nowrap">
                        {getDisplayName(row.member)}
                      </td>
                      {standings.map(col => {
                        if (row.memberId === col.memberId) {
                          return (
                            <td
                              key={col.memberId}
                              className="p-2 text-center bg-[#171A21] text-[#475569]"
                            >
                              —
                            </td>
                          );
                        }
                        const match = matches.find(
                          m =>
                            (m.p1 === row.memberId && m.p2 === col.memberId) ||
                            (m.p1 === col.memberId && m.p2 === row.memberId)
                        );
                        if (!match) {
                          return (
                            <td key={col.memberId} className="p-1.5 text-center">
                              {!isSeasonClosed ? (
                                <button
                                  onClick={() =>
                                    onOpenMatchModal({
                                      groupId: group.id,
                                      p1: row.memberId,
                                      p2: col.memberId
                                    })
                                  }
                                  className="w-full min-h-[34px] rounded-xl border border-dashed border-[#282E3B] hover:border-[#10B981]/60 text-[#64748B] hover:text-[#34D399] transition"
                                >
                                  +
                                </button>
                              ) : (
                                <span className="text-[#475569]">Offen</span>
                              )}
                            </td>
                          );
                        }
                        const isP1 = match.p1 === row.memberId;
                        const mySets = isP1 ? match.s1 : match.s2;
                        const oppSets = isP1 ? match.s2 : match.s1;
                        const won = mySets > oppSets;
                        return (
                          <td key={col.memberId} className="p-1.5 text-center">
                            <button
                              disabled={isSeasonClosed}
                              onClick={() =>
                                onOpenMatchModal({
                                  groupId: group.id,
                                  matchId: match.id,
                                  p1: match.p1,
                                  p2: match.p2,
                                  s1: match.s1,
                                  s2: match.s2
                                })
                              }
                              className={`w-full min-h-[34px] rounded-xl font-bold ${
                                won
                                  ? 'bg-[#10B981]/15 text-[#34D399]'
                                  : 'bg-[#F43F5E]/15 text-[#FB7185]'
                              }`}
                            >
                              {mySets}:{oppSets}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Gespielte Partien */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8] mb-2">
              Gespielte Partien ({matches.length})
            </h4>
            {matches.length === 0 ? (
              <p className="text-xs text-[#64748B]">Noch keine Spiele erfasst.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {matches.map(m => {
                  const p1 = membersMap[m.p1];
                  const p2 = membersMap[m.p2];
                  const p1Won = m.s1 > m.s2;
                  return (
                    <div
                      key={m.id}
                      className="flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-[#171A21] border border-[#252B37] text-xs"
                    >
                      <div className="flex items-center gap-1.5 truncate">
                        <span
                          className={
                            p1Won
                              ? 'font-bold text-[#F8FAFC]'
                              : 'text-[#94A3B8]'
                          }
                        >
                          {getDisplayName(p1)}
                        </span>
                        <span className="text-[#475569]">vs</span>
                        <span
                          className={
                            !p1Won
                              ? 'font-bold text-[#F8FAFC]'
                              : 'text-[#94A3B8]'
                          }
                        >
                          {getDisplayName(p2)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="font-bold text-[#34D399]">
                          {m.s1}:{m.s2}
                        </span>
                        {!isSeasonClosed && (
                          <button
                            onClick={() =>
                              onOpenMatchModal({
                                groupId: group.id,
                                matchId: m.id,
                                p1: m.p1,
                                p2: m.p2,
                                s1: m.s1,
                                s2: m.s2
                              })
                            }
                            className="p-1.5 text-[#64748B] hover:text-[#F8FAFC]"
                            title="Bearbeiten"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

// ============================================================================
// TAB: ZULETZT ABSOLVIERTE GAMES
// ============================================================================

function RecentMatchesTab({
  currentSeason,
  membersMap,
  myPlayerId,
  isSeasonClosed,
  onSelectMember,
  onOpenMatchModal
}) {
  const [filterMode, setFilterMode] = useState('ALL'); // 'ALL' | 'MINE'
  const [selectedGroupId, setSelectedGroupId] = useState('ALL');

  const groupMap = useMemo(() => {
    const map = {};
    currentSeason.groups.forEach(g => {
      map[g.id] = g;
    });
    return map;
  }, [currentSeason.groups]);

  const sortedMatches = useMemo(() => {
    return [...currentSeason.matches]
      .map((m, idx) => ({ ...m, _order: idx }))
      .filter(m => {
        if (
          filterMode === 'MINE' &&
          m.p1 !== myPlayerId &&
          m.p2 !== myPlayerId
        ) {
          return false;
        }
        if (selectedGroupId !== 'ALL' && m.groupId !== selectedGroupId) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        const dateA = a.playedAt || '';
        const dateB = b.playedAt || '';
        if (dateB !== dateA) return dateB.localeCompare(dateA);
        return b._order - a._order;
      });
  }, [currentSeason.matches, filterMode, selectedGroupId, myPlayerId]);

  const formatPlayedDate = isoDate => {
    if (!isoDate) return 'Datum unbekannt';
    const parts = isoDate.split('-');
    if (parts.length !== 3) return isoDate;
    return `${parts[2]}.${parts[1]}.${parts[0]}`;
  };

  return (
    <div className="space-y-4">
      <div className="bg-[#171A21] border border-[#252B37] rounded-3xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-bold text-base text-[#F8FAFC]">
              Zuletzt gespielte Partien ({currentSeason.name})
            </h2>
            <p className="text-xs text-[#94A3B8] mt-1">
              Chronologische Übersicht aller zuletzt gemeldeten Spiele
            </p>
          </div>

          <div className="grid grid-cols-2 sm:flex items-center bg-[#11141A] border border-[#252B37] rounded-2xl p-1 gap-1 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setFilterMode('ALL')}
              className={`min-h-[38px] px-3.5 rounded-xl text-xs font-bold transition ${
                filterMode === 'ALL'
                  ? 'bg-[#10B981] text-[#052016]'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              Alle ({currentSeason.matches.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('MINE')}
              className={`min-h-[38px] px-3.5 rounded-xl text-xs font-bold transition ${
                filterMode === 'MINE'
                  ? 'bg-[#10B981] text-[#052016]'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              Meine Spiele
            </button>
          </div>
        </div>

        {/* Gruppen-Schnellfilter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setSelectedGroupId('ALL')}
            className={`min-h-[36px] px-3.5 rounded-xl text-xs font-semibold shrink-0 transition ${
              selectedGroupId === 'ALL'
                ? 'bg-[#10B981] text-[#052016]'
                : 'bg-[#11141A] border border-[#252B37] text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            Alle Gruppen
          </button>
          {currentSeason.groups.map(grp => (
            <button
              key={grp.id}
              type="button"
              onClick={() => setSelectedGroupId(grp.id)}
              className={`min-h-[36px] px-3.5 rounded-xl text-xs font-semibold shrink-0 transition ${
                selectedGroupId === grp.id
                  ? 'bg-[#10B981] text-[#052016]'
                  : 'bg-[#11141A] border border-[#252B37] text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              {grp.name}
            </button>
          ))}
        </div>
      </div>

      {/* Spiele-Liste */}
      {sortedMatches.length === 0 ? (
        <div className="bg-[#171A21] border border-[#252B37] rounded-3xl p-8 text-center text-xs text-[#94A3B8]">
          Keine gespielten Partien für diesen Filter vorhanden.
        </div>
      ) : (
        <div className="space-y-2.5">
          {sortedMatches.map(match => {
            const p1 = membersMap[match.p1];
            const p2 = membersMap[match.p2];
            const group = groupMap[match.groupId];
            const p1Won = match.s1 > match.s2;
            const isMyMatch =
              match.p1 === myPlayerId || match.p2 === myPlayerId;

            return (
              <div
                key={match.id}
                className={`bg-[#171A21] border rounded-3xl p-4 sm:px-5 transition ${
                  isMyMatch
                    ? 'border-[#10B981]/35 bg-[#10B981]/[0.04]'
                    : 'border-[#252B37]'
                }`}
              >
                <div className="flex items-center justify-between gap-2 text-[11px] text-[#94A3B8] mb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold px-2.5 py-0.5 rounded-full bg-[#11141A] border border-[#252B37] text-[#F8FAFC]">
                      {group?.name || 'Liga'}
                    </span>
                    <span>{formatPlayedDate(match.playedAt)}</span>
                    {isMyMatch && (
                      <span className="font-semibold px-2 py-0.5 rounded-full bg-[#10B981]/15 text-[#34D399]">
                        Dein Spiel
                      </span>
                    )}
                  </div>

                  {!isSeasonClosed && (
                    <button
                      type="button"
                      onClick={() =>
                        onOpenMatchModal({
                          groupId: match.groupId,
                          matchId: match.id,
                          p1: match.p1,
                          p2: match.p2,
                          s1: match.s1,
                          s2: match.s2
                        })
                      }
                      className="min-h-[32px] px-2.5 rounded-xl bg-[#11141A] border border-[#252B37] text-[#94A3B8] hover:text-[#F8FAFC] flex items-center gap-1 transition"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Bearbeiten</span>
                    </button>
                  )}
                </div>

                {/* Duell & Resultat */}
                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-4">
                  <button
                    type="button"
                    onClick={() => onSelectMember(match.p1)}
                    className="flex items-center gap-2.5 min-w-0 text-left group"
                  >
                    <PlayerAvatar member={p1} size="sm" />
                    <div className="min-w-0">
                      <div
                        className={`text-sm truncate transition ${
                          p1Won
                            ? 'font-bold text-[#F8FAFC] group-hover:text-[#34D399]'
                            : 'font-medium text-[#94A3B8] group-hover:text-[#F8FAFC]'
                        }`}
                      >
                        {getDisplayName(p1)}
                      </div>
                      {p1Won && (
                        <span className="text-[10px] font-semibold text-[#34D399]">
                          Sieger
                        </span>
                      )}
                    </div>
                  </button>

                  <div className="px-3.5 py-2 rounded-2xl bg-[#11141A] border border-[#252B37] text-center shrink-0">
                    <span className="text-sm sm:text-base font-bold text-[#F8FAFC]">
                      <span className={p1Won ? 'text-[#34D399]' : 'text-[#94A3B8]'}>
                        {match.s1}
                      </span>
                      <span className="text-[#475569] mx-1.5">:</span>
                      <span className={!p1Won ? 'text-[#34D399]' : 'text-[#94A3B8]'}>
                        {match.s2}
                      </span>
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onSelectMember(match.p2)}
                    className="flex items-center justify-end gap-2.5 min-w-0 text-right group"
                  >
                    <div className="min-w-0">
                      <div
                        className={`text-sm truncate transition ${
                          !p1Won
                            ? 'font-bold text-[#F8FAFC] group-hover:text-[#34D399]'
                            : 'font-medium text-[#94A3B8] group-hover:text-[#F8FAFC]'
                        }`}
                      >
                        {getDisplayName(p2)}
                      </div>
                      {!p1Won && (
                        <span className="text-[10px] font-semibold text-[#34D399]">
                          Sieger
                        </span>
                      )}
                    </div>
                    <PlayerAvatar member={p2} size="sm" />
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

// ============================================================================
// TAB: HALLENPRÄSENZ ÜBERSICHT
// ============================================================================

function HallPresenceTab({
  members,
  currentSeason,
  myPlayerId,
  selectedHallDuration = 'ca. 2 Std.',
  onChangeHallDuration,
  onToggleInHallNow,
  onUpdateInHallUntil,
  onSelectMember
}) {
  const [onlyMyGroup, setOnlyMyGroup] = useState(false);
  const [selectedDay, setSelectedDay] = useState('ALL');

  const myPlayer = useMemo(
    () => members.find(m => m.id === myPlayerId) || null,
    [members, myPlayerId]
  );

  const liveMembers = useMemo(
    () =>
      members
        .filter(m => Boolean(m.inHallNow))
        .sort((a, b) => (b.inHallSince || 0) - (a.inHallSince || 0)),
    [members]
  );

  const myGroup = useMemo(
    () => currentSeason.groups.find(g => g.memberIds.includes(myPlayerId)) || null,
    [currentSeason.groups, myPlayerId]
  );

  const groupNameMap = useMemo(() => {
    const map = {};
    currentSeason.groups.forEach(g => {
      g.memberIds.forEach(id => {
        map[id] = g.name;
      });
    });
    return map;
  }, [currentSeason.groups]);

  const openOpponentsSet = useMemo(() => {
    const set = new Set();
    if (!myGroup) return set;
    const played = new Set();
    currentSeason.matches
      .filter(
        m =>
          m.groupId === myGroup.id &&
          (m.p1 === myPlayerId || m.p2 === myPlayerId)
      )
      .forEach(m => {
        played.add(m.p1 === myPlayerId ? m.p2 : m.p1);
      });
    myGroup.memberIds.forEach(id => {
      if (id !== myPlayerId && !played.has(id)) {
        set.add(id);
      }
    });
    return set;
  }, [myGroup, currentSeason.matches, myPlayerId]);

  const relevantMembers = useMemo(() => {
    return members.filter(m => {
      if (onlyMyGroup && myGroup && !myGroup.memberIds.includes(m.id)) {
        return false;
      }
      return true;
    });
  }, [members, onlyMyGroup, myGroup]);

  const daySections = useMemo(() => {
    const daysToShow =
      selectedDay === 'ALL' ? WEEKDAY_OPTIONS : [selectedDay];

    return daysToShow
      .map(day => {
        const playersForDay = relevantMembers
          .filter(m => (m.trainingDays || []).includes(day))
          .sort((a, b) => {
            const tA = a.trainingTime || '99:99';
            const tB = b.trainingTime || '99:99';
            if (tA !== tB) return tA.localeCompare(tB);
            return getDisplayName(a).localeCompare(getDisplayName(b));
          });
        return { day, players: playersForDay };
      })
      .filter(sec => selectedDay !== 'ALL' || sec.players.length > 0);
  }, [relevantMembers, selectedDay]);

  return (
    <div className="space-y-4">
      {/* Echtzeit Live-Karte im Halle-Tab */}
      <div className="bg-[#171A21] border border-[#10B981]/35 rounded-3xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#10B981]" />
              </span>
              <h2 className="font-bold text-base text-[#F8FAFC]">
                Jetzt live in der Halle ({liveMembers.length})
              </h2>
            </div>
            <p className="text-xs text-[#94A3B8] mt-1">
              Spieler, die sich aktuell in Echtzeit vor Ort eingecheckt haben
            </p>
          </div>

          {myPlayer && onToggleInHallNow && (
            <div className="flex flex-wrap items-center gap-2 self-stretch sm:self-auto">
              <select
                aria-label="Hallen-Dauer wählen"
                value={
                  myPlayer.inHallNow
                    ? myPlayer.inHallUntil || selectedHallDuration
                    : selectedHallDuration
                }
                onChange={e => {
                  const val = e.target.value;
                  if (onChangeHallDuration) onChangeHallDuration(val);
                  if (myPlayer.inHallNow && onUpdateInHallUntil) {
                    onUpdateInHallUntil(myPlayerId, val);
                  }
                }}
                className="min-h-[42px] bg-[#11141A] border border-[#282E3B] rounded-2xl px-3 py-2 text-xs font-semibold text-[#F8FAFC] focus:outline-none focus:border-[#10B981]"
              >
                {HALL_DURATION_OPTIONS.map(opt => (
                  <option key={opt} value={opt}>
                    {opt} (Auto-Out)
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() =>
                  onToggleInHallNow(myPlayerId, selectedHallDuration)
                }
                className={`min-h-[42px] px-4 rounded-2xl text-xs font-bold transition flex-1 sm:flex-initial ${
                  myPlayer.inHallNow
                    ? 'bg-[#F43F5E]/15 border border-[#F43F5E]/40 text-[#FB7185] hover:bg-[#F43F5E]/25'
                    : 'bg-[#10B981] text-[#052016] hover:bg-[#34D399]'
                }`}
              >
                {myPlayer.inHallNow
                  ? 'Selbst auschecken'
                  : 'Jetzt selbst einchecken'}
              </button>
            </div>
          )}
        </div>

        {liveMembers.length === 0 ? (
          <div className="p-4 rounded-2xl bg-[#11141A] border border-[#252B37] text-xs text-[#94A3B8]">
            Aktuell ist niemand live in der Halle eingecheckt.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {liveMembers.map(member => {
              const grp = groupNameMap[member.id] || 'Verein';
              const isOpenOpponent = openOpponentsSet.has(member.id);
              const waUrl = buildWhatsAppLink({
                opponent: member,
                sender: myPlayer,
                groupName: grp,
                seasonName: currentSeason.name
              });

              return (
                <div
                  key={member.id}
                  className="p-3.5 rounded-2xl bg-[#11141A] border border-[#282E3B] flex items-center justify-between gap-3"
                >
                  <button
                    type="button"
                    onClick={() => onSelectMember(member.id)}
                    className="flex items-center gap-3 text-left min-w-0"
                  >
                    <PlayerAvatar member={member} size="sm" />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm text-[#F8FAFC] truncate">
                          {getDisplayName(member)}
                        </span>
                        {isOpenOpponent && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#10B981]/15 border border-[#10B981]/30 text-[#34D399]">
                            Offenes Spiel
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-[#34D399] mt-0.5">
                        {grp} · {formatLiveDuration(member.inHallSince)}
                        {member.inHallExpiresAt
                          ? ` · Auto-Out ${formatRemainingHallTime(
                              member.inHallExpiresAt
                            )}`
                          : member.inHallUntil
                          ? ` (${member.inHallUntil})`
                          : ''}
                      </div>
                    </div>
                  </button>

                  {waUrl && member.id !== myPlayerId && (
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="WhatsApp schreiben"
                      className="w-10 h-10 rounded-xl bg-[#171A21] border border-[#282E3B] hover:border-[#25D366]/50 text-[#25D366] flex items-center justify-center shrink-0 transition"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="bg-[#171A21] border border-[#252B37] rounded-3xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-bold text-base text-[#F8FAFC]">
            Reguläre Hallenpräsenz & Spieltage
          </h2>
          <p className="text-xs text-[#94A3B8] mt-1">
            Standard-Angaben aus den Spielerprofilen, wer wann grundsätzlich in
            der Halle anzutreffen ist
          </p>
        </div>

        {myGroup && (
          <div className="grid grid-cols-2 sm:flex items-center bg-[#11141A] border border-[#252B37] rounded-2xl p-1 gap-1 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setOnlyMyGroup(false)}
              className={`min-h-[38px] px-3.5 rounded-xl text-xs font-bold transition ${
                !onlyMyGroup
                  ? 'bg-[#10B981] text-[#052016]'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              Ganzer Verein
            </button>
            <button
              type="button"
              onClick={() => setOnlyMyGroup(true)}
              className={`min-h-[38px] px-3.5 rounded-xl text-xs font-bold transition ${
                onlyMyGroup
                  ? 'bg-[#10B981] text-[#052016]'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              Nur {myGroup.name}
            </button>
          </div>
        )}
      </div>

      {/* Wochentags-Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setSelectedDay('ALL')}
          className={`min-h-[38px] px-3.5 rounded-xl text-xs font-semibold shrink-0 transition ${
            selectedDay === 'ALL'
              ? 'bg-[#10B981] text-[#052016]'
              : 'bg-[#171A21] border border-[#252B37] text-[#94A3B8] hover:text-[#F8FAFC]'
          }`}
        >
          Alle Tage
        </button>
        {WEEKDAY_OPTIONS.map(day => {
          const count = relevantMembers.filter(m =>
            (m.trainingDays || []).includes(day)
          ).length;
          return (
            <button
              key={day}
              type="button"
              onClick={() => setSelectedDay(day)}
              className={`min-h-[38px] px-3.5 rounded-xl text-xs font-semibold shrink-0 transition ${
                selectedDay === day
                  ? 'bg-[#10B981] text-[#052016]'
                  : 'bg-[#171A21] border border-[#252B37] text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              {day} ({count})
            </button>
          );
        })}
      </div>

      {/* Tages-Karten */}
      {daySections.length === 0 ? (
        <div className="bg-[#171A21] border border-[#252B37] rounded-3xl p-8 text-center text-xs text-[#94A3B8]">
          Keine Spieler für diese Auswahl in der Halle eingetragen.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {daySections.map(({ day, players }) => (
            <section
              key={day}
              className="bg-[#171A21] border border-[#252B37] rounded-3xl overflow-hidden flex flex-col"
            >
              <div className="px-5 py-3.5 border-b border-[#252B37] flex items-center justify-between">
                <h3 className="font-bold text-sm text-[#F8FAFC]">
                  {day === 'Nach Absprache' ? 'Nach Absprache' : `${day} in der Halle`}
                </h3>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#10B981]/12 text-[#34D399]">
                  {players.length} Spieler
                </span>
              </div>

              <div className="divide-y divide-[#252B37]/60">
                {players.map(member => {
                  const grp = groupNameMap[member.id] || 'Verein';
                  const isOpenOpponent = openOpponentsSet.has(member.id);
                  const waUrl = buildWhatsAppLink({
                    opponent: member,
                    sender: myPlayer,
                    groupName: grp,
                    seasonName: currentSeason.name
                  });

                  return (
                    <div
                      key={`${day}-${member.id}`}
                      className="px-5 py-3.5 flex items-center justify-between gap-2.5 hover:bg-[#1C2029] transition"
                    >
                      <button
                        onClick={() => onSelectMember(member.id)}
                        className="flex items-center gap-3 text-left min-w-0"
                      >
                        <PlayerAvatar member={member} size="sm" />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-sm text-[#F8FAFC] truncate">
                              {getDisplayName(member)}
                            </span>
                            {member.inHallNow && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#10B981] text-[#052016]">
                                Jetzt live
                              </span>
                            )}
                            {isOpenOpponent && (
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#10B981]/15 border border-[#10B981]/30 text-[#34D399]">
                                Offenes Spiel
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-[#64748B] mt-0.5">
                            {grp} · {member.trainingTime || 'Flexibel'}
                          </div>
                        </div>
                      </button>

                      {waUrl && member.id !== myPlayerId && (
                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="WhatsApp schreiben"
                          className="w-10 h-10 rounded-xl bg-[#11141A] border border-[#252B37] hover:border-[#25D366]/50 text-[#25D366] flex items-center justify-center shrink-0 transition"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// TAB: ZUSAGEN FÜR DEN FOLGEMONAT
// ============================================================================

function NextMonthCommitmentsTab({
  members,
  nextSeason,
  myPlayerId,
  onToggleNextMonth,
  onToggleAutoConfirm,
  onSelectMember
}) {
  const confirmed = useMemo(
    () => members.filter(m => m.nextMonthStatus === 'confirmed'),
    [members]
  );
  const open = useMemo(
    () => members.filter(m => m.nextMonthStatus === 'open'),
    [members]
  );
  const paused = useMemo(
    () => members.filter(m => m.nextMonthStatus === 'paused'),
    [members]
  );
  const blocked = useMemo(
    () => members.filter(m => m.nextMonthStatus === 'blocked'),
    [members]
  );

  const estimatedGroups =
    confirmed.length > 0 ? Math.max(1, Math.round(confirmed.length / 4)) : 0;

  const renderSection = (title, list, badgeClass, emptyText) => (
    <section className="bg-[#171A21] border border-[#252B37] rounded-3xl overflow-hidden">
      <div className="px-5 py-4 border-b border-[#252B37] flex items-center justify-between">
        <h3 className="font-bold text-sm text-[#F8FAFC]">{title}</h3>
        <span
          className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${badgeClass}`}
        >
          {list.length}
        </span>
      </div>

      {list.length === 0 ? (
        <div className="px-5 py-5 text-xs text-[#64748B]">{emptyText}</div>
      ) : (
        <div className="divide-y divide-[#252B37]/60">
          {list.map(member => {
            const isMe = member.id === myPlayerId;
            return (
              <div
                key={member.id}
                className={`px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isMe ? 'bg-[#10B981]/[0.06]' : 'hover:bg-[#1C2029]'
                }`}
              >
                <button
                  type="button"
                  onClick={() => onSelectMember(member.id)}
                  className="flex items-center gap-3 text-left min-w-0"
                >
                  <PlayerAvatar member={member} size="sm" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm text-[#F8FAFC] truncate">
                        {getDisplayName(member)}
                      </span>
                      {isMe && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#10B981]/15 text-[#34D399]">
                          Du
                        </span>
                      )}
                      {member.autoConfirm && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#10B981]/15 text-[#34D399]">
                          ∞ Immer dabei
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-[#64748B] truncate mt-0.5">
                      {getFullName(member)}
                      {member.blockedReason ? ` · ${member.blockedReason}` : ''}
                    </div>
                  </div>
                </button>

                {member.nextMonthStatus === 'blocked' ? (
                  <span className="inline-flex items-center justify-center gap-1.5 min-h-[38px] px-3.5 rounded-xl text-xs font-semibold bg-[#F43F5E]/15 text-[#FB7185]">
                    <Lock className="w-3 h-3" />
                    Gesperrt
                  </span>
                ) : (
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="grid grid-cols-2 sm:flex items-center bg-[#11141A] border border-[#252B37] rounded-2xl p-1 gap-1 flex-1 sm:flex-initial">
                      <button
                        type="button"
                        onClick={() =>
                          onToggleNextMonth(member.id, 'confirmed')
                        }
                        className={`min-h-[36px] px-3.5 rounded-xl text-xs font-bold transition ${
                          member.nextMonthStatus === 'confirmed'
                            ? 'bg-[#10B981] text-[#052016]'
                            : 'text-[#94A3B8] hover:text-[#F8FAFC]'
                        }`}
                      >
                        Dabei
                      </button>
                      <button
                        type="button"
                        onClick={() => onToggleNextMonth(member.id, 'paused')}
                        className={`min-h-[36px] px-3.5 rounded-xl text-xs font-bold transition ${
                          member.nextMonthStatus === 'paused'
                            ? 'bg-[#334155] text-[#F8FAFC]'
                            : 'text-[#94A3B8] hover:text-[#F8FAFC]'
                        }`}
                      >
                        Pausiert
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => onToggleAutoConfirm(member.id)}
                      title="Immer dabei (bis auf Widerruf)"
                      className={`min-h-[38px] px-3 rounded-xl text-xs font-semibold border transition shrink-0 ${
                        member.autoConfirm
                          ? 'bg-[#10B981]/15 border-[#10B981]/45 text-[#34D399]'
                          : 'bg-[#11141A] border-[#252B37] text-[#94A3B8] hover:text-[#F8FAFC]'
                      }`}
                    >
                      ∞
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );

  return (
    <div className="space-y-4">
      <div className="bg-[#171A21] border border-[#252B37] rounded-3xl p-5 space-y-4">
        <div>
          <h2 className="font-bold text-base text-[#F8FAFC]">
            Zusagen für {nextSeason.name}
          </h2>
          <p className="text-xs text-[#94A3B8] mt-1">
            Übersicht aller Teilnehmer für die nächste Auslosung (Statusänderung
            mit persönlicher PIN)
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="p-3.5 rounded-2xl bg-[#11141A] border border-[#252B37]">
            <span className="text-[11px] text-[#94A3B8] block">Dabei</span>
            <span className="text-lg font-bold text-[#34D399] mt-0.5 block">
              {confirmed.length}
            </span>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#11141A] border border-[#252B37]">
            <span className="text-[11px] text-[#94A3B8] block">Noch offen</span>
            <span className="text-lg font-bold text-[#FBBF24] mt-0.5 block">
              {open.length}
            </span>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#11141A] border border-[#252B37]">
            <span className="text-[11px] text-[#94A3B8] block">
              Pausiert / Gesperrt
            </span>
            <span className="text-lg font-bold text-[#F8FAFC] mt-0.5 block">
              {paused.length + blocked.length}
            </span>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#11141A] border border-[#252B37]">
            <span className="text-[11px] text-[#94A3B8] block">
              Vorauss. Gruppen
            </span>
            <span className="text-lg font-bold text-[#34D399] mt-0.5 block">
              ~{estimatedGroups}
            </span>
          </div>
        </div>
      </div>

      {renderSection(
        `Dabei (${nextSeason.shortName})`,
        confirmed,
        'bg-[#10B981]/15 text-[#34D399]',
        'Noch keine Zusagen vorhanden.'
      )}

      {renderSection(
        'Rückmeldung noch offen',
        open,
        'bg-[#F59E0B]/15 text-[#FBBF24]',
        'Alle Spieler haben bereits zurückgemeldet.'
      )}

      {renderSection(
        'Pausiert',
        paused,
        'bg-[#252B37] text-[#94A3B8]',
        'Niemand pausiert aktuell.'
      )}

      {blocked.length > 0 &&
        renderSection(
          'Gesperrt (Pflichtspiele nicht erreicht)',
          blocked,
          'bg-[#F43F5E]/15 text-[#FB7185]',
          ''
        )}
    </div>
  );
}

// ============================================================================
// TAB: JAHRESWERTUNG
// ============================================================================

function AnnualStandingsTab({
  seasons,
  membersMap,
  year,
  myPlayerId,
  onSelectMember
}) {
  const [showScoringInfo, setShowScoringInfo] = useState(false);

  const leaderboard = useMemo(
    () => computeAnnualLeaderboard(seasons, membersMap, year),
    [seasons, membersMap, year]
  );

  return (
    <div className="space-y-4">
      <div className="bg-[#171A21] border border-[#252B37] rounded-3xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-bold text-base text-[#F8FAFC]">
              Club-Jahreswertung {year}
            </h2>
            <p className="text-xs text-[#94A3B8] mt-1">
              Gewichtete Gesamtpunkte über alle gespielten Monate
            </p>
          </div>
          <div className="flex items-center justify-between sm:justify-end gap-2">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#10B981]/12 text-[#34D399]">
              A ×1.5 · B ×1.25 · C ×1.0
            </span>
            <button
              type="button"
              onClick={() => setShowScoringInfo(prev => !prev)}
              className={`min-h-[38px] px-3.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition ${
                showScoringInfo
                  ? 'bg-[#10B981] text-[#052016] border-[#10B981]'
                  : 'bg-[#11141A] border-[#252B37] text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              <Info className="w-3.5 h-3.5" />
              <span>Punktesystem</span>
            </button>
          </div>
        </div>

        {showScoringInfo && (
          <div className="p-4 rounded-2xl bg-[#11141A] border border-[#252B37] space-y-3.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#F8FAFC] flex items-center gap-1.5">
                <Award className="w-4 h-4 text-[#34D399]" />
                So werden die Jahrespunkte berechnet
              </span>
              <button
                type="button"
                onClick={() => setShowScoringInfo(false)}
                className="text-[#94A3B8] hover:text-[#F8FAFC] p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="p-3 rounded-2xl bg-[#171A21] border border-[#252B37]">
                <span className="font-bold text-[#34D399] block mb-1">
                  1. Matchpunkte × 4
                </span>
                <p className="text-[#94A3B8] leading-relaxed">
                  Jeder Ligapunkt (3 Pkt Sieg, 1 Pkt knappe 2:3-Niederlage)
                  zählt <strong>4-fach</strong>.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-[#171A21] border border-[#252B37]">
                <span className="font-bold text-[#34D399] block mb-1">
                  2. Platzierungsbonus
                </span>
                <p className="text-[#94A3B8] leading-relaxed">
                  1. Platz: <strong>+25</strong> · 2.: <strong>+18</strong> ·
                  3.: <strong>+12</strong> · 4.: <strong>+8</strong> · 5.:{' '}
                  <strong>+5</strong> · 6.: <strong>+3</strong>
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-[#171A21] border border-[#252B37]">
                <span className="font-bold text-[#34D399] block mb-1">
                  3. Gruppen-Faktor
                </span>
                <p className="text-[#94A3B8] leading-relaxed">
                  Gruppe A: <strong>×1.5</strong> · Gruppe B:{' '}
                  <strong>×1.25</strong> · Gruppe C: <strong>×1.0</strong> · D:{' '}
                  <strong>×0.9</strong>
                </p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-[#171A21] border border-[#252B37] text-[#94A3B8]">
              <strong className="text-[#F8FAFC]">Rechenbeispiel:</strong> 2
              Siege in Gruppe B (6 Matchpunkte × 4 = 24) + 2. Platz (+18) = 42
              Basispunkte × 1.25 ={' '}
              <strong className="text-[#34D399]">53 Jahrespunkte</strong>. Bei
              Punktgleichheit entscheidet die höhere Anzahl Siege.
            </div>
          </div>
        )}
      </div>

      <div className="bg-[#171A21] border border-[#252B37] rounded-3xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-[11px] uppercase tracking-wider text-[#64748B] border-b border-[#252B37]">
              <th className="py-3.5 pl-5 pr-2 w-12">Rang</th>
              <th className="py-3.5 px-2">Spieler</th>
              <th className="py-3.5 px-2 text-center hidden sm:table-cell">Monate</th>
              <th className="py-3.5 px-2 text-center">Siege</th>
              <th className="py-3.5 pl-2 pr-5 text-right">Jahrespunkte</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#252B37]/60 text-sm">
            {leaderboard.map((row, idx) => {
              const isMe = row.member.id === myPlayerId;
              return (
                <tr
                  key={row.member.id}
                  className={
                    isMe ? 'bg-[#10B981]/[0.07]' : 'hover:bg-[#1C2029]'
                  }
                >
                  <td className="py-3.5 pl-5 pr-2 font-bold">
                    {idx === 0 ? (
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-xl bg-[#10B981] text-[#052016] text-xs font-extrabold">
                        1
                      </span>
                    ) : idx === 1 ? (
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-xl bg-[#252B37] text-[#F8FAFC] text-xs font-bold">
                        2
                      </span>
                    ) : idx === 2 ? (
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-xl bg-[#252B37]/70 text-[#94A3B8] text-xs font-bold">
                        3
                      </span>
                    ) : (
                      <span className="text-xs text-[#94A3B8] pl-2">
                        {idx + 1}
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-2">
                    <button
                      onClick={() => onSelectMember(row.member.id)}
                      className="flex items-center gap-3 text-left group min-h-[36px]"
                    >
                      <PlayerAvatar member={row.member} size="sm" />
                      <div>
                        <div className="font-semibold text-[#F8FAFC] group-hover:text-[#34D399] flex items-center gap-1.5">
                          <span>{getDisplayName(row.member)}</span>
                          {isMe && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#10B981]/15 text-[#34D399]">
                              Du
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-[#64748B] flex flex-wrap gap-1 mt-0.5">
                          {row.monthlyBreakdown.map((mb, i) => (
                            <span key={i}>
                              {mb.seasonShort}: {mb.groupName.replace('Gruppe ', '')} #{mb.rank}
                              {i < row.monthlyBreakdown.length - 1 ? ' · ' : ''}
                            </span>
                          ))}
                        </div>
                      </div>
                    </button>
                  </td>
                  <td className="py-3.5 px-2 text-center text-xs text-[#94A3B8] hidden sm:table-cell">
                    {row.monthsPlayed}
                  </td>
                  <td className="py-3.5 px-2 text-center text-xs text-[#94A3B8]">
                    {row.totalWins}
                  </td>
                  <td className="py-3.5 pl-2 pr-5 text-right font-bold text-[#34D399]">
                    {row.totalPoints}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============================================================================
// TAB: ALLE SPIELER
// ============================================================================

function MembersDirectoryTab({
  members,
  nextSeason,
  isAdminUnlocked,
  onOpenAddMember,
  onSelectMember
}) {
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMembers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return members.filter(m => {
      if (filterStatus !== 'ALL' && m.nextMonthStatus !== filterStatus) {
        return false;
      }
      if (q) {
        const display = getDisplayName(m).toLowerCase();
        const full = getFullName(m).toLowerCase();
        if (!display.includes(q) && !full.includes(q)) return false;
      }
      return true;
    });
  }, [members, filterStatus, searchQuery]);

  const counts = useMemo(
    () => ({
      ALL: members.length,
      confirmed: members.filter(m => m.nextMonthStatus === 'confirmed').length,
      open: members.filter(m => m.nextMonthStatus === 'open').length,
      paused: members.filter(m => m.nextMonthStatus === 'paused').length,
      blocked: members.filter(m => m.nextMonthStatus === 'blocked').length
    }),
    [members]
  );

  return (
    <div className="space-y-4">
      <div className="bg-[#171A21] border border-[#252B37] rounded-3xl p-5 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-bold text-base text-[#F8FAFC]">
              Alle Spieler ({members.length} Mitglieder)
            </h2>
            <p className="text-xs text-[#94A3B8] mt-1">
              Teilnahme für {nextSeason.name} & Hallenpräsenz (Anpassung im
              eigenen Profil)
            </p>
          </div>
          {isAdminUnlocked && (
            <button
              onClick={onOpenAddMember}
              className="min-h-[42px] px-4 rounded-2xl bg-[#10B981] text-[#052016] text-xs font-bold flex items-center justify-center gap-1.5 self-stretch sm:self-auto"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Neuer Spieler</span>
            </button>
          )}
        </div>

        {/* Suchfeld */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Spielername, Vor- oder Nachname suchen..."
            className="w-full min-h-[42px] pl-10 pr-10 py-2 rounded-2xl bg-[#11141A] border border-[#282E3B] text-xs sm:text-sm text-[#F8FAFC] placeholder:text-[#64748B] focus:outline-none focus:border-[#10B981]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              aria-label="Suche löschen"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#64748B] hover:text-[#F8FAFC]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Status-Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {[
            { id: 'ALL', label: `Alle (${counts.ALL})` },
            { id: 'confirmed', label: `Dabei (${counts.confirmed})` },
            { id: 'open', label: `Offen (${counts.open})` },
            { id: 'paused', label: `Pausiert (${counts.paused})` },
            { id: 'blocked', label: `Gesperrt (${counts.blocked})` }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`min-h-[38px] px-3.5 rounded-xl text-xs font-semibold shrink-0 transition ${
                filterStatus === tab.id
                  ? 'bg-[#10B981] text-[#052016]'
                  : 'bg-[#11141A] border border-[#252B37] text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {filteredMembers.length === 0 ? (
        <div className="bg-[#171A21] border border-[#252B37] rounded-3xl p-8 text-center text-xs text-[#94A3B8]">
          Keine Spieler für diese Suche oder diesen Filter gefunden.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredMembers.map(member => (
            <div
              key={member.id}
              className="bg-[#171A21] border border-[#252B37] rounded-3xl p-4 sm:p-5 flex items-center justify-between gap-3"
            >
              <button
                onClick={() => onSelectMember(member.id)}
                className="flex items-center gap-3.5 text-left min-w-0"
              >
                <PlayerAvatar member={member} size="md" />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#F8FAFC] truncate">
                      {getDisplayName(member)}
                    </span>
                    <span className="text-[11px] text-[#64748B]">
                      {member.language}
                    </span>
                  </div>
                  <div className="text-xs text-[#94A3B8] truncate mt-0.5">
                    {member.firstName} {member.lastName}
                  </div>
                  <div className="text-[11px] text-[#64748B] truncate mt-1">
                    {member.trainingDays.join(', ')} · {member.trainingTime}
                  </div>
                </div>
              </button>

              {/* Rein informative Status-Anzeige (Änderung nur im Spielerprofil) */}
              <div className="flex items-center gap-2 shrink-0">
                {member.autoConfirm && member.nextMonthStatus === 'confirmed' && (
                  <span
                    title="Immer dabei (bis auf Widerruf)"
                    className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#10B981]/15 text-[#34D399]"
                  >
                    ∞
                  </span>
                )}
                {member.nextMonthStatus === 'blocked' ? (
                  <span
                    title={member.blockedReason || 'Für 1 Monat gesperrt'}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#F43F5E]/15 text-[#FB7185]"
                  >
                    <Lock className="w-3 h-3" />
                    Gesperrt
                  </span>
                ) : member.nextMonthStatus === 'confirmed' ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#10B981]/15 text-[#34D399]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                    Dabei
                  </span>
                ) : member.nextMonthStatus === 'paused' ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#252B37] text-[#94A3B8]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#64748B]" />
                    Pausiert
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#F59E0B]/15 text-[#FBBF24]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
                    Offen
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// MODAL: SPIELRESULTAT EINTRAGEN (BEST OF 5)
// ============================================================================

function MatchEntryModal({
  season,
  initialData,
  membersMap,
  isAdminUnlocked,
  onClose,
  onSave
}) {
  const [groupId, setGroupId] = useState(
    initialData.groupId || season.groups[0]?.id
  );
  const selectedGroup =
    season.groups.find(g => g.id === groupId) || season.groups[0];

  const [p1, setP1] = useState(
    initialData.p1 || selectedGroup?.memberIds[0] || ''
  );
  const [p2, setP2] = useState(initialData.p2 || '');
  const [scorePreset, setScorePreset] = useState(() => {
    if (initialData.s1 !== undefined && initialData.s2 !== undefined) {
      return `${initialData.s1}:${initialData.s2}`;
    }
    return '3:1';
  });
  const [pinInput, setPinInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const presets = ['3:0', '3:1', '3:2', '2:3', '1:3', '0:3'];

  const handleSubmit = e => {
    e.preventDefault();
    setErrorMsg('');

    if (!p1 || !p2 || p1 === p2) {
      setErrorMsg('Bitte zwei unterschiedliche Spieler auswählen.');
      return;
    }

    const player1 = membersMap[p1];
    const player2 = membersMap[p2];

    if (!isAdminUnlocked) {
      const cleanedPin = pinInput.trim();
      const valid =
        cleanedPin === ADMIN_PIN ||
        (player1 && cleanedPin === player1.pin) ||
        (player2 && cleanedPin === player2.pin);

      if (!valid) {
        setErrorMsg(
          `Ungültige PIN. Bitte die 4-stellige PIN von ${getDisplayName(
            player1
          )} oder ${getDisplayName(player2)} eingeben.`
        );
        return;
      }
    }

    const [s1, s2] = scorePreset.split(':').map(Number);
    onSave({
      groupId: selectedGroup.id,
      matchId: initialData.matchId,
      p1,
      p2,
      s1,
      s2
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-[#171A21] border-t sm:border border-[#252B37] rounded-t-3xl sm:rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="px-5 py-4 border-b border-[#252B37] flex items-center justify-between">
          <h3 className="font-bold text-base text-[#F8FAFC]">
            Spielresultat ({season.shortName})
          </h3>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-[#11141A] flex items-center justify-center text-[#94A3B8] hover:text-[#F8FAFC]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">
              Gruppe
            </label>
            <select
              value={selectedGroup.id}
              onChange={e => {
                const newGrpId = e.target.value;
                setGroupId(newGrpId);
                const grp = season.groups.find(g => g.id === newGrpId);
                setP1(grp?.memberIds[0] || '');
                setP2('');
              }}
              className="w-full min-h-[44px] bg-[#11141A] border border-[#252B37] rounded-2xl px-3.5 py-2.5 text-sm text-[#F8FAFC]"
            >
              {season.groups.map(g => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">
                Spieler 1
              </label>
              <select
                value={p1}
                onChange={e => setP1(e.target.value)}
                className="w-full min-h-[44px] bg-[#11141A] border border-[#252B37] rounded-2xl px-3 py-2.5 text-sm text-[#F8FAFC]"
              >
                {selectedGroup.memberIds.map(id => (
                  <option key={id} value={id}>
                    {getDisplayName(membersMap[id])}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">
                Spieler 2
              </label>
              <select
                value={p2}
                onChange={e => setP2(e.target.value)}
                className="w-full min-h-[44px] bg-[#11141A] border border-[#252B37] rounded-2xl px-3 py-2.5 text-sm text-[#F8FAFC]"
              >
                <option value="">Wählen...</option>
                {selectedGroup.memberIds
                  .filter(id => id !== p1)
                  .map(id => (
                    <option key={id} value={id}>
                      {getDisplayName(membersMap[id])}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#94A3B8] mb-2">
              Sätze (Best of 5)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {presets.map(preset => (
                <button
                  type="button"
                  key={preset}
                  onClick={() => setScorePreset(preset)}
                  className={`min-h-[46px] rounded-2xl text-sm font-bold border transition ${
                    scorePreset === preset
                      ? 'bg-[#10B981] text-[#052016] border-[#10B981]'
                      : 'bg-[#11141A] text-[#F8FAFC] border-[#252B37] hover:border-[#3A4254]'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {!isAdminUnlocked && (
            <div>
              <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">
                Spieler-PIN zur Bestätigung (4-stellig)
              </label>
              <input
                type="password"
                inputMode="numeric"
                maxLength={6}
                placeholder="••••"
                value={pinInput}
                onChange={e => setPinInput(e.target.value)}
                className="w-full min-h-[46px] bg-[#11141A] border border-[#252B37] rounded-2xl px-3.5 py-2.5 text-center tracking-widest text-base text-[#F8FAFC] focus:outline-none focus:border-[#10B981]"
              />
            </div>
          )}

          {errorMsg && (
            <p className="text-xs text-[#FB7185] bg-[#F43F5E]/10 border border-[#F43F5E]/25 rounded-2xl p-3">
              {errorMsg}
            </p>
          )}

          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 min-h-[46px] rounded-2xl bg-[#11141A] border border-[#252B37] text-xs font-semibold text-[#94A3B8]"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              className="flex-1 min-h-[46px] rounded-2xl bg-[#10B981] text-[#052016] text-xs font-bold"
            >
              Speichern
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ============================================================================
// MODAL: SPIELERPROFIL & BEARBEITUNG
// ============================================================================

function PlayerProfileModal({
  member,
  myPlayerId,
  myPlayer,
  nextSeason,
  seasons,
  isUnlocked,
  initialEditing = false,
  onRequestUnlock,
  onToggleNextMonth,
  onToggleAutoConfirm,
  onClose,
  onSave
}) {
  const [editing, setEditing] = useState(Boolean(isUnlocked && initialEditing));
  const [form, setForm] = useState({ ...member });

  useEffect(() => {
    setForm({ ...member });
  }, [member]);

  useEffect(() => {
    if (isUnlocked && initialEditing) {
      setEditing(true);
    }
  }, [isUnlocked, initialEditing]);

  const isOwnProfile = member.id === myPlayerId;
  const waUrl = buildWhatsAppLink({
    opponent: member,
    sender: myPlayer,
    groupName: 'PINGKONG Liga',
    seasonName: seasons[seasons.length - 1]?.name || 'Aktuell'
  });

  const handleToggleDay = day => {
    setForm(prev => {
      const exists = prev.trainingDays.includes(day);
      return {
        ...prev,
        trainingDays: exists
          ? prev.trainingDays.filter(d => d !== day)
          : [...prev.trainingDays, day]
      };
    });
  };

  const handleAvatarUpload = e => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setForm(prev => ({ ...prev, avatarUrl: reader.result }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = e => {
    e.preventDefault();
    onSave(form);
    setEditing(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div
        className={`bg-[#171A21] border-t sm:border rounded-t-3xl sm:rounded-3xl w-full max-w-md overflow-hidden shadow-2xl max-h-[92vh] overflow-y-auto ${
          isOwnProfile ? 'border-[#10B981]/50' : 'border-[#38BDF8]/40'
        }`}
      >
        {/* Sichtbarkeits-Streifen: Eigenes Profil vs. Fremdprofil */}
        <div
          className={`px-5 py-3 border-b flex items-center justify-between gap-2 text-xs font-semibold ${
            isOwnProfile
              ? 'bg-[#10B981]/12 border-[#10B981]/25 text-[#34D399]'
              : 'bg-[#38BDF8]/12 border-[#38BDF8]/25 text-[#7DD3FC]'
          }`}
        >
          <div className="flex items-center gap-2 min-w-0">
            <User className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">
              {isOwnProfile
                ? 'Dein eigenes Spielerprofil'
                : `Profil von ${getDisplayName(member)}`}
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-[#11141A]/80 flex items-center justify-center text-[#94A3B8] hover:text-[#F8FAFC] shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Grosse Spielerkarten-Hero-Ansicht */}
        <div className="px-5 pt-5 pb-4 border-b border-[#252B37] flex items-center gap-4">
          <PlayerAvatar
            member={{ ...member, avatarUrl: form.avatarUrl }}
            size="xl"
          />
          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                  isOwnProfile
                    ? 'bg-[#10B981]/15 text-[#34D399]'
                    : 'bg-[#38BDF8]/15 text-[#7DD3FC]'
                }`}
              >
                {isOwnProfile ? 'Dein Profil' : 'Mitspieler'}
              </span>
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#11141A] border border-[#252B37] text-[#94A3B8]">
                {member.language}
              </span>
            </div>

            <h3 className="font-bold text-xl text-[#F8FAFC] truncate">
              {getDisplayName(member)}
            </h3>
            <p className="text-xs text-[#94A3B8] truncate">
              {member.firstName} {member.lastName}
            </p>
          </div>
        </div>

        {!editing ? (
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-[#11141A] border border-[#252B37]">
                <span className="text-[#94A3B8] block mb-1">Hallenpräsenz</span>
                <span className="text-[#F8FAFC] font-semibold">
                  {member.trainingDays.join(', ')} ({member.trainingTime})
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#11141A] border border-[#252B37]">
                <span className="text-[#94A3B8] block mb-1">
                  Teilnahme {nextSeason.shortName}
                </span>
                {member.nextMonthStatus === 'blocked' ? (
                  <span className="font-bold text-[#FB7185] block">
                    Gesperrt (1 Monat)
                  </span>
                ) : (
                  <div className="space-y-2 mt-1">
                    <div className="grid grid-cols-2 bg-[#171A21] border border-[#252B37] rounded-xl p-0.5 gap-0.5">
                      <button
                        type="button"
                        onClick={() => onToggleNextMonth(member.id, 'confirmed')}
                        className={`min-h-[32px] px-2 rounded-lg text-[11px] font-bold transition ${
                          member.nextMonthStatus === 'confirmed'
                            ? 'bg-[#10B981] text-[#052016]'
                            : 'text-[#94A3B8] hover:text-[#F8FAFC]'
                        }`}
                      >
                        Dabei
                      </button>
                      <button
                        type="button"
                        onClick={() => onToggleNextMonth(member.id, 'paused')}
                        className={`min-h-[32px] px-2 rounded-lg text-[11px] font-bold transition ${
                          member.nextMonthStatus === 'paused'
                            ? 'bg-[#334155] text-[#F8FAFC]'
                            : 'text-[#94A3B8] hover:text-[#F8FAFC]'
                        }`}
                      >
                        Pausiert
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => onToggleAutoConfirm(member.id)}
                      className={`w-full min-h-[30px] px-2.5 rounded-lg text-[10px] font-semibold border transition ${
                        member.autoConfirm
                          ? 'bg-[#10B981]/15 border-[#10B981]/40 text-[#34D399]'
                          : 'bg-[#171A21] border-[#252B37] text-[#94A3B8] hover:text-[#F8FAFC]'
                      }`}
                    >
                      {member.autoConfirm
                        ? '∞ Immer dabei (aktiv)'
                        : '∞ Immer dabei aktivieren'}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {member.nextMonthStatus === 'blocked' && member.blockedReason && (
              <div className="p-3.5 rounded-2xl bg-[#F43F5E]/10 border border-[#F43F5E]/30 text-xs text-[#FDA4AF]">
                {member.blockedReason}
              </div>
            )}

            <div className="p-3.5 rounded-2xl bg-[#11141A] border border-[#252B37] flex items-center justify-between text-xs">
              <div>
                <span className="text-[#94A3B8] block">Mobile / WhatsApp</span>
                <span className="text-[#F8FAFC] font-medium">
                  {member.phone || 'Nicht hinterlegt'}
                </span>
              </div>
              {waUrl && member.id !== myPlayerId && (
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[38px] px-3.5 rounded-xl bg-[#25D366]/15 border border-[#25D366]/35 text-[#25D366] font-semibold flex items-center gap-1.5"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Schreiben</span>
                </a>
              )}
            </div>

            <div className="flex items-center gap-2 pt-1">
              {isUnlocked ? (
                <button
                  onClick={() => setEditing(true)}
                  className="flex-1 min-h-[44px] rounded-2xl bg-[#10B981] text-[#052016] text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Profil bearbeiten</span>
                </button>
              ) : (
                <button
                  onClick={onRequestUnlock}
                  className="flex-1 min-h-[44px] rounded-2xl bg-[#11141A] border border-[#252B37] hover:border-[#3A4254] text-xs font-semibold text-[#F8FAFC] flex items-center justify-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5 text-[#34D399]" />
                  <span>Mit PIN bearbeiten</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSaveProfile} className="p-5 space-y-4">
            <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-[#11141A] border border-[#252B37]">
              <PlayerAvatar member={form} size="lg" />
              <div className="space-y-1.5">
                <label className="inline-flex items-center gap-1.5 min-h-[38px] px-3.5 rounded-xl bg-[#171A21] border border-[#282E3B] text-xs font-semibold text-[#F8FAFC] cursor-pointer hover:border-[#10B981]/50">
                  <Camera className="w-3.5 h-3.5 text-[#34D399]" />
                  <span>Neues Foto wählen</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                </label>
                {form.avatarUrl && (
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, avatarUrl: '' })}
                    className="block text-[11px] text-[#94A3B8] hover:text-[#FB7185]"
                  >
                    Foto entfernen
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-[#94A3B8] mb-1">
                  Vorname
                </label>
                <input
                  required
                  value={form.firstName}
                  onChange={e =>
                    setForm({ ...form, firstName: e.target.value })
                  }
                  className="w-full min-h-[42px] bg-[#11141A] border border-[#252B37] rounded-2xl px-3.5 py-2 text-sm text-[#F8FAFC]"
                />
              </div>
              <div>
                <label className="block text-xs text-[#94A3B8] mb-1">
                  Nachname
                </label>
                <input
                  required
                  value={form.lastName}
                  onChange={e =>
                    setForm({ ...form, lastName: e.target.value })
                  }
                  className="w-full min-h-[42px] bg-[#11141A] border border-[#252B37] rounded-2xl px-3.5 py-2 text-sm text-[#F8FAFC]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-[#94A3B8] mb-1">
                  Spielername
                </label>
                <input
                  value={form.nickname}
                  onChange={e =>
                    setForm({ ...form, nickname: e.target.value })
                  }
                  className="w-full min-h-[42px] bg-[#11141A] border border-[#252B37] rounded-2xl px-3.5 py-2 text-sm text-[#F8FAFC]"
                />
              </div>
              <div>
                <label className="block text-xs text-[#94A3B8] mb-1">
                  Sprache
                </label>
                <input
                  value={form.language}
                  onChange={e =>
                    setForm({ ...form, language: e.target.value })
                  }
                  className="w-full min-h-[42px] bg-[#11141A] border border-[#252B37] rounded-2xl px-3.5 py-2 text-sm text-[#F8FAFC]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-[#94A3B8] mb-1">
                  Mobile / WhatsApp
                </label>
                <input
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  className="w-full min-h-[42px] bg-[#11141A] border border-[#252B37] rounded-2xl px-3.5 py-2 text-sm text-[#F8FAFC]"
                />
              </div>
              <div>
                <label className="block text-xs text-[#94A3B8] mb-1">
                  Persönliche PIN (4-stellig)
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={form.pin}
                  onChange={e => setForm({ ...form, pin: e.target.value })}
                  className="w-full min-h-[42px] bg-[#11141A] border border-[#252B37] rounded-2xl px-3.5 py-2 text-sm text-[#F8FAFC]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-[#94A3B8] mb-1.5">
                Hallenpräsenz
              </label>
              <div className="flex flex-wrap gap-1.5">
                {WEEKDAY_OPTIONS.map(day => {
                  const active = form.trainingDays.includes(day);
                  return (
                    <button
                      type="button"
                      key={day}
                      onClick={() => handleToggleDay(day)}
                      className={`min-h-[36px] px-3 rounded-xl text-xs font-semibold border transition ${
                        active
                          ? 'bg-[#10B981] text-[#052016] border-[#10B981]'
                          : 'bg-[#11141A] text-[#94A3B8] border-[#252B37]'
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs text-[#94A3B8] mb-1">
                Bevorzugte Zeit
              </label>
              <input
                value={form.trainingTime}
                onChange={e =>
                  setForm({ ...form, trainingTime: e.target.value })
                }
                placeholder="z.B. ab 19:00"
                className="w-full min-h-[42px] bg-[#11141A] border border-[#252B37] rounded-2xl px-3.5 py-2 text-sm text-[#F8FAFC]"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="flex-1 min-h-[44px] rounded-2xl bg-[#11141A] border border-[#252B37] text-xs font-semibold text-[#94A3B8]"
              >
                Abbrechen
              </button>
              <button
                type="submit"
                className="flex-1 min-h-[44px] rounded-2xl bg-[#10B981] text-[#052016] text-xs font-bold"
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

// ============================================================================
// MODAL: NEUES MITGLIED ANLEGEN
// ============================================================================

function AddMemberModal({ onClose, onCreate }) {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    nickname: '',
    pin: '1234',
    phone: '+41 79 ',
    language: 'DE',
    trainingDays: ['Di'],
    trainingTime: 'ab 19:00'
  });

  const handleSubmit = e => {
    e.preventDefault();
    if (!form.firstName.trim() || !form.lastName.trim()) return;
    onCreate(form);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-[#171A21] border-t sm:border border-[#252B37] rounded-t-3xl sm:rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="px-5 py-4 border-b border-[#252B37] flex items-center justify-between">
          <h3 className="font-bold text-base text-[#F8FAFC]">
            Neuer Spieler aufnehmen
          </h3>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-[#11141A] flex items-center justify-center text-[#94A3B8]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-[#94A3B8] mb-1">
                Vorname *
              </label>
              <input
                required
                value={form.firstName}
                onChange={e =>
                  setForm({ ...form, firstName: e.target.value })
                }
                className="w-full min-h-[42px] bg-[#11141A] border border-[#252B37] rounded-2xl px-3.5 py-2 text-sm text-[#F8FAFC]"
              />
            </div>
            <div>
              <label className="block text-xs text-[#94A3B8] mb-1">
                Nachname *
              </label>
              <input
                required
                value={form.lastName}
                onChange={e => setForm({ ...form, lastName: e.target.value })}
                className="w-full min-h-[42px] bg-[#11141A] border border-[#252B37] rounded-2xl px-3.5 py-2 text-sm text-[#F8FAFC]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-[#94A3B8] mb-1">
                Spielername
              </label>
              <input
                value={form.nickname}
                onChange={e => setForm({ ...form, nickname: e.target.value })}
                className="w-full min-h-[42px] bg-[#11141A] border border-[#252B37] rounded-2xl px-3.5 py-2 text-sm text-[#F8FAFC]"
              />
            </div>
            <div>
              <label className="block text-xs text-[#94A3B8] mb-1">
                Persönliche PIN
              </label>
              <input
                required
                maxLength={6}
                value={form.pin}
                onChange={e => setForm({ ...form, pin: e.target.value })}
                className="w-full min-h-[42px] bg-[#11141A] border border-[#252B37] rounded-2xl px-3.5 py-2 text-sm text-[#F8FAFC]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-[#94A3B8] mb-1">
              Mobile / WhatsApp
            </label>
            <input
              value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}
              className="w-full min-h-[42px] bg-[#11141A] border border-[#252B37] rounded-2xl px-3.5 py-2 text-sm text-[#F8FAFC]"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 min-h-[44px] rounded-2xl bg-[#11141A] border border-[#252B37] text-xs font-semibold text-[#94A3B8]"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              className="flex-1 min-h-[44px] rounded-2xl bg-[#10B981] text-[#052016] text-xs font-bold"
            >
              Hinzufügen
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ============================================================================
// MODAL: MONATSABSCHLUSS & AUSLOSUNG
// ============================================================================

function RolloverModal({
  currentSeason,
  nextSeason,
  members,
  membersMap,
  onClose,
  onConfirm
}) {
  const [nextGroupSize, setNextGroupSize] = useState(4);
  const [excusedIds, setExcusedIds] = useState([]);

  const underQuotaPlayers = useMemo(() => {
    const list = [];
    currentSeason.groups.forEach(group => {
      const standings = computeGroupStandings(
        group,
        currentSeason.matches,
        membersMap
      );
      standings.forEach(row => {
        if (!row.fulfilledQuota) {
          list.push({
            ...row,
            groupName: group.name
          });
        }
      });
    });
    return list;
  }, [currentSeason, membersMap]);

  const confirmedNextCount = useMemo(() => {
    const penalized = underQuotaPlayers
      .filter(p => !excusedIds.includes(p.memberId))
      .map(p => p.memberId);
    return members.filter(
      m => m.nextMonthStatus === 'confirmed' && !penalized.includes(m.id)
    ).length;
  }, [members, underQuotaPlayers, excusedIds]);

  const toggleExcuse = id => {
    setExcusedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-[#171A21] border-t sm:border border-[#252B37] rounded-t-3xl sm:rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="px-5 py-4 border-b border-[#252B37] flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-[#F8FAFC]">
              {currentSeason.name} abschliessen
            </h3>
            <p className="text-xs text-[#94A3B8]">
              Auf-/Abstieg & Auslosung für {nextSeason.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-[#11141A] flex items-center justify-center text-[#94A3B8]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-5 text-xs">
          <div>
            <label className="block font-semibold text-[#F8FAFC] mb-2">
              Ziel-Gruppengrösse für {nextSeason.shortName}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[4, 5, 6].map(size => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setNextGroupSize(size)}
                  className={`min-h-[42px] rounded-2xl font-bold border transition ${
                    nextGroupSize === size
                      ? 'bg-[#10B981] text-[#052016] border-[#10B981]'
                      : 'bg-[#11141A] text-[#94A3B8] border-[#252B37]'
                  }`}
                >
                  {size}er Gruppen
                </button>
              ))}
            </div>
            <p className="text-[#94A3B8] mt-2">
              Startberechtigt: <strong className="text-[#F8FAFC]">{confirmedNextCount} Spieler</strong>{' '}
              (ergibt ca. {Math.max(1, Math.round(confirmedNextCount / nextGroupSize))} Gruppen)
            </p>
          </div>

          <div className="space-y-2">
            <span className="font-semibold text-[#F8FAFC] block">
              Pflichtspiele nicht erreicht ({underQuotaPlayers.length})
            </span>
            {underQuotaPlayers.length === 0 ? (
              <p className="p-3.5 rounded-2xl bg-[#10B981]/10 border border-[#10B981]/25 text-[#34D399]">
                Alle Spieler haben ihre Pflichtspiele erfüllt.
              </p>
            ) : (
              <div className="space-y-2">
                {underQuotaPlayers.map(row => {
                  const isExcused = excusedIds.includes(row.memberId);
                  return (
                    <div
                      key={row.memberId}
                      className="p-3.5 rounded-2xl bg-[#11141A] border border-[#252B37] flex items-center justify-between gap-2"
                    >
                      <div>
                        <div className="font-bold text-[#F8FAFC]">
                          {getDisplayName(row.member)} ({row.groupName})
                        </div>
                        <div className="text-[#94A3B8] mt-0.5">
                          {row.played}/{row.requiredMatches} Spiele ·{' '}
                          {isExcused ? (
                            <span className="text-[#34D399]">Ausnahme aktiv</span>
                          ) : (
                            <span className="text-[#FBBF24]">1 Monat Sperre & Abstieg</span>
                          )}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleExcuse(row.memberId)}
                        className={`min-h-[36px] px-3 rounded-xl font-semibold border transition ${
                          isExcused
                            ? 'bg-[#10B981]/15 border-[#10B981]/40 text-[#34D399]'
                            : 'bg-[#171A21] border-[#252B37] text-[#94A3B8]'
                        }`}
                      >
                        {isExcused ? 'Entschuldigt' : 'Entsperren'}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 min-h-[46px] rounded-2xl bg-[#11141A] border border-[#252B37] font-semibold text-[#94A3B8]"
            >
              Abbrechen
            </button>
            <button
              type="button"
              onClick={() => onConfirm({ excusedIds, nextGroupSize })}
              className="flex-1 min-h-[46px] rounded-2xl bg-[#10B981] text-[#052016] font-bold flex items-center justify-center gap-1.5"
            >
              <span>{nextSeason.shortName} auslosen</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// MODAL: PIN-BESTÄTIGUNG (SPIELER-PIN ODER ADMIN-PIN)
// ============================================================================

function PinPromptModal({ prompt, onClose }) {
  const [pin, setPin] = useState('');
  const [err, setErr] = useState('');

  const isPlayerMode = prompt?.mode === 'player';

  const handleSubmit = e => {
    e.preventDefault();
    const cleaned = pin.trim();
    const isValid = isPlayerMode
      ? cleaned === prompt.expectedPin || cleaned === ADMIN_PIN
      : cleaned === ADMIN_PIN;

    if (isValid) {
      const cb = prompt.onSuccess;
      onClose();
      if (cb) cb();
    } else {
      setErr(
        isPlayerMode
          ? `Falsche Spieler-PIN für ${prompt.playerName}.`
          : 'Falsche Admin-PIN.'
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-[#171A21] border-t sm:border border-[#252B37] rounded-t-3xl sm:rounded-3xl w-full max-w-xs p-5 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-[#F8FAFC] flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-[#34D399]" />
            <span>
              {isPlayerMode
                ? `PIN für ${prompt.playerName}`
                : 'Admin-PIN eingeben'}
            </span>
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-[#11141A] flex items-center justify-center text-[#94A3B8]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {prompt?.actionLabel && (
          <p className="text-xs text-[#94A3B8] leading-relaxed">
            Aktion: <strong className="text-[#F8FAFC]">{prompt.actionLabel}</strong>
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="password"
            inputMode="numeric"
            autoFocus
            placeholder="••••"
            value={pin}
            onChange={e => setPin(e.target.value)}
            className="w-full min-h-[48px] bg-[#11141A] border border-[#252B37] rounded-2xl px-3 py-2.5 text-center tracking-widest text-base text-[#F8FAFC] focus:outline-none focus:border-[#10B981]"
          />
          {err && <p className="text-xs text-[#FB7185]">{err}</p>}
          <button
            type="submit"
            className="w-full min-h-[46px] rounded-2xl bg-[#10B981] text-[#052016] text-xs font-bold"
          >
            Bestätigen
          </button>
        </form>
      </div>
    </div>
  );
}
