"use client";

import { useState, type FormEvent } from "react";
import { addTeamToTournament } from "@/actions/teams";

export default function NewTeamForm({
  tournamentId,
}: {
  tournamentId: string;
}) {
  const [name, setName] = useState("");
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addTeamToTournament({ tournamentId, teamName: name });
  };
  return (
    <form onSubmit={(e) => handleSubmit(e)}>
      <div className="flex flex-col gap-4">
        <label htmlFor="teamName">Name</label>
        <input
          type="text"
          value={name}
          className="text-black"
          onChange={(e) => setName(e.target.value)}
        />
        <button>Submit</button>
      </div>
    </form>
  );
}
