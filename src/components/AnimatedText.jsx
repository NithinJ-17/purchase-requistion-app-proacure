import React from 'react';
import '../styles/AnimatedText.css'; // Make sure to create this CSS file

const AnimatedText = ({ text }) => {
    return (
        <div className="animated-text" data-text={text}>
            {text}
        </div>
    );
};

export default AnimatedText;
