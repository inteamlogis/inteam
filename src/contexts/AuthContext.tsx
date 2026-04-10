import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type UserRole = 'admin' | 'colaborador' | 'assistente';

export interface User {
  id: string;
  nome: string;
  login: string;
  role: UserRole;
  colaborador_id: string | null;
  ativo: boolean;
  whatsapp: string | null;
  permissoes: Record<string, boolean> | null;
  permite_criar_assistente: boolean;
  onboarding_concluido: boolean;
  avatar: string | null;
  tema_config: Record<string, unknown> | null;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (loginStr: string, senha: string) => Promise<void>;
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

const TOKEN_KEY = 'inteam_token';
const USER_KEY = 'inteam_user';

function saveSession(token: string, user: User) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

function loadSession(): { token: string | null; user: User | null } {
  const token = localStorage.getItem(TOKEN_KEY);
  const userStr = localStorage.getItem(USER_KEY);
  if (token && userStr) {
    try {
      return { token, user: JSON.parse(userStr) };
    } catch {
      clearSession();
    }
  }
  return { token: null, user: null };
}

function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const session = loadSession();
    if (session.token && session.user && !isTokenExpired(session.token)) {
      setToken(session.token);
      setUser(session.user);
    } else {
      clearSession();
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (loginStr: string, senha: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('custom-login', {
        body: { login: loginStr, senha },
      });

      if (error) throw new Error(error.message || 'Erro ao conectar');
      if (data?.error) throw new Error(data.error);

      const userData: User = {
        id: data.user.id,
        nome: data.user.nome,
        login: data.user.login,
        role: data.user.role as UserRole,
        colaborador_id: data.user.colaborador_id,
        ativo: data.user.ativo,
        whatsapp: data.user.whatsapp,
        permissoes: data.user.permissoes,
        permite_criar_assistente: data.user.permite_criar_assistente,
        onboarding_concluido: data.user.onboarding_concluido,
        avatar: data.user.avatar,
        tema_config: data.user.tema_config,
      };

      setToken(data.token);
      setUser(userData);
      saveSession(data.token, userData);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    setIsLoading(true);
    try {
      const { data: result, error } = await supabase.functions.invoke('register-user', {
        body: {
          nome: data.nome,
          login: data.login,
          senha: data.senha,
          whatsapp: data.whatsapp,
        },
      });

      if (error) throw new Error(error.message || 'Erro ao conectar');
      if (result?.error) throw new Error(result.error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    clearSession();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
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
