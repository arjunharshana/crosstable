// backend/src/utils/roundRobin.ts

interface Match {
  round: number;
  boardNumber: number;
  white: string;
  black: string;
  isBye: boolean;
}

interface ColorHistory {
  w: number;
  b: number;
  streak: number;
}

const assignColors = (
  p1: string,
  p2: string,
  history: Record<string, ColorHistory>,
) => {
  const h1 = history[p1];
  const h2 = history[p2];

  //check for streaks first
  if (h1.streak >= 2) return { white: p2, black: p1 };
  if (h1.streak <= -2) return { white: p1, black: p2 };
  if (h2.streak >= 2) return { white: p1, black: p2 };
  if (h2.streak <= -2) return { white: p2, black: p1 };

  //check for color imbalance1
  const p1Imbalance = h1.w - h1.b;
  const p2Imbalance = h2.w - h2.b;

  if (p1Imbalance < p2Imbalance) return { white: p1, black: p2 };
  if (p2Imbalance < p1Imbalance) return { white: p2, black: p1 };

  // if still tied, assign randomly
  if (h1.streak < 0) return { white: p1, black: p2 };

  return { white: p2, black: p1 };
};

//this function updates the history after each match, incrementing wins/losses and updating streaks
const updateHistory = (
  white: string,
  black: string,
  history: Record<string, ColorHistory>,
) => {
  const hw = history[white];
  const hb = history[black];

  // update counts
  hw.w += 1;
  hb.b += 1;

  // update streaks
  hw.streak = hw.streak >= 0 ? hw.streak + 1 : 1;
  hb.streak = hb.streak <= 0 ? hb.streak - 1 : -1;
};

// Main Engine
export const generateRoundRobinPairings = (participants: string[]) => {
  let players = [...participants].sort(() => Math.random() - 0.5);

  if (players.length % 2 !== 0) {
    players.push("BYE");
  }

  const numPlayers = players.length;
  const totalRounds = numPlayers - 1;
  const matches: Match[] = [];

  const history: Record<string, ColorHistory> = {};
  participants.forEach((p) => {
    history[p] = { w: 0, b: 0, streak: 0 };
  });

  for (let round = 1; round <= totalRounds; round++) {
    const roundMatches: Match[] = [];

    for (let i = 0; i < numPlayers / 2; i++) {
      const p1 = players[i];
      const p2 = players[numPlayers - 1 - i];

      const isBye = p1 === "BYE" || p2 === "BYE";

      if (isBye) {
        roundMatches.push({
          round,
          boardNumber: i + 1,
          white: p1 === "BYE" ? p2 : p1,
          black: "BYE",
          isBye: true,
        });
      } else {
        const { white, black } = assignColors(p1, p2, history);

        roundMatches.push({
          round,
          boardNumber: i + 1,
          white,
          black,
          isBye: false,
        });

        updateHistory(white, black, history);
      }
    }

    matches.push(...roundMatches);

    const lastPlayer = players.pop();
    if (lastPlayer) {
      players.splice(1, 0, lastPlayer);
    }
  }

  return matches;
};
