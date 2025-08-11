import { useState, useEffect } from 'react';
import { useActionCable } from './useActionCable';

interface ArchitectureStep {
  id: string;
  name: string;
  icon: string;
  isActive: boolean;
  isCompleted: boolean;
}

interface UseArchitectureFlowOptions {
  room?: number;
}

export const useArchitectureFlow = (options: UseArchitectureFlowOptions = {}) => {
  const { room: initialRoom } = options;
  
  const [room, setRoom] = useState<number>(initialRoom || 0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [jokeResponse, setJokeResponse] = useState<string>('');
  const [showJoke, setShowJoke] = useState<boolean>(false);

  const [architectureSteps, setArchitectureSteps] = useState<ArchitectureStep[]>([
    { id: 'web', name: 'Web Request', icon: 'Web', isActive: false, isCompleted: false },
    { id: 'queue', name: 'Queue Job', icon: 'Queue', isActive: false, isCompleted: false },
    { id: 'worker', name: 'Worker Process', icon: 'Worker', isActive: false, isCompleted: false },
    { id: 'llm', name: 'LLM Request', icon: 'LLM', isActive: false, isCompleted: false },
    { id: 'sockets', name: 'WebSocket', icon: 'Socket', isActive: false, isCompleted: false }
  ]);

  // Use the ActionCable hook
  const { messages, isConnected } = useActionCable(room);

  useEffect(() => {
    // Only generate a random room number if one wasn't provided
    if (!initialRoom) {
      setRoom(Math.floor(Math.random() * 100));
    }
  }, [initialRoom]);

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

  const startProcess = async (): Promise<void> => {
    // Reset architecture visualization
    resetArchitecture();

    // Clear all responses
    setShowJoke(false);
    setJokeResponse('');

    // Show loading state
    setIsLoading(true);
  };

  return {
    room,
    isLoading,
    jokeResponse,
    showJoke,
    architectureSteps,
    isConnected,
    startProcess,
    resetArchitecture
  };
};