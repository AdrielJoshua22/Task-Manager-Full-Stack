importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBxWc4cMrpbZxToRttQuX7b43SEvHb_feA",
  authDomain: "task-manager-full-stack.firebaseapp.com",
  projectId: "task-manager-full-stack",
  storageBucket: "task-manager-full-stack.firebasestorage.app",
  messagingSenderId: "964222991372",
  appId: "1:964222991372:web:aa8f1752482982b7ae8229"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo192.png'
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});