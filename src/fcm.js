import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyD8bk57MfPgPmzRQU6fA2x89AZ4ldQlS80",
  authDomain: "backbook-370316.firebaseapp.com",
  projectId: "backbook-370316",
  storageBucket: "backbook-370316.appspot.com",
  messagingSenderId: "398150721140",
  appId: "1:398150721140:web:d93f0193496929a5037b21",
  measurementId: "G-VVEDB7NXXQ",
};

export const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);
