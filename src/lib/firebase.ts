import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// IMPORTANTE: Suas credenciais do Firebase devem ser armazenadas em um arquivo .env na raiz do projeto
// Exemplo de .env:
// VITE_FIREBASE_API_KEY="..."
// VITE_FIREBASE_AUTH_DOMAIN="..."
// VITE_FIREBASE_PROJECT_ID="..."
// VITE_FIREBASE_STORAGE_BUCKET="..."
// VITE_FIREBASE_MESSAGING_SENDER_ID="..."
// VITE_FIREBASE_APP_ID="..."

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Exporta os serviços do Firebase que serão utilizados
export const db = getFirestore(app);
export const auth = getAuth(app);
