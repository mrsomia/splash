"use client";

import { toast } from "sonner";
import { scheduleTournament } from "@/actions/tournament";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { errorToString } from "@/lib/utils";

type ScheduleButtonProps = {
  id: string;
  disabled: boolean;
};

export default function ScheduleButton({ id, disabled }: ScheduleButtonProps) {
  const [pending, setPending] = useState(false);
  const router = useRouter();
  const handleClick = async () => {
    setPending(true);
    const err = await scheduleTournament(id);
    setPending(false);
    if (err) {
      console.error(err);
      toast.error(errorToString(err));
      return;
    }
    router.push(`/tournament/${id}/schedule`);
  };
  return (
    <button disabled={disabled || pending} onClick={handleClick}>
      Schedule Games
    </button>
  );
}
