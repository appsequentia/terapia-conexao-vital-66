import { useState } from 'react';
import { db } from '@/lib/firebase';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  doc, 
  setDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface CreateOrFindChatParams {
  therapistId: string;
  therapistName?: string;
  clientId?: string;
  clientName?: string;
}

export const useCreateOrFindChat = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  const createOrFindChat = async ({ 
    therapistId, 
    therapistName,
    clientId,
    clientName 
  }: CreateOrFindChatParams) => {
    if (!user) {
      setError('Usuário não autenticado');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const currentUserId = user.id;
      const otherUserId = profile?.tipo_usuario === 'therapist' ? clientId : therapistId;
      
      if (!otherUserId) {
        throw new Error('ID do usuário de destino não encontrado');
      }

      // Buscar chat existente
      const chatsRef = collection(db, 'chats');
      const q = query(
        chatsRef,
        where('participants', 'array-contains', currentUserId)
      );
      
      const querySnapshot = await getDocs(q);
      let existingChatId = null;

      querySnapshot.forEach((doc) => {
        const chatData = doc.data();
        if (chatData.participants.includes(otherUserId)) {
          existingChatId = doc.id;
        }
      });

      // Se chat já existe, navegar para ele
      if (existingChatId) {
        navigate(`/chat/${existingChatId}`);
        return existingChatId;
      }

      // Criar novo chat
      const newChatData = {
        participants: [currentUserId, otherUserId],
        participantNames: {
          [currentUserId]: profile?.nome || 'Usuário',
          [otherUserId]: profile?.tipo_usuario === 'therapist' ? clientName : therapistName
        },
        participantTypes: {
          [currentUserId]: profile?.tipo_usuario || 'client',
          [otherUserId]: profile?.tipo_usuario === 'therapist' ? 'client' : 'therapist'
        },
        createdAt: serverTimestamp(),
        lastMessage: null,
        lastMessageAt: null
      };

      const newChatRef = await addDoc(chatsRef, newChatData);
      
      // Navegar para o novo chat
      navigate(`/chat/${newChatRef.id}`);
      return newChatRef.id;

    } catch (err) {
      console.error('Erro ao criar/encontrar chat:', err);
      setError('Erro ao iniciar conversa. Tente novamente.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const startChatWithTherapist = async (therapistId: string, therapistName: string) => {
    return createOrFindChat({ therapistId, therapistName });
  };

  const startChatWithClient = async (clientId: string, clientName: string) => {
    return createOrFindChat({ therapistId: '', clientId, clientName });
  };

  return {
    createOrFindChat,
    startChatWithTherapist,
    startChatWithClient,
    loading,
    error
  };
};