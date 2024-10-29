import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Harvitt Dashboard",
  description: "Harvitt Management System",
  icons: {
    icon: "213.png", // Path to your favicon file
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ClerkProvider>
        <body className={inter.className}>{children}<ToastContainer position="bottom-right" theme="dark" /></body>
      </ClerkProvider>
    </html>
  );
}
