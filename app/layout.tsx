import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "getautocue",
  description:
    "A voice controlled teleprompter in your browser - Powered by AssemblyAI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
