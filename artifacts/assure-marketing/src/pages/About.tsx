import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Contact from "@/components/Contact";
import { Handshake, Shield, PhoneCall, TrendingUp } from "lucide-react";

const values = [
  {
    icon: Handshake,
    title: "Honest Partnerships",
    desc: "We build long-term relationships with both shippers and carriers through transparency, fair pricing, and clear communication on every load.",
  },
  {
    icon: Shield,
    title: "Accountability",
    desc: "We take ownership of every shipment we coordinate — from booking to final delivery — and proactively communicate any changes along the way.",
  },
  {
    icon: PhoneCall,
    title: "Dedicated Support",
    desc: "You'll always reach a real person. Our team is available to answer questions, resolve issues, and keep your freight moving without delays.",
  },
  {
    icon: TrendingUp,
    title: "Continuous Improvement",
    desc: "As a growing company, we're committed to constantly improving our carrier network, technology, and service standards for every client.",
  },
];

const commitments = [
  { label: "Transparent Pricing", desc: "No hidden fees. You see exactly what you pay before we book." },
  { label: "Nationwide Coverage", desc: "We move freight across all 48 contiguous U.S. states." },
  { label: "Vetted Carriers", desc: "Every carrier in our network is licensed, insured, and MC-authorized." },
  { label: "Fast Quotes", desc: "Receive a custom freight quote within hours, not days." },
  { label: "Real-Time Tracking", desc: "Stay informed with live shipment visibility at every step." },
  { label: "Same-Day Booking", desc: "Ready loads dispatched same day when capacity is available." },
];

export default function About() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <section className="bg-[#0f1b2d] py-20">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
            <span className="inline-flex items-center rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-amber-400">
              About Us
            </span>
            <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              Built on a Promise to Deliver
            </h1>
            <p className="mt-4 text-lg text-slate-300 leading-relaxed">
              Assure Tour LLC, doing business as{" "}
              <strong className="text-amber-400">Assure Logistics Services</strong>, is a
              California-based freight brokerage founded by Pawan Sobti. We connect shippers
              with trusted carriers to move cargo reliably, transparently, and on time.
            </p>
            <p className="mt-3 text-sm text-slate-400">
              4164 Powell Way Unit 101, Corona, CA 92883 &nbsp;·&nbsp; +1 (925) 580-8156
            </p>
          </div>
        </section>

        <section className="py-20 bg-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center mb-12">
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">Our Values</h2>
              <p className="mt-3 text-muted-foreground">The principles that guide every decision we make.</p>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {values.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="rounded-xl border bg-card p-6 text-center hover:shadow-md transition-shadow">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 border border-amber-200">
                    <Icon className="h-6 w-6 text-amber-700" />
                  </div>
                  <h3 className="font-semibold text-foreground">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-muted/40">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center mb-12">
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
                What We Commit To
              </h2>
              <p className="mt-3 text-muted-foreground">
                Every client — big or small — gets the same standard of service.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {commitments.map((c) => (
                <div key={c.label} className="rounded-xl border bg-card p-5 flex gap-4 items-start">
                  <div className="mt-0.5 h-2 w-2 rounded-full bg-amber-400 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">{c.label}</p>
                    <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{c.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Contact />
      </main>
      <Footer />
    </div>
  );
}
