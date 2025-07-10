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
      setLoading(false);
      return;
    }

    const messagesCollection = collection(db, 'chats', chatId, 'messages');
    const q = query(messagesCollection, orderBy('timestamp', 'asc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedMessages = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        text: doc.data().text,
        senderId: doc.data().senderId,
        timestamp: doc.data().timestamp,
      })) as Message[];
      setMessages(fetchedMessages);
      setLoading(false);
    }, (error) => {
        console.error("Error fetching messages: ", error);
        setLoading(false);
    });

    // Cleanup listener on component unmount
    return () => unsubscribe();
  }, [chatId]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || !user || !db) return;

    const messagesCollection = collection(db, 'chats', chatId, 'messages');
    try {
      await addDoc(messagesCollection, {
        text,
        senderId: user.id,
        timestamp: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error sending message: ', error);
    }
  };

  return { messages, loading, sendMessage };
};
