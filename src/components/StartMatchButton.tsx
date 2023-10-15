"use client";

import { toast } from "sonner";
import { startMatch } from "@/actions/match";

export default function StartMatchButton({
  matchId,
  tournamentId,
}: {
  matchId: string;
  tournamentId: string;
}) {
  const handleClick = () => {
    startMatch({ matchId, tournamentId });
    toast.success("Game started");
  };
  return (
    <button
      className="my-4 py-2 px-4 bg-green-700 hover:bg-green-900 disabled:bg-slate-400 rounded-full w-3/4 self-center"
      onClick={handleClick}
    >
      Start Match
    </button>
  );
}
