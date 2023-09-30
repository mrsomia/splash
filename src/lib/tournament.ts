import _ from "lodash";

export function getUpperFactorOf2(amount: number) {
  let i = 2;
  while (amount > i) {
    i = i * 2;
  }
  return i;
}

export function getNumberOfRounds(amount: number) {
  let count = 0;
  let current = amount;
  while (current > 1) {
    current = current / 2;
    count++;
  }
  return count;
}

export function createRandomeScheduleForTeams(t: string[]) {
  const teamIds = _.shuffle(t);
  return createScheduleForShuffledTeams(teamIds);
}

export function getStartIndex(numberOfExpectedTeams: number) {
  return numberOfExpectedTeams - 1 - numberOfExpectedTeams / 2;
}

export function createScheduleForShuffledTeams(teamIds: string[]) {
  const expectedTeams = getUpperFactorOf2(teamIds.length);
  const numberOfRounds = getNumberOfRounds(expectedTeams);
  const numberOfGames = expectedTeams - 1;

  const result: [null | string, null | string][] = new Array(numberOfGames)
    .fill(null)
    .map((_) => [null, null]);

  const startIdx = getStartIndex(expectedTeams);
  const gamesInLastRound = 2 ** (numberOfRounds - 1);
  for (let i = 0; i < teamIds.length; i++) {
    if (i < gamesInLastRound) {
      result[startIdx + i][0] = teamIds[i];
    } else {
      result[startIdx + (i - gamesInLastRound)][1] = teamIds[i];
    }
  }
  return result;
}
