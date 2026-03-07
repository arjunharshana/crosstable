export interface KnockoutMatch {
  round: number;
  boardNumber: number;
  white: string;
  black: string;
  isBye: boolean;
}

const generateBracketSeeds = (powerOfTwo: number): number[] => {
  if (powerOfTwo <= 1) return [1];

  let bracket = [1, 2];
  const rounds = Math.log2(powerOfTwo);

  for (let round = 1; round < rounds; round++) {
    const nextBracket: number[] = [];
    const sum = Math.pow(2, round + 1) + 1;

    for (const seed of bracket) {
      nextBracket.push(seed);
      nextBracket.push(sum - seed);
    }

    bracket = nextBracket;
  }

  return bracket;
};

export const generateKnockoutRoundOne = (
  seededPlayers: string[],
): KnockoutMatch[] => {
  const numPlayers = seededPlayers.length;
  if (numPlayers === 0) return [];

  const powerOfTwo = Math.pow(2, Math.ceil(Math.log2(numPlayers)));
  const bracketSeeds = generateBracketSeeds(powerOfTwo);

  const matches: KnockoutMatch[] = [];
  let boardNumber = 1;

  for (let i = 0; i < bracketSeeds.length; i += 2) {
    const seed1 = bracketSeeds[i];
    const seed2 = bracketSeeds[i + 1];

    const p1 = seed1 <= numPlayers ? seededPlayers[seed1 - 1] : "BYE";
    const p2 = seed2 <= numPlayers ? seededPlayers[seed2 - 1] : "BYE";

    const isBye = p1 === "BYE" || p2 === "BYE";

    const isP1White = seed1 < seed2;

    matches.push({
      round: 1,
      boardNumber: boardNumber++,
      white: isP1White ? p1 : p2,
      black: isP1White ? p2 : p1,
      isBye,
    });
  }

  return matches;
};

export const generateNextKnockoutRound = (
  advancingPlayers: string[],
  roundNumber: number,
  startingBoardNumber: number = 1,
): KnockoutMatch[] => {
  if (advancingPlayers.length % 2 !== 0) {
    throw new Error(
      "Invalid number of advancing players. Bracket must be even.",
    );
  }

  const matches: KnockoutMatch[] = [];
  let boardNumber = startingBoardNumber;

  for (let i = 0; i < advancingPlayers.length; i += 2) {
    const p1 = advancingPlayers[i];
    const p2 = advancingPlayers[i + 1];

    if (!p1 || !p2) {
      throw new Error("Unexpected undefined player in knockout pairing.");
    }

    const isP1White = (i / 2) % 2 === 0;

    matches.push({
      round: roundNumber,
      boardNumber: boardNumber++,
      white: isP1White ? p1 : p2,
      black: isP1White ? p2 : p1,
      isBye: false,
    });
  }

  return matches;
};
