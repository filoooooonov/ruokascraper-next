import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ruokascraper",
  description: "Save money and time on your groceries!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const firebaseConfig = {
  //   apiKey: "AIzaSyADG3AQoFI62pymB8I8B00oNyGFUkE6-Mk",
  //   authDomain: "ruokascraper.firebaseapp.com",
  //   projectId: "ruokascraper",
  //   storageBucket: "ruokascraper.appspot.com",
  //   messagingSenderId: "565890443686",
  //   appId: "1:565890443686:web:75edce769f6b0b62154767",
  //   measurementId: "G-5JL52YFNTT",
  // };

  // const app = initializeApp(firebaseConfig);
  // const analytics = getAnalytics(app);

  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
