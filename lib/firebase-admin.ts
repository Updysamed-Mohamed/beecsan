// Changed to 'use client' so onSnapshot works in the browser
'use client' 

import {
  collection,
  onSnapshot,
  updateDoc,
  deleteDoc,
  doc,
  setDoc,
  getDocs,
  query,
  orderBy,
  type Unsubscribe,
  serverTimestamp, // Better for Firebase dates
} from 'firebase/firestore'
import { db } from './firebase'

// Type for snapshot callback
type SnapshotCallback = (snapshot: any) => void

// --- Real-time listeners for collections ---

export function onProductsUpdate(callback: SnapshotCallback): Unsubscribe {
  // FIXED: Changed 'createdAt' to 'created_at' to match your Firestore screenshot
  return onSnapshot(
    query(collection(db, 'products'), orderBy('created_at', 'desc')),
    callback,
    (error) => {
      console.error("Products Listener Error:", error);
    }
  )
}

export function onUsersUpdate(callback: SnapshotCallback): Unsubscribe {
  return onSnapshot(
    query(collection(db, 'users'), orderBy('createdAt', 'desc')),
    callback,
    (error) => console.error("Users Listener Error:", error)
  )
}

export function onReportsUpdate(callback: SnapshotCallback): Unsubscribe {
  return onSnapshot(
    query(collection(db, 'reports'), orderBy('createdAt', 'desc')),
    callback
  )
}

export function onBannersUpdate(callback: SnapshotCallback): Unsubscribe {
  return onSnapshot(
    query(collection(db, 'banners'), orderBy('createdAt', 'desc')),
    callback
  )
}

// --- Get all data (One-time fetch) ---

export async function getAllProducts() {
  const querySnapshot = await getDocs(collection(db, 'products'))
  return querySnapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }))
}

export async function getAllUsers() {
  const querySnapshot = await getDocs(collection(db, 'users'))
  return querySnapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }))
}

// --- Update operations ---

export async function updateProductVisibility(
  productId: string,
  visibility: 'visible' | 'hidden'
) {
  const productRef = doc(db, 'products', productId)
  await updateDoc(productRef, { visibility })
}

export async function updateProductStatus(productId: string, status: string, rejectReason: string) {
  await updateDoc(doc(db, 'products', productId), { status })
}

/**
 * UPDATED: Handles active/blocked status
 * This will create the 'status' field if it doesn't exist (as seen in your screenshot)
 */
export async function updateUserStatus(userId: string, status: 'active' | 'blocked') {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, { 
      status: status,
      updatedAt: serverTimestamp() 
    });
  } catch (error) {
    console.error("Error updating user status:", error);
    throw error;
  }
}

export async function updateBanner(bannerId: string, data: Record<string, unknown>) {
  await updateDoc(doc(db, 'banners', bannerId), data)
}

// --- Delete operations ---

export async function deleteProduct(productId: string) {
  await deleteDoc(doc(db, 'products', productId))
}

export async function deleteUser(userId: string) {
  await deleteDoc(doc(db, 'users', userId))
}

export async function deleteReport(reportId: string) {
  await deleteDoc(doc(db, 'reports', reportId))
}

export async function deleteBanner(bannerId: string) {
  await deleteDoc(doc(db, 'banners', bannerId))
}

// --- Create operations ---

export async function createBanner(bannerData: Record<string, unknown>) {
  const bannersRef = collection(db, 'banners')
  const newDocRef = doc(bannersRef) // Generates a unique ID
  return await setDoc(newDocRef, {
    ...bannerData,
    createdAt: serverTimestamp(), // Use serverTimestamp for consistent dates
  })
}

// Delete product and associated report (Atomic-like)
export async function deleteProductAndReport(productId: string, reportId: string) {
  try {
    await deleteDoc(doc(db, 'products', productId))
    await deleteDoc(doc(db, 'reports', reportId))
  } catch (error) {
    console.error("Batch delete failed:", error)
    throw error
  }
}