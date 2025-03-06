import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Eye, 
  Calendar, 
  ChevronDown,
  FileDown
} from 'lucide-react';

interface Report {
  id: string;
  name: string;
  type: string;
  date: string;
  createdBy: string;
}

const Reports: React.FC = () => {
  const [reportType, setReportType] = useState('');
  const [dateRange, setDateRange] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Sample data
  const reports: Report[] = [
    {
      id: '1',
      name: 'Q1 Asset Summary',
      type: 'Global',
      date: '2024-03-31',
      createdBy: 'John Smith'
    },
    {
      id: '2',
      name: 'IT Department Inventory',
      type: 'Room',
      date: '2024-04-15',
      createdBy: 'Sarah Johnson'
    },
    {
      id: '3',
      name: 'Office Supplies Usage',
      type: 'MBP',
      date: '2024-04-30',
      createdBy: 'Michael Brown'
    },
    {
      id: '4',
      name: 'Annual Depreciation Report',
      type: 'Global',
      date: '2024-01-01',
      createdBy: 'Emily Davis'
    },
    {
      id: '5',
      name: 'Lab Equipment Inventory',
      type: 'Room',
      date: '2024-05-10',
      createdBy: 'John Smith'
    },
  ];

  const handleGenerateReport = () => {
    // In a real app, this would generate a report based on the selected filters
    alert('Report generation started. It will be available shortly.');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Reports</h1>
      </div>

      {/* Report Builder */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Report Builder</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="reportType" className="block text-sm font-medium text-gray-700 mb-1">
              Report Type
            </label>
            <select
              id="reportType"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2A5F7F] focus:ring focus:ring-[#2A5F7F] focus:ring-opacity-50 py-2 px-3 border"
            >
              <option value="">Select Type</option>
              <option value="global">Global</option>
              <option value="room">Room</option>
              <option value="mbp">MBP</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date Range
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowDatePicker(!showDatePicker)}
                className="flex items-center justify-between w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 bg-white text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#2A5F7F] focus:ring-opacity-50"
              >
                <span>{dateRange || 'Select date range'}</span>
                <Calendar className="h-5 w-5 text-gray-400" />
              </button>
              
              {showDatePicker && (
                <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-300 p-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label htmlFor="startDate" className="block text-xs font-medium text-gray-700 mb-1">
                        Start Date
                      </label>
                      <input
                        type="date"
                        id="startDate"
                        value={startDate}
                        onChange={(e) => {
                          setStartDate(e.target.value);
                          if (e.target.value && endDate) {
                            setDateRange(`${e.target.value} to ${endDate}`);
                          }
                        }}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2A5F7F] focus:ring focus:ring-[#2A5F7F] focus:ring-opacity-50 py-1 px-2 border text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="endDate" className="block text-xs font-medium text-gray-700 mb-1">
                        End Date
                      </label>
                      <input
                        type="date"
                        id="endDate"
                        value={endDate}
                        onChange={(e) => {
                          setEndDate(e.target.value);
                          if (startDate && e.target.value) {
                            setDateRange(`${startDate} to ${e.target.value}`);
                          }
                        }}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2A5F7F] focus:ring focus:ring-[#2A5F7F] focus:ring-opacity-50 py-1 px-2 border text-sm"
                      />
                    </div>
                  </div>
                  <div className="mt-3 flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        setShowDatePicker(false);
                      }}
                      className="text-sm text-[#2A5F7F] hover:text-[#1e4b63] font-medium"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleGenerateReport}
              className="flex items-center bg-[#2A5F7F] text-white px-4 py-2 rounded-md hover:bg-[#1e4b63] transition-colors"
            >
              <FileText className="mr-2 h-5 w-5" />
              Generate Report
            </button>
          </div>
        </div>

        {reportType === 'room' && (
          <div className="mt-4">
            <label htmlFor="room" className="block text-sm font-medium text-gray-700 mb-1">
              Select Room
            </label>
            <select
              id="room"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2A5F7F] focus:ring focus:ring-[#2A5F7F] focus:ring-opacity-50 py-2 px-3 border"
            >
              <option value="">All Rooms</option>
              <option value="101">Room 101</option>
              <option value="102">Room 102</option>
              <option value="203">Room 203</option>
              <option value="305">Room 305</option>
            </select>
          </div>
        )}

        {reportType === 'mbp' && (
          <div className="mt-4">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Select Category
            </label>
            <select
              id="category"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2A5F7F] focus:ring focus:ring-[#2A5F7F] focus:ring-opacity-50 py-2 px-3 border"
            >
              <option value="">All Categories</option>
              <option value="office">Office Supplies</option>
              <option value="lab">Lab Equipment</option>
              <option value="health">Health & Safety</option>
            </select>
          </div>
        )}
      </div>

      {/* Report List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Recent Reports</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Report Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created By</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#2A5F7F]">{report.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.createdBy}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 space-x-2">
                    <button className="text-blue-600 hover:text-blue-800">
                      <Eye className="h-5 w-5" />
                    </button>
                    <div className="relative inline-block text-left">
                      <button className="text-[#2A5F7F] hover:text-[#1e4b63]">
                        <Download className="h-5 w-5" />
                      </button>
                      <div className="hidden origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="py-1">
                          <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Export as PDF</a>
                          <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Export as Excel</a>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Report Templates */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Report Templates</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-gray-800">Monthly Asset Summary</h3>
              <FileText className="h-5 w-5 text-[#2A5F7F]" />
            </div>
            <p className="text-sm text-gray-500 mb-4">Comprehensive overview of all assets with depreciation calculations.</p>
            <button className="text-sm text-[#2A5F7F] hover:text-[#1e4b63] font-medium">
              Generate Report
            </button>
          </div>
          
          <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-gray-800">MBP Usage Report</h3>
              <FileText className="h-5 w-5 text-[#2A5F7F]" />
            </div>
            <p className="text-sm text-gray-500 mb-4">Detailed analysis of MBP consumption and stock levels.</p>
            <button className="text-sm text-[#2A5F7F] hover:text-[#1e4b63] font-medium">
              Generate Report
            </button>
          </div>
          
          <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-gray-800">Room Inventory Audit</h3>
              <FileText className="h-5 w-5 text-[#2A5F7F]" />
            </div>
            <p className="text-sm text-gray-500 mb-4">Complete inventory listing by room with responsible persons.</p>
            <button className="text-sm text-[#2A5F7F] hover:text-[#1e4b63] font-medium">
              Generate Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;