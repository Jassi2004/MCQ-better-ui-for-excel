import React, { useState, useEffect } from "react";
import QuestionNavigator from "./QuestionNavigator";
import { Bookmark, BookmarkX } from "lucide-react";

const MCQCard = ({
    question,
    currentIndex,
    total,
    nextQuestion,
    prevQuestion,
    onNavigate,
    onAnswer,
    answer,
    isMarked,
    onToggleMark
}) => {
    const [fadeIn, setFadeIn] = useState(true);

    useEffect(() => {
        setFadeIn(true);
        return () => setFadeIn(false);
    }, [currentIndex]);

    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.target.tagName === 'INPUT') return;

            const optionKeys = {
                '1': 'Option_1',
                '2': 'Option_2',
                '3': 'Option_3',
                '4': 'Option_4',
                'a': 'Option_1',
                'b': 'Option_2',
                'c': 'Option_3',
                'd': 'Option_4'
            };

            if (!answer && optionKeys[e.key]) {
                handleOptionClick(question[optionKeys[e.key]]);
            } else if (e.key === 'Enter') {
                if (answer && currentIndex < total - 1) {
                    nextQuestion();
                }
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [answer, currentIndex, question, nextQuestion, total]);

    const handleOptionClick = (selectedOption) => {
        onAnswer(selectedOption);
    };

    const isAnswerRevealed = answer !== undefined;
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
                <div className="question-nav-wrapper">
                    <div className="question-header">
                        <h2>Question {currentIndex + 1} of {total}</h2>
                        <button
                            onClick={onToggleMark}
                            className="mark-button"
                            title={isMarked ? "Unmark question" : "Mark question for review"}
                        >
                            {isMarked ? (
                                <BookmarkX className="text-blue-600" size={20} />
                            ) : (
                                <Bookmark className="text-gray-400" size={20} />
                            )}
                        </button>
                    </div>
                    <QuestionNavigator
                        total={total}
                        currentIndex={currentIndex}
                        onNavigate={onNavigate}
                    />
                </div>
                <div className="metadata">
                    <div className="metadata-item">
                        <strong>Topic: <span>{question.Topic}</span></strong>
                    </div>
                    <div className="metadata-item">
                        <strong>Sub-Topic: <span>{question.Sub_Topic}</span></strong>
                    </div>
                    <div className="metadata-item">
                        <strong>Level: <span>{question.Level}</span></strong>
                    </div>
                </div>
            </div>

            <div className="question-section">
                <h3>{question.Question_Statement}</h3>
                <div className="options">
                    {["Option_1", "Option_2", "Option_3", "Option_4"].map((key, index) => {
                        const isCorrect = question.Correct_Answer === question[key];
                        const isSelected = answer?.selected === question[key];
                        const keyHint = `(${index + 1}/${String.fromCharCode(97 + index)})`;
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
                                <span className="key-hint">{keyHint}</span> {question[key]}
                            </button>
                        );
                    })}
                </div>
            </div>

            {isAnswerRevealed && (
                <div className="answer">
                    {answer.isCorrect ? (
                        <span className="correct-msg">✨ Excellent! That's correct!</span>
                    ) : (
                        <span className="incorrect-msg">
                            The correct answer is <strong>{question.Correct_Answer}</strong>
                        </span>
                    )}
                    <p className="text-sm text-gray-500">Press Enter to go to next question</p>
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