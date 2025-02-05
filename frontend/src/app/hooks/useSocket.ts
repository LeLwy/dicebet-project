import { useEffect, useRef } from 'react';

const useSocket = (url: string, onMessage: (event: MessageEvent) => void) => {
    const socket = useRef<WebSocket | null>(null);

    useEffect(() => {
        socket.current = new WebSocket(url);

        socket.current.onopen = () => {
            console.log('WebSocket connection opened');
        };

        socket.current.onmessage = (event: MessageEvent) => {
            onMessage(event);
        };

        socket.current.onerror = (error: Event) => {
            console.error('WebSocket error:', error);
        };

        socket.current.onclose = () => {
            console.log('WebSocket connection closed');
        };

        return () => {
            if (socket.current) {
                socket.current.close();
            }
        };
    }, [url, onMessage]);

    return socket.current;
};

export default useSocket;