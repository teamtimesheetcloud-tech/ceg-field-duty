/* CEG Field Duty – background notifications (v2)
   Shows phone notifications even when the app is closed.
   Firebase delivers the message; this file displays it and opens the right page on tap. */
var SW_VERSION = "cfd-sw-2";

self.addEventListener("install", function () { self.skipWaiting(); });
self.addEventListener("activate", function (e) { e.waitUntil(self.clients.claim()); });

function appBase() { return self.registration.scope; } // e.g. https://teamtimesheetcloud-tech.github.io/ceg-field-duty/

self.addEventListener("push", function (event) {
  var p = {};
  try { p = event.data ? event.data.json() : {}; } catch (e) { p = { notification: { body: event.data ? event.data.text() : "" } }; }
  var n = p.notification || {};
  var d = p.data || {};
  var title = n.title || d.title || "CEG Field Duty";
  var body = n.body || d.body || "You have a new update.";
  var link = d.link || "";
  var opts = {
    body: body,
    icon: appBase() + "icon-192.png",
    badge: appBase() + "icon-192.png",
    tag: "cfd-" + (link || "general") + "-" + Date.now(),
    data: { link: link },
    vibrate: [200, 100, 200],
    requireInteraction: false
  };
  event.waitUntil(
    self.registration.showNotification(title, opts).then(function () {
      // tell any open app window to refresh its data
      return self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(function (list) {
        list.forEach(function (c) { c.postMessage({ type: "cfd-push", link: link }); });
      });
    })
  );
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  var link = (event.notification.data && event.notification.data.link) || "";
  var url = appBase() + (link ? "#" + encodeURIComponent(link) : "");
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(function (list) {
      for (var i = 0; i < list.length; i++) {
        var c = list[i];
        if (c.url.indexOf(appBase()) === 0 && "focus" in c) {
          c.postMessage({ type: "cfd-open", link: link });
          return c.focus();
        }
      }
      return self.clients.openWindow(url);
    })
  );
});
