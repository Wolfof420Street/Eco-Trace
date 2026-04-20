import { AgentScanButton } from "@/components/agent/AgentScanButton";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { auth0 } from "@/src/infrastructure/auth0/client";

export default async function SettingsPage() {
  const session = await auth0.getSession();

  return (
    <div className="space-y-6">
      <div>
        <div className="text-sm uppercase tracking-[0.24em] text-muted">Settings</div>
        <h1 className="mt-2 font-display text-4xl text-text">Profile, agents, and preferences</h1>
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-2xl border border-[var(--border)] bg-elevated p-6">
          <h2 className="font-display text-2xl text-text">Profile</h2>
          <div className="mt-4 space-y-2 text-sm text-muted">
            <div>Name: {session?.user.name}</div>
            <div>Email: {session?.user.email}</div>
            <div>User ID: {session?.user.sub}</div>
          </div>
          <div className="mt-6">
            <ThemeToggle />
          </div>
        </section>
        <section className="rounded-2xl border border-[var(--border)] bg-elevated p-6">
          <h2 className="font-display text-2xl text-text">Agent Scanner</h2>
          <p className="mt-3 text-sm leading-7 text-muted">
            Scan your calendar for activities and automatically log relevant items to your carbon footprint.
          </p>
          <div className="mt-6">
            <AgentScanButton />
          </div>
        </section>
      </div>
    </div>
  );
}
