import { Shield, AlertTriangle, Scale, Lock, HelpCircle } from "lucide-react";

export default function DisclaimerPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
      <div>
        <span className="badge-teal mb-2">Legal & Financial Transparency</span>
        <h1 className="text-3xl font-extrabold text-slate-950">Financial Disclaimer & Advisory Notice</h1>
        <p className="text-xs text-slate-500 mt-1">Last Updated: October 2026</p>
      </div>

      <div className="card-subtle p-6 bg-white border border-slate-200 space-y-4 text-sm text-slate-700 leading-relaxed">
        <div className="flex items-start gap-3 p-4 bg-amber-50/70 border border-amber-200 rounded-xl text-amber-900">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5 text-amber-600" />
          <p className="text-xs leading-relaxed">
            <strong>Important Notice:</strong> LifeWise AI is a financial modeling, analytical, and educational tool designed to assist users in understanding life insurance sizing methodologies. LifeWise AI is not a licensed insurance intermediary, insurer, or regulated financial adviser under the Insurance Regulatory and Development Authority of India (IRDAI).
          </p>
        </div>

        <h3 className="text-base font-bold text-slate-900 pt-2">1. Nature of Calculations & Estimates</h3>
        <p>
          All calculations produced by the platform—including the Net Needs assessment, present value computations, and Human Life Value (HLV) benchmarks—are deterministic mathematical estimates based on user-provided inputs, assumed annual inflation (default: 6.0%), and assumed investment discount yields (default: 7.5%).
        </p>
        <p>
          These estimates do not constitute personalized underwriting decisions, policy quotes, or guarantees of insurance cover. Actual coverage eligibility, premiums, medical tests, and policy terms are determined exclusively by regulated life insurance companies at the time of formal application.
        </p>

        <h3 className="text-base font-bold text-slate-900 pt-2">2. Illustrative Premium Quotations</h3>
        <p>
          Premium figures displayed throughout the platform and interactive simulator are illustrative ranges derived from standard actuarial mortality benchmark tables. They do not represent live insurer API quotations or binding commitments.
        </p>

        <h3 className="text-base font-bold text-slate-900 pt-2">3. Digital Advisory & Appointments</h3>
        <p>
          Consultation bookings and advisor profiles displayed on this platform are for demonstration and educational purposes. Always consult an authorized and registered financial adviser or certified planner before entering into binding insurance contracts.
        </p>
      </div>
    </div>
  );
}
