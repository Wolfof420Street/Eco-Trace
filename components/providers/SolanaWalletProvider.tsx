"use client";

import { useMemo } from "react";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import { SolflareWalletAdapter } from "@solana/wallet-adapter-solflare";

export function SolanaWalletAppProvider({ children }: { children: React.ReactNode }) {
  const endpoint = process.env.NEXT_PUBLIC_SOLANA_RPC_URL ?? "https://api.devnet.solana.com";
  const wallets = useMemo(() => [new PhantomWalletAdapter(), new SolflareWalletAdapter()], []);
  const SafeConnectionProvider = ConnectionProvider as unknown as React.ComponentType<{
    endpoint: string;
    children: React.ReactNode;
  }>;
  const SafeWalletProvider = WalletProvider as unknown as React.ComponentType<{
    wallets: unknown[];
    autoConnect?: boolean;
    children: React.ReactNode;
  }>;
  const SafeWalletModalProvider = WalletModalProvider as unknown as React.ComponentType<{
    children: React.ReactNode;
  }>;

  return (
    <SafeConnectionProvider endpoint={endpoint}>
      <SafeWalletProvider wallets={wallets} autoConnect>
        <SafeWalletModalProvider>{children}</SafeWalletModalProvider>
      </SafeWalletProvider>
    </SafeConnectionProvider>
  );
}
