import React, { useEffect, useState } from 'react';
import { useChat } from '@/hooks/useChat';
import { auth, db } from '@/lib/firebase';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import Header from '@/components/Header';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';

import MessageList from '@/components/chat/MessageList';
import MessageInput from '@/components/chat/MessageInput';

const ChatPage: React.FC = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const { messages, loading, sendMessage } = useChat(chatId || '');
  const { user } = useAuth();
  const [chatInfo, setChatInfo] = useState<any>(null);
  const [otherParticipant, setOtherParticipant] = useState<any>(null);

  useEffect(() => {
    const loadChatInfo = async () => {
      if (!chatId || !user) return;

      try {
        // Carregar informações do chat
        const chatDoc = await getDoc(doc(db, 'chats', chatId));
        if (chatDoc.exists()) {
          const chatData = chatDoc.data();
          setChatInfo(chatData);
          
          // Encontrar o outro participante
          const otherUserId = chatData.participants.find((id: string) => id !== user.id);
          if (otherUserId && chatData.participantNames) {
            setOtherParticipant({
              id: otherUserId,
              name: chatData.participantNames[otherUserId] || 'Usuário',
              type: chatData.participantTypes?.[otherUserId] || 'client'
            });
          }
        }
      } catch (error) {
        console.error('Erro ao carregar informações do chat:', error);
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
