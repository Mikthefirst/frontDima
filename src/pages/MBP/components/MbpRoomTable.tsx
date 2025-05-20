import React, { useState, useEffect } from 'react';
import { MBPToRoom, Room } from '../types';
import { fetchAllRooms, fetchMBPsByRoom } from '../api/mbpApi';
import { Edit, Trash2 } from 'lucide-react';

interface MbpRoomTableProps {
  onEdit: (mbpToRoom: MBPToRoom) => void;
  onDelete: (mbpToRoom: MBPToRoom) => void;
  refreshTrigger: number;
}

const MbpRoomTable: React.FC<MbpRoomTableProps> = ({ onEdit, onDelete, refreshTrigger }) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<string>('');
  const [mbpsInRoom, setMbpsInRoom] = useState<MBPToRoom[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRooms();
  }, [refreshTrigger]);

  useEffect(() => {
    if (selectedRoomId) {
      loadMbpsInRoom(selectedRoomId);
    }
  }, [selectedRoomId, refreshTrigger]);

  const loadRooms = async () => {
    setLoading(true);
    setError(null);
    try {
      const roomData = await fetchAllRooms();
      setRooms(roomData);
      
      // Set default if not already selected or if the currently selected room is not in the list
      if (!selectedRoomId || !roomData.some(room => room.id === selectedRoomId)) {
        if (roomData.length > 0) {
          setSelectedRoomId(roomData[0].id);
        }
      }
    } catch (err) {
      setError('Failed to load rooms');
      console.error('Error loading rooms:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadMbpsInRoom = async (roomId: string) => {
    setLoading(true);
    setError(null);
    try {
      const mbpsData = await fetchMBPsByRoom(roomId);
      setMbpsInRoom(mbpsData);
    } catch (err) {
      setError('Failed to load MBPs in room');
      console.error('Error loading MBPs in room:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">MBPs by Room</h3>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Select Room
        </label>
        <select
          value={selectedRoomId}
          onChange={(e) => setSelectedRoomId(e.target.value)}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2A5F7F] focus:ring focus:ring-[#2A5F7F] focus:ring-opacity-50 py-2 px-3 border"
          disabled={loading || rooms.length === 0}
        >
          {rooms.length === 0 && (
            <option value="">No rooms available</option>
          )}
          {rooms.map((room) => (
            <option key={room.id} value={room.id}>
              {room.name} ({room.type})
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2A5F7F]"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mbpsInRoom.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                    No MBPs assigned to this room
                  </td>
                </tr>
              ) : (
                mbpsInRoom.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.mbp.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.mbp.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 space-x-2">
                      <button
                        onClick={() => onEdit(item)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => onDelete(item)}
                        className="text-red-600 hover:text-red-800"
                      >
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
  );
};

export default MbpRoomTable;