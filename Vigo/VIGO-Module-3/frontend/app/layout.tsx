"use client";
import { Geist, Geist_Mono } from "next/font/google";
import { usePathname } from 'next/navigation';
import "./globals.css";
import Sidebar from "../components/Sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      {/* Updated colors here */}
      <body className={`min-h-full flex ${isLoginPage ? 'bg-[#FFFDF8]' : 'bg-[#FFFDF8] text-[#1F2937]'} overflow-hidden`}>
        
        {!isLoginPage && <Sidebar />}

        <main className={`flex-1 h-screen overflow-y-auto ${isLoginPage ? '' : 'bg-gray-50'}`}>
          {children}
        </main>
      </body>
    </html>
  );
}