import { IMatch } from "../models/match";

// ALGORITHM: Weighted Graph Matching
//
// Swiss pairing is Maximum Weight Matching on a general graph G where:
//   Nodes  = players
//   Edges  = valid pairings (invalid ones are hard-filtered before any edge is built)
//   Weight = FIDE-priority-encoded pairing quality
//
//   Build all valid edges, sort by weight, greedily assign best pairings.
//
//   If greedy leaves >=2 unmatched players, scan for a 2-hop swap that frees them.

export interface SwissPlayer {
  id: string;
  rating: number;
  score: number;
  opponents: Set<string>;
  wCount: number;
  bCount: number;
  colorStreak: number;
  hadBye: boolean;
  floatDownCount: number;
  floatUpCount: number;
}

interface WeightedEdge {
  p1: SwissPlayer;
  p2: SwissPlayer;
  weight: number;
}

interface PairingMatch {
  white: string;
  black: string;
  isBye: boolean;
  combinedScore: number;
}

export interface RoundPairing {
  round: number;
  boardNumber: number;
  white: string;
  black: string;
  isBye: boolean;
}

const buildPlayerProfiles = (
  participants: any[],
  previousMatches: IMatch[],
  formatType: string,
): Record<string, SwissPlayer> => {
  const profiles: Record<string, SwissPlayer> = {};

  participants.forEach((p) => {
    const formatKey: string = formatType.toLowerCase() || "rapid";

    const rating: number = p.isGuest
      ? (p.guestRating ?? 1200)
      : (p.user?.ratings?.[formatKey] ?? 1200);

    profiles[p._id.toString()] = {
      id: p._id.toString(),
      rating,
      score: 0,
      opponents: new Set(),
      wCount: 0,
      bCount: 0,
      colorStreak: 0,
      hadBye: false,
      floatDownCount: 0,
      floatUpCount: 0,
    };
  });

  const sortedMatches = [...previousMatches].sort((a, b) => a.round - b.round);
  const matchesByRound = new Map<number, IMatch[]>();

  for (const match of sortedMatches) {
    const bucket = matchesByRound.get(match.round) ?? [];
    bucket.push(match);
    matchesByRound.set(match.round, bucket);
  }

  const roundNumbers = [...matchesByRound.keys()].sort((a, b) => a - b);

  for (const roundNum of roundNumbers) {
    const roundMatches = matchesByRound.get(roundNum)!;
    const preRoundScore: Record<string, number> = {};
    for (const id in profiles) preRoundScore[id] = profiles[id].score;

    for (const match of roundMatches) {
      if (match.result === "*") continue;

      const w = match.whitePlayer.toString();
      const b = match.blackPlayer?.toString() ?? null;

      if (match.result === "BYE" || !b) {
        if (profiles[w]) {
          profiles[w].score += 1;
          profiles[w].hadBye = true;
        }
        continue;
      }

      const pw = profiles[w];
      const pb = profiles[b];
      if (!pw || !pb) continue;

      const wPre = preRoundScore[w] ?? 0;
      const bPre = preRoundScore[b] ?? 0;

      if (wPre > bPre) {
        pw.floatDownCount++;
        pb.floatUpCount++;
      } else if (bPre > wPre) {
        pb.floatDownCount++;
        pw.floatUpCount++;
      }

      pw.opponents.add(b);
      pb.opponents.add(w);
      pw.wCount++;
      pb.bCount++;

      pw.colorStreak = pw.colorStreak > 0 ? pw.colorStreak + 1 : 1;
      pb.colorStreak = pb.colorStreak < 0 ? pb.colorStreak - 1 : -1;

      if (match.result === "1-0") pw.score += 1;
      else if (match.result === "0-1") pb.score += 1;
      else if (match.result === "1/2-1/2") {
        pw.score += 0.5;
        pb.score += 0.5;
      }
    }
  }

  return profiles;
};

//pairing validity check based on previous opponents and color streaks

const isValidPairing = (p1: SwissPlayer, p2: SwissPlayer): boolean => {
  if (p1.opponents.has(p2.id)) return false;

  const p1MustBeBlack = p1.colorStreak >= 2;
  const p1MustBeWhite = p1.colorStreak <= -2;
  const p2MustBeBlack = p2.colorStreak >= 2;
  const p2MustBeWhite = p2.colorStreak <= -2;

  if (p1MustBeBlack && p2MustBeBlack) return false;
  if (p1MustBeWhite && p2MustBeWhite) return false;

  return true;
};

// color assignment

