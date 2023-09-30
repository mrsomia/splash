import {
  createScheduleForShuffledTeams,
  getNumberOfRounds,
  getStartIndex,
  getUpperFactorOf2,
} from "../../lib/tournament";
import { expect, test, describe } from "vitest";
import { type teamsSelect } from "../../db/schema";
import { faker } from "@faker-js/faker";

function createMockTeamForTournament(tournamentId: string): teamsSelect {
  return {
    id: faker.string.nanoid(),
    name: faker.word.words(2),
    createdAt: faker.date.recent(),
    eliminated: false,
    tournamentId,
  };
}

function createListofTeams({ id, amount }: { id: string; amount: number }) {
  const a = [];
  for (let i = 0; i < amount; i++) {
    const team = createMockTeamForTournament(id);
    a.push(team);
  }
  return a;
}

describe("Util functions", () => {
  test("Gets the right factor of 2", () => {
    const lens = [
      [1, 2],
      [2, 2],
      [3, 4],
      [4, 4],
      [6, 8],
      [8, 8],
      [12, 16],
      [16, 16],
      [24, 32],
      [32, 32],
      [33, 64],
      [64, 64],
      [65, 128],
    ];
    for (const len of lens) {
      expect(getUpperFactorOf2(len[0])).toBe(len[1]);
    }
  });

  test("Gets the right number of rounds", () => {
    const lens = [
      [2, 1],
      [4, 2],
      [8, 3],
      [16, 4],
      [32, 5],
    ];
    for (const len of lens) {
      expect(getNumberOfRounds(len[0])).toBe(len[1]);
    }
  });

  test("Gets the correct start index for the last round", () => {
    const lens = [
      [2, 0],
      [4, 1],
      [8, 3],
      [16, 7],
      [32, 15],
    ];
    for (const len of lens) {
      expect(getStartIndex(len[0])).toBe(len[1]);
    }
  });
});

describe("Generates Schedule", () => {
  const amounts = [6, 8, 9, 15, 23, 28, 33, 40, 42];
  for (const amount of amounts) {
    test(`${amount} teams`, () => {
      const teams = new Array(amount)
        .fill(null)
        .map((_) => faker.string.nanoid());
      const schedule = createScheduleForShuffledTeams(teams);
      const expectedTeams = getUpperFactorOf2(amount);
      const startIdx = getStartIndex(expectedTeams);

      const emptyRounds = schedule.slice(0, startIdx);
      for (const match of emptyRounds) {
        expect(match).toStrictEqual([null, null]);
      }
      const lastRound = schedule.slice(startIdx);
      const foundTeamOrder: any[] = [];
      lastRound.forEach((x) => {
        foundTeamOrder.push(x[0]);
      });
      lastRound.forEach((x) => {
        foundTeamOrder.push(x[1]);
      });
      const nulls = new Array(expectedTeams - amount).fill(null);
      expect(foundTeamOrder).toEqual(teams.concat(nulls));
    });
  }
});
