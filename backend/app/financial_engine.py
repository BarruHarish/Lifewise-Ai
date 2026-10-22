"""
LifeWise AI - Core Financial Calculation Engine
================================================
Implements:
1. Net Needs Approach (PV of living expenses, liabilities, goals - existing assets)
2. Human Life Value (HLV) Approach (Present value of future economic earnings for dependents)
3. Deterministic rule-based product category recommendation engine
4. Scenario sensitivity analysis & budget simulation
"""

from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field
import math

class FinancialAssessmentInput(BaseModel):
    # Step 1: Personal Information
    age: int = Field(..., ge=18, le=75, description="Age in years")
    annual_income: float = Field(..., ge=0, description="Annual gross income in INR")
    monthly_expenses: float = Field(..., ge=0, description="Monthly household expenses in INR")
    employment_category: str = Field("salaried", description="salaried, self_employed, business, or other")
    
    # Step 2: Family Responsibilities
    dependents_count: int = Field(..., ge=0, description="Number of financial dependents")
    annual_family_support: float = Field(..., ge=0, description="Estimated annual family support requirement in INR")
    support_years: int = Field(..., ge=0, le=50, description="Years of financial support needed")
    
    # Step 3: Financial Obligations
    outstanding_home_loan: float = Field(0.0, ge=0, description="Outstanding home loan balance in INR")
    other_liabilities: float = Field(0.0, ge=0, description="Other loans/credit card/vehicle debt in INR")
    future_education_goals: float = Field(0.0, ge=0, description="Children education fund target in INR")
    other_future_goals: float = Field(0.0, ge=0, description="Other long-term life goals in INR")
    
    # Step 4: Existing Protection & Budget
    existing_life_cover: float = Field(0.0, ge=0, description="Existing life insurance cover in INR")
    available_assets: float = Field(0.0, ge=0, description="Eligible liquid assets dedicated for family protection")
    monthly_budget: float = Field(..., ge=0, description="Monthly budget for insurance premiums in INR")
    preferred_duration_years: int = Field(30, ge=5, le=50, description="Preferred policy tenure in years")
    
    # Optional Preferences
    risk_tolerance: Optional[str] = Field("moderate", description="conservative, moderate, aggressive")
    preference_type: Optional[str] = Field("pure_protection", description="pure_protection, savings_protection, market_linked")


class FinancialNeedsResult(BaseModel):
    # Net Needs Components
    pv_family_support: float
    total_liabilities: float
    total_future_goals: float
    total_estimated_needs: float
    total_existing_protection: float
    estimated_additional_cover: float
    coverage_gap: float
    
    # HLV Components (Separate benchmark)
    hlv_estimate: float
    hlv_working_years_remaining: int
    
    # Assumptions Used
    inflation_rate: float
    discount_rate: float
    real_rate_of_return: float
    hlv_income_growth_rate: float
    hlv_personal_consumption_pct: float
    is_complete: bool
    notes: List[str]


class ProductRecommendation(BaseModel):
    category_id: str
    category_name: str
    badge: str
    suitability_score: int  # 0 to 100
    why_it_suits: str
    key_benefits: List[str]
    limitations: List[str]
    risk_considerations: str
    estimated_annual_premium_range: str
    estimated_monthly_premium_range: str
    eligibility_notes: str
    suggested_questions_for_insurer: List[str]
    is_primary_recommendation: bool


def calculate_pv_annuity(annual_amount: float, years: int, inflation_rate: float = 0.06, discount_rate: float = 0.075) -> float:
    """
    Calculate Present Value of inflation-adjusted recurring annual support.
    Formula: PV = E * [1 - (1 + k)^(-T)] / k
    where k = (discount_rate - inflation_rate) / (1 + inflation_rate)
    """
    if annual_amount <= 0 or years <= 0:
        return 0.0
    
    k = (discount_rate - inflation_rate) / (1.0 + inflation_rate)
    
    if abs(k) < 1e-6:
        return annual_amount * years
    
    pv = annual_amount * (1.0 - math.pow(1.0 + k, -years)) / k
    return max(0.0, round(pv, 2))


def calculate_hlv(age: int, annual_income: float, retirement_age: int = 60,
                  personal_consumption_pct: float = 0.30,
                  income_growth_rate: float = 0.05,
                  discount_rate: float = 0.075) -> tuple[float, int]:
    """
    Human Life Value (HLV) Approach:
    Present value of future economic contribution to dependents until retirement.
    """
    working_years = max(0, retirement_age - age)
    if working_years <= 0 or annual_income <= 0:
        return 0.0, 0
    
    net_family_income = annual_income * (1.0 - personal_consumption_pct)
    k_hlv = (discount_rate - income_growth_rate) / (1.0 + income_growth_rate)
    
    if abs(k_hlv) < 1e-6:
        hlv = net_family_income * working_years
    else:
        hlv = net_family_income * (1.0 - math.pow(1.0 + k_hlv, -working_years)) / k_hlv
        
    return max(0.0, round(hlv, 2)), working_years


