import { NextResponse } from "next/server";
import type { Room } from "@/lib/store";
import { getGlobalRoomsMap, findRoomInMap } from "@/lib/room";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ code: string }> },
) {
  const { code } = await params;
  const roomsMap = getGlobalRoomsMap<Room>();
  const room = findRoomInMap(roomsMap, code);
  if (!room) {
    return NextResponse.json(
      { error: "Room tidak ditemukan" },
      { status: 404 },
    );
  }
  return NextResponse.json(room);
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ code: string }> },
) {
  const { code } = await params;
  try {
    const updated = (await req.json()) as Room;
    if (!updated || !updated.code) {
      return NextResponse.json(
        { error: "Data room tidak valid" },
        { status: 400 },
      );
    }
    const clean = (updated.code || code).trim().toUpperCase();
    const roomsMap = getGlobalRoomsMap<Room>();
    roomsMap.set(clean, updated);
    return NextResponse.json({ success: true, code: clean });
  } catch {
    return NextResponse.json(
      { error: "Gagal memperbarui room" },
      { status: 500 },
    );
  }
}
