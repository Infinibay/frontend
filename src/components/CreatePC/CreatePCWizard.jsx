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
            router.push('/dashboard');
        } catch (err) {
            console.error(err);
        }
    };

    const handleOsChange = (values) => {
        setData(values)
    };

    const handleTemplateChanged = (id) => {
        let dataValue = {...data};
        dataValue.templateId = id; 
        setData(dataValue);
    }

    return (
        <div>
            {step === 1 && <OsSelector onOsSelected={handleOsSelected} onChange={handleOsChange}/>}
            {step === 2 && <TemplateSelector onTemplateSelected={handleTemplateChanged} />}

            {step === 1 && <button onClick={() => setStep(2)}>Next Step</button>}

            {step === 2 &&
                <button
                    onClick={handleCreate}
                    // disabled={loading || !machineInput.templateId || !machineInput.osId}
                >
                    Create
                </button>
            }
        </div>
    );
};

export default CreatePCWizard;