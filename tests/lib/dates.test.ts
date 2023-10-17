import { getEpochFromDateAndTime } from "../../lib/dates";
import { expect, test, describe } from "vitest";

describe("Dates", () => {
  test("parse strings correctly", () => {
    // This won't work after DST
    expect(getEpochFromDateAndTime("2023-09-20", "20:00")).toBe(1695236400000);
  });
});
