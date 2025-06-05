export interface Asset {
  id: string;
  inventoryNo: number;
  name: string;
  location: string; 
  depreciation: string;
  purchaseDate: string;
  value: number;
  description?: string;
  x: number;
  y: number;
  width: number;
  height: number;
}
export interface AssetFormData extends Partial<Asset> {
  file?: File;
}

export interface RawAsset {
  id: string;
  inventory_number: number;
  name: string;
  room: Room;
  depreciation: string | number;
  acquisitionDate: string;
  image_url?: string;
  x: string | number;
  y: string | number;
  width: string | number;
  height: string | number;
}
  

interface Room {
  id: string;
  name: string;
  owner_id?: string;
  width: number;
  height: number;
  x: number;
  y: number;
}



export interface User {
  id: string;
  username: string;
  email: string;
  full_name: string;
}