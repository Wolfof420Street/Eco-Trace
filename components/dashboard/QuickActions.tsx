import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function QuickActions() {
  return (
    <div className="flex flex-wrap gap-3">
      <Link href="/log">
        <Button>Log activity</Button>
      </Link>
      <Link href="/insights">
        <Button variant="secondary">Ask EcoTrace AI</Button>
      </Link>
    </div>
  );
}
