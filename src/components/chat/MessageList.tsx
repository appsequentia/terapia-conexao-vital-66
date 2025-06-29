import React, { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Message } from '@/hooks/useChat'; // Importa o tipo Message

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
}

const MessageList: React.FC<MessageListProps> = ({ messages, currentUserId }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 space-y-4 overflow-y-auto pr-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={cn(
            'flex items-end gap-2',
            message.senderId === currentUserId ? 'justify-end' : 'justify-start'
          )}
        >
          <div
            className={cn(
              'max-w-xs md:max-w-md lg:max-w-lg rounded-lg px-4 py-2',
              message.senderId === currentUserId
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted'
            )}
          >
            <p className="text-sm">{message.text}</p>
            <p className="text-xs text-right mt-1 opacity-70">
              {message.timestamp?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) || ''}
            </p>
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
