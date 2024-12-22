import React, { useState, useEffect } from "react";
import { read, utils } from "xlsx";
import MCQCard from "./components/MCQCard";
import Footer from "./components/Footer";
import ProgressSummary from "./components/ProgressSummary";
import { Analytics } from "@vercel/analytics/react";
import StatsSidebar from "./components/StatsSidebar";

const App = () => {
  const [fileData, setFileData] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [answers, setAnswers] = useState({});
  const [markedQuestions, setMarkedQuestions] = useState(new Set());
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);


  // Load saved data from localStorage
  useEffect(() => {
    const storedFile = localStorage.getItem("mcqFile");
    const storedAnswers = localStorage.getItem("mcqAnswers");
    const storedMarked = localStorage.getItem("mcqMarked");

    if (storedFile) {
      setFileData(JSON.parse(storedFile));
    }
    if (storedAnswers) {
      setAnswers(JSON.parse(storedAnswers));
    }
    if (storedMarked) {
      setMarkedQuestions(new Set(JSON.parse(storedMarked)));
    }
  }, []);

  // Save answers to localStorage whenever they change
  useEffect(() => {
    if (Object.keys(answers).length > 0) {
      localStorage.setItem("mcqAnswers", JSON.stringify(answers));
    }
  }, [answers]);

  // Save marked questions to localStorage
  useEffect(() => {
    localStorage.setItem("mcqMarked", JSON.stringify([...markedQuestions]));
  }, [markedQuestions]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.target.tagName === 'INPUT') return; // Don't handle if user is typing in an input

      switch (e.key) {
        case 'ArrowRight':
          if (currentIndex < fileData.length - 1) nextQuestion();
          break;
        case 'ArrowLeft':
          if (currentIndex > 0) prevQuestion();
          break;
        case 'm':
          toggleMarkQuestion(currentIndex);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentIndex, fileData.length]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const processFile = async (file) => {
    setLoading(true);
    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = read(data, { type: "binary" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const json = utils.sheet_to_json(sheet);
        setFileData(json);
        localStorage.setItem("mcqFile", JSON.stringify(json));
        setLoading(false);
      };
      reader.readAsBinaryString(file);
    } catch (error) {
      console.error("Error processing file:", error);
      setLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && (file.name.endsWith('.xlsx') || file.name.endsWith('.xls'))) {
      setSelectedFile(file);
      processFile(file);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      processFile(file);
    }
  };

  const handleClearFile = () => {
    if (window.confirm("This will clear all your progress. Are you sure?")) {
      setFileData([]);
      setSelectedFile(null);
      setCurrentIndex(0);
      setAnswers({});
      setMarkedQuestions(new Set());
      localStorage.removeItem("mcqFile");
      localStorage.removeItem("mcqAnswers");
      localStorage.removeItem("mcqMarked");
    }
  };

  const nextQuestion = () => {
    if (currentIndex < fileData.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleAnswer = (selectedOption) => {
    const isCorrect = selectedOption === fileData[currentIndex].Correct_Answer;
    setAnswers(prev => ({
      ...prev,
      [currentIndex]: {
        selected: selectedOption,
        isCorrect,
        timestamp: new Date().toISOString()
      }
    }));
  };

  const toggleMarkQuestion = (index) => {
    setMarkedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const handleNavigateToQuestion = (questionIndex) => {
    setCurrentIndex(questionIndex);
  };

  const calculateStats = () => {
    const attempted = Object.keys(answers).length;
    const correct = Object.values(answers).filter(a => a.isCorrect).length;
    return {
      total: fileData.length,
      attempted,
      correct,
      incorrect: attempted - correct,
      remaining: fileData.length - attempted
    };
  };

  return (
    <div className="app">
      <div className="flex h-screen overflow-hidden">
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="app-container">
            <h1>MCQ Exam Preparation</h1>
            {fileData.length === 0 ? (
              <div className="file-upload">
                <div
                  className={`file-upload-zone ${isDragging ? 'dragging' : ''}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <div className="upload-content">
                    <svg
                      className="upload-icon"
                      width="64"
                      height="64"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    <h3>Drag & Drop your Excel file here</h3>
                    <p>or</p>
                    <label className="file-upload-label">
                      Choose File
                      <input
                        type="file"
                        accept=".xlsx, .xls"
                        onChange={handleFileChange}
                        key={selectedFile ? selectedFile.name : "new-file"}
                      />
                    </label>
                    <p className="file-format">Supports: .xlsx, .xls</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="quiz-container">
                <div className="quiz-header">
                  <button onClick={handleClearFile} className="clear-file-btn">
                    Choose Different File
                  </button>
                </div>
                <MCQCard
                  question={fileData[currentIndex]}
                  currentIndex={currentIndex}
                  total={fileData.length}
                  nextQuestion={nextQuestion}
                  prevQuestion={prevQuestion}
                  onNavigate={handleNavigateToQuestion}
                  onAnswer={handleAnswer}
                  answer={answers[currentIndex]}
                  isMarked={markedQuestions.has(currentIndex)}
                  onToggleMark={() => toggleMarkQuestion(currentIndex)}
                />
              </div>
            )}
          </div>
          {loading && (
            <div className="loading-overlay">
              <div className="loading-spinner"></div>
              <p>Processing your file...</p>
            </div>
          )}
          <Footer />
        </div>

        {fileData.length > 0 && (
          <StatsSidebar
            isOpen={isSidebarOpen}
            toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            stats={calculateStats()}
            markedQuestions={markedQuestions}
          />
        )}
      </div>
    </div>
  );
};

export default App;