import { AssessmentFormData, FinancialNeedsResult, ProductRecommendation } from "../types";

/**
 * Format Indian Rupee currency format (e.g. ₹25,00,000)
 */
export function formatINR(val: number): string {
  if (isNaN(val)) return "₹0";
  const rounded = Math.round(val);
  const isNegative = rounded < 0;
  const absStr = Math.abs(rounded).toString();

  if (absStr.length <= 3) {
    return `${isNegative ? "-" : ""}₹${absStr}`;
  }

  const lastThree = absStr.substring(absStr.length - 3);
  const otherNumbers = absStr.substring(0, absStr.length - 3);
  const formattedOthers = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",");

  return `${isNegative ? "-" : ""}₹${formattedOthers},${lastThree}`;
}

/**
 * Client-side calculation engine for instant responsive updates and offline fallback.
 * Identical mathematical algorithms to Python backend.
 */
export function calculatePvAnnuity(
  annualAmount: number,
  years: number,
  inflationRate: number = 0.06,
  discountRate: number = 0.075
): number {
  if (annualAmount <= 0 || years <= 0) return 0;
  const k = (discountRate - inflationRate) / (1 + inflationRate);
  if (Math.abs(k) < 1e-6) {
    return annualAmount * years;
  }
  const pv = annualAmount * (1 - Math.pow(1 + k, -years)) / k;
  return Math.max(0, Math.round(pv));
}

export function calculateHlv(
  age: number,
  annualIncome: number,
  retirementAge: number = 60,
  personalConsumptionPct: number = 0.30,
  incomeGrowthRate: number = 0.05,
  discountRate: number = 0.075
): { hlv: number; workingYears: number } {
  const workingYears = Math.max(0, retirementAge - age);
  if (workingYears <= 0 || annualIncome <= 0) {
    return { hlv: 0, workingYears: 0 };
  }
  const netFamilyIncome = annualIncome * (1 - personalConsumptionPct);
  const kHlv = (discountRate - incomeGrowthRate) / (1 + incomeGrowthRate);

  let hlv = 0;
  if (Math.abs(kHlv) < 1e-6) {
    hlv = netFamilyIncome * workingYears;
  } else {
    hlv = netFamilyIncome * (1 - Math.pow(1 + kHlv, -workingYears)) / kHlv;
  }
  return { hlv: Math.max(0, Math.round(hlv)), workingYears };
}

export function computeFinancialNeedsLocal(
  data: AssessmentFormData,
  inflationRate: number = 0.06,
  discountRate: number = 0.075
): FinancialNeedsResult {
  let annualSupport = data.annual_family_support;
  if (annualSupport === 0 && data.monthly_expenses > 0) {
    annualSupport = data.monthly_expenses * 12 * 0.8;
  }

  const pvFamilySupport = calculatePvAnnuity(
    annualSupport,
    data.support_years,
    inflationRate,
    discountRate
  );

  const totalLiabilities = (data.outstanding_home_loan || 0) + (data.other_liabilities || 0);
  const totalFutureGoals = (data.future_education_goals || 0) + (data.other_future_goals || 0);
  const totalEstimatedNeeds = Math.round(pvFamilySupport + totalLiabilities + totalFutureGoals);
  const totalExistingProtection = Math.round((data.existing_life_cover || 0) + (data.available_assets || 0));
  const coverageGap = Math.round(totalEstimatedNeeds - totalExistingProtection);
  const estimatedAdditionalCover = Math.max(0, coverageGap);

  const { hlv, workingYears } = calculateHlv(data.age, data.annual_income);

  return {
    pv_family_support: pvFamilySupport,
    total_liabilities: totalLiabilities,
    total_future_goals: totalFutureGoals,
    total_estimated_needs: totalEstimatedNeeds,
    total_existing_protection: totalExistingProtection,
    estimated_additional_cover: estimatedAdditionalCover,
    coverage_gap: coverageGap,
    hlv_estimate: hlv,
    hlv_working_years_remaining: workingYears,
    inflation_rate: inflationRate,
    discount_rate: discountRate,
    real_rate_of_return: Math.round(((discountRate - inflationRate) / (1 + inflationRate)) * 10000) / 10000,
    hlv_income_growth_rate: 0.05,
    hlv_personal_consumption_pct: 0.30,
    is_complete: true,
    notes: [
      `Assumed inflation rate of ${(inflationRate * 100).toFixed(1)}% p.a. for living support costs.`,
      `Assumed conservative investment discount rate of ${(discountRate * 100).toFixed(1)}% p.a. on the protection corpus.`,
      "Human Life Value (HLV) is calculated as a separate economic benchmark and is NOT added to Net Needs.",
      "Eligible assets reflect liquid reserves earmarked for family protection, excluding locked retirement PF/NPS."
    ]
  };
}

export function estimateIllustrativeRates(
  coverAmount: number,
  age: number,
  tenureYears: number,
  category: "term" | "whole_life" | "endowment" | "ulip"
) {
  if (coverAmount <= 0) {
    return { annualMin: 0, annualMax: 0, monthlyMin: 0, monthlyMax: 0 };
  }
  const baseAgeFactor = 1.0 + Math.max(0, age - 25) * 0.04;
  const tenureFactor = 1.0 + (tenureYears - 20) * 0.015;

  const multipliers = {
    term: { rate: 12.0, spread: 0.25 },
    whole_life: { rate: 38.0, spread: 0.20 },
    endowment: { rate: 75.0, spread: 0.15 },
    ulip: { rate: 55.0, spread: 0.30 }
  };

  const cat = multipliers[category];
  const lakhs = coverAmount / 100000;
  const baseAnnual = lakhs * cat.rate * baseAgeFactor * tenureFactor;

  const minAnnual = Math.round(baseAnnual * (1 - cat.spread));
  const maxAnnual = Math.round(baseAnnual * (1 + cat.spread));

  return {
    annualMin: Math.max(1200, minAnnual),
    annualMax: Math.max(1800, maxAnnual),
    monthlyMin: Math.max(100, Math.round(minAnnual / 12)),
    monthlyMax: Math.max(150, Math.round(maxAnnual / 12))
  };
}
