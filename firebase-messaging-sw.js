/* CEG Field Duty – background notifications (Firebase Cloud Messaging) */
importScripts("config.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");
var cfg = self.CFD_FIREBASE || {};
if (cfg.apiKey && cfg.projectId && cfg.messagingSenderId && cfg.appId) {
  firebase.initializeApp(cfg);
  firebase.messaging(); // notifications sent with a "notification" block are shown automatically
}
// Tapping a notification opens the app on the right page (handled by Firebase using the link sent by the server).
