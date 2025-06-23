import React, { useState, useEffect } from 'react';
import { MBP, Room } from '../../types';
import Modal from './Modal';
import { fetchAllMBPs, fetchAllRooms, assignMBPToRoom } from '../../api/mbpApi';

interface AssignMBPModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AssignMBPModal: React.FC<AssignMBPModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [mbps, setMbps] = useState<MBP[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedMbpId, setSelectedMbpId] = useState<string>('');
  const [selectedRoomId, setSelectedRoomId] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [mbpData, roomData] = await Promise.all([
        fetchAllMBPs(),
        fetchAllRooms()
      ]);
      setMbps(mbpData);
      setRooms(roomData);
      
      // Set defaults
      if (mbpData.length > 0) setSelectedMbpId(mbpData[0].id);
      if (roomData.length > 0) setSelectedRoomId(roomData[0].id);
    } catch (err) {
      setError('Failed to load data. Please try again.');
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMbpId || !selectedRoomId || quantity <= 0) {
      setError('Please fill all fields correctly');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await assignMBPToRoom(selectedMbpId, selectedRoomId, quantity);
      onSuccess();
      onClose();
    } catch (err) {
      setError('Failed to assign MBP to room. Please try again.');
      console.error('Error assigning MBP to room:', err);
    } finally {
      setLoading(false);
    }
  };

  const selectedMbp = mbps.find(mbp => mbp.id === selectedMbpId);
  const maxQuantity = selectedMbp ? selectedMbp.overallQuantity : 0;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Назначить МОЛ комнате"
      maxWidth="max-w-lg"
    >
      {loading && !error && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2A5F7F]"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {!loading && (
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Выбрать МОЛ
              </label>
              <select
                value={selectedMbpId}
                onChange={(e) => setSelectedMbpId(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2A5F7F] focus:ring focus:ring-[#2A5F7F] focus:ring-opacity-50 py-2 px-3 border"
                disabled={loading || mbps.length === 0}
              >
                {mbps.length === 0 && (
                  <option value="">No MBPs available</option>
                )}
                {mbps.map((mbp) => (
                  <option key={mbp.id} value={mbp.id}>
                    {mbp.name} ({mbp.category}) - Available: {mbp.overallQuantity}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Выбрать комнату
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Количество
              </label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Math.min(maxQuantity, parseInt(e.target.value) || 0)))}
                min="1"
                max={maxQuantity}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2A5F7F] focus:ring focus:ring-[#2A5F7F] focus:ring-opacity-50 py-2 px-3 border"
                disabled={loading}
              />
              {selectedMbp && (
                <p className="mt-1 text-sm text-gray-500">
                  Доступно: {selectedMbp.overallQuantity}
                </p>
              )}
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="bg-white text-gray-700 px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50 transition-colors"
                disabled={loading}
              >
                Отменить
              </button>
              <button
                type="submit"
                className="bg-[#2A5F7F] text-white px-4 py-2 rounded-md hover:bg-[#1e4b63] transition-colors disabled:bg-gray-400"
                disabled={loading || !selectedMbpId || !selectedRoomId || quantity <= 0}
              >
                Назначить
              </button>
            </div>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default AssignMBPModal;