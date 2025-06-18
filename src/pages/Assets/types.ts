export interface Asset {
  value: number; // ← добавлено поле стоимости
  id: string;
  name: string;
  room: Room; // Было location: string
  depreciation: number; // Было string
  acquisitionDate: string; // Было purchaseDate
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface AssetFormData extends Partial<Asset> {
  // file?: File; // удалено, так как загрузка файлов больше не используется
  room_id?: string; // id комнаты, передаётся на backend
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