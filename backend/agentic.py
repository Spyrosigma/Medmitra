import logging, asyncio
import tempfile
import os
from typing import List, Optional, Dict, Any
from agents.vision_agent import image_extraction
from parsers.parse import process_pdf_async
from agents.vision_agent import vision_agent
from supabase_client.supabase_client import SupabaseCaseClient
from models.data_models import ProcessedFile, CaseInput, PatientData
from agents.medical_ai_agent import MedicalInsightsAgent

logger = logging.getLogger(__name__)

supabase = SupabaseCaseClient()

async def agentic_process(
    case_id: str, 
    user_id: str,
    patient_name: str,
    patient_age: int,
    patient_gender: str,
    case_summary: Optional[str] = None,
    lab_files: Optional[List[Dict[str, Any]]] = None,
    radiology_files: Optional[List[Dict[str, Any]]] = None
):
    """agentic process for medical analysis"""
    
    logger.info(f"Starting agentic process for case {case_id}")
    
    logger.info(f"Starting agentic process for user ------ {user_id} and case ------ {case_id}")
    logger.info(f"Patient: {patient_name}, Age: {patient_age}, Gender: {patient_gender}")
    logger.info(f"Case summary: {case_summary}")
    logger.info(f"Lab files count: {len(lab_files) if lab_files else 0}")
    logger.info(f"Radiology files count: {len(radiology_files) if radiology_files else 0}")


    if lab_files:
        logger.info("Processing lab files...")
        for lab_file in lab_files:
            file_id = lab_file.get('file_id')
            file_name = lab_file.get('file_name')
            file_content = lab_file.get('file_content')
            file_type = lab_file.get('file_type')
            
            logger.info(f"Processing lab file: {file_name} ({file_type}) - Size: {len(file_content)} bytes")
            temp_file_path = None
            try:
                with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp_file:
                    temp_file.write(file_content)
                    temp_file_path = temp_file.name
                
                result = await process_pdf_async(temp_file_path)

                if result.get('status') == 'success':
                    logger.info(f"Successfully processed lab file: {file_name}")
                    await supabase.update_case_file_metadata(
                        file_id=file_id, 
                        metadata={"text_data": result.get('text', '')}
                        )
                else:
                    logger.error(f"Failed to process lab file {file_name}: {result.get('error', 'Unknown error')}")
                
            except Exception as e:
                logger.error(f"Error processing lab file {file_name}: {e}")
            finally:
                if temp_file_path and os.path.exists(temp_file_path):
                    os.unlink(temp_file_path)

    if radiology_files:
        logger.info("Processing radiology files...")
        result = await vision_agent(case_id)
        if result:
            logger.info(f"Successfully processed radiology files for case {case_id}")

    # await supabase.update_case_status(case_id=case_id, status="completed")

    # After processing files, we can now generate AI insights
    try:
        case_files = await supabase.get_case_files(case_id=case_id)
        
        processed_lab_files = []
        processed_radiology_files = []
        
        for file_record in case_files:
            processed_file = ProcessedFile(
                file_id=file_record["file_id"],
                file_name=file_record["file_name"],
                file_type=file_record["file_type"],
                file_category=file_record["file_category"],
                text_data=file_record.get("text_data",None),
                ai_summary=file_record.get("ai_summary",None)
            )
            
            if file_record["file_category"] == "lab":
                processed_lab_files.append(processed_file)
            elif file_record["file_category"] == "radiology":
                processed_radiology_files.append(processed_file)
        
      
        case_input = CaseInput(
            case_id=case_id,
            patient_data=PatientData(
                name=patient_name,
                age=patient_age,
                gender=patient_gender
            ),
            doctor_case_summary=case_summary,
            lab_files=processed_lab_files,
            radiology_files=processed_radiology_files
        )
        

        medical_agent = MedicalInsightsAgent()
        medical_insights = await medical_agent.process(case_input)
        
        logger.info(f"Successfully generated medical insights for case {case_id}")
        await supabase.update_case_status(case_id=case_id, status="completed")
        
    except Exception as e:
        logger.error(f"Error in AI insights generation: {e}")
        await supabase.update_case_status(case_id=case_id, status="failed")
        raise e

    logger.info(f"Completed enhanced agentic process for case {case_id}")
    return "done"
