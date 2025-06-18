import { MBP, MBPToRoom, Room } from '../types';
const server = import.meta.env.VITE_SERVER_URL;
const API_BASE_URL = server; 

// MBP CRUD Operations
export const fetchAllMBPs = async (): Promise<MBP[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/mbp`);
    if (!response.ok) throw new Error('Failed to fetch MBPs');
    return await response.json();
  } catch (error) {
    console.error('Error fetching MBPs:', error);
    throw error;
  }
};

export const fetchMBPById = async (id: string): Promise<MBP> => {
  try {
    const response = await fetch(`${API_BASE_URL}/mbp/${id}`);
    if (!response.ok) throw new Error('Failed to fetch MBP');
    return await response.json();
  } catch (error) {
    console.error(`Error fetching MBP ${id}:`, error);
    throw error;
  }
};

export const createMBP = async (mbpData: Omit<MBP, 'id' | 'createdAt' | 'updatedAt'>): Promise<MBP> => {
  try {
    const response = await fetch(`${API_BASE_URL}/mbp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mbpData),
    });
    if (!response.ok) throw new Error('Failed to create MBP');
    return await response.json();
  } catch (error) {
    console.error('Error creating MBP:', error);
    throw error;
  }
};

export const updateMBP = async (id: string, mbpData: Partial<MBP>): Promise<MBP> => {
  try {
    const response = await fetch(`${API_BASE_URL}/mbp/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mbpData),
    });
    if (!response.ok) throw new Error('Failed to update MBP');
    return await response.json();
  } catch (error) {
    console.error(`Error updating MBP ${id}:`, error);
    throw error;
  }
};

export const deleteMBP = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/mbp/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete MBP');
  } catch (error) {
    console.error(`Error deleting MBP ${id}:`, error);
    throw error;
  }
};

// Room Operations
export const fetchAllRooms = async (): Promise<Room[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/room`);
    if (!response.ok) throw new Error('Failed to fetch rooms');
    return await response.json();
  } catch (error) {
    console.error('Error fetching rooms:', error);
    throw error;
  }
};

// MBP to Room Operations
export const assignMBPToRoom = async (mbpId: string, roomId: string, quantity: number): Promise<MBPToRoom> => {
  try {
    const response = await fetch(`${API_BASE_URL}/mbp/assign-to-room`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ mbpId, roomId, quantity }),
    });
    if (!response.ok) throw new Error('Failed to assign MBP to room');
    return await response.json();
  } catch (error) {
    console.error('Error assigning MBP to room:', error);
    throw error;
  }
};

export const fetchMBPsByRoom = async (roomId: string): Promise<MBPToRoom[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/mbp/by-room/${roomId}`);
    if (!response.ok) throw new Error('Failed to fetch MBPs by room');
    return await response.json();
  } catch (error) {
    console.error(`Error fetching MBPs for room ${roomId}:`, error);
    throw error;
  }
};

export const updateMBPQuantityInRoom = async (mbpToRoomId: string, quantity: number): Promise<MBPToRoom> => {
  try {
    const response = await fetch(`${API_BASE_URL}/mbp/update-quantity-room/${mbpToRoomId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ quantity }),
    });
    if (!response.ok) throw new Error('Failed to update MBP quantity in room');
    return await response.json();
  } catch (error) {
    console.error(`Error updating MBP quantity in room ${mbpToRoomId}:`, error);
    throw error;
  }
};