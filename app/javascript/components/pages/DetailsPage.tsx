import React from 'react';
import { useArchitectureFlow } from '../../hooks/useArchitectureFlow';
import { useMessageProcessor } from '../../hooks/useMessageProcessor';
import '../../styles/variables.css';
import '../../styles/DetailsPage.css';
import appleStyles from '../../styles/appleStyles';
import { ArchitectureIcon } from '../icons/ArchitectureIcons';

interface ArchitectureStep {
    id: string;
    name: string;
    icon: string;
    isActive: boolean;
    isCompleted: boolean;
}

const DetailsPage: React.FC = () => {
    // Generate a single room number to be used by both hooks
    const [sharedRoom] = React.useState(() => Math.floor(Math.random() * 100));
    // Track whether the final message (ID 6) has been received
    // Initialize to true if this is the first load to allow the button to be clickable initially
    const [finalMessageReceived, setFinalMessageReceived] = React.useState(true);
    
    const {
        isLoading: archIsLoading,
        jokeResponse,
        showJoke,
        architectureSteps,
        isConnected,
        startProcess,
        resetArchitecture
    } = useArchitectureFlow({ room: sharedRoom, delay: 2 });
    
    const {
        isLoading,
        questionPart,
        answerPart,
        showQuestionPart,
        showAnswerPart,
        sendRequest
    } = useMessageProcessor({ room: sharedRoom });

    // Effect to detect when the final message (ID 6) has been received
    React.useEffect(() => {
        if (architectureSteps.every(step => step.isCompleted)) {
            setFinalMessageReceived(true);
        }
    }, [architectureSteps]);

    const handleWhisperClick = () => {
        // Reset the architecture visualization
        resetArchitecture();
        
        // Reset the final message received state
        setFinalMessageReceived(false);
        
        // Start the architecture flow visualization
        // This will make a backend call with a 2-second delay
        startProcess();
    };

    const getStepClassName = (step: ArchitectureStep) => {
        let className = 'step step-waiting';
        
        if (step.isActive) {
            className = 'step step-active';
        } else if (step.isCompleted) {
            className = 'step step-completed';
        }
        
        return className;
    };

    // Filter steps for the main horizontal flow - web request, queue job, worker process, and web socket update
    const mainFlowSteps = architectureSteps.filter(step =>
        ['web', 'queue', 'worker', 'sockets'].includes(step.id)
    );
    // Get the LLM step to position directly below the worker process
    const llmStep = architectureSteps.find(step => step.id === 'llm');

    return (
        <div className="details-container">
            {/* Static content fixed at top - similar to HomePage */}
            <div className="static-content">
                <div className="info-text">
                    <p>
                        This Rails/React application demonstrates production-ish architecture patterns. It uses Docker for local development and AWS Fargate for hosting (deployed with Terraform).
                        <br/><br/>
                        The app mimics high-throughput systems by offloading work to background queues, keeping web responses fast. Worker processes handle long-running LLM API calls, while the UI updates in real-time via WebSockets.
                        <br/><br/> Try the whisper again and see the architecture diagram updated based on socket messages from throughout the process.</p>
                </div>
                
                <h1 className="page-title">
                    Want to whisper to a parrot?
                </h1>

                <button
                    id="whisper-btn"
                    className="whisper-button"
                    onClick={handleWhisperClick}
                    disabled={isLoading || !finalMessageReceived}
                    style={{
                        opacity: (isLoading || !finalMessageReceived) ? 0.7 : 1,
                        transform: (isLoading || !finalMessageReceived) ? 'scale(0.98)' : 'scale(1)'
                    }}
                >
                    {!finalMessageReceived ? 'Whispering...' : 'Whisper'}
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
                    </div>
                )}
            </div>

            {/* Architecture Diagram in the lower half */}
            <div className="architecture-section">

                <div className="architecture-container">
                    {/* Main horizontal flow - all steps on one line */}
                    <div className="main-flow">
                        {mainFlowSteps.map((step, index) => (
                            <React.Fragment key={step.id}>
                                <div className={getStepClassName(step)}>
                                    <div className="step-icon">
                                        <ArchitectureIcon iconName={step.icon} color={step.isActive || step.isCompleted ? "white" : "#86868b"} size={20} />
                                    </div>
                                    <div className="step-name">
                                        {step.name}
                                    </div>
                                    {step.isCompleted && (
                                        <div className="step-status">
                                            <span className="status-icon completed-icon"></span>
                                            <span>Complete</span>
                                        </div>
                                    )}
                                    {step.isActive && (
                                        <div className="step-status">
                                            <span className="status-icon active-icon"></span>
                                            <span>Processing</span>
                                        </div>
                                    )}
                                </div>

                                {index < mainFlowSteps.length - 1 && (
                                    <div className="arrow">
                                        →
                                    </div>
                                )}
                                
                                {/* Only add the worker-llm-connection when this is the worker step */}
                                {step.id === 'worker' && (
                                    <div className="vertical-flow worker-llm-connection">

                                        {/* Down arrow */}
                                        <div className="arrow">
                                            ↓
                                        </div>
                                        
                                        {/* LLM Box */}
                                        {llmStep && (
                                            <div className={`llm-step ${getStepClassName(llmStep)}`}>
                                                <div className="step-icon">
                                                    <ArchitectureIcon iconName={llmStep.icon} color={llmStep.isActive || llmStep.isCompleted ? "white" : "#86868b"} size={20} />
                                                </div>
                                                <div className="step-name">
                                                    {llmStep.name}
                                                </div>
                                                {llmStep.isCompleted && (
                                                    <div className="step-status">
                                                        <span className="status-icon completed-icon"></span>
                                                        <span>Complete</span>
                                                    </div>
                                                )}
                                                {llmStep.isActive && (
                                                    <div className="step-status">
                                                        <span className="status-icon active-icon"></span>
                                                        <span>Processing</span>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        
                                    </div>
                                )}
                            </React.Fragment>
                        ))}
                    </div>


                </div>

                {/* Legend */}
                <div className="legend">
                    <div className="legend-item">
                        <div className="legend-color legend-waiting"></div>
                        <span className="legend-label">Waiting</span>
                    </div>
                    <div className="legend-item">
                        <div className="legend-color legend-active"></div>
                        <span className="legend-label">Active</span>
                    </div>
                    <div className="legend-item">
                        <div className="legend-color legend-completed"></div>
                        <span className="legend-label">Completed</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailsPage;