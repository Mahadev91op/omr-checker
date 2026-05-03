import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "OMR Pro Scanner",
  description: "Premium OMR checking app with Live Scanner",
};

export default function RootLayout({ children }) {
  return (
    <html 
      lang="en" 
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning /* <-- YEH LINE ADD KAREIN */
    >
      <body 
        className="min-h-full flex flex-col"
        suppressHydrationWarning /* <-- YEH LINE ADD KAREIN */
      >
        {children}
      </body>
    </html>
  );
}