import { IMatch } from "../models/match";

export interface PlayerStats {
  id: string;
  name: string;
  rating: number;
  isGuest: boolean;
  score: number;
  wins: number;
  draws: number;
  losses: number;
  playedBlack: number;

  matchHistory: {
    opponentId: string | null;
    outcome: "W" | "D" | "L" | "BYE";
  }[];

  cumulativeScores: number[];
  tiebreaks: {
    buchholzCut1: number;
    buchholz: number;
    sonnebornBerger: number;
    progressiveScore: number;
    directEncounter: number;
  };
}

export interface Standing extends PlayerStats {
  rank: number;
}

const r2 = (n: number) => Math.round(n * 100) / 100;

export const calculateStandings = (
  participants: any[],
  matches: IMatch[],
  formatType: string = "rapid",
): Standing[] => {
  const statsMap = new Map<string, PlayerStats>();

  participants.forEach((p) => {
    const formatKey = formatType.toLowerCase();
    const rating = p.isGuest
      ? (p.guestRating ?? 1200)
      : (p.user?.ratings?.[formatKey] ?? 1200);

    const name = p.isGuest
      ? (p.guestName ?? "Guest")
      : [p.user?.firstName, p.user?.lastName].filter(Boolean).join(" ") ||
        "Unknown";

    statsMap.set(p._id.toString(), {
      id: p._id.toString(),
      name,
      rating,
      isGuest: p.isGuest,
      score: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      playedBlack: 0,
      matchHistory: [],
      cumulativeScores: [],
      tiebreaks: {
        buchholzCut1: 0,
        buchholz: 0,
        sonnebornBerger: 0,
        progressiveScore: 0,
        directEncounter: 0,
      },
    });
  });

  const matchesByRound = new Map<number, IMatch[]>();
  for (const match of matches) {
    if (match.result === "*") continue;
    const bucket = matchesByRound.get(match.round) ?? [];
    bucket.push(match);
    matchesByRound.set(match.round, bucket);
  }

  const roundNumbers = [...matchesByRound.keys()].sort((a, b) => a - b);

  for (const roundNum of roundNumbers) {
    const roundMatches = matchesByRound.get(roundNum)!;

    for (const match of roundMatches) {
      const wId = match.whitePlayer.toString();
      const bId = match.blackPlayer?.toString() ?? null;
      const whitePlayer = statsMap.get(wId);
      const blackPlayer = bId ? statsMap.get(bId) : null;

      if (match.result === "BYE" || !bId) {
        if (whitePlayer) {
          whitePlayer.score += 1;
          whitePlayer.wins += 1;
          whitePlayer.matchHistory.push({ opponentId: null, outcome: "BYE" });
        }
        continue;
      }

      if (!whitePlayer || !blackPlayer) continue;

      blackPlayer.playedBlack += 1;

      if (match.result === "1-0") {
        whitePlayer.score += 1;
        whitePlayer.wins += 1;
        whitePlayer.matchHistory.push({ opponentId: bId, outcome: "W" });
        blackPlayer.losses += 1;
        blackPlayer.matchHistory.push({ opponentId: wId, outcome: "L" });
      } else if (match.result === "0-1") {
        blackPlayer.score += 1;
        blackPlayer.wins += 1;
        blackPlayer.matchHistory.push({ opponentId: wId, outcome: "W" });
        whitePlayer.losses += 1;
        whitePlayer.matchHistory.push({ opponentId: bId, outcome: "L" });
      } else if (match.result === "1/2-1/2") {
        whitePlayer.score += 0.5;
        whitePlayer.draws += 1;
        whitePlayer.matchHistory.push({ opponentId: bId, outcome: "D" });
        blackPlayer.score += 0.5;
        blackPlayer.draws += 1;
        blackPlayer.matchHistory.push({ opponentId: wId, outcome: "D" });
      }
    }

    for (const player of statsMap.values()) {
      player.cumulativeScores.push(player.score);
    }
  }

  const players = Array.from(statsMap.values());

  players.forEach((player) => {
    let buchholzSum = 0;
    let sonnebornBergerSum = 0;
    const opponentScores: number[] = [];

    const byeCount = player.matchHistory.filter(
      (r) => r.outcome === "BYE",
    ).length;
    const scoreExcludingByes = player.score - byeCount;

    player.matchHistory.forEach((record) => {
      if (record.outcome === "BYE" || !record.opponentId) {
        buchholzSum += scoreExcludingByes;
        opponentScores.push(scoreExcludingByes);
        sonnebornBergerSum += scoreExcludingByes;
        return;
      }

      const opponent = statsMap.get(record.opponentId);
      if (!opponent) return;

      buchholzSum += opponent.score;
      opponentScores.push(opponent.score);

      if (record.outcome === "W") sonnebornBergerSum += opponent.score;
      else if (record.outcome === "D")
        sonnebornBergerSum += opponent.score * 0.5;
    });

    player.tiebreaks.buchholz = r2(buchholzSum);
    player.tiebreaks.sonnebornBerger = r2(sonnebornBergerSum);

    if (opponentScores.length > 1) {
      const minScore = Math.min(...opponentScores);
      player.tiebreaks.buchholzCut1 = r2(buchholzSum - minScore);
    } else {
      player.tiebreaks.buchholzCut1 = r2(buchholzSum);
    }

    player.tiebreaks.progressiveScore = r2(
      player.cumulativeScores.reduce((sum, s) => sum + s, 0),
    );
  });

  players.sort((a, b) => {
    if (a.score !== b.score) return b.score - a.score;
    if (a.tiebreaks.buchholzCut1 !== b.tiebreaks.buchholzCut1)
      return b.tiebreaks.buchholzCut1 - a.tiebreaks.buchholzCut1;
    if (a.tiebreaks.buchholz !== b.tiebreaks.buchholz)
      return b.tiebreaks.buchholz - a.tiebreaks.buchholz;
    if (a.tiebreaks.sonnebornBerger !== b.tiebreaks.sonnebornBerger)
      return b.tiebreaks.sonnebornBerger - a.tiebreaks.sonnebornBerger;
    if (a.tiebreaks.progressiveScore !== b.tiebreaks.progressiveScore)
      return b.tiebreaks.progressiveScore - a.tiebreaks.progressiveScore;
    return 0;
  });

  const finalStandings: Standing[] = [];
  let currentRank = 1;
  let i = 0;

  while (i < players.length) {
    const tieGroup = [players[i]];
    let j = i + 1;

    while (
      j < players.length &&
      players[j].score === players[i].score &&
      players[j].tiebreaks.buchholzCut1 === players[i].tiebreaks.buchholzCut1 &&
      players[j].tiebreaks.buchholz === players[i].tiebreaks.buchholz &&
      players[j].tiebreaks.sonnebornBerger ===
        players[i].tiebreaks.sonnebornBerger &&
      players[j].tiebreaks.progressiveScore ===
        players[i].tiebreaks.progressiveScore
    ) {
      tieGroup.push(players[j]);
      j++;
    }

    if (tieGroup.length > 1) {
      const opponentSets = new Map(
        tieGroup.map((p) => [
          p.id,
          new Set(p.matchHistory.map((m) => m.opponentId)),
        ]),
      );

      // Direct Encounter is only valid if every player in the tie group has played every other player.
      let allPlayed = true;
      outer: for (const a of tieGroup) {
        for (const b of tieGroup) {
          if (a.id !== b.id && !opponentSets.get(a.id)!.has(b.id)) {
            allPlayed = false;
            break outer; // labeled break — exits both loops at once
          }
        }
      }

      for (const a of tieGroup) {
        a.tiebreaks.directEncounter = 0;
      }

      if (allPlayed) {
        for (const a of tieGroup) {
          for (const record of a.matchHistory) {
            if (
              record.opponentId &&
              opponentSets.get(a.id)!.has(record.opponentId)
            ) {
              if (tieGroup.some((t) => t.id === record.opponentId)) {
                if (record.outcome === "W") a.tiebreaks.directEncounter += 1;
                if (record.outcome === "D") a.tiebreaks.directEncounter += 0.5;
              }
            }
          }
        }
      }

      tieGroup.sort((a, b) => {
        if (
          allPlayed &&
          a.tiebreaks.directEncounter !== b.tiebreaks.directEncounter
        )
          return b.tiebreaks.directEncounter - a.tiebreaks.directEncounter;

        if (a.wins !== b.wins) return b.wins - a.wins;

        if (a.playedBlack !== b.playedBlack)
          return b.playedBlack - a.playedBlack;

        return b.rating - a.rating;
      });

      for (let k = 0; k < tieGroup.length; k++) {
        const p = tieGroup[k];

        if (k === 0) {
          currentRank = i + 1;
        } else {
          const prev = tieGroup[k - 1];
          const isPerfectTie =
            (!allPlayed ||
              prev.tiebreaks.directEncounter === p.tiebreaks.directEncounter) &&
            prev.wins === p.wins &&
            prev.playedBlack === p.playedBlack;

          if (!isPerfectTie) {
            currentRank = i + k + 1;
          }
        }

        finalStandings.push({ ...p, rank: currentRank });
      }
    } else {
      currentRank = i + 1;
      finalStandings.push({ ...tieGroup[0], rank: currentRank });
    }

    i = j;
  }

  return finalStandings;
};
