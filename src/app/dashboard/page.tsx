import { getTournamentsFromEmail } from "@/db/tournament";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { Suspense } from "react";
import { Plus } from "lucide-react";

export default async function Dasboard() {
  const session = await getServerSession(authOptions);
  let previousTournaments;
  if (session?.user?.email) {
    const email = session.user.email;
    previousTournaments = await getTournamentsFromEmail(email, 3);
  }
  return (
    <main className="flex min-h-screen flex-col items-center gap-12 p-24">
      <div className="">
        <div className="flex w-100 justify-end gap-8">
          <h1 className="text-xl">Previous Tournaments</h1>
          <Link href="/tournament/new">
            <button className="rounded-md bg-orange-600 p-2">
              <Plus />
            </button>
          </Link>
        </div>
        <Suspense>
          {previousTournaments && previousTournaments.length ? (
            <>
              {previousTournaments.map((t) => (
                <div key={t.id} className="flex py-8">
                  <Link href={`/tournament/${t.id}`}>
                    <div className="flex flex-col gap-2">
                      <p className="capitalize text-lg py-2">{t.name}</p>
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
