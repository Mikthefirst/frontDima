import React, { useState, useEffect } from "react";
import {
  Building,
  Edit,
  Trash2,
  Plus,
  Search,
  ChevronRight,
  ChevronDown,
  Users,
  LayoutGrid,
  Check,
  X,
} from "lucide-react";

import { ApiError, User } from "../types/types";




interface Room {
  id: string;
  name: string;
  floor: string;
}

interface BuildingType {
  id: string;
  name: string;
  rooms: Room[];
}

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedBuildings, setExpandedBuildings] = useState<string[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [, setError] = useState<ApiError | null>(null);

  // State for editing
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const url = "http://localhost:3000/user";

        const response = await fetch(url, {
          credentials: "include",
          method: "GET",
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);
        setUsers(data);
        setError(null);
      } catch (err) {
        if (err instanceof Error) setError({ message: err.message });
        else {
          setError({ message: "An unknown error occurred" });
        }
      }
    };

    fetchUsers();
  }, []);

  const buildings: BuildingType[] = [
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
  ];

  const handleEdit = (user: User) => {
    setEditingUser({ ...user });
  };

  // Handle save edited user
  const handleSaveEdit = async () => {
    if (!editingUser) return;

    try {
      const response = await fetch(
        `http://localhost:3000/user/${editingUser.id}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editingUser),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedUser = await response.json();
      setUsers(
        users.map((user) => (user.id === updatedUser.id ? updatedUser : user))
      );
      setEditingUser(null);
    } catch (err) {
      if (err instanceof Error) setError({ message: err.message });
      else {
        setError({ message: "Failed to update user" });
      }
    }
  };

  // Handle delete confirmation
  const confirmDelete = async () => {
    if (!userToDelete) return;

    try {
      const response = await fetch(
        `http://localhost:3000/user/${userToDelete.id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setUsers(users.filter((user) => user.id !== userToDelete.id));
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    } catch (err) {
      if (err instanceof Error) setError({ message: err.message });
      else {
        setError({ message: "Failed to delete user" });
      }
    } 
  };

  const filteredUsers = users.filter((user) => {
    return (
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.full_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const toggleBuilding = (buildingId: string) => {
    if (expandedBuildings.includes(buildingId)) {
      setExpandedBuildings(expandedBuildings.filter((id) => id !== buildingId));
    } else {
      setExpandedBuildings([...expandedBuildings, buildingId]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab("users")}
              className={`py-4 px-6 flex items-center text-sm font-medium ${
                activeTab === "users"
                  ? "border-b-2 border-[#2A5F7F] text-[#2A5F7F]"
                  : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Users className="mr-2 h-5 w-5" />
              User Management
            </button>
            <button
              onClick={() => setActiveTab("buildings")}
              className={`py-4 px-6 flex items-center text-sm font-medium ${
                activeTab === "buildings"
                  ? "border-b-2 border-[#2A5F7F] text-[#2A5F7F]"
                  : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <LayoutGrid className="mr-2 h-5 w-5" />
              Building Directory
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "users" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <div className="relative w-64">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2A5F7F] focus:ring focus:ring-[#2A5F7F] focus:ring-opacity-50 py-2 px-3 border"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nickname
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fullname
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Assigned Rooms
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        {editingUser?.id === user.id ? (
                          <>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 bg-[#2A5F7F] rounded-full flex items-center justify-center text-white">
                                  {editingUser.username
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </div>
                                <div className="ml-4">
                                  <input
                                    type="text"
                                    value={editingUser.username}
                                    onChange={(e) =>
                                      setEditingUser({
                                        ...editingUser,
                                        username: e.target.value,
                                      })
                                    }
                                    className="text-sm font-medium text-gray-900 border rounded px-2 py-1"
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <input
                                type="text"
                                value={editingUser.full_name}
                                onChange={(e) =>
                                  setEditingUser({
                                    ...editingUser,
                                    full_name: e.target.value,
                                  })
                                }
                                className="text-sm text-black-500 border rounded px-2 py-1"
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <input
                                type="text"
                                value={editingUser.email}
                                onChange={(e) =>
                                  setEditingUser({
                                    ...editingUser,
                                    email: e.target.value,
                                  })
                                }
                                className="text-sm text-gray-500 border rounded px-2 py-1"
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <select
                                value={editingUser.role}
                                onChange={(e) =>
                                  setEditingUser({
                                    ...editingUser,
                                    role: e.target.value,
                                  })
                                }
                                className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 border"
                              >
                                <option value="teacher">Teacher</option>
                                <option value="mol">MOL</option>
                                <option value="admin">Admin</option>
                              </select>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <input
                                type="text"
                                value={editingUser.room_id || ""}
                                onChange={(e) =>
                                  setEditingUser({
                                    ...editingUser,
                                    room_id: e.target.value,
                                  })
                                }
                                className="text-sm text-gray-500 border rounded px-2 py-1"
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 space-x-2">
                              <button
                                onClick={handleSaveEdit}
                                className="text-green-600 hover:text-green-800"
                              >
                                <Check className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => setEditingUser(null)}
                                className="text-gray-600 hover:text-gray-800"
                              >
                                <X className="h-5 w-5" />
                              </button>
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 bg-[#2A5F7F] rounded-full flex items-center justify-center text-white">
                                  {user.username
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {user.username}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-black-500">
                              {user.full_name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {user.email}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                {user.role}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {user.room_id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 space-x-2">
                              <button
                                onClick={() => handleEdit(user)}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                <Edit className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => {
                                  setUserToDelete(user);
                                  setIsDeleteModalOpen(true);
                                }}
                                className="text-red-600 hover:text-red-800"
                              >
                                <Trash2 className="h-5 w-5" />
                              </button>
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Delete Confirmation Modal */}
              {isDeleteModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                  <div className="bg-white rounded-lg p-6 max-w-md w-full">
                    <h3 className="text-lg font-medium mb-4">
                      Confirm Deletion
                    </h3>
                    <p className="mb-6">
                      Are you sure you want to delete {userToDelete?.username}?
                    </p>
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => setIsDeleteModalOpen(false)}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={confirmDelete}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                      ></button>
                    </div>
                  </div>
                </div>
              )}
              {filteredUsers.length === 0 && (
                <div className="py-8 text-center text-gray-500">
                  No users found matching your search.
                </div>
              )}
            </div>
          )}

          {activeTab === "buildings" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-800">
                  Building Directory
                </h2>
                <div className="flex space-x-2">
                  <button className="flex items-center bg-[#2A5F7F] text-white px-4 py-2 rounded-md hover:bg-[#1e4b63] transition-colors">
                    <Plus className="mr-2 h-5 w-5" />
                    Add Building
                  </button>
                  <button className="flex items-center bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors">
                    <Plus className="mr-2 h-5 w-5" />
                    Add Room
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {buildings.map((building) => (
                  <div
                    key={building.id}
                    className="border rounded-lg overflow-hidden"
                  >
                    <div
                      className="bg-gray-50 px-4 py-3 flex justify-between items-center cursor-pointer"
                      onClick={() => toggleBuilding(building.id)}
                    >
                      <div className="flex items-center">
                        <Building className="h-5 w-5 text-[#2A5F7F] mr-2" />
                        <h3 className="font-medium text-gray-800">
                          {building.name}
                        </h3>
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
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
