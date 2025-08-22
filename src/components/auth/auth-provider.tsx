'use client';

import { createContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, User, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import type { LoginCredentials, SignupCredentials, AppUser } from '@/types';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<any>;
  signup: (credentials: SignupCredentials) => Promise<any>;
  logout: () => Promise<void>;
  signInWithGoogle: () => Promise<any>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.Node }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userRef = doc(db, 'users', firebaseUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const appUser = userSnap.data() as AppUser;
          setUser(appUser);
        } else {
          // This handles users signing in for the first time via Google
          const newUser: AppUser = {
            id: firebaseUser.uid,
            email: firebaseUser.email!,
            name: firebaseUser.displayName,
            role: 'user',
            createdAt: serverTimestamp(),
            photoURL: firebaseUser.photoURL,
          };
          await setDoc(userRef, newUser);
          setUser(newUser);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);
  
  const login = async ({ email, password }: LoginCredentials) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signup = async ({ email, password, name }: SignupCredentials) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;
    const userRef = doc(db, 'users', firebaseUser.uid);
    const newUser: AppUser = {
      id: firebaseUser.uid,
      email: firebaseUser.email!,
      name: name || null,
      role: 'user',
      createdAt: serverTimestamp(),
      photoURL: firebaseUser.photoURL,
    };
    await setDoc(userRef, newUser);
    return userCredential;
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };

  const logout = async () => {
    // Navigate home first, then sign out. This prevents the race condition.
    router.push('/');
    await signOut(auth);
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    signInWithGoogle,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