const assignSwissColors = (
  p1: SwissPlayer,
  p2: SwissPlayer,
): { white: string; black: string } => {
  if (p1.colorStreak >= 2) return { white: p2.id, black: p1.id };
  if (p1.colorStreak <= -2) return { white: p1.id, black: p2.id };
  if (p2.colorStreak >= 2) return { white: p1.id, black: p2.id };
  if (p2.colorStreak <= -2) return { white: p2.id, black: p1.id };

  const diff1 = p1.wCount - p1.bCount;
  const diff2 = p2.wCount - p2.bCount;
  if (diff1 < diff2) return { white: p1.id, black: p2.id };
  if (diff2 < diff1) return { white: p2.id, black: p1.id };

  if (p1.colorStreak < 0 && p2.colorStreak >= 0)
    return { white: p1.id, black: p2.id };
  if (p2.colorStreak < 0 && p1.colorStreak >= 0)
    return { white: p2.id, black: p1.id };

  return p1.rating >= p2.rating
    ? { white: p1.id, black: p2.id }
    : { white: p2.id, black: p1.id };
};

//pairing weight calculation based on score difference, float status, color preferences, and rating difference

const colorConflictScore = (p1: SwissPlayer, p2: SwissPlayer): number => {
  const p1PrefersBlack = p1.wCount > p1.bCount || p1.colorStreak > 0;
  const p2PrefersBlack = p2.wCount > p2.bCount || p2.colorStreak > 0;
  const p1PrefersWhite = p1.wCount < p1.bCount || p1.colorStreak < 0;
  const p2PrefersWhite = p2.wCount < p2.bCount || p2.colorStreak < 0;

  if (
    (p1.colorStreak >= 2 && p2PrefersBlack) ||
    (p2.colorStreak >= 2 && p1PrefersBlack)
  )
    return 3;
  if (
    (p1.colorStreak <= -2 && p2PrefersWhite) ||
    (p2.colorStreak <= -2 && p1PrefersWhite)
  )
    return 3;

  if (p1PrefersBlack && p2PrefersBlack) return 2;
  if (p1PrefersWhite && p2PrefersWhite) return 2;

  if (
    (p1PrefersBlack && !p2PrefersWhite) ||
    (p2PrefersBlack && !p1PrefersWhite)
  )
    return 1;

  return 0;
};

const pairingWeight = (p1: SwissPlayer, p2: SwissPlayer): number => {
  const scorePenalty = Math.abs(p1.score - p2.score) * 10_000;
  const floater = p1.score > p2.score ? p1 : p2;
  const floatPenalty =
    p1.score !== p2.score ? floater.floatDownCount * 1_000 : 0;
  const colorPenalty = colorConflictScore(p1, p2) * 100;
  const ratingPenalty = Math.abs(p1.rating - p2.rating) * 0.01;

  return 100_000 - scorePenalty - floatPenalty - colorPenalty - ratingPenalty;
};

//weighted greedy matching

const greedyMatch = (
  bracket: SwissPlayer[],
): { matches: PairingMatch[]; unmatched: SwissPlayer[] } => {
  const edges: WeightedEdge[] = [];

  for (let i = 0; i < bracket.length; i++) {
    for (let j = i + 1; j < bracket.length; j++) {
      if (isValidPairing(bracket[i], bracket[j])) {
        edges.push({
          p1: bracket[i],
          p2: bracket[j],
          weight: pairingWeight(bracket[i], bracket[j]),
        });
      }
    }
  }

  edges.sort((a, b) => b.weight - a.weight);

  const matched = new Set<string>();
  const matches: PairingMatch[] = [];

  for (const { p1, p2 } of edges) {
    if (matched.has(p1.id) || matched.has(p2.id)) continue;
    matched.add(p1.id);
    matched.add(p2.id);
    const colors = assignSwissColors(p1, p2);
    matches.push({
      white: colors.white,
      black: colors.black,
      isBye: false,
      combinedScore: p1.score + p2.score,
    });
  }

  const unmatched = bracket.filter((p) => !matched.has(p.id));
  return { matches, unmatched };
};

