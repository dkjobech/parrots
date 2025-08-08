import React, { useState, useEffect } from 'react';
import { useActionCable } from '../../hooks/useActionCable';
import appleStyles from '../../styles/appleStyles';
import {Link} from "react-router-dom";

const HomePage: React.FC = () => {
    const [room, setRoom] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [questionPart, setQuestionPart] = useState<string>('');
    const [answerPart, setAnswerPart] = useState<string>('');
    const [showQuestionPart, setShowQuestionPart] = useState<boolean>(false);
    const [showAnswerPart, setShowAnswerPart] = useState<boolean>(false);

    // Use the ActionCable hook
    const { messages } = useActionCable(room);

    useEffect(() => {
        // Generate random room number like in Rails controller
        setRoom(Math.floor(Math.random() * 100));
    }, []);

    // Handle incoming messages and update the final message
    useEffect(() => {
        if (messages.length > 0) {
            const lastMessage = messages[messages.length - 1];
            
            // Only show the final message (id:6)
            if (lastMessage.id === "6") {
                // Split the message at the first question mark
                const parts = lastMessage.message.split('?');
                if (parts.length > 1) {
                    // Add the question mark back to the question part
                    setQuestionPart(parts[0] + '?');
                    setAnswerPart(parts.slice(1).join('?').trim());
                } else {
                    // If there's no question mark, treat the whole message as the question part
                    setQuestionPart(lastMessage.message);
                    setAnswerPart('');
                }
                
                // Show the question part immediately
                setShowQuestionPart(true);
                
                // Show the answer part after a delay
                setTimeout(() => {
                    setShowAnswerPart(true);
                }, 3000);
                
                setIsLoading(false);
            }
        }
    }, [messages]);

    const handleWhisperClick = async (): Promise<void> => {
        // Clear previous message
        setShowQuestionPart(false);
        setShowAnswerPart(false);
        setQuestionPart('');
        setAnswerPart('');

        // Show loading state
        setIsLoading(true);

        try {
            const response = await fetch('/queue', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': (window as any).csrfToken || ''
                },
                body: JSON.stringify({ room: room, delay: 0 })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // The response will come through ActionCable
        } catch (error) {
            console.error('Error:', error);
            setQuestionPart(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
            setShowQuestionPart(true);
            setIsLoading(false);
        }
    };

    return (
        <div style={{ 
            position: 'relative',
            minHeight: '100vh',
            fontFamily: appleStyles.fonts.primary,
            color: appleStyles.colors.text,
            backgroundColor: appleStyles.colors.background,
            padding: '0 20px'
        }}>
            {/* Static content fixed at 300px from top */}
            <div style={{
                position: 'absolute',
                top: '150px',
                left: '0',
                right: '0',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                <h1 style={{
                    fontSize: '32px',
                    fontWeight: 600,
                    marginBottom: '40px',
                    textAlign: 'center',
                    letterSpacing: '-0.5px'
                }}>
                    Want to whisper to a parrot?
                </h1>

                <button
                    id="whisper-btn"
                    onClick={handleWhisperClick}
                    disabled={isLoading}
                    style={{ 
                        marginBottom: '40px',
                        padding: '16px 32px',
                        fontSize: '18px',
                        fontWeight: 600,
                        backgroundColor: appleStyles.colors.primary,
                        color: 'white',
                        border: 'none',
                        borderRadius: appleStyles.borderRadius,
                        cursor: 'pointer',
                        transition: appleStyles.transition,
                        boxShadow: 'none',
                        outline: 'none',
                        opacity: isLoading ? 0.7 : 1,
                        transform: isLoading ? 'scale(0.98)' : 'scale(1)'
                    }}
                >
                    {isLoading ? 'Whispering...' : 'whisper'}
                </button>
            </div>
            
            {/* Dynamic content container positioned below static content */}
            <div style={{
                position: 'absolute',
                top: '350px',
                left: '0',
                right: '0',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                {/* Question Part */}
                {showQuestionPart && (
                    <div
                        id="question-part"
                        style={{
                            width: '100%',
                            maxWidth: '650px',
                            marginTop: '10px',
                            padding: '24px',
                            textAlign: 'center',
                            animation: 'fadeIn 0.3s ease-out'
                        }}
                    >
                        <p style={{ 
                            fontSize: '17px',
                            lineHeight: '1.5',
                            margin: 0,
                            color: appleStyles.colors.text
                        }}>
                            {questionPart}
                        </p>
                    </div>
                )}

                {/* Answer Part */}
                {showAnswerPart && (
                    <div
                        id="answer-part"
                        style={{
                            width: '100%',
                            maxWidth: '650px',
                            marginTop: '10px',
                            padding: '24px',
                            textAlign: 'center',
                            animation: 'fadeInAnswer 0.5s ease-out'
                        }}
                    >
                        <p style={{ 
                            fontSize: '17px',
                            lineHeight: '1.5',
                            margin: 0,
                            color: appleStyles.colors.text
                        }}>
                            {answerPart}
                        </p>
                        <br />
                        <p style={{
                            fontSize: '17px',
                            lineHeight: '1.5',
                            margin: 0,
                            color: appleStyles.colors.text
                        }}>
                            * just like parrots, this demo is a little more complicated than it looks. <Link to="/details">
                            Details
                        </Link>
                        </p>
                    </div>
                )}
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                @keyframes fadeInAnswer {
                    0% { opacity: 0; transform: translateY(10px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default HomePage;