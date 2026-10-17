import type { Metadata } from "next";
import { Suspense } from "react";
import { Fredoka, Nunito } from "next/font/google";
import { Shell } from "@/components/shell";
import "./globals.css";
const body = Nunito({ variable: "--font-body", subsets: ["latin"] });
const display = Fredoka({ variable: "--font-display", subsets: ["latin"] });
export const metadata: Metadata = {
  title: "KHALIFA — Ekosistem Literasi Keuangan Syariah SDN 02 Jember Kidul",
  description:
    "KHALIFA: Ekosistem Workbook, Gamifikasi, dan Pelatihan Guru untuk Meningkatkan Literasi Keuangan Syariah Siswa Sekolah Dasar di SDN 02 Jember Kidul.",
  icons: {
    icon: "/brand/khalifa/favicon.svg",
    apple: "/brand/khalifa/apple-touch-icon.png",
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${body.variable} ${display.variable}`}>
      <body>
        <Suspense
          fallback={
            <div className="loading-block">
              Koini sedang menyiapkan petualanganmu…
            </div>
          }
        >
          <Shell>{children}</Shell>
        </Suspense>
      </body>
    </html>
  );
}
