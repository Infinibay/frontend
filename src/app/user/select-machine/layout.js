import Sidebar from "@/components/form/Sidebar";

export default function FormLayout({ children }) {
  return (
    <div className="flex flex-row">
      <Sidebar />
      <div className="flex-1 py-12 form_container">{children}</div>
    </div>
  );
}
