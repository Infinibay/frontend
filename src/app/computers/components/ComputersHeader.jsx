"use client";

import { cn } from "@/lib/utils";
import { BsGrid, BsPlusLg } from "react-icons/bs";
import Link from "next/link";
import {
  Header,
  HeaderLeft,
  HeaderCenter,
  HeaderRight,
} from "@/components/ui/header";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export function ComputersHeader() {
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
          <Link href="/computers/create">
            <Button className="whitespace-nowrap">
              <BsPlusLg className="mr-2 h-4 w-4" />
              New
            </Button>
          </Link>
        </div>
      </HeaderRight>
    </Header>
  );
}
