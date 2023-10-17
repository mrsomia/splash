"use client";

import { toast } from "sonner";
import { setMatchWinner } from "@/actions/match";
import { getMatchDetails } from "@/db/match";
import { FormEvent, useState } from "react";
import { errorToString } from "@/lib/utils";

type WinnerFormProps = {
  match: Awaited<ReturnType<typeof getMatchDetails>>;
};

export default function WinnerForm({ match }: WinnerFormProps) {
  const [pending, setPending] = useState(false);
  const [selectValue, setSelectValue] = useState(match.winner ?? "--");
  if (!match.teamAId) return null;
  if (!match.teamBId) return null;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectValue == "--") {
      console.error("Please set a winner");
      return;
    }
    setPending(true);
    const err = await setMatchWinner({
      matchId: match.id,
      teamId: selectValue,
      tournamentId: match.tournamentId,
    });
    setPending(false);
    if (err) {
      console.error(err);
      toast.error(errorToString(err));
      return;
    }
    toast.success(`Winner set to ${selectValue}`);
  };
  return (
    <div className="w-52">
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

        <button
          className="my-4 py-2 px-4 bg-green-700 hover:bg-green-900 disabled:bg-slate-400 rounded-full w-3/4 self-center"
          disabled={pending || selectValue == "--"}
        >
          {pending ? "Updating Winner..." : "Update Winner"}
        </button>
      </form>
    </div>
  );
}
