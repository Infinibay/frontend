"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/state/slices/auth";
import { fetchDepartments } from "@/state/slices/departments";
import { Image } from "@nextui-org/react";

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

import { FaChevronDown, FaUsers, FaCog, FaDesktop, FaAppStore } from "react-icons/fa"; // Use react-icons

function AppSidebar({ color = "red" }) {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const router = useRouter();
  const departments = useSelector((state) => state.departments.items);
  const [isDepartmentsOpen, setIsDepartmentsOpen] = useState(true);

  React.useEffect(() => {
    dispatch(fetchDepartments());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    router.push('/auth/sign-in');
  };

  return (
    <Sidebar color={color}>
      <SidebarHeader className="flex justify-center items-center">
        <Image
          src="/images/sidebarLogo.png"
          alt="Infinibay Logo"
          width={150}
          height={150}
        />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href="/computers">
              <SidebarMenuButton isActive={pathname.startsWith("/computers")}>
                <FaDesktop className="mr-2" />
                Computers
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => setIsDepartmentsOpen(!isDepartmentsOpen)}>
              <FaChevronDown className="mr-2" />
              Departments
            </SidebarMenuButton>
            {isDepartmentsOpen && (
              <SidebarMenuSub>
                {departments.map((dept) => (
                  <SidebarMenuSubItem key={dept.id}>
                    <Link href={`/departments/${dept.name}`}>
                      <SidebarMenuButton isActive={pathname.startsWith(`/departments/${dept.name}`)}>
                        {dept.name}
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            )}
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/users">
              <SidebarMenuButton isActive={pathname.startsWith("/users")}>
                <FaUsers className="mr-2" />
                Users
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/applications">
              <SidebarMenuButton isActive={pathname.startsWith("/applications")}>
                <FaAppStore className="mr-2" />
                Applications
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/settings">
              <SidebarMenuButton isActive={pathname.startsWith("/settings")}>
                <FaCog className="mr-2" />
                Settings
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <button onClick={handleLogout}>
              <SidebarMenuButton>
                <FaChevronDown className="mr-2" />
                Sign Out
              </SidebarMenuButton>
            </button>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar;
