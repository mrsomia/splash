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
      <ScheduleLayout rounds={rounds} />
    </Suspense>
  );
}
