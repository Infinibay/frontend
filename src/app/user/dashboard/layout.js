"use client";
import Sidebar from "@/components/UserFlow/Sidebar";
import Header from "@/components/dashboard/Header";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function RootLayout({ children }) {
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

  // useEffect(() => {
  //   setUserSidebar(false);
  // }, [pathname]);

  return (
    <div className="flex overflow-hidden items-start min-h-screen bg-[#FAFAFA]">
      <div
        className={`h-screen left-0 top-0 lg:max-w-[300px] 4xl:max-w-[500px] bottom-0 lg:w-full`}
      >
        <Sidebar userSideBar={userSideBar} setUserSidebar={setUserSidebar} />
      </div>

      <div className="lg:ml-auto w-full">
        <div className="flex flex-col min-h-screen">
          <Header setUserSidebar={setUserSidebar} />
          {children}
        </div>
      </div>
    </div>
  );
}
