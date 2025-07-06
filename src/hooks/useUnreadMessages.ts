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
      setUnreadCount(0);
      return;
    }

    let unsubscribes: (() => void)[] = [];

    try {
      // Buscar todos os chats do usuário
      const chatsCollection = collection(db, 'chats');
      const chatsQuery = query(
        chatsCollection,
        where('participants', 'array-contains', userId)
      );

      const chatsUnsubscribe = onSnapshot(chatsQuery, async (chatsSnapshot) => {
        // Limpar listeners anteriores
        unsubscribes.forEach(unsub => unsub());
        unsubscribes = [];

        if (chatsSnapshot.docs.length === 0) {
          setUnreadCount(0);
          setLoading(false);
          return;
        }

        let totalUnread = 0;
        const promises = chatsSnapshot.docs.map(async (chatDoc) => {
          try {
            const messagesCollection = collection(db, 'chats', chatDoc.id, 'messages');
            
            // Buscar mensagens não enviadas pelo usuário atual
            const messagesQuery = query(
              messagesCollection,
              where('senderId', '!=', userId),
              orderBy('senderId'),
              orderBy('timestamp', 'desc')
            );

            const messagesSnapshot = await getDocs(messagesQuery);
            return messagesSnapshot.docs.length;
          } catch (err) {
            console.error(`Error counting messages for chat ${chatDoc.id}:`, err);
            return 0;
          }
        });

        try {
          const counts = await Promise.all(promises);
          totalUnread = counts.reduce((sum, count) => sum + count, 0);
          setUnreadCount(totalUnread);
          setLoading(false);
        } catch (err) {
          console.error('Error calculating total unread:', err);
          setUnreadCount(0);
          setLoading(false);
        }
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