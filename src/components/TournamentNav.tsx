"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";
import ScheduleButton from "./ScheduleButton";

type TournamentNavProps = {
  id: string;
  isAdmin: boolean;
  started: boolean;
};

export default function TournamentNav({
  id,
  isAdmin,
  started,
}: TournamentNavProps) {
  const path = usePathname();
  const pathArray = path.split("/");

  return (
    <nav className="py-4 w-full overflow-x-scroll">
      <ul className="flex items-end gap-3 md:gap-4 w-full border-b text-zinc-100">
        <li
          className={cn(
            "font-medium md:font-semibold",
            path === `/tournament/${id}` ? "border-b-2 text-white" : null,
          )}
        >
          <Link href={`/tournament/${id}`}>Overview</Link>
        </li>
        <li
          className={cn(
            "font-medium md:font-semibold",
            pathArray.at(-1) === "schedule" ? "border-b-2 text-white" : null,
          )}
        >
          <Link
            href={`/tournament/${id}/schedule`}
            className={cn(!started && "cursor-not-allowed opacity-70")}
          >
            Schedule
          </Link>
        </li>
        {isAdmin ? (
          <>
            <li
              className={cn(
                "font-medium md:font-semibold",
                pathArray.at(-1) === "signup" ? "border-b-2 text-white" : null,
              )}
            >
              <Link
                href={started ? `${path}` : `/tournament/${id}/signup`}
                className={cn(started && "cursor-not-allowed opacity-70")}
              >
                Add Teams
              </Link>
            </li>
            <li
              className={cn(
                "font-medium md:font-semibold",
                started && "cursor-not-allowed opacity-70",
              )}
            >
              <ScheduleButton id={id} disabled={started} />
            </li>
          </>
        ) : null}
      </ul>
    </nav>
  );
}
