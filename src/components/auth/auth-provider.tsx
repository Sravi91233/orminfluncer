'use client';

import { createContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, User, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import type { LoginCredentials, SignupCredentials, AppUser } from '@/types';
import { useRouter } from 'next/navigation';
import { verifyOtp } from '@/ai/flows/verify-otp-flow';

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<any>;
  signup: (credentials: SignupCredentials) => Promise<any>;
  logout: () => Promise<void>;
  signInWithGoogle: () => Promise<any>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
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

  const signup = async ({ email, password, name, otp }: SignupCredentials) => {
    if (!otp) {
        throw new Error('OTP is required for signup.');
    }
    
    // 1. Verify the OTP
    const verificationResult = await verifyOtp({ email, otp });
    if (!verificationResult.success) {
      throw new Error(verificationResult.message || 'Invalid OTP.');
    }
    
    // 2. If OTP is valid, create the user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password!);
    const firebaseUser = userCredential.user;
    const userRef = doc(db, 'users', firebaseUser.uid);
    
    // 3. Create user document in Firestore
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
    router.push('/logout');
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
