import Sidebar from "./Sidebar";
import Header from "./Header";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="flex h-screen">
      {/* Sidebar (fixed) */}
      <Sidebar />

      {/* Main wrapper for header + content */}
      <div className="flex-1 ml-64 flex flex-col">
        {/* Header (fixed top right) */}
        <div className="fixed left-64 right-0 top-0 z-10">
          <Header />
        </div>

        {/* Scrollable main content */}
        <div className="mt-[88px] h-[calc(100vh-88px)] overflow-y-auto bg-gray-50 p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
