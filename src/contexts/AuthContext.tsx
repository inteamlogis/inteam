import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

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
  login: (username: string, password: string) => Promise<void>;
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

// Mock users for development — will be replaced by Supabase queries
const MOCK_USERS: (User & { senha: string })[] = [
  {
    id: '1',
    nome: 'Administrador',
    login: 'admin',
    senha: 'admin123',
    role: 'admin',
    colaborador_id: null,
    ativo: true,
    whatsapp: '11999999999',
    permissoes: null,
    permite_criar_assistente: false,
  },
  {
    id: '2',
    nome: 'João Silva',
    login: 'joao',
    senha: 'joao123',
    role: 'colaborador',
    colaborador_id: null,
    ativo: true,
    whatsapp: '11988888888',
    permissoes: null,
    permite_criar_assistente: true,
  },
  {
    id: '3',
    nome: 'Maria Assistente',
    login: 'maria',
    senha: 'maria123',
    role: 'assistente',
    colaborador_id: '2',
    ativo: true,
    whatsapp: '11977777777',
    permissoes: null,
    permite_criar_assistente: false,
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('inteam_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (username: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API delay
      await new Promise((r) => setTimeout(r, 600));
      const found = MOCK_USERS.find((u) => u.login === username && u.senha === password);
      if (!found) throw new Error('Credenciais inválidas');
      if (!found.ativo) throw new Error('Conta aguardando aprovação da diretoria');
      const { senha: _, ...userData } = found;
      setUser(userData);
      localStorage.setItem('inteam_user', JSON.stringify(userData));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    setIsLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 600));
      // In production: insert into `usuarios` table with ativo=false
      console.log('Registro enviado:', data);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('inteam_user');
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
