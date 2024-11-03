"use client";
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import WindowsSelectorList from './WindowsSelectorList';
import LinuxSelectorList from './LinuxSelectorList';
import OSItem from "@/components/CreatePC/OSItem";
import OSSwitch from "@/components/CreatePC/OSSwitch";

const OSSelector = ({ onChange }) => {
    const [osOption, setOsOption] = useState('windows');
    const [selectedOS, setSelectedOS] = useState('win11'); // Set Windows 11 as default
    const [licenseIncluded, setLicenseIncluded] = useState(false);
    const [vmName, setVmName] = useState("");
    const [username, sertUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});

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

    const handlePassword = (e) => {
        setPassword(e.target.value);
    };

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const validateName = (name) => /^[a-zA-Z][a-zA-Z0-9_\-\s]*$/.test(name);
    const validateUsername = (username) => /^[a-zA-Z][a-zA-Z0-9_\-\s]*$/.test(username);

    const isFormValid = () => {
        return (
            vmName && validateName(vmName) &&
            username && validateUsername(username) &&
            password && selectedOS
        );
    };

    // Clear the licensing field and selected OS when the OS option (Windows/Linux) changes
    useEffect(() => {
        setSelectedOS(osOption === 'windows' ? 'win11' : null);
        setLicenseIncluded(false);
    }, [osOption]);

    // Log the output every time it changes
    useEffect(() => {
        let response = {
            os: selectedOS,
            productKey: licenseIncluded,
            name: vmName,
            username: username,
            password: password
        };
        onChange(response, isFormValid());
    }, [osOption, selectedOS, licenseIncluded, vmName, username, password]);

    return (
        <div className="p-4 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="order-2 md:order-1">
                    <div className="mt-4 max-w-lg">
                        <label htmlFor="vmName" className="block text-sm font-medium text-gray-700">Name</label>
                        <input id="vmName"
                            type="text"
                            value={vmName}
                            onChange={(e) => handleNameChange(e)}
                            placeholder="Machine Name"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        {!validateName(vmName) && vmName && (
                            <p className="text-red-500 text-sm">Name must start with a letter and contain only alphanumeric characters, -, _, or spaces.</p>
                        )}
                    </div>
                    <div className="mt-4 max-w-lg">
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                        <input id="username"
                            type="text"
                            value={username}
                            onChange={(e) => handleUsername(e)}
                            placeholder="Username"
                            maxLength="30"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        {!validateUsername(username) && username && (
                            <p className="text-red-500 text-sm">Username must start with a letter and contain only alphanumeric characters, -, _, or spaces.</p>
                        )}
                    </div>
                    <div className="mt-4 max-w-lg relative">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input id="password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e => handlePassword(e))}
                            placeholder="Password"
                            maxLength="30"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        <button
                            type="button"
                            onClick={toggleShowPassword}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                            style={{ top: '50%', transform: 'translateY(-10%)' }}
                        >
                            {showPassword ? (
                                <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            ) : (
                                <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a10.05 10.05 0 011.658-3.033m2.197-2.197A9.956 9.956 0 0112 5c4.477 0 8.268 2.943 9.542 7-.33 1.052-.81 2.036-1.416 2.925M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3l18 18" />
                                </svg>
                            )}
                        </button>
                    </div>

                    {osOption === 'windows' && (
                        <WindowsSelectorList
                            onOsChange={handleOsChange}
                            onLicenseChange={handleLicenseChange}
                            defaultSelected='WINDOWS11'
                        />
                    )}

                    {osOption === 'linux' && (
                        <LinuxSelectorList onOsChange={handleOsChange} />
                    )}
                </div>
                <div className="order-1 md:order-2 flex justify-center md:justify-end">
                    <OSSwitch onChange={(os) => setOsOption(os)} defaultValue={"windows"}></OSSwitch>
                </div>
            </div>
        </div>
    );
};

OSSelector.propTypes = {
    onChange: PropTypes.func.isRequired,
};

// Default prop values
OSSelector.defaultProps = {
    onClick: () => { },
};

export default OSSelector;