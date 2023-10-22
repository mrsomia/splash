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

  console.log(data)
  const data = event.data?.json() ?? {};
  const title = data.title || "Your game is starting";
  const message =
    data.message || "You are up next to play, head to the tables";
  // const icon = "images/new-notification.png";

  const notification = new Notification(title, {
    body: message,
    // tag: "simple-push-demo-notification",
    // icon,
  });

  // notification.addEventListener("click", () => {
  //   clients.openWindow(
  //     "https://example.blog.com/2015/03/04/something-new.html",
  //   );
  // });
});
