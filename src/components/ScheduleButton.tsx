"use client";

import { scheduleTournament } from "@/actions/tournament";
import { useRouter } from "next/navigation";

type ScheduleButtonProps = {
  id: string;
  disabled: boolean;
};

export default function ScheduleButton({ id, disabled }: ScheduleButtonProps) {
  const router = useRouter();
  const handleClick = () => {
    scheduleTournament(id);
    router.push(`/tournament/${id}/schedule`);
  };
  return (
    <button disabled={disabled} onClick={handleClick}>
      Schedule Games
    </button>
  );
}
