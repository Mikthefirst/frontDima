import { Room } from "../MBP/types";
import { Asset, RawAsset } from "./types";

const BASE_URL = "http://localhost:3000";

export const fetchAssets = async (): Promise<Asset[]> => {
  const response = await fetch(`${BASE_URL}/assets`);

  if (!response.ok) {
    throw new Error(`Failed to fetch assets: ${response.statusText}`);
  }

  const rawAssets: RawAsset[] = await response.json();
  console.log(rawAssets);

  const data =  rawAssets.map((item) => ({
    id: item.id,
    inventoryNo: item.inventory_number,
    name: item.name,
    location: item.room.name,
    depreciation: Number(item.depreciation).toFixed(2),
    purchaseDate: new Date(item.acquisitionDate).toISOString().split("T")[0],
    value: 0,
    description: item.image_url ?? "",
    x: parseFloat(item.x as string),
    y: parseFloat(item.y as string),
    width: parseFloat(item.width as string),
    height: parseFloat(item.height as string),
  }));

  console.log(data)
  return data;
};


export const addAsset = async (
  assetData: Omit<
    Asset,
    "id" | "depreciation" | "purchaseDate" | "description"
  > & {
    depreciation: string | number;
    purchaseDate: string;
    description: string;
    file?: File; // ⬅️ добавлено сюда
  }
): Promise<Asset> => {
  const formData = new FormData();
  formData.append("name", assetData.name);
  formData.append("room_id", assetData.location);
  formData.append("depreciation", assetData.depreciation.toString());
  formData.append("acquisitionDate", assetData.purchaseDate);
  formData.append("value", assetData.value.toString());
  formData.append("description", assetData.description || "");
  formData.append("x", assetData.x.toString());
  formData.append("y", assetData.y.toString());
  formData.append("width", assetData.width.toString());
  formData.append("height", assetData.height.toString());
  if (assetData.file) {
    formData.append("image", assetData.file); // File является Blob
  }
  const response = await fetch(`${BASE_URL}/assets`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Failed to add asset: ${response.statusText}`);
  }

  const savedAsset = await response.json();

  return {
    id: savedAsset.id,
    inventoryNo: savedAsset.inventory_number,
    name: savedAsset.name,
    location: savedAsset.room.name,
    depreciation: savedAsset.depreciation.toFixed(2),
    purchaseDate: new Date(savedAsset.acquisitionDate)
      .toISOString()
      .split("T")[0],
    value: savedAsset.value || 0,
    description: savedAsset.image_url || "",
    x: savedAsset.x,
    y: savedAsset.y,
    width: savedAsset.width,
    height: savedAsset.height,
  };
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


