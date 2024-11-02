import React, { useState, useEffect } from 'react';
import OSItem from './OSItem';
import PropTypes from 'prop-types';

const LinuxSelectorList = ({ onOsChange }) => {
    const [selectedOS, setSelectedOS] = useState(null);

    const osItems = [
        {
            id: 'UBUNTU',
            imageSrc: '/images/ubuntu.png',
            altText: 'Ubuntu',
        },
        {
            id: 'FEDORA',
            imageSrc: '/images/fedora.png',
            altText: 'Fedora',
        },
    ];

    useEffect(() => {
        onOsChange(selectedOS);
    }, [selectedOS]);

    return (
        <div className="p-4 shadow rounded">
            <div className="flex">
                {osItems.map(os => (
                    <OSItem
                        key={os.id}
                        id={os.id}
                        imageSrc={os.imageSrc}
                        altText={os.altText}
                        isSelected={os.id === selectedOS}
                        onClick={setSelectedOS}
                    />
                ))}
            </div>
        </div>
    );
};

LinuxSelectorList.propTypes = {
    onOsChange: PropTypes.func.isRequired,
};

export default LinuxSelectorList;