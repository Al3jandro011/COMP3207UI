import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "../components/sidebar/Sidebar";
import { ThemeProvider } from '@/contexts/ThemeContext';

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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100`}>
        <ThemeProvider>
          <Sidebar />
          <main className="ml-72">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
