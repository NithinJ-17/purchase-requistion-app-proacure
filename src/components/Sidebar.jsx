// src/components/Sidebar.jsx
import React, { useState } from 'react';
import '../styles/Sidebar.css';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(true);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
            <button className="toggle-button" onClick={toggleSidebar}>
                {isOpen ? '<' : '>'}
            </button>
            <ul>
                <li><a href="https://www.proacure.com/" target="_blank" rel="noopener noreferrer">Home</a></li>
                <li><a href="https://www.proacure.com/resources/" target="_blank" rel="noopener noreferrer">Resources</a></li>
                <li><a href="https://www.proacure.com/pricing/" target="_blank" rel="noopener noreferrer">Pricing</a></li>
                <li><a href="https://www.proacure.com/spend-analytics/?tab=spend_analytics" target="_blank" rel="noopener noreferrer">Solutions</a></li>
            </ul>
        </div>
    );
};

export default Sidebar;
