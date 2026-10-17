import { NextResponse } from "next/server";
import type { Room } from "@/lib/store";

type GlobalRoomRegistry = {
  _khalifaRooms?: Map<string, Room>;
};

const g = globalThis as unknown as GlobalRoomRegistry;
const roomsMap = g._khalifaRooms || new Map<string, Room>();

function findInMap(inputCode: string): Room | undefined {
  const clean = inputCode.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (!clean) return undefined;
  if (roomsMap.has(clean)) return roomsMap.get(clean);
  if (roomsMap.has(`CERDAS${clean}`)) return roomsMap.get(`CERDAS${clean}`);

  const withoutPrefix = clean.replace(/^CERDAS/, "");
  for (const [key, room] of roomsMap.entries()) {
    const keyClean = key.replace(/[^A-Z0-9]/g, "");
    if (keyClean === clean) return room;
    if (withoutPrefix && keyClean.replace(/^CERDAS/, "") === withoutPrefix) {
      return room;
    }
  }
  return undefined;
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ code: string }> },
) {
  const { code } = await params;
  const room = findInMap(code);
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
    roomsMap.set(clean, updated);
    return NextResponse.json({ success: true, code: clean });
  } catch {
    return NextResponse.json(
      { error: "Gagal memperbarui room" },
      { status: 500 },
    );
  }
}
