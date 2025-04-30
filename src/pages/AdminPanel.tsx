import React, { useState } from "react";
import { Users, LayoutGrid } from "lucide-react";
import UserPage from "./admin-pages/UserPage";
import BuildingPage from "./admin-pages/BuildingPage";

const AdminPanel: React.FC = () => {
  const [activePage, setActivePage] = useState<"users" | "buildings">("users");

  const renderPage = () => {
    switch (activePage) {
      case "users":
        return <UserPage />;
      case "buildings":
        return <BuildingPage />;
      default:
        return <UserPage />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActivePage("users")}
              className={`py-4 px-6 flex items-center text-sm font-medium ${
                activePage === "users"
                  ? "border-b-2 border-[#2A5F7F] text-[#2A5F7F]"
                  : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Users className="mr-2 h-5 w-5" />
              User Management
            </button>
            <button
              onClick={() => setActivePage("buildings")}
              className={`py-4 px-6 flex items-center text-sm font-medium ${
                activePage === "buildings"
                  ? "border-b-2 border-[#2A5F7F] text-[#2A5F7F]"
                  : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <LayoutGrid className="mr-2 h-5 w-5" />
              Building Directory
            </button>
          </nav>
        </div>

        <div className="p-6">{renderPage()}</div>
      </div>
    </div>
  );
};

export default AdminPanel;