def calculate_financial_needs(inputs: FinancialAssessmentInput,
                              inflation_rate: float = 0.06,
                              discount_rate: float = 0.075) -> FinancialNeedsResult:
    """
    Executes Net Needs & HLV computations.
    """
    # 1. Family Support Present Value
    # If user left annual_family_support as 0, derive from monthly expenses * 12
    annual_support = inputs.annual_family_support
    if annual_support == 0 and inputs.monthly_expenses > 0:
        annual_support = inputs.monthly_expenses * 12.0 * 0.8  # Assume 80% needed if breadwinner absent
        
    pv_family_support = calculate_pv_annuity(
        annual_amount=annual_support,
        years=inputs.support_years,
        inflation_rate=inflation_rate,
        discount_rate=discount_rate
    )
    
    # 2. Total Liabilities
    total_liabilities = inputs.outstanding_home_loan + inputs.other_liabilities
    
    # 3. Future Goals
    total_future_goals = inputs.future_education_goals + inputs.other_future_goals
    
    # 4. Total Needs
    total_estimated_needs = round(pv_family_support + total_liabilities + total_future_goals, 2)
    
    # 5. Existing Protection
    total_existing_protection = round(inputs.existing_life_cover + inputs.available_assets, 2)
    
    # 6. Additional Cover Required
    coverage_gap = round(total_estimated_needs - total_existing_protection, 2)
    additional_cover = max(0.0, coverage_gap)
    
    # 7. HLV Benchmark
    hlv_val, working_years = calculate_hlv(
        age=inputs.age,
        annual_income=inputs.annual_income,
        retirement_age=60,
        personal_consumption_pct=0.30,
        income_growth_rate=0.05,
        discount_rate=discount_rate
    )
    
    notes = [
        f"Assumed inflation rate of {inflation_rate * 100:.1f}% per annum for recurring expenses.",
        f"Assumed conservative investment discount yield of {discount_rate * 100:.1f}% per annum on protection corpus.",
        "Human Life Value (HLV) is calculated as a separate economic earnings reference and is NOT added to Net Needs.",
        "Assets included should strictly be liquid funds intended for family protection, excluding locked retirement PF/NPS."
    ]
    
    return FinancialNeedsResult(
        pv_family_support=pv_family_support,
        total_liabilities=total_liabilities,
        total_future_goals=total_future_goals,
        total_estimated_needs=total_estimated_needs,
        total_existing_protection=total_existing_protection,
        estimated_additional_cover=additional_cover,
        coverage_gap=coverage_gap,
        hlv_estimate=hlv_val,
        hlv_working_years_remaining=working_years,
        inflation_rate=inflation_rate,
        discount_rate=discount_rate,
        real_rate_of_return=round((discount_rate - inflation_rate) / (1 + inflation_rate), 4),
        hlv_income_growth_rate=0.05,
        hlv_personal_consumption_pct=0.30,
        is_complete=True,
        notes=notes
    )


def estimate_illustrative_premium(cover_amount: float, age: int, tenure_years: int, category: str) -> dict:
    """
    Deterministic illustrative premium calculator based on standard actuarial benchmark tables.
    Explicitly labeled as illustrative simulation, NOT an insurer quotation.
    """
    if cover_amount <= 0:
        return {"annual_min": 0, "annual_max": 0, "monthly_min": 0, "monthly_max": 0}
    
    # Base rate per ₹10,00,000 (10 Lakhs) cover for age 30
    # Adjusted by age factor and product multiplier
    base_age_factor = 1.0 + max(0, age - 25) * 0.04  # ~4% per year of age
    tenure_factor = 1.0 + (tenure_years - 20) * 0.015
    
    multipliers = {
        "term": {"rate_per_lakh": 12.0, "spread": 0.25},       # ~₹1,200 per 10 Lakhs
        "whole_life": {"rate_per_lakh": 38.0, "spread": 0.20}, # Lifetime cover + cash accumulation
        "endowment": {"rate_per_lakh": 75.0, "spread": 0.15},  # Savings + guaranteed bonuses
        "ulip": {"rate_per_lakh": 55.0, "spread": 0.30}        # Market investment + mortality charges
    }
    
    cat_info = multipliers.get(category, multipliers["term"])
    lakhs = cover_amount / 100000.0
    
    base_annual = lakhs * cat_info["rate_per_lakh"] * base_age_factor * tenure_factor
    min_annual = round(base_annual * (1.0 - cat_info["spread"]))
    max_annual = round(base_annual * (1.0 + cat_info["spread"]))
    
    return {
        "annual_min": max(1200, min_annual),
        "annual_max": max(1800, max_annual),
        "monthly_min": max(100, round(min_annual / 12)),
        "monthly_max": max(150, round(max_annual / 12)),
    }


