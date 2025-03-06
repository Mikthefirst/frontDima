import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Filter, 
  Download, 
  Edit, 
  Trash2,
  X,
  Upload
} from 'lucide-react';

interface Asset {
  id: string;
  inventoryNo: string;
  name: string;
  location: string;
  responsiblePerson: string;
  depreciation: string;
  purchaseDate: string;
  value: number;
}

const AssetManagement: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRoom, setFilterRoom] = useState('');
  const [filterPerson, setFilterPerson] = useState('');

  // Sample data
  const assets: Asset[] = [
    {
      id: '1',
      inventoryNo: '01360776',
      name: 'Dell XPS 15 Laptop',
      location: 'Room 101',
      responsiblePerson: 'John Smith',
      depreciation: '25%',
      purchaseDate: '2023-01-15',
      value: 1200
    },
    {
      id: '2',
      inventoryNo: '01360777',
      name: 'HP LaserJet Printer',
      location: 'Room 102',
      responsiblePerson: 'Sarah Johnson',
      depreciation: '30%',
      purchaseDate: '2022-11-05',
      value: 450
    },
    {
      id: '3',
      inventoryNo: '01360778',
      name: 'Projector Epson EB-X51',
      location: 'Room 203',
      responsiblePerson: 'Michael Brown',
      depreciation: '15%',
      purchaseDate: '2023-03-22',
      value: 650
    },
    {
      id: '4',
      inventoryNo: '01360779',
      name: 'Conference Table',
      location: 'Room 305',
      responsiblePerson: 'Emily Davis',
      depreciation: '10%',
      purchaseDate: '2022-08-17',
      value: 800
    },
    {
      id: '5',
      inventoryNo: '01360780',
      name: 'Office Chair (Ergonomic)',
      location: 'Room 101',
      responsiblePerson: 'John Smith',
      depreciation: '20%',
      purchaseDate: '2023-02-08',
      value: 250
    },
    {
      id: '6',
      inventoryNo: '01360781',
      name: 'Whiteboard (Large)',
      location: 'Room 203',
      responsiblePerson: 'Michael Brown',
      depreciation: '5%',
      purchaseDate: '2023-04-10',
      value: 180
    },
  ];

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          asset.inventoryNo.includes(searchTerm);
    const matchesRoom = filterRoom === '' || asset.location === filterRoom;
    const matchesPerson = filterPerson === '' || asset.responsiblePerson === filterPerson;
    
    return matchesSearch && matchesRoom && matchesPerson;
  });

  const uniqueRooms = Array.from(new Set(assets.map(asset => asset.location)));
  const uniquePersons = Array.from(new Set(assets.map(asset => asset.responsiblePerson)));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Asset Management (UOS)</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center bg-[#2A5F7F] text-white px-4 py-2 rounded-md hover:bg-[#1e4b63] transition-colors"
        >
          <Plus className="mr-2 h-5 w-5" />
          Add Asset
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name or inventory no."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2A5F7F] focus:ring focus:ring-[#2A5F7F] focus:ring-opacity-50 py-2 px-3 border"
            />
          </div>
          
          <div>
            <select
              value={filterRoom}
              onChange={(e) => setFilterRoom(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2A5F7F] focus:ring focus:ring-[#2A5F7F] focus:ring-opacity-50 py-2 px-3 border"
            >
              <option value="">Filter by Room</option>
              {uniqueRooms.map(room => (
                <option key={room} value={room}>{room}</option>
              ))}
            </select>
          </div>
          
          <div>
            <select
              value={filterPerson}
              onChange={(e) => setFilterPerson(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2A5F7F] focus:ring focus:ring-[#2A5F7F] focus:ring-opacity-50 py-2 px-3 border"
            >
              <option value="">Filter by Responsible Person</option>
              {uniquePersons.map(person => (
                <option key={person} value={person}>{person}</option>
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

      {/* Assets Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inventory No.</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Responsible Person</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purchase Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Depreciation</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAssets.map((asset) => (
                <tr key={asset.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#2A5F7F]">{asset.inventoryNo}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{asset.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{asset.location}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{asset.responsiblePerson}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{asset.purchaseDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${asset.value.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{asset.depreciation}</td>
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
        {filteredAssets.length === 0 && (
          <div className="py-8 text-center text-gray-500">
            No assets found matching your filters.
          </div>
        )}
      </div>

      {/* Add Asset Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-800">Add New Asset</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6">
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="inventoryNo" className="block text-sm font-medium text-gray-700 mb-1">
                      Inventory Number
                    </label>
                    <input
                      type="text"
                      id="inventoryNo"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2A5F7F] focus:ring focus:ring-[#2A5F7F] focus:ring-opacity-50 py-2 px-3 border"
                      placeholder="e.g., 01360782"
                    />
                  </div>
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Asset Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2A5F7F] focus:ring focus:ring-[#2A5F7F] focus:ring-opacity-50 py-2 px-3 border"
                      placeholder="e.g., Dell XPS 15 Laptop"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <select
                      id="location"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2A5F7F] focus:ring focus:ring-[#2A5F7F] focus:ring-opacity-50 py-2 px-3 border"
                    >
                      <option value="">Select a room</option>
                      {uniqueRooms.map(room => (
                        <option key={room} value={room}>{room}</option>
                      ))}
                      <option value="new">+ Add New Room</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="responsiblePerson" className="block text-sm font-medium text-gray-700 mb-1">
                      Responsible Person
                    </label>
                    <select
                      id="responsiblePerson"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2A5F7F] focus:ring focus:ring-[#2A5F7F] focus:ring-opacity-50 py-2 px-3 border"
                    >
                      <option value="">Select a person</option>
                      {uniquePersons.map(person => (
                        <option key={person} value={person}>{person}</option>
                      ))}
                      <option value="new">+ Add New Person</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="purchaseDate" className="block text-sm font-medium text-gray-700 mb-1">
                      Purchase Date
                    </label>
                    <input
                      type="date"
                      id="purchaseDate"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2A5F7F] focus:ring focus:ring-[#2A5F7F] focus:ring-opacity-50 py-2 px-3 border"
                    />
                  </div>
                  <div>
                    <label htmlFor="value" className="block text-sm font-medium text-gray-700 mb-1">
                      Value ($)
                    </label>
                    <input
                      type="number"
                      id="value"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2A5F7F] focus:ring focus:ring-[#2A5F7F] focus:ring-opacity-50 py-2 px-3 border"
                      placeholder="e.g., 1200"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    rows={3}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2A5F7F] focus:ring focus:ring-[#2A5F7F] focus:ring-opacity-50 py-2 px-3 border"
                    placeholder="Enter asset description..."
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Asset Image
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-[#2A5F7F] hover:text-[#1e4b63]"
                        >
                          <span>Upload a file</span>
                          <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div className="px-6 py-4 border-t flex justify-end space-x-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-[#2A5F7F] text-white rounded-md hover:bg-[#1e4b63]"
              >
                Save Asset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssetManagement;