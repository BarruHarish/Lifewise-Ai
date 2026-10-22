import Link from "next/link";
import { Shield, Lock, FileText, CheckCircle2 } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-white px-2.5 py-1.5 rounded-xl inline-flex items-center shadow-sm">
                <img
                  src="/logo.png"
                  alt="LifeWise AI Logo"
                  className="h-9 w-auto object-contain"
                />
              </div>
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              An intelligent life insurance needs analysis and financial simulation platform. We empower Indian families and professionals with transparent, mathematical estimates for lifetime financial safety.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-teal-400" /> Transparent Math</span>
              <span className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5 text-teal-400" /> Data Privacy</span>
              <span className="flex items-center gap-1.5"><FileText className="w-3.5 h-3.5 text-teal-400" /> Unbiased Insights</span>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Platform</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/assessment" className="hover:text-white transition">Needs Assessment</Link></li>
              <li><Link href="/results" className="hover:text-white transition">Coverage Breakdown</Link></li>
              <li><Link href="/recommendations" className="hover:text-white transition">Product Comparison</Link></li>
              <li><Link href="/simulator" className="hover:text-white transition">Budget Simulator</Link></li>
              <li><Link href="/advisory" className="hover:text-white transition">Digital Advisory</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Compliance & Trust</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/disclaimer" className="hover:text-white transition">Financial Disclaimer</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
              <li><Link href="/methodology" className="hover:text-white transition">Calculation Assumptions</Link></li>
              <li><a href="https://irdai.gov.in" target="_blank" rel="noreferrer" className="hover:text-white transition">IRDAI Guidelines</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 text-xs text-slate-500 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© 2026 LifeWise AI. All financial calculations are deterministic mathematical estimates intended for educational and planning guidance. Not an official insurance solicitation.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:underline">Privacy</Link>
            <Link href="/disclaimer" className="hover:underline">Disclaimer</Link>
            <Link href="/terms" className="hover:underline">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
