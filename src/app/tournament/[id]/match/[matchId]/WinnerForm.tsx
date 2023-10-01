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
    if (!match.id) {
      console.error("No match Id found");
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
      <form onSubmit={handleSubmit}>
        <label>Winner</label>
        <select
          value={selectValue ?? "--"}
          onChange={(e) => setSelectValue(e.target.value)}
          className="text-black"
        >
          <option value="--">--</option>
          <option value={match.teamAId}>{match.teamA}</option>
          <option value={match.teamBId}>{match.teamB}</option>
        </select>

        <button disabled={selectValue == "--"}>Set Winner</button>
      </form>
    </div>
  );
}
