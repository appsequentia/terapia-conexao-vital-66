
-- Adicionar coluna genero na tabela profiles
ALTER TABLE public.profiles 
ADD COLUMN genero TEXT CHECK (genero IN ('masculino', 'feminino', 'neutro', 'nao_informado')) 
DEFAULT 'nao_informado';

-- Adicionar comentário para documentar o campo
COMMENT ON COLUMN public.profiles.genero IS 'Gênero do usuário para personalização de saudações e comunicações';
