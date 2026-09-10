import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Parks & Rec Admin",
  description: "City staff portal for managing programs, classes, and registration release times.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
