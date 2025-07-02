-- Primeiro, verificar se existem agendamentos vinculados aos terapeutas fictícios
-- Se houver, eles também serão removidos devido à integridade referencial

-- Remover agendamentos órfãos (se existirem) de terapeutas fictícios
DELETE FROM appointments 
WHERE therapist_id IN (
  SELECT id FROM terapeutas WHERE user_id IS NULL
);

-- Remover slots de disponibilidade de terapeutas fictícios
DELETE FROM availability_slots 
WHERE therapist_id IN (
  SELECT id FROM terapeutas WHERE user_id IS NULL
);

-- Remover terapeutas fictícios (aqueles sem user_id real)
DELETE FROM terapeutas WHERE user_id IS NULL;