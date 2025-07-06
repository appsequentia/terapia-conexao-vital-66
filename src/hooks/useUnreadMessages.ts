import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import {
  collection,
  query,
  where,
  onSnapshot,
  getDocs,
  orderBy,
} from 'firebase/firestore';

export const useUnreadMessages = (userId: string | null) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId || !db) {
      setLoading(false);
      return;
    }

    let unsubscribes: (() => void)[] = [];

    try {
      // Primeiro, buscar todos os chats do usuário
      const chatsCollection = collection(db, 'chats');
      const chatsQuery = query(
        chatsCollection,
        where('participants', 'array-contains', userId)
      );

      const chatsUnsubscribe = onSnapshot(chatsQuery, (chatsSnapshot) => {
        // Limpar listeners anteriores de mensagens
        unsubscribes.forEach(unsub => unsub());
        unsubscribes = [];

        let totalUnread = 0;
        let pendingCounts = chatsSnapshot.docs.length;

        if (pendingCounts === 0) {
          setUnreadCount(0);
          setLoading(false);
          return;
        }

        chatsSnapshot.docs.forEach((chatDoc) => {
          const messagesCollection = collection(db, 'chats', chatDoc.id, 'messages');
          
          // Buscar mensagens não enviadas pelo usuário atual (não lidas)
          const messagesQuery = query(
            messagesCollection,
            where('senderId', '!=', userId),
            orderBy('senderId'),
            orderBy('timestamp', 'desc')
          );

          const messageUnsubscribe = onSnapshot(messagesQuery, (messagesSnapshot) => {
            const chatUnreadCount = messagesSnapshot.docs.length;
            totalUnread += chatUnreadCount;
            
            pendingCounts--;
            if (pendingCounts === 0) {
              setUnreadCount(totalUnread);
              setLoading(false);
            }
          }, (err) => {
            console.error(`Error fetching messages for chat ${chatDoc.id}:`, err);
            pendingCounts--;
            if (pendingCounts === 0) {
              setUnreadCount(totalUnread);
              setLoading(false);
            }
          });

          unsubscribes.push(messageUnsubscribe);
        });
      }, (err) => {
        console.error('Error fetching chats for unread count:', err);
        setError('Erro ao carregar mensagens não lidas');
        setLoading(false);
      });

      return () => {
        chatsUnsubscribe();
        unsubscribes.forEach(unsub => unsub());
      };
    } catch (err) {
      console.error('Error setting up unread messages listener:', err);
      setError('Erro ao configurar contador de mensagens');
      setLoading(false);
    }
  }, [userId]);

  return { unreadCount, loading, error };
};