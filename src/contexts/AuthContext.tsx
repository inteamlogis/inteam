import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User as SupabaseUser } from '@supabase/supabase-js';

export type UserRole = 'admin' | 'colaborador' | 'assistente';

export interface User {
  id: string;
  nome: string;
  login: string;
  role: UserRole;
  colaborador_id: string | null;
  ativo: boolean;
  whatsapp: string;
  permissoes: Record<string, boolean> | null;
  permite_criar_assistente: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
  isColaborador: boolean;
  isAssistente: boolean;
}

interface RegisterData {
  nome: string;
  login: string;
  whatsapp: string;
  senha: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

async function fetchProfile(userId: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    nome: data.nome,
    login: data.login,
    role: data.role as UserRole,
    colaborador_id: data.colaborador_id,
    ativo: data.ativo,
    whatsapp: data.whatsapp,
    permissoes: data.permissoes as Record<string, boolean> | null,
    permite_criar_assistente: data.permite_criar_assistente,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Listen for auth state changes first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          // Use setTimeout to avoid potential deadlock with Supabase client
          setTimeout(async () => {
            const profile = await fetchProfile(session.user.id);
            setUser(profile);
            setIsLoading(false);
          }, 0);
        } else {
          setUser(null);
          setIsLoading(false);
        }
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const profile = await fetchProfile(session.user.id);
        setUser(profile);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw new Error(error.message);
    } catch (err) {
      setIsLoading(false);
      throw err;
    }
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: `${data.login}@inteam.app`,
        password: data.senha,
        options: {
          data: {
            nome: data.nome,
            login: data.login,
            whatsapp: data.whatsapp,
          },
        },
      });
      if (error) throw new Error(error.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        isAdmin: user?.role === 'admin',
        isColaborador: user?.role === 'colaborador',
        isAssistente: user?.role === 'assistente',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
