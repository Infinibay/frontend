import React, { useState, useEffect } from 'react';
import OSItem from './OSItem';
import PropTypes from 'prop-types';

const WindowsSelectorList = ({ onOsChange, onLicenseChange, defaultSelected }) => {
    const [selectedOS, setSelectedOS] = useState(defaultSelected);
    const [licenseIncluded, setLicenseIncluded] = useState(false);
    const [licenseNumber, setLicenseNumber] = useState('');

    const osItems = [
        { id: 'WINDOWS10', displayName: 'Windows 10' },
        { id: 'WINDOWS11', displayName: 'Windows 11' }
    ];

    useEffect(() => {
        onOsChange(selectedOS);
        // send licenseNumber instead of licenseIncluded
        onLicenseChange(licenseIncluded ? licenseNumber : '');
    }, [selectedOS, licenseIncluded, licenseNumber]);

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
            <div>
                <label>
                    <input type="checkbox" checked={licenseIncluded} onChange={(e) => setLicenseIncluded(e.target.checked)} />
                    Include License
                </label>
            </div>
            {licenseIncluded && (
                <div>
                    <label>
                        License Number:<br />
                        <input type="text"
                               value={licenseNumber}
                               onChange={(e) => setLicenseNumber(e.target.value)}
                               placeholder="Enter license number" />
                    </label>
                </div>
            )}
        </div>
    );
};

WindowsSelectorList.propTypes = {
    onOsChange: PropTypes.func.isRequired,
    onLicenseChange: PropTypes.func.isRequired,
    defaultSelected: PropTypes.string,
};

WindowsSelectorList.defaultProps = {
    defaultSelected: 'WINDOWS11 ',
};

export default WindowsSelectorList;