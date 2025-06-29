import React from 'react';
import { useChat } from '@/hooks/useChat';
import { auth } from '@/lib/firebase'; // Para obter o ID do usuário atual
import { useParams } from 'react-router-dom';
import Header from '@/components/Header';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import MessageList from '@/components/chat/MessageList';
import MessageInput from '@/components/chat/MessageInput';

const ChatPage: React.FC = () => {
  const { chatId } = useParams<{ chatId: string }>();
  // O chatId 'default-chat' é um placeholder. Em um app real, ele seria dinâmico.
  const { messages, loading, sendMessage } = useChat(chatId || 'default-chat');
  const currentUser = auth.currentUser;

  // Mock de dados do terapeuta (em um app real, viria do backend)
  const therapist = {
    name: 'Dra. Ana Silva',
    avatarUrl: 'https://github.com/shadcn.png',
    status: 'online',
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header />
      <div className="flex-1 container mx-auto p-4 flex justify-center items-center">
        <Card className="w-full max-w-3xl h-full flex flex-col">
          <CardHeader className="flex flex-row items-center gap-4 border-b">
            <Avatar>
              <AvatarImage src={therapist.avatarUrl} alt={therapist.name} />
              <AvatarFallback>{therapist.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <CardTitle className="text-lg">{therapist.name}</CardTitle>
              <div className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${therapist.status === 'online' ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                <span className="text-sm text-gray-500 capitalize">{therapist.status}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 p-4 overflow-y-auto">
                        {loading ? (
              <p className="text-center text-gray-400">Carregando mensagens...</p>
            ) : (
              <MessageList messages={messages} currentUserId={currentUser?.uid || ''} />
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
