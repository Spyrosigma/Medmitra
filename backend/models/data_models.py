from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any, Literal, Union
from datetime import datetime
from enum import Enum


# Patient Information Models
class PatientData(BaseModel):
    name: str
    age: int
    gender: str

# File and Document Models
class ProcessedFile(BaseModel):
    file_id: str
    file_name: str
    file_type: str
    file_category: Literal["lab", "radiology"]
    text_data: Optional[str] = None
    ai_summary: Optional[str] = None

class LabDocument(BaseModel):
    file_id: str
    file_name: str
    extracted_text: str
    lab_values: Optional[Dict[str, Any]] = None
    summary: Optional[str] = None

class RadiologyDocument(BaseModel):
    file_id: str
    file_name: str
    summary: Optional[str] = None

class RadiologyImage(BaseModel):
    file_id: str
    file_name: str
    findings: Optional[str] = None
    impressions: Optional[str] = None
    summary: Optional[str] = None



# Input Models for the Agent
class CaseInput(BaseModel):
    case_id: str
    patient_data: PatientData
    doctor_case_summary: str
    lab_files: Optional[List[ProcessedFile]] = []
    radiology_files: Optional[List[ProcessedFile]] = []



# Medical Analysis Models
class CaseSummary(BaseModel):
    comprehensive_summary: str
    key_findings: List[str]
    patient_context: PatientData
    doctor_notes: Optional[str] = None
    lab_summary: Optional[str] = None
    radiology_summary: Optional[str] = None
    confidence_score: float = Field(ge=0.0, le=1.0)

class SOAPNote(BaseModel):
    subjective: str
    objective: str
    assessment: str
    plan: str
    confidence_score: float = Field(ge=0.0, le=1.0)

class Diagnosis(BaseModel):
    primary_diagnosis: str
    icd_code: Optional[str] = None
    description: str
    confidence_score: float = Field(ge=0.0, le=1.0)
    supporting_evidence: List[str]

class DifferentialDiagnosis(BaseModel):
    condition: str
    probability: float = Field(ge=0.0, le=1.0)
    reasoning: str
    distinguishing_factors: List[str]

class InvestigationRecommendation(BaseModel):
    investigation_type: str
    urgency: Literal["urgent", "routine", "follow-up"]
    rationale: str
    expected_findings: Optional[str] = None

class TreatmentRecommendation(BaseModel):
    treatment_type: str
    description: str
    dosage: Optional[str] = None
    duration: Optional[str] = None
    precautions: Optional[List[str]] = None

class MedicalInsights(BaseModel):
    case_summary: CaseSummary
    soap_note: SOAPNote
    primary_diagnosis: Diagnosis
    # differential_diagnoses: List[DifferentialDiagnosis]
    # investigation_recommendations: List[InvestigationRecommendation]
    # treatment_recommendations: List[TreatmentRecommendation]
    overall_confidence_score: float = Field(ge=0.0, le=1.0)
    generated_at: datetime = Field(default_factory=datetime.now)

