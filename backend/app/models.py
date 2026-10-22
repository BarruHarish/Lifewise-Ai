from sqlalchemy import Column, Integer, String, Float, DateTime, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.database import Base

class AssessmentRecord(Base):
    __tablename__ = "assessments"

    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    session_id = Column(String, index=True, nullable=True)
    
    # Inputs
    age = Column(Integer, nullable=False)
    annual_income = Column(Float, nullable=False)
    monthly_expenses = Column(Float, nullable=False)
    employment_category = Column(String, default="salaried")
    
    dependents_count = Column(Integer, nullable=False)
    annual_family_support = Column(Float, nullable=False)
    support_years = Column(Integer, nullable=False)
    
    outstanding_home_loan = Column(Float, default=0.0)
    other_liabilities = Column(Float, default=0.0)
    future_education_goals = Column(Float, default=0.0)
    other_future_goals = Column(Float, default=0.0)
    
    existing_life_cover = Column(Float, default=0.0)
    available_assets = Column(Float, default=0.0)
    monthly_budget = Column(Float, nullable=False)
    preferred_duration_years = Column(Integer, default=30)
    
    # Calculated Outputs
    pv_family_support = Column(Float)
    total_liabilities = Column(Float)
    total_future_goals = Column(Float)
    total_estimated_needs = Column(Float)
    total_existing_protection = Column(Float)
    estimated_additional_cover = Column(Float)
    coverage_gap = Column(Float)
    hlv_estimate = Column(Float)
    
    # Recommendations stored as JSON
    recommendations = Column(JSON, nullable=True)


class AdvisorProfile(Base):
    __tablename__ = "advisors"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    title = Column(String, nullable=False)
    experience_years = Column(Integer, default=8)
    certifications = Column(String, default="IRDAI Certified / CFP")
    specialization = Column(String, default="Protection & Term Planning")
    rating = Column(Float, default=4.9)
    reviews_count = Column(Integer, default=142)
    languages = Column(String, default="English, Hindi")
    bio = Column(Text, nullable=False)
    avatar_url = Column(String, nullable=True)


class AppointmentRecord(Base):
    __tablename__ = "appointments"

    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    advisor_id = Column(Integer, ForeignKey("advisors.id"), nullable=False)
    
    customer_name = Column(String, nullable=False)
    customer_email = Column(String, nullable=False)
    customer_phone = Column(String, nullable=True)
    consultation_type = Column(String, default="video")  # video or phone
    appointment_date = Column(String, nullable=False)     # YYYY-MM-DD
    time_slot = Column(String, nullable=False)            # e.g. "10:00 AM - 10:45 AM"
    status = Column(String, default="confirmed")          # confirmed, cancelled, completed
    notes = Column(Text, nullable=True)
    assessment_id = Column(Integer, ForeignKey("assessments.id"), nullable=True)
