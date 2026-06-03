import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Tracking from "@/components/Tracking";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { CheckCircle2 } from "lucide-react";

const whyUs = [
  "Industry-leading 99.2% on-time delivery rate",
  "Dedicated account manager for every client",
  "Real-time GPS tracking on every shipment",
  "Flexible billing — spot rates or contract pricing",
  "48-state coverage with same-day quoting",
  "All cargo fully insured up to $500K per load",
];

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <Services />

        <section className="py-20 bg-muted/40">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
              <div>
                <span className="inline-flex items-center rounded-full border border-amber-400/30 bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-amber-700">
                  Why Choose Us
                </span>
                <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
                  Logistics built on reliability and transparency
                </h2>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  We aren't just a broker — we're your logistics partner. Every shipment is
                  monitored from pickup to delivery, with proactive updates so you're never
                  in the dark about where your cargo is.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {whyUs.map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-lg border bg-card p-4">
                    <CheckCircle2 className="h-4 w-4 mt-0.5 text-green-600 shrink-0" />
                    <p className="text-sm text-foreground">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <Tracking />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
