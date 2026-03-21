importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBxWc4cMrpbZxToRttQux7b43SEvHb_feA",
  authDomain: "task-manager-full-stack.firebaseapp.com",
  projectId: "task-manager-full-stack",
  storageBucket: "task-manager-full-stack.firebasestorage.app",
  messagingSenderId: "964222991372",
  appId: "1:964222991372:web:aa8f1752482982b7ae8229"
});

const messaging = firebase.messaging();

self.addEventListener('push', (event) => {
    const data = event.data ? event.data.json() : {};

    const title = data.notification?.title || data.data?.title || "Task Manager";
    const options = {
        body: data.notification?.body || data.data?.body || "Nueva actualización de tarea",
        icon: '/logo192.png',
        badge: '/logo192.png',
        tag: 'task-notification',
        renotify: true
    };

    event.waitUntil(self.registration.showNotification(title, options));
});