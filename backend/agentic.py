import logging, asyncio
from agents.vision_agent import image_extraction
logger = logging.getLogger(__name__)


async def agentic_process(case_id: str, user_id: str):
    """
    Agentic process for a case.
    """
    
    logger.info(f"Starting agentic process for user ------ {user_id} and case ------ {case_id}")


    await asyncio.sleep(10)

    # Parse the LAB documents and generate a summary of the each file.



    # Parse the RADIOLOGY images and generate a summary of the each image.
    await image_extraction("https://xtobirvqzftrebnacszv.supabase.co/storage/v1/object/public/labdocs/radiology_files/1389d7c4-faa2-47f2-9475-888ef6a5958f/WhatsApp%20Image%202025-06-15%20at%2021.13.24.jpeg")


    # Generate a summary of the case using the summaries of the LAB and RADIOLOGY documents  + The information provided by the doctor.

    # Generate SOAP (Subjective, Objective, Assessment, Plan) note using the summary of the case.


    # Generate a diagnosis using the SOAP note.
    # Generate a Differential diagnosis using the SOAP note.
    # Generate a list of recommended Investigation & treatment suggestions using the SOAP note.
    # A single confidence score for the combined output


    logger.info(f"Completed agentic process for user ------ {user_id} and case ------ {case_id}")

    return "done"