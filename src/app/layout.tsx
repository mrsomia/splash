import Provider from "@/components/Providers";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Splash tournaments",
  description: "The tool to help you run a bar tournament",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  return (
    <Provider session={session}>
      <html lang="en">
        <body className={`${inter.className} bg-slate-900 text-white`}>
          {children}
          <Toaster richColors />
        </body>
      </html>
    </Provider>
  );
}
