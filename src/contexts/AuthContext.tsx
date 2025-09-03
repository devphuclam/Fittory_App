// src/contexts/AuthContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import {
  login,
  getUser,
  logout,
  getToken,
  registerAuthOnly,
  createStoreCustomer,
} from '../api/api'; // getToken exported above
import { TOKEN_KEY } from '../config';

interface AuthContextType {
  user: any | null;
  loadingInitial: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (
    email: string,
    password: string,
    options?: { first_name?: string; last_name?: string; metadata?: any }
  ) => Promise<any>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loadingInitial: true,
  signIn: async () => null,
  signUp: async () => null,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [loadingInitial, setLoadingInitial] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const token = await SecureStore.getItemAsync('medusa_token');
        if (token) {
          const profile = await getUser();
          setUser(profile ?? null);
        }
      } catch (err) {
        console.warn('Auth init failed:', err);
        setUser(null);
      } finally {
        setLoadingInitial(false);
      }
    })();
  }, []);

  const signIn = async (email: string, password: string) => {
    // login() sẽ lưu token, sau đó lấy profile
    await login(email, password);
    const profile = await getUser();
    if (!profile) throw new Error('Failed to fetch profile after login');
    setUser(profile);
    return profile;
  };

  const signUp = async (
    email: string,
    password: string,
    options?: { first_name?: string; last_name?: string; metadata?: any }
  ) => {
    await registerAuthOnly(email, password);
    const profile = await createStoreCustomer({
      email,
      first_name: options?.first_name,
      last_name: options?.last_name,
      metadata: options?.metadata,
    });
    setUser(profile);
    return profile;
  };

  const signOut = async () => {
    await logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loadingInitial, signIn, signOut, signUp }}
    >
      {children}
    </AuthContext.Provider>
  );
}
