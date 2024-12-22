import React, { useState, useEffect } from "react";

const MCQCard = ({ question, currentIndex, total, nextQuestion, prevQuestion }) => {
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [revealedQuestions, setRevealedQuestions] = useState({});
    const [fadeIn, setFadeIn] = useState(true);

    useEffect(() => {
        setFadeIn(true);
        return () => setFadeIn(false);
    }, [currentIndex]);

    const handleOptionClick = (selectedOption) => {
        setSelectedAnswers((prev) => ({
            ...prev,
            [currentIndex]: selectedOption,
        }));
        setRevealedQuestions((prev) => ({
            ...prev,
            [currentIndex]: true,
        }));
    };

    const isAnswerRevealed = revealedQuestions[currentIndex] || false;
    const selectedAnswer = selectedAnswers[currentIndex] || null;
    const progressPercentage = ((currentIndex + 1) / total) * 100;

    return (
        <div className={`mcq-card ${fadeIn ? 'fade-in' : ''}`}>
            <div className="progress-bar">
                <div
                    className="progress-fill"
                    style={{ width: `${progressPercentage}%` }}
                />
            </div>

            <div className="header">
                <h2>Question {currentIndex + 1} of {total}</h2>
                <div className="metadata">
                    <div>
                        <strong>Topic</strong>
                        {question.Topic}
                    </div>
                    <div>
                        <strong>Sub-Topic</strong>
                        {question.Sub_Topic}
                    </div>
                    <div>
                        <strong>Level</strong>
                        {question.Level}
                    </div>
                </div>
            </div>

            <div className="question-section">
                <h3>{question.Question_Statement}</h3>
                <div className="options">
                    {["Option_1", "Option_2", "Option_3", "Option_4"].map((key) => {
                        const isCorrect = question.Correct_Answer === question[key];
                        const isSelected = selectedAnswer === question[key];
                        return (
                            <button
                                key={key}
                                className={`option-btn ${isAnswerRevealed
                                        ? isCorrect
                                            ? "correct"
                                            : isSelected
                                                ? "incorrect"
                                                : ""
                                        : ""
                                    }`}
                                onClick={() => handleOptionClick(question[key])}
                                disabled={isAnswerRevealed}
                            >
                                {question[key]}
                            </button>
                        );
                    })}
                </div>
            </div>

            {isAnswerRevealed && (
                <div className="answer">
                    {selectedAnswer === question.Correct_Answer ? (
                        <span className="correct-msg">✨ Excellent! That's correct!</span>
                    ) : (
                        <span className="incorrect-msg">
                            The correct answer is <strong>{question.Correct_Answer}</strong>
                        </span>
                    )}
                </div>
            )}

            <div className="navigation">
                <button
                    onClick={prevQuestion}
                    disabled={currentIndex === 0}
                    className="nav-btn"
                >
                    ← Previous
                </button>
                <button
                    onClick={nextQuestion}
                    disabled={currentIndex === total - 1}
                    className="nav-btn"
                >
                    Next →
                </button>
            </div>
        </div>
    );
};

export default MCQCard;