import type { Metadata } from "next";
import "./globals.css";
import "@solana/wallet-adapter-react-ui/styles.css";
import { SolanaWalletAppProvider } from "@/components/providers/SolanaWalletProvider";

export const metadata: Metadata = {
  title: "EcoTrace",
  description: "Track, understand, and reduce your carbon footprint with AI."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark">
      <body>
        <SolanaWalletAppProvider>{children}</SolanaWalletAppProvider>
      </body>
    </html>
  );
}
