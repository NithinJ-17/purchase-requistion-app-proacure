import React, { useState } from 'react';
import '../styles/TopBar.css';
import { FaSearch } from 'react-icons/fa'; 

const API_URL = 'http://localhost:8000/api/v1/search'; // Your FastAPI URL

const TopBar = ({ onSearchResults }) => {
    const [searchTerm, setSearchTerm] = useState('');

    // Function to fetch products based on search term
    const fetchProducts = async (query) => {
        try {
            const response = await fetch(`${API_URL}?query=${query}&page=1&sort_by=RELEVANCE`);
            const data = await response.json();
            
            // Check if products exist in the response
            if (data.products) {
                onSearchResults(data.products);
            } else {
                onSearchResults([]); // Clear results if no products are found
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            onSearchResults([]); // Clear results in case of an error
        }
    };

    // Function to handle search button click
    const handleSearch = () => {
        if (searchTerm.length > 0) {
            fetchProducts(searchTerm);
        } else {
            onSearchResults([]); // Clear results if search term is too short
        }
    };

    return (
        <div className="topbar">
            <input
                type="text"
                placeholder="Search for products..."
                className="search-bar"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="search-button" onClick={handleSearch}>
                <FaSearch /> 
            </button>
        </div>
    );
};

export default TopBar;
