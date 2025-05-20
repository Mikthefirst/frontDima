import React, { useState, useEffect } from 'react';
import { MBP, Room, MBPToRoom } from '../../types';
import Modal from './Modal';
import { fetchAllRooms, fetchMBPsByRoom, updateMBPQuantityInRoom } from '../../api/mbpApi';

interface UpdateQuantityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  mode: 'update' | 'delete';
}

const UpdateQuantityModal: React.FC<UpdateQuantityModalProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess,
  mode
}) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<string>('');
  const [mbpsInRoom, setMbpsInRoom] = useState<MBPToRoom[]>([]);
  const [selectedMbpToRoomId, setSelectedMbpToRoomId] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingMbps, setLoadingMbps] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const title = mode === 'update' ? 'Update MBP Quantity' : 'Remove MBP from Room';

  useEffect(() => {
    if (isOpen) {
      loadRooms();
    }
  }, [isOpen]);

  useEffect(() => {
    if (selectedRoomId) {
      loadMbpsInRoom(selectedRoomId);
    }
  }, [selectedRoomId]);

  useEffect(() => {
    if (selectedMbpToRoomId && mbpsInRoom.length > 0) {
      const selected = mbpsInRoom.find(item => item.id === selectedMbpToRoomId);
      if (selected) {
        setQuantity(mode === 'delete' ? 0 : selected.quantity);
      }
    }
  }, [selectedMbpToRoomId, mbpsInRoom, mode]);

  const loadRooms = async () => {
    setLoading(true);
    setError(null);
    try {
      const roomData = await fetchAllRooms();
      setRooms(roomData);
      
      // Set default
      if (roomData.length > 0) {
        setSelectedRoomId(roomData[0].id);
      }
    } catch (err) {
      setError('Failed to load rooms. Please try again.');
      console.error('Error loading rooms:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadMbpsInRoom = async (roomId: string) => {
    setLoadingMbps(true);
    setError(null);
    setMbpsInRoom([]);
    setSelectedMbpToRoomId('');
    
    try {
      const mbpsData = await fetchMBPsByRoom(roomId);
      setMbpsInRoom(mbpsData);
      
      // Set default
      if (mbpsData.length > 0) {
        setSelectedMbpToRoomId(mbpsData[0].id);
      }
    } catch (err) {
      setError('Failed to load MBPs in room. Please try again.');
      console.error('Error loading MBPs in room:', err);
    } finally {
      setLoadingMbps(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMbpToRoomId) {
      setError('Please select an MBP');
      return;
    }

    if (mode === 'update' && quantity <= 0) {
      setError('Quantity must be greater than 0');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // For delete, we set quantity to 0
      const newQuantity = mode === 'delete' ? 0 : quantity;
      await updateMBPQuantityInRoom(selectedMbpToRoomId, newQuantity);
      onSuccess();
      onClose();
    } catch (err) {
      setError(`Failed to ${mode === 'update' ? 'update' : 'remove'} MBP quantity. Please try again.`);
      console.error('Error updating MBP quantity:', err);
    } finally {
      setLoading(false);
    }
  };

  const selectedMbpToRoom = mbpsInRoom.find(item => item.id === selectedMbpToRoomId);

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={title}
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select MBP
              </label>
              {loadingMbps ? (
                <div className="flex items-center space-x-2 py-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#2A5F7F]"></div>
                  <span className="text-sm text-gray-500">Loading MBPs...</span>
                </div>
              ) : (
                <select
                  value={selectedMbpToRoomId}
                  onChange={(e) => setSelectedMbpToRoomId(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2A5F7F] focus:ring focus:ring-[#2A5F7F] focus:ring-opacity-50 py-2 px-3 border"
                  disabled={loading || mbpsInRoom.length === 0}
                >
                  {mbpsInRoom.length === 0 && (
                    <option value="">No MBPs in this room</option>
                  )}
                  {mbpsInRoom.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.mbp.name} - Current Qty: {item.quantity}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {mode === 'update' && selectedMbpToRoom && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Quantity
                </label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 0))}
                  min="1"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2A5F7F] focus:ring focus:ring-[#2A5F7F] focus:ring-opacity-50 py-2 px-3 border"
                  disabled={loading || !selectedMbpToRoomId}
                />
                <p className="mt-1 text-sm text-gray-500">
                  Current quantity: {selectedMbpToRoom.quantity}
                </p>
              </div>
            )}

            {mode === 'delete' && selectedMbpToRoom && (
              <div className="bg-red-50 p-4 rounded-md">
                <p className="text-sm text-red-700">
                  Are you sure you want to remove <span className="font-semibold">{selectedMbpToRoom.mbp.name}</span> from <span className="font-semibold">{selectedMbpToRoom.room.name}</span>?
                </p>
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="bg-white text-gray-700 px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50 transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`${
                  mode === 'delete' 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-[#2A5F7F] hover:bg-[#1e4b63]'
                } text-white px-4 py-2 rounded-md transition-colors disabled:bg-gray-400`}
                disabled={loading || !selectedMbpToRoomId || (mode === 'update' && quantity <= 0)}
              >
                {mode === 'update' ? 'Update Quantity' : 'Remove MBP'}
              </button>
            </div>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default UpdateQuantityModal;