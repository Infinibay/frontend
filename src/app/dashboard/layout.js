"use client";
import Header from "@/components/dashboard/Header";
import Sidebar from "@/components/dashboard/Sidebar";
import ProtectedRoute from '@/components/ProtectedRoute/ProtectedRoute';
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardLayout({ children }) {
  const [userSideBar, setUserSidebar] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setUserSidebar(false);
      } else {
        setUserSidebar(true);
      }
    };
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [pathname]);

  return (
    <ProtectedRoute>
      <div className="flex items-start  !bg-[#FAFAFA]">
        <div
          className={`h-screen left-0 top-0 max-w-[260px] lg:max-w-[300px] 4xl:max-w-[500px] bottom-0 fixed lg:sticky z-20 transition-all duration-500 ease-out w-full
        ${userSideBar ? "translate-x-0" : "translate-x-[-310px] "}
        `}
        >
          <Sidebar userSideBar={userSideBar} setUserSidebar={setUserSidebar} />
        </div>

        <div className="ml-auto w-full">
          <div className="flex flex-col min-h-screen">
            <Header setUserSidebar={setUserSidebar} />
            {children}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
