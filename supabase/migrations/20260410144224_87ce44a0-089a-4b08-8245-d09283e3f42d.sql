
-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'colaborador', 'assistente');

-- Create enum for order status
CREATE TYPE public.pedido_status AS ENUM ('novo', 'em_analise', 'aprovado', 'enviado', 'entregue', 'cancelado');

-- Create enum for marketplace type
CREATE TYPE public.marketplace_tipo AS ENUM ('mercadolivre', 'shopee', 'outro');

-- Create enum for cash book entry type
CREATE TYPE public.livro_caixa_tipo AS ENUM ('entrada', 'saida');

-- Profiles table linked to Supabase Auth
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  nome TEXT NOT NULL,
  login TEXT NOT NULL UNIQUE,
  whatsapp TEXT NOT NULL DEFAULT '',
  role app_role NOT NULL DEFAULT 'colaborador',
  colaborador_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  ativo BOOLEAN NOT NULL DEFAULT false,
  permissoes JSONB,
  permite_criar_assistente BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- User roles table (separate for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

-- Estoque (inventory)
CREATE TABLE public.estoque (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  sku TEXT UNIQUE,
  quantidade INTEGER NOT NULL DEFAULT 0,
  preco_custo NUMERIC(12,2) NOT NULL DEFAULT 0,
  preco_venda NUMERIC(12,2) NOT NULL DEFAULT 0,
  marketplace TEXT,
  imagem_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Marketplaces
CREATE TABLE public.marketplaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  tipo marketplace_tipo NOT NULL DEFAULT 'outro',
  api_token TEXT,
  conectado BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Pedidos (orders)
CREATE TABLE public.pedidos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  numero TEXT NOT NULL,
  cliente TEXT NOT NULL,
  status pedido_status NOT NULL DEFAULT 'novo',
  marketplace_id UUID REFERENCES public.marketplaces(id) ON DELETE SET NULL,
  valor NUMERIC(12,2) NOT NULL DEFAULT 0,
  rastreio TEXT,
  observacoes TEXT,
  responsavel_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Mensagens de pedido (order chat messages)
CREATE TABLE public.mensagens_pedido (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pedido_id UUID REFERENCES public.pedidos(id) ON DELETE CASCADE NOT NULL,
  remetente_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  conteudo TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Livro caixa (cash book)
CREATE TABLE public.livro_caixa (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo livro_caixa_tipo NOT NULL,
  descricao TEXT NOT NULL,
  valor NUMERIC(12,2) NOT NULL,
  categoria TEXT,
  data DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.estoque ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pedidos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mensagens_pedido ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.livro_caixa ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Helper: get profile id from auth user
CREATE OR REPLACE FUNCTION public.get_profile_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM public.profiles WHERE user_id = auth.uid() LIMIT 1
$$;

-- Helper: get colaborador_id for assistentes
CREATE OR REPLACE FUNCTION public.get_colaborador_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT colaborador_id FROM public.profiles WHERE user_id = auth.uid() LIMIT 1
$$;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update all profiles" ON public.profiles FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Admins can insert profiles" ON public.profiles FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "System can insert profile on signup" ON public.profiles FOR INSERT WITH CHECK (user_id = auth.uid());

-- User roles policies
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (user_id = auth.uid());

-- Estoque policies (all authenticated can read, admins can write)
CREATE POLICY "Authenticated can view estoque" ON public.estoque FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage estoque" ON public.estoque FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Marketplaces policies
CREATE POLICY "Authenticated can view marketplaces" ON public.marketplaces FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage marketplaces" ON public.marketplaces FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Pedidos policies
CREATE POLICY "Authenticated can view pedidos" ON public.pedidos FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage pedidos" ON public.pedidos FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Responsavel can update pedidos" ON public.pedidos FOR UPDATE USING (responsavel_id = public.get_profile_id());

-- Mensagens pedido policies
CREATE POLICY "Authenticated can view mensagens" ON public.mensagens_pedido FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can send mensagens" ON public.mensagens_pedido FOR INSERT TO authenticated WITH CHECK (remetente_id = public.get_profile_id());

-- Livro caixa policies
CREATE POLICY "Admins can manage livro_caixa" ON public.livro_caixa FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Authenticated can view livro_caixa" ON public.livro_caixa FOR SELECT TO authenticated USING (true);

-- Auto-update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_estoque_updated_at BEFORE UPDATE ON public.estoque FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_marketplaces_updated_at BEFORE UPDATE ON public.marketplaces FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_pedidos_updated_at BEFORE UPDATE ON public.pedidos FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_livro_caixa_updated_at BEFORE UPDATE ON public.livro_caixa FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, nome, login, whatsapp, ativo)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nome', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'login', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'whatsapp', ''),
    false
  );
  -- Add default role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'colaborador');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Enable realtime for mensagens_pedido (chat)
ALTER PUBLICATION supabase_realtime ADD TABLE public.mensagens_pedido;
