import { getTournamentFromId } from "@/db/tournament";
import { Suspense } from "react";
import Spinner from "@/components/Spinner";
import Link from "next/link";

type PageProps = {
  params: {
    id: string;
  };
};

export default async function TournamentPage({ params }: PageProps) {
  console.log(params);
  const tournament = await getTournamentFromId(params.id);
  console.log(tournament);
  const start = new Date(tournament.startTime);
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-8">
      <Link href={`/tournament/${tournament.id}/signup`}>signup</Link>
      <Suspense fallback={<Spinner />}>
        <h1>{tournament.name}</h1>
        <span>{`starts at ${start.toLocaleTimeString()} on ${start.toLocaleDateString()}`}</span>
      </Suspense>
    </main>
  );
}
