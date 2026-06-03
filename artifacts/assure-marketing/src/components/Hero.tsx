import { Link } from "wouter";
import { ArrowRight, Shield, Clock, Truck, FileCheck } from "lucide-react";

const serviceCards = [
  { icon: Truck, title: "Full & Partial Truckload", desc: "FTL and LTL freight across all 48 contiguous states." },
  { icon: Shield, title: "Cargo Insurance", desc: "End-to-end coverage on every shipment we move." },
  { icon: Clock, title: "Real-Time Tracking", desc: "Live visibility on your freight from pickup to delivery." },
  { icon: FileCheck, title: "Compliance & Docs", desc: "BOL, POD, and freight documentation handled for you." },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#0f1b2d] py-20 sm:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_60%_-20%,rgba(251,191,36,0.15),transparent_60%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_-10%_80%,rgba(59,130,246,0.08),transparent_50%)]"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div className="max-w-xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-400 uppercase tracking-widest">
              California-Based Freight Brokerage
            </div>

            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              Freight Delivered
              <br />
              <span className="text-amber-400">On Time. Every Time.</span>
            </h1>

            <p className="mt-5 text-lg leading-relaxed text-slate-300">
              Assure Logistics Services connects shippers with reliable carriers across the nation —
              with transparent pricing, real-time tracking, and dedicated support on every load.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a
                href="#contact"
                className="flex items-center justify-center gap-2 rounded-md bg-amber-400 px-6 py-3 text-sm font-semibold text-[#0f1b2d] hover:bg-amber-300 transition-colors"
              >
                Get a Free Quote <ArrowRight className="h-4 w-4" />
              </a>
              <Link
                href="/services"
                className="flex items-center justify-center gap-2 rounded-md border border-white/20 px-6 py-3 text-sm font-semibold text-white hover:border-white/40 hover:bg-white/5 transition-colors"
              >
                Our Services
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {serviceCards.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur"
              >
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-amber-400/10 border border-amber-400/20">
                  <Icon className="h-5 w-5 text-amber-400" />
                </div>
                <p className="text-sm font-semibold text-white">{title}</p>
                <p className="mt-1 text-xs text-slate-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-b from-transparent to-background" />
    </section>
  );
}
