"use client";

import { useState, type FormEvent } from "react";
import { addTeamToTournament } from "@/actions/teams";

export default function NewTeamForm({
  tournamentId,
  teamNumber,
}: {
  tournamentId: string;
  teamNumber: number;
}) {
  const [name, setName] = useState(teamNumber.toString() ?? "");
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addTeamToTournament({ tournamentId, teamName: name });
    setName((name) => (Number(name) + 1).toString());
  };
  return (
    <form onSubmit={(e) => handleSubmit(e)}>
      <div className="flex flex-col gap-4">
        <label htmlFor="teamName" className="font-medium">
          Name
        </label>
        <input
          type="text"
          value={name}
          className="text-black p-2"
          onChange={(e) => setName(e.target.value)}
        />
        <button
          className="my-4 py-2 px-4 bg-green-700 hover:bg-green-900 disabled:bg-slate-400 rounded-full w-3/4 self-center"
          // disabled={selectValue == "--"}
        >
          Submit
        </button>
      </div>
    </form>
  );
}
