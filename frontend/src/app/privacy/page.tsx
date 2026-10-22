import { ShieldCheck, Lock, EyeOff, Database } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
      <div>
        <span className="badge-teal mb-2">Data Protection</span>
        <h1 className="text-3xl font-extrabold text-slate-950">Privacy Policy & Data Security</h1>
        <p className="text-xs text-slate-500 mt-1">Compliance with Digital Personal Data Protection (DPDP) Act</p>
      </div>

      <div className="card-subtle p-6 bg-white border border-slate-200 space-y-4 text-sm text-slate-700 leading-relaxed">
        <h3 className="text-base font-bold text-slate-900">1. Data Minimization</h3>
        <p>
          LifeWise AI collects only the financial and demographic parameters strictly necessary to compute your life insurance needs (such as age, income, dependents, liabilities, and existing protection). We do not request bank account numbers, PAN cards, Aadhaar numbers, or medical history files.
        </p>

        <h3 className="text-base font-bold text-slate-900 pt-2">2. Anonymous & Client-Side Capabilities</h3>
        <p>
          You are not required to create an account or sign up to evaluate your financial needs. Assessment parameters can be calculated entirely in your browser session using local storage.
        </p>

        <h3 className="text-base font-bold text-slate-900 pt-2">3. Zero Data Brokering</h3>
        <p>
          We strictly respect your privacy. LifeWise AI does not sell, lease, or distribute your contact details or financial figures to third-party telemarketers or external insurance agencies.
        </p>

        <h3 className="text-base font-bold text-slate-900 pt-2">4. Consultation Booking Information</h3>
        <p>
          When you schedule an advisory consultation, your name, email, and preferred topic are securely transmitted solely to facilitate calendar coordination and meeting confirmation.
        </p>
      </div>
    </div>
  );
}
