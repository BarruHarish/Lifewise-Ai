from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import datetime

class AppointmentCreate(BaseModel):
    advisor_id: int
    customer_name: str = Field(..., min_length=2, max_length=100)
    customer_email: EmailStr
    customer_phone: Optional[str] = Field(None, max_length=20)
    consultation_type: str = Field("video", pattern="^(video|phone)$")
    appointment_date: str = Field(..., pattern=r"^\d{4}-\d{2}-\d{2}$")
    time_slot: str = Field(..., min_length=3, max_length=50)
    assessment_id: Optional[int] = None
    notes: Optional[str] = Field(None, max_length=500)

class AppointmentResponse(BaseModel):
    id: int
    advisor_id: int
    advisor_name: Optional[str] = None
    customer_name: str
    customer_email: str
    consultation_type: str
    appointment_date: str
    time_slot: str
    status: str
    created_at: datetime
    meeting_link: Optional[str] = None

class ScenarioAdjustmentInput(BaseModel):
    desired_cover: float = Field(..., ge=0)
    policy_duration_years: int = Field(..., ge=5, le=50)
    monthly_budget: float = Field(..., ge=0)
    age: int = Field(30, ge=18, le=75)

class ScenarioAdjustmentResponse(BaseModel):
    desired_cover: float
    policy_duration_years: int
    monthly_budget: float
    estimated_monthly_premium: float
    estimated_annual_premium: float
    is_affordable: bool
    budget_variance: float  # monthly_budget - estimated_monthly_premium
    adequacy_percentage: float
    category_comparisons: List[dict]
