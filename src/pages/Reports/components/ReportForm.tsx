import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { Room, Asset, MBP, UrgencyLevel, CreateReportPayload } from '../types';

interface ReportFormProps {
  onReportCreated: () => void;
}

const ReportForm: React.FC<ReportFormProps> = ({ onReportCreated }) => {
  // Form state
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [roomId, setRoomId] = useState('');
  const [assetId, setAssetId] = useState('');
  const [mbpId, setMbpId] = useState('');
  const [urgency, setUrgency] = useState<UrgencyLevel>("medium");
  
  // Data state
  const [rooms, setRooms] = useState<Room[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [mbps, setMbps] = useState<MBP[]>([]);
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Fetch rooms on component mount
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const roomsData = await api.getAllRooms();
        setRooms(roomsData);
      } catch (error) {
        console.error('Failed to fetch rooms:', error);
        setFormError('Failed to load rooms. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchRooms();
  }, []);
  
  // Fetch assets and MBPs when room is selected
  useEffect(() => {
    if (!roomId) {
      setAssets([]);
      setMbps([]);
      return;
    }
    
    const fetchRoomData = async () => {
      setLoading(true);
      try {
        // Fetch room assets and MBPs in parallel
        const [roomWithAssetsData, mbpsData] = await Promise.all([
          api.getRoomWithAssets(roomId),
          api.getMBPsByRoom(roomId)
        ]);
        console.log('room selected request:', roomWithAssetsData, mbpsData);
        
        setAssets(roomWithAssetsData || []);
        setMbps(mbpsData || []);
      } catch (error) {
        console.error('Failed to fetch room data:', error);
        setFormError('Failed to load room details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchRoomData();
  }, [roomId]);
  
  const resetForm = () => {
    setReason('');
    setDescription('');
    setRoomId('');
    setAssetId('');
    setMbpId('');
    setUrgency("medium");
    setFormError('');
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reason.trim()) {
      setFormError('Reason is required');
      return;
    }
    
    if (!description.trim()) {
      setFormError('Description is required');
      return;
    }
    
    if (!roomId) {
      setFormError('Room selection is required');
      return;
    }
    
    const reportData: CreateReportPayload = {
      reason,
      description,
      roomId,
      urgency,
    };
    
    if (assetId) {
      reportData.assetId = assetId;
    }
    
    if (mbpId) {
      reportData.mbpId = mbpId;
    }
    
    setIsSubmitting(true);
    setFormError('');
    
    try {
      await api.createReport(reportData);
      resetForm();
      onReportCreated();
    } catch (error) {
      console.error('Failed to create report:', error);
      setFormError('Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Новый отчет по техническому обслуживанию{" "}
      </h2>

      {formError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
          {formError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="reason"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Причина
          </label>
          <input
            type="text"
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2A5F7F] focus:ring focus:ring-[#2A5F7F] focus:ring-opacity-50 py-2 px-3 border"
            placeholder="Brief reason for the maintenance request"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Детальное описание
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2A5F7F] focus:ring focus:ring-[#2A5F7F] focus:ring-opacity-50 py-2 px-3 border"
            placeholder="Provide a detailed description of the issue"
            disabled={isSubmitting}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="room"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Комната
            </label>
            <select
              id="room"
              value={roomId}
              onChange={(e) => {
                setRoomId(e.target.value);
                setAssetId("");
                setMbpId("");
              }}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2A5F7F] focus:ring focus:ring-[#2A5F7F] focus:ring-opacity-50 py-2 px-3 border"
              disabled={isSubmitting || loading || rooms.length === 0}
            >
              <option value="">Выбрать Комнату</option>
              {rooms.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="asset"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Актив
            </label>
            <select
              id="asset"
              value={assetId}
              onChange={(e) => setAssetId(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2A5F7F] focus:ring focus:ring-[#2A5F7F] focus:ring-opacity-50 py-2 px-3 border"
              disabled={
                isSubmitting || loading || !roomId || assets.length === 0
              }
            >
              <option value="">Выбрать актив</option>
              {assets.map((asset) => (
                <option key={asset.id} value={asset.id}>
                  {asset.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="bg-[#2A5F7F] text-white px-4 py-2 rounded-md hover:bg-[#1e4b63] transition-colors focus:outline-none focus:ring-2 focus:ring-[#2A5F7F] focus:ring-opacity-50 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
            disabled={isSubmitting || loading}
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Submitting...
              </>
            ) : (
              "Submit Report"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReportForm;