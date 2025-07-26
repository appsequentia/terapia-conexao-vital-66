import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageCircle, Plus, ArrowLeft, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserChats } from '@/hooks/useUserChats';
import { useUnreadMessages } from '@/hooks/useUnreadMessages';
import Header from '@/components/Header';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const ChatsListPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { chats, loading: chatsLoading, error: chatsError } = useUserChats(user?.id || null);
  const { unreadCount } = useUnreadMessages(user?.id || null);

  const getOtherParticipantName = (chat: any) => {
    const otherParticipantId = chat.participants?.find((id: string) => id !== user?.id);
    return chat.therapistName || chat.clientName || `Usuário ${otherParticipantId?.slice(0, 8)}`;
  };

  const formatMessageTime = (timestamp: any) => {
    if (!timestamp) return '';
    
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return formatDistanceToNow(date, { 
        addSuffix: true, 
        locale: ptBR 
      });
    } catch (error) {
      return '';
    }
  };

  const getMessagePreview = (text: string) => {
    return text.length > 50 ? `${text.substring(0, 50)}...` : text;
  };

  if (chatsLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-background">
          <div className="max-w-4xl mx-auto p-6">
            <div className="flex items-center justify-center h-64">
              <div className="flex items-center space-x-2">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="text-muted-foreground">Carregando conversas...</span>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto p-6">
          {/* Header da página */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(-1)}
                className="p-2"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Mensagens</h1>
                <p className="text-sm text-muted-foreground">
                  {chats.length > 0 
                    ? `${chats.length} conversa${chats.length > 1 ? 's' : ''} ativa${chats.length > 1 ? 's' : ''}`
                    : 'Nenhuma conversa ativa'
                  }
                  {unreadCount > 0 && ` • ${unreadCount} não lida${unreadCount > 1 ? 's' : ''}`}
                </p>
              </div>
            </div>
            
            <Button 
              onClick={() => navigate('/encontrar-terapeutas')}
              className="flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Nova Conversa</span>
            </Button>
          </div>

          {/* Lista de conversas */}
          {chatsError ? (
            <Card>
              <CardContent className="p-6 text-center">
                <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Erro ao carregar conversas</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Não foi possível carregar suas conversas. Verifique sua conexão.
                </p>
                <Button 
                  onClick={() => window.location.reload()}
                  variant="outline"
                >
                  Tentar Novamente
                </Button>
              </CardContent>
            </Card>
          ) : chats.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Nenhuma conversa ainda</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Comece uma conversa com um terapeuta para aparecer aqui.
                </p>
                <Button 
                  onClick={() => navigate('/encontrar-terapeutas')}
                  className="flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Encontrar Terapeutas</span>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {chats.map((chat) => (
                <Card 
                  key={chat.id}
                  className="cursor-pointer transition-all hover:shadow-md hover:bg-accent/50"
                  onClick={() => navigate(`/chat/${chat.id}`)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      {/* Avatar */}
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {getOtherParticipantName(chat).charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      
                      {/* Conteúdo da conversa */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-foreground truncate">
                            {getOtherParticipantName(chat)}
                          </h3>
                          <div className="flex items-center space-x-2 flex-shrink-0">
                            {chat.lastMessage && (
                              <span className="text-xs text-muted-foreground">
                                {formatMessageTime(chat.lastMessage.timestamp)}
                              </span>
                            )}
                            <Badge variant="secondary" className="text-xs">
                              {/* Aqui seria o número de mensagens não lidas desta conversa específica */}
                              <MessageCircle className="h-3 w-3" />
                            </Badge>
                          </div>
                        </div>
                        
                        {chat.lastMessage ? (
                          <p className="text-sm text-muted-foreground truncate">
                            {chat.lastMessage.senderId === user?.id ? 'Você: ' : ''}
                            {getMessagePreview(chat.lastMessage.text)}
                          </p>
                        ) : (
                          <p className="text-sm text-muted-foreground italic">
                            Conversa iniciada
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ChatsListPage;