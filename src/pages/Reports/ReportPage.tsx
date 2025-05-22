import React, { useState, useEffect } from 'react';
import ReportForm from './components/ReportForm';
import ReportTable from './components/ReportTable';
import Navbar from './components/Navbar';
import { api } from './api';
import { Report } from './types';

const ReportPage: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const fetchReports = async () => {
    try {
      setLoading(true);
      const reportsData = await api.getAllReports();
      setReports(reportsData);
      setError('');
    } catch (error) {
      console.error('Failed to fetch reports:', error);
      setError('Failed to load reports. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchReports();
  }, []);
  
  const handleReportCreated = () => {
    fetchReports();
  };
  
  const handleReportClosed = () => {
    fetchReports();
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <ReportForm onReportCreated={handleReportCreated} />
          
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
              {error}
              <button 
                onClick={fetchReports}
                className="ml-2 underline text-red-800 hover:text-red-900"
              >
                Try again
              </button>
            </div>
          )}
          
          <ReportTable 
            reports={reports} 
            onReportClosed={handleReportClosed} 
            loading={loading} 
          />
        </div>
      </main>
    </div>
  );
};

export default ReportPage;