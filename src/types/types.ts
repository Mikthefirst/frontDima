export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

export interface User {
  id: string;
  username: string;
  full_name: string;
  email: string;
  role: string;
  room_id: string;
}

export interface BuildingType {
  id: string;
  name: string;
  rooms:Array<Room>
}
interface Room{
  id: string;
  name: string;
  floor: string;
}
/*
    "id": "5de94ab1-6da1-4221-b813-74584fec1b32",
        "username": "Nick123",
        "email": "valid@gmail.com",
        "full_name": "Mikhail Petrov",
        "role": "admin",
        "room_id": null,
*/ 