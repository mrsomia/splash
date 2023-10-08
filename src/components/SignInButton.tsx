"use client";
import { signIn } from "next-auth/react";

export default function SignInButton() {
  return (
    <button
      className="text-center px-4 lg:px-6 py-2 rounded-lg border-2 border-zinc-100 text-zinc-100 font-medium lg:font-semibold"
      onClick={() => signIn()}
    >
      Sign In
    </button>
  );
}

export function SignUpButton() {
  return (
    <button
      className="text-center px-4 lg:px-6 py-2 rounded-lg bg-zinc-200 text-black font-medium lg:font-semibold"
      onClick={() => signIn()}
    >
      Sign Up
    </button>
  );
}
