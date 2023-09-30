import {
  createRandomeScheduleForTeams,
  getNumberOfRounds,
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

describe("Gets the right factor of 2", () => {
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
    test(`${len[0]}`, () => {
      expect(getUpperFactorOf2(len[0])).toBe(len[1]);
    });
  }
});

describe("Gets the right number of rounds", () => {
  const lens = [
    [2, 1],
    [4, 2],
    [8, 3],
    [16, 4],
    [32, 5],
  ];
  for (const len of lens) {
    test(`${len[0]}`, () => {
      expect(getNumberOfRounds(len[0])).toBe(len[1]);
    });
  }
});

describe("Generates Schedule", () => {
  test("6 teams", () => {
    // TODO: test schedule is correct
    const tID = faker.string.nanoid();
    const teams = createListofTeams({ id: tID, amount: 9 });
    const schedule = createRandomeScheduleForTeams(teams);
    console.log(schedule);
  });
});
