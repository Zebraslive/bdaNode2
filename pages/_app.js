import '../styles/globals.css';
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

let socket;

export default function MyApp({ Component, pageProps }) {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    socket = io();
    socket.on('connect', () => setConnected(true));
    return () => socket.close();
  }, []);

  return <Component {...pageProps} socket={socket} socketConnected={connected} />;
}
