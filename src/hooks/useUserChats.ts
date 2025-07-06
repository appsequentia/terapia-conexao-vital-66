import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  limit,
  getDocs,
} from 'firebase/firestore';

export interface ChatInfo {
  id: string;
  participants: string[];
  lastMessage?: {
    text: string;
    senderId: string;
    timestamp: any;
  };
  therapistName?: string;
  therapistId?: string;
}

export const useUserChats = (userId: string | null) => {
  const [chats, setChats] = useState<ChatInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId || !db) {
      setLoading(false);
      return;
    }

    try {
      const chatsCollection = collection(db, 'chats');
      const q = query(
        chatsCollection,
        where('participants', 'array-contains', userId)
      );

      const unsubscribe = onSnapshot(q, async (querySnapshot) => {
        const fetchedChats: ChatInfo[] = [];

        for (const doc of querySnapshot.docs) {
          const chatData = doc.data();
          
          // Buscar última mensagem
          const messagesCollection = collection(db, 'chats', doc.id, 'messages');
          const messagesQuery = query(
            messagesCollection,
            orderBy('timestamp', 'desc'),
            limit(1)
          );
          
          try {
            const messagesSnapshot = await getDocs(messagesQuery);
            const lastMessage = messagesSnapshot.docs[0]?.data();

            const chatInfo: ChatInfo = {
              id: doc.id,
              participants: chatData.participants || [],
              lastMessage: lastMessage ? {
                text: lastMessage.text,
                senderId: lastMessage.senderId,
                timestamp: lastMessage.timestamp,
              } : undefined,
            };

            fetchedChats.push(chatInfo);
          } catch (msgError) {
            console.error('Error fetching messages for chat:', doc.id, msgError);
            // Adicionar chat mesmo sem última mensagem
            fetchedChats.push({
              id: doc.id,
              participants: chatData.participants || [],
            });
          }
        }

        setChats(fetchedChats);
        setLoading(false);
      }, (err) => {
        console.error('Error fetching user chats:', err);
        setError('Erro ao carregar conversas');
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (err) {
      console.error('Error setting up chats listener:', err);
      setError('Erro ao configurar listener de conversas');
      setLoading(false);
    }
  }, [userId]);

  return { chats, loading, error };
};