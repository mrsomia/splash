import SignInButton from "@/components/SignInButton";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Link from "next/link";

export default async function Home() {
  const session = await getServerSession(authOptions);
  return (
    <main className="flex min-h-screen flex-col items-center gap-12 p-24">
      <h1 className="text-xl">Splash tournament</h1>
      <div>
        <div>The tool for your bar tournament</div>
      </div>
      {session ? (
        <Link href="/dashboard">Go to dashboard</Link>
      ) : (
        <SignInButton />
      )}
    </main>
  );
}
