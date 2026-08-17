import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { logActivity } from '../lib/activityLogger';

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  created_at?: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  isGuest: boolean;
  loading: boolean;
  signInWithEmail: (email: string, pass: string) => Promise<{ error: Error | null }>;
  signUpWithEmail: (email: string, pass: string, fullName?: string) => Promise<{ error: Error | null; data?: any }>;
  continueAsGuest: () => void;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const GUEST_STORAGE_KEY = 'vinten_is_guest';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isGuest, setIsGuest] = useState<boolean>(() => {
    return localStorage.getItem(GUEST_STORAGE_KEY) === 'true';
  });
  const [loading, setLoading] = useState<boolean>(true);

  const fetchProfile = async (userId: string, email: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.warn('Error obteniendo perfil:', error.message);
      }

      if (data) {
        setProfile(data);
      } else {
        // Simple fallback profile
        setProfile({
          id: userId,
          email: email,
          full_name: email.split('@')[0],
        });
      }
    } catch (err) {
      console.error('Error al cargar perfil:', err);
    }
  };

  useEffect(() => {
    // 1. Obtener la sesión actual al cargar
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        setIsGuest(false);
        localStorage.removeItem(GUEST_STORAGE_KEY);
        fetchProfile(session.user.id, session.user.email || '');
      }
      setLoading(false);
    });

    // 2. Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        setIsGuest(false);
        localStorage.removeItem(GUEST_STORAGE_KEY);
        await fetchProfile(session.user.id, session.user.email || '');
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signInWithEmail = async (email: string, pass: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: pass,
      });

      if (error) {
        setLoading(false);
        return { error };
      }

      setIsGuest(false);
      localStorage.removeItem(GUEST_STORAGE_KEY);

      if (data.user) {
        await logActivity('user_login', `Inicio de sesión con email ${email}`, { email });
      }

      setLoading(false);
      return { error: null };
    } catch (err: any) {
      setLoading(false);
      return { error: err };
    }
  };

  const signUpWithEmail = async (email: string, pass: string, fullName?: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: pass,
        options: {
          data: {
            full_name: fullName || email.split('@')[0],
          },
        },
      });

      if (error) {
        setLoading(false);
        return { error };
      }

      if (data.user) {
        // Insertar perfil de respaldo por si el trigger no ejecutó en desarrollo
        await supabase.from('profiles').upsert([
          {
            id: data.user.id,
            email: email,
            full_name: fullName || email.split('@')[0],
          },
        ]);

        await logActivity('user_signup', `Registro de nuevo usuario ${email}`, { email, fullName });
      }

      setLoading(false);
      return { error: null, data };
    } catch (err: any) {
      setLoading(false);
      return { error: err };
    }
  };

  const continueAsGuest = () => {
    setIsGuest(true);
    localStorage.setItem(GUEST_STORAGE_KEY, 'true');
    logActivity('guest_login', 'Acceso en modo invitado');
  };

  const signOut = async () => {
    setLoading(true);
    if (user) {
      await logActivity('user_logout', 'Cierre de sesión del usuario');
      await supabase.auth.signOut();
    }
    setUser(null);
    setProfile(null);
    setIsGuest(false);
    localStorage.removeItem(GUEST_STORAGE_KEY);
    setLoading(false);
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id, user.email || '');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isGuest,
        loading,
        signInWithEmail,
        signUpWithEmail,
        continueAsGuest,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
