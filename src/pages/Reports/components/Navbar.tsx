import React from 'react';
import { FileText, AlertTriangle } from 'lucide-react';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-[#2A5F7F] text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 mr-2" />
            <span className="font-bold text-xl">Maintenance Reporting</span>
          </div>
          <div className="flex items-center space-x-4">
            <button className="bg-white text-[#2A5F7F] px-3 py-1 rounded-md flex items-center text-sm hover:bg-gray-100 transition-colors">
              <FileText className="h-4 w-4 mr-1" />
              Reports
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;