"use client";

import { useMemo, useRef, useState } from "react";
import type { EmissionFactor } from "@/src/domain/value-objects/EmissionFactor";
import { CategoryPicker } from "@/components/log/CategoryPicker";
import { SubcategoryPicker } from "@/components/log/SubcategoryPicker";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { CO2Preview } from "@/components/log/CO2Preview";
import { Toast } from "@/components/ui/Toast";

export function ActivityForm({ factors }: { factors: EmissionFactor[] }) {
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [notes, setNotes] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const [badges, setBadges] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const idempotencyKeyRef = useRef<string | null>(null);

  const available = useMemo(
    () => factors.filter((factor) => !category || factor.category === category),
    [category, factors]
  );
  const current = available.find((factor) => factor.subcategory === subcategory);
  const preview = current ? current.factor * Number(quantity || 0) : 0;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!current || isSubmitting) return;

    setIsSubmitting(true);
    setToast(null);

    if (!idempotencyKeyRef.current) {
      idempotencyKeyRef.current =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    }

    try {
      const response = await fetch("/api/activities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": idempotencyKeyRef.current
        },
        body: JSON.stringify({
          category: current.category,
          subcategory: current.subcategory,
          quantity: Number(quantity),
          notes
        })
      });

      const json = await response.json();
      if (json.success) {
        setToast("Activity logged successfully.");
        setBadges(json.data.newBadges ?? []);
        setNotes("");
        setSubcategory("");
        setQuantity("1");
        return;
      }

      setToast(json.error ?? "Unable to save activity.");
    } catch {
      setToast("Unable to save activity right now. Please try again.");
    } finally {
      setIsSubmitting(false);
      idempotencyKeyRef.current = null;
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="grid gap-4 rounded-2xl border border-[var(--border)] bg-elevated p-6">
        <CategoryPicker value={category} onChange={(event) => setCategory(event.target.value)} />
        <SubcategoryPicker factors={available} value={subcategory} onChange={(event) => setSubcategory(event.target.value)} />
        <Input type="number" min="0.1" step="0.1" value={quantity} onChange={(event) => setQuantity(event.target.value)} placeholder="Quantity" />
        <Input value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Notes (optional)" />
        <Button type="submit" loading={isSubmitting} disabled={isSubmitting}>
          Save activity
        </Button>
      </form>
      <CO2Preview co2Kg={preview} />
      {badges.length > 0 ? (
        <div className="rounded-2xl border border-strong bg-surface px-4 py-3 text-sm text-text">
          New badges unlocked: {badges.join(", ")}
        </div>
      ) : null}
      <Toast message={toast} />
    </div>
  );
}
