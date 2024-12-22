// src/components/Footer.js

import React from "react";
import "./../styles/Footer.css";

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="about">
                    <h3>About</h3>
                    <p>
                        MCQ Exam Preparation helps you prepare for exams in a smarter way.
                        Choose your MCQs, review answers, and track your progress.
                    </p>
                </div>
                <div className="social-links">
                    <h3>Follow Us</h3>
                    <ul>
                        <li>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                                Twitter
                            </a>
                        </li>
                        <li>
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                                Facebook
                            </a>
                        </li>
                        <li>
                            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                                LinkedIn
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} MCQ Exam Preparation. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
