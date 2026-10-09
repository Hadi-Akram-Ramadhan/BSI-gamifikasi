import { ModuleInfo, Room, GameMode } from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
export const WS_BASE = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8080/ws";

export async function fetchModules(): Promise<ModuleInfo[]> {
  const res = await fetch(`${API_BASE}/api/modules`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Gagal mengambil daftar modul literasi");
  }
  return res.json();
}

export async function createRoom(
  mode: GameMode,
  moduleId: number,
  questionCount: number = 5
): Promise<Room> {
  const res = await fetch(`${API_BASE}/api/rooms`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      mode,
      module_id: moduleId,
      question_count: questionCount,
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "Gagal membuat room duel");
  }

  return res.json();
}

export async function fetchRoom(code: string): Promise<Room> {
  const res = await fetch(`${API_BASE}/api/rooms/${code}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Room tidak ditemukan atau sudah selesai");
  }

  return res.json();
}
