import { NextResponse } from "next/server";
import type { Room } from "@/lib/store";
import { getGlobalRoomsMap } from "@/lib/room";

export async function GET() {
  const roomsMap = getGlobalRoomsMap<Room>();
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
    const roomsMap = getGlobalRoomsMap<Room>();
    roomsMap.set(clean, room);
    return NextResponse.json({ success: true, code: clean });
  } catch {
    return NextResponse.json(
      { error: "Gagal memproses data room" },
      { status: 500 },
    );
  }
}
