import { Instrument_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";
import ScrollToTop from "@/components/Totop";
import Logo from "@/assets/white.svg";

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Home - Vartsy Campus",
  description: "Vartsy Campus - Empowering Education with Technology",
  icons: {
    icon: Logo.src,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${instrumentSans.variable} ${geistMono.variable} antialiased `}
        data-scroll-behavior="smooth"
      >
        {children}
        <ScrollToTop />
      </body>
    </html>
  );
}
