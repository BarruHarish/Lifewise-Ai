"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  User, 
  Users, 
  CreditCard, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft, 
  HelpCircle, 
  CheckCircle2, 
  AlertCircle,
  Sparkles
} from "lucide-react";
import { AssessmentFormData } from "@/types";
import { formatINR } from "@/utils/calculations";

export default function AssessmentWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const [formData, setFormData] = useState<AssessmentFormData>({
    // Step 1
    age: 32,
    annual_income: 1400000,
    monthly_expenses: 55000,
    employment_category: "salaried",

    // Step 2
    dependents_count: 2,
    annual_family_support: 660000,
    support_years: 22,

    // Step 3
    outstanding_home_loan: 3500000,
    other_liabilities: 250000,
    future_education_goals: 2000000,
    other_future_goals: 500000,

    // Step 4
    existing_life_cover: 1000000,
    available_assets: 400000,
    monthly_budget: 2500,
    preferred_duration_years: 30,

    risk_tolerance: "moderate",
    preference_type: "pure_protection"
  });

  // Load preserved state from localStorage if available
  useEffect(() => {
    const saved = localStorage.getItem("lifewise_assessment_data");
    if (saved) {
      try {
        setFormData(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved assessment data", e);
      }
    }
  }, []);

  const handleChange = (field: keyof AssessmentFormData, value: any) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      localStorage.setItem("lifewise_assessment_data", JSON.stringify(updated));
      return updated;
    });
  };

  const loadSampleProfile = () => {
    const sample: AssessmentFormData = {
      age: 30,
      annual_income: 1500000,
      monthly_expenses: 60000,
      employment_category: "salaried",
      dependents_count: 2,
      annual_family_support: 720000,
      support_years: 20,
      outstanding_home_loan: 4000000,
      other_liabilities: 200000,
      future_education_goals: 2500000,
      other_future_goals: 1000000,
      existing_life_cover: 1500000,
      available_assets: 600000,
      monthly_budget: 3000,
      preferred_duration_years: 30,
      risk_tolerance: "moderate",
      preference_type: "pure_protection"
    };
    setFormData(sample);
    localStorage.setItem("lifewise_assessment_data", JSON.stringify(sample));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // Complete & navigate to results
      localStorage.setItem("lifewise_assessment_data", JSON.stringify(formData));
      router.push("/results");
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header & Step Tracker */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <span className="badge-teal mb-2">Step {currentStep} of {totalSteps}</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950">
              Financial Assessment Wizard
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Provide your details to calculate a transparent, mathematically sound life cover.
            </p>
          </div>

          <button
            type="button"
            onClick={loadSampleProfile}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-teal-200 bg-teal-50/60 text-teal-800 text-xs font-semibold hover:bg-teal-100/70 transition self-start sm:self-auto"
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            Fill Editable Sample Profile
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
          <div
            className="bg-teal-600 h-full transition-all duration-300 ease-out"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>

        <div className="grid grid-cols-4 gap-2 mt-3 text-xs text-slate-500 font-medium text-center">
          <span className={currentStep >= 1 ? "text-teal-700 font-bold" : ""}>1. Personal Info</span>
          <span className={currentStep >= 2 ? "text-teal-700 font-bold" : ""}>2. Dependents</span>
          <span className={currentStep >= 3 ? "text-teal-700 font-bold" : ""}>3. Liabilities & Goals</span>
          <span className={currentStep >= 4 ? "text-teal-700 font-bold" : ""}>4. Protection & Budget</span>
        </div>
      </div>

      {/* Main Wizard Form Card */}
      <div className="card-subtle p-6 sm:p-10 bg-white border border-slate-200 shadow-lg">
        {/* STEP 1: PERSONAL INFORMATION */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Personal & Income Profile</h2>
                <p className="text-xs text-slate-500">Helps determine your income generation capacity and timeline.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Current Age (Years)
                </label>
                <input
                  type="number"
                  min="18"
                  max="70"
                  id="input-age"
                  value={formData.age}
                  onChange={(e) => handleChange("age", Math.max(18, Number(e.target.value)))}
                  className="input-fintech"
                />
                <p className="text-[11px] text-slate-400 mt-1">Age directly influences mortality risk charges and policy eligibility.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Employment Category
                </label>
                <select
                  id="input-employment"
                  value={formData.employment_category}
                  onChange={(e) => handleChange("employment_category", e.target.value)}
                  className="input-fintech"
                >
                  <option value="salaried">Salaried Professional</option>
                  <option value="self_employed">Self Employed / Consultant</option>
                  <option value="business">Business Owner</option>
                  <option value="other">Other / Freelance</option>
                </select>
                <p className="text-[11px] text-slate-400 mt-1">Used to evaluate income stability parameters.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Annual Gross Income (INR)
                </label>
                <input
                  type="number"
                  min="0"
                  step="50000"
                  id="input-annual-income"
                  value={formData.annual_income}
                  onChange={(e) => handleChange("annual_income", Math.max(0, Number(e.target.value)))}
                  className="input-fintech"
                />
                <p className="text-xs text-teal-700 font-semibold mt-1">
                  Preview: {formatINR(formData.annual_income)}
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Monthly Household Expenses (INR)
                </label>
                <input
                  type="number"
                  min="0"
                  step="5000"
                  id="input-monthly-expenses"
                  value={formData.monthly_expenses}
                  onChange={(e) => {
                    const val = Math.max(0, Number(e.target.value));
                    handleChange("monthly_expenses", val);
                    // auto sync suggested annual support
                    handleChange("annual_family_support", Math.round(val * 12 * 0.8));
                  }}
                  className="input-fintech"
                />
                <p className="text-xs text-teal-700 font-semibold mt-1">
                  Preview: {formatINR(formData.monthly_expenses)}/mo
                </p>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: FAMILY RESPONSIBILITIES */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Family Responsibilities</h2>
                <p className="text-xs text-slate-500">Estimates the financial living corpus needed to support your dependents.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Number of Dependents
                </label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  id="input-dependents-count"
                  value={formData.dependents_count}
                  onChange={(e) => handleChange("dependents_count", Math.max(0, Number(e.target.value)))}
                  className="input-fintech"
                />
                <p className="text-[11px] text-slate-400 mt-1">Spouse, children, and elderly parents relying on your income.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Years of Support Required
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  id="input-support-years"
                  value={formData.support_years}
                  onChange={(e) => handleChange("support_years", Math.max(1, Number(e.target.value)))}
                  className="input-fintech"
                />
                <p className="text-[11px] text-slate-400 mt-1">Years until youngest child graduates or spouse attains retirement corpus.</p>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Estimated Annual Family Support Requirement (INR)
                </label>
                <input
                  type="number"
                  min="0"
                  step="50000"
                  id="input-annual-family-support"
                  value={formData.annual_family_support}
                  onChange={(e) => handleChange("annual_family_support", Math.max(0, Number(e.target.value)))}
                  className="input-fintech"
                />
                <div className="flex justify-between items-center mt-1.5 text-xs">
                  <span className="text-teal-700 font-semibold">{formatINR(formData.annual_family_support)}/year</span>
                  <span className="text-slate-500 italic">Usually ~70-80% of total household expenses.</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: FINANCIAL OBLIGATIONS & GOALS */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Liabilities & Future Milestones</h2>
                <p className="text-xs text-slate-500">Ensure debts are not transferred to dependents upon premature demise.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Outstanding Home Loan (INR)
                </label>
                <input
                  type="number"
                  min="0"
                  step="100000"
                  id="input-home-loan"
                  value={formData.outstanding_home_loan}
                  onChange={(e) => handleChange("outstanding_home_loan", Math.max(0, Number(e.target.value)))}
                  className="input-fintech"
                />
                <p className="text-xs text-teal-700 font-semibold mt-1">
                  Preview: {formatINR(formData.outstanding_home_loan)}
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Other Liabilities (Car/Personal/Credit)
                </label>
                <input
                  type="number"
                  min="0"
                  step="50000"
                  id="input-other-liabilities"
                  value={formData.other_liabilities}
                  onChange={(e) => handleChange("other_liabilities", Math.max(0, Number(e.target.value)))}
                  className="input-fintech"
                />
                <p className="text-xs text-teal-700 font-semibold mt-1">
                  Preview: {formatINR(formData.other_liabilities)}
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Children Higher Education Fund Goal (INR)
                </label>
                <input
                  type="number"
                  min="0"
                  step="100000"
                  id="input-education-goals"
                  value={formData.future_education_goals}
                  onChange={(e) => handleChange("future_education_goals", Math.max(0, Number(e.target.value)))}
                  className="input-fintech"
                />
                <p className="text-xs text-teal-700 font-semibold mt-1">
                  Preview: {formatINR(formData.future_education_goals)}
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Other Long-Term Milestones (INR)
                </label>
                <input
                  type="number"
                  min="0"
                  step="100000"
                  id="input-other-goals"
                  value={formData.other_future_goals}
                  onChange={(e) => handleChange("other_future_goals", Math.max(0, Number(e.target.value)))}
                  className="input-fintech"
                />
                <p className="text-xs text-teal-700 font-semibold mt-1">
                  Preview: {formatINR(formData.other_future_goals)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: EXISTING PROTECTION & BUDGET */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Existing Cover, Assets & Budget</h2>
                <p className="text-xs text-slate-500">Your available safety net reduces the incremental coverage needed.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Existing Life Insurance Coverage (INR)
                </label>
                <input
                  type="number"
                  min="0"
                  step="100000"
                  id="input-existing-cover"
                  value={formData.existing_life_cover}
                  onChange={(e) => handleChange("existing_life_cover", Math.max(0, Number(e.target.value)))}
                  className="input-fintech"
                />
                <p className="text-xs text-teal-700 font-semibold mt-1">
                  Preview: {formatINR(formData.existing_life_cover)}
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Available Protection Assets (FDs/Liquid Mutual Funds)
                </label>
                <input
                  type="number"
                  min="0"
                  step="50000"
                  id="input-available-assets"
                  value={formData.available_assets}
                  onChange={(e) => handleChange("available_assets", Math.max(0, Number(e.target.value)))}
                  className="input-fintech"
                />
                <p className="text-[11px] text-slate-400 mt-1">Exclude locked retirement funds (PPF, EPF, NPS).</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Monthly Insurance Budget (INR)
                </label>
                <input
                  type="number"
                  min="100"
                  step="500"
                  id="input-monthly-budget"
                  value={formData.monthly_budget}
                  onChange={(e) => handleChange("monthly_budget", Math.max(100, Number(e.target.value)))}
                  className="input-fintech"
                />
                <p className="text-xs text-teal-700 font-semibold mt-1">
                  Preview: {formatINR(formData.monthly_budget)}/mo
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Preferred Policy Duration (Years)
                </label>
                <select
                  id="input-preferred-duration"
                  value={formData.preferred_duration_years}
                  onChange={(e) => handleChange("preferred_duration_years", Number(e.target.value))}
                  className="input-fintech"
                >
                  <option value={15}>15 Years</option>
                  <option value={20}>20 Years</option>
                  <option value={25}>25 Years</option>
                  <option value={30}>30 Years (Recommended up to age 60-65)</option>
                  <option value={35}>35 Years</option>
                  <option value={40}>40 Years</option>
                </select>
                <p className="text-[11px] text-slate-400 mt-1">Typically covers you until planned retirement age.</p>
              </div>
            </div>

            {/* Quick Review Box */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 mt-4 text-xs space-y-2">
              <span className="font-bold text-slate-900 block">Assessment Review Summary:</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-slate-600">
                <div>Age: <strong className="text-slate-900">{formData.age} yrs</strong></div>
                <div>Income: <strong className="text-slate-900">{formatINR(formData.annual_income)}/yr</strong></div>
                <div>Support: <strong className="text-slate-900">{formData.support_years} yrs</strong></div>
                <div>Total Debts: <strong className="text-slate-900">{formatINR(formData.outstanding_home_loan + formData.other_liabilities)}</strong></div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center pt-8 mt-8 border-t border-slate-100">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              id="wizard-btn-back"
              className="btn-secondary text-sm py-2.5 px-5"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </button>
          ) : (
            <div></div>
          )}

          <button
            type="button"
            onClick={handleNext}
            id="wizard-btn-continue"
            className="btn-teal text-sm py-2.5 px-6 shadow-sm font-semibold"
          >
            {currentStep === totalSteps ? "Calculate My Net Needs Cover" : "Continue"}
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
}
