import React from 'react';
import '../../styles/variables.css';
import '../../styles/HomePage.css';

interface WhisperSectionProps {
  title?: string;
  isLoading: boolean;
  disableButton?: boolean;
  questionPart: string;
  answerPart: string;
  showQuestionPart: boolean;
  showAnswerPart: boolean;
  onWhisperClick: () => void;
  children?: React.ReactNode;
}

const WhisperSection: React.FC<WhisperSectionProps> = ({
  isLoading,
  disableButton = false,
  questionPart,
  answerPart,
  showQuestionPart,
  showAnswerPart,
  onWhisperClick,
  children
}) => {
  return (
    <>
      {/* Static content fixed at top */}
      <div className="static-content">

        <button
          id="whisper-btn"
          className="whisper-button"
          onClick={onWhisperClick}
          disabled={isLoading || disableButton}
          style={{
            opacity: (isLoading || disableButton) ? 0.7 : 1,
            transform: (isLoading || disableButton) ? 'scale(0.98)' : 'scale(1)'
          }}
        >
          {(isLoading || disableButton) ? 'Whispering...' : 'Whisper'}
        </button>
      </div>
      
      {/* Dynamic content container positioned below static content */}
      <div className="dynamic-content">
        {/* Question Part */}
        {showQuestionPart && (
          <div
            id="question-part"
            className="message-part question-part"
          >
            <p className="message-text">
              {questionPart}
            </p>
          </div>
        )}

        {/* Answer Part */}
        {showAnswerPart && (
          <div
            id="answer-part"
            className="message-part answer-part"
          >
            <p className="message-text">
              {answerPart}
            </p>
            {children}
          </div>
        )}
      </div>
    </>
  );
};

export default WhisperSection;