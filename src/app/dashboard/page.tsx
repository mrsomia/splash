import {
  getOtherRecentTournaments,
  getTournamentsFromEmail,
} from "@/db/tournament";
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
  const otherTournaments = await getOtherRecentTournaments();
  console.log({ otherTournaments });
  return (
    <main className="w-full py-6">
      <div className="w-100 md:max-w-4xl md:mx-auto mx-8 px-4 md:px-6">
        <div className="w-100 flex justify-end md:justify-between py-2">
          <h1 className="text-xl font-bold ml-4 mr-auto md:inline-block hidden pb-4">
            Tournaments
          </h1>
          <Link className="inline-block px-6" href="/tournament/new">
            <button className="rounded-md bg-orange-600 px-2 py-1">New</button>
          </Link>
        </div>
        <Suspense>
          <h2 className="text-lg md:text-xl font-semibold md:font-bold">
            Your Tournaments
          </h2>
          {previousTournaments && previousTournaments.length ? (
            <div className="grid grid-cols-1 md:grid-cols-3 my-10 mx-3">
              {previousTournaments.map((t) => (
                <Link key={t.id} href={`/tournament/${t.id}`}>
                  <div className="border border-grey-600 rounded-lg px-2 py-4 hover:bg-slate-800">
                    <div className="flex justify-between mx-6">
                      <p className="capitalize text-lg py-2 font-medium">
                        {t.name}
                      </p>
                      <div className="flex flex-col justify-center">
                        <span className="block">{`${t.startTime?.toLocaleDateString()} `}</span>
                        <span className="block">
                          {t.startTime?.toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="px-2 py-6 md:py-12 mx-auto text-center">
              <p className="py-4 text-lg">
                No tournaments where you are the admin
              </p>
              <p className="text-zinc-200">
                Create a new tournament by clicking New in to top right corner
              </p>
            </div>
          )}
          <h2 className="text-lg md:text-xl font-semibold md:font-bold">
            Recent Tournaments
          </h2>
          {otherTournaments.length ? (
            <div className="grid grid-cols-1 md:grid-cols-3 my-10 mx-3">
              {otherTournaments.map((t) => (
                <Link key={t.id} href={`/tournament/${t.id}`}>
                  <div className="border border-grey-600 rounded-lg px-2 py-4 hover:bg-slate-800">
                    <div className="flex justify-between mx-6">
                      <p className="capitalize text-lg py-2 font-medium">
                        {t.name}
                      </p>
                      <div className="flex flex-col justify-center">
                        <span className="block">{`${t.startTime?.toLocaleDateString()} `}</span>
                        <span className="block">
                          {t.startTime?.toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="px-2 py-6 md:py-12 mx-auto text-center">
              <p className="text-zinc-200">No recent tournaments</p>
            </div>
          )}
        </Suspense>
      </div>
    </main>
  );
}
