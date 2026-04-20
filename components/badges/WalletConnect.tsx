"use client";

import { Button } from "@/components/ui/Button";
import { useWallet } from "@/hooks/useWallet";

export function WalletConnect() {
  const { walletAddress, connect, connected, connecting, walletSelected } = useWallet();
  const truncated = walletAddress ? `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}` : "Not connected";
  const label = connected
    ? "Wallet connected"
    : walletSelected
      ? "Connect selected wallet"
      : "Choose wallet";

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-surface p-4">
      <div className="text-sm text-muted">Wallet</div>
      <div className="mt-2 font-mono text-text">{truncated}</div>
      <Button type="button" className="mt-3" onClick={() => connect()} loading={connecting}>
        {label}
      </Button>
    </div>
  );
}
