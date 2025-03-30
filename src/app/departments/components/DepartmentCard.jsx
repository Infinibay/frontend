import React from "react";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Building2, 
  Users, 
  Monitor, 
  ArrowUpRight,
  Folder
} from "lucide-react";

/**
 * Department Card Component
 * Displays a department as a card with relevant information
 */
const DepartmentCard = ({ 
  department, 
  machineCount, 
  colorClass 
}) => {
  return (
    <Link 
      href={`/departments/${department.name.toLowerCase()}`} 
      className="block"
    >
      <Card className="h-full border hover:shadow-md transition-shadow duration-300 hover:border-blue-300">
        <CardContent className="pt-6">
          <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-lg ${colorClass}`}>
              <Building2 className="h-6 w-6" />
            </div>
            <Button variant="ghost" size="icon" className="text-gray-400">
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </div>
          
          <h2 className="text-xl font-semibold mb-2 truncate">{department.name}</h2>
          
          <div className="flex items-center text-gray-500 text-sm mb-1">
            <Monitor className="h-4 w-4 mr-2" />
            <span>{machineCount} {machineCount === 1 ? 'Computer' : 'Computers'}</span>
          </div>
          
          <div className="flex items-center text-gray-500 text-sm">
            <Users className="h-4 w-4 mr-2" />
            <span>{Math.max(1, Math.floor(machineCount * 0.8))} {Math.max(1, Math.floor(machineCount * 0.8)) === 1 ? 'User' : 'Users'}</span>
          </div>
        </CardContent>
        
        <CardFooter className="border-t bg-gray-50 text-sm text-gray-500 py-3">
          <Folder className="h-4 w-4 mr-2" />
          <span>Resources</span>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default DepartmentCard;
