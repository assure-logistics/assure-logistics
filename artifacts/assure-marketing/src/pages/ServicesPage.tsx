import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Services from "@/components/Services";
import Contact from "@/components/Contact";
import { ArrowRight } from "lucide-react";

const industries = [
  { name: "Retail & E-Commerce", desc: "High-volume, time-critical fulfilment with flexible storage and last-mile solutions." },
  { name: "Automotive", desc: "JIT delivery for OEM parts and assemblies. Temperature and vibration-controlled options available." },
  { name: "Food & Beverage", desc: "Temperature-controlled cold chain management from origin to distribution center." },
  { name: "Healthcare & Pharma", desc: "GDP-compliant pharmaceutical logistics with chain-of-custody documentation." },
  { name: "Manufacturing", desc: "Raw material inbound and finished goods outbound with plant-door delivery." },
  { name: "Construction", desc: "Oversized and heavy freight specialists for equipment and building materials." },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <section className="bg-[#0f1b2d] py-20">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
            <span className="inline-flex items-center rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-amber-400">
              Our Services
            </span>
            <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              Complete Freight Solutions
            </h1>
            <p className="mt-4 text-lg text-slate-300 leading-relaxed">
              From small parcels to oversized loads, domestic lanes to international corridors —
              our full suite of logistics services is designed to move your business forward.
            </p>
            <a
              href="#contact"
              className="mt-8 inline-flex items-center gap-2 rounded-md bg-amber-400 px-6 py-3 text-sm font-semibold text-[#0f1b2d] hover:bg-amber-300 transition-colors"
            >
              Get a Free Quote <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </section>

        <Services />

        <section className="py-20 bg-muted/40">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center mb-12">
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
                Industries We Serve
              </h2>
              <p className="mt-3 text-muted-foreground">
                Deep expertise across the sectors that matter most.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {industries.map((ind) => (
                <div key={ind.name} className="rounded-xl border bg-card p-5 hover:shadow-sm transition-shadow">
                  <h3 className="font-semibold text-foreground">{ind.name}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{ind.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-[#0f1b2d]">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Ready to simplify your freight?
            </h2>
            <p className="mt-4 text-slate-300">
              Get a custom quote in under 24 hours. No commitment required.
            </p>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <a
                href="#contact"
                className="rounded-md bg-amber-400 px-8 py-3 text-sm font-semibold text-[#0f1b2d] hover:bg-amber-300 transition-colors"
              >
                Request a Quote
              </a>
              <a
                href="tel:+19255808156"
                className="rounded-md border border-white/20 px-8 py-3 text-sm font-semibold text-white hover:border-white/40 hover:bg-white/5 transition-colors"
              >
                Call +1 (925) 580-8156
              </a>
            </div>
          </div>
        </section>

        <Contact />
      </main>
      <Footer />
    </div>
  );
}
