import { Button } from "@/components/ui/Button";

export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-lg rounded-[2rem] border border-strong bg-elevated p-8 text-center shadow-lg">
        <div className="font-display text-4xl text-text">Create your EcoTrace profile</div>
        <p className="mt-4 text-muted">Use Auth0 Universal Login to create your account and initialize your profile in Supabase.</p>
        <a href="/auth/login?screen_hint=signup" className="mt-8 inline-block">
          <Button size="lg">Create account</Button>
        </a>
      </div>
    </div>
  );
}
