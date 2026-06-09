import { initializeApp } from "@firebase/app";
import { getFirestore } from "@firebase/firestore";

const firebaseConfig = {
  apiKey:
    import.meta.env.VITE_FIREBASE_API_KEY ||
    "AIzaSyAUaLBOwwe4ahjCcj_gRU8au_kStura9CU",
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ||
    "selah-girls-society.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "selah-girls-society",
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ||
    "selah-girls-society.firebasestorage.app",
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "266208376670",
  appId:
    import.meta.env.VITE_FIREBASE_APP_ID ||
    "1:266208376670:web:61c890f4a8f5af9e3141cf",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