def generate_recommendations(inputs: FinancialAssessmentInput, needs: FinancialNeedsResult) -> List[ProductRecommendation]:
    """
    Deterministic, rule-based recommendation engine for 4 key insurance categories.
    """
    gap = needs.estimated_additional_cover
    monthly_budget = inputs.monthly_budget
    pref = inputs.preference_type or "pure_protection"
    risk = inputs.risk_tolerance or "moderate"
    age = inputs.age
    tenure = inputs.preferred_duration_years
    
    recommendations: List[ProductRecommendation] = []
    
    # 1. Term Life Insurance
    term_rates = estimate_illustrative_premium(gap if gap > 0 else 5000000, age, tenure, "term")
    term_score = 70
    if gap > 2500000:
        term_score += 20
    if pref == "pure_protection":
        term_score += 10
    if monthly_budget < 2500 and gap > 5000000:
        term_score += 10  # Term is uniquely affordable for large protection
    term_score = min(98, term_score)
    
    recommendations.append(ProductRecommendation(
        category_id="term_life",
        category_name="Term Life Insurance",
        badge="Maximum Protection / Value",
        suitability_score=term_score,
        why_it_suits=(
            f"Provides high financial coverage for your estimated ₹{gap:,.0f} gap at the most cost-effective premium. "
            "Essential for securing dependents and shielding debts like home loans."
        ),
        key_benefits=[
            "High sum assured per rupee of premium paid",
            "Option to add Critical Illness and Accidental Disability riders",
            "Fixed level premium guaranteed for entire chosen policy term",
            "Tax deduction under Section 80C and tax-free claim under 10(10D) as per current Indian tax laws"
        ],
        limitations=[
            "Pure protection: No maturity or survival return of cash value unless 'Return of Premium (TROP)' rider is chosen",
            "Coverage ends once the chosen policy duration expires"
        ],
        risk_considerations="No investment market risk. Premium stays level throughout the tenure.",
        estimated_annual_premium_range=f"₹{term_rates['annual_min']:,} - ₹{term_rates['annual_max']:,}/yr (Illustrative)",
        estimated_monthly_premium_range=f"₹{term_rates['monthly_min']:,} - ₹{term_rates['monthly_max']:,}/mo (Illustrative)",
        eligibility_notes=f"Standard medical checkup may be requested by insurers for coverage above ₹50 Lakhs for age {age}.",
        suggested_questions_for_insurer=[
            "What is your insurer's individual death claim settlement ratio (CSR) and claims paid duration?",
            "Are there any medical exclusions or specific waiting periods for critical illness riders?",
            "Does this policy offer premium waiver on critical illness or disability?"
        ],
        is_primary_recommendation=True if gap > 2000000 else False
    ))
    
    # 2. Whole Life Insurance
    whole_rates = estimate_illustrative_premium(min(gap, 5000000) if gap > 0 else 2500000, age, 50, "whole_life")
    whole_score = 50
    if age < 40 and monthly_budget > 4000:
        whole_score += 15
    if inputs.dependents_count > 2 or inputs.other_future_goals > 2000000:
        whole_score += 15
    whole_score = min(85, whole_score)
    
    recommendations.append(ProductRecommendation(
        category_id="whole_life",
        category_name="Whole Life Insurance",
        badge="Lifelong Legacy & Estate Planning",
        suitability_score=whole_score,
        why_it_suits=(
            "Provides coverage up to age 99 or 100, ensuring a guaranteed legacy payout to your heirs or lifelong dependent spouse."
        ),
        key_benefits=[
            "Guaranteed death benefit whenever demise occurs, up to age 100",
            "Builds cash surrender value or periodic survival dividends over decades",
            "Useful for estate equalization and inheritance planning"
        ],
        limitations=[
            "Significantly higher annual premiums compared to pure term insurance",
            "Surrender penalties in the initial 3-5 years if premiums are discontinued"
        ],
        risk_considerations="Low market volatility. Bonuses are declared annually based on insurer's participating fund performance.",
        estimated_annual_premium_range=f"₹{whole_rates['annual_min']:,} - ₹{whole_rates['annual_max']:,}/yr (Illustrative)",
        estimated_monthly_premium_range=f"₹{whole_rates['monthly_min']:,} - ₹{whole_rates['monthly_max']:,}/mo (Illustrative)",
        eligibility_notes="Requires long-term premium paying commitment (typically 10 to 20 years).",
        suggested_questions_for_insurer=[
            "What is the historical participating bonus rate declared over the last 5-10 years?",
            "What is the guaranteed cash surrender value schedule after 5, 10, and 15 years?",
            "Can policy loans be availed against the accumulated cash value in emergencies?"
        ],
        is_primary_recommendation=False
    ))
    
    # 3. Endowment Plans
    endow_rates = estimate_illustrative_premium(min(gap, 3000000) if gap > 0 else 2000000, age, 15, "endowment")
    endow_score = 45
    if risk == "conservative":
        endow_score += 25
    if inputs.future_education_goals > 0 and tenure <= 20:
        endow_score += 15
    endow_score = min(80, endow_score)
    
    recommendations.append(ProductRecommendation(
        category_id="endowment",
        category_name="Endowment & Guaranteed Savings",
        badge="Disciplined Savings + Capital Safety",
        suitability_score=endow_score,
        why_it_suits=(
            "Designed for risk-averse savers wanting a guaranteed lump sum maturity benefit for a fixed milestone like child education."
        ),
        key_benefits=[
            "Combines modest life cover with a disciplined, capital-protected savings corpus",
            "Guaranteed additions and simple/compound reversionary bonuses declared annually",
            "Zero exposure to stock market downturns"
        ],
        limitations=[
            "Returns historically range between 4.5% - 6% p.a., which may trail long-term education inflation",
            "High cost per unit of pure life coverage relative to term plans"
        ],
        risk_considerations="Low investment risk. Inflation risk: the real purchasing power of the maturity corpus may be eroded if inflation exceeds returns.",
        estimated_annual_premium_range=f"₹{endow_rates['annual_min']:,} - ₹{endow_rates['annual_max']:,}/yr (Illustrative)",
        estimated_monthly_premium_range=f"₹{endow_rates['monthly_min']:,} - ₹{endow_rates['monthly_max']:,}/mo (Illustrative)",
        eligibility_notes="Ideal for horizon of 10 to 20 years with predictable cash flow.",
        suggested_questions_for_insurer=[
            "What portion of the final payout is guaranteed versus dependent on variable bonus declarations?",
            "What are the lock-in and paid-up policy conditions if premiums are halted early?",
            "What is the exact internal rate of return (IRR) based on illustration at 4% and 8% IRDAI guidelines?"
        ],
        is_primary_recommendation=False
    ))
    
    # 4. Unit-Linked Insurance Plans (ULIP)
    ulip_rates = estimate_illustrative_premium(min(gap, 4000000) if gap > 0 else 2500000, age, 15, "ulip")
    ulip_score = 40
    if risk == "aggressive" or risk == "moderate":
        ulip_score += 20
    if pref == "market_linked":
        ulip_score += 25
    ulip_score = min(85, ulip_score)
    
    recommendations.append(ProductRecommendation(
        category_id="ulip",
        category_name="ULIP (Unit Linked Insurance Plan)",
        badge="Market-Linked Wealth Creation + Life Cover",
        suitability_score=ulip_score,
        why_it_suits=(
            "Allows you to invest part of your premium in equity/debt funds for higher long-term growth while maintaining life protection."
        ),
        key_benefits=[
            "Flexibility to switch between equity, balanced, and debt funds without incurring capital gains tax",
            "Top-up facility to invest additional surplus funds",
            "Mandatory 5-year lock-in enforces long-term financial discipline",
            "Modern online ULIPs feature zero premium allocation and zero policy administration charges"
        ],
        limitations=[
            "Investment returns are subject to market volatility; risk is borne entirely by the policyholder",
            "Life coverage multiplier is typically 10x annual premium, which may leave a large coverage gap if used alone"
        ],
        risk_considerations="Moderate to high market risk depending on equity allocation. Requires a 7+ year horizon.",
        estimated_annual_premium_range=f"₹{ulip_rates['annual_min']:,} - ₹{ulip_rates['annual_max']:,}/yr (Illustrative)",
        estimated_monthly_premium_range=f"₹{ulip_rates['monthly_min']:,} - ₹{ulip_rates['monthly_max']:,}/mo (Illustrative)",
        eligibility_notes="Mandatory lock-in period of 5 years. Best suited for investors comfortable with equity exposure.",
        suggested_questions_for_insurer=[
            "What are all fund management charges (FMC), mortality charges, and guarantee fees deducted from NAV?",
            "Does the policy offer Return of Mortality Charges (ROTC) upon maturity?",
            "How many free fund switches are permitted each financial year?"
        ],
        is_primary_recommendation=False
    ))
    
    # Sort recommendations by suitability score descending
    recommendations.sort(key=lambda r: r.suitability_score, reverse=True)
    # Ensure top item has is_primary_recommendation = True
    for i, r in enumerate(recommendations):
        r.is_primary_recommendation = (i == 0)
        
    return recommendations
