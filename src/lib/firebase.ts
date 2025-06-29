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

// Se a API KEY não estiver definida, evitamos iniciar o Firebase para não quebrar a aplicação em desenvolvimento
const shouldInitFirebase = Boolean(firebaseConfig.apiKey);

let app;

if (shouldInitFirebase) {
  app = initializeApp(firebaseConfig);
  console.info('[Firebase] Inicializado com sucesso');
} else {
  console.warn('[Firebase] Variáveis de ambiente não configuradas. Firebase não será inicializado.');
}

// Exporta stubs seguros quando Firebase não está inicializado
export const db = shouldInitFirebase ? getFirestore(app!) : (undefined as unknown as ReturnType<typeof getFirestore>);
export const auth = shouldInitFirebase ? getAuth(app!) : (undefined as unknown as ReturnType<typeof getAuth>);

