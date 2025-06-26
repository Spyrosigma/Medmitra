from typing import List, Dict, Optional, Any
import json
import asyncio
from utils.base_agent import BaseAgent
from models.state_models import MedicalAnalysisState
from models.data_models import (
    CaseInput, LabDocument, RadiologyDocument, CaseSummary, SOAPNote,
    Diagnosis, DifferentialDiagnosis, InvestigationRecommendation,
    TreatmentRecommendation, MedicalInsights, PatientData
)

from langgraph.graph import StateGraph, END
from utils.llm_utils import LLMManager
from supabase_client.supabase_client import SupabaseCaseClient

from utils.medical_prompts import LAB_ANALYSIS_PROMPT, CASE_SUMMARY_PROMPT, SOAP_NOTE_PROMPT, DIAGNOSIS_PROMPT, DIFFERENTIAL_DIAGNOSIS_PROMPT, RECOMMENDATIONS_PROMPT

from utils.extractjson import extract_json_from_string

import logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class MedicalInsightsAgent(BaseAgent):
    
    def __init__(self, model_name: str = "llama-3.3-70b-versatile", temperature: float = 0.2):
        self.llm_manager = LLMManager(model_name=model_name, temperature=temperature)
        self.supabase = SupabaseCaseClient()
        self.workflow = self.build_workflow()

    def build_workflow(self) -> StateGraph:
        """Construct the medical analysis workflow"""
        builder = StateGraph(MedicalAnalysisState)

        # Add processing nodes
        builder.add_node("process_lab_documents", self._process_lab_documents)
        builder.add_node("process_radiology_documents", self._process_radiology_documents)
        builder.add_node("generate_case_summary", self._generate_case_summary)
        builder.add_node("generate_soap_note", self._generate_soap_note)
        builder.add_node("generate_diagnosis", self._generate_diagnosis)
        # builder.add_node("generate_differential_diagnosis", self._generate_differential_diagnosis)
        # builder.add_node("generate_recommendations", self._generate_recommendations)
        builder.add_node("compile_insights", self._compile_insights)
        builder.add_node("save_results", self._save_results)

        # Set up workflow
        builder.set_entry_point("process_lab_documents")
        
        # Parallel processing of documents
        builder.add_edge("process_lab_documents", "process_radiology_documents")
        builder.add_edge("process_radiology_documents", "generate_case_summary")
        
        # Sequential medical analysis
        builder.add_edge("generate_case_summary", "generate_soap_note")
        builder.add_edge("generate_soap_note", "generate_diagnosis")
        
        # Parallel generation of differential diagnosis and recommendations
        # builder.add_edge("generate_diagnosis", "generate_differential_diagnosis")
        # builder.add_edge("generate_diagnosis", "generate_recommendations")
        # builder.add_edge("generate_differential_diagnosis", "compile_insights")
        # builder.add_edge("generate_recommendations", "compile_insights")

        builder.add_edge("generate_diagnosis", "compile_insights")
        builder.add_edge("compile_insights", "save_results")
        builder.add_edge("save_results", END)

        return builder.compile()



    async def _process_lab_documents(self, state: MedicalAnalysisState) -> MedicalAnalysisState:
        """Process laboratory documents"""
        logger.info("Processing laboratory documents...")
        processed_docs = []
        
        for lab_file in state["case_input"].lab_files:
            if lab_file.text_data:
                lab_analysis = await self.llm_manager.generate_response(system_prompt=LAB_ANALYSIS_PROMPT, user_input=lab_file.text_data)
                logger.info(f"Lab analysis for {lab_file.file_name}: {lab_analysis}")
                
                lab_doc = LabDocument(
                    file_id=lab_file.file_id,
                    file_name=lab_file.file_name,
                    extracted_text=lab_file.text_data,
                    lab_values=lab_analysis.get("lab_values"),
                    summary=lab_analysis.get("summary")
                )
                processed_docs.append(lab_doc)
        
        state["processed_lab_docs"] = processed_docs
        state["processing_stage"] = "lab_documents_processed"
        return state

    async def _process_radiology_documents(self, state: MedicalAnalysisState) -> MedicalAnalysisState:
        """Process radiology documents"""
        logger.info("Processing radiology documents...")
        processed_docs = []
        
        for radiology_file in state["case_input"].radiology_files:
            if radiology_file.ai_summary:
                try:
                    import json
                    ai_summary_data = json.loads(radiology_file.ai_summary)
                    summary_text = ai_summary_data.get("summary", radiology_file.ai_summary)
                except (json.JSONDecodeError, TypeError):
                    summary_text = radiology_file.ai_summary
                
                radiology_doc = RadiologyDocument(
                    file_id=radiology_file.file_id,
                    file_name=radiology_file.file_name,
                    summary=summary_text,
                )

                logger.info(f"Radiology document processed: {radiology_doc.file_name}, data: {radiology_doc}")
                processed_docs.append(radiology_doc)
        
        state["processed_radiology_docs"] = processed_docs
        state["processing_stage"] = "radiology_documents_processed"
        return state

    async def _generate_case_summary(self, state: MedicalAnalysisState) -> MedicalAnalysisState:
        """Generate comprehensive case summary"""
        logger.info("Generating case summary...")
        
        patient_data = state["case_input"].patient_data
        patient_info_str = f"Name: {patient_data.name}, Age: {patient_data.age}, Gender: {patient_data.gender}"
        
        case_context = {
            "patient_info": patient_info_str,
            "doctor_notes": state["case_input"].doctor_case_summary or "None provided",
            "lab_summaries": "; ".join([doc.summary for doc in state["processed_lab_docs"] if doc.summary]) or "No lab data available",
            "radiology_summaries": "; ".join([doc.summary for doc in state["processed_radiology_docs"] if doc.summary]) or "No radiology data available"
        }
        
        summary_response = await self.llm_manager.generate_response(
            system_prompt=CASE_SUMMARY_PROMPT, 
            user_input='',
            prompt_variables=case_context
        )
        
        logger.info(f"Summary response from LLM: {summary_response}")
        
        # Handle the case where the response might have different field names
        comprehensive_summary = summary_response.get("summary") or summary_response.get("comprehensive_summary", "")
        key_findings = summary_response.get("key_findings", [])
        confidence_score = summary_response.get("confidence_score", 0.8)
        
        case_summary = CaseSummary(
            comprehensive_summary=comprehensive_summary,
            key_findings=key_findings,
            patient_context=state["case_input"].patient_data,
            doctor_notes=state["case_input"].doctor_case_summary,
            lab_summary="; ".join([doc.summary for doc in state["processed_lab_docs"] if doc.summary]),
            radiology_summary="; ".join([doc.summary for doc in state["processed_radiology_docs"] if doc.summary]),
            confidence_score=confidence_score
        )

        logger.info(f"Case summary created in STATE: {case_summary}")
        
        state["case_summary"] = case_summary
        state["processing_stage"] = "case_summary_generated"
        return state

    async def _generate_soap_note(self, state: MedicalAnalysisState) -> MedicalAnalysisState:
        """Generate SOAP note"""
        logger.info("Generating SOAP note...")

        soap_response = await self.llm_manager.generate_response(
                        system_prompt=SOAP_NOTE_PROMPT, 
                        user_input="Case Summary" + state["case_summary"].model_dump_json())
        
        logger.info(f"SOAP response from LLM: {soap_response}")
        
        soap_note = SOAPNote(
            subjective=soap_response.get("subjective", ""),
            objective=soap_response.get("objective", ""),
            assessment=soap_response.get("assessment", ""),
            plan=soap_response.get("plan", ""),
            confidence_score=soap_response.get("confidence_score", 0.8)
        )
        
        state["soap_note"] = soap_note
        state["processing_stage"] = "soap_note_generated"
        return state

    async def _generate_diagnosis(self, state: MedicalAnalysisState) -> MedicalAnalysisState:
        """Generate primary diagnosis"""
        logger.info("Generating primary diagnosis...")
        
        diagnosis_response = await self.llm_manager.generate_response(
                        system_prompt=DIAGNOSIS_PROMPT, 
                        user_input= "SOAP Note: " + state["soap_note"].model_dump_json()
                        )
        
        logger.info(f"Diagnosis response from LLM: {diagnosis_response}")
        
        diagnosis = Diagnosis(
            primary_diagnosis=diagnosis_response.get("diagnosis", ""),
            icd_code=diagnosis_response.get("icd_code"),
            description=diagnosis_response.get("description", ""),
            confidence_score=diagnosis_response.get("confidence_score", 0.8),
            supporting_evidence=diagnosis_response.get("supporting_evidence", [])
        )
        
        state["primary_diagnosis"] = diagnosis
        state["processing_stage"] = "diagnosis_generated"
        return state


    # async def _generate_differential_diagnosis(self, state: MedicalAnalysisState) -> MedicalAnalysisState:
    #     """Generate differential diagnoses"""
    #     logger.info("Generating differential diagnoses...")
        
    #     diff_diagnosis_response = await self._generate_differential_with_llm(state["soap_note"], state["primary_diagnosis"])
        
    #     differential_diagnoses = []
    #     for diff_diag in diff_diagnosis_response["differential_diagnoses"]:
    #         differential_diagnoses.append(DifferentialDiagnosis(
    #             condition=diff_diag["condition"],
    #             probability=diff_diag["probability"],
    #             reasoning=diff_diag["reasoning"],
    #             distinguishing_factors=diff_diag["distinguishing_factors"]
    #         ))
        
    #     state["differential_diagnoses"] = differential_diagnoses
    #     return state

    # async def _generate_recommendations(self, state: MedicalAnalysisState) -> MedicalAnalysisState:
    #     """Generate investigation and treatment recommendations"""
    #     logger.info("Generating recommendations...")
        
    #     recommendations_response = await self._generate_recommendations_with_llm(state["soap_note"], state["primary_diagnosis"])
        
    #     # Process investigations
    #     investigations = []
    #     for inv in recommendations_response["investigations"]:
    #         investigations.append(InvestigationRecommendation(
    #             investigation_type=inv["type"],
    #             urgency=inv["urgency"],
    #             rationale=inv["rationale"],
    #             expected_findings=inv.get("expected_findings")
    #         ))
        
    #     # Process treatments
    #     treatments = []
    #     for treat in recommendations_response["treatments"]:
    #         treatments.append(TreatmentRecommendation(
    #             treatment_type=treat["type"],
    #             description=treat["description"],
    #             dosage=treat.get("dosage"),
    #             duration=treat.get("duration"),
    #             precautions=treat.get("precautions")
    #         ))
        
    #     state["investigation_recommendations"] = investigations
    #     state["treatment_recommendations"] = treatments
    #     return state


    async def _compile_insights(self, state: MedicalAnalysisState) -> MedicalAnalysisState:
        """Compile all insights into final output"""
        logger.info("Compiling medical insights...")
        
        # Calculate overall confidence score
        confidence_scores = [
            state["case_summary"].confidence_score,
            state["soap_note"].confidence_score,
            state["primary_diagnosis"].confidence_score
        ]
        overall_confidence = sum(confidence_scores) / len(confidence_scores)
        
        medical_insights = MedicalInsights(
            case_summary=state["case_summary"],
            soap_note=state["soap_note"],
            primary_diagnosis=state["primary_diagnosis"],
            # differential_diagnoses=state["differential_diagnoses"],
            # investigation_recommendations=state["investigation_recommendations"],
            # treatment_recommendations=state["treatment_recommendations"],
            overall_confidence_score=overall_confidence
        )
        logger.info("=="* 30)
        logger.info(f"----------- Compiled medical insights ------------")
        
        state["medical_insights"] = medical_insights
        state["processing_stage"] = "insights_compiled"
        return state

    async def _save_results(self, state: MedicalAnalysisState) -> MedicalAnalysisState:
        """Save results to database"""
        logger.info("Saving results to database...")
        
        try:
            insights_data = state["medical_insights"].model_dump()

            logger.info(f" - -------- Data to be saved: -----------: {insights_data}")

            await self.supabase.upload_ai_insights(
                case_id=state["case_input"].case_id,
                insights=insights_data
            )
            
            state["processing_stage"] = "completed"
            logger.info(f"Successfully saved medical insights for case {state['case_input'].case_id}")
            
        except Exception as e:
            logger.error(f"Error saving results: {e}")
            state["processing_errors"].append(f"Error saving results: {str(e)}")
            state["processing_stage"] = "error"
        
        return state



    async def process(self, case_input: CaseInput) -> MedicalInsights:
        """Process case through the complete workflow"""
        initial_state = MedicalAnalysisState(
            case_input=case_input,
            processed_lab_docs=[],
            processed_radiology_docs=[],
            case_summary=None,
            soap_note=None,
            primary_diagnosis=None,
            # differential_diagnoses=[],
            # investigation_recommendations=[],
            # treatment_recommendations=[],
            medical_insights=None,
            processing_errors=[],
            processing_stage="initialized",
            confidence_scores={}
        )
        
        final_state = await self.workflow.ainvoke(initial_state)
        return final_state["medical_insights"]
