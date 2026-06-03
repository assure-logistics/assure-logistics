import { Link } from "wouter";
import { Truck, Package, Globe2, Warehouse, Clock, ShieldCheck, ArrowRight } from "lucide-react";

const services = [
  {
    icon: Truck,
    title: "Full Truckload (FTL)",
    description:
      "Dedicated truck capacity for large, time-sensitive loads. Direct point-to-point routing with no stops, ensuring your cargo arrives intact and on schedule.",
    color: "text-blue-400",
    bg: "bg-blue-400/10 border-blue-400/20",
  },
  {
    icon: Package,
    title: "Less-Than-Truckload (LTL)",
    description:
      "Cost-effective shared shipping for smaller freight. Pay only for the space you use while benefiting from our optimized multi-stop carrier network.",
    color: "text-amber-400",
    bg: "bg-amber-400/10 border-amber-400/20",
  },
  {
    icon: Globe2,
    title: "International Freight",
    description:
      "Seamless cross-border logistics including customs brokerage, documentation, and compliance support for imports and exports worldwide.",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10 border-emerald-400/20",
  },
  {
    icon: Warehouse,
    title: "Warehousing & Distribution",
    description:
      "Short and long-term storage with fulfillment services. Our strategically located facilities reduce last-mile delivery times across key markets.",
    color: "text-purple-400",
    bg: "bg-purple-400/10 border-purple-400/20",
  },
  {
    icon: Clock,
    title: "Expedited Shipping",
    description:
      "When time is critical, our expedited service guarantees same-day or next-day delivery with priority carrier assignments and continuous monitoring.",
    color: "text-orange-400",
    bg: "bg-orange-400/10 border-orange-400/20",
  },
  {
    icon: ShieldCheck,
    title: "Freight Insurance",
    description:
      "Comprehensive cargo coverage for every shipment. Our all-risk policies protect your goods from pickup to delivery with fast claims resolution.",
    color: "text-rose-400",
    bg: "bg-rose-400/10 border-rose-400/20",
  },
];

export default function Services() {
  return (
    <section id="services" className="py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center rounded-full border border-amber-400/30 bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-amber-700">
            What We Offer
          </span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
            End-to-End Logistics Solutions
          </h2>
          <p className="mt-4 text-muted-foreground">
            From a single pallet to a full fleet — we have the services to move your
            freight smarter, faster, and more affordably.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((svc) => (
            <div
              key={svc.title}
              className={`rounded-xl border p-6 transition-shadow hover:shadow-md ${svc.bg}`}
            >
              <div className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg border ${svc.bg}`}>
                <svc.icon className={`h-5 w-5 ${svc.color}`} />
              </div>
              <h3 className="font-semibold text-foreground">{svc.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {svc.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/services"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground hover:text-amber-600 transition-colors"
          >
            View all services <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
