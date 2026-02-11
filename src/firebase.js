import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { getDatabase, ref, set, onValue, get } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js';

const firebaseConfig = {
  apiKey: "AIzaSyDpSmmNGdB4HG08eyzJvNIwo4lVQM5_8mc",
  authDomain: "calendario-isla.firebaseapp.com",
  databaseURL: "https://calendario-isla-default-rtdb.firebaseio.com",
  projectId: "calendario-isla",
  storageBucket: "calendario-isla.firebasestorage.app",
  messagingSenderId: "972723637133",
  appId: "1:972723637133:web:de1144c95bdf747775cbc4",
  measurementId: "G-6MBBDHMLYV"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export async function saveOverrideRemote(dateString, personId) {
  await set(ref(db, 'overrides/' + dateString), personId);
}

export async function getOverridesRemote() {
  const snapshot = await get(ref(db, 'overrides'));
  return snapshot.exists() ? snapshot.val() : {};
}

export function subscribeOverrides(callback) {
  onValue(ref(db, 'overrides'), () => {
    callback();
  });
}
