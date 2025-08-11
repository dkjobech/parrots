import React from 'react';
import { Link } from "react-router-dom";
import { useMessageProcessor } from '../../hooks/useMessageProcessor';
import '../../styles/variables.css';
import '../../styles/HomePage.css';
import WhisperSection from '../shared/WhisperSection';

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
            <WhisperSection
                isLoading={isLoading}
                questionPart={questionPart}
                answerPart={answerPart}
                showQuestionPart={showQuestionPart}
                showAnswerPart={showAnswerPart}
                onWhisperClick={handleWhisperClick}
            >
                <br /><br /><br />
                <p className="info-text">
                    Just like parrots, there's a little more to this demo than meets the eye. <Link className={'details-link'} to="/details">
                    Details
                    </Link>
                </p>
            </WhisperSection>
        </div>
    );
};

export default HomePage;