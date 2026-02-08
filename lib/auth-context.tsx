// 'use client';

// import React, { createContext, useContext, useEffect, useState } from 'react';
// import {
//   signInWithEmailAndPassword,
//   createUserWithEmailAndPassword,
//   signOut as firebaseSignOut,
//   onAuthStateChanged,
//   sendEmailVerification,
// } from 'firebase/auth';
// import { auth, db } from './firebase';
// import { doc, getDoc, setDoc } from 'firebase/firestore';
// import type { User } from './types';

// interface AuthContextType {
//   user: User | null;
//   firebaseUser: any;
//   loading: boolean;
//   // 🔄 Waxaan ka dhignay inuu soo celiyo Promise<User> si LoginPage u akhriso role-ka
//   login: (email: string, password: string) => Promise<User>; 
//   register: (email: string, password: string, fullName: string, phone: string) => Promise<void>;
//   resendVerification: () => Promise<void>;
//   logout: () => Promise<void>;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [user, setUser] = useState<User | null>(null);
//   const [firebaseUser, setFirebaseUser] = useState<any>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (fUser) => {
//       if (fUser) {
//         setFirebaseUser(fUser);
//         const userDoc = await getDoc(doc(db, 'users', fUser.uid));
//         if (userDoc.exists()) {
//           setUser({ ...userDoc.data(), uid: fUser.uid } as User);
//         }
//       } else {
//         setUser(null);
//         setFirebaseUser(null);
//       }
//       setLoading(false);
//     });
//     return unsubscribe;
//   }, []);

//   const login = async (email: string, password: string): Promise<User> => {
//     const { user: fUser } = await signInWithEmailAndPassword(auth, email, password);
    
//     // 🛡️ Hubi email verification
//     if (!fUser.emailVerified) {
//       await firebaseSignOut(auth);
//       throw new Error('Fadlan marka hore email-kaaga xaqiiji (Check your inbox).');
//     }

//     const userDoc = await getDoc(doc(db, 'users', fUser.uid));
//     if (!userDoc.exists()) {
//       throw new Error('Xogta isticmaalaha lama helin.');
//     }

//     const userData = { ...userDoc.data(), uid: fUser.uid } as User;
//     setUser(userData);
//     return userData; // ✅ Tan ayaa muhiim u ah LoginPage-kaaga
//   };

//   const register = async (email: string, password: string, fullName: string, phone: string) => {
//     const { user: fUser } = await createUserWithEmailAndPassword(auth, email, password);
    
//     await sendEmailVerification(fUser);

//     const newUser = {
//       uid: fUser.uid,
//       email: email.toLowerCase(),
//       fullName,
//       phone,
//       role: 'user', // ✅ Had iyo jeer ugu dar role "user" marka hore
//       rating: 0,
//       totalProducts: 0,
//       completedSales: 0,
//       isVerified: false,
//       createdAt: new Date(),
//     };

//     await setDoc(doc(db, 'users', fUser.uid), newUser);
//     await firebaseSignOut(auth); 
//   };

//   const resendVerification = async () => {
//     if (auth.currentUser) {
//       await sendEmailVerification(auth.currentUser);
//     } else {
//       throw new Error("Fadlan isku day inaad gasho mar kale si aad u hesho link-ga.");
//     }
//   };

//   const logout = async () => {
//     await firebaseSignOut(auth);
//     setUser(null);
//     setFirebaseUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ 
//       user, 
//       firebaseUser, 
//       loading, 
//       login, 
//       register, 
//       resendVerification, 
//       logout 
//     }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) throw new Error('useAuth must be used within AuthProvider');
//   return context;
// };
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  sendEmailVerification,
} from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore'; // Ku dar onSnapshot
import type { User } from './types';

interface AuthContextType {
  user: User | null;
  firebaseUser: any;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>; 
  register: (email: string, password: string, fullName: string, phone: string) => Promise<void>;
  resendVerification: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 🛡️ Debugging logs
  useEffect(() => {
    console.log("Auth State Changed - User:", user?.email, "Role:", user?.role, "Status:", user?.status, "Loading:", loading);
  }, [user, loading]);

  useEffect(() => {
    let unsubscribeSnapshot: () => void;

    const unsubscribeAuth = onAuthStateChanged(auth, async (fUser) => {
      setLoading(true);
      
      if (fUser) {
        setFirebaseUser(fUser);
        
        // 🚀 LIVE LISTENER: Waxaan la soconaynaa haddii user-ka la block gareeyo
        const userRef = doc(db, 'users', fUser.uid);
        unsubscribeSnapshot = onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            const userData = { ...docSnap.data(), uid: fUser.uid } as User;
            
            // 🛑 CHECK STATUS: Haddii uu yahay blocked, logout ka dhig
            if (userData.status === 'blocked') {
              console.warn("User is blocked. Logging out...");
              firebaseSignOut(auth);
              setUser(null);
              setFirebaseUser(null);
              // Waxaad ku dari kartaa redirect haddii aad rabto: window.location.href = '/auth/login?error=blocked';
            } else {
              setUser(userData);
            }
          }
          setLoading(false);
        }, (error) => {
          console.error("Snapshot error:", error);
          setLoading(false);
        });

      } else {
        setUser(null);
        setFirebaseUser(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeSnapshot) unsubscribeSnapshot();
    };
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    const { user: fUser } = await signInWithEmailAndPassword(auth, email, password);
    
    if (!fUser.emailVerified) {
      await firebaseSignOut(auth);
      throw new Error('Fadlan marka hore email-kaaga xaqiiji (Check your inbox).');
    }

    const userDoc = await getDoc(doc(db, 'users', fUser.uid));
    if (!userDoc.exists()) {
      throw new Error('Xogta isticmaalaha lama helin.');
    }

    const userData = { ...userDoc.data(), uid: fUser.uid } as User;
    
    // 🛑 Hubi in uusan blocked ahayn xitaa xilliga login-ka
    if (userData.status === 'blocked') {
      await firebaseSignOut(auth);
      throw new Error('Akoonkan waa laga xannibay nidaamka. Fadlan la xiriir admin-ka.');
    }

    setUser(userData);
    setFirebaseUser(fUser);
    
    return userData; 
  };

  const register = async (email: string, password: string, fullName: string, phone: string) => {
    const { user: fUser } = await createUserWithEmailAndPassword(auth, email, password);
    await sendEmailVerification(fUser);

    const newUser = {
      uid: fUser.uid,
      email: email.toLowerCase(),
      fullName,
      phone,
      role: 'user', 
      status: 'active', // Hubi in status-ka bilowga uu yahay active
      rating: 0,
      totalProducts: 0,
      completedSales: 0,
      isVerified: false,
      createdAt: new Date(),
    };

    await setDoc(doc(db, 'users', fUser.uid), newUser);
    await firebaseSignOut(auth); 
  };

  const resendVerification = async () => {
    if (auth.currentUser) {
      await sendEmailVerification(auth.currentUser);
    }
  };

  const logout = async () => {
    setLoading(true);
    await firebaseSignOut(auth);
    setUser(null);
    setFirebaseUser(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, firebaseUser, loading, login, register, resendVerification, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};