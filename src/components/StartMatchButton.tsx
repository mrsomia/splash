"use client";

import { toast } from "sonner";
import { startMatch } from "@/actions/match";
import { useState } from "react";
import { errorToString } from "@/lib/utils";

export default function StartMatchButton({
  matchId,
  tournamentId,
}: {
  matchId: string;
  tournamentId: string;
}) {
  const [pending, setPending] = useState(false);
  const handleClick = async () => {
    setPending(true);
    const err = await startMatch({ matchId, tournamentId });
    setPending(false);
    if (err) {
      console.error(err);
      toast.error(errorToString(err));
    }
  };
  return (
    <button
      className="my-4 py-2 px-4 bg-green-700 hover:bg-green-900 disabled:bg-slate-400 rounded-full w-3/4 self-center"
      onClick={handleClick}
      disabled={pending}
    >
      {pending ? "Starting game..." : "Start Match"}
    </button>
  );
}
