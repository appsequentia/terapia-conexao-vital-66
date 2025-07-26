import React, { useEffect, useState } from 'react';
import { useChat } from '@/hooks/useChat';
import { auth, db } from '@/lib/firebase';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import Header from '@/components/Header';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

import MessageList from '@/components/chat/MessageList';
import MessageInput from '@/components/chat/MessageInput';

const ChatPage: React.FC = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const navigate = useNavigate();
  const { messages, loading, sendMessage } = useChat(chatId || '');
  const { user } = useAuth();
  const [chatInfo, setChatInfo] = useState<any>(null);
  const [otherParticipant, setOtherParticipant] = useState<any>(null);

  useEffect(() => {
    const loadChatInfo = async () => {
      if (!chatId || !user) {
        console.log('[ChatPage] Dados insuficientes para carregar chat:', { chatId, hasUser: !!user });
        return;
      }

      try {
        console.log('[ChatPage] Carregando informações do chat:', chatId);
        // Carregar informações do chat
        const chatDoc = await getDoc(doc(db, 'chats', chatId));
        if (chatDoc.exists()) {
          const chatData = chatDoc.data();
          console.log('[ChatPage] Dados do chat carregados:', chatData);
          setChatInfo(chatData);
          
          // Encontrar o outro participante
          const otherUserId = chatData.participants.find((id: string) => id !== user.id);
          if (otherUserId && chatData.participantNames) {
            const participantInfo = {
              id: otherUserId,
              name: chatData.participantNames[otherUserId] || 'Usuário',
              type: chatData.participantTypes?.[otherUserId] || 'client'
            };
            console.log('[ChatPage] Informações do outro participante:', participantInfo);
            setOtherParticipant(participantInfo);
          }
        } else {
          console.error('[ChatPage] Chat não encontrado:', chatId);
        }
      } catch (error) {
        console.error('[ChatPage] Erro ao carregar informações do chat:', error);
      }
    };

    loadChatInfo();
  }, [chatId, user]);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header />
      <div className="flex-1 container mx-auto p-4 flex justify-center items-center">
        <Card className="w-full max-w-3xl h-full flex flex-col">
          <CardHeader className="flex flex-row items-center gap-4 border-b">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/chats')}
              className="p-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Avatar>
              <AvatarImage src="" alt={otherParticipant?.name || 'Usuário'} />
              <AvatarFallback>
                {otherParticipant?.name ? otherParticipant.name.charAt(0).toUpperCase() : 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <CardTitle className="text-lg">
                {otherParticipant?.name || 'Carregando...'}
              </CardTitle>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-gray-400"></span>
                <span className="text-sm text-gray-500 capitalize">
                  {otherParticipant?.type === 'therapist' ? 'Terapeuta' : 'Cliente'}
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 p-4 overflow-y-auto">
                        {loading ? (
              <p className="text-center text-gray-400">Carregando mensagens...</p>
            ) : (
              <MessageList messages={messages} currentUserId={user?.id || ''} />
            )}
          </CardContent>
          <CardFooter className="p-4 border-t">
            <MessageInput onSendMessage={sendMessage} />
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ChatPage;
