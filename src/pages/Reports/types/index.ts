export interface Room {
  id: string;
  name: string;
}

export interface Asset {
  id: string;
  name: string;
  roomId: string;
}

export interface MBP {
  id: string;
  name: string;
  roomId: string;
}

export type UrgencyLevel = "low" | "medium" | "hign";
export type ReportStatus = 'OPEN' | 'IN_PROGRESS' | 'CLOSED';

export interface Report {
  id: string;
  reason: string;
  description: string;
  roomId: string;
  room?: Room;
  assetId?: string;
  asset?: Asset;
  mbpId?: string;
  mbp?: MBP;
  urgency: UrgencyLevel;
  status: ReportStatus;
  createdAt: string;
}

export interface CreateReportPayload {
  reason: string;
  description: string;
  roomId: string;
  assetId?: string;
  mbpId?: string;
  urgency: UrgencyLevel;
}