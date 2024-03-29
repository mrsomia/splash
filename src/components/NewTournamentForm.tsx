"use client";

import { useState, type FormEvent } from "react";
import { format } from "date-fns";
import { createTournament } from "@/actions/tournament";
import { getEpochFromDateAndTime } from "@/lib/dates";
import { errorToString } from "@/lib/utils";
import { toast } from "sonner";

export default function NewTournamentForm() {
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [startTime, setStartTime] = useState(format(new Date(), "HH:mm"));

  const epochStart = getEpochFromDateAndTime(startDate, startTime);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    // TODO: Validation
    e.preventDefault();
    const err = await createTournament(name, epochStart);
    if (err) {
      console.error(err);
      toast.error(errorToString(err));
    }
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={(e) => handleSubmit(e)}>
      <div className="flex flex-col gap-2">
        <label htmlFor="tournamentName">Name</label>
        <input
          type="text"
          name="tournamentName"
          id="tournamentName"
          className="text-black p-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <label htmlFor="startDate">Start</label>
        <div className="flex w-100 gap-4">
          <input
            type="date"
            name="startDate"
            id="startDate"
            className="text-black p-2 flex-grow"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
          <input
            type="time"
            name="startTime"
            id="startTime"
            className="text-black p-2"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </div>
      </div>
      <div className="w-100 flex justify-center">
        <button className="m-4 bg-orange-500 rounded-lg py-2 px-4">
          Submit
        </button>
      </div>
    </form>
  );
}
