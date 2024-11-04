"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, useParams } from "next/navigation";
import { fetchApplicationById, updateApplication } from "@/state/slices/applications";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const Page = () => {
  const dispatch = useDispatch();
  const urlParams = useParams();
  const router = useRouter();
  const id = urlParams.id;
  const application = useSelector((state) => state.applications.items.find((app) => app.id === id));

  const [params, setParams] = useState([{ name: "", type: "string", required: false }]);
  const [windowsScript, setWindowsScript] = useState("");
  const [ubuntuScript, setUbuntuScript] = useState("");
  const [fedoraScript, setFedoraScript] = useState("");
  const [applicationName, setApplicationName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (id) {
      dispatch(fetchApplicationById(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (application) {
      setApplicationName(application.name);
      setDescription(application.description);
      setParams(Object.keys(application.parameters).map((key) => ({
        name: key,
        type: application.parameters[key].type,
        required: application.parameters[key].required,
      })));
      const installCommand = JSON.parse(application.installCommand);
      setWindowsScript(installCommand.windows);
      setUbuntuScript(installCommand.ubuntu);
      setFedoraScript(installCommand.fedora);
    }
  }, [application]);

  const handleAddParam = () => {
    setParams([...params, { name: "", type: "string", required: false }]);
  };

  const handleParamChange = (index, field, value) => {
    const newParams = [...params];
    newParams[index][field] = value;
    setParams(newParams);
  };

  const handleRemoveParam = (index) => {
    const newParams = params.filter((_, i) => i !== index);
    setParams(newParams);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const filteredParams = params.filter((param) => param.name.trim() !== "");
    const parameters = filteredParams.reduce((acc, param) => {
      acc[param.name] = { type: param.type, required: param.required };
      return acc;
    }, {});
    const payload = {
      id,
      input: {
        name: applicationName,
        description,
        parameters,
        os: ["windows", "ubuntu", "fedora"],
        installCommand: JSON.stringify({
          windows: windowsScript,
          ubuntu: ubuntuScript,
          fedora: fedoraScript,
        }),
      },
    };
    try {
      await dispatch(updateApplication(payload)).unwrap();
      // Optionally, redirect or show success message
    } catch (error) {
      console.error("Failed to update application:", error);
      // Optionally add error handling UI here
    }
  };

  return (
    <div className="flex flex-1 justify-between overflow-hidden w-[800px]">
      <div className="flex pb-10 border border-b-0 flex-col justify-between flex-1">
        <div className="border-b py-6">
          <div className="dashboard_container flex items-center justify-between w-full">
            <h1 className="5xl:text-3xl text-lg sm:text-2xl flex-1 font-medium text-gray-800">
              Update Application
            </h1>
          </div>
        </div>
        <div className="dashboard_container flex-1">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Label htmlFor="applicationName" className="block mb-2">Application Name</Label>
            <Input
              id="applicationName"
              value={applicationName}
              onChange={(e) => setApplicationName(e.target.value)}
              required
            />
            <Label htmlFor="description" className="block mb-2">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
            <div>
              <h2 className="font-bold text-xl 4xl:text-3xl">Parameters</h2>
              {params.map((param, index) => (
                <div key={index} className="flex space-x-4 mb-4">
                  <Input
                    label="Name"
                    value={param.name}
                    onChange={(e) => handleParamChange(index, "name", e.target.value)}
                    required
                  />
                  <select
                    value={param.type}
                    onChange={(e) => handleParamChange(index, "type", e.target.value)}
                    className="border p-2 rounded"
                  >
                    <option value="string">String</option>
                    <option value="number">Number</option>
                  </select>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={param.required}
                      onChange={(e) => handleParamChange(index, "required", e.target.checked)}
                    />
                    <span>Required</span>
                  </label>
                  <Button type="button" onClick={() => handleRemoveParam(index)}>Remove</Button>
                </div>
              ))}
              <Button type="button" onClick={handleAddParam}>Add Parameter</Button>
            </div>
            <Tabs defaultValue="windows" className="w-[400px]">
              <TabsList>
                <TabsTrigger value="windows">Windows</TabsTrigger>
                <TabsTrigger value="ubuntu">Ubuntu</TabsTrigger>
                <TabsTrigger value="fedora">Fedora</TabsTrigger>
              </TabsList>
              <TabsContent value="windows">
                <Label htmlFor="windowsScript" className="block mb-2">Windows Script</Label>
                <Textarea
                  id="windowsScript"
                  placeholder="Windows Script"
                  value={windowsScript}
                  onChange={(e) => setWindowsScript(e.target.value)}
                  rows={10}
                  className="w-full"
                  required
                />
              </TabsContent>
              <TabsContent value="ubuntu">
                <Label htmlFor="ubuntuScript" className="block mb-2">Ubuntu Script</Label>
                <Textarea
                  id="ubuntuScript"
                  placeholder="Ubuntu Script"
                  value={ubuntuScript}
                  onChange={(e) => setUbuntuScript(e.target.value)}
                  rows={10}
                  required
                />
              </TabsContent>
              <TabsContent value="fedora">
                <Label htmlFor="fedoraScript" className="block mb-2">Fedora Script</Label>
                <Textarea
                  id="fedoraScript"
                  placeholder="Fedora Script"
                  value={fedoraScript}
                  onChange={(e) => setFedoraScript(e.target.value)}
                  rows={10}
                  required
                />
              </TabsContent>
            </Tabs>
            <div className="mt-4 p-4 bg-gray-100 rounded">
              <h3 className="font-bold text-lg">Help</h3>
              <p>
                In the script, you can access the parameters using <code className="bg-gray-300 p-1 rounded">{"{{param_name}}"}</code>.
              </p>
            </div>
            <Button type="submit">Update Application</Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Page;
