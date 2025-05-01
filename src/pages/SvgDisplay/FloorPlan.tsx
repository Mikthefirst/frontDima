import React, { useState, useRef, useEffect, MouseEvent } from "react";
import { Room, Asset } from "./types";
import "./FloorPlan.css";

interface FloorPlanProps {
  unitSize?: number;
  padding?: number;
}

export const FloorPlan: React.FC<FloorPlanProps> = ({
  unitSize = 50,
  padding = 20,
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selected, setSelected] = useState<{
    room: Room;
    x: number;
    y: number;
  } | null>(null);

  // Загружаем комнаты при монтировании
  useEffect(() => {
    fetch("http://localhost:3000/room")
      .then((res) => res.json())
      .then((data: Room[]) => {
        // Пример простой сетки: 5 комнат в ряд
        const spaced = data.map((room, idx) => ({
          ...room,
          x: (idx % 5) * 7,
          y: Math.floor(idx / 5) * 6,
          width: 6,
          height: 4,
          items: [],
        }));
        setRooms(spaced);
      });
  }, []);

  // Клик по комнате
  const onClickRoom = async (e: MouseEvent, room: Room) => {
    e.stopPropagation();
    if (!wrapperRef.current) return;
    const rect = wrapperRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    if (selected?.room.id === room.id) {
      setSelected(null);
      return;
    }

    if (room.items && room.items.length > 0) {
      setSelected({ room, x: clickX, y: clickY });
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:3000/room/roomWithAssets/${room.id}`
      );
      const assets: Asset[] = await res.json();

      // Преобразуем в items
      const grouped = new Map<
        string,
        { id: string; count: number; price: number }
      >();

      for (const asset of assets) {
        const name = asset.name;
        const price = parseFloat(asset.depreciation); // как указано
        if (grouped.has(name)) {
          const entry = grouped.get(name)!;
          entry.count += 1;
        } else {
          grouped.set(name, {
            id: asset.id,
            count: 1,
            price,
          });
        }
      }

      const items = Array.from(grouped.entries()).map(
        ([name, { id, count, price }]) => ({
          id,
          name,
          count,
          price,
          imageUrl: "https://via.placeholder.com/80", // пока заглушка
        })
      );

      const updatedRooms = rooms.map((r) =>
        r.id === room.id ? { ...r, items } : r
      );
      setRooms(updatedRooms);

      const updatedRoom = updatedRooms.find((r) => r.id === room.id)!;
      setSelected({ room: updatedRoom, x: clickX, y: clickY });
    } catch (err) {
      console.error("Ошибка загрузки items:", err);
    }
  };

  useEffect(() => {
    const onBodyClick = () => setSelected(null);
    document.addEventListener("click", onBodyClick);
    return () => document.removeEventListener("click", onBodyClick);
  }, []);

  // Размер SVG
  const maxX = Math.max(...rooms.map((r) => r.x + r.width), 0);
  const maxY = Math.max(...rooms.map((r) => r.y + r.height), 0);
  const svgW = maxX * unitSize + padding * 2;
  const svgH = maxY * unitSize + padding * 2;

  return (
    <div
      className="floorplan-wrapper"
      ref={wrapperRef}
      style={{
        position: "relative",
        display: "inline-block",
        height: "100%", // Make sure the wrapper takes full height
      }}
    >
      <svg
        width={svgW}
        height={svgH}
        style={{
          border: "1px solid #ccc",
          background: "#fff",
          height: "100%", // Full height of the wrapper
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {rooms.map((room) => {
          const rx = padding + room.x * unitSize;
          const ry = padding + room.y * unitSize;
          const rw = room.width * unitSize;
          const rh = room.height * unitSize;

          return (
            <g
              key={room.id}
              onClick={(e) => onClickRoom(e, room)}
              style={{ cursor: "pointer" }}
            >
              <rect
                x={rx}
                y={ry}
                width={rw}
                height={rh}
                fill={
                  selected?.room.id === room.id ? "rgba(0,0,255,0.1)" : "none"
                }
                stroke="#000"
                strokeWidth="2"
              />
              <text
                x={rx + rw / 2}
                y={ry + rh / 2}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={14}
                fontFamily="sans-serif"
              >
                {room.name}
              </text>
            </g>
          );
        })}
      </svg>

      {selected && selected.room.items.length > 0 && (
        <div
          className="tooltip"
          style={{
            top: selected.y + 10,
            left: selected.x + 10,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <h4>{selected.room.name}</h4>
          <ul>
            {selected.room.items.map((item) => (
              <li key={item.id} className="tooltip-item">
                <img src={item.imageUrl} alt={item.name} />
                <div className="tooltipText">
                  <strong>{item.name}</strong>
                  <div>Кол-во: {item.count}</div>
                  <div>Цена: {item.price} руб.</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
