importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js"
);

const firebaseConfig = {
  apiKey: "AIzaSyD8bk57MfPgPmzRQU6fA2x89AZ4ldQlS80",
  projectId: "backbook-370316",
  messagingSenderId: "398150721140",
  appId: "1:398150721140:web:d93f0193496929a5037b21",
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image,
  };

  //   self.registration.showNotification(notificationTitle, notificationOptions);
});
