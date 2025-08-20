import { useEffect, useState } from 'react';
import VideoPlayer from '../../components/VideoPlayer';

export default function Anime({ id, socket }) {
  const [presence, setPresence] = useState(0);

  useEffect(() => {
    if (!socket) return;
    socket.emit('join', `anime-${id}`);
    socket.on('presence', (data) => setPresence(data.count));
  }, [socket, id]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-4">Anime {id}</h1>
      <p className="text-sm text-white/70 mb-2">{presence} watching now</p>
      <VideoPlayer src="https://samplelib.com/lib/preview/mp4/sample-5s.mp4" />
    </div>
  );
}

export async function getServerSideProps({ params }) {
  return { props: { id: params.id } };
}
