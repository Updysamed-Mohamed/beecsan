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
  serverTimestamp,
} from 'firebase/firestore'
import { db } from './firebase'

type SnapshotCallback = (snapshot: any) => void

// --- Real-time listeners for collections ---

export function onProductsUpdate(callback: SnapshotCallback): Unsubscribe {
  return onSnapshot(
    query(collection(db, 'products'), orderBy('created_at', 'desc')),
    callback,
    (error) => console.error("Products Listener Error:", error)
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
  // Waxaan hubinaynaa inuu u habaysan yahay taariikhda report-yada cusub
  return onSnapshot(
    query(collection(db, 'reports'), orderBy('createdAt', 'desc')),
    callback,
    (error) => console.error("Reports Listener Error:", error)
  )
}

export function onBannersUpdate(callback: SnapshotCallback): Unsubscribe {
  return onSnapshot(
    query(collection(db, 'banners'), orderBy('createdAt', 'desc')),
    callback,
    (error) => console.error("Banners Listener Error:", error)
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
 * CUSUB: Function-ka loogu talagalay in lagu bedelo heerka report-ka (Pending -> Reviewed -> Resolved)
 */
export async function updateReportStatus(reportId: string, status: string) {
  try {
    const reportRef = doc(db, 'reports', reportId);
    await updateDoc(reportRef, { 
      status: status,
      updatedAt: serverTimestamp() 
    });
  } catch (error) {
    console.error("Error updating report status:", error);
    throw error;
  }
}

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
  const newDocRef = doc(bannersRef) 
  return await setDoc(newDocRef, {
    ...bannerData,
    createdAt: serverTimestamp(), 
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

// Ku dar intan firebase-admin.ts
export async function sendNotification(userId: string, title: string, message: string) {
  try {
    const notifRef = collection(db, 'notifications');
    const newNotif = doc(notifRef);
    await setDoc(newNotif, {
      userId: userId,
      title: title,
      message: message,
      read: false,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Notification Error:", error);
  }
}