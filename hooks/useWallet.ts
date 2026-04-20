"use client";

import { useMemo } from "react";
import { useWallet as useSolanaWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";

export function useWallet() {
  const { publicKey, wallet, connect, connected, connecting, disconnect } = useSolanaWallet();
  const { setVisible } = useWalletModal();
  const walletAddress = useMemo(() => publicKey?.toBase58() ?? null, [publicKey]);

  return {
    connected,
    connecting,
    walletSelected: Boolean(wallet),
    walletAddress,
    connect: async () => {
      if (connected && publicKey) {
        return publicKey.toBase58();
      }

      // Step 1: no wallet selected yet -> show modal and wait for user choice.
      if (!wallet) {
        setVisible(true);
        return null;
      }

      // Step 2: wallet selected -> attempt connection.
      try {
        await connect();
        return publicKey?.toBase58() ?? wallet.adapter.publicKey?.toBase58() ?? null;
      } catch {
        return null;
      }
    },
    disconnect
  };
}
