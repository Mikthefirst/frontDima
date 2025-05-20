// MBP Types
export interface MBP {
  id: string;
  name: string;
  category: string;
  overallQuantity: number;
  minQuantity: number;
  expiryDate: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

// Room Types
export interface Room {
  id: string;
  name: string;
  type: string;
}

// MBP to Room mapping
export interface MBPToRoom {
  id: string;
  mbp: MBP;
  room: Room;
  quantity: number;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}