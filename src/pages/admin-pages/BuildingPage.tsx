import React, { useState } from "react";
import {
  Building,
  Edit,
  Trash2,
  Plus,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { BuildingType, Room } from "../../types/types";

const BuildingPage: React.FC = () => {
  const [expandedBuildings, setExpandedBuildings] = useState<string[]>([]);
  const [buildings, setBuildings] = useState<BuildingType[]>([
    {
      id: "1",
      name: "Main Building",
      rooms: [
        { id: "101", name: "Room 101", floor: "1st Floor" },
        { id: "102", name: "Room 102", floor: "1st Floor" },
        { id: "103", name: "Room 103", floor: "1st Floor" },
        { id: "201", name: "Room 201", floor: "2nd Floor" },
        { id: "202", name: "Room 202", floor: "2nd Floor" },
        { id: "203", name: "Room 203", floor: "2nd Floor" },
      ],
    },
    {
      id: "2",
      name: "Science Building",
      rooms: [
        { id: "301", name: "Lab 301", floor: "3rd Floor" },
        { id: "302", name: "Lab 302", floor: "3rd Floor" },
        { id: "303", name: "Lab 303", floor: "3rd Floor" },
        { id: "401", name: "Lab 401", floor: "4th Floor" },
        { id: "402", name: "Lab 402", floor: "4th Floor" },
      ],
    },
    {
      id: "3",
      name: "Library",
      rooms: [
        { id: "501", name: "Reading Room", floor: "1st Floor" },
        { id: "502", name: "Study Area", floor: "1st Floor" },
        { id: "503", name: "Archives", floor: "Basement" },
      ],
    },
  ]);
  const [isAddBuildingModalOpen, setIsAddBuildingModalOpen] = useState(false);
  const [isAddRoomModalOpen, setIsAddRoomModalOpen] = useState(false);
  const [isEditRoomModalOpen, setIsEditRoomModalOpen] = useState(false);
  const [isDeleteRoomModalOpen, setIsDeleteRoomModalOpen] = useState(false);
  const [newBuildingName, setNewBuildingName] = useState("");
  const [newRoom, setNewRoom] = useState({
    name: "",
    floor: "",
    buildingId: "",
  });
  const [editingRoom, setEditingRoom] = useState<{
    room: Room;
    buildingId: string;
  } | null>(null);
  const [roomToDelete, setRoomToDelete] = useState<{
    room: Room;
    buildingId: string;
  } | null>(null);

  const toggleBuilding = (buildingId: string) => {
    if (expandedBuildings.includes(buildingId)) {
      setExpandedBuildings(expandedBuildings.filter((id) => id !== buildingId));
    } else {
      setExpandedBuildings([...expandedBuildings, buildingId]);
    }
  };

  const handleAddBuilding = () => {
    if (newBuildingName.trim()) {
      const newBuilding: BuildingType = {
        id: `building-${Date.now()}`,
        name: newBuildingName,
        rooms: [],
      };
      setBuildings([...buildings, newBuilding]);
      setNewBuildingName("");
      setIsAddBuildingModalOpen(false);
    }
  };

  const handleAddRoom = () => {
    if (newRoom.name.trim() && newRoom.floor.trim() && newRoom.buildingId) {
      const updatedBuildings = buildings.map((building) => {
        if (building.id === newRoom.buildingId) {
          return {
            ...building,
            rooms: [
              ...building.rooms,
              {
                id: `room-${Date.now()}`,
                name: newRoom.name,
                floor: newRoom.floor,
              },
            ],
          };
        }
        return building;
      });
      setBuildings(updatedBuildings);
      setNewRoom({ name: "", floor: "", buildingId: "" });
      setIsAddRoomModalOpen(false);
    }
  };

  const handleEditRoom = () => {
    if (!editingRoom) return;

    const updatedBuildings = buildings.map((building) => {
      if (building.id === editingRoom.buildingId) {
        return {
          ...building,
          rooms: building.rooms.map((room) =>
            room.id === editingRoom.room.id ? editingRoom.room : room
          ),
        };
      }
      return building;
    });

    setBuildings(updatedBuildings);
    setEditingRoom(null);
    setIsEditRoomModalOpen(false);
  };

  const handleDeleteRoom = () => {
    if (!roomToDelete) return;

    const updatedBuildings = buildings.map((building) => {
      if (building.id === roomToDelete.buildingId) {
        return {
          ...building,
          rooms: building.rooms.filter(
            (room) => room.id !== roomToDelete.room.id
          ),
        };
      }
      return building;
    });

    setBuildings(updatedBuildings);
    setRoomToDelete(null);
    setIsDeleteRoomModalOpen(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-800">
          Building Directory
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setIsAddBuildingModalOpen(true)}
            className="flex items-center bg-[#2A5F7F] text-white px-4 py-2 rounded-md hover:bg-[#1e4b63] transition-colors"
          >
            <Plus className="mr-2 h-5 w-5" />
            Add Building
          </button>
          <button
            onClick={() => setIsAddRoomModalOpen(true)}
            className="flex items-center bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
          >
            <Plus className="mr-2 h-5 w-5" />
            Add Room
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {buildings.map((building) => (
          <div key={building.id} className="border rounded-lg overflow-hidden">
            <div
              className="bg-gray-50 px-4 py-3 flex justify-between items-center cursor-pointer"
              onClick={() => toggleBuilding(building.id)}
            >
              <div className="flex items-center">
                <Building className="h-5 w-5 text-[#2A5F7F] mr-2" />
                <h3 className="font-medium text-gray-800">{building.name}</h3>
                <span className="ml-2 text-sm text-gray-500">
                  ({building.rooms.length} rooms)
                </span>
              </div>
              {expandedBuildings.includes(building.id) ? (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronRight className="h-5 w-5 text-gray-500" />
              )}
            </div>

            {expandedBuildings.includes(building.id) && (
              <div className="p-4">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Room
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Floor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {building.rooms.map((room) => (
                      <tr key={room.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {room.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {room.floor}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 space-x-2">
                          <button
                            onClick={() => {
                              setEditingRoom({
                                room: { ...room },
                                buildingId: building.id,
                              });
                              setIsEditRoomModalOpen(true);
                            }}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => {
                              setRoomToDelete({
                                room,
                                buildingId: building.id,
                              });
                              setIsDeleteRoomModalOpen(true);
                            }}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Building Modal */}
      {isAddBuildingModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Add New Building</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Building Name
              </label>
              <input
                type="text"
                value={newBuildingName}
                onChange={(e) => setNewBuildingName(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2A5F7F]"
                placeholder="Enter building name"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsAddBuildingModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddBuilding}
                className="px-4 py-2 bg-[#2A5F7F] text-white rounded-md hover:bg-[#1e4b63]"
              >
                Add Building
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Room Modal */}
      {isAddRoomModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Add New Room</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Building
                </label>
                <select
                  value={newRoom.buildingId}
                  onChange={(e) =>
                    setNewRoom({ ...newRoom, buildingId: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2A5F7F]"
                >
                  <option value="">Select a building</option>
                  {buildings.map((building) => (
                    <option key={building.id} value={building.id}>
                      {building.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Room Name
                </label>
                <input
                  type="text"
                  value={newRoom.name}
                  onChange={(e) =>
                    setNewRoom({ ...newRoom, name: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2A5F7F]"
                  placeholder="Enter room name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Floor
                </label>
                <input
                  type="text"
                  value={newRoom.floor}
                  onChange={(e) =>
                    setNewRoom({ ...newRoom, floor: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2A5F7F]"
                  placeholder="Enter floor (e.g., 1st Floor)"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setIsAddRoomModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddRoom}
                className="px-4 py-2 bg-[#2A5F7F] text-white rounded-md hover:bg-[#1e4b63]"
              >
                Add Room
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Room Modal */}
      {isEditRoomModalOpen && editingRoom && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Edit Room</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Room Name
                </label>
                <input
                  type="text"
                  value={editingRoom.room.name}
                  onChange={(e) =>
                    setEditingRoom({
                      ...editingRoom,
                      room: { ...editingRoom.room, name: e.target.value },
                    })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2A5F7F]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Floor
                </label>
                <input
                  type="text"
                  value={editingRoom.room.floor}
                  onChange={(e) =>
                    setEditingRoom({
                      ...editingRoom,
                      room: { ...editingRoom.room, floor: e.target.value },
                    })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2A5F7F]"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setIsEditRoomModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleEditRoom}
                className="px-4 py-2 bg-[#2A5F7F] text-white rounded-md hover:bg-[#1e4b63]"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Room Confirmation Modal */}
      {isDeleteRoomModalOpen && roomToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Delete Room</h3>
            <p className="mb-6">
              Are you sure you want to delete {roomToDelete.room.name}? This
              action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsDeleteRoomModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteRoom}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete Room
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuildingPage;
