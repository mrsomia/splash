"use client";

import { subscribeTotTeamNotificaitons } from "@/actions/teams";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type SubscribeButtonProps = {
  tournamentId: string;
  teamId: string;
};

export default function SubscribeButton({
  tournamentId,
  teamId,
}: SubscribeButtonProps) {
  const [isPushNotificationSupported, setIsPushNotificationSupported] =
    useState(true);
  const [notificationPermission, setNotificationPermission] = useState<
    typeof Notification.permission | null
  >(null);
  useEffect(() => {
    if (window) {
      setIsPushNotificationSupported(
        "serviceWorker" in navigator && "PushManager" in window,
      );
    }
  }, []);

  useEffect(() => {
    if (window && Notification) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  if (!isPushNotificationSupported) {
    return (
      <p className="text-center self-center py-2">
        Push Notifications are not supported on this device currently
      </p>
    );
  }

  if (notificationPermission === "denied") {
    return (
      <p className="text-center self-center py-2">
        You have disabled notifications
      </p>
    );
  }

  const handleClick = async () => {
    const sw = await navigator.serviceWorker.ready;
    const push = await sw.pushManager
      .subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_ID_KEY,
      })
      .catch((err) => {
        console.error(err);
        toast.error("Unable to configure push notifications");
        return;
      });
    console.log(JSON.stringify(push));
    const error = await subscribeTotTeamNotificaitons({
      teamId,
      tournamentId,
      sub: JSON.stringify(push),
    });
    if (error) {
      toast.error("Error subscribing to notifications");
      return;
    }
    toast.success("Subscribed, you shoud be notified when your team play");
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

// export function RequestPermissionButton() {
//   const router = useRouter();
//   const getNotificationPersmission = async () => {
//     if (
//       Notification.permission === "granted" ||
//       Notification.permission === "denied"
//     ) {
//       console.log("Notification permission: ", Notification.permission);
//       router.refresh();
//       return;
//     }
//     try {
//       await Notification.requestPermission();
//       router.refresh();
//     } catch (e) {
//       console.error(e);
//       toast("Unable to have permisson granted");
//     } finally {
//       router.refresh();
//     }
//   };
//   return (
//     <button
//       onClick={getNotificationPersmission}
//       className="my-4 py-2 px-4 bg-green-700 hover:bg-green-900 disabled:bg-slate-400 rounded-full w-60 self-center"
//     >
//       Grant permission to notify
//     </button>
//   );
// }
