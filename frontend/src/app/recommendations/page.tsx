"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  ShieldCheck, 
  HelpCircle, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Sliders, 
  CalendarCheck,
  Building2,
  Info
} from "lucide-react";
import { AssessmentFormData, ProductRecommendation } from "@/types";
import { formatINR } from "@/utils/calculations";

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState<ProductRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    const raw = localStorage.getItem("lifewise_assessment_data");
    const formData: AssessmentFormData = raw
      ? JSON.parse(raw)
      : {
          age: 32,
          annual_income: 1400000,
          monthly_expenses: 55000,
          employment_category: "salaried",
          dependents_count: 2,
          annual_family_support: 660000,
          support_years: 22,
          outstanding_home_loan: 3500000,
          other_liabilities: 250000,
          future_education_goals: 2000000,
          other_future_goals: 500000,
          existing_life_cover: 1000000,
          available_assets: 400000,
          monthly_budget: 2500,
          preferred_duration_years: 30
        };

    fetch("http://localhost:8000/api/recommendations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((res) => {
        if (!res.ok) throw new Error("API error");
        return res.json();
      })
      .then((data: ProductRecommendation[]) => {
        setRecommendations(data);
        setIsLoading(false);
      })
      .catch(() => {
        // Fallback local recommendations
        setRecommendations(getLocalRecommendations(formData));
        setIsLoading(false);
      });
  }, []);

  function getLocalRecommendations(formData: AssessmentFormData): ProductRecommendation[] {
    return [
      {
        category_id: "term_life",
        category_name: "Term Life Insurance",
        badge: "Maximum Protection / Value",
        suitability_score: 95,
        why_it_suits: "Provides high financial coverage for your liabilities and dependent support at the most cost-effective premium.",
        key_benefits: [
          "Highest sum assured per rupee of premium paid",
          "Comprehensive protection against loans and lost income",
          "Option to add Critical Illness and Accidental Disability riders",
          "Tax deduction under Section 80C and tax-free claim under Section 10(10D)"
        ],
        limitations: [
          "Pure protection: No cash value or maturity payout if you survive the tenure",
          "Coverage terminates once the chosen policy period ends"
        ],
        risk_considerations: "No capital or stock market risk. Level premium is locked for entire term.",
        estimated_annual_premium_range: "₹12,500 - ₹18,000/yr (Illustrative)",
        estimated_monthly_premium_range: "₹1,050 - ₹1,500/mo (Illustrative)",
        eligibility_notes: "Subject to standard tele-medical examination for coverage above ₹50 Lakhs.",
        suggested_questions_for_insurer: [
          "What is your insurer's 3-year average individual death claim settlement ratio (CSR)?",
          "Are there specific exclusions or waiting periods for critical illness riders?",
          "Does this policy offer premium waiver on accidental permanent disability?"
        ],
        is_primary_recommendation: true
      },
      {
        category_id: "whole_life",
        category_name: "Whole Life Insurance",
        badge: "Lifelong Legacy & Estate Planning",
        suitability_score: 65,
        why_it_suits: "Guarantees a permanent death benefit up to age 99 or 100, suitable for long-term inheritance planning.",
        key_benefits: [
          "Lifelong coverage with guaranteed death benefit whenever demise occurs",
          "Accumulates cash surrender value over decades",
          "Useful for estate equalization among multiple heirs"
        ],
        limitations: [
          "Substantially higher premiums compared to pure term insurance",
          "Surrender penalties in the first 3-5 years if premiums are discontinued"
        ],
        risk_considerations: "Low market risk. Bonuses depend on the insurer's participating life fund declarations.",
        estimated_annual_premium_range: "₹38,000 - ₹55,000/yr (Illustrative)",
        estimated_monthly_premium_range: "₹3,200 - ₹4,600/mo (Illustrative)",
        eligibility_notes: "Requires committed long-term premium paying capacity.",
        suggested_questions_for_insurer: [
          "What is the historical participating bonus rate declared over the last decade?",
          "What is the guaranteed cash surrender value schedule after 5, 10, and 15 years?",
          "Can policy loans be taken against the accumulated cash value in emergencies?"
        ],
        is_primary_recommendation: false
      },
      {
        category_id: "endowment",
        category_name: "Endowment & Guaranteed Savings",
        badge: "Disciplined Savings + Capital Safety",
        suitability_score: 55,
        why_it_suits: "Combines modest life insurance with a guaranteed maturity payout for a specific financial milestone.",
        key_benefits: [
          "Disciplined savings corpus with guaranteed additions and bonuses",
          "Zero exposure to stock market volatility",
          "Lump sum maturity benefit to fund child education or marriage"
        ],
        limitations: [
          "Historical internal rate of return (IRR) is around 4.5% - 6% p.a., which may trail education inflation",
          "Low life coverage multiplier per rupee invested relative to term plans"
        ],
        risk_considerations: "Capital safe. Inflation risk: purchasing power of maturity payout may lag high inflation.",
        estimated_annual_premium_range: "₹65,000 - ₹90,000/yr (Illustrative)",
        estimated_monthly_premium_range: "₹5,400 - ₹7,500/mo (Illustrative)",
        eligibility_notes: "Best suited for conservative investors with predictable 10-15 year horizons.",
        suggested_questions_for_insurer: [
          "What portion of the payout is guaranteed versus subject to reversionary bonuses?",
          "What are the lock-in and paid-up policy conditions if premiums are halted early?",
          "What is the IRR under the mandatory 4% and 8% IRDAI benefit illustration?"
        ],
        is_primary_recommendation: false
      },
      {
        category_id: "ulip",
        category_name: "ULIP (Unit Linked Insurance Plan)",
        badge: "Market-Linked Wealth Creation + Cover",
        suitability_score: 50,
        why_it_suits: "Allows you to invest part of your premium into equity/debt mutual funds while retaining life cover.",
        key_benefits: [
          "Opportunity for higher long-term wealth creation through equity fund exposure",
          "Free online switching between debt and equity funds without tax impact",
          "Zero premium allocation charges on modern direct-to-consumer online ULIPs"
        ],
        limitations: [
          "Investment risk is borne entirely by the policyholder; NAV fluctuates daily",
          "Mandatory 5-year lock-in period before any partial withdrawals are allowed"
        ],
        risk_considerations: "Moderate to high market risk depending on your equity asset allocation.",
        estimated_annual_premium_range: "₹45,000 - ₹70,000/yr (Illustrative)",
        estimated_monthly_premium_range: "₹3,750 - ₹5,800/mo (Illustrative)",
        eligibility_notes: "Suitable only for investors with a minimum 7 to 10 year investment horizon.",
        suggested_questions_for_insurer: [
          "What is the total fund management charge (FMC) and mortality charge deduction structure?",
          "Does the plan offer Return of Mortality Charges (ROTC) on maturity?",
          "How many free fund switches are permitted each financial year?"
        ],
        is_primary_recommendation: false
      }
    ];
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="inline-block animate-spin w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full mb-4"></div>
        <p className="text-slate-600 font-medium">Evaluating insurance categories based on your needs...</p>
      </div>
    );
  }

  const filtered = selectedCategory === "all"
    ? recommendations
    : recommendations.filter(r => r.category_id === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200">
        <div>
          <span className="badge-teal mb-2">Deterministic Category Matching</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950">
            Explainable Insurance Recommendations
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            We do not sell policies or partner with specific insurers. Below is an objective analysis of four key insurance product structures to help you make an informed decision.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/simulator"
            className="btn-teal text-sm py-2 px-5 shadow-sm font-semibold"
            id="recs-btn-simulator"
          >
            <Sliders className="w-4 h-4 mr-1.5" />
            Budget Simulator
          </Link>
          <Link
            href="/advisory"
            className="btn-primary text-sm py-2 px-5 shadow-sm font-semibold"
            id="recs-btn-advisory"
          >
            <CalendarCheck className="w-4 h-4 mr-1.5" />
            Book Advisor
          </Link>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: "all", label: "All Categories (4)" },
          { id: "term_life", label: "Term Life (Protection)" },
          { id: "whole_life", label: "Whole Life (Estate)" },
          { id: "endowment", label: "Endowment (Guaranteed)" },
          { id: "ulip", label: "ULIP (Market-Linked)" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setSelectedCategory(tab.id)}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition ${
              selectedCategory === tab.id
                ? "bg-slate-900 text-white shadow-sm"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filtered.map((rec) => (
          <div
            key={rec.category_id}
            className={`card-subtle p-6 sm:p-8 bg-white border flex flex-col justify-between ${
              rec.is_primary_recommendation ? "border-teal-500 shadow-md ring-1 ring-teal-500/20" : "border-slate-200"
            }`}
          >
            <div className="space-y-6">
              {/* Header */}
              <div className="flex justify-between items-start gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="badge-teal">{rec.badge}</span>
                    {rec.is_primary_recommendation && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        Primary Fit
                      </span>
                    )}
                  </div>
                  <h2 className="text-2xl font-extrabold text-slate-950">{rec.category_name}</h2>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Fit Score</span>
                  <span className="text-2xl font-black text-slate-900">{rec.suitability_score}/100</span>
                </div>
              </div>

              {/* Why it suits */}
              <p className="text-sm text-slate-700 bg-slate-50 p-3.5 rounded-xl border border-slate-100 leading-relaxed">
                <strong>Why it fits:</strong> {rec.why_it_suits}
              </p>

              {/* Illustrative Premiums */}
              <div className="p-4 rounded-xl bg-teal-50/50 border border-teal-100 flex justify-between items-center text-xs">
                <div>
                  <span className="text-slate-500 block">Illustrative Premium:</span>
                  <strong className="text-slate-900 font-bold text-sm">{rec.estimated_monthly_premium_range}</strong>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block">{rec.estimated_annual_premium_range}</span>
                  <span className="text-[10px] text-teal-700 font-medium">Actuarial simulation</span>
                </div>
              </div>

              {/* Key Benefits */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Key Advantages</h4>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  {rec.key_benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Limitations & Risk */}
              <div className="space-y-3 pt-3 border-t border-slate-100 text-xs">
                <div>
                  <h4 className="font-bold text-slate-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    Limitations to Consider
                  </h4>
                  <ul className="space-y-1 text-slate-600 pl-5 list-disc">
                    {rec.limitations.map((lim, i) => (
                      <li key={i}>{lim}</li>
                    ))}
                  </ul>
                </div>

                <div className="text-slate-500 italic">
                  <strong>Risk Note:</strong> {rec.risk_considerations}
                </div>
              </div>

              {/* Suggested Questions for Insurers */}
              <div className="pt-3 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-teal-600" />
                  Questions to Ask Insurers Before Buying
                </h4>
                <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50/70 p-3 rounded-lg border border-slate-200">
                  {rec.suggested_questions_for_insurer.map((q, i) => (
                    <p key={i} className="flex items-start gap-1.5">
                      <span className="text-teal-600 font-bold">{i + 1}.</span>
                      <span>{q}</span>
                    </p>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-100 flex justify-between items-center">
              <span className="text-[11px] text-slate-400">{rec.eligibility_notes}</span>
              <Link
                href="/advisory"
                className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1"
              >
                Discuss with Advisor <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
