"use client";

import { cn } from "@/lib/utils";
import { BsGrid, BsPlusLg } from "react-icons/bs";
import { AlertCircle } from "lucide-react";
import Link from "next/link";
import {
  Header,
  HeaderLeft,
  HeaderCenter,
  HeaderRight,
} from "@/components/ui/header";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export function ComputersHeader({ hasISOs = true }) {
  return (
    <Header variant="glass" elevated>
      <HeaderLeft className="w-[200px]">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Computers</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </HeaderLeft>
      <HeaderCenter>
        <h1 className="text-lg sm:text-2xl font-medium text-gray-800">
          Computers
        </h1>
      </HeaderCenter>
      <HeaderRight className="w-[200px] flex items-center justify-end space-x-2">
        <div className="flex items-center space-x-2">
          {hasISOs ? (
            <Link href="/computers/create">
              <Button className="whitespace-nowrap">
                <BsPlusLg className="mr-2 h-4 w-4" />
                New
              </Button>
            </Link>
          ) : (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Button 
                      className="whitespace-nowrap" 
                      disabled
                      variant="secondary"
                    >
                      <AlertCircle className="mr-2 h-4 w-4" />
                      New
                    </Button>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Upload an ISO image first to create VMs</p>
                  <Link 
                    href="/settings?tab=iso" 
                    className="text-primary underline text-xs mt-1 block"
                  >
                    Go to Settings
                  </Link>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </HeaderRight>
    </Header>
  );
}
