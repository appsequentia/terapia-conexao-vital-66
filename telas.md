# Checklist de Telas e Componentes - Sequentia

## 1. Telas de Autenticação e Cadastro

- [x] **Tela de Login (`/login`)**
  - [x] Campo de e-mail
  - [x] Campo de senha
  - [x] Botão "Entrar"
  - [x] Link "Esqueci minha senha"
  - [x] Divisor "OU"
  - [x] Botões de login social (Google, Facebook)
  - [x] Validação em tempo real dos campos
  - [x] Redirecionamento para redefinição de senha

- [x] **Tela de Cadastro (`/register`)**
  - [x] Seletor de tipo de usuário ("Sou terapeuta" / "Sou cliente")
  - [x] Campo: Nome completo
  - [x] Campo: E-mail
  - [x] Campo: Senha
  - [x] Campo: Confirmação de senha
  - [x] Checkbox "Aceito os Termos de Uso"
  - [x] Botão "Cadastrar"
  - [x] Validação de senha coincidente

- [x] **Tela de Esqueci Minha Senha (`/forgot-password`)**
  - [x] Campo de e-mail
  - [x] Botão "Enviar link de recuperação"

## 2. Telas de Perfil

- [x] **Tela de Perfil do Terapeuta (Edição) (`/therapist-profile`)**
  - [x] Upload de foto de perfil (`ImageUpload.tsx`)
  - [x] Campo: Especialidade (dropdown com múltipla seleção)
  - [x] Campo: Abordagem (dropdown)
  - [x] Campo: Valor da sessão
  - [x] Campo: Descrição bio (textarea)
  - [x] Campo: Formação (`FormationInput.tsx`)
  - [x] Botão "Salvar"

- [x] **Tela de Perfil Público do Terapeuta (`/therapist/:id`)**
  - [x] Header com Foto, nome e especialidade
  - [x] Avaliação (componente de estrelas)
  - [x] Abas: "Sobre", "Avaliações", "Disponibilidade"
  - [x] Seção "Sobre": Bio, formação, abordagem
  - [x] Seção "Disponibilidade": Calendário semanal interativo

## 3. Telas de Busca e Agendamento

- [x] **Tela de Busca de Terapeutas (`/find-therapists`)**
  - [x] Barra de busca (`SearchBar.tsx`)
  - [x] Filtros avançados (`FilterSidebar.tsx`)
    - [x] Modalidade (online/presencial)
    - [x] Faixa de preço
    - [x] Especialidade
  - [x] Lista de terapeutas (`TherapistCard.tsx`)
  - [x] Botão "Aplicar Filtros"
  - [x] Cards redirecionam para perfil público

- [ ] **Tela de Agendamento**
  - [ ] Calendário mensal para seleção de datas
  - [ ] Lista de horários disponíveis
  - [ ] Modal de confirmação com resumo
  - [ ] Horários indisponíveis desabilitados

## 4. Telas de Pagamento

- [ ] **Tela de Seleção de Método de Pagamento**
  - [ ] Opções: Cartão de crédito, PIX, Boleto
  - [ ] Botão "Continuar"

- [ ] **Tela de Checkout (Cartão)**
  - [ ] Formulário com dados do cartão
  - [ ] Checkbox "Salvar cartão"
  - [ ] Botão "Pagar"

## 5. Telas de Comunicação

- [ ] **Tela de Chat**
  - [ ] Header com nome e status do terapeuta
  - [ ] Lista de mensagens
  - [ ] Input de mensagem + botão de envio

- [ ] **Tela de Vídeo Chamada**
  - [ ] Janela de vídeo (WebRTC)
  - [ ] Controles: Microfone, Câmera, Encerrar

## 6. Dashboards

