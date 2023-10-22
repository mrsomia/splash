"use client";

import { subscribeTotTeamNotificaitons } from "@/actions/teams";

type SubscribeButtonProps = {
  tournamentId: string;
  teamId: string;
};

export default function SubscribeButton({
  tournamentId,
  teamId,
}: SubscribeButtonProps) {
  const handleClick = async () => {
    const sw = await navigator.serviceWorker.ready;
    const push = await sw.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: process.env.NEXT_PUBLIC_VAPID_ID_KEY,
    });
    console.log(JSON.stringify(push));
    await subscribeTotTeamNotificaitons({
      teamId,
      tournamentId,
      sub: JSON.stringify(push),
    });
  };
  return (
    <button
      onClick={handleClick}
      className="my-4 py-2 px-4 bg-green-700 hover:bg-green-900 disabled:bg-slate-400 rounded-full w-40 self-center"
    >
      Get Notified
    </button>
  );
}
