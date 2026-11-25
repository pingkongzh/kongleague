import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

// ============================================================================
// KONSTANTEN, DESIGN-TOKENS & HELFERFUNKTIONEN
// ============================================================================

const STORAGE_KEYS = {
  players: 'pingkong_connect_players_v1',
  seasons: 'pingkong_connect_seasons_v1',
  currentUserId: 'pingkong_connect_current_user_v1',
  liveCheckins: 'pingkong_connect_live_checkins_v1',
  sessions: 'pingkong_connect_sessions_v1',
  connectMatches: 'pingkong_connect_matches_v1',
  rankingFilters: 'pingkong_connect_ranking_filters_v1',
};

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

const LIVE_STATUS_OPTIONS = [
  { id: 'buddy_wanted', label: 'Spielbuddy gesucht', badgeClass: 'border-emerald-500/40 bg-emerald-950/35 text-emerald-300' },
  { id: 'hall_empty', label: 'Halle leer', badgeClass: 'border-[#6FB3A2]/40 bg-[#152622] text-[#A8D0B1]' },
  { id: 'has_buddy', label: 'Habe bereits einen Buddy', badgeClass: 'border-[#2E323B] bg-[#181A1E] text-[#D1D5DB]' },
];

const LIVE_DURATION_CHIPS = [
  { id: '30m', label: '30 Min.', minutes: 30 },
  { id: '1h', label: '1 Std.', minutes: 60 },
  { id: '1.5h', label: '1,5 Std.', minutes: 90 },
  { id: '2h', label: '2 Std.', minutes: 120 },
  { id: 'until22', label: 'bis 22:00', minutes: 'until22' },
];

const SPONTANEOUS_TODAY_TIME_CHIPS = [
  'Jetzt sofort',
  'Heute · 17:30',
  'Heute · 18:30',
  'Heute · 19:30',
  'Heute · 20:30',
];

const SPONTANEOUS_TODAY_FOCUS_CHIPS = [
  'Lockeres Einspielen',
  'Sätze & Matchpraxis',
  'Aufschlag & Rückschlag',
  'Balleimer / Topspin',
];

/**
 * Berechnet den Zielzeitstempel (`expiresAt`) für die gewählte Dauer.
 * Unterstützt Minutenwerte sowie 'until22' (heute 22:00 Uhr, falls bereits nach 22:00 auf morgen 22:00).
 */
function computeExpiresAt(durationInput) {
  const now = new Date();
  if (durationInput === 'until22') {
    const target = new Date(now);
    target.setHours(22, 0, 0, 0);
    if (target.getTime() <= now.getTime()) {
      target.setDate(target.getDate() + 1);
    }
    return target.getTime();
  }
  const minutes = typeof durationInput === 'number' ? durationInput : 90;
  return now.getTime() + minutes * 60 * 1000;
}

/**
 * Formatiert eine Ablaufzeit als kompaktes Zeit-Label (z. B. "bis 17:00" oder "bis 22:00").
 */
function formatExpiryClockLabel(expiresAt) {
  if (!expiresAt) return 'Spontan heute';
  const d = new Date(expiresAt);
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `bis ${hh}:${mm}`;
}

/**
 * Formatiert die verbleibende Restlaufzeit ab `nowMs` für Live-Badges.
 */
function formatRemainingDuration(expiresAt, nowMs = Date.now()) {
  if (!expiresAt) return 'Aktiv';
  const diffMs = Math.max(0, expiresAt - nowMs);
  const totalMinutes = Math.ceil(diffMs / 60000);
  if (totalMinutes <= 0) return '0 Min.';
  if (totalMinutes < 60) return `${totalMinutes} Min.`;
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  return mins > 0 ? `${hours} Std. ${mins} Min.` : `${hours} Std.`;
}

function readStorageJson(key, fallback) {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function writeStorageJson(key, value) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignorieren falls Quota voll oder Storage blockiert ist
  }
}

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
    return {
      valid: false,
      error: 'Bitte WhatsApp-Telefonnummer mit Ländervorwahl eingeben (z. B. +41 79 123 45 67).',
    };
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
        {hint.status === 'warning' ? (
          <span className="shrink-0">⚠️</span>
        ) : hint.status === 'valid' ? (
          <span className="shrink-0">✓</span>
        ) : null}
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

