// src/components/MainContent.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/MainContent.css';

const MainContent = () => {
    return (
        <div className="main-content">
            <a href="" className="button">Software</a>
            <a href="https://example2.com" className="button">Laptop</a>
            <a href="https://example3.com" className="button">New Supplier</a>
            <Link to="/new-item" className="button">New Item</Link> {/* Navigate to the FormPage */}
        </div>
    );
};

export default MainContent;
