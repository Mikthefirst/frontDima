import React, { useState } from 'react';
import { Report, ReportStatus, UrgencyLevel } from '../types';
import { api } from '../api';

interface ReportTableProps {
  reports: Report[];
  onReportClosed: () => void;
  loading: boolean;
}

const ReportTable: React.FC<ReportTableProps> = ({ reports, onReportClosed, loading }) => {
  const [closingReportId, setClosingReportId] = useState<string | null>(null);

  const getUrgencyBadge = (urgency: UrgencyLevel) => {
    const classes = {
      LOW: 'bg-blue-100 text-blue-800',
      MEDIUM: 'bg-yellow-100 text-yellow-800',
      HIGH: 'bg-red-100 text-red-800',
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${classes[urgency]}`}>
        {urgency}
      </span>
    );
  };
  
  const getStatusBadge = (status: ReportStatus) => {
    const classes = {
      OPEN: 'bg-green-100 text-green-800',
      IN_PROGRESS: 'bg-purple-100 text-purple-800',
      CLOSED: 'bg-gray-100 text-gray-800',
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${classes[status]}`}>
        {status}
      </span>
    );
  };
  
  const handleCloseReport = async (reportId: string) => {
    setClosingReportId(reportId);
    try {
      await api.closeReport(reportId);
      onReportClosed();
    } catch (error) {
      console.error('Failed to close report:', error);
      alert('Failed to close report. Please try again.');
    } finally {
      setClosingReportId(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Тех Отчеты</h2>
      </div>

      <div className="overflow-x-auto">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#2A5F7F]"></div>
            <p className="mt-2 text-gray-500">Loading reports...</p>
          </div>
        ) : reports.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No reports found. Create a new report to get started.
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Reason
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Description
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Urgency
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Created Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Room
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Asset
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  MBP
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reports.map((report) => (
                <tr
                  key={report.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {report.reason}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                    {report.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {getUrgencyBadge(report.urgency)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {getStatusBadge(report.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(report.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {report.room?.name || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {report.asset?.name || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {report.mbp?.name || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {report.status !== "CLOSED" ? (
                      <button
                        onClick={() => handleCloseReport(report.id)}
                        disabled={closingReportId === report.id}
                        className="text-[#2A5F7F] hover:text-[#1e4b63] font-medium disabled:text-gray-400 disabled:cursor-not-allowed"
                      >
                        {closingReportId === report.id
                          ? "Closing..."
                          : "Close Report"}
                      </button>
                    ) : (
                      <span className="text-gray-400">Closed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ReportTable;