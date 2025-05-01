// types.ts
export interface Item {
  id: string;
  name: string;
  count: number;
  imageUrl: string;
  price: number;
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
  inventory_number: number;
  room_id: string;
  responsiblePerson: string;
  depreciation: string; // в виде строки
  acquisitionDate: string;
}
