
-- Create custom usuarios table
CREATE TABLE public.usuarios (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  login TEXT UNIQUE NOT NULL,
  senha TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'colaborador' CHECK (role IN ('admin', 'colaborador', 'assistente')),
  colaborador_id UUID REFERENCES public.usuarios(id),
  ativo BOOLEAN NOT NULL DEFAULT true,
  onboarding_concluido BOOLEAN NOT NULL DEFAULT false,
  avatar TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  whatsapp TEXT,
  permissoes JSONB,
  tema_config JSONB,
  permite_criar_assistente BOOLEAN NOT NULL DEFAULT false
);

-- Trigger for updated_at
CREATE TRIGGER update_usuarios_updated_at
  BEFORE UPDATE ON public.usuarios
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Disable RLS on all existing tables
ALTER TABLE public.estoque DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.livro_caixa DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplaces DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.mensagens_pedido DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.pedidos DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles DISABLE ROW LEVEL SECURITY;

-- No RLS on usuarios table
ALTER TABLE public.usuarios DISABLE ROW LEVEL SECURITY;
