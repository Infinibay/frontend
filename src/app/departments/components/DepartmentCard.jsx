"use client"

import React from "react"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { createDebugger } from "@/utils/debug"
import {
  Building2,
  Users,
  Monitor,
  ArrowUpRight,
  Folder
} from "lucide-react"

const debug = createDebugger('frontend:components:department-card')

/**
 * Department Card Component
 * Displays a department as a card with relevant information and navigation
 */
const DepartmentCard = ({
  department,
  machineCount = 0,
  colorClass = "bg-primary/10 text-primary"
}) => {
  const departmentUrl = `/departments/${department.name.toLowerCase()}`

  React.useEffect(() => {
    debug.log('render', 'Department card rendered:', {
      departmentName: department.name,
      machineCount,
      colorClass
    })
  }, [department.name, machineCount, colorClass])

  const handleCardClick = () => {
    debug.info('navigation', 'Department card clicked:', {
      departmentName: department.name,
      targetUrl: departmentUrl
    })
  }

  return (
    <Link
      href={departmentUrl}
      className="block"
      onClick={handleCardClick}
    >
      <Card
        elevation="1"
        radius="md"
        className="h-full bg-card text-card-foreground border hover:shadow-elevation-2 hover:border-primary/40"
      >
        <CardContent className="pt-6">
          <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-lg ${colorClass}`}>
              <Building2 className="h-6 w-6" />
            </div>
            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </div>
          
          <h2 className="text-xl font-semibold mb-2 truncate">{department.name}</h2>
          
          <div className="flex items-center text-muted-foreground text-sm mb-1">
            <Monitor className="h-4 w-4 mr-2" />
            <span>{machineCount} {machineCount === 1 ? 'Computer' : 'Computers'}</span>
          </div>

          <div className="flex items-center text-muted-foreground text-sm">
            <Users className="h-4 w-4 mr-2" />
            <span>{Math.max(1, Math.floor(machineCount * 0.8))} {Math.max(1, Math.floor(machineCount * 0.8)) === 1 ? 'User' : 'Users'}</span>
          </div>
        </CardContent>
        
        <CardFooter className="border-t bg-muted text-sm text-muted-foreground py-3">
          <Folder className="h-4 w-4 mr-2" />
          <span>Resources</span>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default DepartmentCard;
