-- ==========================================================
-- SCHEMA DE SUPABASE PARA VINTÉN
-- Copia y ejecuta este script en el SQL Editor de Supabase
-- ==========================================================

-- 1. Tabla de Perfiles de Usuario (vinculada a auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar RLS en public.profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS para profiles
DROP POLICY IF EXISTS "Los usuarios pueden ver su propio perfil" ON public.profiles;
CREATE POLICY "Los usuarios pueden ver su propio perfil"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Los usuarios pueden actualizar su propio perfil" ON public.profiles;
CREATE POLICY "Los usuarios pueden actualizar su propio perfil"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Permitir inserción automática de perfil" ON public.profiles;
CREATE POLICY "Permitir inserción automática de perfil"
  ON public.profiles FOR INSERT
  WITH CHECK (true);


-- 2. Trigger para crear automáticamente el perfil al registrarse en auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', SPLIT_PART(NEW.email, '@', 1))
  )
  ON CONFLICT (id) DO UPDATE
  SET email = EXCLUDED.email,
      full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- 3. Tabla de Registro de Actividades (user_activities)
CREATE TABLE IF NOT EXISTS public.user_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NULL,
  guest_session_id TEXT NULL,
  activity_type TEXT NOT NULL,
  description TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar RLS en public.user_activities
ALTER TABLE public.user_activities ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS para user_activities
DROP POLICY IF EXISTS "Permitir inserción de actividades a todos (usuarios e invitados)" ON public.user_activities;
CREATE POLICY "Permitir inserción de actividades a todos (usuarios e invitados)"
  ON public.user_activities FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Los usuarios autenticados pueden ver sus propias actividades" ON public.user_activities;
CREATE POLICY "Los usuarios autenticados pueden ver sus propias actividades"
  ON public.user_activities FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL);

-- Índices de optimización para consultas de actividades
CREATE INDEX IF NOT EXISTS idx_user_activities_user_id ON public.user_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activities_guest_session ON public.user_activities(guest_session_id);
CREATE INDEX IF NOT EXISTS idx_user_activities_type ON public.user_activities(activity_type);
CREATE INDEX IF NOT EXISTS idx_user_activities_created_at ON public.user_activities(created_at DESC);


-- 4. Tabla de Eventos de Usuario (eventos_usuario)
CREATE TABLE IF NOT EXISTS public.eventos_usuario (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NULL,
  tipo_evento TEXT NOT NULL,
  detalles JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar RLS en public.eventos_usuario
ALTER TABLE public.eventos_usuario ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS para eventos_usuario
DROP POLICY IF EXISTS "Permitir inserción de eventos a todos (usuarios e invitados)" ON public.eventos_usuario;
CREATE POLICY "Permitir inserción de eventos a todos (usuarios e invitados)"
  ON public.eventos_usuario FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Los usuarios autenticados pueden ver sus propios eventos" ON public.eventos_usuario;
CREATE POLICY "Los usuarios autenticados pueden ver sus propios eventos"
  ON public.eventos_usuario FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL);

-- Índices de optimización para consultas de eventos
CREATE INDEX IF NOT EXISTS idx_eventos_usuario_user_id ON public.eventos_usuario(user_id);
CREATE INDEX IF NOT EXISTS idx_eventos_usuario_tipo ON public.eventos_usuario(tipo_evento);
CREATE INDEX IF NOT EXISTS idx_eventos_usuario_created_at ON public.eventos_usuario(created_at DESC);

