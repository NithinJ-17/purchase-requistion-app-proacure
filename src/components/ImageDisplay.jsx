import React from 'react';
import '../styles/ImageDisplay.css';

const ImageDisplay = ({ products, loading }) => {
    return (
        <div className="image-display">
            {loading ? (
                <div className="loading-spinner">Loading...</div> // Loading spinner
            ) : (
                products.length > 0 ? (
                    products.map((product) => (
                        <div key={product.asin} className="image-item">
                            <img 
                                src={product.product_photo || 'default-image.jpg'} 
                                alt={product.product_title || 'Product'} 
                                className="image-thumbnail" 
                            />
                            <div className="product-details">
                                <h3>{product.product_title}</h3>
                                <p>{product.product_price}</p>
                                <p>{product.product_minimum_offer_price}</p>
                                <p>{product.delivery}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-products">No products to display</div> // Message when no products are available
                )
            )}
        </div>
    );
};

export default ImageDisplay;
