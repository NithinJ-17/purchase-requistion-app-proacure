import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import TopBar from './components/TopBar';

import ImageDisplay from './components/ImageDisplay';
import AnimatedText from './components/AnimatedText'; // Import AnimatedText component
import './App.css';
import FormPage from './pages/FormPage';

const App = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false); // Loading state

    // Handle search results from TopBar
    const handleSearchResults = (fetchedProducts) => {
        setLoading(true); // Set loading to true when fetching starts
        console.log(fetchedProducts);
        setProducts(fetchedProducts);
        setLoading(false); // Set loading to false when fetching ends
    };

    return (
        <Router>
            <div className="app">
                <Sidebar />
                <div className="content">
                    <div className="animated-header">
                        <AnimatedText text="| Proacure |" />
                    </div>
                    <TopBar onSearchResults={handleSearchResults} />
                    <Routes>
                        <Route path="/" element={<MainContent />} />
                        <Route path="/new-item" element={<FormPage />} />
                    </Routes>
                    <div className="image-display-container">
                        {loading ? (
                            <div className="loading-spinner">Loading...</div> // Loading spinner
                        ) : products.length === 0 ? (
                            <div className="no-products">No products shown</div> // No products message
                        ) : (
                            <ImageDisplay products={products} />
                        )}
                    </div>
                </div>
            </div>
        </Router>
    );
};

export default App;
