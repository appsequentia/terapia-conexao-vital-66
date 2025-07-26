import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';

export interface Message {
  id: string;
  text: string;
  senderId: string;
  timestamp: Timestamp;
}

export const useChat = (chatId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!chatId || !db) {
      console.log('[useChat] Chat ID ou Firebase DB não disponível:', { chatId, dbExists: !!db });
      setLoading(false);
      return;
    }

    console.log('[useChat] Iniciando listener para chat:', chatId);
    const messagesCollection = collection(db, 'chats', chatId, 'messages');
    const q = query(messagesCollection, orderBy('timestamp', 'asc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      console.log('[useChat] Mensagens recebidas:', querySnapshot.docs.length);
      const fetchedMessages = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        text: doc.data().text,
        senderId: doc.data().senderId,
        timestamp: doc.data().timestamp,
      })) as Message[];
      setMessages(fetchedMessages);
      setLoading(false);
    }, (error) => {
        console.error("[useChat] Erro ao buscar mensagens:", error);
        setLoading(false);
    });

    // Cleanup listener on component unmount
    return () => {
      console.log('[useChat] Removendo listener do chat:', chatId);
      unsubscribe();
    };
  }, [chatId]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || !user || !db) {
      console.log('[useChat] sendMessage: Dados insuficientes:', { hasText: !!text.trim(), hasUser: !!user, hasDb: !!db });
      return;
    }

    console.log('[useChat] Enviando mensagem:', { chatId, text: text.substring(0, 50) + '...', senderId: user.id });
    const messagesCollection = collection(db, 'chats', chatId, 'messages');
    try {
      await addDoc(messagesCollection, {
        text,
        senderId: user.id,
        timestamp: serverTimestamp(),
      });
      console.log('[useChat] Mensagem enviada com sucesso');
    } catch (error) {
      console.error('[useChat] Erro ao enviar mensagem:', error);
    }
  };

  return { messages, loading, sendMessage };
};
