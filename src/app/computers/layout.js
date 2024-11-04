"use client";
import Header from "@/components/dashboard/Header";
import Sidebar from "@/components/dashboard/Sidebar";
import Modal from "@/components/Modal/Modal";
import ProtectedRoute from '@/components/ProtectedRoute/ProtectedRoute';
import { Button, Select } from "@nextui-org/react";
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

  const [showModal, setShowModal] = useState(false);
  const [blur, setBlur] = useState(false);
  const [darkOverlay, setDarkOverlay] = useState(false);
  const [modalType, setModalType] = useState('information');

  return (
    <ProtectedRoute>
      <div className="flex items-start  !bg-[#FAFAFA]">
        <div className="ml-auto w-full">
          <div className="flex flex-col min-h-screen">
            <Header setUserSidebar={false} />
            {children}
            <div className="p-4">
              <label htmlFor="modalType" className="block mb-2">Select Modal Type:</label>
              <select
                id="modalType"
                value={modalType}
                onChange={(e) => setModalType(e.target.value)}
                className="mb-4 p-2 border rounded"
              >
                <option value="information">Information</option>
                <option value="warning">Warning</option>
                <option value="error">Error</option>
                <option value="custom">Custom</option>
              </select>
              <Button onClick={() => setShowModal(true)}>Open Modal</Button>
            </div>
            <Modal
              show={showModal}
              blur={blur}
              title="Title"
              darkOverlay={darkOverlay}
              type={modalType}
              onAccept={() => setShowModal(false)}
              onCancel={() => setShowModal(false)}
            >
              <Button onClick={() => setBlur(!blur)}>Toggle Blur</Button>
              <Button onClick={() => setDarkOverlay(!darkOverlay)}>Toggle Dark Overlay</Button>
            </Modal>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
