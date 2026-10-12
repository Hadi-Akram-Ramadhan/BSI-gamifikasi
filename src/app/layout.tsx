import type { Metadata } from "next";
import { Suspense } from "react";
import { Fredoka, Nunito } from "next/font/google";
import { Shell } from "@/components/shell";
import "./globals.css";
const body = Nunito({ variable: "--font-body", subsets: ["latin"] });
const display = Fredoka({ variable: "--font-display", subsets: ["latin"] });
export const metadata: Metadata = {
  title: "Duel Cerdas — Jago Atur Uang!",
  description:
    "Belajar uang, raih bintang, jadi anak cerdas! Petualangan literasi finansial untuk anak Indonesia.",
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
