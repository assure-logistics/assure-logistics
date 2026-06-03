import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Activity, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [location] = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#0f1b2d]/95 backdrop-blur supports-[backdrop-filter]:bg-[#0f1b2d]/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-amber-400">
            <Activity className="h-5 w-5 text-[#0f1b2d]" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white">
            Assure <span className="text-amber-400">Logistics</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                location === link.href
                  ? "text-amber-400"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <a
            href="/#contact"
            className="rounded-md px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/20 hover:ring-white/40 transition-all"
          >
            Get a Quote
          </a>
          <a
            href={`${BASE.replace("/marketing", "")}/`}
            className="rounded-md bg-amber-400 px-4 py-2 text-sm font-semibold text-[#0f1b2d] hover:bg-amber-300 transition-colors"
          >
            Track Shipment
          </a>
        </div>

        <button className="md:hidden text-white" onClick={() => setOpen(!open)}>
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-[#0f1b2d] px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  location === link.href
                    ? "text-amber-400"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <a
              href="/#contact"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-md px-3 py-2 text-sm font-semibold text-amber-400"
            >
              Get a Quote →
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
