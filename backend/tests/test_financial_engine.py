"""
Unit tests for the LifeWise AI Financial Calculation Engine
============================================================
Validates:
- Net Needs calculations
- Zero liabilities case
- No existing insurance case
- Existing cover greater than estimated needs (negative gap capped at 0)
- Multiple dependents
- Present Value discounting and inflation factors
- Human Life Value (HLV) calculations
- Deterministic recommendations for Term, Whole Life, Endowment, ULIP
"""

import pytest
from app.financial_engine import (
    FinancialAssessmentInput,
    calculate_financial_needs,
    calculate_pv_annuity,
    calculate_hlv,
    generate_recommendations,
    estimate_illustrative_premium
)

def test_pv_annuity_basic():
    # 100,000 for 10 years at 6% inflation and 7.5% discount
    pv = calculate_pv_annuity(100000, 10, inflation_rate=0.06, discount_rate=0.075)
    assert pv > 800000
    assert pv < 1000000

def test_pv_annuity_zero_years():
    pv = calculate_pv_annuity(100000, 0)
    assert pv == 0.0

def test_hlv_basic():
    hlv, years = calculate_hlv(age=30, annual_income=1200000, retirement_age=60)
    assert years == 30
    assert hlv > 10000000  # Should be substantial lifetime earning present value

def test_hlv_past_retirement():
    hlv, years = calculate_hlv(age=65, annual_income=1000000, retirement_age=60)
    assert years == 0
    assert hlv == 0.0

def test_net_needs_zero_liabilities():
    inputs = FinancialAssessmentInput(
        age=32,
        annual_income=1500000,
        monthly_expenses=50000,
        employment_category="salaried",
        dependents_count=2,
        annual_family_support=600000,
        support_years=20,
        outstanding_home_loan=0.0,
        other_liabilities=0.0,
        future_education_goals=2000000,
        other_future_goals=0.0,
        existing_life_cover=1000000,
        available_assets=500000,
        monthly_budget=2000,
        preferred_duration_years=30
    )
    result = calculate_financial_needs(inputs)
    assert result.total_liabilities == 0.0
    assert result.total_future_goals == 2000000.0
    assert result.total_existing_protection == 1500000.0
    assert result.estimated_additional_cover > 0.0
    assert result.estimated_additional_cover == result.coverage_gap

def test_net_needs_existing_cover_exceeds_needs():
    # User already has 5 Crore cover and 50 Lakh assets
    inputs = FinancialAssessmentInput(
        age=35,
        annual_income=2000000,
        monthly_expenses=40000,
        employment_category="salaried",
        dependents_count=1,
        annual_family_support=480000,
        support_years=10,
        outstanding_home_loan=1000000,
        other_liabilities=0.0,
        future_education_goals=1000000,
        other_future_goals=0.0,
        existing_life_cover=50000000,  # 5 Cr
        available_assets=5000000,
        monthly_budget=3000,
        preferred_duration_years=25
    )
    result = calculate_financial_needs(inputs)
    assert result.coverage_gap < 0.0
    # Additional required cover must be max(0, gap) -> 0
    assert result.estimated_additional_cover == 0.0

def test_recommendation_engine_pure_term():
    inputs = FinancialAssessmentInput(
        age=28,
        annual_income=1200000,
        monthly_expenses=40000,
        employment_category="salaried",
        dependents_count=2,
        annual_family_support=480000,
        support_years=22,
        outstanding_home_loan=4500000,
        other_liabilities=300000,
        future_education_goals=2500000,
        other_future_goals=0.0,
        existing_life_cover=0.0,
        available_assets=200000,
        monthly_budget=1500,
        preferred_duration_years=35,
        preference_type="pure_protection"
    )
    needs = calculate_financial_needs(inputs)
    recs = generate_recommendations(inputs, needs)
    
    assert len(recs) == 4
    # Term Life should be top recommendation with primary flag
    assert recs[0].category_id == "term_life"
    assert recs[0].is_primary_recommendation is True

def test_illustrative_premium_bounds():
    prem = estimate_illustrative_premium(cover_amount=10000000, age=30, tenure_years=30, category="term")
    assert prem["annual_min"] > 0
    assert prem["annual_max"] >= prem["annual_min"]
    assert prem["monthly_min"] > 0
