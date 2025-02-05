import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';

@Injectable({
    providedIn: 'root'
})
export class SocketService {
    private socket: Socket;

    constructor() {
        this.socket = io('http://localhost:3000'); // Replace with your server URL
    }

    // Emit an event to the server
    emitEvent(eventName: string, data: unknown): void {
        this.socket.emit(eventName, data);
    }

    // Listen for an event from the server
    onEvent(eventName: string, callback: (data: unknown) => void): void {
        this.socket.on(eventName, callback);
    }

    // Disconnect the socket
    disconnect(): void {
        if (this.socket) {
            this.socket.disconnect();
        }
    }
}