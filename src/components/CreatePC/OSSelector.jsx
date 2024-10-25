"use client";
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import WindowsSelectorList from './WindowsSelectorList';
import LinuxSelectorList from './LinuxSelectorList';
import OSItem from "@/components/CreatePC/OSItem";

const OSSelector = ({ onChange }) => {
    const [osOption, setOsOption] = useState('windows');
    const [selectedOS, setSelectedOS] = useState('win11'); // Set Windows 11 as default
    const [licenseIncluded, setLicenseIncluded] = useState(false);
    const [vmName, setVmName] = useState("");
    const [username, sertUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleOsChange = (os) => {
        setSelectedOS(os);
    };

    const handleLicenseChange = (license) => {
        setLicenseIncluded(license);
    };

    const handleNameChange = (e) => {
        setVmName(e.target.value);
    };

    const handleUsername = (e) => {
        sertUsername(e.target.value);
    };

    const handlePassword = (e) =>{
        setPassword(e.target.value);
    };

    // Clear the licensing field and selected OS when the OS option (Windows/Linux) changes
    useEffect(() => {
        setSelectedOS(osOption === 'windows' ? 'win11' : null);
        setLicenseIncluded(false);
    }, [osOption]);

    // Log the output every time it changes
    useEffect(() => {
        console.log(`Option: ${osOption}, OS: ${selectedOS}, License Included: ${licenseIncluded}`);
        let response = {
            os: selectedOS,
            productKey:  licenseIncluded,
            name: vmName,
            username: username,
            password: password
        };
        onChange(response);
    }, [osOption, selectedOS, licenseIncluded, vmName, username, password]);

    return (
        <div>
            <div onChange={(e) => setOsOption(e.target.value)}>
                <input type="radio" value="windows" name="os" defaultChecked/> Windows
                <input type="radio" value="linux" name="os"/> Linux
            </div>
            <br/>
            <h3>Name</h3>
            <input id="vmName"
                   type="text"
                   value={vmName}
                   onChange={(e) => handleNameChange(e)}
                   placeholder={"Machine Name"}
            />
            <br/>
            <input id="username"
                   type="text"
                   value={username}
                   onChange={(e) => handleUsername(e)}
                   placeholder={"Username"}
            />
            <input id="password"
                   type="text"
                   value={password}
                   onChange={(e => handlePassword(e))}
                   placeholder={"Password"}
            />

            {osOption === 'windows' && (
                <WindowsSelectorList
                    onOsChange={handleOsChange}
                    onLicenseChange={handleLicenseChange}
                    defaultSelected='win11'
                />
            )}

            {osOption === 'linux' && (
                <LinuxSelectorList onOsChange={handleOsChange}/>
            )}
        </div>
    );
}
;

OSSelector.propTypes = {
    onChange: PropTypes.func,
};

// Default prop values
OSSelector.defaultProps = {
    onClick: () => {},
};

export default OSSelector;