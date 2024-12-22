import React from 'react';

const ProgressSummary = ({ answers, total }) => {
    // Calculate statistics
    const attempted = Object.keys(answers).length;
    const correct = Object.values(answers).filter(a => a.isCorrect).length;
    const incorrect = attempted - correct;
    const remaining = total - attempted;

    return (
        <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
            <h3 className="text-lg font-semibold mb-3">Progress Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{attempted}</div>
                    <div className="text-sm text-blue-600">Attempted</div>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{correct}</div>
                    <div className="text-sm text-green-600">Correct</div>
                </div>
                <div className="p-3 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">{incorrect}</div>
                    <div className="text-sm text-red-600">Incorrect</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-600">{remaining}</div>
                    <div className="text-sm text-gray-600">Remaining</div>
                </div>
            </div>

            <div className="mt-4 bg-gray-100 rounded-full h-2">
                <div
                    className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-green-500"
                    style={{ width: `${(attempted / total) * 100}%` }}
                />
            </div>
            <div className="text-sm text-gray-500 mt-2 text-center">
                {((attempted / total) * 100).toFixed(1)}% Complete
            </div>
        </div>
    );
};

export default ProgressSummary;