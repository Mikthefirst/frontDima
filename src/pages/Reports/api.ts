const BASE_URL = "http://localhost:3000"; // Replace with your actual API base URL

export const api = {
  // Room related endpoints
  async getAllRooms() {
    const response = await fetch(`${BASE_URL}/room`);
    if (!response.ok) {
      throw new Error("Failed to fetch rooms");
    }
    return response.json();
  },

  async getRoomWithAssets(roomId: string) {
    const response = await fetch(`${BASE_URL}/room/roomWithAssets/${roomId}`);

    if (!response.ok) {
      throw new Error("Failed to fetch room assets");
    }
   
    return response.json();
  },

  // MBP related endpoints
  async getMBPsByRoom(roomId: string) {
    const response = await fetch(`${BASE_URL}/mbp/by-room/${roomId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch MBPs");
    }
    return response.json();
  },

  // Report related endpoints
  async getAllReports() {
    const response = await fetch(`${BASE_URL}/report`);
    if (!response.ok) {
      throw new Error("Failed to fetch reports");
    }
    const data = response.json();
    console.log('reports:', data);
    return data;
  },

  async createReport(reportData: any) {
    const response = await fetch(`${BASE_URL}/report`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reportData),
    });
    if (!response.ok) {
      throw new Error("Failed to create report");
    }
    return response.json();
  },

  async closeReport(reportId: string) {
    const response = await fetch(`${BASE_URL}/report/${reportId}/close`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: "resolved" }),
    });
    if (!response.ok) {
      throw new Error("Failed to close report");
    }
    return response.json();
  },
};
