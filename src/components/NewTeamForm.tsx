"use client";

import { toast } from "sonner";
import { useState, type FormEvent } from "react";
import { addTeamToTournament } from "@/actions/teams";
import { deleteSchedule } from "@/actions/match";
import { cn } from "@/lib/utils";

export default function NewTeamForm({
  tournamentId,
  teamNumber,
}: {
  tournamentId: string;
  teamNumber: number;
}) {
  const [pending, setPending] = useState(false);
  const [name, setName] = useState(teamNumber.toString() ?? "");
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPending(true);
    const err = await addTeamToTournament({
      tournamentId,
      teamName: name,
    }).catch((e) => {
      console.error(e);
      toast.error("Error adding team to tournament");
    });
    setPending(false);
    if (err) {
      toast.error(err);
      return;
    }
    toast.success("Team added");
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
          disabled={pending}
        >
          {pending ? "Adding Team" : "Submit"}
        </button>
      </div>
    </form>
  );
}

type DeleteScheduleFormProps = {
  tournamentId: string;
};

export function DeleteScheduleForm({ tournamentId }: DeleteScheduleFormProps) {
  const handleClick = () => {
    deleteSchedule({ tournamentId });
  };
  return (
    <div className="flex flex-col gap-4">
      <p className="px-2 text-center w-60 md:w-96">
        Games have been scheduled. To add a new team you will need to delete the
        schedule
      </p>
      <button
        className={cn(
          "my-4 py-2 px-4 bg-red-700 hover:bg-red-900 disabled:bg-slate-400",
          "rounded-full w-60 self-center",
        )}
        onClick={handleClick}
        // disabled={selectValue == "--"}
      >
        Delete Schedule
      </button>
    </div>
  );
}
