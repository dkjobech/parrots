import React, { useState, useEffect } from 'react';
import { useActionCable } from '../../hooks/useActionCable';

const HomePage: React.FC = () => {
    const [room, setRoom] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [jokeResponse, setJokeResponse] = useState<string>('');
    const [showJoke, setShowJoke] = useState<boolean>(false);

    // Use the ActionCable hook
    const { messages, isConnected } = useActionCable(room);

    useEffect(() => {
        // Generate random room number like in Rails controller
        setRoom(Math.floor(Math.random() * 100));
    }, []);

    const handleWhisperClick = async (): Promise<void> => {
        // Clear all responses
        setShowJoke(false);
        setJokeResponse('');

        // Show loading state
        setIsLoading(true);

        try {
            const response = await fetch('/queue', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': (window as any).csrfToken || ''
                },
                body: JSON.stringify({ room: room })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setJokeResponse(data.joke);
            setShowJoke(true);
        } catch (error) {
            console.error('Error:', error);
            setJokeResponse(`Error getting joke: ${error instanceof Error ? error.message : 'Unknown error'}`);
            setShowJoke(true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <h1>Welcome to Room {room}</h1>
            {isConnected && <small className="text-success">✓ Connected to ActionCable</small>}

            <button
                id="whisper-btn"
                className="btn btn-primary"
                onClick={handleWhisperClick}
                disabled={isLoading}
            >
                {isLoading ? 'Getting joke...' : 'Whisper'}
            </button>

            {showJoke && (
                <div
                    id="joke-response"
                    style={{
                        marginTop: '20px',
                        padding: '10px',
                        border: '1px solid #ccc',
                        backgroundColor: '#f9f9f9'
                    }}
                >
                    {jokeResponse}
                </div>
            )}

            <div
                id="messages"
                style={{ marginTop: '20px' }}
            >
                {messages.map((message) => (
                    <div
                        key={message.id}
                        style={{
                            marginBottom: '10px',
                            padding: '10px',
                            border: '1px solid #ddd',
                            backgroundColor: '#e9ecef',
                            borderRadius: '5px'
                        }}
                    >
                        {message.message}
                    </div>
                ))}
            </div>
        </>
    );
};

export default HomePage;