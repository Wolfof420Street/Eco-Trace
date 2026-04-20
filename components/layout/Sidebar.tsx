import Link from "next/link";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/log", label: "Log Activity" },
  { href: "/insights", label: "AI Insights" },
  { href: "/badges", label: "Badges" },
  { href: "/settings", label: "Settings" }
];

export function Sidebar() {
  return (
    <aside className="w-full rounded-2xl border border-[var(--border)] bg-surface/70 p-4 lg:w-64">
      <div className="mb-4 font-display text-xl text-text">EcoTrace</div>
      <nav className="space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block rounded-xl px-4 py-3 text-sm text-muted transition hover:bg-elevated hover:text-text"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
