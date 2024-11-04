"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { fetchApplications } from "@/state/slices/applications";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

const Page = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const applications = useSelector((state) => state.applications.items);

  useEffect(() => {
    dispatch(fetchApplications());
  }, [dispatch]);

  const handleRowClick = (id) => {
    router.push(`/applications/${id}`);
  };

  return (
    <div className="flex flex-1 justify-between overflow-hidden w-full">
      <div className="flex pb-10 border border-b-0 flex-col justify-between flex-1">
        <div className="border-b py-6">
          <div className="dashboard_container flex items-center justify-between w-full">
            <h1 className="5xl:text-3xl text-lg sm:text-2xl flex-1 font-medium text-gray-800">
              Applications
            </h1>
          </div>
        </div>
        <div className="dashboard_container flex-1">
          <Table className="mt-8 w-full">
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.map((application) => (
                <TableRow key={application.id} onClick={() => handleRowClick(application.id)} className="cursor-pointer">
                  <TableCell>{application.name}</TableCell>
                  <TableCell>{application.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Page;
