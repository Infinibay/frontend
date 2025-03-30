"use client";
import ProtectedRoute from '@/components/ProtectedRoute/ProtectedRoute';
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function ApplicationsLayout({ children }) {
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
      <div className="flex items-start !bg-[#FAFAFA]">
        <div className="ml-auto w-full">
          <div className="flex flex-col min-h-screen">
            {/* Header would go here */}
            {children}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
