import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (messageText: string) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() === '') return;

    onSendMessage(message);
    setMessage('');
  };

  return (
    <form onSubmit={handleSendMessage} className="flex items-start gap-2">
      <Textarea
        placeholder="Digite sua mensagem..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage(e);
          }
        }}
        rows={1}
        className="flex-1 resize-none"
      />
      <Button type="submit" size="icon" disabled={message.trim() === ''}>
        <Send className="h-4 w-4" />
        <span className="sr-only">Enviar Mensagem</span>
      </Button>
    </form>
  );
};

export default MessageInput;
