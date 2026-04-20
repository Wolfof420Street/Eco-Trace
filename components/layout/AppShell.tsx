import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-base text-text">
      <Navbar />
      <div className="mx-auto grid max-w-7xl gap-6 px-6 py-6 lg:grid-cols-[260px_1fr]">
        <Sidebar />
        <main>{children}</main>
      </div>
    </div>
  );
}
