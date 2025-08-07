import { useEffect, useState } from 'react';
import consumer from '../channels/consumer';

interface Message {
    id: string;
    message: string;
    timestamp: Date;
}

export const useActionCable = (room: number) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isConnected, setIsConnected] = useState<boolean>(false);

    useEffect(() => {
        if (room === 0) return; // Don't connect until room is set

        const roomChannel = consumer.subscriptions.create(
            { channel: "RoomChannel", room: `room_${room}` },
            {
                received(data: any) {
                    console.log("Received message:", data);
                    const newMessage: Message = {
                        id: Date.now().toString(),
                        message: data.message,
                        timestamp: new Date()
                    };
                    setMessages(prevMessages => [...prevMessages, newMessage]);
                },
                connected() {
                    console.log(`Connected to RoomChannel with ID: room_${room}`);
                    setIsConnected(true);
                },
                disconnected() {
                    console.log(`Disconnected from RoomChannel with ID: room_${room}`);
                    setIsConnected(false);
                }
            }
        );

        return () => {
            roomChannel.unsubscribe();
        };
    }, [room]);

    return { messages, isConnected };
};