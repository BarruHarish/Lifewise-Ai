export interface AssessmentFormData {
  // Step 1: Personal Information
  age: number;
  annual_income: number;
  monthly_expenses: number;
  employment_category: string;

  // Step 2: Family Responsibilities
  dependents_count: number;
  annual_family_support: number;
  support_years: number;

  // Step 3: Financial Obligations
  outstanding_home_loan: number;
  other_liabilities: number;
  future_education_goals: number;
  other_future_goals: number;

  // Step 4: Existing Protection & Budget
  existing_life_cover: number;
  available_assets: number;
  monthly_budget: number;
  preferred_duration_years: number;

  // Optional
  risk_tolerance?: string;
  preference_type?: string;
}

export interface FinancialNeedsResult {
  pv_family_support: number;
  total_liabilities: number;
  total_future_goals: number;
  total_estimated_needs: number;
  total_existing_protection: number;
  estimated_additional_cover: number;
  coverage_gap: number;
  hlv_estimate: number;
  hlv_working_years_remaining: number;
  inflation_rate: number;
  discount_rate: number;
  real_rate_of_return: number;
  hlv_income_growth_rate: number;
  hlv_personal_consumption_pct: number;
  is_complete: boolean;
  notes: string[];
}

export interface ProductRecommendation {
  category_id: string;
  category_name: string;
  badge: string;
  suitability_score: number;
  why_it_suits: string;
  key_benefits: string[];
  limitations: string[];
  risk_considerations: string;
  estimated_annual_premium_range: string;
  estimated_monthly_premium_range: string;
  eligibility_notes: string;
  suggested_questions_for_insurer: string[];
  is_primary_recommendation: boolean;
}

export interface AdvisorProfile {
  id: number;
  name: string;
  title: string;
  experience_years: number;
  certifications: string;
  specialization: string;
  rating: number;
  reviews_count: number;
  languages: string;
  bio: string;
  avatar_url?: string;
}

export interface AppointmentRecord {
  id: number;
  advisor_id: number;
  advisor_name?: string;
  customer_name: string;
  customer_email: string;
  consultation_type: string;
  appointment_date: string;
  time_slot: string;
  status: string;
  created_at: string;
  meeting_link?: string;
}

export interface ScenarioSimulationResult {
  desired_cover: number;
  policy_duration_years: number;
  monthly_budget: number;
  estimated_monthly_premium: number;
  estimated_annual_premium: number;
  is_affordable: boolean;
  budget_variance: number;
  adequacy_percentage: number;
  category_comparisons: {
    category: string;
    est_monthly: number;
    est_annual: number;
    focus: string;
    is_within_budget: boolean;
  }[];
}
