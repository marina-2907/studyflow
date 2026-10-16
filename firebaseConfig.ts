
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyC5rJ1rRUqoSktfeTYeuM78bd4s-rvcCWQ',
  authDomain: 'studyflow-ebadf.firebaseapp.com',
  projectId: 'studyflow-ebadf',
  storageBucket: 'studyflow-ebadf.firebasestorage.app',
  messagingSenderId: '89725270072',
  appId: '1:89725270072:web:cb5b2fc8fc65404ad80ecd',
  measurementId: 'G-FLSQQRX509',
};

// Evita inicializar o Firebase mais de uma vez
const app = getApps().length > 0
  ? getApp()
  : initializeApp(firebaseConfig);

// Autenticação: login e cadastro
export const auth = getAuth(app);

// Banco de dados: atividades dos estudantes
export const db = getFirestore(app);
