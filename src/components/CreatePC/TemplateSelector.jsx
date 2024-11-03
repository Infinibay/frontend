import React, { useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import Image from 'next/image';

const GET_MACHINE_TEMPLATES = gql`
    {
        machineTemplates(orderBy: {}, pagination: {}) {
            id
            name
            description
            cores
            ram
            storage
            createdAt
            categoryId
        }
    }
`;

const TemplateSelector = ({ onTemplateSelected }) => {
    const { loading, error, data } = useQuery(GET_MACHINE_TEMPLATES);
    const [selectedTemplateId, setSelectedTemplateId] = useState(null);

    if (loading) return 'Loading...';
    if (error) return `Error! ${error.message}`;

    return (
        <div className="flex flex-wrap -mx-2">
            {data && data.machineTemplates && data.machineTemplates.map((template) => (
                <div
                    key={template.id}
                    className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/3 p-2"
                >
                    <div
                        className={`flex flex-col items-center p-4 border rounded shadow-xl ${selectedTemplateId === template.id ? 'border-blue-500' : 'border-gray-300'
                            }`}
                        onClick={() => {
                            setSelectedTemplateId(template.id);
                            onTemplateSelected(template.id);
                        }}
                    >
                        <div className="flex items-center">
                            <Image
                                src={"/images/smallScreenmointer.png"}
                                alt="Template"
                                width={64}
                                height={64}
                            />
                            <div className="ml-4 text-left text-sm">
                                <p>Cores: {template.cores}</p>
                                <p>RAM: {template.ram} GB</p>
                                <p>Storage: {template.storage} GB</p>
                            </div>
                        </div>
                        <div className="mt-4">
                            <p className="font-semibold text-sm">{template.name}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default TemplateSelector;