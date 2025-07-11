import React, { useEffect, useState } from 'react';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2,
  X,
  AlertTriangle
} from 'lucide-react';
import { Asset, AssetFormData,  } from './types';
import { addAsset, deleteAsset, fetchAllRooms, fetchAssets, updateAsset } from './api';
import { Room } from '../MBP/types';



const AssetManagement: React.FC = () => {
  // State management
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRoom, setFilterRoom] = useState('');
  const [currentAsset, setCurrentAsset] = useState<Asset | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [assetToDelete, setAssetToDelete] = useState<Asset | null>(null);
  const [formData, setFormData] = useState<AssetFormData>({});
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);


  useEffect(() => {
    fetchAssets().then(setAssets).catch(console.error);
    fetchAllRooms().then(setRooms).catch(console.error);

  }, []);
  
  // Handle notifications
  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Filter assets based on search and filter criteria
  const filteredAssets = assets.filter((asset) => {
    const matchesSearch =
      asset.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRoom = filterRoom === "" || asset.room.name === filterRoom;

    return matchesSearch && matchesRoom;
  });
  
  const uniqueRooms = rooms.map((room) => room.name);

  // Handle edit button click
  const handleEditClick = (asset: Asset) => {
    setCurrentAsset(asset);
    setFormData({...asset});
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  // Handle delete button click
  const handleDeleteClick = (asset: Asset) => {
    setAssetToDelete(asset);
    setIsDeleteModalOpen(true);
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    
    setFormData({
      ...formData,
      [id]: id === 'value' ? parseFloat(value) : value
    });
  };

  // Handle add/edit form submission
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isEditMode && currentAsset) {


        const updatedAsset = await updateAsset(currentAsset.id, {
          name: formData.name || "",
          room_id: formData.room_id || rooms[0]?.id || "",
          depreciation: formData.depreciation || 0,
          acquisitionDate:
            formData.acquisitionDate || new Date().toISOString().split("T")[0],
          x: formData.x ?? 0,
          y: formData.y ?? 0,
          width: formData.width ?? 0.1,
          height: formData.height ?? 0.1,
          value: formData.value ?? 0,
        });

        const updatedAssets = assets.map((asset) =>
          asset.id === updatedAsset.id ? updatedAsset : asset
        );
        setAssets(updatedAssets);
        showNotification(
          `Asset ${formData.name} updated successfully`,
          "success"
        );
      } else {
        const newAsset = await addAsset({
          name: formData.name || "",
          room_id: formData.room_id || rooms[0]?.id || "",
          depreciation: formData.depreciation || 0,
          acquisitionDate:
            formData.acquisitionDate || new Date().toISOString().split("T")[0],
          x: formData.x ?? 0,
          y: formData.y ?? 0,
          width: formData.width ?? 0.1,
          height: formData.height ?? 0.1,
          value: formData.value
        });

        setAssets([...assets, newAsset]);
        showNotification(
          `Asset ${newAsset.name} added successfully`,
          "success"
        );
      }

      setIsModalOpen(false);
      setFormData({});
      setCurrentAsset(null);
      setIsEditMode(false);
    } catch (error) {
      showNotification("An error occurred while saving the asset", "error");
      console.error("Error saving asset:", error);
    }
  };
  

  // Handle asset deletion confirmation
  const confirmDelete = async () => {
    if (!assetToDelete) return;
    
    try {
      await deleteAsset(assetToDelete.id);

      const updatedAssets = assets.filter(asset => asset.id !== assetToDelete.id);
      setAssets(updatedAssets);
      setIsDeleteModalOpen(false);
      setAssetToDelete(null);
      showNotification(`Asset ${assetToDelete.name} deleted successfully`, 'success');
    } catch (error) {
      showNotification('An error occurred while deleting the asset', 'error');
      console.error('Error deleting asset:', error);
    }
  };

  // Handle modal close
  const handleModalClose = () => {
    setIsModalOpen(false);
    setFormData({});
    setCurrentAsset(null);
    setIsEditMode(false);
  };

  // Open modal for adding new asset
  const openAddModal = () => {
    setIsEditMode(false);
    setCurrentAsset(null);
    setFormData({});
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 p-6 max-w-[1600px] mx-auto">
      {/* Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 p-4 rounded-md shadow-lg z-50 max-w-md transition-all duration-300 ease-in-out transform translate-x-0 ${
            notification.type === "success"
              ? "bg-green-100 text-green-800 border-l-4 border-green-500"
              : "bg-red-100 text-red-800 border-l-4 border-red-500"
          }`}
        >
          <div className="flex items-center">
            {notification.type === "success" ? (
              <span className="flex-shrink-0 mr-2">✓</span>
            ) : (
              <AlertTriangle className="flex-shrink-0 mr-2 h-5 w-5" />
            )}
            <p>{notification.message}</p>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          Управление активами (УО)
        </h1>
        <button
          onClick={openAddModal}
          className="flex items-center bg-[#2A5F7F] text-white px-4 py-2 rounded-md hover:bg-[#1e4b63] transition-colors duration-300 transform hover:scale-105"
        >
          <Plus className="mr-2 h-5 w-5" />
          Добавить актив
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
              <option value="">Фильтровать по комнате</option>
              {uniqueRooms.map((room) => (
                <option key={room} value={room}>
                  {room}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Assets Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Название
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Место
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Дата добавления
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Цена
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Амортизация
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  X:
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Y:
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ширина:
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Высота:
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAssets.map((asset) => (
                <tr key={asset.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {asset.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {asset.room.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {asset.acquisitionDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${asset.value}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {asset.depreciation}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {asset.x}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {asset.y}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {asset.width}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {asset.height}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleEditClick(asset)}
                        className="text-blue-600 hover:text-blue-800 transition-colors duration-200 transform hover:scale-110"
                        aria-label="Edit asset"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(asset)}
                        className="text-red-600 hover:text-red-800 transition-colors duration-200 transform hover:scale-110"
                        aria-label="Delete asset"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
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

      {/* Add/Edit Asset Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fade-in-scale">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-800">
                {isEditMode ? "Edit Asset" : "Add New Asset"}
              </h2>
              <button
                onClick={handleModalClose}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6">
              <form className="space-y-4" onSubmit={handleFormSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Название
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2A5F7F] focus:ring focus:ring-[#2A5F7F] focus:ring-opacity-50 py-2 px-3 border"
                      placeholder="e.g., Dell XPS 15 Laptop"
                      value={formData.name || ""}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="room_id"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Место
                    </label>
                    <select
                      id="room_id"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2A5F7F] focus:ring focus:ring-[#2A5F7F] focus:ring-opacity-50 py-2 px-3 border"
                      value={formData.room_id || ""}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select a room</option>
                      {rooms.map((room) => (
                        <option key={room.id} value={room.id}>
                          {room.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label
                      htmlFor="x"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      X
                    </label>
                    <input
                      type="number"
                      id="x"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2A5F7F] focus:ring focus:ring-[#2A5F7F] focus:ring-opacity-50 py-2 px-3 border"
                      placeholder="e.g., 10"
                      value={formData.x || ""}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="y"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Y
                    </label>
                    <input
                      type="number"
                      id="y"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2A5F7F] focus:ring focus:ring-[#2A5F7F] focus:ring-opacity-50 py-2 px-3 border"
                      placeholder="e.g., 20"
                      value={formData.y || ""}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="width"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Ширина
                    </label>
                    <input
                      type="number"
                      id="width"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2A5F7F] focus:ring focus:ring-[#2A5F7F] focus:ring-opacity-50 py-2 px-3 border"
                      placeholder="e.g., 100"
                      value={formData.width || ""}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="height"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Место
                    </label>
                    <input
                      type="number"
                      id="height"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2A5F7F] focus:ring focus:ring-[#2A5F7F] focus:ring-opacity-50 py-2 px-3 border"
                      placeholder="e.g., 150"
                      value={formData.height || ""}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label
                      htmlFor="acquisitionDate"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Дата добавления
                    </label>
                    <input
                      type="date"
                      id="acquisitionDate"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2A5F7F] focus:ring focus:ring-[#2A5F7F] focus:ring-opacity-50 py-2 px-3 border"
                      value={formData.acquisitionDate || ""}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="value"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Цена ($)
                    </label>
                    <input
                      type="number"
                      id="value"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2A5F7F] focus:ring focus:ring-[#2A5F7F] focus:ring-opacity-50 py-2 px-3 border"
                      placeholder="e.g., 1200"
                      min="0"
                      step="0.01"
                      value={formData.value || ""}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="depreciation"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Амортизация (%)
                    </label>
                    <input
                      type="text"
                      id="depreciation"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2A5F7F] focus:ring focus:ring-[#2A5F7F] focus:ring-opacity-50 py-2 px-3 border"
                      placeholder="e.g., 25%"
                      value={formData.depreciation || ""}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="px-6 py-4 border-t flex justify-end space-x-3 mt-4">
                  <button
                    type="button"
                    onClick={handleModalClose}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#2A5F7F] text-white rounded-md hover:bg-[#1e4b63] transition-colors"
                  >
                    {isEditMode ? "Update Asset" : "Save Asset"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md animate-fade-in-down">
            <div className="p-6">
              <div className="flex items-center text-red-500 mb-4">
                <AlertTriangle className="h-8 w-8 mr-3" />
                <h3 className="text-lg font-semibold">Confirm Delete</h3>
              </div>
              <p className="text-gray-700 mb-6">
                Are you sure you want to delete the asset{" "}
                <span className="font-semibold">{assetToDelete?.name}</span>?
                This action cannot be undone.
              </p>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssetManagement;