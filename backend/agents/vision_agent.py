from groq import Groq
from dotenv import load_dotenv
load_dotenv()
# from core.config import GROQ_API_KEY
import logging
import asyncio

import os 
logger = logging.getLogger(__name__)

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


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
                        "text": "What's in this image? Just give me the summary of the image."
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

    return completion.choices[0].message.content



# if __name__ == "__main__":
#     asyncio.run(vision_agent("https://xtobirvqzftrebnacszv.supabase.co/storage/v1/object/public/labdocs/radiology_files/1389d7c4-faa2-47f2-9475-888ef6a5958f/WhatsApp%20Image%202025-06-15%20at%2021.13.24.jpeg"))