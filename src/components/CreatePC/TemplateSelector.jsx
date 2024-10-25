import React from 'react';
import { useQuery, gql } from '@apollo/client';

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

    if (loading) return 'Loading...';
    if (error) return `Error! ${error.message}`;

    return (
        <div>
            {data && data.machineTemplates && data.machineTemplates.map((template) => (
                <div key={template.id}>
                    <input
                        type="radio"
                        id={template.id}
                        name="template"
                        value={template.id}
                        onChange={(e) => onTemplateSelected(e.target.value)}
                        title={`Description: ${template.description}\nCores: ${template.cores}\nRAM: ${template.ram}\nStorage: ${template.storage}`}
                    />
                    <label htmlFor={template.id}>{template.name}</label>
                </div>
            ))}
        </div>
    );
};

export default TemplateSelector;