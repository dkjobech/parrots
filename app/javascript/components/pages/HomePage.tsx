import React, { useState, useEffect } from 'react';
import { useActionCable } from '../../hooks/useActionCable';

interface ArchitectureStep {
    id: string;
    name: string;
    icon: string;
    isActive: boolean;
    isCompleted: boolean;
}

const HomePage: React.FC = () => {
    const [room, setRoom] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [jokeResponse, setJokeResponse] = useState<string>('');
    const [showJoke, setShowJoke] = useState<boolean>(false);

    const [architectureSteps, setArchitectureSteps] = useState<ArchitectureStep[]>([
        { id: 'web', name: 'Web Request', icon: '🌐', isActive: false, isCompleted: false },
        { id: 'queue', name: 'Queue Job', icon: '📬', isActive: false, isCompleted: false },
        { id: 'worker', name: 'Worker Process', icon: '⚙️', isActive: false, isCompleted: false },
        { id: 'llm', name: 'LLM Request', icon: '🤖', isActive: false, isCompleted: false },
        { id: 'sockets', name: 'WebSocket Update', icon: '⚡', isActive: false, isCompleted: false }
    ]);

    // Use the ActionCable hook
    const { messages, isConnected } = useActionCable(room);

    useEffect(() => {
        // Generate random room number like in Rails controller
        setRoom(Math.floor(Math.random() * 100));
    }, []);

    // Handle incoming messages and update architecture visualization
    useEffect(() => {
        if (messages.length > 0) {
            const lastMessage = messages[messages.length - 1];

            setArchitectureSteps(prevSteps => {
                return prevSteps.map(step => {
                    // Reset all to inactive first
                    const updatedStep = { ...step, isActive: false };

                    // Determine which step should be highlighted based on message ID
                    switch (lastMessage.id) {
                        case "1": // Web request initiated
                            if (step.id === 'web') {
                                updatedStep.isActive = true;
                            }
                            break;
                        case "2": // Job queued
                            if (step.id === 'queue') {
                                updatedStep.isActive = true;
                            }
                            if (step.id === 'web') {
                                updatedStep.isCompleted = true;
                            }
                            break;
                        case "3": // Worker processing
                            if (step.id === 'worker') {
                                updatedStep.isActive = true;
                            }
                            if (step.id === 'queue') {
                                updatedStep.isCompleted = true;
                            }
                            break;
                        case "4": // LLM request - worker stays active
                            if (step.id === 'llm') {
                                updatedStep.isActive = true;
                            }
                            if (step.id === 'worker') {
                                updatedStep.isActive = true; // Worker stays active during LLM
                            }
                            break;
                        case "5": // LLM response received - worker still active, sockets active
                            if (step.id === 'sockets') {
                                updatedStep.isActive = true;
                            }
                            if (step.id === 'worker') {
                                updatedStep.isActive = true; // Worker stays active during sockets
                            }
                            if (step.id === 'llm') {
                                updatedStep.isCompleted = true;
                            }
                            break;
                        case "6": // Final response - everything completes
                            setJokeResponse(lastMessage.message);
                            setShowJoke(true);
                            updatedStep.isCompleted = true;
                            updatedStep.isActive = false;
                            break;
                    }

                    return updatedStep;
                });
            });
        }
    }, [messages]);

    const resetArchitecture = () => {
        setArchitectureSteps(prevSteps =>
            prevSteps.map(step => ({
                ...step,
                isActive: false,
                isCompleted: false
            }))
        );
    };

    const handleWhisperClick = async (): Promise<void> => {
        // Reset architecture visualization
        resetArchitecture();

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
//            setJokeResponse(data.joke);
//            setShowJoke(true);
        } catch (error) {
            console.error('Error:', error);
            setJokeResponse(`Error getting joke: ${error instanceof Error ? error.message : 'Unknown error'}`);
            setShowJoke(true);
        } finally {
            setIsLoading(false);
        }
    };

    const getStepStyle = (step: ArchitectureStep) => {
        let backgroundColor = '#f8f9fa';
        let borderColor = '#dee2e6';
        let color = '#6c757d';

        if (step.isActive) {
            backgroundColor = '#007bff';
            borderColor = '#0056b3';
            color = 'white';
        } else if (step.isCompleted) {
            backgroundColor = '#28a745';
            borderColor = '#1e7e34';
            color = 'white';
        }

        return {
            backgroundColor,
            borderColor,
            color,
            border: `2px solid ${borderColor}`,
            borderRadius: '10px',
            padding: '20px',
            margin: '10px',
            minWidth: '150px',
            textAlign: 'center' as const,
            transition: 'all 0.3s ease',
            boxShadow: step.isActive ? '0 0 20px rgba(0,123,255,0.5)' : 'none'
        };
    };

    const mainFlowSteps = architectureSteps.filter(step =>
        ['web', 'queue', 'worker', 'sockets'].includes(step.id)
    );
    const llmStep = architectureSteps.find(step => step.id === 'llm');

    return (
        <>
            <h1>Architecture Flow Visualization - Room {room}</h1>
            {isConnected && <small className="text-success">✓ Connected to ActionCable</small>}

            <button
                id="whisper-btn"
                className="btn btn-primary"
                onClick={handleWhisperClick}
                disabled={isLoading}
                style={{ marginBottom: '30px' }}
            >
                {isLoading ? 'Processing...' : 'Start Process'}
            </button>

            {/* Architecture Diagram */}
            <div style={{
                border: '2px solid #ddd',
                borderRadius: '15px',
                padding: '30px',
                backgroundColor: '#ffffff',
                marginBottom: '20px'
            }}>
                <h3 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>
                    Application Architecture Flow
                </h3>

                {/* Main horizontal flow */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    marginBottom: '30px'
                }}>
                    {mainFlowSteps.map((step, index) => (
                        <React.Fragment key={step.id}>
                            <div style={getStepStyle(step)}>
                                <div style={{ fontSize: '2em', marginBottom: '10px' }}>
                                    {step.icon}
                                </div>
                                <div style={{ fontWeight: 'bold', fontSize: '14px' }}>
                                    {step.name}
                                </div>
                                {step.isCompleted && (
                                    <div style={{ marginTop: '5px', fontSize: '12px' }}>
                                        ✅ Complete
                                    </div>
                                )}
                                {step.isActive && (
                                    <div style={{ marginTop: '5px', fontSize: '12px' }}>
                                        🔄 Processing
                                    </div>
                                )}
                            </div>

                            {index < mainFlowSteps.length - 1 && (
                                <div style={{
                                    fontSize: '2em',
                                    color: '#6c757d',
                                    margin: '0 10px'
                                }}>
                                    →
                                </div>
                            )}
                        </React.Fragment>
                    ))}
                </div>

                {/* LLM step below worker - with connection lines */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    position: 'relative'
                }}>
                    {/* Vertical line down from worker */}
                    <div style={{
                        width: '2px',
                        height: '30px',
                        backgroundColor: '#6c757d',
                        marginBottom: '10px'
                    }}></div>

                    {/* Down arrow */}
                    <div style={{
                        fontSize: '2em',
                        color: '#6c757d',
                        marginBottom: '10px'
                    }}>
                        ↓
                    </div>

                    {/* LLM Box */}
                    {llmStep && (
                        <div style={{
                            ...getStepStyle(llmStep),
                            marginBottom: '10px'
                        }}>
                            <div style={{ fontSize: '2em', marginBottom: '10px' }}>
                                {llmStep.icon}
                            </div>
                            <div style={{ fontWeight: 'bold', fontSize: '14px' }}>
                                {llmStep.name}
                            </div>
                            {llmStep.isCompleted && (
                                <div style={{ marginTop: '5px', fontSize: '12px' }}>
                                    ✅ Complete
                                </div>
                            )}
                            {llmStep.isActive && (
                                <div style={{ marginTop: '5px', fontSize: '12px' }}>
                                    🔄 Processing
                                </div>
                            )}
                        </div>
                    )}

                    {/* Up arrow */}
                    <div style={{
                        fontSize: '2em',
                        color: '#6c757d',
                        marginTop: '10px'
                    }}>
                        ↑
                    </div>

                    {/* Vertical line back up to worker */}
                    <div style={{
                        width: '2px',
                        height: '30px',
                        backgroundColor: '#6c757d',
                        marginTop: '10px'
                    }}></div>
                </div>

                {/* Flow description */}
                <div style={{
                    textAlign: 'center',
                    marginTop: '20px',
                    fontSize: '12px',
                    color: '#6c757d'
                }}>
                    <p>Worker orchestrates the LLM request and maintains connection throughout the process</p>
                </div>
            </div>

            {/* Legend */}
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                marginBottom: '20px',
                gap: '20px'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <div style={{
                        width: '20px',
                        height: '20px',
                        backgroundColor: '#f8f9fa',
                        border: '2px solid #dee2e6',
                        borderRadius: '3px'
                    }}></div>
                    <span style={{ fontSize: '12px' }}>Waiting</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <div style={{
                        width: '20px',
                        height: '20px',
                        backgroundColor: '#007bff',
                        border: '2px solid #0056b3',
                        borderRadius: '3px'
                    }}></div>
                    <span style={{ fontSize: '12px' }}>Active</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <div style={{
                        width: '20px',
                        height: '20px',
                        backgroundColor: '#28a745',
                        border: '2px solid #1e7e34',
                        borderRadius: '3px'
                    }}></div>
                    <span style={{ fontSize: '12px' }}>Completed</span>
                </div>
            </div>

            {/* Final Result */}
            {showJoke && (
                <div
                    id="joke-response"
                    style={{
                        marginTop: '20px',
                        padding: '20px',
                        border: '2px solid #28a745',
                        backgroundColor: '#d4edda',
                        borderRadius: '10px',
                        textAlign: 'center'
                    }}
                >
                    <h4>🎉 Final Result:</h4>
                    <p>{jokeResponse}</p>
                </div>
            )}

            {/* Debug Messages (hidden by default, uncomment to see raw messages) */}
            {/*
            <div style={{ marginTop: '20px', fontSize: '12px', color: '#6c757d' }}>
                <h5>Debug Messages:</h5>
                {messages.map((message) => (
                    <div key={message.id} style={{ marginBottom: '5px' }}>
                        [ID: {message.id}] {message.message}
                    </div>
                ))}
            </div>
            */}
        </>
    );
};

export default HomePage;