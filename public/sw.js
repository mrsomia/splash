self.addEventListener('install', () => {
  self.skipWaiting()
  console.log('service worker installed')
});

self.addEventListener('activate', () => {
  console.log('service worker activated')
});

self.addEventListener("push", (event) => {
  if (!(self.Notification && self.Notification.permission === "granted")) {
    return;
  }
  const data = event.data?.json()
  const title = data.title || "A game is starting"
  const message = data.message || "A game is starting for a team you asked to be notified about";
  const link = data.link
  const icon = data.icon

  self.registration.showNotification(title, {
    body: message,
    data: link,
    vibrate: [500, 400, 500, 400, 500],
    icon, // string to icon url
  })

});

self.addEventListener("notificationclick", (event) => {
  console.log("On notification click: ", event.notification.tag);
  console.log(event.notification)
  event.notification.close();

  // This looks to see if the current is already open and
  // focuses if it is
  event.waitUntil(
    clients
      .matchAll({
        type: "window",
      })
      .then((clientList) => {
        for (const client of clientList) {
          if (event.notification.data) {
            if (client.url === event.notification.data && "focus" in client) {
              return client.focus()
            }
          }
          // Focus on already open tab, delete line to open link in next block
          if (client.url && "focus" in client) return client.focus();
        }
        if (event.notification.data) {
          return clients.openWindow(event.notification.data)
        }
        if (clients.openWindow) return clients.openWindow("/");
      }),
  );
});