// ============================================================================
// INITIALDATEN
// ============================================================================

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
    typicalHallDays: ['Do', 'So'],
  },
  {
    id: 'p9',
    firstName: 'Jan',
    lastName: 'Weber',
    nickname: 'LoopKingJan',
    pin: '1234',
    avatarUrl:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=160&q=80',
    phone: '+41 79 901 11 22',
    sttClass: 'B13',
    language: 'Deutsch',
    playstyle: 'Offensiv',
    connectOnly: false,
    isNewMember: false,
    joinedLabel: '2020',
    typicalHallDays: ['Mo', 'Do'],
  },
  {
    id: 'p10',
    firstName: 'Mia',
    lastName: 'Schmid',
    nickname: 'FlickMia',
    pin: '1234',
    avatarUrl:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=160&q=80',
    phone: '+41 79 902 22 33',
    sttClass: 'C10',
    language: 'Beides',
    playstyle: 'Offensiv',
    connectOnly: false,
    isNewMember: false,
    joinedLabel: '2022',
    typicalHallDays: ['Di', 'Fr'],
  },
  {
    id: 'p11',
    firstName: 'Noah',
    lastName: 'Fischer',
    nickname: 'BlockNoah',
    pin: '1234',
    avatarUrl:
      'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=160&q=80',
    phone: '+41 79 903 33 44',
    sttClass: 'C6',
    language: 'Deutsch',
    playstyle: 'Allround',
    connectOnly: true,
    isNewMember: false,
    joinedLabel: '2023',
    typicalHallDays: ['Mi', 'Sa'],
  },
  {
    id: 'p12',
    firstName: 'Laura',
    lastName: 'Huber',
    nickname: 'CutLaura',
    pin: '1234',
    avatarUrl:
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=160&q=80',
    phone: '+41 79 904 44 55',
    sttClass: 'D5',
    language: 'Deutsch',
    playstyle: 'Abwehr / Noppen',
    connectOnly: false,
    isNewMember: false,
    joinedLabel: '2021',
    typicalHallDays: ['Mo', 'Mi'],
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

const buildInitialLiveCheckins = () => {
  const now = Date.now();
  return [
    {
      id: 'lc1',
      playerId: 'p3',
      durationLabel: '1,5 Std.',
      hallStatus: 'buddy_wanted',
      expiresAt: now + 75 * 60 * 1000,
      note: 'Suche Partner für ein paar Sätze & Einspielen',
      checkedInAt: 'vor 15 Min.',
      comingTooIds: ['p4'],
    },
    {
      id: 'lc2',
      playerId: 'p7',
      durationLabel: '1 Std.',
      hallStatus: 'hall_empty',
      expiresAt: now + 45 * 60 * 1000,
      note: 'Tische sind frei – wer kommt spontan vorbei?',
      checkedInAt: 'vor 12 Min.',
      comingTooIds: [],
    },
  ];
};

const buildInitialSessions = () => {
  const now = Date.now();
  return [
    {
      id: 's1',
      type: 'spontaneous',
      authorId: 'p1',
      dateLabel: 'Heute · 18:30',
      expiresAt: now + 3.5 * 60 * 60 * 1000,
      note: 'Lockeres Einspielen – noch 1 Platz frei!',
      joinedIds: ['p1'],
      createdAt: 'vor 20 Min.',
    },
    {
      id: 's2',
      type: 'spontaneous',
      authorId: 'p4',
      dateLabel: 'Heute · 19:30',
      expiresAt: now + 4.5 * 60 * 60 * 1000,
      note: 'Sätze & Matchpraxis für heute Abend.',
      joinedIds: ['p4', 'p2'],
      createdAt: 'vor 35 Min.',
    },
  ];
};

const INITIAL_CONNECT_MATCHES = [
  {
    id: 'cm1',
    player1Id: 'p1',
    player2Id: 'p7',
    winnerId: 'p1',
    score: '3:1',
    dateLabel: 'Gestern',
  },
  {
    id: 'cm2',
    player1Id: 'p2',
    player2Id: 'p3',
    winnerId: 'p3',
    score: '3:2',
    dateLabel: 'Vor 2 Tagen',
  },
  {
    id: 'cm3',
    player1Id: 'p4',
    player2Id: 'p8',
    winnerId: 'p4',
    score: '3:0',
    dateLabel: 'Vor 3 Tagen',
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
  { id: 'Morgen', label: 'Morgen' },
  { id: 'Nachmittag', label: 'Nachmittag' },
  { id: 'Abend', label: 'Abend' },
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
        extra.durationLabel || 'in der Halle'
      }). Ich komme auch vorbei!`;
    case 'new_member':
      return `Hoi ${targetName}, herzlich willkommen im Club! Ich bin ${myName} – hast du Lust, demnächst mal zusammen ein paar Bälle zu schlagen?`;
    case 'hall_day':
      return `Hoi ${targetName}, ich bin ${myName} – habe gesehen du bist oft am ${
        extra.day || ''
      }${
        extra.timeSlot ? ` (${extra.timeSlot})` : ''
      } in der Halle. Wollen wir uns mal für ein paar Sätze verabreden?`;
    case 'rating_directory':
      return `Hoi ${targetName}, ich bin ${myName} aus unserem Tischtennis-Club – hast du demnächst mal Lust auf ein freies CLUB-Match in der Halle?`;
    case 'rematch':
      return `Hoi ${targetName}, danke nochmals für unser letztes Match (${
        extra.score || ''
      })! Wann spielen wir die Revanche in der Halle?`;
    case 'session_join':
      return `Hoi ${targetName}, ich bin ${myName} – habe deine Spontan-Session (${
        extra.dateLabel || 'heute'
      }) gesehen und wäre gern dabei!`;
    default:
      return `Hoi ${targetName}, ich bin ${myName} aus unserem Tischtennis-Club!`;
  }
}

function WhatsAppIcon({ className = 'h-3.5 w-3.5' }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="currentColor"
      aria-hidden="true"
      className={`${className} shrink-0`}
    >
      <path d="M16.004 3.2c-7.06 0-12.8 5.736-12.8 12.796 0 2.256.592 4.46 1.716 6.4L3.1 29.02l6.8-1.784a12.74 12.74 0 0 0 6.104 1.556h.004c7.056 0 12.792-5.736 12.792-12.796 0-3.416-1.332-6.628-3.748-9.044A12.71 12.71 0 0 0 16.004 3.2Zm0 23.432h-.004a10.6 10.6 0 0 1-5.404-1.48l-.388-.232-4.036 1.06 1.076-3.936-.252-.404a10.57 10.57 0 0 1-1.624-5.644c0-5.864 4.772-10.636 10.636-10.636 2.84 0 5.508 1.108 7.516 3.116a10.56 10.56 0 0 1 3.112 7.52c0 5.864-4.772 10.636-10.632 10.636Zm5.832-7.964c-.32-.16-1.892-.932-2.184-1.04-.292-.108-.504-.16-.716.16-.212.32-.824 1.04-1.012 1.252-.184.212-.372.24-.692.08-.32-.16-1.352-.496-2.572-1.584-.952-.848-1.592-1.896-1.78-2.216-.184-.32-.02-.492.14-.652.144-.144.32-.372.48-.56.16-.184.212-.32.32-.532.108-.212.052-.4-.028-.56-.08-.16-.716-1.728-.984-2.368-.26-.62-.52-.536-.716-.548h-.612c-.212 0-.56.08-.852.4-.292.32-1.116 1.092-1.116 2.66 0 1.568 1.144 3.084 1.304 3.296.16.212 2.248 3.432 5.444 4.812.76.328 1.352.524 1.816.672.764.244 1.46.208 2.008.128.612-.092 1.892-.772 2.16-1.52.268-.748.268-1.388.188-1.52-.08-.132-.292-.212-.612-.372Z" />
    </svg>
  );
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
      className={`inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg bg-[#1F3A2E] font-bold text-[#25D366] ring-1 ring-[#25D366]/35 transition hover:bg-[#27493A] hover:text-emerald-200 ${
        compact ? 'px-2 py-1 text-[10px]' : 'px-2.5 py-1.5 text-[11px]'
      }`}
    >
      <WhatsAppIcon className={compact ? 'h-3.5 w-3.5' : 'h-4 w-4'} />
      {label && <span className="text-emerald-300">{label}</span>}
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
            0%, 100% { transform: translateY(0px) scale(1, 1); }
            45% { transform: translateY(-7px) scale(1.035, 1.045); }
            75% { transform: translateY(2px) scale(1.02, 0.985); }
          }
          @keyframes pingkongHeadAssert {
            0%, 100% { transform: rotate(0deg) translate(0px, 0px); }
            30% { transform: rotate(-7deg) translate(-1.5px, -2px); }
            65% { transform: rotate(4deg) translate(1px, 1.5px); }
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
          <polygon points="42.4,15.6 56.0,21.0 32.8,96.6 4.0,96.6" fill="currentColor" />
          <polygon points="40.6,72.4 49.4,74.8 47.0,96.6 35.6,96.6" fill="currentColor" />
          <polygon points="56.6,31.2 66.8,54.6 78.6,56.6 64.0,74.8 42.0,69.6" fill="currentColor" />
          <polygon points="80.8,58.8 92.6,68.2 78.4,84.4 81.4,96.6 71.8,96.6 66.2,78.0" fill="currentColor" />
          <polygon points="93.2,71.4 96.4,96.6 88.2,96.6 81.6,84.6" fill="currentColor" />
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
              <li>• Sieh per 1-Tap LIVE, wer gerade in der Halle steht</li>
              <li>• Starte spontane Sessions &amp; trage freie Partien ein</li>
              <li>• Finde Trainingspartner nach Spielstärke, Spielstil, Sprache &amp; Hallentagen</li>
              <li>• Sammle Punkte im freien CLUB-Rating – ganz ohne Ligapflicht</li>
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

// ============================================================================
// AUTH / REGISTRIERUNG (KEINE VORAUSGEWÄHLTEN HALLENTAGE)
// ============================================================================

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
  const [leagueJoinTiming, setLeagueJoinTiming] = useState('next');
  const [avatarUrl, setAvatarUrl] = useState('');
  // Bewusst leer: keine vorausgewählten Hallentage bei der Registrierung
  const [hallSchedule, setHallSchedule] = useState({});

  const [pendingProfile, setPendingProfile] = useState(null);
  const [loginPin, setLoginPin] = useState('');
  const [loginPinError, setLoginPinError] = useState('');
  const [viewportBox, setViewportBox] = useState({ height: null, offsetTop: 0 });
  const pinInputRef = useRef(null);

  useEffect(() => {
    if (!(mode === 'select' && pendingProfile)) {
      setViewportBox({ height: null, offsetTop: 0 });
      return;
    }

    const prevHtmlOverflow = document.documentElement.style.overflow;
    const prevBodyOverflow = document.body.style.overflow;
    const prevBodyPosition = document.body.style.position;
    const prevBodyWidth = document.body.style.width;
    const prevBodyTop = document.body.style.top;
    const prevBodyOverscroll = document.body.style.overscrollBehavior;

    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.top = '0px';
    document.body.style.overscrollBehavior = 'none';

    const lockScroll = () => {
      if (window.scrollY !== 0 || window.scrollX !== 0) {
        window.scrollTo(0, 0);
      }
    };

    const preventTouchMove = (e) => {
      e.preventDefault();
    };

    const updateViewport = () => {
      lockScroll();
      const vv = window.visualViewport;
      if (vv) {
        setViewportBox({ height: vv.height, offsetTop: vv.offsetTop });
      } else {
        setViewportBox({ height: window.innerHeight, offsetTop: 0 });
      }
    };

    updateViewport();
    const t1 = setTimeout(updateViewport, 120);
    const t2 = setTimeout(updateViewport, 320);

    const vv = window.visualViewport;
    if (vv) {
      vv.addEventListener('resize', updateViewport);
      vv.addEventListener('scroll', updateViewport);
    }
    window.addEventListener('resize', updateViewport);
    window.addEventListener('scroll', lockScroll, { passive: true });
    document.addEventListener('touchmove', preventTouchMove, { passive: false });

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      if (vv) {
        vv.removeEventListener('resize', updateViewport);
        vv.removeEventListener('scroll', updateViewport);
      }
      window.removeEventListener('resize', updateViewport);
      window.removeEventListener('scroll', lockScroll);
      document.removeEventListener('touchmove', preventTouchMove);

      document.documentElement.style.overflow = prevHtmlOverflow;
      document.body.style.overflow = prevBodyOverflow;
      document.body.style.position = prevBodyPosition;
      document.body.style.width = prevBodyWidth;
      document.body.style.top = prevBodyTop;
      document.body.style.overscrollBehavior = prevBodyOverscroll;
    };
  }, [mode, pendingProfile]);

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
    verifyPinAndUnlock(pendingProfile, loginPin);
  };

  const isMobilePinFocus = mode === 'select' && Boolean(pendingProfile);

  return (
    <div
      style={
        isMobilePinFocus && viewportBox.height
          ? {
              height: `${viewportBox.height}px`,
              top: `${viewportBox.offsetTop}px`,
              colorScheme: 'dark',
            }
          : { colorScheme: 'dark' }
      }
      className={`overflow-x-hidden bg-[#060708] px-3.5 text-[#F3F4F6] sm:px-4 ${
        mode === 'select' && !pendingProfile
          ? 'flex h-[100dvh] flex-col overflow-hidden py-3 sm:min-h-screen sm:h-auto sm:overflow-visible sm:py-6'
          : isMobilePinFocus
          ? 'fixed inset-x-0 top-0 z-50 flex touch-none items-center justify-center overflow-hidden overscroll-none p-4 sm:static sm:h-auto sm:min-h-screen sm:touch-auto sm:py-6'
          : 'min-h-screen py-3 sm:py-6'
      }`}
    >
      <style>{`
        :root { color-scheme: dark; }
        .pk-dark-scroll {
          color-scheme: dark;
          scrollbar-width: thin;
          scrollbar-color: #2B2F37 #0F1114;
        }
        .pk-dark-scroll::-webkit-scrollbar { width: 4px; height: 4px; }
        .pk-dark-scroll::-webkit-scrollbar-track { background: #0F1114; border-radius: 9999px; }
        .pk-dark-scroll::-webkit-scrollbar-thumb { background: #2B2F37; border-radius: 9999px; }
        @media (max-width: 639px) {
          .pk-mobile-nozoom-wrap { height: 36px; overflow: hidden; }
          .pk-mobile-nozoom-input {
            font-size: 16px !important;
            line-height: 20px !important;
            width: 123.08% !important;
            transform: scale(0.8125);
            transform-origin: left top;
            padding-top: 10px !important;
            padding-bottom: 10px !important;
          }
          .pk-mobile-pin-input {
            font-size: 16px !important;
            line-height: 20px !important;
            width: 133.33% !important;
            transform: scale(0.75);
            transform-origin: left top;
            padding-top: 12px !important;
            padding-bottom: 12px !important;
          }
        }
      `}</style>
      <div
        className={`mx-auto flex w-full max-w-md flex-col overflow-x-hidden ${
          mode === 'select' && !pendingProfile
            ? 'min-h-0 flex-1 space-y-2.5 sm:flex-initial sm:space-y-4'
            : 'space-y-2.5 sm:space-y-4'
        }`}
      >
        <div
          className={`shrink-0 rounded-2xl border border-[#22252B] bg-[#121417] px-4 py-3.5 text-center sm:rounded-3xl sm:px-6 sm:py-6 ${
            mode === 'select' && pendingProfile ? 'hidden sm:block' : ''
          }`}
        >
          <div className="flex flex-col items-center">
            <PingkongFullLogo className="w-32 max-w-full sm:w-36" customSrc={customLogoUrl} />

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

        <div
          className={`grid shrink-0 grid-cols-2 gap-1.5 rounded-2xl border border-[#24272E] bg-[#14161A] p-1 sm:p-1.5 ${
            mode === 'select' && pendingProfile ? 'hidden sm:grid' : ''
          }`}
        >
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
          <div
            className={`flex flex-col gap-2.5 rounded-2xl border border-[#24272E] bg-[#14161A] p-3 sm:flex-initial sm:gap-3 sm:p-4 ${
              pendingProfile ? '' : 'min-h-0 flex-1'
            }`}
          >
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
                    ref={pinInputRef}
                    type="password"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={4}
                    autoFocus
                    required
                    value={loginPin}
                    onFocus={() => {
                      requestAnimationFrame(() => window.scrollTo(0, 0));
                      setTimeout(() => window.scrollTo(0, 0), 250);
                    }}
                    onChange={(e) => handlePinInputChange(e.target.value)}
                    placeholder="••••"
                    className="w-full rounded-xl border border-[#2B2F37] bg-[#0F1114] px-3 py-2.5 text-center text-base font-black tracking-[0.4em] text-[#F4ECC2] focus:border-[#6FB3A2] focus:outline-none"
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

                <div className="pk-dark-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain pr-0.5 sm:max-h-[420px] sm:flex-initial">
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
                            requestAnimationFrame(() => {
                              pinInputRef.current?.focus({ preventScroll: true });
                            });
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
                Du teilst dir nur deinen 4-stelligen PIN zu.
              </p>
            </div>

            <div className="space-y-2 rounded-2xl border border-[#2B2F37] bg-[#0F1114] p-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider text-[#F4ECC2]">
                  1. Wie möchtest du mitmachen? *
                </span>
                <span className="text-[10px] text-[#8E95A2]">Jederzeit änderbar</span>
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
                  <div className="mt-2 text-xs font-black text-[#F3F4F6]">Nur CLUB</div>
                  <div className="mt-0.5 text-[10px] leading-snug text-[#9CA3AF]">
                    Halle, Spontan-Sessions &amp; freie Spiele – ohne Monatsliga
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
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#A8D0B1]">
                2. Profil-Pflichtfelder (*)
              </span>
              <span className="text-[10px] text-[#8E95A2]">Inkl. eigenem 4-stelligen PIN</span>
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
                onClick={() => setNickname(generateFunnyNickname(firstName, nickname))}
                className="inline-flex shrink-0 items-center justify-center gap-1 rounded-xl border border-[#DE754B]/40 bg-[#23140F] px-3 py-2 text-[11px] font-bold text-[#F4ECC2] transition hover:border-[#DE754B] hover:bg-[#2F1B14]"
              >
                <span>🎲</span>
                <span>Vorschlag</span>
              </button>
            </div>

            <WhatsAppPhoneField
              value={phone}
              onChange={setPhone}
              required
              placeholder="+41 79 123 45 67"
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
              <div className="mb-1 flex items-center justify-between">
                <label className="text-[11px] font-semibold text-[#8E95A2]">
                  Typische Hallentage &amp; Tageszeit (min. 1 Tag) *
                </label>
                <span className="text-[10px] text-[#6B7280]">Keine Vorauswahl</span>
              </div>
              <HallSchedulePicker schedule={hallSchedule} onChange={setHallSchedule} />
            </div>

            <div className="rounded-xl border border-[#DE754B]/40 bg-[#0F1114] p-2.5">
              <label className="mb-1.5 block text-[11px] font-bold text-[#F4ECC2]">
                Eigenen 4-stelligen Profil-PIN festlegen *
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div className="pk-mobile-nozoom-wrap w-full overflow-hidden rounded-xl border border-[#2B2F37] bg-[#14161A]">
                  <input
                    type="password"
                    inputMode="numeric"
                    maxLength={4}
                    required
                    value={pin}
                    onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    placeholder="PIN (4 Ziffern) *"
                    className="pk-mobile-pin-input w-full bg-transparent px-2.5 py-2 text-center text-xs font-black tracking-[0.2em] placeholder:font-semibold placeholder:tracking-normal text-[#F4ECC2] focus:outline-none"
                  />
                </div>
                <div className="pk-mobile-nozoom-wrap w-full overflow-hidden rounded-xl border border-[#2B2F37] bg-[#14161A]">
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
                    className="pk-mobile-pin-input w-full bg-transparent px-2.5 py-2 text-center text-xs font-black tracking-[0.2em] placeholder:font-semibold placeholder:tracking-normal text-[#F4ECC2] focus:outline-none"
                  />
                </div>
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

// ============================================================================
// MITGLIED-DETAIL-MODAL
// ============================================================================

function MemberDetailModal({
  player,
  currentUser,
  playersById,
  activeSeason,
  seasons,
  ratingInfo,
  connectMatches,
  liveCheckin,
  nowMs,
  onRecordMatch,
  onClose,
}) {
  if (!player) return null;

  const isMe = player.id === currentUser.id;
  const scheduleSummary = formatHallScheduleSummary(player);
  const league = activeSeason?.leagues?.find((l) => l.playerIds.includes(player.id));

  const memberMetrics = useMemo(() => {
    const playerConnectGames = connectMatches.filter(
      (m) => m.player1Id === player.id || m.player2Id === player.id
    );
    const recentConnectGames = playerConnectGames.slice(0, 3);

    let streakType = null;
    let streakCount = 0;
    for (const m of playerConnectGames) {
      const won = m.winnerId === player.id;
      const outcome = won ? 'W' : 'L';
      if (streakType === null) {
        streakType = outcome;
        streakCount = 1;
      } else if (streakType === outcome) {
        streakCount += 1;
      } else {
        break;
      }
    }

    const formBadges = playerConnectGames
      .slice(0, 5)
      .map((m) => (m.winnerId === player.id ? 'S' : 'N'));

    let myWins = 0;
    let theirWins = 0;
    connectMatches.forEach((m) => {
      const involvesBoth =
        (m.player1Id === currentUser.id && m.player2Id === player.id) ||
        (m.player1Id === player.id && m.player2Id === currentUser.id);
      if (!involvesBoth) return;
      if (m.winnerId === currentUser.id) myWins += 1;
      else if (m.winnerId === player.id) theirWins += 1;
    });

    let leagueWins = 0;
    let leagueLosses = 0;
    (seasons || []).forEach((s) => {
      (s.matches || []).forEach((m) => {
        if (m.score1 === null || m.score2 === null) return;
        const p1Won = m.score1 > m.score2;
        if (m.player1Id === player.id) {
          if (p1Won) leagueWins += 1;
          else leagueLosses += 1;
        } else if (m.player2Id === player.id) {
          if (!p1Won) leagueWins += 1;
          else leagueLosses += 1;
        }

        const involvesBoth =
          (m.player1Id === currentUser.id && m.player2Id === player.id) ||
          (m.player1Id === player.id && m.player2Id === currentUser.id);
        if (involvesBoth) {
          const iAmP1 = m.player1Id === currentUser.id;
          const iWon = (iAmP1 && p1Won) || (!iAmP1 && !p1Won);
          if (iWon) myWins += 1;
          else theirWins += 1;
        }
      });
    });

    const mySchedule = getNormalizedHallSchedule(currentUser);
    const theirSchedule = getNormalizedHallSchedule(player);
    const sharedDays = DAYS_OF_WEEK.filter(
      (d) => (mySchedule[d] || []).length > 0 && (theirSchedule[d] || []).length > 0
    );

    const totalGames = (ratingInfo?.played || 0) + leagueWins + leagueLosses;
    const totalWins = (ratingInfo?.wins || 0) + leagueWins;
    const winRate = totalGames > 0 ? Math.round((totalWins / totalGames) * 100) : null;

    return {
      recentConnectGames,
      streakType,
      streakCount,
      formBadges,
      myWins,
      theirWins,
      h2hTotal: myWins + theirWins,
      leagueWins,
      leagueLosses,
      sharedDays,
      totalGames,
      winRate,
    };
  }, [connectMatches, seasons, currentUser, player, ratingInfo]);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 p-3 backdrop-blur-xs sm:items-center"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-h-[88dvh] w-full max-w-md space-y-3 overflow-y-auto rounded-2xl border border-[#6FB3A2]/45 bg-[#14161A] p-4 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <PlayerAvatar
              player={player}
              sizeClass="h-14 w-14 text-base"
              isConnectAccent={player.connectOnly}
            />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1.5">
                <h3 className="truncate text-base font-black text-[#F3F4F6]">
                  {player.nickname}
                </h3>
                {liveCheckin && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-black text-emerald-300 ring-1 ring-emerald-500/40">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                    LIVE · {formatRemainingDuration(liveCheckin.expiresAt, nowMs)}
                  </span>
                )}
              </div>
              <div className="truncate text-xs text-[#9CA3AF]">
                {player.firstName} {player.lastName}
              </div>
              <div className="mt-1.5">
                <PlayerBadge
                  player={player}
                  season={activeSeason}
                  ratingInfo={ratingInfo}
                />
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-lg bg-[#202329] px-2.5 py-1 text-xs font-bold text-[#9CA3AF] hover:text-[#F4ECC2]"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <div className="rounded-xl border border-[#24272E] bg-[#0F1114] p-2.5 text-center">
            <div className="text-[9px] font-bold uppercase tracking-wider text-[#8E95A2]">
              Rating
            </div>
            <div className="mt-0.5 text-sm font-black text-[#F4ECC2]">
              {ratingInfo?.tier?.symbol} {ratingInfo?.elo || 1200}
            </div>
            <div className="text-[10px] font-semibold text-[#A8D0B1]">
              {ratingInfo?.tier?.label || 'Rookie'}
            </div>
          </div>

          <div className="rounded-xl border border-[#24272E] bg-[#0F1114] p-2.5 text-center">
            <div className="text-[9px] font-bold uppercase tracking-wider text-[#8E95A2]">
              Siegquote
            </div>
            <div className="mt-0.5 text-sm font-black text-[#F3F4F6]">
              {memberMetrics.winRate !== null ? `${memberMetrics.winRate}%` : '–'}
            </div>
            <div className="text-[10px] text-[#8E95A2]">
              {ratingInfo?.wins || 0}S / {ratingInfo?.losses || 0}N
            </div>
          </div>

          <div className="rounded-xl border border-[#24272E] bg-[#0F1114] p-2.5 text-center">
            <div className="text-[9px] font-bold uppercase tracking-wider text-[#8E95A2]">
              {isMe ? 'Aktuelle Form' : 'Duell vs. Dich'}
            </div>
            <div className="mt-0.5 text-sm font-black text-[#6FB3A2]">
              {isMe
                ? memberMetrics.streakCount > 0
                  ? `${memberMetrics.streakCount}× ${
                      memberMetrics.streakType === 'W' ? 'Sieg' : 'Nied.'
                    }`
                  : '–'
                : `${memberMetrics.myWins} : ${memberMetrics.theirWins}`}
            </div>
            <div className="text-[10px] text-[#8E95A2]">
              {isMe
                ? `${ratingInfo?.played || 0} Partien`
                : memberMetrics.h2hTotal === 0
                ? 'Noch kein Duell'
                : `${memberMetrics.h2hTotal}× gespielt`}
            </div>
          </div>

          <div className="rounded-xl border border-[#24272E] bg-[#0F1114] p-2.5 text-center">
            <div className="text-[9px] font-bold uppercase tracking-wider text-[#8E95A2]">
              {isMe ? 'Spiele gesamt' : 'Überschneidung'}
            </div>
            <div className="mt-0.5 text-sm font-black text-[#DE754B]">
              {isMe
                ? `${memberMetrics.totalGames}`
                : memberMetrics.sharedDays.length > 0
                ? memberMetrics.sharedDays.join(', ')
                : '–'}
            </div>
            <div className="text-[10px] text-[#8E95A2]">
              {isMe
                ? 'CLUB & LEAGUE'
                : memberMetrics.sharedDays.length > 0
                ? 'Gleiche Hallentage'
                : 'Andere Tage'}
            </div>
          </div>
        </div>

        <div className="space-y-1.5 rounded-xl border border-[#24272E] bg-[#0F1114] p-3 text-xs">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[#8E95A2]">Spielstärke &amp; Stil</span>
            <span className="font-bold text-[#F3F4F6]">
              {player.sttClass || 'Hobby'} · {player.playstyle || 'Allround'}
            </span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-[#8E95A2]">Sprache</span>
            <span className="font-bold text-[#A8D0B1]">
              {player.language || 'Deutsch'}
            </span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-[#8E95A2]">Liga-Status</span>
            <span className="font-bold text-[#F4ECC2]">
              {league
                ? `${league.name} (${memberMetrics.leagueWins}S / ${memberMetrics.leagueLosses}N gesamt)`
                : 'Nur CLUB'}
            </span>
          </div>
          <div className="flex items-start justify-between gap-3">
            <span className="shrink-0 text-[#8E95A2]">Hallentage</span>
            <span className="text-right font-bold text-[#F4ECC2]">
              {scheduleSummary || 'Keine festen Tage hinterlegt'}
            </span>
          </div>

          {memberMetrics.formBadges.length > 0 && (
            <div className="flex items-center justify-between gap-2 border-t border-[#1D2026] pt-1.5">
              <span className="text-[#8E95A2]">Letzte Form</span>
              <div className="flex items-center gap-1">
                {memberMetrics.formBadges.map((res, idx) => (
                  <span
                    key={idx}
                    className={`flex h-5 w-5 items-center justify-center rounded text-[10px] font-black ${
                      res === 'S'
                        ? 'bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/35'
                        : 'bg-rose-500/20 text-rose-300 ring-1 ring-rose-500/35'
                    }`}
                  >
                    {res}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {memberMetrics.recentConnectGames.length > 0 && (
          <div className="space-y-1.5 rounded-xl border border-[#24272E] bg-[#0F1114] p-3">
            <div className="text-[10px] font-black uppercase tracking-wider text-[#8E95A2]">
              Letzte CLUB-Partien
            </div>
            <div className="space-y-1">
              {memberMetrics.recentConnectGames.map((m) => {
                const oppId = m.player1Id === player.id ? m.player2Id : m.player1Id;
                const opp = playersById?.[oppId];
                const won = m.winnerId === player.id;
                return (
                  <div
                    key={m.id}
                    className="flex items-center justify-between text-[11px]"
                  >
                    <span className="truncate text-[#D1D5DB]">
                      vs. <strong className="text-[#F3F4F6]">{opp?.nickname || 'Spieler'}</strong>{' '}
                      <span className="text-[10px] text-[#6B7280]">({m.dateLabel})</span>
                    </span>
                    <span
                      className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-black ${
                        won
                          ? 'bg-emerald-500/15 text-emerald-300'
                          : 'bg-rose-500/15 text-rose-300'
                      }`}
                    >
                      {won ? 'Sieg' : 'Nied.'} · {m.score}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {!isMe && (
          <div className="grid grid-cols-2 gap-2 pt-0.5">
            <button
              type="button"
              onClick={() => {
                onClose();
                onRecordMatch(player.id);
              }}
              className="rounded-xl bg-[#6FB3A2] py-2.5 text-xs font-black text-[#060708] transition hover:bg-[#82C1B1]"
            >
              + Spontan Partie
            </button>
            <a
              href={buildWhatsAppLink(
                player.phone,
                getContextWhatsAppMessage('rating_directory', currentUser, player)
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 rounded-xl bg-[#1F3A2E] py-2.5 text-xs font-bold text-emerald-300 ring-1 ring-[#25D366]/35 transition hover:bg-[#27493A]"
            >
              <WhatsAppIcon className="h-4 w-4 text-[#25D366]" />
              <span>WhatsApp</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// LIVE CHECK-IN MODAL (DAUER-CHIPS & HALLEN-STATUS-CHIPS)
// ============================================================================

function LiveCheckInModal({
  currentUser,
  existingCheckin,
  onSave,
  onCheckOut,
  onClose,
}) {
  const [selectedDurationId, setSelectedDurationId] = useState('1.5h');
  const [hallStatus, setHallStatus] = useState(
    existingCheckin?.hallStatus || 'buddy_wanted'
  );
  const [note, setNote] = useState(existingCheckin?.note || '');

  const chosenDuration =
    LIVE_DURATION_CHIPS.find((d) => d.id === selectedDurationId) ||
    LIVE_DURATION_CHIPS[2];

  const handleSubmit = (e) => {
    e.preventDefault();
    const expiresAt = computeExpiresAt(chosenDuration.minutes);
    const statusObj =
      LIVE_STATUS_OPTIONS.find((s) => s.id === hallStatus) || LIVE_STATUS_OPTIONS[0];

    onSave({
      durationLabel: chosenDuration.label,
      hallStatus,
      expiresAt,
      note: note.trim() || statusObj.label,
    });
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 p-3 backdrop-blur-xs sm:items-center"
    >
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md space-y-3.5 rounded-2xl border border-[#6FB3A2]/45 bg-[#14161A] p-4 shadow-2xl"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-400" />
            <h3 className="text-sm font-black text-[#F3F4F6]">
              {existingCheckin ? 'LIVE Check-in aktualisieren' : 'LIVE in die Halle einchecken'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-[#202329] px-2.5 py-1 text-xs font-bold text-[#9CA3AF] hover:text-[#F4ECC2]"
          >
            ✕
          </button>
        </div>

        <div>
          <label className="mb-1.5 block text-[11px] font-semibold text-[#8E95A2]">
            1. Für wie lange bist du in der Halle?
          </label>
          <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-5">
            {LIVE_DURATION_CHIPS.map((dur) => {
              const active = selectedDurationId === dur.id;
              return (
                <button
                  key={dur.id}
                  type="button"
                  onClick={() => setSelectedDurationId(dur.id)}
                  className={`rounded-xl py-2 text-[11px] font-black transition ${
                    active
                      ? 'bg-[#6FB3A2] text-[#060708] shadow-sm'
                      : 'border border-[#2B2F37] bg-[#0F1114] text-[#D1D5DB] hover:border-[#6FB3A2]/50'
                  }`}
                >
                  {dur.label}
                </button>
              );
            })}
          </div>
          <div className="mt-1 text-[10px] text-[#8E95A2]">
            Automatischer Check-out um{' '}
            <span className="font-bold text-[#A8D0B1]">
              {formatExpiryClockLabel(computeExpiresAt(chosenDuration.minutes))}
            </span>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-[11px] font-semibold text-[#8E95A2]">
            2. Hallen- &amp; Buddy-Status
          </label>
          <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-3">
            {LIVE_STATUS_OPTIONS.map((st) => {
              const active = hallStatus === st.id;
              return (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => setHallStatus(st.id)}
                  className={`rounded-xl border px-2.5 py-2 text-left text-[11px] font-bold transition ${
                    active
                      ? 'border-[#6FB3A2] bg-[#152622] text-[#F3F4F6] ring-1 ring-[#6FB3A2]/50'
                      : 'border-[#262A32] bg-[#0F1114] text-[#9CA3AF] hover:text-[#F3F4F6]'
                  }`}
                >
                  <span className="block truncate">{st.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="mb-1 block text-[11px] font-semibold text-[#8E95A2]">
            3. Kurze Notiz (optional)
          </label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={`z. B. Tisch 2 frei, ${currentUser.nickname} spielt ein...`}
            className="w-full rounded-xl border border-[#2B2F37] bg-[#0F1114] px-3 py-2 text-xs text-[#F3F4F6] focus:border-[#6FB3A2] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 pt-0.5">
          {existingCheckin && (
            <button
              type="button"
              onClick={() => {
                onCheckOut();
                onClose();
              }}
              className="rounded-xl border border-rose-500/35 bg-rose-950/30 px-3 py-2.5 text-xs font-bold text-rose-300 transition hover:bg-rose-950/50"
            >
              Auschecken
            </button>
          )}
          <button
            type="submit"
            className="flex-1 rounded-xl bg-[#6FB3A2] py-2.5 text-xs font-black text-[#060708] transition hover:bg-[#82C1B1]"
          >
            {existingCheckin ? 'Status speichern ✓' : 'Jetzt LIVE gehen ✓'}
          </button>
        </div>
      </form>
    </div>
  );
}

// ============================================================================
// SPONTAN PARTIE EINTRAGEN (LOGMATCHMODAL)
// ============================================================================

function LogMatchModal({
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

  const [opponentSearch, setOpponentSearch] = useState('');
  const [opponentId, setOpponentId] = useState(
    defaultOpponentId || opponents[0]?.id || ''
  );
  const [winnerSide, setWinnerSide] = useState('me');
  const [score, setScore] = useState('3:1');

  const filteredOpponents = useMemo(() => {
    const q = opponentSearch.trim().toLowerCase();
    if (!q) return opponents;
    return opponents.filter((p) =>
      `${p.nickname} ${p.firstName} ${p.lastName} ${p.sttClass || ''}`
        .toLowerCase()
        .includes(q)
    );
  }, [opponents, opponentSearch]);

  const effectiveOpponentId = useMemo(() => {
    if (filteredOpponents.some((p) => p.id === opponentId)) return opponentId;
    return filteredOpponents[0]?.id || '';
  }, [filteredOpponents, opponentId]);

  const opponent = players.find((p) => p.id === effectiveOpponentId);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!effectiveOpponentId) return;
    const winnerId = winnerSide === 'me' ? currentUser.id : effectiveOpponentId;
    onSave(effectiveOpponentId, winnerId, score);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 p-3 backdrop-blur-xs sm:items-center"
    >
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md space-y-3 rounded-2xl border border-[#6FB3A2]/45 bg-[#14161A] p-4 shadow-2xl"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-[#F3F4F6]">
            Spontan Partie eintragen
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-[#202329] px-2.5 py-1 text-xs font-bold text-[#9CA3AF]"
          >
            ✕
          </button>
        </div>

        <div className="space-y-1.5">
          <label className="block text-[11px] font-semibold text-[#8E95A2]">
            1. Mitspieler suchen &amp; wählen
          </label>
          <input
            type="text"
            value={opponentSearch}
            onChange={(e) => setOpponentSearch(e.target.value)}
            placeholder="Name oder Nickname suchen..."
            className="w-full rounded-xl border border-[#2B2F37] bg-[#0F1114] px-3 py-2 text-base sm:text-xs text-[#F3F4F6] placeholder:text-[#6B7280] focus:border-[#6FB3A2] focus:outline-none"
          />
          {filteredOpponents.length === 0 ? (
            <div className="rounded-xl border border-[#2B2F37] bg-[#0F1114] px-3 py-2 text-xs text-[#8E95A2]">
              Kein Spieler gefunden.
            </div>
          ) : (
            <select
              value={effectiveOpponentId}
              onChange={(e) => setOpponentId(e.target.value)}
              className="w-full rounded-xl border border-[#2B2F37] bg-[#0F1114] px-3 py-2 text-base sm:text-xs font-bold text-[#F3F4F6]"
            >
              {filteredOpponents.map((p) => {
                const r = connectRatings[p.id];
                return (
                  <option key={p.id} value={p.id}>
                    {p.nickname} ({p.firstName} {p.lastName}) · {r?.tier?.symbol}{' '}
                    {r?.elo}
                  </option>
                );
              })}
            </select>
          )}
        </div>

        <div>
          <label className="mb-1 block text-[11px] font-semibold text-[#8E95A2]">
            2. Gewinner antippen
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setWinnerSide('me')}
              className={`rounded-xl py-2.5 text-xs font-black transition ${
                winnerSide === 'me'
                  ? 'bg-emerald-500 text-[#060708]'
                  : 'border border-[#2B2F37] bg-[#0F1114] text-[#9CA3AF]'
              }`}
            >
              {currentUser.nickname}
            </button>
            <button
              type="button"
              disabled={!opponent}
              onClick={() => setWinnerSide('opponent')}
              className={`rounded-xl py-2.5 text-xs font-black transition disabled:opacity-40 ${
                winnerSide === 'opponent'
                  ? 'bg-emerald-500 text-[#060708]'
                  : 'border border-[#2B2F37] bg-[#0F1114] text-[#9CA3AF]'
              }`}
            >
              {opponent?.nickname || 'Mitspieler'}
            </button>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-[11px] font-semibold text-[#8E95A2]">
            3. Satzergebnis wählen
          </label>
          <div className="grid grid-cols-5 gap-1.5">
            {['3:0', '3:1', '3:2', '2:0', '2:1'].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setScore(preset)}
                className={`rounded-xl py-2 text-xs font-black transition ${
                  score === preset
                    ? 'bg-[#6FB3A2] text-[#060708]'
                    : 'border border-[#2B2F37] bg-[#0F1114] text-[#9CA3AF]'
                }`}
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={!effectiveOpponentId}
          className="w-full rounded-xl bg-[#6FB3A2] py-2.5 text-xs font-black text-[#060708] transition hover:bg-[#82C1B1] disabled:opacity-40"
        >
          Spontane Partie speichern ✓
        </button>
      </form>
    </div>
  );
}

// ============================================================================
// SPONTAN-SESSION MODAL (NUR SPONTAN HEUTE)
// ============================================================================

function CreateSpontaneousSessionModal({ onSubmit, onClose }) {
  const [dateLabel, setDateLabel] = useState(SPONTANEOUS_TODAY_TIME_CHIPS[0]);
  const [focus, setFocus] = useState(SPONTANEOUS_TODAY_FOCUS_CHIPS[0]);
  const [note, setNote] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalNote = note.trim() ? `${focus} · ${note.trim()}` : focus;
    onSubmit({
      type: 'spontaneous',
      dateLabel: dateLabel.trim() || 'Heute spontan',
      note: finalNote,
      expiresAt: computeExpiresAt(180), // Läuft nach 3 Stunden automatisch ab
    });
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 p-3 backdrop-blur-xs sm:items-center"
    >
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md space-y-3 rounded-2xl border border-[#6FB3A2]/45 bg-[#14161A] p-4 shadow-2xl"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-[#F3F4F6]">
            Spontan-Session für heute posten
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-[#202329] px-2.5 py-1 text-xs font-bold text-[#9CA3AF]"
          >
            ✕
          </button>
        </div>

        <div>
          <label className="mb-1.5 block text-[11px] font-semibold text-[#8E95A2]">
            1. Zeitfenster heute
          </label>
          <div className="flex flex-wrap gap-1.5">
            {SPONTANEOUS_TODAY_TIME_CHIPS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setDateLabel(t)}
                className={`rounded-xl px-2.5 py-1.5 text-[11px] font-bold transition ${
                  dateLabel === t
                    ? 'bg-[#6FB3A2] text-[#060708]'
                    : 'border border-[#2B2F37] bg-[#0F1114] text-[#D1D5DB]'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-[11px] font-semibold text-[#8E95A2]">
            2. Fokus
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {SPONTANEOUS_TODAY_FOCUS_CHIPS.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setFocus(item)}
                className={`rounded-xl px-2.5 py-2 text-left text-[11px] font-bold transition ${
                  focus === item
                    ? 'bg-[#6FB3A2] text-[#060708]'
                    : 'border border-[#2B2F37] bg-[#0F1114] text-[#D1D5DB]'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Zusätzliche Info (z. B. noch 1 Platz frei)..."
          className="w-full rounded-xl border border-[#2B2F37] bg-[#0F1114] px-3 py-2 text-xs text-[#F3F4F6] focus:border-[#6FB3A2] focus:outline-none"
        />

        <button
          type="submit"
          className="w-full rounded-xl bg-[#6FB3A2] py-2.5 text-xs font-black text-[#060708] transition hover:bg-[#82C1B1]"
        >
          Spontan-Session posten ✓
        </button>
      </form>
    </div>
  );
}

// ============================================================================
// HAUPTKOMPONENTE APP
// ============================================================================

export default function App() {
  const [players, setPlayers] = useState(() =>
    readStorageJson(STORAGE_KEYS.players, INITIAL_PLAYERS)
  );
  const [seasons, setSeasons] = useState(() =>
    readStorageJson(STORAGE_KEYS.seasons, INITIAL_SEASONS)
  );
  const [currentUserId, setCurrentUserId] = useState(() =>
    readStorageJson(STORAGE_KEYS.currentUserId, null)
  );
  const [world, setWorld] = useState('connect');
  const [leagueTab, setLeagueTab] = useState('overview');
  const [connectTab, setConnectTab] = useState('overview');

  const [liveCheckins, setLiveCheckins] = useState(() => {
    const stored = readStorageJson(STORAGE_KEYS.liveCheckins, null);
    const list = Array.isArray(stored) ? stored : buildInitialLiveCheckins();
    const now = Date.now();
    return list.filter((item) => !item.expiresAt || item.expiresAt > now);
  });

  const [sessions, setSessions] = useState(() => {
    const stored = readStorageJson(STORAGE_KEYS.sessions, null);
    const list = Array.isArray(stored) ? stored : buildInitialSessions();
    const now = Date.now();
    return list
      .filter((s) => s.type === 'spontaneous')
      .filter((s) => !s.expiresAt || s.expiresAt > now);
  });

  const [connectMatches, setConnectMatches] = useState(() =>
    readStorageJson(STORAGE_KEYS.connectMatches, INITIAL_CONNECT_MATCHES)
  );

  const [nowMs, setNowMs] = useState(() => Date.now());

  const [showPlatformInfo, setShowPlatformInfo] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState(null);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showLiveCheckInModal, setShowLiveCheckInModal] = useState(false);
  const [showSpontaneousSessionModal, setShowSpontaneousSessionModal] = useState(false);
  const [recordingLeagueMatch, setRecordingLeagueMatch] = useState(null);
  const [logMatchTargetId, setLogMatchTargetId] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const customLogoUrl = '';

  const [adminPinCode, setAdminPinCode] = useState('9999');
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [showAdminPinPrompt, setShowAdminPinPrompt] = useState(false);
  const [adminPinInput, setAdminPinInput] = useState('');
  const [adminPinError, setAdminPinError] = useState('');
  const [adminTab, setAdminTab] = useState('members');
  const [cloudSyncStatus, setCloudSyncStatus] = useState('local');
  const lastActiveTimestampRef = useRef(Date.now());
  const broadcastChannelRef = useRef(null);
  const supabaseRealtimeRef = useRef(null);
  const isApplyingRemoteSnapshotRef = useRef(false);

  // Unterstützt wahlweise `window.__SUPABASE_CONFIG__ = { url, anonKey, table }`
  // oder den bestehenden `window.__PINGKONG_SYNC_URL__`-Endpunkt als Fallback.
  const supabaseConfig = useMemo(() => {
    if (typeof window === 'undefined') return null;
    const cfg = window.__SUPABASE_CONFIG__;
    if (cfg && typeof cfg === 'object' && cfg.url && cfg.anonKey) {
      return {
        url: String(cfg.url).replace(/\/+$/, ''),
        anonKey: String(cfg.anonKey),
        table: cfg.table ? String(cfg.table) : 'club_state',
        rowId: cfg.rowId ? String(cfg.rowId) : 'main',
      };
    }
    return null;
  }, []);

  const cloudEndpoint =
    typeof window !== 'undefined' && window.__PINGKONG_SYNC_URL__
      ? String(window.__PINGKONG_SYNC_URL__)
      : '';

  const applySharedSnapshot = useCallback((snapshot, referenceNow = Date.now()) => {
    if (!snapshot || typeof snapshot !== 'object') return;
    isApplyingRemoteSnapshotRef.current = true;
    try {
      if (Array.isArray(snapshot.players) && snapshot.players.length > 0) {
        setPlayers(snapshot.players);
      }
      if (Array.isArray(snapshot.seasons) && snapshot.seasons.length > 0) {
        setSeasons(snapshot.seasons);
      }
      if (Array.isArray(snapshot.liveCheckins)) {
        setLiveCheckins(
          snapshot.liveCheckins.filter((item) => !item.expiresAt || item.expiresAt > referenceNow)
        );
      }
      if (Array.isArray(snapshot.sessions)) {
        setSessions(
          snapshot.sessions
            .filter((s) => s.type === 'spontaneous')
            .filter((item) => !item.expiresAt || item.expiresAt > referenceNow)
        );
      }
      if (Array.isArray(snapshot.connectMatches)) {
        setConnectMatches(snapshot.connectMatches);
      }
    } finally {
      setTimeout(() => {
        isApplyingRemoteSnapshotRef.current = false;
      }, 150);
    }
  }, []);

  const pullSharedState = useCallback(
    async (referenceNow = Date.now()) => {
      if (supabaseConfig) {
        try {
          setCloudSyncStatus('syncing');
          const endpoint = `${supabaseConfig.url}/rest/v1/${supabaseConfig.table}?id=eq.${encodeURIComponent(
            supabaseConfig.rowId
          )}&select=payload,updated_at`;
          const res = await fetch(endpoint, {
            method: 'GET',
            headers: {
              apikey: supabaseConfig.anonKey,
              Authorization: `Bearer ${supabaseConfig.anonKey}`,
              Accept: 'application/json',
            },
            cache: 'no-store',
          });
          if (!res.ok) {
            setCloudSyncStatus('local');
            return;
          }
          const rows = await res.json();
          const row = Array.isArray(rows) ? rows[0] : rows;
          if (row?.payload) {
            applySharedSnapshot(row.payload, referenceNow);
          }
          setCloudSyncStatus('live');
          return;
        } catch {
          setCloudSyncStatus('local');
          return;
        }
      }

      if (!cloudEndpoint) {
        setCloudSyncStatus('local');
        return;
      }
      try {
        setCloudSyncStatus('syncing');
        const res = await fetch(cloudEndpoint, {
          method: 'GET',
          headers: { Accept: 'application/json' },
          cache: 'no-store',
        });
        if (!res.ok) {
          setCloudSyncStatus('local');
          return;
        }
        const data = await res.json();
        const payload = data?.record || data?.data || data;
        applySharedSnapshot(payload, referenceNow);
        setCloudSyncStatus('live');
      } catch {
        setCloudSyncStatus('local');
      }
    },
    [supabaseConfig, cloudEndpoint, applySharedSnapshot]
  );

  const pushSharedState = useCallback(async () => {
    const snapshot = {
      players,
      seasons,
      liveCheckins,
      sessions,
      connectMatches,
      updatedAt: Date.now(),
    };

    if (supabaseConfig) {
      try {
        setCloudSyncStatus('syncing');
        const endpoint = `${supabaseConfig.url}/rest/v1/${supabaseConfig.table}?on_conflict=id`;
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: {
            apikey: supabaseConfig.anonKey,
            Authorization: `Bearer ${supabaseConfig.anonKey}`,
            'Content-Type': 'application/json',
            Prefer: 'resolution=merge-duplicates,return=minimal',
          },
          body: JSON.stringify([
            {
              id: supabaseConfig.rowId,
              payload: snapshot,
              updated_at: new Date().toISOString(),
            },
          ]),
        });
        setCloudSyncStatus(res.ok ? 'live' : 'local');
      } catch {
        setCloudSyncStatus('local');
      }
      return;
    }

    if (!cloudEndpoint) return;
    try {
      setCloudSyncStatus('syncing');
      const res = await fetch(cloudEndpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(snapshot),
      });
      setCloudSyncStatus(res.ok ? 'live' : 'local');
    } catch {
      setCloudSyncStatus('local');
    }
  }, [supabaseConfig, cloudEndpoint, players, seasons, liveCheckins, sessions, connectMatches]);

  // Supabase Realtime WebSocket-Verbindung für sofortige Updates auf anderen Geräten
  useEffect(() => {
    if (!supabaseConfig || typeof window === 'undefined' || typeof WebSocket !== 'function') {
      return;
    }

    let isClosedIntentionally = false;
    let reconnectTimer = null;
    let heartbeatTimer = null;

    const wsUrl = supabaseConfig.url
      .replace(/^https:\/\//i, 'wss://')
      .replace(/^http:\/\//i, 'ws://');
    const socketUrl = `${wsUrl}/realtime/v1/websocket?apikey=${encodeURIComponent(
      supabaseConfig.anonKey
    )}&vsn=1.0.0`;

    const connectRealtime = () => {
      if (isClosedIntentionally) return;
      try {
        const socket = new WebSocket(socketUrl);
        supabaseRealtimeRef.current = socket;

        socket.onopen = () => {
          setCloudSyncStatus('live');
          const topic = `realtime:public:${supabaseConfig.table}`;
          socket.send(
            JSON.stringify({
              topic,
              event: 'phx_join',
              payload: {
                config: {
                  postgres_changes: [
                    {
                      event: '*',
                      schema: 'public',
                      table: supabaseConfig.table,
                      filter: `id=eq.${supabaseConfig.rowId}`,
                    },
                  ],
                },
              },
              ref: '1',
            })
          );

          heartbeatTimer = setInterval(() => {
            if (socket.readyState === WebSocket.OPEN) {
              socket.send(
                JSON.stringify({
                  topic: 'phoenix',
                  event: 'heartbeat',
                  payload: {},
                  ref: String(Date.now()),
                })
              );
            }
          }, 25000);
        };

        socket.onmessage = (event) => {
          try {
            const msg = JSON.parse(event.data);
            const recordPayload =
              msg?.payload?.data?.record?.payload || msg?.payload?.record?.payload;
            if (recordPayload && !isApplyingRemoteSnapshotRef.current) {
              applySharedSnapshot(recordPayload, Date.now());
            }
          } catch {
            // Ungültige Heartbeat-/System-Nachrichten ignorieren
          }
        };

        socket.onclose = () => {
          if (heartbeatTimer) clearInterval(heartbeatTimer);
          if (!isClosedIntentionally) {
            reconnectTimer = setTimeout(connectRealtime, 3000);
          }
        };

        socket.onerror = () => {
          if (socket.readyState === WebSocket.OPEN) {
            socket.close();
          }
        };
      } catch {
        // Fallback auf Polling bleibt aktiv
      }
    };

    connectRealtime();

    return () => {
      isClosedIntentionally = true;
      if (heartbeatTimer) clearInterval(heartbeatTimer);
      if (reconnectTimer) clearTimeout(reconnectTimer);
      if (supabaseRealtimeRef.current) {
        try {
          supabaseRealtimeRef.current.close();
        } catch {
          // Ignorieren
        }
        supabaseRealtimeRef.current = null;
      }
    };
  }, [supabaseConfig, applySharedSnapshot]);

  // localStorage-Synchronisation für Kernzustände
  useEffect(() => {
    writeStorageJson(STORAGE_KEYS.players, players);
  }, [players]);

  useEffect(() => {
    writeStorageJson(STORAGE_KEYS.seasons, seasons);
  }, [seasons]);

  useEffect(() => {
    writeStorageJson(STORAGE_KEYS.currentUserId, currentUserId);
  }, [currentUserId]);

  useEffect(() => {
    writeStorageJson(STORAGE_KEYS.liveCheckins, liveCheckins);
  }, [liveCheckins]);

  useEffect(() => {
    writeStorageJson(STORAGE_KEYS.sessions, sessions);
  }, [sessions]);

  useEffect(() => {
    writeStorageJson(STORAGE_KEYS.connectMatches, connectMatches);
  }, [connectMatches]);

  // Sofortiger Abgleich zwischen mehreren offenen Tabs/Fenstern desselben Browsers
  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.BroadcastChannel !== 'function') {
      return;
    }
    const channel = new window.BroadcastChannel('pingkong_connect_live_v1');
    broadcastChannelRef.current = channel;

    channel.onmessage = (event) => {
      const msg = event?.data;
      if (!msg || msg.type !== 'state_snapshot' || !msg.payload) return;
      applySharedSnapshot(msg.payload, Date.now());
    };

    return () => {
      channel.close();
      broadcastChannelRef.current = null;
    };
  }, [applySharedSnapshot]);

  useEffect(() => {
    if (!broadcastChannelRef.current) return;
    try {
      broadcastChannelRef.current.postMessage({
        type: 'state_snapshot',
        payload: {
          players,
          seasons,
          liveCheckins,
          sessions,
          connectMatches,
        },
      });
    } catch {
      // Ignorieren falls Kanal bereits geschlossen
    }
  }, [players, seasons, liveCheckins, sessions, connectMatches]);
  // Gemeinsamen Cloud-Stand bei Änderungen speichern, sofern Supabase oder Sync-Endpoint aktiv ist
  useEffect(() => {
    if (!supabaseConfig && !cloudEndpoint) return;
    if (isApplyingRemoteSnapshotRef.current) return;
    const timer = setTimeout(() => {
      pushSharedState();
    }, 350);
    return () => clearTimeout(timer);
  }, [supabaseConfig, cloudEndpoint, isApplyingRemoteSnapshotRef, pushSharedState]);

  // Seitentitel & Home-Bildschirm App-Icon ("PINGKONG") registrieren
  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.title = 'PINGKONG';

    const upsertMeta = (name, content) => {
      let tag = document.querySelector(`meta[name="${name}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('name', name);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    const upsertLink = (rel, href, extraAttrs = {}) => {
      let link = document.querySelector(`link[rel="${rel}"]`);
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', rel);
        document.head.appendChild(link);
      }
      link.setAttribute('href', href);
      Object.entries(extraAttrs).forEach(([k, v]) => link.setAttribute(k, v));
    };

    upsertMeta('apple-mobile-web-app-title', 'PINGKONG');
    upsertMeta('application-name', 'PINGKONG');
    upsertMeta('apple-mobile-web-app-capable', 'yes');
    upsertMeta('mobile-web-app-capable', 'yes');
    upsertMeta('apple-mobile-web-app-status-bar-style', 'black-translucent');
    upsertMeta('theme-color', '#060708');

    let manifestBlobUrl = null;
    try {
      const size = 512;
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#060708';
        ctx.fillRect(0, 0, size, size);
        const pngDataUrl = canvas.toDataURL('image/png');
        upsertLink('apple-touch-icon', pngDataUrl, { sizes: '512x512' });
        upsertLink('icon', pngDataUrl, { type: 'image/png', sizes: '512x512' });

        const manifest = {
          name: 'PINGKONG',
          short_name: 'PINGKONG',
          start_url: '.',
          display: 'standalone',
          background_color: '#060708',
          theme_color: '#060708',
        };
        const blob = new Blob([JSON.stringify(manifest)], {
          type: 'application/manifest+json',
        });
        manifestBlobUrl = URL.createObjectURL(blob);
        upsertLink('manifest', manifestBlobUrl);
      }
    } catch {
      // Fallback
    }

    return () => {
      if (manifestBlobUrl) {
        URL.revokeObjectURL(manifestBlobUrl);
      }
    };
  }, []);

  const showToast = useCallback((msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2600);
  }, []);

  const pruneExpiredItems = useCallback((referenceNow = Date.now()) => {
    setLiveCheckins((prev) => {
      const filtered = prev.filter(
        (item) => !item.expiresAt || item.expiresAt > referenceNow
      );
      return filtered.length === prev.length ? prev : filtered;
    });
    setSessions((prev) => {
      const filtered = prev.filter(
        (item) => !item.expiresAt || item.expiresAt > referenceNow
      );
      return filtered.length === prev.length ? prev : filtered;
    });
  }, []);

  const syncLiveAndAppState = useCallback(
    (notify = false) => {
      const currentNow = Date.now();
      setNowMs(currentNow);
      pruneExpiredItems(currentNow);
      pullSharedState(currentNow);
      if (notify) {
        setTimeout(() => {
          showToast('✓ App & Ablaufzeiten aktualisiert');
        }, 300);
      }
    },
    [pruneExpiredItems, pullSharedState, showToast]
  );

  // Automatischer 30-Sekunden-Cleanup-Zyklus für `expiresAt` & Restlaufzeiten
  useEffect(() => {
    const runCycle = () => {
      const currentNow = Date.now();
      setNowMs(currentNow);
      pruneExpiredItems(currentNow);
    };
    runCycle();
    const interval = setInterval(runCycle, 30000);
    return () => clearInterval(interval);
  }, [pruneExpiredItems]);

  // Periodisches Live-Refresh im Hintergrund bei sichtbarem Tab (ergänzend zu Realtime)
  useEffect(() => {
    const livePollInterval = setInterval(() => {
      if (typeof document !== 'undefined' && document.visibilityState === 'hidden') {
        return;
      }
      syncLiveAndAppState(false);
    }, supabaseConfig ? 30000 : 15000);

    return () => clearInterval(livePollInterval);
  }, [syncLiveAndAppState, supabaseConfig]);

  // Auto-Sync bei Rückkehr in die App / Startbildschirm-Resume
  useEffect(() => {
    const handleAppResume = () => {
      if (document.visibilityState === 'hidden') {
        lastActiveTimestampRef.current = Date.now();
        return;
      }
      const awayMs = Date.now() - lastActiveTimestampRef.current;
      lastActiveTimestampRef.current = Date.now();

      if (awayMs > 15 * 60 * 1000 && typeof window !== 'undefined') {
        try {
          window.location.reload();
          return;
        } catch {
          // Fallback auf Sync
        }
      }
      syncLiveAndAppState(awayMs > 20 * 1000);
    };

    const handlePageShow = (event) => {
      if (event.persisted) {
        try {
          window.location.reload();
          return;
        } catch {
          syncLiveAndAppState(true);
        }
      } else {
        syncLiveAndAppState(false);
      }
    };

    document.addEventListener('visibilitychange', handleAppResume);
    window.addEventListener('pageshow', handlePageShow);
    window.addEventListener('focus', handleAppResume);

    return () => {
      document.removeEventListener('visibilitychange', handleAppResume);
      window.removeEventListener('pageshow', handlePageShow);
      window.removeEventListener('focus', handleAppResume);
    };
  }, [syncLiveAndAppState]);

  // Pull-to-Refresh auf Dokumentebene deaktivieren, damit Runterwischen keinen Browser-Reload auslöst
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const prevHtmlOverscroll = document.documentElement.style.overscrollBehaviorY;
    const prevBodyOverscroll = document.body.style.overscrollBehaviorY;
    const prevHtmlOverscrollShorthand = document.documentElement.style.overscrollBehavior;
    const prevBodyOverscrollShorthand = document.body.style.overscrollBehavior;

    document.documentElement.style.overscrollBehaviorY = 'none';
    document.body.style.overscrollBehaviorY = 'none';
    document.documentElement.style.overscrollBehavior = 'none';
    document.body.style.overscrollBehavior = 'none';

    return () => {
      document.documentElement.style.overscrollBehaviorY = prevHtmlOverscroll;
      document.body.style.overscrollBehaviorY = prevBodyOverscroll;
      document.documentElement.style.overscrollBehavior = prevHtmlOverscrollShorthand;
      document.body.style.overscrollBehavior = prevBodyOverscrollShorthand;
    };
  }, []);

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

  const viewedSeason = activeSeason;

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

  const nextOpenLeagueMatch = useMemo(() => {
    if (!currentUser) return null;
    return (
      activeSeason.matches.find(
        (m) =>
          m.score1 === null &&
          (m.player1Id === currentUser.id || m.player2Id === currentUser.id)
      ) || null
    );
  }, [activeSeason, currentUser]);

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
                  pausedPlayerIds: Array.from(new Set([...s.pausedPlayerIds, newPlayer.id])),
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

  const myExistingCheckin = liveCheckins.find((c) => c.playerId === currentUser.id);
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
        s.id !== activeSeason.id
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
    showToast('CLUB-Partie gelöscht');
  };

  const handleSaveLeagueMatchScore = (matchId, score1, score2) => {
    setSeasons((prev) =>
      prev.map((s) =>
        s.id !== activeSeason.id
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

  const handleAdvanceMonth = () => {
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
      prev
        .map((s) => (s.id === activeSeason.id ? { ...s, status: 'completed' } : s))
        .concat(newSeason)
    );
    showToast(`${nextLabel} mit Auf-/Abstieg gestartet!`);
  };

  const handleSaveLiveCheckIn = ({ durationLabel, hallStatus, expiresAt, note }) => {
    setNowMs(Date.now());
    setLiveCheckins((prev) => [
      {
        id: `lc-${Date.now()}`,
        playerId: currentUser.id,
        durationLabel,
        hallStatus,
        expiresAt,
        note,
        checkedInAt: 'Gerade eben',
        comingTooIds: [],
      },
      ...prev.filter((item) => item.playerId !== currentUser.id),
    ]);
    setWorld('connect');
    setConnectTab('overview');
    showToast(`🟢 LIVE (${durationLabel}) – ${formatRemainingDuration(expiresAt, Date.now())} übrig`);
  };

  const handleToggleComingToo = (checkinId) => {
    setLiveCheckins((prev) =>
      prev.map((item) => {
        if (item.id !== checkinId) return item;
        const list = item.comingTooIds || [];
        const exists = list.includes(currentUser.id);
        return {
          ...item,
          comingTooIds: exists
            ? list.filter((id) => id !== currentUser.id)
            : [...list, currentUser.id],
        };
      })
    );
  };

  const handleCheckOut = () => {
    setLiveCheckins((prev) => prev.filter((item) => item.playerId !== currentUser.id));
    showToast('Aus der Halle ausgecheckt');
  };

  const handleCreateSpontaneousSession = ({ dateLabel, note, expiresAt }) => {
    setNowMs(Date.now());
    setSessions((prev) => [
      {
        id: `s-${Date.now()}`,
        type: 'spontaneous',
        authorId: currentUser.id,
        dateLabel,
        expiresAt,
        note,
        joinedIds: [currentUser.id],
        createdAt: 'Gerade eben',
      },
      ...prev,
    ]);
    setShowSpontaneousSessionModal(false);
    setWorld('connect');
    setConnectTab('overview');
    showToast('Spontan-Session gepostet');
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

  const handleDeleteOwnSession = (sessionId) => {
    setSessions((prev) =>
      prev.filter((s) => !(s.id === sessionId && s.authorId === currentUser.id))
    );
    showToast('Spontan-Session entfernt');
  };

  return (
    <div className="min-h-screen overscroll-none bg-[#060708] pb-24 text-[#F3F4F6] antialiased selection:bg-[#DE754B] selection:text-[#060708]">
      <header className="sticky top-0 z-30 border-b border-[#22252B] bg-[#060708]/95 backdrop-blur-md">
        <div className="mx-auto max-w-2xl px-4 pt-3 pb-2.5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setWorld('connect');
                  setConnectTab('overview');
                }}
                className="flex items-center gap-2.5 text-left"
              >
                <div className="hidden h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-[#2B2F37] bg-[#0C0D10] p-1 text-[#DE754B] sm:flex">
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

              <button
                type="button"
                onClick={() => setShowPlatformInfo(true)}
                title="Was ist CONNECT?"
                aria-label="Was ist CONNECT?"
                className="hidden h-7 w-7 items-center justify-center rounded-full bg-[#15171B] text-xs font-black text-[#F4ECC2] ring-1 ring-[#2B2F37] transition hover:border-[#DE754B] hover:text-[#DE754B] sm:flex"
              >
                i
              </button>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setShowLiveCheckInModal(true)}
                title="LIVE Check-in öffnen"
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-black transition ${
                  myExistingCheckin
                    ? 'bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/60'
                    : 'bg-[#15171B] text-[#D1D5DB] ring-1 ring-[#2B2F37] hover:border-[#6FB3A2]/50 hover:text-[#F3F4F6]'
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    myExistingCheckin
                      ? 'animate-ping bg-emerald-400'
                      : liveCheckins.length > 0
                      ? 'bg-[#6FB3A2]'
                      : 'bg-[#6B7280]'
                  }`}
                />
                <span>{liveCheckins.length} LIVE</span>
              </button>

              <div className="flex items-center overflow-hidden rounded-full border border-[#2B2F37] bg-[#15171B]">
                <button
                  type="button"
                  onClick={() => setShowProfileModal(true)}
                  title="Mein Profil anzeigen"
                  className="flex items-center gap-2 py-1.5 pl-3 pr-3 text-xs font-bold text-[#F4ECC2] transition hover:bg-[#1E2127] sm:pl-1.5"
                >
                  <span className="hidden sm:inline-flex">
                    <PlayerAvatar
                      player={currentUser}
                      sizeClass="h-6 w-6 text-[10px]"
                      isConnectAccent={currentUser.connectOnly}
                    />
                  </span>
                  <span className="max-w-[96px] truncate">{currentUser.nickname}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentUserId(null)}
                  title="Abmelden & zur Startseite"
                  aria-label="Abmelden"
                  className="flex items-center justify-center border-l border-[#2E323B] px-2.5 py-2 text-[#D1D5DB] transition hover:bg-rose-950/40 hover:text-rose-300 sm:px-3"
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

          <div className="mt-4 grid grid-cols-2 gap-2.5 sm:mt-2.5 sm:gap-2">
            <button
              type="button"
              onClick={() => setWorld('connect')}
              className={`relative flex items-center justify-between rounded-2xl px-4 py-4 text-left transition sm:rounded-xl sm:px-3.5 sm:py-2 ${
                world === 'connect'
                  ? 'bg-[#6FB3A2] text-[#060708] shadow-lg shadow-[#6FB3A2]/25 ring-1 ring-[#A8D0B1]/40'
                  : 'bg-[#14161A] text-[#D1D5DB] ring-1 ring-[#6FB3A2]/45 hover:bg-[#16221F]'
              }`}
            >
              <div>
                <div className="text-base font-black tracking-wide uppercase sm:text-xs">
                  CLUB
                </div>
                <div
                  className={`text-xs font-semibold sm:text-[10px] sm:font-medium ${
                    world === 'connect' ? 'text-[#060708]/85' : 'text-[#9CA3AF]'
                  }`}
                >
                  {liveCheckins.length} LIVE · {players.length} Mitglieder
                </div>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-black sm:px-2 sm:py-0.5 sm:text-[10px] ${
                  world === 'connect'
                    ? 'bg-[#060708] text-[#A8D0B1]'
                    : 'bg-[#152622] text-[#A8D0B1]'
                }`}
              >
                Halle
              </span>
            </button>

            <button
              type="button"
              onClick={() => setWorld('league')}
              className={`relative flex items-center justify-between rounded-2xl px-4 py-4 text-left transition sm:rounded-xl sm:px-3.5 sm:py-2 ${
                world === 'league'
                  ? 'bg-[#DE754B] text-[#060708] shadow-lg shadow-[#DE754B]/25 ring-1 ring-[#F4ECC2]/40'
                  : 'bg-[#14161A] text-[#D1D5DB] ring-1 ring-[#DE754B]/45 hover:bg-[#231611]'
              }`}
            >
              <div>
                <div className="text-base font-black tracking-wide uppercase sm:text-xs">
                  LEAGUE
                </div>
                <div
                  className={`text-xs font-semibold sm:text-[10px] sm:font-medium ${
                    world === 'league' ? 'text-[#060708]/85' : 'text-[#9CA3AF]'
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
                  className={`rounded-full px-3 py-1 text-xs font-black sm:px-2 sm:py-0.5 sm:text-[10px] ${
                    world === 'league'
                      ? 'bg-[#060708] text-[#F4ECC2]'
                      : 'bg-[#2C1912] text-[#F4ECC2] ring-1 ring-[#DE754B]/45'
                  }`}
                >
                  {openLeagueMatchesCount} offen
                </span>
              ) : (
                <span
                  className={`rounded-full px-3 py-1 text-xs font-black sm:px-2 sm:py-0.5 sm:text-[10px] ${
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
            connectRatings={ratingsByPlayer}
            connectMatches={connectMatches}
            liveCheckins={liveCheckins}
            sessions={sessions}
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
            onDeleteSession={(id) => {
              setSessions((prev) => prev.filter((s) => s.id !== id));
              showToast('Spontan-Session gelöscht');
            }}
          />
        )}

        {world === 'league' && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-[#DE754B]/35 bg-[#14161A] p-3 shadow-lg shadow-black/25">
              <div className="mb-2.5 flex items-center justify-between px-0.5">
                <span className="text-[10px] font-black uppercase tracking-[0.14em] text-[#DE754B]">
                  Schnellaktionen
                </span>
                <span className="text-[10px] font-medium text-[#8E95A2]">
                  {activeSeason.label}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => {
                    if (nextOpenLeagueMatch) {
                      setRecordingLeagueMatch(nextOpenLeagueMatch);
                    } else {
                      setLeagueTab('matches');
                    }
                  }}
                  className="flex items-center justify-between gap-2 rounded-xl border border-[#DE754B]/50 bg-[#291711]/75 px-3.5 py-3 text-left text-xs font-black text-[#F3F4F6] transition hover:border-[#DE754B] hover:bg-[#331C14]"
                >
                  <div className="min-w-0">
                    <div className="truncate">Resultat eintragen</div>
                    <div className="mt-0.5 truncate text-[10px] font-medium text-[#F4ECC2]/80">
                      {nextOpenLeagueMatch
                        ? `vs. ${
                            playersById[
                              nextOpenLeagueMatch.player1Id === currentUser.id
                                ? nextOpenLeagueMatch.player2Id
                                : nextOpenLeagueMatch.player1Id
                            ]?.nickname || 'Gegner'
                          } · Sätze erfassen`
                        : `${openLeagueMatchesCount} offen · Zu meinen Spielen`}
                    </div>
                  </div>
                  <span className="shrink-0 rounded-lg bg-[#DE754B] px-2 py-1 text-[10px] font-black text-[#060708]">
                    + Sätze
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setLeagueTab('standings')}
                  className="flex items-center justify-between gap-2 rounded-xl border border-[#2B2F37] bg-[#0F1114] px-3.5 py-3 text-left text-xs font-black text-[#F3F4F6] transition hover:border-[#DE754B] hover:bg-[#191C21]"
                >
                  <div className="min-w-0">
                    <div className="truncate">Tabelle &amp; Aufstieg</div>
                    <div className="mt-0.5 truncate text-[10px] font-medium text-[#8E95A2]">
                      {currentUserLeague
                        ? `${currentUserLeague.name} · Gruppen & Ränge`
                        : 'Alle Ligen & Gruppen ansehen'}
                    </div>
                  </div>
                  <span className="shrink-0 text-sm font-black text-[#DE754B]">
                    →
                  </span>
                </button>
              </div>
            </div>

            {isEndOfMonthReminderWindow && (
              <div className="rounded-2xl border border-amber-500/40 bg-amber-950/25 p-3">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <div className="text-[11px] font-black uppercase tracking-wider text-amber-300">
                      ⏰ Noch {daysRemaining} {daysRemaining === 1 ? 'Tag' : 'Tage'} bis Monatsende
                    </div>
                    <p className="mt-0.5 text-xs text-[#E5E7EB]">
                      {openLeagueMatchesCount > 0
                        ? `Du hast noch ${openLeagueMatchesCount} offene Liga-Partie(n) in ${activeSeason.label}.`
                        : `Alle deine Liga-Partien im ${activeSeason.label} sind eingetragen!`}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-4 gap-1 rounded-xl bg-[#14161A] p-1 ring-1 ring-[#DE754B]/25">
              {[
                { id: 'overview', label: 'Übersicht' },
                { id: 'matches', label: 'Meine Spiele' },
                { id: 'standings', label: 'Tabelle & Aufstieg' },
                { id: 'status', label: 'Monats-Status' },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setLeagueTab(t.id)}
                  className={`truncate rounded-lg px-1 py-2 text-[11px] font-bold transition sm:text-xs ${
                    leagueTab === t.id
                      ? 'bg-[#DE754B] text-[#060708]'
                      : 'text-[#8E95A2] hover:text-[#F4ECC2]'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {leagueTab === 'overview' && (
              <LeagueOverviewTab
                season={activeSeason}
                currentUser={currentUser}
                playersById={playersById}
                daysRemaining={daysRemaining}
                isCurrentUserPaused={isCurrentUserPaused}
                onNavigateTab={(tab) => setLeagueTab(tab)}
                onSelectMatchToRecord={(m) => setRecordingLeagueMatch(m)}
              />
            )}

            {leagueTab === 'matches' && (
              <LeagueMatchesTab
                season={activeSeason}
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
                season={activeSeason}
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
            {/* Fokus-Schnellaktionen im CLUB-Bereich: nur LIVE Check-in & Spontan Partie eintragen */}
            <div className="rounded-2xl border border-[#6FB3A2]/35 bg-[#14161A] p-3 shadow-lg shadow-black/25">
              <div className="mb-2.5 flex items-center justify-between px-0.5">
                <span className="text-[10px] font-black uppercase tracking-[0.14em] text-[#6FB3A2]">
                  Schnellaktionen
                </span>
                <span className="text-[10px] font-medium text-[#8E95A2]">
                  {supabaseConfig
                    ? cloudSyncStatus === 'live'
                      ? 'Supabase Realtime aktiv'
                      : cloudSyncStatus === 'syncing'
                      ? 'Supabase synchronisiert...'
                      : 'Supabase lokal gepuffert'
                    : cloudSyncStatus === 'live'
                    ? 'Cloud-Sync aktiv (alle ~15s)'
                    : cloudSyncStatus === 'syncing'
                    ? 'Synchronisiert...'
                    : 'Nur lokaler Browser (kein Cloud-Endpunkt)'}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setShowLiveCheckInModal(true)}
                  className={`flex items-center justify-between gap-2 rounded-xl border px-3.5 py-3 text-left text-xs font-black transition ${
                    myExistingCheckin
                      ? 'border-[#6FB3A2] bg-[#152622] text-[#A8D0B1]'
                      : 'border-[#6FB3A2]/50 bg-[#152622]/75 text-[#F3F4F6] hover:border-[#6FB3A2] hover:bg-[#192E29]'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="truncate">
                      {myExistingCheckin ? 'LIVE Check-in anpassen' : 'LIVE Check-in'}
                    </div>
                    <div className="mt-0.5 truncate text-[10px] font-medium text-[#A8D0B1]">
                      {myExistingCheckin
                        ? `Noch ${formatRemainingDuration(myExistingCheckin.expiresAt, nowMs)}`
                        : 'Dauer & Hallen-Status wählen'}
                    </div>
                  </div>
                  <span className="shrink-0 rounded-lg bg-[#6FB3A2] px-2 py-1 text-[10px] font-black text-[#060708]">
                    LIVE
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setLogMatchTargetId('')}
                  className="flex items-center justify-between gap-2 rounded-xl border border-[#2B2F37] bg-[#0F1114] px-3.5 py-3 text-left text-xs font-black text-[#F3F4F6] transition hover:border-[#6FB3A2] hover:bg-[#191C21]"
                >
                  <div className="min-w-0">
                    <div className="truncate">Spontan Partie eintragen</div>
                    <div className="mt-0.5 truncate text-[10px] font-medium text-[#8E95A2]">
                      Sätze &amp; CLUB-Rating direkt erfassen
                    </div>
                  </div>
                  <span className="shrink-0 text-sm font-black text-[#6FB3A2]">+</span>
                </button>
              </div>
            </div>

            <div className="border-t border-[#22252B] pt-3.5">
              <div className="grid grid-cols-4 gap-1 rounded-xl bg-[#14161A] p-1 ring-1 ring-[#6FB3A2]/25">
                {[
                  { id: 'overview', label: 'Übersicht' },
                  { id: 'ranking', label: 'Rangliste' },
                  { id: 'matches', label: 'Partien' },
                  { id: 'halldays', label: 'Hallentage' },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setConnectTab(t.id)}
                    className={`truncate rounded-lg px-1 py-2 text-[11px] font-bold transition sm:text-xs ${
                      connectTab === t.id
                        ? 'bg-[#6FB3A2] text-[#060708]'
                        : 'text-[#8E95A2] hover:text-[#F4ECC2]'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {connectTab === 'overview' && (
              <ConnectOverviewTab
                currentUser={currentUser}
                activeSeason={activeSeason}
                players={players}
                playersById={playersById}
                liveCheckins={liveCheckins}
                sessions={sessions}
                connectMatches={connectMatches}
                connectRatings={ratingsByPlayer}
                matchDeltas={matchDeltas}
                nowMs={nowMs}
                onNavigateTab={(tab) => setConnectTab(tab)}
                onToggleJoinSession={handleToggleJoinSession}
                onDeleteOwnSession={handleDeleteOwnSession}
                onOpenCreateSpontaneous={() => setShowSpontaneousSessionModal(true)}
                onOpenLiveCheckIn={() => setShowLiveCheckInModal(true)}
                onOpenLogMatch={(opponentId = '') => setLogMatchTargetId(opponentId)}
                onToggleComingToo={handleToggleComingToo}
                onCheckOut={handleCheckOut}
                onOpenEditProfile={() => setShowProfileModal(true)}
                onSelectMember={(memberId) => setSelectedMemberId(memberId)}
              />
            )}

            {connectTab === 'ranking' && (
              <ClubPlayersTab
                players={players}
                currentUser={currentUser}
                activeSeason={activeSeason}
                liveCheckins={liveCheckins}
                connectRatings={ratingsByPlayer}
                onOpenAddMember={() => setShowAddMemberModal(true)}
                onOpenRecordConnectMatch={(opponentId) => setLogMatchTargetId(opponentId)}
                onSelectMember={(memberId) => setSelectedMemberId(memberId)}
              />
            )}

            {connectTab === 'matches' && (
              <ConnectMatchesTab
                connectMatches={connectMatches}
                matchDeltas={matchDeltas}
                playersById={playersById}
                currentUser={currentUser}
                connectRatings={ratingsByPlayer}
                onOpenRecordConnectMatch={() => setLogMatchTargetId('')}
              />
            )}

            {connectTab === 'halldays' && (
              <HallDaysTab
                players={players}
                currentUser={currentUser}
                activeSeason={activeSeason}
                connectRatings={ratingsByPlayer}
                onOpenEditProfile={() => setShowProfileModal(true)}
                onOpenRecordConnectMatch={(opponentId) => setLogMatchTargetId(opponentId)}
                onSelectMember={(memberId) => setSelectedMemberId(memberId)}
              />
            )}
          </div>
        )}
      </main>

      <footer className="mx-auto mt-10 max-w-2xl border-t border-[#1D2026] px-4 pt-4 pb-6">
        <div className="flex items-center justify-between text-[11px] text-[#6B7280]">
          <button
            type="button"
            onClick={() => setShowPlatformInfo(true)}
            className="inline-flex items-center gap-1.5 font-semibold text-[#8E95A2] transition hover:text-[#F4ECC2]"
          >
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#1C1F26] text-[10px] font-black text-[#DE754B]">
              i
            </span>
            <span>Über CONNECT</span>
          </button>

          <button
            type="button"
            onClick={handleOpenAdmin}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-bold transition ${
              world === 'admin'
                ? 'bg-[#DE754B] text-[#060708]'
                : 'bg-[#14161A] text-[#9CA3AF] ring-1 ring-[#24272E] hover:border-[#DE754B] hover:text-[#F4ECC2]'
            }`}
          >
            <span>🛡️</span>
            <span>Club-Admin</span>
          </button>
        </div>
      </footer>

      {showPlatformInfo && (
        <PlatformInfoModal onClose={() => setShowPlatformInfo(false)} />
      )}

      {selectedMemberId && playersById[selectedMemberId] && (
        <MemberDetailModal
          player={playersById[selectedMemberId]}
          currentUser={currentUser}
          playersById={playersById}
          activeSeason={activeSeason}
          seasons={seasons}
          ratingInfo={ratingsByPlayer[selectedMemberId]}
          connectMatches={connectMatches}
          liveCheckin={liveCheckins.find((c) => c.playerId === selectedMemberId)}
          nowMs={nowMs}
          onRecordMatch={(opponentId) => setLogMatchTargetId(opponentId)}
          onClose={() => setSelectedMemberId(null)}
        />
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

      {showLiveCheckInModal && (
        <LiveCheckInModal
          currentUser={currentUser}
          existingCheckin={myExistingCheckin}
          onSave={handleSaveLiveCheckIn}
          onCheckOut={handleCheckOut}
          onClose={() => setShowLiveCheckInModal(false)}
        />
      )}

      {showSpontaneousSessionModal && (
        <CreateSpontaneousSessionModal
          onSubmit={handleCreateSpontaneousSession}
          onClose={() => setShowSpontaneousSessionModal(false)}
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

      {logMatchTargetId !== null && (
        <LogMatchModal
          players={players}
          currentUser={currentUser}
          connectRatings={ratingsByPlayer}
          defaultOpponentId={logMatchTargetId}
          onSave={handleRecordConnectMatch}
          onClose={() => setLogMatchTargetId(null)}
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

// ============================================================================
// CLUB ÜBERSICHT (LIVE CHECK-IN, SPONTAN-PINNWAND, RATING & 3ER-GRID NEUE)
// ============================================================================

function ConnectOverviewTab({
  currentUser,
  activeSeason,
  players,
  playersById,
  liveCheckins,
  sessions,
  connectMatches,
  connectRatings,
  matchDeltas,
  nowMs,
  onNavigateTab,
  onToggleJoinSession,
  onDeleteOwnSession,
  onOpenCreateSpontaneous,
  onOpenLiveCheckIn,
  onOpenLogMatch,
  onToggleComingToo,
  onCheckOut,
  onOpenEditProfile,
  onSelectMember,
}) {
  const [onlyMatchingLevel, setOnlyMatchingLevel] = useState(false);
  const [onlyBuddyWanted, setOnlyBuddyWanted] = useState(false);

  const myLiveCheckin = useMemo(
    () => liveCheckins.find((c) => c.playerId === currentUser.id),
    [liveCheckins, currentUser.id]
  );

  const buddySearchCount = useMemo(
    () => liveCheckins.filter((c) => c.hallStatus === 'buddy_wanted').length,
    [liveCheckins]
  );

  const visibleLiveCheckins = useMemo(() => {
    return liveCheckins.filter((item) => {
      if (onlyBuddyWanted && item.hallStatus !== 'buddy_wanted') return false;
      if (!onlyMatchingLevel) return true;
      const p = playersById[item.playerId];
      if (!p || p.id === currentUser.id) return true;
      return isMatchingLevel(currentUser, p, activeSeason);
    });
  }, [liveCheckins, onlyBuddyWanted, onlyMatchingLevel, playersById, currentUser, activeSeason]);

  const newMembers = useMemo(
    () => players.filter((p) => p.isNewMember),
    [players]
  );

  const visibleSpontaneousSessions = useMemo(() => {
    const spontaneousOnly = sessions.filter((s) => s.type === 'spontaneous');
    if (!onlyMatchingLevel) return spontaneousOnly;
    return spontaneousOnly.filter((s) => {
      const author = playersById[s.authorId];
      if (!author || author.id === currentUser.id) return true;
      return isMatchingLevel(currentUser, author, activeSeason);
    });
  }, [sessions, onlyMatchingLevel, playersById, currentUser, activeSeason]);

  const topRatedPlayers = useMemo(() => {
    return [...players]
      .sort((a, b) => (connectRatings[b.id]?.elo || 0) - (connectRatings[a.id]?.elo || 0))
      .slice(0, 3);
  }, [players, connectRatings]);

  const myRating = connectRatings[currentUser.id];

  return (
    <div className="space-y-4">
      {/* Kennzahlen-Zeile */}
      <div className="grid grid-cols-3 gap-2">
        <a
          href="#club-live-section"
          className="rounded-xl border border-emerald-500/30 bg-[#181A1E] p-2.5 text-center transition hover:border-emerald-400/60"
        >
          <div className="text-sm font-black text-emerald-300">
            {liveCheckins.length}
          </div>
          <div className="mt-0.5 text-[10px] font-bold text-[#9CA3AF]">
            LIVE Halle
          </div>
        </a>

        <button
          type="button"
          onClick={() => onNavigateTab('ranking')}
          className="rounded-xl border border-[#C8A26E]/30 bg-[#181A1E] p-2.5 text-center transition hover:border-[#C8A26E]/60"
        >
          <div className="text-sm font-black text-[#E6C79C]">
            {myRating?.elo || 1200}
          </div>
          <div className="mt-0.5 text-[10px] font-bold text-[#9CA3AF]">
            Mein Rating
          </div>
        </button>

        <a
          href="#club-newbies-section"
          className="rounded-xl border border-[#24272D] bg-[#181A1E] p-2.5 text-center transition hover:border-[#6FB3A2]/50"
        >
          <div className="text-sm font-black text-[#F3F4F6]">
            {newMembers.length}
          </div>
          <div className="mt-0.5 text-[10px] font-bold text-[#9CA3AF]">
            Neu im Club
          </div>
        </a>
      </div>

      {/* 1. LIVE in der Halle mit Dauer, Restlaufzeit, Status-Chips & Buddy-Suche */}
      <div
        id="club-live-section"
        className="space-y-2.5 rounded-2xl border border-[#24272D] bg-[#181A1E] p-3.5"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span className="text-xs font-black uppercase tracking-wide text-[#F3F4F6]">
              LIVE in der Halle ({visibleLiveCheckins.length})
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {buddySearchCount > 0 && (
              <button
                type="button"
                onClick={() => setOnlyBuddyWanted((v) => !v)}
                className={`rounded-full px-2.5 py-1 text-[10px] font-bold transition ${
                  onlyBuddyWanted
                    ? 'bg-emerald-400 text-[#060708]'
                    : 'border border-emerald-500/35 bg-emerald-950/30 text-emerald-300'
                }`}
              >
                Buddy gesucht ({buddySearchCount})
              </button>
            )}
            <button
              type="button"
              onClick={() => setOnlyMatchingLevel((v) => !v)}
              className={`rounded-full px-2.5 py-1 text-[10px] font-bold transition ${
                onlyMatchingLevel
                  ? 'bg-[#6FB3A2] text-[#060708]'
                  : 'bg-[#131417] text-[#9CA3AF] ring-1 ring-[#272A30]'
              }`}
            >
              {onlyMatchingLevel ? '✓ Mein Niveau' : 'Mein Niveau'}
            </button>
          </div>
        </div>

        {visibleLiveCheckins.length === 0 ? (
          <div className="flex items-center justify-between gap-2 rounded-xl border border-[#22252B] bg-[#131417] p-3 text-xs text-[#8E95A2]">
            <span>
              {onlyBuddyWanted
                ? 'Aktuell sucht niemand mit diesem Filter einen Spielbuddy.'
                : 'Momentan ist noch niemand LIVE eingecheckt.'}
            </span>
            <button
              type="button"
              onClick={onOpenLiveCheckIn}
              className="shrink-0 rounded-lg bg-[#6FB3A2] px-3 py-1.5 text-[11px] font-black text-[#060708]"
            >
              Einchecken
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {visibleLiveCheckins.map((item) => {
              const p = playersById[item.playerId];
              if (!p) return null;
              const isMe = p.id === currentUser.id;
              const comingTooIds = item.comingTooIds || [];
              const iAmComingToo = comingTooIds.includes(currentUser.id);
              const comingNames = comingTooIds
                .map((id) => playersById[id]?.nickname)
                .filter(Boolean);

              const statusMeta =
                LIVE_STATUS_OPTIONS.find((s) => s.id === item.hallStatus) ||
                LIVE_STATUS_OPTIONS[0];
              const remainingText = formatRemainingDuration(item.expiresAt, nowMs);

              const waMsg = getContextWhatsAppMessage('live_hall', currentUser, p, {
                durationLabel: `${item.durationLabel} · noch ${remainingText}`,
              });

              return (
                <div
                  key={item.id}
                  className={`rounded-xl border p-3 transition ${
                    item.hallStatus === 'buddy_wanted'
                      ? 'border-emerald-500/35 bg-[#131A18]'
                      : 'border-[#22252B] bg-[#131417]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => onSelectMember?.(p.id)}
                      className="flex min-w-0 items-center gap-2.5 text-left transition hover:opacity-85"
                    >
                      <PlayerAvatar
                        player={p}
                        sizeClass="h-8 w-8 text-[10px]"
                        isConnectAccent
                      />
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="truncate text-xs font-bold text-[#F3F4F6]">
                            {p.nickname}
                          </span>
                          {isMe && (
                            <span className="rounded bg-[#1F2927] px-1.5 py-0.5 text-[9px] font-bold text-[#A8D0B1]">
                              Du
                            </span>
                          )}
                          <span
                            className={`rounded border px-1.5 py-0.5 text-[9px] font-bold ${statusMeta.badgeClass}`}
                          >
                            {statusMeta.label}
                          </span>
                        </div>
                        <div className="mt-0.5 text-[10px] text-[#8E95A2]">
                          {p.sttClass || 'CLUB'} · {item.checkedInAt} ·{' '}
                          <span className="font-semibold text-[#A8D0B1]">
                            noch {remainingText}
                          </span>
                        </div>
                      </div>
                    </button>

                    <span className="shrink-0 rounded-md border border-[#282C34] bg-[#181A1E] px-2 py-0.5 text-[10px] font-semibold text-[#E6C79C]">
                      {item.durationLabel}
                    </span>
                  </div>

                  {item.note && (
                    <div className="mt-2 text-[11px] text-[#D1D5DB]">{item.note}</div>
                  )}

                  {comingNames.length > 0 && (
                    <div className="mt-1.5 text-[10px] font-medium text-[#8E95A2]">
                      Kommt auch:{' '}
                      <span className="text-[#A8D0B1]">{comingNames.join(', ')}</span>
                    </div>
                  )}

                  <div className="mt-2.5 flex items-center justify-between gap-2 border-t border-[#1E2128] pt-2">
                    <span className="text-[10px] text-[#6B7280]">
                      {formatExpiryClockLabel(item.expiresAt)}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {!isMe ? (
                        <>
                          <WhatsAppActionButton
                            phone={p.phone}
                            message={waMsg}
                            label=""
                            compact
                          />
                          <button
                            type="button"
                            onClick={() => onToggleComingToo(item.id)}
                            className={`rounded-lg px-2.5 py-1 text-[10px] font-bold transition ${
                              iAmComingToo
                                ? 'bg-[#6FB3A2] text-[#060708]'
                                : 'bg-[#252830] text-[#F3F4F6] hover:bg-[#313540]'
                            }`}
                          >
                            {iAmComingToo ? 'Komme ✓' : 'Komme auch'}
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={onOpenLiveCheckIn}
                            className="rounded-lg bg-[#252830] px-2.5 py-1 text-[10px] font-bold text-[#E6C79C] hover:bg-[#313540]"
                          >
                            Ändern
                          </button>
                          <button
                            type="button"
                            onClick={onCheckOut}
                            className="rounded-lg border border-rose-500/35 bg-rose-950/30 px-2.5 py-1 text-[10px] font-bold text-rose-300 hover:bg-rose-950/50"
                          >
                            Auschecken
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 2. Pinnwand: Nur Spontan-Sessions für heute */}
      <div className="space-y-2.5 rounded-2xl border border-[#24272D] bg-[#181A1E] p-3.5">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-black uppercase tracking-wide text-[#F3F4F6]">
            Spontan heute ({visibleSpontaneousSessions.length})
          </span>

          <button
            type="button"
            onClick={onOpenCreateSpontaneous}
            className="rounded-lg bg-[#6FB3A2] px-2.5 py-1 text-[10px] font-black text-[#060708] transition hover:bg-[#82C1B1]"
          >
            + Spontan-Session
          </button>
        </div>

        {visibleSpontaneousSessions.length === 0 ? (
          <div className="rounded-xl bg-[#131417] p-3 text-center text-xs text-[#8E95A2]">
            Aktuell keine Spontan-Sessions für heute eingetragen.
          </div>
        ) : (
          <div className="space-y-2">
            {visibleSpontaneousSessions.map((s) => {
              const author = playersById[s.authorId];
              if (!author) return null;
              const isJoined = s.joinedIds.includes(currentUser.id);
              const isAuthor = author.id === currentUser.id;
              const waMsg = getContextWhatsAppMessage('session_join', currentUser, author, {
                dateLabel: s.dateLabel,
              });

              return (
                <div
                  key={s.id}
                  className="rounded-xl border border-[#22262E] bg-[#131417] p-2.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => onSelectMember?.(author.id)}
                      className="flex min-w-0 items-center gap-2 text-left transition hover:opacity-85"
                    >
                      <PlayerAvatar
                        player={author}
                        sizeClass="h-6 w-6 text-[9px]"
                        isConnectAccent={author.connectOnly}
                      />
                      <span className="truncate text-xs font-black text-[#F3F4F6] underline decoration-[#6FB3A2]/50 underline-offset-2">
                        {author.nickname}
                      </span>
                      <span className="shrink-0 rounded bg-[#2C2418] px-1.5 py-0.5 text-[9px] font-bold text-[#E6C79C]">
                        Spontan
                      </span>
                    </button>

                    <div className="flex shrink-0 items-center gap-1.5">
                      <span className="text-[10px] text-[#8E95A2]">
                        {s.expiresAt
                          ? `noch ${formatRemainingDuration(s.expiresAt, nowMs)}`
                          : s.createdAt}
                      </span>
                      {isAuthor && (
                        <button
                          type="button"
                          onClick={() => onDeleteOwnSession(s.id)}
                          title="Spontan-Session löschen"
                          aria-label="Spontan-Session löschen"
                          className="rounded-md bg-[#22252C] px-1.5 py-0.5 text-[10px] font-bold text-[#9CA3AF] transition hover:bg-rose-950/50 hover:text-rose-300"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="mt-1.5 text-xs font-extrabold text-[#E6C79C]">
                    {s.dateLabel}
                  </div>
                  <p className="mt-0.5 line-clamp-2 text-[11px] text-[#D1D5DB]">{s.note}</p>

                  <div className="mt-2 flex items-center justify-between gap-2 border-t border-[#1D2027] pt-1.5">
                    <div className="truncate text-[10px] text-[#9CA3AF]">
                      Dabei ({s.joinedIds.length}):{' '}
                      {s.joinedIds
                        .map((id) => playersById[id]?.nickname)
                        .filter(Boolean)
                        .join(', ')}
                    </div>

                    <div className="flex shrink-0 items-center gap-1.5">
                      {!isAuthor && (
                        <WhatsAppActionButton
                          phone={author.phone}
                          message={waMsg}
                          label=""
                          compact
                        />
                      )}
                      <button
                        type="button"
                        onClick={() => onToggleJoinSession(s.id)}
                        className={`rounded-lg px-2.5 py-1 text-[10px] font-bold transition ${
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
        )}
      </div>

      {/* 3. Top-3 CLUB-Rating Vorschau */}
      <div className="rounded-2xl border border-[#24272D] bg-[#181A1E] p-3.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wide text-[#E6C79C]">
            Top-3 CLUB-Rating
          </span>
          <button
            type="button"
            onClick={() => onNavigateTab('ranking')}
            className="text-[11px] font-bold text-[#E6C79C] underline"
          >
            Komplette Rangliste →
          </button>
        </div>

        <div className="mt-2.5 space-y-1.5">
          {topRatedPlayers.map((p, idx) => {
            const r = connectRatings[p.id];
            return (
              <div
                key={p.id}
                className="flex items-center justify-between gap-2 rounded-xl bg-[#131417] px-3 py-2"
              >
                <button
                  type="button"
                  onClick={() => onSelectMember?.(p.id)}
                  className="flex min-w-0 flex-1 items-center gap-2 text-left transition hover:opacity-85"
                >
                  <span className="w-4 text-xs font-black text-[#E6C79C]">
                    #{idx + 1}
                  </span>
                  <PlayerAvatar
                    player={p}
                    sizeClass="h-6 w-6 text-[9px]"
                    isConnectAccent={p.connectOnly}
                  />
                  <span className="truncate text-xs font-bold text-[#F3F4F6] underline decoration-[#6FB3A2]/50 underline-offset-2">
                    {p.nickname}
                  </span>
                </button>
                {r?.tier && (
                  <span
                    className={`rounded border px-2 py-0.5 text-[10px] font-bold ${r.tier.badgeClass}`}
                  >
                    {r.tier.symbol} {r.elo}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {connectMatches.length > 0 && (
          <div className="mt-2.5 border-t border-[#22252B] pt-2.5">
            <div className="mb-1.5 flex items-center justify-between text-[10px] font-bold text-[#8E95A2]">
              <span>Letzte freie Partie</span>
              <button
                type="button"
                onClick={() => onNavigateTab('matches')}
                className="text-[#A8D0B1] underline"
              >
                Alle Partien ({connectMatches.length})
              </button>
            </div>
            {connectMatches.slice(0, 1).map((m) => {
              const p1 = playersById[m.player1Id];
              const p2 = playersById[m.player2Id];
              const deltas = matchDeltas[m.id] || { delta1: 0, delta2: 0 };
              if (!p1 || !p2) return null;
              return (
                <div
                  key={m.id}
                  className="flex items-center justify-between gap-2 rounded-xl bg-[#131417] px-3 py-2 text-xs"
                >
                  <div className="truncate font-bold text-[#F3F4F6]">
                    {p1.nickname}{' '}
                    <span className="text-[10px] text-[#8E95A2]">
                      ({deltas.delta1 >= 0 ? `+${deltas.delta1}` : deltas.delta1})
                    </span>{' '}
                    vs. {p2.nickname}
                  </div>
                  <span className="shrink-0 rounded bg-[#181A1E] px-2 py-0.5 font-black text-[#E6C79C]">
                    {m.score}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. Neu im Club als striktes 3er-Grid */}
      {newMembers.length > 0 && (
        <div
          id="club-newbies-section"
          className="rounded-2xl border border-[#24272D] bg-[#181A1E] p-3.5"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wide text-[#F3F4F6]">
              Neu im Club ({newMembers.length})
            </span>
            <button
              type="button"
              onClick={onOpenEditProfile}
              className="text-[11px] font-bold text-[#A8D0B1] underline"
            >
              Mein Status
            </button>
          </div>

          <div className="mt-2.5 grid grid-cols-3 gap-2">
            {newMembers.map((p) => (
              <div
                key={p.id}
                className="flex flex-col justify-between rounded-xl border border-[#6FB3A2]/25 bg-[#131417] p-2 text-center"
              >
                <button
                  type="button"
                  onClick={() => onSelectMember?.(p.id)}
                  className="flex flex-col items-center text-center transition hover:opacity-85"
                >
                  <PlayerAvatar
                    player={p}
                    sizeClass="h-9 w-9 text-xs"
                    isConnectAccent
                  />
                  <div className="mt-1.5 w-full truncate text-[11px] font-black text-[#F3F4F6]">
                    {p.nickname}
                  </div>
                  <div className="w-full truncate text-[9px] text-[#8E95A2]">
                    {p.sttClass || 'CLUB'}
                  </div>
                </button>

                {p.id !== currentUser.id && (
                  <div className="mt-2 flex items-center justify-center gap-1">
                    <WhatsAppActionButton
                      phone={p.phone}
                      message={getContextWhatsAppMessage('new_member', currentUser, p)}
                      label=""
                      compact
                    />
                    <button
                      type="button"
                      onClick={() => onOpenLogMatch(p.id)}
                      title="Partie mit neuem Mitglied eintragen"
                      className="rounded-lg bg-[#6FB3A2] px-2 py-1 text-[9px] font-black text-[#060708]"
                    >
                      + Partie
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// RANGLISTE (KOMBINIERBARE FILTER-CHIPS OHNE HORIZONTALES SCROLLEN & TREFFERZÄHLER)
// ============================================================================

function ClubPlayersTab({
  players,
  currentUser,
  activeSeason,
  liveCheckins,
  connectRatings,
  onOpenAddMember,
  onOpenRecordConnectMatch,
  onSelectMember,
}) {
  const savedFilters = useMemo(
    () =>
      readStorageJson(STORAGE_KEYS.rankingFilters, {
        search: '',
        onlyLive: false,
        onlyLevel: false,
        playstyle: '',
        onlyEnglish: false,
      }),
    []
  );

  const [search, setSearch] = useState(savedFilters.search || '');
  const [onlyLive, setOnlyLive] = useState(Boolean(savedFilters.onlyLive));
  const [onlyLevel, setOnlyLevel] = useState(Boolean(savedFilters.onlyLevel));
  const [playstyleFilter, setPlaystyleFilter] = useState(savedFilters.playstyle || '');
  const [onlyEnglish, setOnlyEnglish] = useState(Boolean(savedFilters.onlyEnglish));

  useEffect(() => {
    writeStorageJson(STORAGE_KEYS.rankingFilters, {
      search,
      onlyLive,
      onlyLevel,
      playstyle: playstyleFilter,
      onlyEnglish,
    });
  }, [search, onlyLive, onlyLevel, playstyleFilter, onlyEnglish]);

  const livePlayerIds = useMemo(
    () => new Set(liveCheckins.map((c) => c.playerId)),
    [liveCheckins]
  );

  const sortedAndFilteredPlayers = useMemo(() => {
    const q = search.trim().toLowerCase();
    return [...players]
      .filter((p) => {
        if (onlyLive && !livePlayerIds.has(p.id)) return false;
        if (
          onlyLevel &&
          p.id !== currentUser.id &&
          !isMatchingLevel(currentUser, p, activeSeason)
        ) {
          return false;
        }
        if (playstyleFilter && p.playstyle !== playstyleFilter) return false;
        if (
          onlyEnglish &&
          p.language !== 'Englisch' &&
          p.language !== 'Beides'
        ) {
          return false;
        }

        if (!q) return true;
        const tierLabel = connectRatings[p.id]?.tier?.label || '';
        const haystack =
          `${p.nickname} ${p.firstName} ${p.lastName} ${p.sttClass || ''} ${
            p.language || ''
          } ${p.playstyle || ''} ${tierLabel}`.toLowerCase();
        return haystack.includes(q);
      })
      .sort((a, b) => {
        const eloA = connectRatings[a.id]?.elo || 0;
        const eloB = connectRatings[b.id]?.elo || 0;
        if (eloB !== eloA) return eloB - eloA;
        return a.nickname.localeCompare(b.nickname);
      });
  }, [
    players,
    search,
    onlyLive,
    onlyLevel,
    playstyleFilter,
    onlyEnglish,
    livePlayerIds,
    currentUser,
    activeSeason,
    connectRatings,
  ]);

  const activeFilterCount =
    (onlyLive ? 1 : 0) +
    (onlyLevel ? 1 : 0) +
    (playstyleFilter ? 1 : 0) +
    (onlyEnglish ? 1 : 0);

  const resetFilters = () => {
    setSearch('');
    setOnlyLive(false);
    setOnlyLevel(false);
    setPlaystyleFilter('');
    setOnlyEnglish(false);
  };

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-xs font-black tracking-wide text-[#F3F4F6] uppercase">
            CLUB-Rating ({sortedAndFilteredPlayers.length} Treffer)
          </h2>
          <p className="text-[10px] text-[#8E95A2]">
            Filter kombinierbar · {sortedAndFilteredPlayers.length} von {players.length}{' '}
            Spielern
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

      {/* Kombinierbares Filter-Raster ohne horizontales Scrollen */}
      <div className="space-y-1.5 rounded-xl border border-[#24272D] bg-[#14161A] p-2">
        <div className="grid grid-cols-3 gap-1.5">
          <button
            type="button"
            onClick={() => setOnlyLive((v) => !v)}
            className={`rounded-lg px-2 py-1.5 text-[10px] font-bold transition ${
              onlyLive
                ? 'bg-[#6FB3A2] text-[#060708]'
                : 'bg-[#181A1E] text-[#9CA3AF] ring-1 ring-[#24272D]'
            }`}
          >
            {onlyLive ? '✓ ' : ''}LIVE ({liveCheckins.length})
          </button>

          <button
            type="button"
            onClick={() => setOnlyLevel((v) => !v)}
            className={`rounded-lg px-2 py-1.5 text-[10px] font-bold transition ${
              onlyLevel
                ? 'bg-[#6FB3A2] text-[#060708]'
                : 'bg-[#181A1E] text-[#9CA3AF] ring-1 ring-[#24272D]'
            }`}
          >
            {onlyLevel ? '✓ ' : ''}Mein Niveau
          </button>

          <button
            type="button"
            onClick={() => setOnlyEnglish((v) => !v)}
            className={`rounded-lg px-2 py-1.5 text-[10px] font-bold transition ${
              onlyEnglish
                ? 'bg-[#6FB3A2] text-[#060708]'
                : 'bg-[#181A1E] text-[#9CA3AF] ring-1 ring-[#24272D]'
            }`}
          >
            {onlyEnglish ? '✓ ' : ''}EN / Beides
          </button>
        </div>

        <div className="grid grid-cols-3 gap-1.5">
          {PLAYSTYLE_OPTIONS.map((opt) => {
            const active = playstyleFilter === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setPlaystyleFilter(active ? '' : opt.value)}
                className={`rounded-lg px-2 py-1.5 text-[10px] font-bold transition ${
                  active
                    ? 'bg-[#6FB3A2] text-[#060708]'
                    : 'bg-[#181A1E] text-[#9CA3AF] ring-1 ring-[#24272D]'
                }`}
              >
                {active ? '✓ ' : ''}
                {opt.label}
              </button>
            );
          })}
        </div>

        {(activeFilterCount > 0 || search.trim()) && (
          <div className="flex items-center justify-between border-t border-[#22252B] pt-1.5 text-[10px]">
            <span className="font-semibold text-[#A8D0B1]">
              {sortedAndFilteredPlayers.length} Treffer aktiv
            </span>
            <button
              type="button"
              onClick={resetFilters}
              className="font-bold text-[#E6C79C] underline"
            >
              Filter zurücksetzen
            </button>
          </div>
        )}
      </div>

      <div className="divide-y divide-[#202329] overflow-hidden rounded-xl border border-[#24272D] bg-[#181A1E]">
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
              <button
                type="button"
                onClick={() => onSelectMember?.(p.id)}
                className="flex min-w-0 flex-1 items-center gap-1.5 text-left transition hover:opacity-85"
              >
                <span className="w-4 shrink-0 text-right text-[10px] font-black text-[#6B7280]">
                  {index + 1}
                </span>

                <PlayerAvatar
                  player={p}
                  sizeClass="h-5 w-5 text-[9px]"
                  isConnectAccent={p.connectOnly}
                />

                <span className="truncate font-bold text-[#F3F4F6] underline decoration-[#6FB3A2]/45 underline-offset-2">
                  {p.nickname}
                </span>

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
              </button>

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
                      message={getContextWhatsAppMessage('rating_directory', currentUser, p)}
                      label=""
                      compact
                      title={`${p.nickname} per WhatsApp anschreiben`}
                    />
                    <button
                      type="button"
                      onClick={() => onOpenRecordConnectMatch(p.id)}
                      title={`Spontane Partie mit ${p.nickname} eintragen`}
                      className="rounded bg-[#6FB3A2] px-2 py-0.5 text-[10px] font-black text-[#060708]"
                    >
                      +
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

// ============================================================================
// WEITERE TABS & MODALS (LIGA, HALLENTAGE, PARTIEN, ADMIN)
// ============================================================================

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

function LeagueOverviewTab({
  season,
  currentUser,
  playersById,
  daysRemaining,
  isCurrentUserPaused,
  onNavigateTab,
  onSelectMatchToRecord,
}) {
  const sortedLeagues = useMemo(
    () => [...(season?.leagues || [])].sort((a, b) => a.tier - b.tier),
    [season]
  );

  const myLeague = useMemo(
    () => sortedLeagues.find((l) => l.playerIds.includes(currentUser.id)) || sortedLeagues[0],
    [sortedLeagues, currentUser.id]
  );

  const myStandings = useMemo(
    () => (myLeague ? computeStandings(myLeague, season.matches || [], playersById) : []),
    [myLeague, season.matches, playersById]
  );

  const myRowIndex = myStandings.findIndex((r) => r.playerId === currentUser.id);
  const myRow = myRowIndex >= 0 ? myStandings[myRowIndex] : null;

  const myOpenMatches = useMemo(
    () =>
      (season.matches || []).filter(
        (m) =>
          m.score1 === null &&
          (m.player1Id === currentUser.id || m.player2Id === currentUser.id)
      ),
    [season.matches, currentUser.id]
  );

  const recentPlayedMatches = useMemo(
    () =>
      [...(season.matches || [])]
        .filter((m) => m.score1 !== null && m.score2 !== null)
        .reverse()
        .slice(0, 3),
    [season.matches]
  );

  const totalPlayedCount = useMemo(
    () =>
      (season.matches || []).filter((m) => m.score1 !== null && m.score2 !== null).length,
    [season.matches]
  );

  return (
    <div className="space-y-3.5">
      {/* Kompakte Kennzahlen */}
      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-xl border border-[#24272D] bg-[#181A1E] p-2.5 text-center">
          <div className="text-sm font-black text-[#F4ECC2]">
            {myLeague ? myLeague.name : isCurrentUserPaused ? 'Pause' : '–'}
          </div>
          <div className="mt-0.5 text-[10px] font-bold text-[#9CA3AF]">
            {myRow ? `Rang #${myRowIndex + 1} · ${myRow.points} Pkt.` : 'Monatsstatus'}
          </div>
        </div>

        <button
          type="button"
          onClick={() => onNavigateTab('matches')}
          className="rounded-xl border border-[#DE754B]/35 bg-[#181A1E] p-2.5 text-center transition hover:border-[#DE754B]"
        >
          <div className="text-sm font-black text-[#DE754B]">
            {myOpenMatches.length}
          </div>
          <div className="mt-0.5 text-[10px] font-bold text-[#9CA3AF]">
            Meine offenen Spiele
          </div>
        </button>

        <div className="rounded-xl border border-[#24272D] bg-[#181A1E] p-2.5 text-center">
          <div className="text-sm font-black text-[#A8D0B1]">
            {daysRemaining}d
          </div>
          <div className="mt-0.5 text-[10px] font-bold text-[#9CA3AF]">
            Restzeit · {totalPlayedCount} gespielt
          </div>
        </div>
      </div>

      {/* Eigene Gruppe kompakt */}
      {myLeague && (
        <div className="rounded-2xl border border-[#24272D] bg-[#181A1E] p-3.5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-black tracking-wide text-[#DE754B] uppercase">
              Deine Gruppe · {myLeague.name}
            </span>
            <button
              type="button"
              onClick={() => onNavigateTab('standings')}
              className="text-[11px] font-bold text-[#F4ECC2] underline"
            >
              Alle Tabellen →
            </button>
          </div>

          <div className="mt-2.5 divide-y divide-[#22252B] overflow-hidden rounded-xl border border-[#22252B] bg-[#131417]">
            {myStandings.map((row, idx) => {
              const isMe = row.playerId === currentUser.id;
              return (
                <div
                  key={row.playerId}
                  className={`flex items-center justify-between gap-2 px-3 py-2 text-xs ${
                    isMe ? 'bg-[#291711]' : ''
                  }`}
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="w-4 text-[11px] font-black text-[#9CA3AF]">
                      {idx + 1}.
                    </span>
                    <span className="truncate font-bold text-[#F3F4F6]">
                      {row.player?.nickname || 'Spieler'}
                    </span>
                  </div>
                  <div className="flex shrink-0 items-center gap-3 text-[11px]">
                    <span className="text-[#8E95A2]">
                      {row.won}S / {row.lost}N
                    </span>
                    <span className="text-[#8E95A2]">
                      {row.setsWon}:{row.setsLost}
                    </span>
                    <span className="w-9 rounded bg-[#181A1E] py-0.5 text-center font-black text-[#F4ECC2]">
                      {row.points}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Nächste offene Spiele des aktuellen Nutzers */}
      <div className="rounded-2xl border border-[#24272D] bg-[#181A1E] p-3.5">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-black tracking-wide text-[#F3F4F6] uppercase">
            Offene Liga-Partien ({myOpenMatches.length})
          </span>
          <button
            type="button"
            onClick={() => onNavigateTab('matches')}
            className="text-[11px] font-bold text-[#DE754B] underline"
          >
            Alle anzeigen →
          </button>
        </div>

        {myOpenMatches.length === 0 ? (
          <div className="mt-2.5 rounded-xl bg-[#131417] p-3 text-center text-xs text-[#A8D0B1]">
            Keine offenen Spiele mehr für dich in {season.label}.
          </div>
        ) : (
          <div className="mt-2.5 space-y-2">
            {myOpenMatches.slice(0, 3).map((m) => {
              const oppId = m.player1Id === currentUser.id ? m.player2Id : m.player1Id;
              const opp = playersById[oppId];
              return (
                <div
                  key={m.id}
                  className="flex items-center justify-between gap-2 rounded-xl bg-[#131417] px-3 py-2 text-xs"
                >
                  <span className="truncate font-bold text-[#F3F4F6]">
                    vs. {opp?.nickname || 'Mitspieler'}
                  </span>
                  <button
                    type="button"
                    onClick={() => onSelectMatchToRecord(m)}
                    className="shrink-0 rounded-lg bg-[#DE754B] px-2.5 py-1 text-[10px] font-black text-[#060708]"
                  >
                    Resultat
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Letzte Liga-Ergebnisse */}
      {recentPlayedMatches.length > 0 && (
        <div className="rounded-2xl border border-[#24272D] bg-[#181A1E] p-3.5">
          <div className="text-xs font-black tracking-wide text-[#F3F4F6] uppercase">
            Letzte Ergebnisse ({season.shortLabel})
          </div>
          <div className="mt-2.5 space-y-1.5">
            {recentPlayedMatches.map((m) => {
              const p1 = playersById[m.player1Id];
              const p2 = playersById[m.player2Id];
              return (
                <div
                  key={m.id}
                  className="flex items-center justify-between gap-2 rounded-xl bg-[#131417] px-3 py-2 text-xs"
                >
                  <span className="truncate text-[#D1D5DB]">
                    <strong className="text-[#F3F4F6]">{p1?.nickname}</strong> vs.{' '}
                    <strong className="text-[#F3F4F6]">{p2?.nickname}</strong>
                  </span>
                  <span className="shrink-0 rounded bg-[#181A1E] px-2 py-0.5 font-black text-[#F4ECC2]">
                    {m.score1} : {m.score2}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function LeagueStandingsTab({ season, playersById, currentUser, connectRatings }) {
  const sortedLeagues = [...season.leagues].sort((a, b) => a.tier - b.tier);

  return (
    <div className="space-y-4">
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

function HallDaysTab({
  players,
  currentUser,
  activeSeason,
  connectRatings,
  onOpenEditProfile,
  onOpenRecordConnectMatch,
  onSelectMember,
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
                selectedTimeSlot !== 'Alle' ? selectedTimeSlot : daySlots.join(' / '),
            });
            return (
              <div
                key={p.id}
                className="flex items-center justify-between gap-2 rounded-2xl border border-[#24272D] bg-[#181A1E] p-3"
              >
                <button
                  type="button"
                  onClick={() => onSelectMember?.(p.id)}
                  className="flex min-w-0 flex-1 items-center gap-2.5 text-left transition hover:opacity-85"
                >
                  <PlayerAvatar
                    player={p}
                    sizeClass="h-8 w-8 text-[10px]"
                    isConnectAccent={p.connectOnly}
                  />
                  <div className="min-w-0">
                    <div className="truncate text-xs font-black text-[#F3F4F6] underline decoration-[#6FB3A2]/50 underline-offset-2">
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
                </button>

                {p.id !== currentUser.id && (
                  <div className="flex shrink-0 items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => onOpenRecordConnectMatch(p.id)}
                      className="rounded-lg bg-[#6FB3A2] px-2.5 py-1.5 text-[11px] font-black text-[#060708]"
                    >
                      + Partie
                    </button>
                    <WhatsAppActionButton
                      phone={p.phone}
                      message={waMsg}
                      label="WhatsApp"
                    />
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

function ConnectMatchesTab({
  connectMatches,
  matchDeltas,
  playersById,
  currentUser,
  connectRatings,
  onOpenRecordConnectMatch,
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
            CLUB-Partien ({visibleMatches.length})
          </h2>
          <p className="text-[11px] text-[#8E95A2]">
            Freie Spiele fliessen direkt in das CLUB-Rating ein
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          {onOpenRecordConnectMatch && (
            <button
              type="button"
              onClick={onOpenRecordConnectMatch}
              className="rounded-lg bg-[#6FB3A2] px-2.5 py-1.5 text-[11px] font-black text-[#060708]"
            >
              + Partie
            </button>
          )}
          <button
            type="button"
            onClick={() => setOnlyMine((v) => !v)}
            className="rounded-lg bg-[#181A1E] px-2.5 py-1.5 text-[11px] font-bold text-[#A8D0B1] ring-1 ring-[#2B2F37]"
          >
            {onlyMine ? 'Alle' : 'Nur meine'}
          </button>
        </div>
      </div>

      {visibleMatches.length === 0 ? (
        <div className="rounded-2xl border border-[#24272D] bg-[#181A1E] p-5 text-center text-xs text-[#9CA3AF]">
          Noch keine CLUB-Partien in dieser Ansicht eingetragen.
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
                  <span className="font-bold text-[#6FB3A2]">CLUB-Partie</span>
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

function PlayerProfileModal({ currentUser, onLogout, onSave, onClose }) {
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    ...currentUser,
    language: currentUser.language || 'Deutsch',
    playstyle: currentUser.playstyle || 'Allround',
    typicalHallDays: currentUser.typicalHallDays || [],
    hallSchedule: getNormalizedHallSchedule(currentUser),
  });
  const [newPin, setNewPin] = useState('');
  const [newPinConfirm, setNewPinConfirm] = useState('');
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
    if (newPin || newPinConfirm) {
      if (!/^\d{4}$/.test(newPin)) {
        setProfileError('Der neue Profil-PIN muss genau 4 Ziffern haben.');
        return;
      }
      if (newPin !== newPinConfirm) {
        setProfileError('Die beiden neuen PIN-Eingaben stimmen nicht überein.');
        return;
      }
    }
    const activeDays = DAYS_OF_WEEK.filter(
      (d) => Array.isArray(form.hallSchedule?.[d]) && form.hallSchedule[d].length > 0
    );
    onSave({
      ...form,
      pin: newPin ? newPin : currentUser.pin || '1234',
      phone: normalizeWhatsAppPhone(form.phone),
      typicalHallDays: activeDays,
      hallSchedule: form.hallSchedule || {},
    });
    setNewPin('');
    setNewPinConfirm('');
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
    <div className="fixed inset-0 z-50 flex items-end justify-center overflow-x-hidden bg-black/75 p-2.5 sm:items-center sm:p-4">
      <div className="flex max-h-[88dvh] w-full max-w-md flex-col overflow-hidden rounded-2xl border border-[#2E323B] bg-[#181A1E] shadow-2xl">
        <div className="flex shrink-0 items-center justify-between border-b border-[#24272D] px-4 py-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <PlayerAvatar
              player={isEditing ? form : currentUser}
              sizeClass="h-9 w-9 text-xs"
              isConnectAccent={currentUser.connectOnly}
            />
            <div className="min-w-0">
              <h3 className="truncate text-sm font-black text-[#F3F4F6]">
                {currentUser.nickname}
              </h3>
              <div className="truncate text-[11px] text-[#8E95A2]">
                {currentUser.firstName} {currentUser.lastName}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-lg bg-[#24272D] px-2.5 py-1 text-xs font-bold text-[#9CA3AF] hover:text-[#F3F4F6]"
          >
            ✕
          </button>
        </div>

        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain p-3.5 sm:p-4">
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
            <form onSubmit={handleSubmit} className="space-y-2.5">
              <div className="flex items-center gap-3 rounded-xl border border-[#24272D] bg-[#131417] p-2.5">
                <PlayerAvatar
                  player={form}
                  sizeClass="h-11 w-11 text-sm"
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
                  className="w-full min-w-0 rounded-xl border border-[#2E323B] bg-[#131417] px-3 py-2 text-base sm:text-xs text-[#F3F4F6]"
                />
                <input
                  type="text"
                  value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  placeholder="Nachname"
                  className="w-full min-w-0 rounded-xl border border-[#2E323B] bg-[#131417] px-3 py-2 text-base sm:text-xs text-[#F3F4F6]"
                />
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={form.nickname}
                  onChange={(e) => setForm({ ...form, nickname: e.target.value })}
                  placeholder="Nickname"
                  className="min-w-0 flex-1 rounded-xl border border-[#2E323B] bg-[#131417] px-3 py-2 text-base sm:text-xs font-bold text-[#F3F4F6]"
                />
                <button
                  type="button"
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      nickname: generateFunnyNickname(prev.firstName, prev.nickname),
                    }))
                  }
                  className="inline-flex shrink-0 items-center justify-center gap-1 rounded-xl border border-[#C8A26E]/35 bg-[#1B1813] px-2.5 py-2 text-[11px] font-bold text-[#E6C79C] transition hover:border-[#C8A26E] hover:bg-[#252018]"
                >
                  <span>🎲</span>
                  <span>Vorschlag</span>
                </button>
              </div>

              <WhatsAppPhoneField
                value={form.phone}
                onChange={(val) => setForm({ ...form, phone: val })}
                placeholder="+41 79 123 45 67"
              />

              <div>
                <label className="mb-1 block text-[11px] font-semibold text-[#8E95A2]">
                  Spielstärke / Klassierung
                </label>
                <select
                  value={form.sttClass || 'Hobby'}
                  onChange={(e) => setForm({ ...form, sttClass: e.target.value })}
                  className="w-full min-w-0 rounded-xl border border-[#2E323B] bg-[#131417] px-2.5 py-2 text-base sm:text-xs font-bold text-[#F3F4F6]"
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
                    setForm((prev) => ({ ...prev, hallSchedule: nextSchedule }))
                  }
                />
              </div>

              <div className="rounded-xl border border-[#DE754B]/40 bg-[#131417] p-2.5">
                <label className="mb-1.5 block text-[11px] font-bold text-[#F4ECC2]">
                  4-stelligen Profil-PIN anpassen (optional)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="password"
                    inputMode="numeric"
                    maxLength={4}
                    value={newPin}
                    onChange={(e) =>
                      setNewPin(e.target.value.replace(/\D/g, '').slice(0, 4))
                    }
                    placeholder="Neuer PIN"
                    className="w-full rounded-xl border border-[#2E323B] bg-[#181A1E] px-2.5 py-2 text-center text-xs font-black tracking-[0.2em] text-[#F4ECC2]"
                  />
                  <input
                    type="password"
                    inputMode="numeric"
                    maxLength={4}
                    value={newPinConfirm}
                    onChange={(e) =>
                      setNewPinConfirm(e.target.value.replace(/\D/g, '').slice(0, 4))
                    }
                    placeholder="PIN bestätigen"
                    className="w-full rounded-xl border border-[#2E323B] bg-[#181A1E] px-2.5 py-2 text-center text-xs font-black tracking-[0.2em] text-[#F4ECC2]"
                  />
                </div>
              </div>

              {profileError && (
                <div className="rounded-xl border border-rose-500/40 bg-rose-950/30 px-3 py-2 text-[11px] font-bold text-rose-300">
                  {profileError}
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 pt-1">
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
            <span>Abmelden &amp; zur Startseite zurück</span>
          </button>
        </div>
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
          placeholder="+41 79 123 45 67"
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
  connectRatings,
  connectMatches,
  liveCheckins,
  sessions,
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
  onDeleteSession,
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
      if (idx === 0 && /^(vorname|first|name|nachname)/i.test(cols[0])) return;

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
                      setBulkDefaultPin(e.target.value.replace(/\D/g, '').slice(0, 4))
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
                placeholder={`Beispiel:\nMax; Muster; MaxPower; +41 79 123 45 67; C8; 1234`}
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
                      className="shrink-0 rounded-lg bg-[#252830] px-2.5 py-1.5 text-[11px] font-bold text-[#F3F4F6]"
                    >
                      {isEditing ? 'Schliessen' : 'Bearbeiten'}
                    </button>
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
                      onChange={(e) => onAssignPlayerLeague(p.id, e.target.value)}
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
          <div className="rounded-2xl border border-[#24272D] bg-[#181A1E] px-3.5 py-2.5 text-xs font-bold text-[#F4ECC2]">
            Aktueller Monat: {viewedSeason.label}
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
              CLUB-Partien ({connectMatches.length})
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
                    <span className="ml-2 font-black text-[#E6C79C]">{cm.score}</span>
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
                      {c.durationLabel}
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
            <div className="mb-2 text-xs font-black text-[#F3F4F6]">
              Spontan-Sessions ({sessions.length})
            </div>
            {sessions.length === 0 ? (
              <div className="text-xs text-[#8E95A2]">Keine aktiven Sessions.</div>
            ) : (
              <div className="space-y-1.5">
                {sessions.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between rounded-xl bg-[#131417] px-3 py-2 text-xs"
                  >
                    <span className="truncate pr-2">
                      {playersById[s.authorId]?.nickname}: {s.dateLabel}
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
            )}
          </div>
        </div>
      )}
    </div>
  );
}
