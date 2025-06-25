import logging, asyncio
import tempfile
import os
from typing import List, Optional, Dict, Any
from agents.vision_agent import image_extraction
logger = logging.getLogger(__name__)
from parsers.parse import process_pdf_async
from agents.vision_agent import vision_agent

from supabase_client.supabase_client import SupabaseCaseClient
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
    """
    Agentic process for a case.
    
    Args:
        case_id: Unique identifier for the case
        user_id: User who created the case
        patient_name: Name of the patient
        patient_age: Age of the patient
        patient_gender: Gender of the patient
        case_summary: Optional summary provided by the doctor
        lab_files: List of dictionaries containing lab file data (metadata + content)
        radiology_files: List of dictionaries containing radiology file data (metadata + content)
    """
    
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

    await supabase.update_case_status(case_id=case_id, status="completed")

    # Generate a summary of the case using the summaries of the LAB and RADIOLOGY documents  + The information provided by the doctor.

    # Generate SOAP (Subjective, Objective, Assessment, Plan) note using the summary of the case.

    # Generate a diagnosis using the SOAP note.
    # Generate a Differential diagnosis using the SOAP note.
    # Generate a list of recommended Investigation & treatment suggestions using the SOAP note.
    # A single confidence score for the combined output

    logger.info(f"Completed agentic process for user ------ {user_id} and case ------ {case_id}")

    return "done"