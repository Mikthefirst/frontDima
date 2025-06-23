import React, { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  AlertTriangle,
  PlusCircle,
} from "lucide-react";
import { MBP, MBPToRoom } from "./types";
import { fetchAllMBPs } from "./api/mbpApi";
import AssignMBPModal from "./components/modals/AssignMBPModal";
import UpdateQuantityModal from "./components/modals/UpdateQuantityModal";
import AddMBPModal from "./components/modals/AddMBPModal";
import MbpRoomTable from "./components/MbpRoomTable";

function MBP_Page() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [mbpItems, setMbpItems] = useState<MBP[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modals
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddMBPModalOpen, setIsAddMBPModalOpen] = useState(false);
  const [selectedMbpToRoom, setSelectedMbpToRoom] = useState<MBPToRoom | null>(
    null
  );

  // Refresh trigger for MbpRoomTable
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    loadMBPs();
  }, []);

  const loadMBPs = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAllMBPs();
      setMbpItems(data);
    } catch (err) {
      setError("Failed to load MBPs");
      console.error("Error loading MBPs:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadMBPs();
    setRefreshTrigger((prev) => prev + 1);
  };

  const filteredItems = mbpItems.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "" || item.category === filterCategory;

    return matchesSearch && matchesCategory;
  });

  const uniqueCategories = Array.from(
    new Set(mbpItems.map((item) => item.category))
  );

  const isLowStock = (item: MBP) => {
    return item.overallQuantity < item.minQuantity;
  };

  const lowStockCount = mbpItems.filter(isLowStock).length;

  const handleEditMbpInRoom = (mbpToRoom: MBPToRoom) => {
    setSelectedMbpToRoom(mbpToRoom);
    setIsUpdateModalOpen(true);
  };

  const handleDeleteMbpInRoom = (mbpToRoom: MBPToRoom) => {
    setSelectedMbpToRoom(mbpToRoom);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Управление МОЛ</h1>
          <div className="flex space-x-2">
            <button
              className="flex items-center bg-[#2A5F7F] text-white px-4 py-2 rounded-md hover:bg-[#1e4b63] transition-colors"
              onClick={() => setIsAssignModalOpen(true)}
            >
              <PlusCircle className="mr-2 h-5 w-5" />
              Назначить комнате
            </button>
            <button
              className="flex items-center bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
              onClick={() => setIsAddMBPModalOpen(true)}
            >
              <Plus className="mr-2 h-5 w-5" />
              Добавить МОЛ
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
                <option value="">Фильтр по категории</option>
                {uniqueCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Low Stock Alert */}
        {lowStockCount > 0 && (
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-amber-700">
                  <span className="font-medium">Низкий уровень запасов:</span>{" "}
                  {lowStockCount}{" "}
                  {lowStockCount === 1 ? "item is" : "items are"} ниже
                  минимального порога.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  <span className="font-medium">Error:</span> {error}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* MBP Items Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2A5F7F]"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Название
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Категория
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Количество
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Дата истечения
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Статус
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Действия
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredItems.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-6 py-4 text-center text-sm text-gray-500"
                      >
                        No items found matching your filters.
                      </td>
                    </tr>
                  ) : (
                    filteredItems.map((item) => (
                      <tr
                        key={item.id}
                        className={`hover:bg-gray-50 ${
                          isLowStock(item) ? "bg-red-50" : ""
                        }`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {item.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.category}
                        </td>
                        <td
                          className={`px-6 py-4 whitespace-nowrap text-sm ${
                            isLowStock(item)
                              ? "text-red-600 font-medium"
                              : "text-gray-500"
                          }`}
                        >
                          {item.overallQuantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.expiryDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {isLowStock(item) ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                              Низкое Количество
                            </span>
                          ) : (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Все ок
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
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* MBP Room Assignment Section */}
        <MbpRoomTable
          onEdit={handleEditMbpInRoom}
          onDelete={handleDeleteMbpInRoom}
          refreshTrigger={refreshTrigger}
        />

        {/* Usage Statistics */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Ежемесячная статистика использования{" "}
          </h3>
          <div className="h-64 flex items-center justify-center">
            <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="space-y-4 w-full px-4">
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Офисные</span>
                    <span>100%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-[#2A5F7F] h-2.5 rounded-full"
                      style={{ width: "100%" }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Лабораторное оборудование</span>
                    <span>0%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-[#3d7ea1] h-2.5 rounded-full"
                      style={{ width: "0%" }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Здоровье</span>
                    <span>0%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-[#5096bd] h-2.5 rounded-full"
                      style={{ width: "0%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AssignMBPModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        onSuccess={handleRefresh}
      />

      {isUpdateModalOpen && selectedMbpToRoom && (
        <UpdateQuantityModal
          isOpen={isUpdateModalOpen}
          onClose={() => {
            setIsUpdateModalOpen(false);
            setSelectedMbpToRoom(null);
          }}
          onSuccess={handleRefresh}
          mode="update"
        />
      )}

      {isDeleteModalOpen && selectedMbpToRoom && (
        <UpdateQuantityModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedMbpToRoom(null);
          }}
          onSuccess={handleRefresh}
          mode="delete"
        />
      )}

      <AddMBPModal
        isOpen={isAddMBPModalOpen}
        onClose={() => setIsAddMBPModalOpen(false)}
        onSuccess={handleRefresh}
      />
    </div>
  );
}

export default MBP_Page;
