import { getMatchesForTournamentByRounds } from "@/db/tournament";
import ScheduleLayout from "@/components/ScheduleLayout";
import { Suspense } from "react";
import Spinner from "@/components/Spinner";

type PageProps = {
  params: {
    id: string;
  };
};

export default async function SchedulePage({ params }: PageProps) {
  const rounds = await getMatchesForTournamentByRounds(params.id);

  return (
    <Suspense fallback={<Spinner />}>
      {rounds.length > 0 ? (
        <ScheduleLayout rounds={rounds} />
      ) : (
        <div className="flex flex-col items-center gap-4 py-8">
          <p className="px-2 text-center w-60 md:w-96">
            No Games Scheduled yet
          </p>
        </div>
      )}
    </Suspense>
  );
}
