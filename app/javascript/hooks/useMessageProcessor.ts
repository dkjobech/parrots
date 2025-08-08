import { useState, useEffect } from 'react';
import { useActionCable } from './useActionCable';

interface MessageProcessorOptions {
  initialDelay?: number;
  room?: number;
}

interface MessageParts {
  questionPart: string;
  answerPart: string;
  showQuestionPart: boolean;
  showAnswerPart: boolean;
}

export const useMessageProcessor = (options: MessageProcessorOptions = {}) => {
  const { initialDelay = 3000, room: initialRoom } = options;
  
  const [room, setRoom] = useState<number>(initialRoom || 0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [questionPart, setQuestionPart] = useState<string>('');
  const [answerPart, setAnswerPart] = useState<string>('');
  const [showQuestionPart, setShowQuestionPart] = useState<boolean>(false);
  const [showAnswerPart, setShowAnswerPart] = useState<boolean>(false);

  // Use the ActionCable hook
  const { messages } = useActionCable(room);

  // Initialize room number only if not provided
  useEffect(() => {
    if (!initialRoom) {
      setRoom(Math.floor(Math.random() * 100));
    }
  }, [initialRoom]);

  // Process incoming messages
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
        }, initialDelay);
        
        setIsLoading(false);
      }
    }
  }, [messages, initialDelay]);

  const resetMessage = () => {
    setShowQuestionPart(false);
    setShowAnswerPart(false);
    setQuestionPart('');
    setAnswerPart('');
  };

  const sendRequest = async (delay: number = 0): Promise<void> => {
    // Clear previous message
    resetMessage();

    // Show loading state
    setIsLoading(true);

    try {
      const response = await fetch('/queue', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': (window as any).csrfToken || ''
        },
        body: JSON.stringify({ room: room, delay })
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

  return {
    room,
    isLoading,
    questionPart,
    answerPart,
    showQuestionPart,
    showAnswerPart,
    sendRequest,
    resetMessage
  };
};