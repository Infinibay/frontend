import React from 'react';
import PropTypes from 'prop-types';
import Image from 'next/image';

// Definition of the OS item component
const OSItem = ({ id, imageSrc, altText, isSelected, onClick }) => {
    return (
        <div
            className={`p-6 m-2 border-2 rounded ${isSelected ? 'border-blue-500' : 'border-gray-300'}`}
            onClick={() => onClick(id)}
        >
            <Image src={imageSrc} alt={altText} width={200} height={200} />
        </div>
    );
};

// Prop types validation
OSItem.propTypes = {
    id: PropTypes.string.isRequired,
    imageSrc: PropTypes.string.isRequired,
    altText: PropTypes.string.isRequired,
    isSelected: PropTypes.bool,
    onClick: PropTypes.func,
};

// Default prop values
OSItem.defaultProps = {
    isSelected: false,
    onClick: () => { },
};

export default OSItem;