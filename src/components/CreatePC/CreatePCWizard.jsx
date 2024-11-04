"use client";
import React, { useState } from 'react';
import { useRouter } from "next/navigation";
import OsSelector from './OSSelector';
import TemplateSelector from './TemplateSelector';
import SelectApplications from './SelectApplications';

import { useDispatch } from "react-redux";
import { createVm } from "@/state/slices/vms";

const CreatePCWizard = () => {
    const [step, setStep] = useState(1);
    const [data, setData] = useState({})
    const [isStepOneValid, setIsStepOneValid] = useState(false);
    const [isTemplateSelected, setIsTemplateSelected] = useState(false);
    const [isApplicationsSelected, setIsApplicationsSelected] = useState(false);
    const router = useRouter();
    const dispatch = useDispatch();

    const handleOsSelected = (osId) => {
        setMachineInput((prevInput) => ({
            ...prevInput,
            osId
        }));
        setStep(2);
    };

    const handleCreate = async () => {
        try {
            const requestData = {
                ...data,
                productKey: data.productKey ? data.productKey : '',
                applications: data.applications.map(appId => ({
                    machineId: '', // This should be set appropriately
                    applicationId: appId,
                    parameters: {}, // Add any necessary parameters here
                })),
            };
            dispatch(createVm(requestData));
            router.push('/computers');
        } catch (err) {
            console.error(err);
        }
    };

    const handleOsChange = (values, isValid) => {
        setData(values);
        setIsStepOneValid(isValid);
    };

    const handleTemplateChanged = (id) => {
        setData(prevData => ({ ...prevData, templateId: id }));
        setIsTemplateSelected(Boolean(id));
    };

    const handleApplicationsSelected = (selectedApplications) => {
        setData(prevData => ({ ...prevData, applications: selectedApplications }));
        setIsApplicationsSelected(selectedApplications.length > 0);
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            {step === 1 && <OsSelector onOsSelected={handleOsSelected} onChange={handleOsChange} />}
            {step === 2 && <TemplateSelector onTemplateSelected={handleTemplateChanged} />}
            {step === 3 && <SelectApplications onApplicationsSelected={handleApplicationsSelected} />}

            <div className="flex justify-end mt-4">
                {step === 1 && (
                    <button
                        onClick={() => setStep(2)}
                        disabled={!isStepOneValid}
                        className={`px-4 py-2 rounded ${isStepOneValid ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700 cursor-not-allowed'}`}
                    >
                        Next Step
                    </button>
                )}
                {step === 2 && (
                    <button
                        onClick={() => setStep(3)}
                        disabled={!isTemplateSelected}
                        className={`px-4 py-2 rounded ${isTemplateSelected ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700 cursor-not-allowed'}`}
                    >
                        Next Step
                    </button>
                )}
                {step === 3 && (
                    <button
                        onClick={handleCreate}
                        disabled={!isApplicationsSelected}
                        className={`px-4 py-2 rounded ${isApplicationsSelected ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700 cursor-not-allowed'}`}
                    >
                        Create
                    </button>
                )}
            </div>
        </div>
    );
};

export default CreatePCWizard;