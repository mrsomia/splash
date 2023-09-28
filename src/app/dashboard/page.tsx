import { getTournamentsFromEmail } from "@/db/tournament";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { Suspense } from "react";

export default async function Dasboard() {
  const session = await getServerSession(authOptions);
  let previousTournaments;
  if (session?.user?.email) {
    const email = session.user.email;
    previousTournaments = await getTournamentsFromEmail(email, 3);
  }
  return (
    <main className="flex min-h-screen flex-col items-center gap-12 p-24">
      <h1 className="text-xl">Dashboard</h1>
      <div className="">
        <Link href="/tournament/new" className="py-4">
          start a new tournament
        </Link>
        <Suspense>
          {previousTournaments && previousTournaments.length ? (
            <>
              <h2 className="py-4">Previous Tournaments</h2>
              {previousTournaments.map((t) => (
                <div key={t.id} className="flex p-2">
                  <Link href={`/tournament/${t.id}`}>
                    <div className="flex flex-col gap-2">
                      <h4>{t.name}</h4>
                      <span>{`starts at ${t.startTime?.toLocaleTimeString()} on ${t.startTime?.toLocaleDateString()}`}</span>
                    </div>
                  </Link>
                </div>
              ))}
            </>
          ) : null}
        </Suspense>
      </div>
    </main>
  );
}
