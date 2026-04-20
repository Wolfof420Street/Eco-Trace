"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { ApprovalNotification } from "@/components/agent/ApprovalNotification";

export function AgentScanButton() {
  const [items, setItems] = useState<any[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function scan() {
    setIsScanning(true);
    setError(null);
    try {
      const response = await fetch("/api/agent/scan", { method: "POST" });
      const json = await response.json();
      if (!json.success) {
        setError(json.error ?? "Scan failed");
        return;
      }
      setItems(json.data.items);
      setOpen(true);
    } finally {
      setIsScanning(false);
    }
  }

  async function approve() {
    setIsApproving(true);
    setError(null);
    try {
      const response = await fetch("/api/agent/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items })
      });
      const json = await response.json();
      if (!json.success) {
        setError(json.error ?? "Approval failed");
        return;
      }
      setOpen(false);
    } finally {
      setIsApproving(false);
    }
  }

  return (
    <div className="space-y-4">
      <Button onClick={scan} loading={isScanning}>
        Scan for carbon activities
      </Button>
      {error ? <div className="text-sm text-danger">{error}</div> : null}
      <ApprovalNotification
        items={items}
        open={open}
        isSubmitting={isApproving}
        onApprove={approve}
        onClose={() => setOpen(false)}
      />
    </div>
  );
}
