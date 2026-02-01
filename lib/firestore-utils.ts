import { db } from './firebase';
import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
  Query,
  QueryConstraint,
} from 'firebase/firestore';
import type { Product, Chat, Message, User } from './types';

// Products
export async function getProduct(id: string): Promise<Product | null> {
  const doc_ref = doc(db, 'products', id);
  const snapshot = await getDoc(doc_ref);
  if (snapshot.exists()) {
    return {
      id: snapshot.id,
      ...snapshot.data(),
    } as Product;
  }
  return null;
}

export async function getProducts(...constraints: QueryConstraint[]): Promise<Product[]> {
  const q = query(collection(db, 'products'), ...constraints);
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  } as Product));
}

export async function createProduct(userId: string, data: Omit<Product, 'id'>): Promise<string> {
  const newDoc = doc(collection(db, 'products'));
  await setDoc(newDoc, {
    ...data,
    created_at: serverTimestamp(),
  });
  return newDoc.id;
}

export async function updateProduct(id: string, data: Partial<Product>): Promise<void> {
  await updateDoc(doc(db, 'products', id), {
    ...data,
    updated_at: serverTimestamp(),
  });
}

export async function deleteProduct(id: string): Promise<void> {
  await deleteDoc(doc(db, 'products', id));
}

// Users
export async function getUser(uid: string): Promise<User | null> {
  const doc_ref = doc(db, 'users', uid);
  const snapshot = await getDoc(doc_ref);
  if (snapshot.exists()) {
    return {
      uid,
      ...snapshot.data(),
    } as User;
  }
  return null;
}

export async function updateUser(uid: string, data: Partial<User>): Promise<void> {
  await updateDoc(doc(db, 'users', uid), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

// Chats
export async function getOrCreateChat(userId1: string, userId2: string, productId?: string): Promise<string> {
  const participants = [userId1, userId2].sort();
  const q = query(
    collection(db, 'chats'),
    where('participants', '==', participants)
  );
  const snapshot = await getDocs(q);
  
  if (!snapshot.empty) {
    return snapshot.docs[0].id;
  }

  // Create new chat
  const newChat = doc(collection(db, 'chats'));
  await setDoc(newChat, {
    participants,
    lastMessage: '',
    lastTime: serverTimestamp(),
    productId,
    isDeleted: false,
  });
  return newChat.id;
}

export async function getUserChats(userId: string): Promise<Chat[]> {
  const q = query(
    collection(db, 'chats'),
    where('participants', 'array-contains', userId),
    orderBy('lastTime', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  } as Chat));
}

export async function getChatMessages(chatId: string, limitCount: number = 50): Promise<Message[]> {
  const q = query(
    collection(db, 'chats', chatId, 'messages'),
    orderBy('timestamp', 'desc'),
    limit(limitCount)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.reverse().map(doc => ({
    id: doc.id,
    ...doc.data(),
  } as Message));
}

export async function sendMessage(chatId: string, senderId: string, text: string): Promise<void> {
  const messagesCollection = collection(db, 'chats', chatId, 'messages');
  await setDoc(doc(messagesCollection), {
    senderId,
    text,
    timestamp: serverTimestamp(),
    status: 'sent',
    isDeleted: false,
  });

  // Update chat's last message
  await updateDoc(doc(db, 'chats', chatId), {
    lastMessage: text,
    lastTime: serverTimestamp(),
  });
}

export async function deleteMessage(chatId: string, messageId: string): Promise<void> {
  await updateDoc(doc(db, 'chats', chatId, 'messages', messageId), {
    isDeleted: true,
  });
}

// Favorites
export async function addFavorite(userId: string, productId: string): Promise<void> {
  await updateDoc(doc(db, 'users', userId), {
    favorites: arrayUnion(productId),
  });
}

export async function removeFavorite(userId: string, productId: string): Promise<void> {
  await updateDoc(doc(db, 'users', userId), {
    favorites: arrayRemove(productId),
  });
}

export async function getUserFavorites(userId: string): Promise<Product[]> {
  const user = await getUser(userId);
  if (!user || !user.favorites) return [];

  const products = await Promise.all(
    user.favorites.map(id => getProduct(id))
  );
  return products.filter(p => p !== null) as Product[];
}
