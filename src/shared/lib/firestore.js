import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db, auth } from '@/shared/lib/firebase';

// In-memory / localStorage fallback when Firebase isn't configured with real auth keys
const LOCAL_STORAGE_KEY_PREFIX = 'meridian_local_';

function getLocalStore(collectionName) {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY_PREFIX + collectionName);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function setLocalStore(collectionName, items) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY_PREFIX + collectionName, JSON.stringify(items));
  } catch {}
}

export async function listCollection(moduleName, collectionName) {
  const user = auth.currentUser;
  if (user?.uid) {
    try {
      const colRef = collection(db, `${moduleName}/${user.uid}/${collectionName}`);
      const snapshot = await getDocs(colRef);
      return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
    } catch (e) {
      console.warn(`Firestore read failed for ${moduleName}/${collectionName}, falling back to offline cache`, e);
    }
  }

  return getLocalStore(`${moduleName}_${collectionName}`);
}

export async function getDocById(moduleName, collectionName, id) {
  const user = auth.currentUser;
  if (user?.uid) {
    try {
      const docRef = doc(db, `${moduleName}/${user.uid}/${collectionName}`, id);
      const snap = await getDoc(docRef);
      return snap.exists() ? { id: snap.id, ...snap.data() } : null;
    } catch (e) {
      console.warn(`Firestore getDoc failed for ${id}`, e);
    }
  }

  const items = getLocalStore(`${moduleName}_${collectionName}`);
  return items.find((i) => i.id === id) || null;
}

export async function createDoc(moduleName, collectionName, data) {
  const user = auth.currentUser;
  const id = data.id || `local_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
  const now = new Date().toISOString();
  const payload = {
    ...data,
    id,
    created_at: data.created_at || now,
    updated_at: now,
  };

  if (user?.uid) {
    try {
      const colRef = collection(db, `${moduleName}/${user.uid}/${collectionName}`);
      const docRef = doc(colRef, id);
      await setDoc(docRef, { ...payload, created_at: serverTimestamp(), updated_at: serverTimestamp() });
    } catch (e) {
      console.warn(`Firestore createDoc failed for ${moduleName}/${collectionName}`, e);
    }
  }

  const items = getLocalStore(`${moduleName}_${collectionName}`);
  const updated = [payload, ...items.filter((i) => i.id !== id)];
  setLocalStore(`${moduleName}_${collectionName}`, updated);
  return payload;
}

export async function updateDocById(moduleName, collectionName, id, updates) {
  const user = auth.currentUser;
  const now = new Date().toISOString();

  if (user?.uid) {
    try {
      const docRef = doc(db, `${moduleName}/${user.uid}/${collectionName}`, id);
      await updateDoc(docRef, { ...updates, updated_at: serverTimestamp() });
    } catch (e) {
      console.warn(`Firestore updateDoc failed for ${id}`, e);
    }
  }

  const items = getLocalStore(`${moduleName}_${collectionName}`);
  const updated = items.map((item) => (item.id === id ? { ...item, ...updates, updated_at: now } : item));
  setLocalStore(`${moduleName}_${collectionName}`, updated);
  return { id, ...updates };
}

export async function deleteDocById(moduleName, collectionName, id) {
  const user = auth.currentUser;
  if (user?.uid) {
    try {
      const docRef = doc(db, `${moduleName}/${user.uid}/${collectionName}`, id);
      await deleteDoc(docRef);
    } catch (e) {
      console.warn(`Firestore deleteDoc failed for ${id}`, e);
    }
  }

  const items = getLocalStore(`${moduleName}_${collectionName}`);
  const updated = items.filter((i) => i.id !== id);
  setLocalStore(`${moduleName}_${collectionName}`, updated);
}
