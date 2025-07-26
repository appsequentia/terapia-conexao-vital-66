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
      console.error('[useCreateOrFindChat] Usuário não autenticado');
      setError('Usuário não autenticado');
      return null;
    }

    if (!db) {
      console.error('[useCreateOrFindChat] Firebase DB não disponível');
      setError('Erro de conexão com o banco de dados');
      return null;
    }

    console.log('[useCreateOrFindChat] ===== INÍCIO DA FUNÇÃO =====');
    console.log('[useCreateOrFindChat] Usuário autenticado:', user);
    console.log('[useCreateOrFindChat] Profile:', profile);
    console.log('[useCreateOrFindChat] Firebase DB disponível:', !!db);
    console.log('[useCreateOrFindChat] Parâmetros:', { 
      therapistId, 
      therapistName,
      clientId,
      clientName,
      currentUserId: user.id,
      userType: profile?.tipo_usuario 
    });

    setLoading(true);
    setError(null);

    try {
      const currentUserId = user.id;
      const otherUserId = profile?.tipo_usuario === 'therapist' ? clientId : therapistId;
      
      if (!otherUserId) {
        console.error('[useCreateOrFindChat] ID do usuário de destino não encontrado');
        throw new Error('ID do usuário de destino não encontrado');
      }

      console.log('[useCreateOrFindChat] IDs definidos:', { currentUserId, otherUserId });

      // Buscar chat existente
      const chatsRef = collection(db, 'chats');
      const q = query(
        chatsRef,
        where('participants', 'array-contains', currentUserId)
      );
      
      const querySnapshot = await getDocs(q);
      let existingChatId = null;

      console.log('[useCreateOrFindChat] Chats encontrados:', querySnapshot.docs.length);

      querySnapshot.forEach((doc) => {
        const chatData = doc.data();
        if (chatData.participants.includes(otherUserId)) {
          existingChatId = doc.id;
          console.log('[useCreateOrFindChat] Chat existente encontrado:', existingChatId);
        }
      });

      // Se chat já existe, navegar para ele
      if (existingChatId) {
        console.log('[useCreateOrFindChat] Navegando para chat existente:', existingChatId);
        navigate(`/chat/${existingChatId}`);
        return existingChatId;
      }

      // Criar novo chat
      console.log('[useCreateOrFindChat] Criando novo chat...');
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

      console.log('[useCreateOrFindChat] Dados do novo chat:', newChatData);
      const newChatRef = await addDoc(chatsRef, newChatData);
      console.log('[useCreateOrFindChat] Novo chat criado com ID:', newChatRef.id);
      
      // Navegar para o novo chat
      navigate(`/chat/${newChatRef.id}`);
      return newChatRef.id;

    } catch (err) {
      console.error('[useCreateOrFindChat] Erro ao criar/encontrar chat:', err);
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