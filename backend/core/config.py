import os
from dotenv import load_dotenv

load_dotenv()

SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
SUPABASE_URL = os.getenv("SUPABASE_URL")

LLAMAPARSE_API_KEY=os.getenv("LLAMAPARSE_API_KEY")
GROQ_API_KEY=os.getenv("GROQ_API_KEY")

WEAVIATE_API_KEY=os.getenv("WEAVIATE_API_KEY")
WEAVIATE_REST_URL=os.getenv("WEAVIATE_REST_URL")