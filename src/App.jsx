import React, { useState, useEffect } from "react";
import { read, utils } from "xlsx";
import MCQCard from "./components/MCQCard";
import Footer from "./components/Footer";
import { Analytics } from "@vercel/analytics/react"

const App = () => {
  const [fileData, setFileData] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedFile = localStorage.getItem("mcqFile");
    if (storedFile) {
      setFileData(JSON.parse(storedFile));
    }
  }, []);

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
    setFileData([]);
    setSelectedFile(null);
    setCurrentIndex(0);
    localStorage.removeItem("mcqFile");
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
  const handleNavigateToQuestion = (questionIndex) => {
    setCurrentIndex(questionIndex);
  };

  return (
    <div className="app">
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
              {/* <div className="current-status">
                Question {currentIndex + 1} of {fileData.length}
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${((currentIndex + 1) / fileData.length) * 100}%`,
                    }}
                  />
                </div>
              </div> */}
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
  );
};

export default App;