"use client";

import Link from "next/link";
import { useState } from "react";
import { 
  ShieldCheck, 
  ArrowRight, 
  Calculator, 
  PieChart, 
  SlidersHorizontal, 
  CalendarCheck, 
  CheckCircle, 
  TrendingUp, 
  Layers, 
  HelpCircle,
  AlertCircle
} from "lucide-react";
import { formatINR } from "@/utils/calculations";

export default function LandingPage() {
  const [quickIncome, setQuickIncome] = useState(1200000);
  const [quickDependents, setQuickDependents] = useState(2);
  const [quickLoan, setQuickLoan] = useState(3000000);

  // Quick illustrative rule of thumb: (10x-15x income) + liabilities
  const quickEst = quickIncome * 12 + quickLoan;

  const faqs = [
    {
      q: "How does the Net Needs Approach determine my cover?",
      a: "The Net Needs Approach calculates the exact present value required to fund your family's ongoing living expenses until dependents become financially independent, adds all outstanding loans and future milestone goals (like education), and subtracts your liquid assets and existing insurance."
    },
    {
      q: "What is the difference between Net Needs and Human Life Value (HLV)?",
      a: "Net Needs measures what your family specifically requires to maintain their standard of living and extinguish liabilities. Human Life Value measures the economic present value of your remaining working career earnings. We display both separately for comprehensive comparison without double counting."
    },
    {
      q: "Why does LifeWise AI recommend Term Insurance as primary for large gaps?",
      a: "Term insurance provides the highest sum assured for the lowest premium, guaranteeing that liabilities like home loans and children's upbringing are 100% shielded without burdening monthly cash flows."
    },
    {
      q: "Is this platform a licensed insurance broker or distributor?",
      a: "LifeWise AI is an independent educational and analytical fintech tool designed to provide transparent, explainable calculations. We do not sell insurance policies, collect sales commissions, or bias recommendations."
    }
  ];

  return (
    <div className="flex flex-col gap-20">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-slate-200 bg-gradient-to-b from-white via-slate-50/50 to-slate-100/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold tracking-wide">
                <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
                FINTECH ADVISORY PLATFORM
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-950 tracking-tight leading-[1.12]">
                Find the Right <span className="text-teal-600">Life Cover</span> for Your Future.
              </h1>

              <p className="text-lg sm:text-xl text-slate-600 max-w-2xl leading-relaxed">
                Understand your financial protection needs and explore insurance options tailored to your life. Powered by transparent mathematical models, inflation discounting, and unbiased category guidance.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/assessment"
                  id="hero-primary-cta"
                  className="btn-primary text-base px-7 py-3.5 shadow-md shadow-slate-900/10"
                >
                  Calculate My Life Cover
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>

                <a
                  href="#how-it-works"
                  id="hero-secondary-cta"
                  className="btn-secondary text-base px-6 py-3.5"
                >
                  How It Works
                </a>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 border-t border-slate-200/80 grid grid-cols-3 gap-4 text-xs text-slate-500">
                <div>
                  <span className="block font-bold text-slate-900 text-sm">Present Value</span>
                  Discounted future cashflows
                </div>
                <div>
                  <span className="block font-bold text-slate-900 text-sm">Zero Bias</span>
                  No sales quotas or commissions
                </div>
                <div>
                  <span className="block font-bold text-slate-900 text-sm">Interactive</span>
                  Real-time budget scenarios
                </div>
              </div>
            </div>

            {/* Quick Interactive Interactive Teaser Card */}
            <div className="lg:col-span-5">
              <div className="card-subtle p-6 sm:p-8 bg-white border border-slate-200/90 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-teal-50 rounded-bl-full -z-0"></div>
                <div className="relative z-10 space-y-5">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">Quick Estimator</span>
                      <h3 className="text-lg font-bold text-slate-900">Coverage Preview</h3>
                    </div>
                    <span className="badge-teal">Live Preview</span>
                  </div>

                  <div className="space-y-4 text-sm">
                    <div>
                      <div className="flex justify-between mb-1">
                        <label className="text-slate-600 font-medium">Annual Income</label>
                        <span className="font-semibold text-slate-900">{formatINR(quickIncome)}</span>
                      </div>
                      <input
                        type="range"
                        min="300000"
                        max="5000000"
                        step="100000"
                        value={quickIncome}
                        onChange={(e) => setQuickIncome(Number(e.target.value))}
                        className="w-full accent-teal-600"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <label className="text-slate-600 font-medium">Home Loan / Debts</label>
                        <span className="font-semibold text-slate-900">{formatINR(quickLoan)}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="10000000"
                        step="200000"
                        value={quickLoan}
                        onChange={(e) => setQuickLoan(Number(e.target.value))}
                        className="w-full accent-teal-600"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <label className="text-slate-600 font-medium">Dependents</label>
                        <span className="font-semibold text-slate-900">{quickDependents} Persons</span>
                      </div>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4].map((num) => (
                          <button
                            key={num}
                            type="button"
                            onClick={() => setQuickDependents(num)}
                            className={`flex-1 py-1.5 text-xs font-semibold rounded-md border transition ${
                              quickDependents === num
                                ? "bg-slate-900 text-white border-slate-900"
                                : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                            }`}
                          >
                            {num}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100">
                    <span className="text-xs text-slate-500 font-medium">Rule of Thumb Baseline Cover:</span>
                    <div className="text-2xl sm:text-3xl font-extrabold text-slate-950 mt-1">
                      {formatINR(quickEst)}
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      Full multi-step assessment factors in 6% inflation, goals, and existing assets.
                    </p>
                  </div>

                  <Link
                    href="/assessment"
                    className="btn-teal w-full text-center text-sm py-2.5 shadow-sm"
                  >
                    Run Detailed Multi-Step Assessment
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. HOW IT WORKS */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-bold text-teal-700 uppercase tracking-widest">Transparent Methodology</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950">How LifeWise AI Works</h2>
          <p className="text-base text-slate-600">
            A 4-step disciplined framework replacing arbitrary rules of thumb with actuarial discounting and goal-linked planning.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              step: "01",
              title: "Financial Profile",
              desc: "Provide basic details on your income, monthly household expenses, dependents, and employment category.",
              icon: Calculator
            },
            {
              step: "02",
              title: "Obligations & Goals",
              desc: "Factor in outstanding loans (home loan, personal loan) and future obligations like children higher education.",
              icon: Layers
            },
            {
              step: "03",
              title: "Net Needs Engine",
              desc: "Compute present value of inflation-adjusted living expenses, deducting liquid assets and current insurance cover.",
              icon: PieChart
            },
            {
              step: "04",
              title: "Advisory & Scenarios",
              desc: "Simulate tenure & budget affordability, review unbiased product categories, and book a consultation with a certified advisor.",
              icon: CalendarCheck
            }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="card-subtle p-6 relative flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-2xl font-black text-slate-200">{item.step}</span>
                    <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center text-teal-700">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. PRODUCT CATEGORIES EXPLAINED */}
      <section className="bg-white border-y border-slate-200 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="text-xs font-bold text-teal-700 uppercase tracking-widest">Product Categories</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950">Explainable Insurance Categories</h2>
            <p className="text-base text-slate-600">
              We never promote single products. We explain the financial trade-offs between protection and investment vehicles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Term Life Insurance",
                badge: "Pure Protection",
                desc: "Highest coverage for lowest premium. Pays sum assured to nominees if demise occurs within tenure.",
                pros: "Maximum cover per rupee, rider options",
                cons: "No maturity return if you survive"
              },
              {
                title: "Whole Life Insurance",
                badge: "Lifelong Estate",
                desc: "Provides coverage up to age 99 or 100 with guaranteed estate legacy and cash surrender values.",
                pros: "Lifelong protection, inheritance transfer",
                cons: "Higher recurring premiums"
              },
              {
                title: "Endowment Plans",
                badge: "Guaranteed Savings",
                desc: "Traditional disciplined savings plan combining modest life cover with capital-protected lump-sum bonuses.",
                pros: "Zero stock risk, guaranteed payouts",
                cons: "Moderate returns (4.5% - 6% p.a.)"
              },
              {
                title: "ULIPs",
                badge: "Market-Linked",
                desc: "Dual purpose plan investing premiums into equity/debt mutual funds while providing 10x life cover.",
                pros: "Equity upside, tax-free fund switching",
                cons: "Market risk, 5-year mandatory lock-in"
              }
            ].map((cat, i) => (
              <div key={i} className="card-subtle p-6 flex flex-col justify-between">
                <div>
                  <span className="badge-teal mb-3">{cat.badge}</span>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{cat.title}</h3>
                  <p className="text-sm text-slate-600 mb-4 leading-relaxed">{cat.desc}</p>
                </div>
                <div className="pt-4 border-t border-slate-100 text-xs space-y-1.5">
                  <div className="text-emerald-700 font-medium">✓ {cat.pros}</div>
                  <div className="text-amber-700 font-medium">⚠️ {cat.cons}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FAQ SECTION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-bold text-teal-700 uppercase tracking-widest">Frequently Asked Questions</span>
          <h2 className="text-3xl font-extrabold text-slate-950">Clear Answers to Common Questions</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="card-subtle p-6 bg-white">
              <h3 className="text-base font-bold text-slate-900 flex items-start gap-2.5">
                <HelpCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                {faq.q}
              </h3>
              <p className="text-sm text-slate-600 mt-2 pl-7.5 leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. FINAL CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="card-primary p-8 sm:p-12 text-center relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-6 relative z-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Ready to Shield Your Family's Financial Future?
            </h2>
            <p className="text-slate-300 text-base sm:text-lg">
              Take the 3-minute assessment now to calculate your exact Net Needs cover and receive an unbiased recommendation report.
            </p>
            <div className="pt-2">
              <Link
                href="/assessment"
                id="footer-banner-cta"
                className="btn-teal text-base py-3.5 px-8 shadow-lg shadow-teal-900/30 font-bold"
              >
                Start Financial Assessment
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
