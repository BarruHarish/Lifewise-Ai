import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_calculate_coverage_api():
    payload = {
        "age": 30,
        "annual_income": 1200000,
        "monthly_expenses": 45000,
        "employment_category": "salaried",
        "dependents_count": 2,
        "annual_family_support": 500000,
        "support_years": 20,
        "outstanding_home_loan": 3000000,
        "other_liabilities": 200000,
        "future_education_goals": 1500000,
        "other_future_goals": 0,
        "existing_life_cover": 1000000,
        "available_assets": 500000,
        "monthly_budget": 2000,
        "preferred_duration_years": 30
    }
    response = client.post("/api/coverage/calculate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "pv_family_support" in data
    assert "estimated_additional_cover" in data
    assert "hlv_estimate" in data
    assert data["estimated_additional_cover"] > 0

def test_recommendations_api():
    payload = {
        "age": 30,
        "annual_income": 1200000,
        "monthly_expenses": 45000,
        "employment_category": "salaried",
        "dependents_count": 2,
        "annual_family_support": 500000,
        "support_years": 20,
        "outstanding_home_loan": 3000000,
        "other_liabilities": 200000,
        "future_education_goals": 1500000,
        "other_future_goals": 0,
        "existing_life_cover": 1000000,
        "available_assets": 500000,
        "monthly_budget": 2000,
        "preferred_duration_years": 30
    }
    response = client.post("/api/recommendations", json=payload)
    assert response.status_code == 200
    recs = response.json()
    assert len(recs) == 4
    categories = [r["category_id"] for r in recs]
    assert "term_life" in categories
    assert "whole_life" in categories
    assert "endowment" in categories
    assert "ulip" in categories

def test_advisors_and_appointments():
    # 1. Get Advisors
    res_adv = client.get("/api/advisors")
    assert res_adv.status_code == 200
    advisors = res_adv.json()
    assert len(advisors) >= 1
    advisor_id = advisors[0]["id"]
    
    # 2. Book an Appointment
    booking = {
        "advisor_id": advisor_id,
        "customer_name": "Rohan Mehra",
        "customer_email": "rohan.mehra@example.com",
        "customer_phone": "+91 9876543210",
        "consultation_type": "video",
        "appointment_date": "2026-11-05",
        "time_slot": "10:00 AM - 10:45 AM",
        "notes": "Discussing term cover for home loan safety."
    }
    res_book = client.post("/api/appointments", json=booking)
    assert res_book.status_code == 201
    appt = res_book.json()
    assert appt["customer_name"] == "Rohan Mehra"
    assert "meeting_link" in appt
    
    # 3. Retrieve Appointment
    appt_id = appt["id"]
    res_get = client.get(f"/api/appointments/{appt_id}")
    assert res_get.status_code == 200
    assert res_get.json()["id"] == appt_id
