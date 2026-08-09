import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
  type Firestore,
} from "firebase/firestore";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
  type Auth,
} from "firebase/auth";

// Firebase configuration using environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Check if Firebase is properly configured
const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.authDomain &&
  firebaseConfig.projectId &&
  firebaseConfig.appId
);

// Initialize Firebase only if configured
let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: Auth | null = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
  } catch (error) {
    console.error("Firebase initialization error:", error);
  }
}

// Export configuration status
export const firebaseStatus = {
  isConfigured: isFirebaseConfigured,
  hasApp: Boolean(app),
  hasAuth: Boolean(auth),
  hasDb: Boolean(db),
};

// Types for our data models
export interface Transaction {
  id: string;
  date: string;
  name: string;
  amount: number;
  category?: string;
  userId: string;
  createdAt: Timestamp;
}

export interface UserProfile {
  uid: string;
  email: string;
  monthlyIncome: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  category: string;
  frequency: string;
  userId: string;
  isActive: boolean;
  createdAt: Timestamp;
}

// Helper to check if Firebase is ready
const requireFirebase = () => {
  if (!isFirebaseConfigured || !auth || !db) {
    throw new Error("Firebase is not configured. Please add the required environment variables.");
  }
  return { auth, db };
};

// Auth functions
export const signUp = async (email: string, password: string) => {
  const { auth } = requireFirebase();
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

export const signIn = async (email: string, password: string) => {
  const { auth } = requireFirebase();
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

export const logOut = async () => {
  const { auth } = requireFirebase();
  await signOut(auth);
};

export const onAuthChange = (callback: (user: User | null) => void) => {
  if (!auth) {
    // If Firebase isn't configured, immediately call with null and return no-op
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
};

// User Profile functions
export const createUserProfile = async (uid: string, email: string, monthlyIncome: number = 0) => {
  const { db } = requireFirebase();
  const userRef = doc(db, "users", uid);
  const userData: UserProfile = {
    uid,
    email,
    monthlyIncome,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
  await setDoc(userRef, userData);
  return userData;
};

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  const { db } = requireFirebase();
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);
  if (userSnap.exists()) {
    return userSnap.data() as UserProfile;
  }
  return null;
};

export const updateUserProfile = async (uid: string, data: Partial<UserProfile>) => {
  const { db } = requireFirebase();
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, { ...data, updatedAt: Timestamp.now() });
};

// Transaction functions
export const addTransaction = async (transaction: Omit<Transaction, "id" | "createdAt">) => {
  const { db } = requireFirebase();
  const transactionsRef = collection(db, "transactions");
  const newDocRef = doc(transactionsRef);
  const transactionData: Transaction = {
    ...transaction,
    id: newDocRef.id,
    createdAt: Timestamp.now(),
  };
  await setDoc(newDocRef, transactionData);
  return transactionData;
};

export const getUserTransactions = async (userId: string): Promise<Transaction[]> => {
  const { db } = requireFirebase();
  const transactionsRef = collection(db, "transactions");
  const q = query(
    transactionsRef,
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => doc.data() as Transaction);
};

export const deleteTransaction = async (transactionId: string) => {
  const { db } = requireFirebase();
  const transactionRef = doc(db, "transactions", transactionId);
  await deleteDoc(transactionRef);
};

export const bulkAddTransactions = async (transactions: Omit<Transaction, "id" | "createdAt">[]) => {
  const addedTransactions: Transaction[] = [];
  for (const transaction of transactions) {
    const added = await addTransaction(transaction);
    addedTransactions.push(added);
  }
  return addedTransactions;
};

// Subscription functions
export const addSubscription = async (subscription: Omit<Subscription, "id" | "createdAt">) => {
  const { db } = requireFirebase();
  const subscriptionsRef = collection(db, "subscriptions");
  const newDocRef = doc(subscriptionsRef);
  const subscriptionData: Subscription = {
    ...subscription,
    id: newDocRef.id,
    createdAt: Timestamp.now(),
  };
  await setDoc(newDocRef, subscriptionData);
  return subscriptionData;
};

export const getUserSubscriptions = async (userId: string): Promise<Subscription[]> => {
  const { db } = requireFirebase();
  const subscriptionsRef = collection(db, "subscriptions");
  const q = query(
    subscriptionsRef,
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => doc.data() as Subscription);
};

export const updateSubscription = async (subscriptionId: string, data: Partial<Subscription>) => {
  const { db } = requireFirebase();
  const subscriptionRef = doc(db, "subscriptions", subscriptionId);
  await updateDoc(subscriptionRef, data);
};

export const deleteSubscription = async (subscriptionId: string) => {
  const { db } = requireFirebase();
  const subscriptionRef = doc(db, "subscriptions", subscriptionId);
  await deleteDoc(subscriptionRef);
};

export { app, db, auth };
