"use client";

import { setMatchWinner } from "@/actions/match";
import { getMatchDetails } from "@/db/match";
import { FormEvent, useState } from "react";

type WinnerFormProps = {
  match: Awaited<ReturnType<typeof getMatchDetails>>;
};

export default function WinnerForm({ match }: WinnerFormProps) {
  const [selectValue, setSelectValue] = useState("--");
  if (!match.teamAId) return null;
  if (!match.teamBId) return null;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectValue == "--") {
      console.error("Please set a winner");
      return;
    }
    console.log({ matchId: match.id, teamId: selectValue });
    setMatchWinner({
      matchId: match.id,
      teamId: selectValue,
      tournamentId: match.tournamentId,
    });
  };
  return (
    <div>
      <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
        <label htmlFor="winning-team">Winner</label>
        <select
          id="winning-team"
          name="winning-team"
          value={selectValue ?? "--"}
          onChange={(e) => setSelectValue(e.target.value)}
          className="text-black"
        >
          <option value="--">--</option>
          <option value={match.teamAId}>{match.teamA}</option>
          <option value={match.teamBId}>{match.teamB}</option>
        </select>

        <button className="py-2 px-4" disabled={selectValue == "--"}>
          Update Winner
        </button>
      </form>
    </div>
  );
}
