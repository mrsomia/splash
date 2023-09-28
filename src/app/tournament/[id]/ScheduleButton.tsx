"use client";

import { scheduleTournament } from "@/actions/tournament";

type ScheduleButtonProps = {
  id: string;
};

export default function ScheduleButton({ id }: ScheduleButtonProps) {
  const handleClick = () => {
    scheduleTournament(id);
  };
  return <button onClick={handleClick}>Start tournament</button>;
}
