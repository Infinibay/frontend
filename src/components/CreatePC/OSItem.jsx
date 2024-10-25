import React from 'react';
import PropTypes from 'prop-types';

// Definition of the OS item component
const OSItem = ({ displayName, id, isSelected, onClick }) => {
    return (
        <div
            className={`p-6 m-2 border-2 rounded ${isSelected ? 'border-blue-500' : 'border-gray-300'}`}
            onClick={() => onClick(id)}
        >
            <h2 className="text-xl">{displayName}</h2>
        </div>
    );
};

// Prop types validation
OSItem.propTypes = {
    displayName: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    isSelected: PropTypes.bool,
    onClick: PropTypes.func,
};

// Default prop values
OSItem.defaultProps = {
    isSelected: false,
    onClick: () => {},
};

export default OSItem;