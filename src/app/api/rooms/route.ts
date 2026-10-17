import { NextResponse } from "next/server";
import type { Room } from "@/lib/store";

// In-memory room store shared across devices on this server
type GlobalRoomRegistry = {
  _khalifaRooms?: Map<string, Room>;
};

const g = globalThis as unknown as GlobalRoomRegistry;
if (!g._khalifaRooms) {
  g._khalifaRooms = new Map();
}
const roomsMap = g._khalifaRooms;

export async function GET() {
  const list = Array.from(roomsMap.values());
  return NextResponse.json({ count: list.length, rooms: list });
}

export async function POST(req: Request) {
  try {
    const room = (await req.json()) as Room;
    if (!room || !room.code) {
      return NextResponse.json(
        { error: "Payload room tidak valid" },
        { status: 400 },
      );
    }
    const clean = room.code.trim().toUpperCase();
    roomsMap.set(clean, room);
    return NextResponse.json({ success: true, code: clean });
  } catch {
    return NextResponse.json(
      { error: "Gagal memproses data room" },
      { status: 500 },
    );
  }
}
