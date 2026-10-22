"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  SlidersHorizontal, 
  RotateCcw, 
  ArrowRight, 
  CheckCircle, 
  AlertCircle, 
  DollarSign, 
  Calendar,
  Layers,
  Sparkles
} from "lucide-react";
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from "recharts";
import { formatINR, estimateIllustrativeRates } from "@/utils/calculations";

export default function SimulatorPage() {
  const [initialCover, setInitialCover] = useState(10000000); // 1 Cr baseline
  const [initialTenure, setInitialTenure] = useState(30);
  const [initialBudget, setInitialBudget] = useState(2500);

  // Adjusted interactive state
  const [desiredCover, setDesiredCover] = useState(10000000);
  const [policyDuration, setPolicyDuration] = useState(30);
  const [monthlyBudget, setMonthlyBudget] = useState(2500);
  const [age, setAge] = useState(32);

  // Load from assessment if available
  useEffect(() => {
    const raw = localStorage.getItem("lifewise_assessment_data");
    if (raw) {
      try {
        const data = JSON.parse(raw);
        const cover = data.annual_income * 10 || 10000000;
        setInitialCover(cover);
        setDesiredCover(cover);
        setInitialTenure(data.preferred_duration_years || 30);
        setPolicyDuration(data.preferred_duration_years || 30);
        setInitialBudget(data.monthly_budget || 2500);
        setMonthlyBudget(data.monthly_budget || 2500);
        setAge(data.age || 32);
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Calculate live premiums for term
  const termRates = estimateIllustrativeRates(desiredCover, age, policyDuration, "term");
  const wholeRates = estimateIllustrativeRates(desiredCover, age, 50, "whole_life");
  const endowRates = estimateIllustrativeRates(desiredCover, age, 15, "endowment");
  const ulipRates = estimateIllustrativeRates(desiredCover, age, 15, "ulip");

  const estMonthlyTerm = termRates.monthlyMin;
  const isAffordable = monthlyBudget >= estMonthlyTerm;
  const budgetVariance = monthlyBudget - estMonthlyTerm;

  const handleReset = () => {
    setDesiredCover(initialCover);
    setPolicyDuration(initialTenure);
    setMonthlyBudget(initialBudget);
  };

  const chartData = [
    {
      category: "Term Life",
      "Monthly Premium": termRates.monthlyMin,
      "Your Monthly Budget": monthlyBudget,
    },
    {
      category: "Whole Life",
      "Monthly Premium": wholeRates.monthlyMin,
      "Your Monthly Budget": monthlyBudget,
    },
    {
      category: "Endowment",
      "Monthly Premium": endowRates.monthlyMin,
      "Your Monthly Budget": monthlyBudget,
    },
    {
      category: "ULIP",
      "Monthly Premium": ulipRates.monthlyMin,
      "Your Monthly Budget": monthlyBudget,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200">
        <div>
          <span className="badge-teal mb-2">Scenario & Affordability Modeler</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950">
            Interactive Coverage Simulator
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Dynamically adjust your target life cover, tenure, and monthly budget to view live affordability and category cost comparisons.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="btn-secondary text-sm py-2 px-4 shadow-sm"
          >
            <RotateCcw className="w-4 h-4 mr-1.5 text-slate-500" />
            Reset to Baseline
          </button>

          <Link
            href="/advisory"
            className="btn-teal text-sm py-2 px-5 shadow-sm font-semibold"
          >
            Continue to Advisory
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Link>
        </div>
      </div>

      {/* Simulator Control Sliders & Live Outputs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Interactive Sliders */}
        <div className="lg:col-span-5 card-subtle p-6 sm:p-8 bg-white space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-teal-600" />
              Adjust Scenario
            </h3>
            <span className="text-xs text-slate-400 font-medium">Age: {age} yrs</span>
          </div>

          {/* Slider 1: Desired Cover */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <label className="font-semibold text-slate-700">Desired Life Cover</label>
              <span className="text-base font-extrabold text-teal-700">{formatINR(desiredCover)}</span>
            </div>
            <input
              type="range"
              min="2500000"
              max="50000000"
              step="500000"
              value={desiredCover}
              onChange={(e) => setDesiredCover(Number(e.target.value))}
              className="w-full accent-teal-600 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>₹25 Lakhs</span>
              <span>₹2.5 Crore</span>
              <span>₹5 Crore</span>
            </div>
          </div>

          {/* Slider 2: Policy Duration */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <label className="font-semibold text-slate-700">Policy Duration</label>
              <span className="text-base font-extrabold text-slate-900">{policyDuration} Years</span>
            </div>
            <input
              type="range"
              min="10"
              max="45"
              step="5"
              value={policyDuration}
              onChange={(e) => setPolicyDuration(Number(e.target.value))}
              className="w-full accent-teal-600 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>10 Years</span>
              <span>30 Years (Age ~62)</span>
              <span>45 Years</span>
            </div>
          </div>

          {/* Slider 3: Monthly Budget */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <label className="font-semibold text-slate-700">Monthly Budget</label>
              <span className="text-base font-extrabold text-slate-900">{formatINR(monthlyBudget)}/mo</span>
            </div>
            <input
              type="range"
              min="500"
              max="15000"
              step="250"
              value={monthlyBudget}
              onChange={(e) => setMonthlyBudget(Number(e.target.value))}
              className="w-full accent-teal-600 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>₹500</span>
              <span>₹5,000</span>
              <span>₹15,000/mo</span>
            </div>
          </div>

          {/* Scenario Comparison Summary */}
          <div className="pt-4 border-t border-slate-100 text-xs space-y-2 text-slate-600">
            <div className="flex justify-between">
              <span>Baseline Cover:</span>
              <strong className="text-slate-900">{formatINR(initialCover)}</strong>
            </div>
            <div className="flex justify-between">
              <span>Adjusted Scenario:</span>
              <strong className="text-teal-700">{formatINR(desiredCover)} ({((desiredCover / initialCover) * 100).toFixed(0)}%)</strong>
            </div>
          </div>
        </div>

        {/* Right: Live Affordability & Category Comparison */}
        <div className="lg:col-span-7 space-y-6">
          {/* Affordability Status Card */}
          <div className={`card-subtle p-6 bg-white border ${isAffordable ? "border-emerald-200" : "border-rose-200"}`}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                  isAffordable ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-rose-50 text-rose-800 border border-rose-200"
                }`}>
                  {isAffordable ? <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> : <AlertCircle className="w-3.5 h-3.5 text-rose-600" />}
                  {isAffordable ? "Scenario is Affordable" : "Budget Stretched"}
                </span>
                <h3 className="text-2xl font-black text-slate-950 mt-3">
                  Est. Term Premium: {formatINR(estMonthlyTerm)}/month
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  ({formatINR(termRates.annualMin)} - {formatINR(termRates.annualMax)}/year illustrative)
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Monthly Variance</span>
                <span className={`text-xl font-extrabold ${budgetVariance >= 0 ? "text-emerald-700" : "text-rose-600"}`}>
                  {budgetVariance >= 0 ? `+${formatINR(budgetVariance)} surplus` : `${formatINR(budgetVariance)} deficit`}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 mt-4 pt-3 border-t border-slate-100 leading-relaxed">
              {isAffordable
                ? `Your allocated monthly budget of ${formatINR(monthlyBudget)} comfortably covers this ${formatINR(desiredCover)} term policy tenure.`
                : `Your allocated budget of ${formatINR(monthlyBudget)} is ${formatINR(Math.abs(budgetVariance))} less than the estimated monthly term premium.`}
            </p>
          </div>

          {/* Monthly Cost by Product Category Bar Chart */}
          <div className="card-subtle p-6 bg-white">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
              <div>
                <h4 className="text-base font-bold text-slate-900">Monthly Premium Comparison Across Categories</h4>
                <p className="text-xs text-slate-500">For {formatINR(desiredCover)} coverage at age {age}</p>
              </div>
              <Layers className="w-5 h-5 text-teal-600" />
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 15, right: 20, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="category" tick={{ fontSize: 12, fill: "#64748B" }} />
                  <YAxis tickFormatter={(v) => `₹${v}`} tick={{ fontSize: 12, fill: "#64748B" }} />
                  <Tooltip
                    formatter={(val: any) => [formatINR(Number(val)), ""]}
                    contentStyle={{ borderRadius: "8px", border: "1px solid #E2E8F0" }}
                  />
                  <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
                  <Bar dataKey="Monthly Premium" fill="#0D9488" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Your Monthly Budget" fill="#0B192C" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500 italic">
              <strong>Notice:</strong> Investment-linked products (Endowment and ULIP) require 5x-8x higher monthly premiums to deliver the same ₹{formatINR(desiredCover)} life coverage because a large portion of funds are channeled into savings or market equities.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
