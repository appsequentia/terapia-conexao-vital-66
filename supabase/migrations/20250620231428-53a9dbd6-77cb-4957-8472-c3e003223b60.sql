
-- 1. Corrigir o trigger para criar perfis automaticamente (se não existir)
DO $$ 
BEGIN
    -- Recriar função se ela não existir ou estiver desatualizada
    DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
    DROP FUNCTION IF EXISTS public.handle_new_user();
    
    CREATE FUNCTION public.handle_new_user()
    RETURNS TRIGGER AS $trigger$
    BEGIN
      INSERT INTO public.profiles (id, nome, email, tipo_usuario)
      VALUES (
        new.id,
        COALESCE(new.raw_user_meta_data->>'name', new.email),
        new.email,
        COALESCE(new.raw_user_meta_data->>'type', 'client')
      );
      RETURN new;
    END;
    $trigger$ LANGUAGE plpgsql SECURITY DEFINER;

    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
END $$;

-- 2. Configurar RLS na tabela profiles (se ainda não estiver habilitado)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. Configurar RLS na tabela terapeutas (se ainda não estiver habilitado)
ALTER TABLE public.terapeutas ENABLE ROW LEVEL SECURITY;

-- 4. Políticas para terapeutas (criar apenas se não existirem)
DO $$ 
BEGIN
    -- Política para visualizar perfis de terapeutas
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'terapeutas' 
        AND policyname = 'Anyone can view therapist profiles'
    ) THEN
        CREATE POLICY "Anyone can view therapist profiles" ON public.terapeutas
          FOR SELECT USING (true);
    END IF;

    -- Política para terapeutas inserirem seus próprios dados
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'terapeutas' 
        AND policyname = 'Therapists can manage own data'
    ) THEN
        CREATE POLICY "Therapists can manage own data" ON public.terapeutas
          FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;

    -- Política para terapeutas atualizarem seus próprios dados
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'terapeutas' 
        AND policyname = 'Therapists can update own data'
    ) THEN
        CREATE POLICY "Therapists can update own data" ON public.terapeutas
          FOR UPDATE USING (auth.uid() = user_id);
    END IF;

    -- Política para terapeutas deletarem seus próprios dados
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'terapeutas' 
        AND policyname = 'Therapists can delete own data'
    ) THEN
        CREATE POLICY "Therapists can delete own data" ON public.terapeutas
          FOR DELETE USING (auth.uid() = user_id);
    END IF;
END $$;

-- 5. Adicionar campo formacao como JSONB (se não existir)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'terapeutas' AND column_name = 'formacao') THEN
        ALTER TABLE public.terapeutas ADD COLUMN formacao JSONB;
    END IF;
END $$;