- [x] **Dashboard do Cliente (`/dashboard/client`)**
  - [ ] **Card de Próxima Sessão:** Exibe detalhes da próxima consulta agendada (terapeuta, data, hora).
  - [ ] **Lista de Consultas Futuras:** Uma lista com todas as sessões agendadas.
  - [ ] **Histórico de Sessões:** Acesso a uma lista de sessões passadas, com opção de ver detalhes.
  - [ ] **Mensagens Recentes:** Um widget com as últimas mensagens não lidas.
  - [ ] **Terapeutas Favoritos:** Acesso rápido aos perfis de terapeutas salvos.
  - [ ] **Configurações da Conta:** Link para a página de edição de perfil e configurações.

- [x] **Dashboard do Terapeuta (`/dashboard/therapist`)**
  - [ ] **Resumo do Dia:** Cards com o número de sessões de hoje, novos clientes e faturamento do dia.
  - [ ] **Agenda do Dia/Semana:** Visualização clara das sessões agendadas.
  - [ ] **Gestão de Disponibilidade:** Acesso rápido para bloquear/desbloquear horários.
  - [ ] **Resumo Financeiro:** Gráfico com faturamento mensal e saldo disponível para saque.
  - [ ] **Lista de Clientes:** Acesso rápido ao perfil e histórico dos clientes.
  - [ ] **Notificações:** Alertas sobre novos agendamentos, cancelamentos e mensagens.

## 7. Dashboard Administrativo

- [ ] **Dashboard Principal (`/admin/dashboard`)**
  - [ ] **KPIs Gerais:** Cards com total de usuários (clientes/terapeutas), total de sessões realizadas, faturamento total.
  - [ ] **Gráfico de Crescimento:** Gráfico de novos usuários e sessões por período.
  - [ ] **Últimas Atividades:** Feed com os últimos cadastros e agendamentos.

- [ ] **Gerenciamento de Terapeutas (`/admin/therapists`)**
  - [ ] **Lista de Terapeutas:** Tabela com todos os terapeutas, status (ativo, pendente, inativo).
  - [ ] **Aprovação de Cadastros:** Interface para aprovar ou reprovar novos terapeutas.
  - [ ] **Visualizar Perfil:** Acesso ao perfil completo do terapeuta.
  - [ ] **Ações:** Bloquear ou desativar um terapeuta.

- [ ] **Gerenciamento de Clientes (`/admin/clients`)**
  - [ ] **Lista de Clientes:** Tabela com todos os clientes e informações básicas.
  - [ ] **Visualizar Histórico:** Acesso ao histórico de sessões de um cliente.
  - [ ] **Ações:** Desativar um cliente.

- [ ] **Financeiro (`/admin/financial`)**
  - [ ] **Visão Geral:** Faturamento total, comissões da plataforma, valores a repassar.
  - [ ] **Gestão de Saques:** Lista de solicitações de saque dos terapeutas para aprovação.
  - [ ] **Histórico de Transações:** Todas as transações (pagamentos de clientes, repasses a terapeutas).

- [ ] **Configurações da Plataforma (`/admin/settings`)**
  - [ ] **Taxas e Comissões:** Definir a porcentagem da plataforma.
  - [ ] **Categorias e Especialidades:** Gerenciar as opções disponíveis para os terapeutas.

## 8. Componentes Reutilizáveis (Já implementados)

- [x] `Header.tsx`
- [x] `TherapistCard.tsx`
- [x] `FilterSidebar.tsx`
- [x] `SearchBar.tsx`
- [x] `ImageUpload.tsx`
- [x] `FormationInput.tsx`
- [x] `ProtectedRoute.tsx`
- [x] `SortSelect.tsx`
- [x] `ViewToggle.tsx`

## 9. Páginas Informativas

- [x] Página Inicial (`/`)
- [x] Como Funciona (`/how-it-works`)
- [x] Para Terapeutas (`/para-terapeutas`)

---

Observações:
- O checklist foi atualizado com base nos arquivos encontrados em `src/pages` e `src/components`.
- Itens marcados com `[x]` são considerados implementados.
- Itens marcados com `[ ]` ainda precisam ser desenvolvidos.