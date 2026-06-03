import { Link } from "wouter";
import { Activity } from "lucide-react";

const sections = [
  {
    title: "Services",
    links: [
      { label: "Full Truckload (FTL)", href: "/services" },
      { label: "Less-Than-Truckload (LTL)", href: "/services" },
      { label: "International Freight", href: "/services" },
      { label: "Warehousing & Distribution", href: "/services" },
      { label: "Expedited Shipping", href: "/services" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Our Team", href: "/about" },
      { label: "Careers", href: "/about" },
      { label: "Contact", href: "/#contact" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Track Shipment", href: "/#tracking" },
      { label: "Get a Quote", href: "/#contact" },
      { label: "Freight Insurance", href: "/services" },
      { label: "Industry Insights", href: "/about" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-[#0a1422] border-t border-white/10">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-amber-400">
                <Activity className="h-5 w-5 text-[#0f1b2d]" />
              </div>
              <span className="text-base font-bold tracking-tight text-white">
                Assure <span className="text-amber-400">Logistics</span>
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-slate-400">
              Assure Tour LLC DBA Assure Logistics Services. Moving freight reliably across North America. Your cargo, our commitment.
            </p>
            <div className="mt-4 space-y-1 text-xs text-slate-600">
              <p>+1 (925) 580-8156</p>
              <p>4164 Powell Way Unit 101</p>
              <p>Corona, CA 92883</p>
            </div>
          </div>

          {sections.map((sec) => (
            <div key={sec.title}>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">{sec.title}</p>
              <ul className="mt-4 space-y-2.5">
                {sec.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-xs text-slate-600">© {new Date().getFullYear()} Assure Tour LLC DBA Assure Logistics Services. All rights reserved.</p>
          <div className="flex gap-4 text-xs text-slate-600">
            <a href="#" className="hover:text-slate-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-slate-400 transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
