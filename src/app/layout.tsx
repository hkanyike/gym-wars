import type { Metadata } from "next";
import "./globals.css";
import MainHeader from "@/components/header/MainHeader"; // ✅ Correct import

export const metadata: Metadata = {
  title: "Gym Wars",
  description: "Gym vs Gym competition.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-bg text-text">
        <MainHeader /> {/* ✅ Uses default export */}
        <main>{children}</main>
      </body>
    </html>
  );
}
