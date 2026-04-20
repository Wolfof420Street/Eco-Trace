import Link from "next/link";
import { ArrowRight, Award, BrainCircuit, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/Badge";

const features = [
  { title: "AI Memory", icon: BrainCircuit, copy: "Chat with an eco coach that remembers your journey and personal patterns." },
  { title: "Solana Badges", icon: Award, copy: "Turn sustainability milestones into mintable on-chain proof." },
  { title: "Community Ranking", icon: Sparkles, copy: "See how your daily footprint compares with the wider EcoTrace community." }
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-base text-text">
      <section className="hero-noise relative overflow-hidden px-6 pb-24 pt-10">
        <div className="mx-auto max-w-7xl">
          <Badge>Bioluminescent Data</Badge>
          <div className="mt-8 grid gap-12 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <h1 className="max-w-4xl font-display text-5xl leading-[0.92] text-text md:text-7xl">
                Know Your Impact. Own Your Change.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
                EcoTrace helps you log daily actions, visualize your carbon story, and unlock AI-backed advice with a memory that gets sharper over time.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/login">
                  <Button size="lg">
                    Start Tracking Free <ArrowRight className="ml-2" size={16} />
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button size="lg" variant="secondary">
                    View Dashboard
                  </Button>
                </Link>
              </div>
            </div>
            <div className="rounded-[2rem] border border-strong bg-elevated/80 p-8 shadow-lg backdrop-blur">
              <div className="text-sm uppercase tracking-[0.28em] text-muted">Earth Day Context</div>
              <div className="mt-5 font-mono text-6xl text-primary">37B</div>
              <p className="mt-3 text-sm leading-7 text-muted">Tonnes of annual CO2 emissions globally, reframed into personal action through daily, visible choices.</p>
              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                <div>
                  <div className="font-mono text-2xl text-text">7d</div>
                  <div className="text-sm text-muted">Weekly footprint lens</div>
                </div>
                <div>
                  <div className="font-mono text-2xl text-text">AI</div>
                  <div className="text-sm text-muted">Memory-backed coaching</div>
                </div>
                <div>
                  <div className="font-mono text-2xl text-text">cNFT</div>
                  <div className="text-sm text-muted">Proof of progress</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-4 md:grid-cols-3">
            {["Log", "Visualize", "Earn"].map((step, index) => (
              <div key={step} className="rounded-2xl border border-[var(--border)] bg-elevated p-6">
                <div className="font-mono text-sm text-primary">0{index + 1}</div>
                <h2 className="mt-4 font-display text-3xl">{step}</h2>
                <p className="mt-2 text-muted">
                  {step === "Log" && "Capture transport, food, energy, and goods in a few seconds."}
                  {step === "Visualize" && "Watch your week transform into trends, score rings, and category signals."}
                  {step === "Earn" && "Unlock milestones and mint them into collectible eco proof."}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="rounded-2xl border border-strong bg-elevated p-6 shadow-md">
              <feature.icon className="text-primary" />
              <h3 className="mt-4 font-display text-2xl text-text">{feature.title}</h3>
              <p className="mt-3 text-sm leading-7 text-muted">{feature.copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-[var(--border)] bg-surface/60 px-6 py-20">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-3">
          <div>
            <div className="font-mono text-5xl text-primary">92 kg</div>
            <div className="mt-2 text-sm uppercase tracking-[0.2em] text-muted">Global weekly average</div>
          </div>
          <div>
            <div className="font-mono text-5xl text-primary">4 pillars</div>
            <div className="mt-2 text-sm uppercase tracking-[0.2em] text-muted">Transport, food, energy, goods</div>
          </div>
          <div>
            <div className="font-mono text-5xl text-primary">1 habit</div>
            <div className="mt-2 text-sm uppercase tracking-[0.2em] text-muted">Changed today can bend the line tomorrow</div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
