import React, { useState, useEffect } from 'react';
import OSItem from './OSItem';
import PropTypes from 'prop-types';

const LinuxSelectorList = ({ onOsChange }) => {
    const [selectedOS, setSelectedOS] = useState(null);

    const osItems = [
        { id: 'UBUNTU', displayName: 'Ubuntu' },
        { id: 'FEDORA', displayName: 'Fedora' }
    ];

    useEffect(() => {
        onOsChange(selectedOS);
    }, [selectedOS]);

    return (
        <div>
            {
                osItems.map(os =>
                    <OSItem
                        key={os.id}
                        id={os.id}
                        displayName={os.displayName}
                        isSelected={os.id === selectedOS}
                        onClick={setSelectedOS}
                    />
                )
            }
        </div>
    );
};

LinuxSelectorList.propTypes = {
    onOsChange: PropTypes.func.isRequired,
};

export default LinuxSelectorList;