import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "../components/sidebar/Sidebar";
import ErrorBoundary from '@/components/ErrorBoundary';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "EVECS",
  description: "ECS Event Manager",
  icons: {
    icon: [
      { url: '/images/favicon.ico' },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-900 text-gray-100`}>
        <ErrorBoundary>
          <Sidebar />
          <main className="lg:ml-72 min-h-screen pt-[64px] lg:pt-0">
            {children}
          </main>
        </ErrorBoundary>
      </body>
    </html>
  );
}
