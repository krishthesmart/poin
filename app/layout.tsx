import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Agent Builder — Build apps by prompting AI",
  description: "Describe what you want to build and the AI agent will generate and run it instantly.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full">{children}</body>
    </html>
  );
}
