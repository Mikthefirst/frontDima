// types.ts
export interface Item {
  id: string;
  name: string;
  count: number;
  imageUrl: string|null|undefined;
  price: number;
  x?: number; // от 0 до 1
  y?: number; // от 0 до 1
  width?: number; // от 0 до 1
  height?: number; // от 0 до 1
}

export interface Room {
  id: string;
  width: number;
  height: number;
  x: number;
  y: number;
  name: string;
  items: Item[];
}

// Тип ответа от сервера (примерная структура)
export interface Asset {
  id: string;
  name: string;
  room_id: string;
  depreciation: string; // в виде строки
  acquisitionDate: string;
  image_url: string | null;
  width: number;
  height: number;
  value: number;
  x: number;
  y: number;
}

