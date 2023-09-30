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

export function createRandomeScheduleForTeams(t: teamsSelect[]) {
  const teams = _.shuffle(t);
  return createScheduleForShuffledTeams(teams);
}

export function createScheduleForShuffledTeams(teams: teamsSelect[]) {
  const expectedTeams = getUpperFactorOf2(teams.length);
  const numberOfRounds = getNumberOfRounds(expectedTeams);
  const numberOfGames = expectedTeams - 1;

  // Change this type if changing what to return
  // e.g. team id or team object
  type nullOrTeam = null | string;
  const result: [nullOrTeam, nullOrTeam][] = new Array(numberOfGames)
    .fill(null)
    .map((_) => [null, null]);

  const startIdx = result.length - expectedTeams / 2;
  const gamesInLastRound = 2 ** (numberOfRounds - 1);
  for (let i = 0; i < teams.length; i++) {
    const team = teams[i];
    if (i < gamesInLastRound) {
      result[startIdx + i][0] = team.id;
    } else {
      result[startIdx + (i - gamesInLastRound)][1] = team.id;
    }
  }
  console.log(result);
  return result;
}
