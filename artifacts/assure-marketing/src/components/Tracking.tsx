import { useState } from "react";
import { Search, Package, MapPin, ArrowRight, Clock, CheckCircle2, AlertTriangle, Truck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type TrackResult = {
  trackingNumber: string;
  status: string;
  origin: string;
  destination: string;
  carrierName?: string | null;
  estimatedDelivery?: string | null;
  description?: string | null;
};

const STATUS_ICON: Record<string, React.ElementType> = {
  pending: Clock,
  in_transit: Truck,
  out_for_delivery: Truck,
  delivered: CheckCircle2,
  delayed: AlertTriangle,
  cancelled: AlertTriangle,
};

const STATUS_COLOR: Record<string, string> = {
  pending: "text-amber-600 bg-amber-50 border-amber-200",
  in_transit: "text-blue-700 bg-blue-50 border-blue-200",
  out_for_delivery: "text-orange-700 bg-orange-50 border-orange-200",
  delivered: "text-green-700 bg-green-50 border-green-200",
  delayed: "text-red-700 bg-red-50 border-red-200",
  cancelled: "text-gray-600 bg-gray-50 border-gray-200",
};

function statusLabel(s: string) {
  return s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function Tracking() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TrackResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const apiBase = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, "") ?? "";

  async function handleTrack(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;

    if (!apiBase) {
      setError("Live tracking is not available on this site. To track your shipment, call us at +1 (925) 580-8156 or email info@assurelogisticsservices.com.");
      return;
    }

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const res = await fetch(`${apiBase}/api/shipments?search=${encodeURIComponent(query.trim())}`);
      if (!res.ok) throw new Error("Request failed");
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const s = data[0];
        setResult({
          trackingNumber: s.trackingNumber,
          status: s.status,
          origin: s.origin,
          destination: s.destination,
          carrierName: s.carrierName,
          estimatedDelivery: s.estimatedDelivery,
          description: s.description,
        });
      } else {
        setError("No shipment found with that tracking number. Please check and try again.");
      }
    } catch {
      setError("Unable to retrieve tracking info right now. Please try again shortly.");
    } finally {
      setLoading(false);
    }
  }

  const StatusIcon = result ? (STATUS_ICON[result.status] ?? Package) : Package;

  return (
    <section id="tracking" className="bg-[#0f1b2d] py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="inline-flex items-center rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-amber-400">
            Live Tracking
          </span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Track Your Shipment
          </h2>
          <p className="mt-3 text-slate-400">
            Enter your tracking number to get the latest status and location of your freight.
          </p>
        </div>

        <form onSubmit={handleTrack} className="mt-8 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Enter tracking number (e.g. FFI-2026-001)"
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-slate-500 focus:border-amber-400/50 focus:ring-amber-400/20 h-11"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              data-testid="input-tracking-query"
            />
          </div>
          <Button
            type="submit"
            disabled={loading || !query.trim()}
            className="h-11 bg-amber-400 text-[#0f1b2d] font-semibold hover:bg-amber-300 shrink-0"
            data-testid="button-track"
          >
            {loading ? "Searching…" : "Track"}
          </Button>
        </form>

        {error && (
          <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-300">
            {error}
          </div>
        )}

        {result && (
          <div className="mt-5 overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider">Tracking Number</p>
                <p className="mt-0.5 font-mono font-bold text-white text-lg">{result.trackingNumber}</p>
              </div>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${STATUS_COLOR[result.status] ?? "text-gray-600 bg-gray-50 border-gray-200"}`}
              >
                <StatusIcon className="h-3.5 w-3.5" />
                {statusLabel(result.status)}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-px bg-white/5 sm:grid-cols-4">
              <Cell label="Origin" value={result.origin} />
              <Cell label="Destination" value={result.destination} />
              <Cell label="Carrier" value={result.carrierName ?? "—"} />
              <Cell label="Est. Delivery" value={result.estimatedDelivery ?? "—"} />
            </div>

            {result.description && (
              <div className="border-t border-white/10 px-5 py-3">
                <p className="text-xs text-slate-500">Description</p>
                <p className="mt-0.5 text-sm text-slate-300">{result.description}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function Cell({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[#0f1b2d] px-5 py-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-0.5 text-sm font-medium text-white truncate">{value}</p>
    </div>
  );
}
