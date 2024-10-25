"use client";
import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { useRouter } from "next/navigation";
import OsSelector from './OSSelector'; // replace with your actual OsSelector path
import TemplateSelector from './TemplateSelector'; // replace with your actual TemplateSelector path

const CREATE_MACHINE = gql`
    mutation CreateMachine($input: CreateMachineInputType!) {
        createMachine(input: $input) {
            id
            name
            config
            status
            userId
            templateId
            createdAt
        }
    }
`;

const CreatePCWizard = () => {
    const [step, setStep] = useState(1);
    const [createMachine, { loading, error }] = useMutation(CREATE_MACHINE);
    const [data, setData] = useState({})
    const router = useRouter();

    const handleOsSelected = (osId) => {
        setMachineInput((prevInput) => ({
            ...prevInput,
            osId
        }));
        setStep(2);
    };

    const handleCreate = async () => {
        try {
            if (loading) return;
            console.log("Running with", data)
            await createMachine({ variables: { input: data } });
            // router.push('/dashboard');
        } catch (err) {
            console.error(err);
        }
    };

    const handleOsChange = (values) => {
        console.log("Setting", values);
        setData(values)
    };

    const handleTemplateChanged = (id) => {
        console.log("Id is", id);
        let dataValue = {...data};
        dataValue.templateId = id;
        console.log("data is", dataValue);
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

            {loading && <p>Loading...</p>}
            {error && <p>An error occurred.</p>}
        </div>
    );
};

export default CreatePCWizard;