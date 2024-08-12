import React, { useState, useEffect } from 'react';
import '../styles/FormPage.css'; // Assuming you have some styles

const FormPage = () => {
    const [showMessage, setShowMessage] = useState(false);
    const [locations, setLocations] = useState([]); // State for storing locations
    const [categories, setCategories] = useState([]); // State for storing categories
    const [selectedLocation, setSelectedLocation] = useState(""); // State for selected location
    const [selectedCategory, setSelectedCategory] = useState(""); // State for selected category
    const [formData, setFormData] = useState({
        supplierName: '',
        productInfo: '',
        productUrl: '',
        category: '',
        quantity: '',
        timeline: '',
        location: '',
        requiredFor: ''
    });

    const apiUrl = import.meta.env.VITE_API_URL;
    const categoryUrl = import.meta.env.VITE_API_URL_CATEGORIES;
    const postEndpoint = import.meta.env.VITE_POST_API_URL; // New endpoint for POST request

    // Fetch locations from the API when the component is mounted
    useEffect(() => {
        fetchLocations();
        fetchCategories();
    }, []);

    const fetchLocations = async () => {
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            console.log('Fetched Locations Data:', data.countries); // Print data.countries
            if (data && Array.isArray(data.countries)) {
                setLocations(data.countries);
            } else {
                setLocations([]); // Fallback if data.countries is not an array
            }
        } catch (error) {
            console.error('Error fetching locations:', error);
            setLocations([]); // Fallback in case of error
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await fetch(categoryUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            console.log('Fetched Categories Data:', data); // Print data
            if (Array.isArray(data.categories)) {
                setCategories(data.categories);
            } else {
                setCategories([]); // Fallback if data is not an array
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
            setCategories([]); // Fallback in case of error
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleLocationChange = (e) => {
        const value = e.target.value;
        setSelectedLocation(value);
        setFormData((prevData) => ({ ...prevData, location: value }));
    };

    const handleCategoryChange = (e) => {
        const value = e.target.value;
        setSelectedCategory(value);
        setFormData((prevData) => ({ ...prevData, category: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Form Data Submitted:', formData); // Print form data to console

        try {
            const response = await fetch(postEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            // Assuming the response contains a success message
            const result = await response.json();
            console.log('Form submission response:', result);
            setShowMessage(true);
        } catch (error) {
            console.error('Error submitting form:', error);
            setShowMessage(false);
        }

        e.target.reset();
        setTimeout(() => {
            setShowMessage(false);
        }, 3000); // Hide message and reset form after 3 seconds
    };

    return (
        <div className="form-page-container">
            <h1>New Item Form</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    <span>Name of the Supplier:<span className="asterisk">*</span></span>
                    <input
                        type="text"
                        name="supplierName"
                        value={formData.supplierName}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <label>
                    <span>Information about Product:<span className="asterisk">*</span></span>
                    <span><input
                        type="text"
                        name="productInfo"
                        value={formData.productInfo}
                        onChange={handleInputChange}
                        required
                    /></span>
                    <input
                        type="url"
                        name="productUrl"
                        value={formData.productUrl}
                        onChange={handleInputChange}
                        placeholder="Website URL (Optional)"
                        className="optional"
                    />
                </label>
                <label>
                    <span>Category:<span className="asterisk">*</span></span>
                    <select
                        name="category"
                        value={selectedCategory}
                        onChange={handleCategoryChange}
                        required
                        style={{ maxHeight: '150px', overflowY: 'auto' }} // Make it scrollable with max 5 options visible
                    >
                        <option value="">Select Category</option>
                        {categories.length > 0 ? (
                            categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))
                        ) : (
                            <option value="" disabled>No categories available</option>
                        )}
                    </select>
                </label>
                <label>
                    <span>Quantity Required:<span className="asterisk">*</span></span>
                    <input
                        type="number"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <label>
                    <span>Timeline/When it is Required:<span className="asterisk">*</span></span>
                    <input
                        type="date"
                        name="timeline"
                        value={formData.timeline}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <label>
                    <span>Location:<span className="asterisk">*</span></span>
                    <select
                        name="location"
                        value={selectedLocation}
                        onChange={handleLocationChange}
                        required
                        style={{ maxHeight: '150px', overflowY: 'auto' }} // Make it scrollable with max 5 options visible
                    >
                        <option value="">Select Location</option>
                        {locations.length > 0 ? (
                            locations.map((location, index) => (
                                <option key={index} value={location}>
                                    {location}
                                </option>
                            ))
                        ) : (
                            <option value="" disabled>No locations available</option>
                        )}
                    </select>
                </label>
                <label>
                    <span>Required For:<span className="asterisk">*</span></span>
                    <input
                        type="text"
                        name="requiredFor"
                        value={formData.requiredFor}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <button type="submit">Submit</button>
                {showMessage && <div className="premium-message show">Your request is submitted.</div>}
            </form>
        </div>
    );
};

export default FormPage;
