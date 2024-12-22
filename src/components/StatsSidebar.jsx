import React from 'react';
import { X, Menu, BookMarked, CheckCircle, XCircle, Clock, HelpCircle } from 'lucide-react';

const StatsSidebar = ({ isOpen, toggleSidebar, stats, markedQuestions }) => {
    return (
        <>
            {/* Hamburger button - visible on all screen sizes */}
            <button
                onClick={toggleSidebar}
                className="fixed top-4 right-4 z-50 p-2 bg-white rounded-lg shadow-md hover:bg-gray-50"
                aria-label={isOpen ? "Close statistics" : "Open statistics"}
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Overlay - visible when sidebar is open on all screens */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={toggleSidebar}
                />
            )}

            {/* Sidebar - modified to work consistently across all screen sizes */}
            <div className={`
                fixed top-0 right-0 h-full w-80 bg-white shadow-lg z-40 
                transform transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : 'translate-x-full'}
            `}>
                <div className="h-full flex flex-col p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold">Progress Stats</h2>
                        <button
                            onClick={toggleSidebar}
                            className="p-2 hover:bg-gray-100 rounded-lg"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="space-y-4">
                        {/* Total Questions */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center gap-3">
                                <HelpCircle className="text-blue-500" />
                                <div>
                                    <div className="text-2xl font-bold">{stats.total}</div>
                                    <div className="text-sm text-gray-600">Total Questions</div>
                                </div>
                            </div>
                        </div>

                        {/* Attempted */}
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <div className="flex items-center gap-3">
                                <Clock className="text-blue-500" />
                                <div>
                                    <div className="text-2xl font-bold">{stats.attempted}</div>
                                    <div className="text-sm text-blue-600">Attempted</div>
                                </div>
                            </div>
                        </div>

                        {/* Correct */}
                        <div className="bg-green-50 p-4 rounded-lg">
                            <div className="flex items-center gap-3">
                                <CheckCircle className="text-green-500" />
                                <div>
                                    <div className="text-2xl font-bold">{stats.correct}</div>
                                    <div className="text-sm text-green-600">Correct</div>
                                </div>
                            </div>
                        </div>

                        {/* Incorrect */}
                        <div className="bg-red-50 p-4 rounded-lg">
                            <div className="flex items-center gap-3">
                                <XCircle className="text-red-500" />
                                <div>
                                    <div className="text-2xl font-bold">{stats.incorrect}</div>
                                    <div className="text-sm text-red-600">Incorrect</div>
                                </div>
                            </div>
                        </div>

                        {/* Marked for Review */}
                        <div className="bg-yellow-50 p-4 rounded-lg">
                            <div className="flex items-center gap-3">
                                <BookMarked className="text-yellow-500" />
                                <div>
                                    <div className="text-2xl font-bold">{markedQuestions.size}</div>
                                    <div className="text-sm text-yellow-600">Marked for Review</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6">
                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                            <span>Progress</span>
                            <span>{`${stats.attempted} / ${stats.total}`}</span>
                        </div>
                        <div className="w-full h-2 bg-gray-300 rounded-full">
                            <div
                                className="h-2 bg-blue-600 rounded-full"
                                style={{ width: `${(stats.attempted / stats.total) * 100}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default StatsSidebar;