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
      setChats([]);
      return;
    }

    try {
      const chatsCollection = collection(db, 'chats');
      const q = query(
        chatsCollection,
        where('participants', 'array-contains', userId)
      );

      const unsubscribe = onSnapshot(q, async (querySnapshot) => {
        if (querySnapshot.docs.length === 0) {
          setChats([]);
          setLoading(false);
          return;
        }

        const promises = querySnapshot.docs.map(async (doc) => {
          const chatData = doc.data();
          
          try {
            // Buscar última mensagem
            const messagesCollection = collection(db, 'chats', doc.id, 'messages');
            const messagesQuery = query(
              messagesCollection,
              orderBy('timestamp', 'desc'),
              limit(1)
            );
            
            const messagesSnapshot = await getDocs(messagesQuery);
            const lastMessage = messagesSnapshot.docs[0]?.data();

            return {
              id: doc.id,
              participants: chatData.participants || [],
              lastMessage: lastMessage ? {
                text: lastMessage.text,
                senderId: lastMessage.senderId,
                timestamp: lastMessage.timestamp,
              } : undefined,
            } as ChatInfo;
          } catch (msgError) {
            console.error('Error fetching messages for chat:', doc.id, msgError);
            // Retornar chat mesmo sem última mensagem
            return {
              id: doc.id,
              participants: chatData.participants || [],
            } as ChatInfo;
          }
        });

        try {
          const fetchedChats = await Promise.all(promises);
          setChats(fetchedChats);
          setLoading(false);
        } catch (err) {
          console.error('Error processing chats:', err);
          setError('Erro ao processar conversas');
          setLoading(false);
        }
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