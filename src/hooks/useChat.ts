import { useState, useEffect } from 'react';
import { db, auth } from '@/lib/firebase';
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

  useEffect(() => {
    if (!chatId) return;

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
    if (!text.trim() || !auth.currentUser) return;

    const messagesCollection = collection(db, 'chats', chatId, 'messages');
    try {
      await addDoc(messagesCollection, {
        text,
        senderId: auth.currentUser.uid,
        timestamp: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error sending message: ', error);
    }
  };

  return { messages, loading, sendMessage };
};
