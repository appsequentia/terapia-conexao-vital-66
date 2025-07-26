import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useCreateOrFindChat } from '@/hooks/useCreateOrFindChat';
import { useUnreadMessages } from '@/hooks/useUnreadMessages';
import { useUserChats } from '@/hooks/useUserChats';
import { db } from '@/lib/firebase';

const ChatTestPanel: React.FC = () => {
  const { user, profile } = useAuth();
  const { startChatWithTherapist, startChatWithClient, loading, error } = useCreateOrFindChat();
  const { unreadCount } = useUnreadMessages(user?.id || null);
  const { chats } = useUserChats(user?.id || null);
  
  const [testTherapistId, setTestTherapistId] = useState('');
  const [testTherapistName, setTestTherapistName] = useState('');
  const [testClientId, setTestClientId] = useState('');
  const [testClientName, setTestClientName] = useState('');

  const handleTestChatWithTherapist = async () => {
    if (!testTherapistId || !testTherapistName) {
      alert('Preencha ID e nome do terapeuta');
      return;
    }
    await startChatWithTherapist(testTherapistId, testTherapistName);
  };

  const handleTestChatWithClient = async () => {
    if (!testClientId || !testClientName) {
      alert('Preencha ID e nome do cliente');
      return;
    }
    await startChatWithClient(testClientId, testClientName);
  };

  const checkFirebaseConnection = () => {
    console.log('[ChatTestPanel] Estado do Firebase:', {
      dbExists: !!db,
      userExists: !!user,
      profileExists: !!profile,
      userId: user?.id,
      userType: profile?.tipo_usuario
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🧪 Painel de Teste do Chat
          <Badge variant="outline">Debug</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status do Sistema */}
        <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
          <div>
            <Label className="text-sm font-medium">Status Firebase:</Label>
            <p className="text-sm">{db ? '✅ Conectado' : '❌ Desconectado'}</p>
          </div>
          <div>
            <Label className="text-sm font-medium">Usuário Atual:</Label>
            <p className="text-sm">{user ? `✅ ${profile?.nome || 'Sem nome'}` : '❌ Não logado'}</p>
          </div>
          <div>
            <Label className="text-sm font-medium">Tipo de Usuário:</Label>
            <p className="text-sm">{profile?.tipo_usuario || 'Não definido'}</p>
          </div>
          <div>
            <Label className="text-sm font-medium">Mensagens não lidas:</Label>
            <p className="text-sm">{unreadCount} mensagens</p>
          </div>
        </div>

        {/* Lista de Chats */}
        <div>
          <Label className="text-sm font-medium">Chats Ativos ({chats.length}):</Label>
          <div className="mt-2 space-y-2">
            {chats.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhum chat encontrado</p>
            ) : (
              chats.map((chat) => (
                <div key={chat.id} className="p-2 bg-muted rounded text-sm">
                  <strong>ID:</strong> {chat.id}<br />
                  <strong>Último:</strong> {chat.lastMessage?.text || 'Sem mensagens'}<br />
                  <strong>Participantes:</strong> {chat.participants.join(', ')}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Teste Chat com Terapeuta */}
        {profile?.tipo_usuario === 'client' && (
          <div className="space-y-2">
            <Label>Testar Chat com Terapeuta:</Label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                placeholder="ID do Terapeuta"
                value={testTherapistId}
                onChange={(e) => setTestTherapistId(e.target.value)}
              />
              <Input
                placeholder="Nome do Terapeuta"
                value={testTherapistName}
                onChange={(e) => setTestTherapistName(e.target.value)}
              />
            </div>
            <Button 
              onClick={handleTestChatWithTherapist}
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Criando...' : 'Iniciar Chat com Terapeuta'}
            </Button>
          </div>
        )}

        {/* Teste Chat com Cliente */}
        {profile?.tipo_usuario === 'therapist' && (
          <div className="space-y-2">
            <Label>Testar Chat com Cliente:</Label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                placeholder="ID do Cliente"
                value={testClientId}
                onChange={(e) => setTestClientId(e.target.value)}
              />
              <Input
                placeholder="Nome do Cliente"
                value={testClientName}
                onChange={(e) => setTestClientName(e.target.value)}
              />
            </div>
            <Button 
              onClick={handleTestChatWithClient}
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Criando...' : 'Iniciar Chat com Cliente'}
            </Button>
          </div>
        )}

        {/* Botões de Debug */}
        <div className="flex gap-2">
          <Button variant="outline" onClick={checkFirebaseConnection}>
            Verificar Conexão Firebase
          </Button>
          <Button 
            variant="outline" 
            onClick={() => window.location.href = '/dashboard-cliente'}
          >
            Ir para Dashboard Cliente
          </Button>
          <Button 
            variant="outline" 
            onClick={() => window.location.href = '/dashboard-terapeuta'}
          >
            Ir para Dashboard Terapeuta
          </Button>
        </div>

        {/* Erro */}
        {error && (
          <div className="p-3 bg-destructive/10 text-destructive rounded text-sm">
            <strong>Erro:</strong> {error}
          </div>
        )}

        {/* Instruções */}
        <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded text-sm">
          <strong>Instruções de Teste:</strong>
          <ol className="mt-2 space-y-1 list-decimal list-inside">
            <li>Verifique se o Firebase está conectado</li>
            <li>Teste criar um chat com outro usuário</li>
            <li>Verifique se o chat aparece na lista</li>
            <li>Envie mensagens e verifique se aparecem no Firestore</li>
            <li>Teste mensagens em tempo real em abas separadas</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatTestPanel;