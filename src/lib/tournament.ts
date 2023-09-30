import { type teamsSelect } from "@/db/schema";
import * as _ from "lodash";

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
  const teams = _.shuffle(t);
  return createScheduleForShuffledTeams(teams);
}

export function createScheduleForShuffledTeams(teams: string[]) {
  const expectedTeams = getUpperFactorOf2(teams.length);
  const numberOfRounds = getNumberOfRounds(expectedTeams);
  const numberOfGames = expectedTeams - 1;

  // Change this type if changing what to return
  // e.g. team id or team object
  type nullOrTeam = null | string;
  const result: [nullOrTeam, nullOrTeam][] = new Array(numberOfGames)
    .fill(null)
    .map((_) => [null, null]);

  const startIdx = getStartIndex(expectedTeams);
  const gamesInLastRound = 2 ** (numberOfRounds - 1);
  for (let i = 0; i < teams.length; i++) {
    const team = teams[i];
    if (i < gamesInLastRound) {
      result[startIdx + i][0] = team;
    } else {
      result[startIdx + (i - gamesInLastRound)][1] = team;
    }
  }
  return result;
}

export function getStartIndex(numberOfExpectedTeams: number) {
  return numberOfExpectedTeams - 1 - numberOfExpectedTeams / 2;
}
