import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Video } from 'lucide-react';

import VideoRoom from '@/components/video/VideoRoom';

const VideoCallPage: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState('');

  const handleJoinRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) {
      alert('Por favor, insira seu nome para entrar na sala.');
      return;
    }

    // --- IMPORTANTE ---
    // Em uma aplicação real, aqui você faria uma chamada ao seu backend
    // para obter um token de acesso da Twilio de forma segura.
    // Ex: const response = await fetch('/api/get-twilio-token', { method: 'POST', body: JSON.stringify({ identity: username, room: roomId }) });
    // const data = await response.json();
    // setToken(data.token);

    // Para fins de desenvolvimento, estamos usando um token mockado inválido.
    // A lógica de conexão da Twilio irá falhar, o que é esperado sem um backend.
    setToken('mock_twilio_token');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto p-4 md:p-8 flex justify-center items-center">
        {token ? (
          <VideoRoom token={token} roomId={roomId!} />
        ) : (
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-2xl">Entrar na Sessão de Vídeo</CardTitle>
              <CardDescription>Você está prestes a entrar na sala de vídeo. Por favor, confirme seu nome.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleJoinRoom} className="space-y-4">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Seu Nome</label>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Digite seu nome"
                    required
                  />
                </div>
                <Button type="submit" className="w-full" size="lg">
                  <Video className="h-4 w-4 mr-2" />
                  Entrar na Chamada
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default VideoCallPage;
