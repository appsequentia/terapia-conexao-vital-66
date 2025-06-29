import React, { useState, useEffect } from 'react';
import Video, { Room, LocalParticipant, RemoteParticipant } from 'twilio-video';
import Participant from './Participant';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Video as VideoIcon, VideoOff, PhoneOff } from 'lucide-react';

interface VideoRoomProps {
  token: string;
  roomId: string;
}

const VideoRoom: React.FC<VideoRoomProps> = ({ token, roomId }) => {
  const [room, setRoom] = useState<Room | null>(null);
  const [participants, setParticipants] = useState<RemoteParticipant[]>([]);

  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  useEffect(() => {
    const participantConnected = (participant: RemoteParticipant) => {
      setParticipants((prevParticipants) => [...prevParticipants, participant]);
    };

    const participantDisconnected = (participant: RemoteParticipant) => {
      setParticipants((prevParticipants) =>
        prevParticipants.filter((p) => p !== participant)
      );
    };

    Video.connect(token, { name: roomId }).then((room) => {
      setRoom(room);
      room.on('participantConnected', participantConnected);
      room.on('participantDisconnected', participantDisconnected);
      room.participants.forEach(participantConnected);
    }).catch(err => {
        console.error("Could not connect to Twilio: ", err);
        alert("Falha ao conectar na sala de vídeo. Verifique o token e a configuração.");
    });

    return () => {
      setRoom((currentRoom) => {
        if (currentRoom && currentRoom.localParticipant.state === 'connected') {
          currentRoom.localParticipant.tracks.forEach(function (trackPublication) {
            if ('stop' in trackPublication.track) {
              trackPublication.track.stop();
            }
          });
          currentRoom.disconnect();
          return null;
        }
        return currentRoom;
      });
    };
  }, [roomId, token]);

  const handleLeaveRoom = () => {
    if (room) {
        room.disconnect();
        window.location.reload(); // Recarrega a página para o lobby
    }
  };

  const toggleMute = () => {
    if (!room) return;
    room.localParticipant.audioTracks.forEach(publication => {
        if (isMuted) {
            publication.track.enable();
        } else {
            publication.track.disable();
        }
    });
    setIsMuted(!isMuted);
  };

  const toggleVideo = () => {
    if (!room) return;
    room.localParticipant.videoTracks.forEach(publication => {
        if (isVideoOff) {
            publication.track.enable();
        } else {
            publication.track.disable();
        }
    });
    setIsVideoOff(!isVideoOff);
  };

  return (
    <div className="w-full h-full flex flex-col bg-black rounded-lg overflow-hidden">
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2 p-2">
            {room ? (
                <Participant key={room.localParticipant.sid} participant={room.localParticipant} />
            ) : null}
            {participants.map((participant) => (
                <Participant key={participant.sid} participant={participant} />
            ))}
        </div>
        <div className="bg-gray-800 p-4 flex justify-center items-center gap-4">
            <Button onClick={toggleMute} variant={isMuted ? "destructive" : "secondary"} size="icon" className="rounded-full">
                {isMuted ? <MicOff /> : <Mic />}
            </Button>
            <Button onClick={toggleVideo} variant={isVideoOff ? "destructive" : "secondary"} size="icon" className="rounded-full">
                {isVideoOff ? <VideoOff /> : <VideoIcon />}
            </Button>
            <Button onClick={handleLeaveRoom} variant="destructive" size="icon" className="rounded-full">
                <PhoneOff />
            </Button>
        </div>
    </div>
  );
};

export default VideoRoom;
