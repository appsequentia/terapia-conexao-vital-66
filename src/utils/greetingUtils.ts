
export const getPersonalizedGreeting = (nome: string, genero?: string): string => {
  if (!nome) return 'Olá';
  
  // Extrair primeiro nome para saudação mais pessoal
  const firstName = nome.trim().split(' ')[0];
  
  switch (genero) {
    case 'feminino':
      return `Bem-vinda, ${firstName}!`;
    case 'masculino':
      return `Bem-vindo, ${firstName}!`;
    case 'neutro':
    case 'nao_informado':
    default:
      return `Olá, ${firstName}!`;
  }
};
