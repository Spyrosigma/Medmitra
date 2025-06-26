from groq import Groq
from dotenv import load_dotenv
load_dotenv()
# from core.config import GROQ_API_KEY
import logging
import asyncio
from supabase_client.supabase_client import SupabaseCaseClient
import os 
from utils.medical_prompts import RADIOLOGY_ANALYSIS_PROMPT
from utils.extractjson import extract_json_from_string
from config import GROQ_API_KEY

logger = logging.getLogger(__name__)

client = Groq(api_key=GROQ_API_KEY)
supabase = SupabaseCaseClient()


async def image_extraction(image_url: str):
    """
    Vision agent for a image.
    """

    logger.info(f"Starting vision agent for image ------ {image_url}")
    print(f"Starting vision agent for image ------ {image_url}")

    completion = client.chat.completions.create(
        model="meta-llama/llama-4-scout-17b-16e-instruct",
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": RADIOLOGY_ANALYSIS_PROMPT
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": image_url
                        }
                    }
                ]
            }
        ],
        temperature=1,
        max_completion_tokens=1024,
        top_p=1,
        stream=False,
        stop=None,
    )

    res = extract_json_from_string(completion.choices[0].message.content)
    return res


async def vision_agent(case_id: str):
    """
    Vision agent for a image.
    
    Args:
        case_id: Case ID for which to process images
    """
    
    logger.info(f"Starting vision agent for case ------ {case_id}")

    results = await supabase.get_case_files(case_id=case_id)
    # print(f"Results: {results}")
    mapping = {}
    
    for result in results:
        file_id = result.get("file_id")
        file_url = result.get("file_url")
        file_category = result.get("file_category")

        if file_category == "radiology":
            ai_summary = await image_extraction(file_url)
            logger.info(f"AI Summary for file_id {file_id}: {ai_summary}")
            mapping[file_id] = ai_summary
            try:
                await supabase.update_case_file_metadata(
                    file_id=file_id, 
                    metadata={"ai_summary": ai_summary}
                )
                logger.info(f"Updated ai_summary for file_id: {file_id}")
            except Exception as e:
                logger.error(f"Failed to update ai_summary for file_id {file_id}: {str(e)}")    
    
    return True

