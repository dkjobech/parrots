import React from 'react';
import { Link } from "react-router-dom";
import { useMessageProcessor } from '../../hooks/useMessageProcessor';
import appleStyles from '../../styles/appleStyles';
import '../../styles/variables.css';
import '../../styles/HomePage.css';

const HomePage: React.FC = () => {
    const {
        room,
        isLoading,
        questionPart,
        answerPart,
        showQuestionPart,
        showAnswerPart,
        sendRequest
    } = useMessageProcessor();

    const handleWhisperClick = () => {
        sendRequest(0);
    };

    return (
        <div className="home-container">
            {/* Static content fixed at top */}
            <div className="static-content">
                <h1 className="page-title">
                    Want to whisper to a parrot?
                </h1>

                <button
                    id="whisper-btn"
                    className="whisper-button"
                    onClick={handleWhisperClick}
                    disabled={isLoading}
                    style={{
                        opacity: isLoading ? 0.7 : 1,
                        transform: isLoading ? 'scale(0.98)' : 'scale(1)'
                    }}
                >
                    {isLoading ? 'Whispering...' : 'Whisper'}
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
                        <br /><br /><br />
                        <p className="info-text">
                            * just like parrots, this demo is a little more complicated than it looks. <Link className={'details-link'} to="/details">
                            Details
                        </Link>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HomePage;