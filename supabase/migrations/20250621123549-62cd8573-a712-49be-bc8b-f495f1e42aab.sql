
-- Adicionar colunas faltantes na tabela terapeutas
ALTER TABLE public.terapeutas 
ADD COLUMN IF NOT EXISTS consultorio_nome TEXT,
ADD COLUMN IF NOT EXISTS crp_numero TEXT;
