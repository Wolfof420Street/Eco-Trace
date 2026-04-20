import { Button } from "@/components/ui/Button";

export function ApprovalNotification({
  items,
  open,
  isSubmitting,
  onApprove,
  onClose
}: {
  items: Array<{ title: string; estimatedCategory: string; estimatedSubcategory: string; estimatedQuantity?: number; confidence: number }>;
  open: boolean;
  isSubmitting: boolean;
  onApprove: () => void;
  onClose: () => void;
}) {
  if (!open || !items.length) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--bg-overlay)] p-4">
      <div className="w-full max-w-2xl space-y-3 rounded-2xl border border-[var(--border)] bg-elevated p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-2xl text-text">Approve scanned activities</h3>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>
        {items.map((item) => (
          <div key={item.title} className="rounded-xl bg-surface px-4 py-3">
            <div className="text-text">{item.title}</div>
            <div className="text-sm text-muted">
              {item.estimatedCategory} / {item.estimatedSubcategory} / qty {item.estimatedQuantity ?? 0} / confidence {Math.round(item.confidence * 100)}%
            </div>
          </div>
        ))}
        <Button onClick={onApprove} loading={isSubmitting}>
          Approve selected items
        </Button>
      </div>
    </div>
  );
}
