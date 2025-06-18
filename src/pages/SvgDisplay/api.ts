// api.ts
import { Asset, Room } from "./types";
const server = import.meta.env.VITE_SERVER_URL;

export async function loadRooms(): Promise<Room[]> {
  const res = await fetch(`${server}/room`);
  const data: Room[] = await res.json();

  // Добавляем координаты и размеры (простая сетка)
  return data.map((room, idx) => ({
    ...room,
    x: (idx % 5) * 7,
    y: Math.floor(idx / 5) * 6,
    width: 6,
    height: 4,
    items: [],
  }));
}

export async function loadRoomAssets(roomId: string): Promise<Asset[]> {
  const res = await fetch(
    `${server}/room/roomWithAssets/${roomId}`
  );
  return res.json();
}
