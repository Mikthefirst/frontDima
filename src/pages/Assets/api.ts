import { Room } from "../MBP/types";
import { Asset, AssetFormData } from "./types";
const server = import.meta.env.VITE_SERVER_URL;

const BASE_URL = server;

export const fetchAssets = async (): Promise<Asset[]> => {
  const response = await fetch(`${BASE_URL}/assets`);
  if (!response.ok) {
    throw new Error(`Failed to fetch assets: ${response.statusText}`);
  }

  const data: Asset[] = await response.json();
  console.log("assets that arrived: ",data)
  return data;
};



export const fetchAllRooms = async (): Promise<Room[]> => {
  try {
    const response = await fetch(`${BASE_URL}/room`);
    if (!response.ok) throw new Error('Failed to fetch rooms');
    return await response.json();
  } catch (error) {
    console.error('Error fetching rooms:', error);
    throw error;
  }
};

export const addAsset = async (data: AssetFormData): Promise<Asset> => {
  try {
    console.log("add asset data: ", data)
    const response = await fetch(`${BASE_URL}/assets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to create asset: ${errorText}`);
    }

    const createdAsset = await response.json();
    return createdAsset;
  } catch (error) {
    console.error("Error creating asset:", error);
    throw error;
  }
};

export const updateAsset = async (
  id: string,
  updatedData: AssetFormData
): Promise<Asset> => {
  console.log('updatedData:', updatedData);
  const res = await fetch(`${BASE_URL}/assets/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedData),
  });

  if (!res.ok) {
    throw new Error("Failed to update asset");
  }

  return await res.json();
};


export const deleteAsset = async (id: string): Promise<void> => {
  const response = await fetch(`${BASE_URL}/assets/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`Failed to delete asset: ${response.statusText}`);
  }
};

