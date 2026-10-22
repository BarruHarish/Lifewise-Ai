from fastapi import FastAPI, Depends, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
import os

from app.config import settings
from app.database import engine, get_db, Base
from app.models import AssessmentRecord, AdvisorProfile, AppointmentRecord
from app.financial_engine import (
    FinancialAssessmentInput,
    FinancialNeedsResult,
    ProductRecommendation,
    calculate_financial_needs,
    generate_recommendations,
    estimate_illustrative_premium
)
from app.schemas import (
    AppointmentCreate,
    AppointmentResponse,
    ScenarioAdjustmentInput,
    ScenarioAdjustmentResponse
)

# Initialize tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="LifeWise AI: Intelligent Life Insurance Needs Finder & Advisory Platform Backend",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permits local dev and tests
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Seed default demo advisors if none exist
def seed_advisors():
    db = next(get_db())
    try:
        if db.query(AdvisorProfile).count() == 0:
            sample_advisors = [
                AdvisorProfile(
                    name="Priya Sharma",
                    title="Senior Protection Specialist & CFP®",
                    experience_years=11,
                    certifications="CFP, IRDAI Lic. #ADV-88349",
                    specialization="Term Life & Family Income Protection",
                    rating=4.95,
                    reviews_count=214,
                    languages="English, Hindi",
                    bio="Specializing in pure term cover optimization for young families and salaried professionals.",
                    avatar_url="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
                ),
                AdvisorProfile(
                    name="Rajesh Verma",
                    title="Principal Wealth & Estate Planner",
                    experience_years=15,
                    certifications="Chartered Financial Analyst, IRDAI Lic. #ADV-49210",
                    specialization="Whole Life, Debt Shielding & Estate Planning",
                    rating=4.91,
                    reviews_count=189,
                    languages="English, Hindi, Marathi",
                    bio="Expert in liability risk mitigation, home loan protection, and long-term estate preservation.",
                    avatar_url="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80"
                ),
                AdvisorProfile(
                    name="Ananya Iyer",
                    title="Digital Advisory Consultant",
                    experience_years=8,
                    certifications="Associate Financial Planner, IRDAI Lic. #ADV-71932",
                    specialization="Goal-Based Savings & Education Planning",
                    rating=4.88,
                    reviews_count=132,
                    languages="English, Tamil, Hindi",
                    bio="Passionate about helping first-time insurance buyers make transparent, mathematically sound decisions.",
                    avatar_url="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80"
                )
            ]
            for adv in sample_advisors:
                db.add(adv)
            db.commit()
    finally:
        db.close()

seed_advisors()


@app.get("/api/health", tags=["System"])
def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "database": "connected"
    }


@app.post("/api/coverage/calculate", response_model=FinancialNeedsResult, tags=["Calculations"])
def calculate_coverage(inputs: FinancialAssessmentInput):
    """
    Transparent Net Needs calculation and separate Human Life Value (HLV) benchmark.
    """
    return calculate_financial_needs(inputs)


@app.post("/api/recommendations", response_model=List[ProductRecommendation], tags=["Recommendations"])
def get_recommendations(inputs: FinancialAssessmentInput):
    """
    Deterministic rule-based product category evaluation across Term, Whole Life, Endowment, and ULIP.
    """
    needs = calculate_financial_needs(inputs)
    return generate_recommendations(inputs, needs)


