import { AppShell } from "@/components/layout/AppShell";
import { redirect } from "next/navigation";
import { auth0 } from "@/src/infrastructure/auth0/client";

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const session = await auth0.getSession();
  if (!session?.user?.sub) {
    redirect("/login");
  }

  return <AppShell>{children}</AppShell>;
}
