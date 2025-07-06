import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useUnreadMessages } from '@/hooks/useUnreadMessages';
import { useUserChats } from '@/hooks/useUserChats';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

const MessagesWidget = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { unreadCount, loading: unreadLoading } = useUnreadMessages(user?.id || null);
  const { chats, loading: chatsLoading } = useUserChats(user?.id || null);

  const handleClick = () => {
    if (chats.length === 0) {
      // Nenhuma conversa, redirecionar para encontrar terapeutas
      navigate('/encontrar-terapeutas');
    } else if (chats.length === 1) {
      // Uma conversa, ir direto para ela
      navigate(`/chat/${chats[0].id}`);
    } else {
      // Múltiplas conversas, ir para a primeira ou criar página de lista
      navigate(`/chat/${chats[0].id}`);
    }
  };

  const isLoading = unreadLoading || chatsLoading;

  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all hover:shadow-md",
        chats.length > 0 && "hover:bg-accent/50"
      )}
      onClick={handleClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Mensagens
        </CardTitle>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Badge variant="destructive" className="h-5 w-5 p-0 flex items-center justify-center text-xs">
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
          <MessageCircle className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm text-muted-foreground">Carregando...</span>
          </div>
        ) : (
          <>
            <div className="text-2xl font-bold">
              {unreadCount > 0 ? unreadCount : chats.length}
            </div>
            <p className="text-xs text-muted-foreground">
              {unreadCount > 0 
                ? `${unreadCount} mensagem${unreadCount > 1 ? 's' : ''} não lida${unreadCount > 1 ? 's' : ''}`
                : chats.length > 0 
                  ? `${chats.length} conversa${chats.length > 1 ? 's' : ''} ativa${chats.length > 1 ? 's' : ''}`
                  : 'Nenhuma mensagem'
              }
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default MessagesWidget;