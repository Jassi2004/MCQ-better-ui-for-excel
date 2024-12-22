import React, { useState } from 'react';

const QuestionNavigator = ({ total, currentIndex, onNavigate }) => {
    const [inputValue, setInputValue] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const number = parseInt(inputValue);
        if (number >= 1 && number <= total) {
            onNavigate(number - 1);
            setInputValue('');
        }
    };

    return (
        <div className="question-navigator">
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <input
                    type="number"
                    min="1"
                    max={total}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={`1-${total}`}
                    className="w-20 px-3 py-2 border rounded-lg text-sm"
                />
                <button
                    type="submit"
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                >
                    Go
                </button>
            </form>
        </div>
    );
};

export default QuestionNavigator;