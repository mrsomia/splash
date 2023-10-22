import webPush from "web-push";

const vapidKeys = {
  publicKey: process.env.NEXT_PUBLIC_VAPID_ID_KEY,
  privateKey: process.env.PRIVATE_VAPID_ID_KEY,
};

webPush.setVapidDetails(
  `mailto:sachinsomia@gmail.com`,
  vapidKeys.publicKey,
  vapidKeys.privateKey,
);

export { webPush as push };
