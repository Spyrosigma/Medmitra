# FILE: STATE_MODELS.PY
from typing import List, Dict, Optional, Annotated, Union
from typing_extensions import TypedDict, Any
from models.data_models import (
    CaseInput, PatientData, ProcessedFile, LabDocument, RadiologyDocument,
    CaseSummary, SOAPNote, Diagnosis, DifferentialDiagnosis,
    InvestigationRecommendation, TreatmentRecommendation, MedicalInsights
)


class DocumentAnalysisState(TypedDict):
    """State for individual document analysis"""
    document_text: str
    document_type: str
    extracted_entities: Optional[Dict[str, Any]]
    summary: Optional[str]
    confidence_score: float


class MedicalAnalysisState(TypedDict):
    """Tracks the complete medical analysis pipeline state"""
    
    # Input data
    case_input: CaseInput
    
    # Processed documents
    processed_lab_docs: List[LabDocument]
    processed_radiology_docs: List[RadiologyDocument]
    
    # Analysis results
    case_summary: Optional[CaseSummary]
    soap_note: Optional[SOAPNote]
    primary_diagnosis: Optional[Diagnosis]
    differential_diagnoses: List[DifferentialDiagnosis]
    investigation_recommendations: List[InvestigationRecommendation]
    treatment_recommendations: List[TreatmentRecommendation]
    
    # Final output
    medical_insights: Optional[MedicalInsights]
    
    # Processing metadata
    processing_errors: List[str]
    processing_stage: str
    confidence_scores: Dict[str, float]

