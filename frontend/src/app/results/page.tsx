"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  ShieldAlert, 
  CheckCircle, 
  HelpCircle, 
  ArrowRight, 
  Edit3, 
  Sliders, 
  Info, 
  Layers, 
  TrendingUp,
  FileCheck2,
  PieChart as PieIcon
} from "lucide-react";
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Legend 
} from "recharts";
import { AssessmentFormData, FinancialNeedsResult } from "@/types";
import { computeFinancialNeedsLocal, formatINR } from "@/utils/calculations";

export default function ResultsPage() {
  const [formData, setFormData] = useState<AssessmentFormData | null>(null);
  const [result, setResult] = useState<FinancialNeedsResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const raw = localStorage.getItem("lifewise_assessment_data");
    let currentData: AssessmentFormData;
    if (raw) {
      try {
        currentData = JSON.parse(raw);
      } catch {
        currentData = getDefaultFormData();
      }
    } else {
      currentData = getDefaultFormData();
    }

    setFormData(currentData);

    // Call API or local fallback
    fetch("http://localhost:8000/api/coverage/calculate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(currentData),
    })
      .then((res) => {
        if (!res.ok) throw new Error("API error");
        return res.json();
      })
      .then((data: FinancialNeedsResult) => {
        setResult(data);
        setIsLoading(false);
      })
      .catch(() => {
        // Fallback to verified identical client calculation
        const local = computeFinancialNeedsLocal(currentData);
        setResult(local);
        setIsLoading(false);
      });
  }, []);

  function getDefaultFormData(): AssessmentFormData {
    return {
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
  }

  if (isLoading || !result || !formData) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="inline-block animate-spin w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full mb-4"></div>
        <p className="text-slate-600 font-medium">Computing your actuarial financial needs...</p>
      </div>
    );
  }

  // Visual Breakdown Data
  const pieData = [
    { name: "Family Support (PV)", value: result.pv_family_support, color: "#0B192C" },
    { name: "Outstanding Debts", value: result.total_liabilities, color: "#0D9488" },
    { name: "Future Goals", value: result.total_future_goals, color: "#14B8A6" },
  ];

  const comparisonBarData = [
    {
      name: "Financial Profile",
      "Total Estimated Needs": result.total_estimated_needs,
      "Available Protection": result.total_existing_protection,
      "Coverage Gap (Cover Needed)": result.estimated_additional_cover,
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Top Banner / Summary */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200">
        <div>
          <span className="badge-teal mb-2">Transparent Net Needs Analysis</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950">
            Financial Needs & Coverage Assessment
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Based on a {formData.support_years}-year horizon with 6.0% inflation and 7.5% protection discount yield.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/assessment"
            className="btn-secondary text-sm py-2 px-4 shadow-sm"
            id="results-btn-edit"
          >
            <Edit3 className="w-4 h-4 mr-1.5 text-slate-500" />
            Edit Assessment
          </Link>

          <Link
            href="/recommendations"
            className="btn-teal text-sm py-2 px-5 shadow-sm font-semibold"
            id="results-btn-explore-recs"
          >
            Explore Recommendations
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Link>
        </div>
      </div>

      {/* Hero Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card-primary p-6 relative overflow-hidden flex flex-col justify-between">
          <div className="relative z-10">
            <span className="text-xs font-semibold text-teal-300 uppercase tracking-wider block mb-1">
              Estimated Additional Cover Required
            </span>
            <div className="text-3xl sm:text-4xl font-black text-white mt-1">
              {formatINR(result.estimated_additional_cover)}
            </div>
            <p className="text-xs text-slate-300 mt-2">
              Recommended pure protection cover to close your family's coverage gap.
            </p>
          </div>
        </div>

        <div className="card-subtle p-6 bg-white flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
              Total Estimated Needs
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              {formatINR(result.total_estimated_needs)}
            </div>
            <p className="text-xs text-slate-500 mt-2">
              PV of support ({formatINR(result.pv_family_support)}) + Debts & Goals.
            </p>
          </div>
        </div>

        <div className="card-subtle p-6 bg-white flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
              Available Protection
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700 mt-1">
              {formatINR(result.total_existing_protection)}
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Current cover ({formatINR(formData.existing_life_cover)}) + Liquid assets.
            </p>
          </div>
        </div>

        <div className="card-subtle p-6 bg-white flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
              Coverage Adequacy
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              {result.total_estimated_needs > 0
                ? `${Math.min(100, Math.round((result.total_existing_protection / result.total_estimated_needs) * 100))}%`
                : "100%"}
            </div>
            <p className="text-xs text-slate-500 mt-2">
              {result.coverage_gap > 0
                ? `You have a ₹${formatINR(result.coverage_gap)} protection deficit.`
                : "Your existing protection meets or exceeds estimated needs."}
            </p>
          </div>
        </div>
      </div>

      {/* Visual Charts & Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Needs Composition (Pie Chart) */}
        <div className="lg:col-span-6 card-subtle p-6 bg-white">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Total Needs Composition</h3>
              <p className="text-xs text-slate-500">Distribution of family support, debts, and milestones</p>
            </div>
            <PieIcon className="w-5 h-5 text-teal-600" />
          </div>

          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any) => [formatINR(Number(value)), "Amount"]}
                  contentStyle={{ borderRadius: "8px", border: "1px solid #E2E8F0" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-100 text-xs">
            {pieData.map((item, idx) => (
              <div key={idx} className="flex flex-col">
                <div className="flex items-center gap-1.5 font-medium text-slate-700">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                  {item.name}
                </div>
                <span className="font-bold text-slate-950 mt-0.5">{formatINR(item.value)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Protection Comparison (Bar Chart) */}
        <div className="lg:col-span-6 card-subtle p-6 bg-white">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Needs vs. Existing Protection</h3>
              <p className="text-xs text-slate-500">Visualizing the net gap to be covered</p>
            </div>
            <Layers className="w-5 h-5 text-teal-600" />
          </div>

          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonBarData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#64748B" }} />
                <YAxis tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} tick={{ fontSize: 12, fill: "#64748B" }} />
                <Tooltip
                  formatter={(value: any) => [formatINR(Number(value)), ""]}
                  contentStyle={{ borderRadius: "8px", border: "1px solid #E2E8F0" }}
                />
                <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
                <Bar dataKey="Total Estimated Needs" fill="#0B192C" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Available Protection" fill="#0D9488" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Coverage Gap (Cover Needed)" fill="#E11D48" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <p className="text-xs text-slate-500 mt-4 pt-4 border-t border-slate-100 leading-relaxed">
            Formula: Additional Cover = max(0, Total Needs - Available Protection) = max(0, {formatINR(result.total_estimated_needs)} - {formatINR(result.total_existing_protection)}) = <strong className="text-slate-900">{formatINR(result.estimated_additional_cover)}</strong>.
          </p>
        </div>
      </div>

      {/* Human Life Value (HLV) Separate Comparison Benchmark */}
      <div className="card-subtle p-6 sm:p-8 bg-slate-50/70 border border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="badge-teal">Independent Economic Benchmark</span>
              <span className="text-xs text-slate-500">Not Added to Net Needs</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mt-1">
              Human Life Value (HLV) Estimate: {formatINR(result.hlv_estimate)}
            </h3>
          </div>
          <div className="text-xs text-slate-500 max-w-sm">
            Based on {result.hlv_working_years_remaining} remaining working years to age 60, assuming 30% personal consumption and 5% annual income growth.
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div className="space-y-2 text-slate-600">
            <h4 className="font-bold text-slate-900">Why compare Net Needs with HLV?</h4>
            <p className="text-xs leading-relaxed">
              <strong>Net Needs ({formatINR(result.estimated_additional_cover)})</strong> determines what your family specifically needs to maintain their standard of living and extinguish loans.
            </p>
            <p className="text-xs leading-relaxed">
              <strong>Human Life Value ({formatINR(result.hlv_estimate)})</strong> calculates your total capitalized economic earning power. Both perspectives confirm that your family's financial security requires substantial coverage.
            </p>
          </div>

          <div className="space-y-3 bg-white p-4 rounded-xl border border-slate-200 text-xs">
            <span className="font-bold text-slate-900 block">Calculation Assumptions & Governance:</span>
            <ul className="space-y-1.5 text-slate-600">
              {result.notes.map((note, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-teal-600 font-bold">•</span>
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Action Next Steps */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white">
        <div>
          <h3 className="text-lg font-bold">Ready to see matching insurance product categories?</h3>
          <p className="text-xs text-slate-300 mt-0.5">Explore unbiased pros, cons, and questions to ask insurers.</p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Link
            href="/simulator"
            className="btn-secondary text-xs sm:text-sm py-2.5 px-4 w-full sm:w-auto text-center"
          >
            <Sliders className="w-4 h-4 mr-1 text-slate-600" />
            Interactive Simulator
          </Link>
          <Link
            href="/recommendations"
            className="btn-teal text-xs sm:text-sm py-2.5 px-5 w-full sm:w-auto text-center font-bold"
          >
            Product Recommendations
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}