@app.post("/api/assessment", tags=["Assessment"])
def save_assessment(inputs: FinancialAssessmentInput, db: Session = Depends(get_db)):
    """
    Calculate and optionally persist user assessment for continuity across advisory journey.
    """
    needs = calculate_financial_needs(inputs)
    recs = generate_recommendations(inputs, needs)
    
    record = AssessmentRecord(
        age=inputs.age,
        annual_income=inputs.annual_income,
        monthly_expenses=inputs.monthly_expenses,
        employment_category=inputs.employment_category,
        dependents_count=inputs.dependents_count,
        annual_family_support=inputs.annual_family_support,
        support_years=inputs.support_years,
        outstanding_home_loan=inputs.outstanding_home_loan,
        other_liabilities=inputs.other_liabilities,
        future_education_goals=inputs.future_education_goals,
        other_future_goals=inputs.other_future_goals,
        existing_life_cover=inputs.existing_life_cover,
        available_assets=inputs.available_assets,
        monthly_budget=inputs.monthly_budget,
        preferred_duration_years=inputs.preferred_duration_years,
        pv_family_support=needs.pv_family_support,
        total_liabilities=needs.total_liabilities,
        total_future_goals=needs.total_future_goals,
        total_estimated_needs=needs.total_estimated_needs,
        total_existing_protection=needs.total_existing_protection,
        estimated_additional_cover=needs.estimated_additional_cover,
        coverage_gap=needs.coverage_gap,
        hlv_estimate=needs.hlv_estimate,
        recommendations=[r.model_dump() for r in recs]
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    
    return {
        "assessment_id": record.id,
        "needs": needs,
        "recommendations": recs
    }


@app.post("/api/scenarios", response_model=ScenarioAdjustmentResponse, tags=["Scenarios"])
def simulate_scenario(scenario: ScenarioAdjustmentInput):
    """
    Interactive simulation calculating affordability and comparing across 4 insurance categories.
    """
    term_quote = estimate_illustrative_premium(scenario.desired_cover, scenario.age, scenario.policy_duration_years, "term")
    whole_quote = estimate_illustrative_premium(scenario.desired_cover, scenario.age, scenario.policy_duration_years, "whole_life")
    endow_quote = estimate_illustrative_premium(scenario.desired_cover, scenario.age, scenario.policy_duration_years, "endowment")
    ulip_quote = estimate_illustrative_premium(scenario.desired_cover, scenario.age, scenario.policy_duration_years, "ulip")
    
    est_monthly = float(term_quote["monthly_min"])
    est_annual = float(term_quote["annual_min"])
    is_affordable = scenario.monthly_budget >= est_monthly
    variance = scenario.monthly_budget - est_monthly
    
    comparisons = [
        {
            "category": "Term Life Insurance",
            "est_monthly": term_quote["monthly_min"],
            "est_annual": term_quote["annual_min"],
            "focus": "Pure Protection / Maximum Cover",
            "is_within_budget": scenario.monthly_budget >= term_quote["monthly_min"]
        },
        {
            "category": "Whole Life Insurance",
            "est_monthly": whole_quote["monthly_min"],
            "est_annual": whole_quote["annual_min"],
            "focus": "Lifelong Estate / Legacy Payout",
            "is_within_budget": scenario.monthly_budget >= whole_quote["monthly_min"]
        },
        {
            "category": "Endowment Plan",
            "est_monthly": endow_quote["monthly_min"],
            "est_annual": endow_quote["annual_min"],
            "focus": "Guaranteed Savings + Modest Cover",
            "is_within_budget": scenario.monthly_budget >= endow_quote["monthly_min"]
        },
        {
            "category": "Unit Linked Insurance (ULIP)",
            "est_monthly": ulip_quote["monthly_min"],
            "est_annual": ulip_quote["annual_min"],
            "focus": "Market-Linked Investment + Cover",
            "is_within_budget": scenario.monthly_budget >= ulip_quote["monthly_min"]
        }
    ]
    
    return ScenarioAdjustmentResponse(
        desired_cover=scenario.desired_cover,
        policy_duration_years=scenario.policy_duration_years,
        monthly_budget=scenario.monthly_budget,
        estimated_monthly_premium=est_monthly,
        estimated_annual_premium=est_annual,
        is_affordable=is_affordable,
        budget_variance=variance,
        adequacy_percentage=100.0 if scenario.desired_cover > 0 else 0.0,
        category_comparisons=comparisons
    )


@app.get("/api/advisors", tags=["Advisory"])
def list_advisors(db: Session = Depends(get_db)):
    """List certified advisors available for consultation."""
    advisors = db.query(AdvisorProfile).all()
    return advisors


@app.get("/api/appointments/availability", tags=["Advisory"])
def get_availability(advisor_id: int, date: str):
    """
    Returns available 45-minute consultation slots for a chosen advisor and date.
    """
    all_slots = [
        "09:30 AM - 10:15 AM",
        "11:00 AM - 11:45 AM",
        "02:00 PM - 02:45 PM",
        "03:30 PM - 04:15 PM",
        "05:00 PM - 05:45 PM",
        "06:30 PM - 07:15 PM"
    ]
    return {
        "advisor_id": advisor_id,
        "date": date,
        "available_slots": all_slots
    }


@app.post("/api/appointments", response_model=AppointmentResponse, status_code=status.HTTP_201_CREATED, tags=["Advisory"])
def book_appointment(booking: AppointmentCreate, db: Session = Depends(get_db)):
    """
    Book a digital advisory consultation (video or phone).
    """
    advisor = db.query(AdvisorProfile).filter(AdvisorProfile.id == booking.advisor_id).first()
    if not advisor:
        raise HTTPException(status_code=404, detail="Selected advisor profile not found")
        
    appointment = AppointmentRecord(
        advisor_id=booking.advisor_id,
        customer_name=booking.customer_name,
        customer_email=booking.customer_email,
        customer_phone=booking.customer_phone,
        consultation_type=booking.consultation_type,
        appointment_date=booking.appointment_date,
        time_slot=booking.time_slot,
        assessment_id=booking.assessment_id,
        notes=booking.notes,
        status="confirmed"
    )
    db.add(appointment)
    db.commit()
    db.refresh(appointment)
    
    meeting_link = f"https://meet.lifewise.ai/session/{appointment.id}-{booking.consultation_type}"
    
    return AppointmentResponse(
        id=appointment.id,
        advisor_id=appointment.advisor_id,
        advisor_name=advisor.name,
        customer_name=appointment.customer_name,
        customer_email=appointment.customer_email,
        consultation_type=appointment.consultation_type,
        appointment_date=appointment.appointment_date,
        time_slot=appointment.time_slot,
        status=appointment.status,
        created_at=appointment.created_at,
        meeting_link=meeting_link
    )


@app.get("/api/appointments/{appointment_id}", response_model=AppointmentResponse, tags=["Advisory"])
def get_appointment(appointment_id: int, db: Session = Depends(get_db)):
    """Retrieve appointment details."""
    appointment = db.query(AppointmentRecord).filter(AppointmentRecord.id == appointment_id).first()
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
        
    advisor = db.query(AdvisorProfile).filter(AdvisorProfile.id == appointment.advisor_id).first()
    return AppointmentResponse(
        id=appointment.id,
        advisor_id=appointment.advisor_id,
        advisor_name=advisor.name if advisor else "Senior Advisor",
        customer_name=appointment.customer_name,
        customer_email=appointment.customer_email,
        consultation_type=appointment.consultation_type,
        appointment_date=appointment.appointment_date,
        time_slot=appointment.time_slot,
        status=appointment.status,
        created_at=appointment.created_at,
        meeting_link=f"https://meet.lifewise.ai/session/{appointment.id}-{appointment.consultation_type}"
    )
