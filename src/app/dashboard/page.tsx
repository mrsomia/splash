import Link from "next/link";

export default function Dasboard() {
  return (
    <main className="flex min-h-screen flex-col items-center gap-12 p-24">
      <h1 className="text-xl">Dashboard</h1>
      <div className="">
        <Link href="/tournament/new">start a new tournament</Link>
        <p>previous tournaments</p>
      </div>
    </main>
  );
}
