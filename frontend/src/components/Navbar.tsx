"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, Calculator, Compass, Sliders, CalendarCheck, HelpCircle } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { name: "Home", href: "/", icon: Shield },
    { name: "Assessment", href: "/assessment", icon: Calculator },
    { name: "Results", href: "/results", icon: Compass },
    { name: "Recommendations", href: "/recommendations", icon: Shield },
    { name: "Simulator", href: "/simulator", icon: Sliders },
    { name: "Advisory", href: "/advisory", icon: CalendarCheck },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-3 group">
            <img
              src="/logo.png"
              alt="LifeWise AI Logo"
              className="h-10 sm:h-12 w-auto object-contain transition group-hover:scale-105"
            />
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${
                    isActive
                      ? "bg-slate-100 text-slate-950 font-semibold"
                      : "text-slate-600 hover:text-slate-950 hover:bg-slate-50"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-teal-600" : "text-slate-400"}`} />
                  {link.name}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/assessment"
              className="btn-primary text-xs sm:text-sm py-2 px-4 shadow-sm"
              id="nav-cta-calculate"
            >
              Calculate Cover
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
