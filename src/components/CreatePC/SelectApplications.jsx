import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchApplications } from '@/state/slices/applications';

const SelectApplications = ({ onApplicationsSelected }) => {
  const dispatch = useDispatch();
  const applications = useSelector((state) => state.applications.items);
  const [selectedApplications, setSelectedApplications] = useState([]);

  useEffect(() => {
    dispatch(fetchApplications());
  }, [dispatch]);

  const handleApplicationToggle = (appId) => {
    setSelectedApplications((prevSelected) =>
      prevSelected.includes(appId)
        ? prevSelected.filter((id) => id !== appId)
        : [...prevSelected, appId]
    );
  };

  useEffect(() => {
    onApplicationsSelected(selectedApplications);
  }, [selectedApplications, onApplicationsSelected]);

  return (
    <div className="p-4 shadow rounded">
      <h2 className="text-lg font-semibold mb-4">Select Applications</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {applications.map((app) => (
          <div key={app.id} className="p-4 border rounded">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={selectedApplications.includes(app.id)}
                onChange={() => handleApplicationToggle(app.id)}
                className="mr-2"
              />
              <div>
                <h3 className="text-sm font-semibold">{app.name}</h3>
                <p className="text-xs">{app.description}</p>
              </div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelectApplications;
