import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner"
import Provider from "@/provider";
import StoreProvider from "@/redux/StoreProvider";
import AppInit from "@/AppInit";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "AnnDaan – Reduce Food Waste",
  description: "A full-stack web platform built with Next.js and MongoDB to connect surplus event food with NGOs and shelters.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">

        <Provider>

          <StoreProvider>

            <AppInit>

              {children}

            </AppInit>

          </StoreProvider>

        </Provider>

        <Toaster />
      </body>
    </html>
  );
}
