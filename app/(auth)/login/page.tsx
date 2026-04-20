import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-lg rounded-[2rem] border border-strong bg-elevated p-8 text-center shadow-lg">
        <div className="font-display text-4xl text-text">Welcome back to EcoTrace</div>
        <p className="mt-4 text-muted">
          Sign in with Auth0 to sync your EcoTrace profile, AI memory thread, and protected dashboard.
        </p>
        <a href="/auth/login" className="mt-8 inline-block">
          <Button size="lg">Continue with Auth0</Button>
        </a>
      </div>
    </div>
  );
}
