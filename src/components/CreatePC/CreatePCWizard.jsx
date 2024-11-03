"use client";
import React, { useState } from 'react';
import { useRouter } from "next/navigation";
import OsSelector from './OSSelector';
import TemplateSelector from './TemplateSelector';

import { useDispatch } from "react-redux";
import { createVm } from "@/state/slices/vms";

const CreatePCWizard = () => {
    const [step, setStep] = useState(1);
    const [data, setData] = useState({})
    const [isStepOneValid, setIsStepOneValid] = useState(false);
    const [isTemplateSelected, setIsTemplateSelected] = useState(false);
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
            dispatch(createVm(data));
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

    return (
        <div className="max-w-4xl mx-auto p-4">
            {step === 1 && <OsSelector onOsSelected={handleOsSelected} onChange={handleOsChange} />}
            {step === 2 && <TemplateSelector onTemplateSelected={handleTemplateChanged} />}

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
                        onClick={handleCreate}
                        disabled={!isTemplateSelected}
                        className={`px-4 py-2 rounded ${isTemplateSelected ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700 cursor-not-allowed'}`}
                    >
                        Create
                    </button>
                )}
            </div>
        </div>
    );
};

export default CreatePCWizard;