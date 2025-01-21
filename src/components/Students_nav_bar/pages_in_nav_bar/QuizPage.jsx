import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './QuizPage.css';

const QuizPage = () => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedOptions, setSelectedOptions] = useState({});
    const [showConfirmationPopup, setShowConfirmationPopup] = useState(false);
    const [showExitPopup, setShowExitPopup] = useState(false);
    const [timer, setTimer] = useState(30 * 60); // 30 minutes in seconds
    const navigate = useNavigate();
    const location = useLocation();
    const { courseName } = location.state || { courseName: 'Unknown Course' };

    const questions = [
        {
            question: 'What is 2 + 2?',
            options: ['1', '2', '3', '4'],
            correct: 3,
        },
        {
            question: 'What is the capital of France?',
            options: ['Berlin', 'Madrid', 'Paris', 'Rome'],
            correct: 2,
        },
    ];

    useEffect(() => {
        if (timer <= 0) {
            handleSubmit(); // Auto-submit when timer expires
            return;
        }
        const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
        return () => clearInterval(interval);
    }, [timer]);

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds
            .toString()
            .padStart(2, '0')}`;
    };

    const handleOptionClick = (index) => {
        setSelectedOptions((prev) => ({
            ...prev,
            [currentQuestion]: index,
        }));
    };

    const handleNext = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
        }
    };

    const handleSubmit = () => {
        setShowConfirmationPopup(true);
    };

    const handleConfirmSubmit = () => {
        setShowConfirmationPopup(false);
        navigate('/courses');
    };

    const handleCancelSubmit = () => {
        setShowConfirmationPopup(false);
    };

    const confirmExit = () => {
        setShowExitPopup(false);
        navigate('/courses');
    };

    const cancelExit = () => {
        setShowExitPopup(false);
    };

    const onPopStateHandler = () => {
        setShowExitPopup(true);
    };

    useEffect(() => {
        window.history.pushState(null, '', window.location.href); // Ensure the current state is pushed
        window.addEventListener('popstate', onPopStateHandler);
        return () => {
            window.removeEventListener('popstate', onPopStateHandler);
        };
    }, []);

    return (
        <div className="quiz-page">
            <header className="quiz-header">
                <h1>Quiz: {courseName}</h1>
                <div className="timer">Time Remaining: {formatTime(timer)}</div>
            </header>
            <main className="quiz-main">
                <div className="quiz-question">
                    <h2>{questions[currentQuestion].question}</h2>
                </div>
                <div className="quiz-options">
                    {questions[currentQuestion].options.map((option, index) => (
                        <div key={index} className="quiz-option">
                            <input
                                type="radio"
                                id={`option-${index}`}
                                name={`question-${currentQuestion}`}
                                value={index}
                                checked={selectedOptions[currentQuestion] === index}
                                onChange={() => handleOptionClick(index)}
                            />
                            <label htmlFor={`option-${index}`}>{option}</label>
                        </div>
                    ))}
                </div>
            </main>
            <footer className="quiz-footer">
                <button
                    className="control-button"
                    onClick={handlePrevious}
                    disabled={currentQuestion === 0}
                >
                    Previous
                </button>
                {currentQuestion < questions.length - 1 ? (
                    <button className="control-button" onClick={handleNext}>
                        Next
                    </button>
                ) : (
                    <button className="submit-button" onClick={handleSubmit}>
                        Submit
                    </button>
                )}
            </footer>

            {showConfirmationPopup && (
                <div className="popup-overlay">
                    <div className="popup-container">
                        <h2>Confirm Submission</h2>
                        <p>Are you sure you want to submit your answers?</p>
                        <div className="popup-actions">
                            <button
                                className="confirm-button"
                                onClick={handleConfirmSubmit}
                            >
                                Yes, Submit
                            </button>
                            <button
                                className="cancel-button"
                                onClick={handleCancelSubmit}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showExitPopup && (
                <div className="popup-overlay">
                    <div className="popup-container">
                        <h2>Confirm Exit</h2>
                        <p>Are you sure you want to exit the quiz? Your progress might be lost.</p>
                        <div className="popup-actions">
                            <button className="confirm-button" onClick={confirmExit}>
                                Yes, Exit
                            </button>
                            <button className="cancel-button" onClick={cancelExit}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuizPage;
