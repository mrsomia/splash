"use client";

import { useEffect } from "react";

export default function LoadWorker() {
  useEffect(() => {
    console.log("Load worker file");
    navigator.serviceWorker
      .register("/sw.js")
      .then((reg) => console.log("scope is: ", reg))
      .catch((err) => {
        console.error("Failed to register service worker");
        console.error(err);
      });
  }, []);
  return null;
}
