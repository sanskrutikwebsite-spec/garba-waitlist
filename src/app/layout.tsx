import type { Metadata } from "next";
import localFont from "next/font/local";
import Footer from "@/components/Footer";
import "./globals.css";

const berlinSans = localFont({
  src: [
    {
      path: './fonts/BRLNSR.ttf',
      weight: '400',
      style: 'normal',
    }
  ],
  variable: "--font-berlin-sans",
});

export const metadata: Metadata = {
  title: "Sanskrutik Sheri Garba",
  description: "Book your passes for Sanskrutik Sheri Garba.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className={`min-h-full flex flex-col ${berlinSans.className}`}>
        <div className="flex-1">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
