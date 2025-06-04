import  { useState } from "react";

import {
  Building,
  BarChart3,
  Package,
  FileText,
  User,
  Settings,
  LogOut,
} from "lucide-react";


import Dashboard from "../pages/Dashboard";
import AssetManagement from "../pages/AssetManagement";
import MBP_Page from "../pages/MBP/MBP";
//import Reports from "../pages/Reports";
import ReportPage from "../pages/Reports/ReportPage";
import UserProfile from "../pages/UserProfile";
import AdminPanel from "../pages/AdminPanel";
import { useNavigate } from "react-router-dom";
import { FloorPlan } from "../pages/SvgDisplay/FloorPlan";

export default function MainApp() {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState("dashboard");

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return <Dashboard />;
      case "assets":
        return <AssetManagement />;
      case "mbp":
        return <MBP_Page />;
      case "reports":
        return <ReportPage />;
      case "profile":
        return <UserProfile />;
      case "admin":
        return <AdminPanel />;
      case "display":
        return <FloorPlan unitSize={50} padding={30}/>;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-[#F5F7FA] text-gray-800">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:flex-col md:w-64 bg-white shadow-md">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-[#2A5F7F]">
            Asset Manager
          </h1>
          <p className="text-sm text-gray-500">College Admin System</p>
        </div>
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => setActivePage("dashboard")}
                className={`flex items-center w-full p-3 rounded-lg hover:bg-gray-100 transition-colors ${
                  activePage === "dashboard"
                    ? "bg-[#2A5F7F] text-white hover:bg-[#1e4b63]"
                    : ""
                }`}
              >
                <BarChart3 className="mr-3 h-5 w-5" />
                Dashboard
              </button>
            </li>
            <li>
              <button
                onClick={() => setActivePage("assets")}
                className={`flex items-center w-full p-3 rounded-lg hover:bg-gray-100 transition-colors ${
                  activePage === "assets"
                    ? "bg-[#2A5F7F] text-white hover:bg-[#1e4b63]"
                    : ""
                }`}
              >
                <Building className="mr-3 h-5 w-5" />
                Asset Management
              </button>
            </li>
            <li>
              <button
                onClick={() => setActivePage("mbp")}
                className={`flex items-center w-full p-3 rounded-lg hover:bg-gray-100 transition-colors ${
                  activePage === "mbp"
                    ? "bg-[#2A5F7F] text-white hover:bg-[#1e4b63]"
                    : ""
                }`}
              >
                <Package className="mr-3 h-5 w-5" />
                MBP Section
              </button>
            </li>
            <li>
              <button
                onClick={() => setActivePage("reports")}
                className={`flex items-center w-full p-3 rounded-lg hover:bg-gray-100 transition-colors ${
                  activePage === "reports"
                    ? "bg-[#2A5F7F] text-white hover:bg-[#1e4b63]"
                    : ""
                }`}
              >
                <FileText className="mr-3 h-5 w-5" />
                Reports
              </button>
            </li>
            <li>
              <button
                onClick={() => setActivePage("profile")}
                className={`flex items-center w-full p-3 rounded-lg hover:bg-gray-100 transition-colors ${
                  activePage === "profile"
                    ? "bg-[#2A5F7F] text-white hover:bg-[#1e4b63]"
                    : ""
                }`}
              >
                <User className="mr-3 h-5 w-5" />
                User Profile
              </button>
            </li>
            <li>
              <button
                onClick={() => setActivePage("admin")}
                className={`flex items-center w-full p-3 rounded-lg hover:bg-gray-100 transition-colors ${
                  activePage === "admin"
                    ? "bg-[#2A5F7F] text-white hover:bg-[#1e4b63]"
                    : ""
                }`}
              >
                <Settings className="mr-3 h-5 w-5" />
                Admin Panel
              </button>
            </li>
            <li>
              <button
                onClick={() => setActivePage("display")}
                className={`flex items-center w-full p-3 rounded-lg hover:bg-gray-100 transition-colors ${
                  activePage === "display"
                    ? "bg-[#2A5F7F] text-white hover:bg-[#1e4b63]"
                    : ""
                }`}
              >
                <Settings className="mr-3 h-5 w-5" />
                Display Rooms
              </button>
            </li>
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => navigate("/login")}
            className="flex items-center w-full p-3 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4 md:p-6 mt-16 md:mt-0">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}
