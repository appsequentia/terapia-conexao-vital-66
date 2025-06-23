flowchart TD
A(Tela Inicial) --> B{Usuário Logado?}
B -->|Não| C(Tela de Login/Cadastro)
B -->|Sim| D(Dashboard Principal)
C --> E{Novo Usuário?}
E -->|Sim| F(Formulário de Cadastro)
E -->|Não| G(Formulário de Login)
F --> H{Validar Dados Cadastro}
H -->|Válidos| I(Criar Conta)
H -->|Inválidos| J(Erro de Cadastro)
I --> K{Conta Criada?}
K -->|Sim| L(Enviar E-mail de Confirmação)
K -->|Não| J
L --> M{Confirmação Recebida?}
M -->|Sim| D
M -->|Não| N(Reenviar Confirmação)
N --> M
J --> F
G --> O{Validar Credenciais}
O -->|Válidas| D
O -->|Inválidas| P(Erro de Login)
P --> Q{Tentar Novamente?}
Q -->|Sim| G
Q -->|Não| R(Recuperar Senha)
R --> S{E-mail Válido?}
S -->|Sim| T(Enviar Link de Recuperação)
S -->|Não| U(Erro de E-mail)
T --> V{Senha Redefinida?}
V -->|Sim| G
V -->|Não| W(Reenviar Link)
W --> V
U --> R
D --> X{Selecionar Função}
X -->|Buscar Terapeuta| Y(Tela de Busca)
X -->|Gerenciar Agenda| Z(Calendário)
X -->|Comunicação| AA(Chat/Chamadas)
X -->|Pagamentos| BB(Histórico Financeiro)
X -->|Configurações| CC(Perfil e Config)
X -->|Sair| DD(Logout)
DD --> A
Y --> EE{Aplicar Filtros?}
EE -->|Sim| FF(Filtros Avançados)
EE -->|Não| GG(Lista de Terapeutas)
FF --> GG
GG --> HH{Selecionar Terapeuta?}
HH -->|Sim| II(Perfil do Terapeuta)
HH -->|Não| Y
II --> JJ{Agendar Consulta?}
JJ -->|Sim| KK(Selecionar Horário)
JJ -->|Não| GG
KK --> LL{Horário Disponível?}
LL -->|Sim| MM(Confirmar Agendamento)
LL -->|Não| NN(Erro de Horário)
MM --> OO{Confirmar Pagamento?}
OO -->|Sim| PP(Processar Pagamento)
OO -->|Não| KK
PP --> QQ{Pagamento Aprovado?}
QQ -->|Sim| RR(Agendamento Confirmado)
QQ -->|Não| SS(Erro de Pagamento)
RR --> D
SS --> TT{Tentar Novamente?}
TT -->|Sim| PP
TT -->|Não| KK
NN --> KK
Z --> UU{Adicionar Disponibilidade?}
UU -->|Sim| VV(Selecionar Horários)
UU -->|Não| WW(Visualizar Agenda)
VV --> XX{Salvar Alterações?}
XX -->|Sim| YY(Atualizar Agenda)
XX -->|Não| VV
YY --> ZZ{Agenda Atualizada?}
ZZ -->|Sim| WW
ZZ -->|Não| AAA(Erro de Atualização)
AAA --> VV
WW --> D
AA --> BBB{Selecionar Conversa?}
BBB -->|Sim| CCC(Tela de Chat)
BBB -->|Não| DDD(Iniciar Nova Conversa)
CCC --> EEE{Enviar Mensagem?}
EEE -->|Sim| FFF(Digitar Mensagem)
EEE -->|Não| CCC
FFF --> GGG{Enviar?}
GGG -->|Sim| HHH(Enviar Mensagem)
GGG -->|Não| FFF
HHH --> III{Mensagem Enviada?}
III -->|Sim| CCC
III -->|Não| JJJ(Erro de Envio)
JJJ --> FFF
DDD --> KKK{Selecionar Terapeuta?}
KKK -->|Sim| CCC
KKK -->|Não| DDD
BB --> LLL{Visualizar Extrato?}
LLL -->|Sim| MMM(Histórico de Pagamentos)
LLL -->|Não| NNN(Solicitar Saque)
MMM --> D
NNN --> OOO{Valor Disponível?}
OOO -->|Sim| PPP(Selecionar Método)
OOO -->|Não| QQQ(Erro de Saldo)
PPP --> RRR{Confirmar Saque?}
RRR -->|Sim| SSS(Processar Saque)
RRR -->|Não| NNN
SSS --> TTT{Saque Concluído?}
TTT -->|Sim| UUU(Confirmação)
TTT -->|Não| VVV(Erro de Saque)
UUU --> D
VVV --> NNN
QQQ --> D
CC --> WWW{Editar Perfil?}
WWW -->|Sim| XXX(Formulário de Edição)
WWW -->|Não| YYY(Configurações do App)
XXX --> ZZZ{Salvar Alterações?}
ZZZ -->|Sim| AAAA(Atualizar Perfil)
ZZZ -->|Não| XXX
AAAA --> BBBB{Perfil Atualizado?}
BBBB -->|Sim| CCCC(Confirmação)
BBBB -->|Não| DDDD(Erro de Atualização)
CCCC --> D
DDDD --> XXX
YYY --> EEEE{Alterar Configurações?}
EEEE -->|Sim| FFFF(Opções de Config)
EEEE -->|Não| D
FFFF --> GGGG{Salvar Configurações?}
GGGG -->|Sim| HHHH(Atualizar Config)
GGGG -->|Não| FFFF
HHHH --> IIII{Config Atualizada?}
IIII -->|Sim| D
IIII -->|Não| JJJJ(Erro de Config)
JJJJ --> FFFF