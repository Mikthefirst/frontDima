import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Filter, 
  Download, 
  Edit, 
  Trash2,
  AlertTriangle
} from 'lucide-react';

interface MBPItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  expiryDate: string;
  lowStockThreshold: number;
}

const MBPSection: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  // Sample data
  const mbpItems: MBPItem[] = [
    {
      id: '1',
      name: 'Notebooks (A4)',
      category: 'Office Supplies',
      quantity: 120,
      expiryDate: 'N/A',
      lowStockThreshold: 50
    },
    {
      id: '2',
      name: 'Ballpoint Pens (Blue)',
      category: 'Office Supplies',
      quantity: 85,
      expiryDate: 'N/A',
      lowStockThreshold: 30
    },
    {
      id: '3',
      name: 'Printer Paper (A4)',
      category: 'Office Supplies',
      quantity: 8,
      expiryDate: 'N/A',
      lowStockThreshold: 10
    },
    {
      id: '4',
      name: 'Whiteboard Markers',
      category: 'Office Supplies',
      quantity: 45,
      expiryDate: 'N/A',
      lowStockThreshold: 20
    },
    {
      id: '5',
      name: 'Lab Gloves (Medium)',
      category: 'Lab Equipment',
      quantity: 200,
      expiryDate: '2025-06-30',
      lowStockThreshold: 50
    },
    {
      id: '6',
      name: 'Microscope Slides',
      category: 'Lab Equipment',
      quantity: 5,
      expiryDate: 'N/A',
      lowStockThreshold: 20
    },
    {
      id: '7',
      name: 'Hand Sanitizer (500ml)',
      category: 'Health & Safety',
      quantity: 15,
      expiryDate: '2025-12-31',
      lowStockThreshold: 10
    },
  ];

  const filteredItems = mbpItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === '' || item.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  const uniqueCategories = Array.from(new Set(mbpItems.map(item => item.category)));

  const isLowStock = (item: MBPItem) => {
    return item.quantity < item.lowStockThreshold;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">MBP Section</h1>
        <div className="flex space-x-2">
          <button className="flex items-center bg-[#2A5F7F] text-white px-4 py-2 rounded-md hover:bg-[#1e4b63] transition-colors">
            <Plus className="mr-2 h-5 w-5" />
            Add Batch
          </button>
          <button className="flex items-center bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors">
            <Trash2 className="mr-2 h-5 w-5" />
            Write Off
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2A5F7F] focus:ring focus:ring-[#2A5F7F] focus:ring-opacity-50 py-2 px-3 border"
            />
          </div>
          
          <div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2A5F7F] focus:ring focus:ring-[#2A5F7F] focus:ring-opacity-50 py-2 px-3 border"
            >
              <option value="">Filter by Category</option>
              {uniqueCategories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <div className="flex space-x-2">
            <button className="flex items-center bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors">
              <Filter className="mr-2 h-5 w-5" />
              More Filters
            </button>
            <button className="flex items-center bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors">
              <Download className="mr-2 h-5 w-5" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Low Stock Alert */}
      <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-amber-700">
              <span className="font-medium">Low Stock Alert:</span> 2 items are below the minimum threshold.
            </p>
          </div>
        </div>
      </div>

      {/* MBP Items Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredItems.map((item) => (
                <tr key={item.id} className={`hover:bg-gray-50 ${isLowStock(item) ? 'bg-red-50' : ''}`}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.category}</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${isLowStock(item) ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
                    {item.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.expiryDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {isLowStock(item) ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        Low Stock
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        In Stock
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 space-x-2">
                    <button className="text-blue-600 hover:text-blue-800">
                      <Edit className="h-5 w-5" />
                    </button>
                    <button className="text-red-600 hover:text-red-800">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredItems.length === 0 && (
          <div className="py-8 text-center text-gray-500">
            No items found matching your filters.
          </div>
        )}
      </div>

      {/* Usage Statistics */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Monthly Usage Statistics</h3>
        <div className="h-64 flex items-center justify-center">
          {/* This would be a real chart in a production app */}
          <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="space-y-4 w-full px-4">
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Office Supplies</span>
                  <span>65%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-[#2A5F7F] h-2.5 rounded-full" style={{ width: '65%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Lab Equipment</span>
                  <span>25%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-[#3d7ea1] h-2.5 rounded-full" style={{ width: '25%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Health & Safety</span>
                  <span>10%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-[#5096bd] h-2.5 rounded-full" style={{ width: '10%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MBPSection;