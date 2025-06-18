import React, { useState, useRef, useEffect, MouseEvent } from "react";
import { Room } from "./types";
import { loadRooms, loadRoomAssets } from "./api";
import "./FloorPlan.css";

interface FloorPlanProps {
  unitSize?: number;
  padding?: number;
}

export const FloorPlan: React.FC<FloorPlanProps> = ({
  unitSize = 50,
  padding = 20,
}) => {
  const [zoomedInfo, setZoomedInfo] = useState<{
    x: number;
    y: number;
    room: Room;
  } | null>(null);
  


  const wrapperRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const [rooms, setRooms] = useState<Room[]>([]);
  const [selected, setSelected] = useState<{
    room: Room;
    x: number;
    y: number;
  } | null>(null);
  const [zoomedRoom, setZoomedRoom] = useState<Room | null>(null);

  useEffect(() => {
    loadRooms()
      .then(setRooms)
      .catch((err) => console.error("Ошибка загрузки комнат:", err));
  }, []);

  const scrollToRoom = (room: Room, zoomed = false) => {
    if (!wrapperRef.current || !svgRef.current) return;

    const wrapper = wrapperRef.current;
    const svg = svgRef.current;

    const rx = zoomed ? svg.clientWidth * 0.1 : padding + room.x * unitSize;
    const ry = zoomed ? svg.clientHeight * 0.1 : padding + room.y * unitSize;
    const rw = zoomed ? svg.clientWidth * 0.8 : room.width * unitSize;
    const rh = zoomed ? svg.clientHeight * 0.6 : room.height * unitSize;

    const centerX = rx + rw / 2;
    const centerY = ry + rh / 2;

    wrapper.scrollTo({
      left: centerX - wrapper.clientWidth / 2,
      top: centerY - wrapper.clientHeight / 2,
      behavior: "smooth",
    });
  };

  const onClickRoom = async (e: MouseEvent, room: Room) => {
    e.stopPropagation();
    if (!wrapperRef.current) return;

    const rect = wrapperRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    if (zoomedRoom) {
      console.log(zoomedRoom, " roomis Zoomed")
      console.log("clickX: ", clickX, " clickY: ", clickY);

    }

    if (zoomedRoom && room.id === zoomedRoom.id) {
      setZoomedInfo({ x: clickX, y: clickY, room });
      return;
    }

    if (selected?.room.id === room.id) {
      setSelected(null);
      return;
    }

    if (room.items && room.items.length > 0) {
      setSelected({ room, x: clickX, y: clickY });
      scrollToRoom(room);
      return;
    }

    try {
      const assets = await loadRoomAssets(room.id);
      const items = assets.map((a) => ({
        id: a.id,
        name: a.name,
        count: 1,
        price: a.value,
        imageUrl: a.image_url,
        x: a.x,
        y: a.y,
        width: a.width,
        height: a.height,
      }));

      const updatedRooms = rooms.map((r) =>
        r.id === room.id ? { ...r, items } : r
      );
      setRooms(updatedRooms);

      const updatedRoom = updatedRooms.find((r) => r.id === room.id)!;
      if (zoomedRoom && updatedRoom.id === zoomedRoom.id) {
        setZoomedInfo({ x: clickX, y: clickY, room: updatedRoom });
      } else {
        setSelected({ room: updatedRoom, x: clickX, y: clickY });
        scrollToRoom(updatedRoom);
      }
    } catch (err) {
      console.error("Ошибка загрузки assets:", err);
    }
  };
  

  const onDoubleClickRoom = (e: MouseEvent, room: Room) => {
    e.stopPropagation();
    setZoomedRoom(room);
    scrollToRoom(room, true);
  };

  useEffect(() => {
    const onBodyClick = () => {
      setSelected(null);
      setZoomedRoom(null);
      setZoomedInfo(null);
    };
    document.addEventListener("click", onBodyClick);
    return () => document.removeEventListener("click", onBodyClick);
  }, []);

  const maxX = Math.max(...rooms.map((r) => r.x + r.width), 0);
  const maxY = Math.max(...rooms.map((r) => r.y + r.height), 0);
  const svgW = maxX * unitSize + padding * 2;
  const svgH = maxY * unitSize + padding * 2;

  const displayRooms = zoomedRoom ? [zoomedRoom] : rooms;

  return (
    <div className="floorplan-wrapper" ref={wrapperRef}>
      {zoomedRoom && (
        <button
          onClick={() => setZoomedRoom(null)}
          style={{
            position: "absolute",
            top: 10,
            left: 10,
            zIndex: 200,
            padding: "8px 12px",
            background: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
          }}
        >
          Назад
        </button>
      )}

      <svg
        ref={svgRef}
        width={svgW}
        height={svgH}
        onClick={(e) => e.stopPropagation()}
      >
        {displayRooms.map((room) => {
          const rx = zoomedRoom ? svgW * 0.1 : padding + room.x * unitSize;
          const ry = zoomedRoom ? svgH * 0.1 : padding + room.y * unitSize;
          const rw = zoomedRoom ? svgW * 0.8 : room.width * unitSize;
          const rh = zoomedRoom ? svgH * 0.6 : room.height * unitSize;

          return (
            <g
              key={room.id}
              onClick={(e) => onClickRoom(e, room)}
              onDoubleClick={(e) => onDoubleClickRoom(e, room)}
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
                y={ry + rh + 20}
                textAnchor="middle"
                dominantBaseline="hanging"
                fontSize={16}
                fontWeight="bold"
                fontFamily="sans-serif"
              >
                {room.name}
              </text>

              {zoomedRoom &&
                room.items.map((item, i) => {
                  // Парсим в числа
                  const itemX = Number(item.x) || 0;
                  const itemY = Number(item.y) || 0;
                  const itemW = Number(item.width) || 10;
                  const itemH = Number(item.height) || 10;

                  // Позиция объекта — смещение от левого верхнего угла комнаты
                  const ax = rx + itemX;
                  const ay = ry + itemY;
                  const aw = itemW;
                  const ah = itemH;

                  const hasImage = !!item.imageUrl;

                  return hasImage ? (
                    <image
                      key={i}
                      href={item.imageUrl ? item.imageUrl : undefined}
                      x={ax}
                      y={ay}
                      width={aw}
                      height={ah}
                      preserveAspectRatio="xMidYMid slice"
                    />
                  ) : (
                    <g key={i}>
                      <rect
                        x={ax}
                        y={ay}
                        width={aw}
                        height={ah}
                        fill="rgba(255, 0, 0, 0.3)"
                        stroke="red"
                        strokeWidth={1}
                      />
                      <text
                        x={ax + aw / 2}
                        y={ay + ah / 2}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize={10}
                        fontFamily="sans-serif"
                        fill="black"
                      >
                        {item.name}
                      </text>
                    </g>
                  );
                })}
            </g>
          );
        })}
      </svg>

      {selected && selected.room.items.length > 0 && !zoomedRoom && (
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
                <div className="tooltipText">
                  <strong>{item.name}</strong>
                  <div>Кол-во: {item.count}</div>
                  <div>Цена: {item.price}$.</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {zoomedInfo && (
        <div
          className="zoomed-tooltip"
          style={{
            top: zoomedInfo.y + 10,
            left: zoomedInfo.x + 10,
            position: "absolute",
            background: "#fff",
            border: "1px solid #ccc",
            padding: "8px 12px",
            borderRadius: "4px",
            zIndex: 300,
            boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
            pointerEvents: "auto",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div>
            <strong>Координаты:</strong>
          </div>
          <div>x: {zoomedInfo.x}</div>
          <div>y: {zoomedInfo.y}</div>
        </div>
      )}
    </div>
  );
};