//augment matching by finding 2-hop swaps that free unmatched players
const augmentMatching = (
  matches: PairingMatch[],
  unmatched: SwissPlayer[],
  playerById: Map<string, SwissPlayer>,
): boolean => {
  for (let ui = 0; ui < unmatched.length; ui++) {
    const u = unmatched[ui];

    for (let mi = 0; mi < matches.length; mi++) {
      const m = matches[mi];
      const a = playerById.get(m.white)!;
      const b = playerById.get(m.black)!;

      if (isValidPairing(u, b)) {
        for (let vi = 0; vi < unmatched.length; vi++) {
          if (vi === ui) continue;
          const v = unmatched[vi];
          if (isValidPairing(a, v)) {
            matches.splice(mi, 1);
            const c1 = assignSwissColors(u, b);
            const c2 = assignSwissColors(a, v);
            matches.push(
              {
                white: c1.white,
                black: c1.black,
                isBye: false,
                combinedScore: u.score + b.score,
              },
              {
                white: c2.white,
                black: c2.black,
                isBye: false,
                combinedScore: a.score + v.score,
              },
            );
            unmatched.splice(Math.max(ui, vi), 1);
            unmatched.splice(Math.min(ui, vi), 1);
            return true;
          }
        }
      }

      if (isValidPairing(u, a)) {
        for (let vi = 0; vi < unmatched.length; vi++) {
          if (vi === ui) continue;
          const v = unmatched[vi];
          if (isValidPairing(b, v)) {
            matches.splice(mi, 1);
            const c1 = assignSwissColors(u, a);
            const c2 = assignSwissColors(b, v);
            matches.push(
              {
                white: c1.white,
                black: c1.black,
                isBye: false,
                combinedScore: u.score + a.score,
              },
              {
                white: c2.white,
                black: c2.black,
                isBye: false,
                combinedScore: b.score + v.score,
              },
            );
            unmatched.splice(Math.max(ui, vi), 1);
            unmatched.splice(Math.min(ui, vi), 1);
            return true;
          }
        }
      }
    }
  }
  return false;
};

const pairBracket = (
  bracket: SwissPlayer[],
): { matches: PairingMatch[]; downfloaters: SwissPlayer[] } => {
  if (bracket.length === 0) return { matches: [], downfloaters: [] };
  if (bracket.length === 1) return { matches: [], downfloaters: [bracket[0]] };

  const playerById = new Map(bracket.map((p) => [p.id, p]));
  const { matches, unmatched } = greedyMatch(bracket);

  while (unmatched.length >= 2) {
    if (!augmentMatching(matches, unmatched, playerById)) break;
  }

  return { matches, downfloaters: unmatched };
};

export const generateSwissPairings = (
  participants: any[],
  previousMatches: IMatch[],
  roundNumber: number,
  formatType: string = "rapid",
): RoundPairing[] => {
  const profilesMap = buildPlayerProfiles(
    participants,
    previousMatches,
    formatType,
  );
  let playerPool = Object.values(profilesMap);
  const allMatches: PairingMatch[] = [];

  if (playerPool.length % 2 !== 0) {
    playerPool.sort((a, b) =>
      a.score !== b.score ? a.score - b.score : a.rating - b.rating,
    );
    const byeIdx = playerPool.findIndex((p) => !p.hadBye);
    const targetIdx = byeIdx !== -1 ? byeIdx : 0;
    const [byePlayer] = playerPool.splice(targetIdx, 1);
    allMatches.push({
      white: byePlayer.id,
      black: "BYE",
      isBye: true,
      combinedScore: -1,
    });
  }

  const scoreBrackets: Record<number, SwissPlayer[]> = {};
  for (const p of playerPool) {
    const key = Math.round(p.score * 10);
    (scoreBrackets[key] ??= []).push(p);
  }

  const descendingKeys = Object.keys(scoreBrackets)
    .map(Number)
    .sort((a, b) => b - a);

  let pendingDownfloaters: SwissPlayer[] = [];

  for (const scoreKey of descendingKeys) {
    const nativeGroup = scoreBrackets[scoreKey].sort(
      (a, b) => b.rating - a.rating,
    );
    const currentBracket = [...pendingDownfloaters, ...nativeGroup];

    const { matches, downfloaters } = pairBracket(currentBracket);
    allMatches.push(...matches);
    pendingDownfloaters = downfloaters;
  }

  while (pendingDownfloaters.length >= 2) {
    const p1 = pendingDownfloaters.shift()!;
    const p2Idx = pendingDownfloaters.findIndex((p) => isValidPairing(p1, p));
    const targetIdx = p2Idx !== -1 ? p2Idx : 0;
    const [p2] = pendingDownfloaters.splice(targetIdx, 1);
    const colors = assignSwissColors(p1, p2);
    allMatches.push({
      white: colors.white,
      black: colors.black,
      isBye: false,
      combinedScore: p1.score + p2.score,
    });
  }

  allMatches.sort((a, b) => b.combinedScore - a.combinedScore);

  return allMatches.map((m, index) => ({
    round: roundNumber,
    boardNumber: index + 1,
    white: m.white,
    black: m.black,
    isBye: m.isBye,
  }));
};
