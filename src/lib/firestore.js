import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore"
import { db } from "./firebase"

// Get the entries collection reference for a user
const getEntriesRef = (userId) => collection(db, "users", userId, "entries")

// Save a new entry
export async function saveEntry(userId, entryData) {
  const entriesRef = getEntriesRef(userId)
  const docRef = await addDoc(entriesRef, {
    ...entryData,
    createdAt: serverTimestamp(),
  })
  return docRef.id
}

// Get all entries for a user
export async function getEntries(userId) {
  const entriesRef = getEntriesRef(userId)
  const q = query(entriesRef, orderBy("createdAt", "desc"))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }))
}

// Get a single entry by ID
export async function getEntry(userId, entryId) {
  const docRef = doc(db, "users", userId, "entries", entryId)
  const snapshot = await getDoc(docRef)
  if (!snapshot.exists()) {
    return null
  }
  return {
    id: snapshot.id,
    ...snapshot.data(),
  }
}

// Delete an entry
export async function deleteEntry(userId, entryId) {
  const docRef = doc(db, "users", userId, "entries", entryId)
  await deleteDoc(docRef)
}
