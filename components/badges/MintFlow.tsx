"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useWallet } from "@/hooks/useWallet";

export function MintFlow({
  badgeId,
  onClose
}: {
  badgeId: string | null;
  onClose: () => void;
}) {
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isMinting, setIsMinting] = useState(false);
  const { walletAddress, connect } = useWallet();

  async function mint() {
    if (!badgeId) return;
    setIsMinting(true);
    setError(null);
    try {
      const wallet = walletAddress ?? (await connect());
      if (!wallet) {
        setError("Connect a wallet before minting.");
        return;
      }

      const response = await fetch("/api/badges/mint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          badgeId,
          wallet
        })
      });
      const json = await response.json();
      if (!json.success) {
        setError(json.error ?? "Mint failed");
        return;
      }
      setResult(json.data.result.explorerUrl);
    } finally {
      setIsMinting(false);
    }
  }

  return (
    <Modal open={Boolean(badgeId)} title="Mint Eco Badge">
      <p className="text-sm text-muted">Mint badge `{badgeId}` to your connected Solana devnet wallet.</p>
      {walletAddress ? <div className="mt-3 font-mono text-sm text-text">{walletAddress}</div> : null}
      {result ? (
        <a href={result} target="_blank" className="mt-4 inline-block text-primary underline">
          Open explorer
        </a>
      ) : (
        <Button className="mt-4" onClick={mint} loading={isMinting}>
          Confirm mint
        </Button>
      )}
      {error ? <div className="mt-3 text-sm text-danger">{error}</div> : null}
      <Button variant="ghost" className="mt-3" onClick={onClose}>
        Close
      </Button>
    </Modal>
  );
}
