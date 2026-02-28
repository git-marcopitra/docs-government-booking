import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import "dotenv/config";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const authInstance = getAuth(app);
const db = getFirestore(app);

const EMAIL = "admin@gov.ao";
const PASSWORD = "AdminGov";

async function createAdmin() {
  console.log(`A configurar administrador: ${EMAIL}...`);

  let uid: string;

  // Try sign in first (user may already exist from previous attempt)
  try {
    const credential = await signInWithEmailAndPassword(authInstance, EMAIL, PASSWORD);
    uid = credential.user.uid;
    console.log("Utilizador Auth já existe, a iniciar sessão...");
  } catch {
    // User doesn't exist, create it
    const credential = await createUserWithEmailAndPassword(authInstance, EMAIL, PASSWORD);
    uid = credential.user.uid;
    console.log("Utilizador Auth criado.");
  }

  // Write Firestore profile
  await setDoc(doc(db, "users", uid), {
    uid,
    bilheteIdentidade: "",
    nomeCompleto: "Administrador",
    role: "admin",
    email: EMAIL,
  });

  console.log(`Administrador criado com sucesso! UID: ${uid}`);
  process.exit(0);
}

createAdmin().catch((err) => {
  console.error("Erro ao criar administrador:", err.message);
  process.exit(1);
});
