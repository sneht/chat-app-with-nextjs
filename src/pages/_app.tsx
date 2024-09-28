import { useEffect, useState } from 'react';
import { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import io, { Socket } from 'socket.io-client';

// Create a React context for the socket
import { createContext } from 'react';
export const SocketContext = createContext<Socket | null>(null);

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    // Initialize Socket.IO connection
    const socketInstance = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000');
    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <SessionProvider session={session}>
      <SocketContext.Provider value={socket}>
        <Component {...pageProps} />
      </SocketContext.Provider>
    </SessionProvider>
  );
}

export default MyApp;