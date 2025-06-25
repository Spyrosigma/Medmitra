import nest_asyncio
import os
import logging
from typing import Optional
from llama_cloud_services import LlamaParse
from llama_index.core import SimpleDirectoryReader
import uuid

from dotenv import load_dotenv
load_dotenv()
# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger(__name__)

# Apply nest_asyncio for async operations in notebook environments
nest_asyncio.apply()

def llama_parse(input_directory: str, output_directory: str, api_key: Optional[str] = None) -> bool:
    """
    Process documents from the input directory and save extracted content to the output directory.
    
    Args:
        input_directory: Path to the directory containing input documents
        output_directory: Path where processed documents will be saved
        api_key: LlamaParse API key (optional, will use default if not provided)
        
    Returns:
        bool: True if processing was successful, False otherwise
    """
    try:
        # Create output directory if it doesn't exist
        if not os.path.exists(output_directory):
            os.makedirs(output_directory)
            logger.info(f"Created output directory: {output_directory}")
        
        # Check if input directory exists
        if not os.path.exists(input_directory):
            logger.error(f"Input directory does not exist: {input_directory}")
            return False
            
        # Initialize LlamaParse
        parser = LlamaParse(
            api_key=os.getenv("LLAMAPARSE_API_KEY"),
            result_type="markdown",
            verbose=True,
        )
        
        # Configure file extractors
        file_extractor = {".pdf": parser, ".txt": parser, ".docx": parser, ".pptx": parser}
        
        # Load documents
        logger.info(f"Loading documents from {input_directory}")
        documents = SimpleDirectoryReader(
            input_dir=input_directory, 
            file_extractor=file_extractor, 
            recursive=True
        ).load_data(show_progress=True)
        
        logger.info(f"Processing {len(documents)} documents")
        
        # Process and save each document
        for i, doc in enumerate(documents):
            try:
                document_data = doc.model_dump_json()
                output_path = f"{output_directory}/docs-{uuid.uuid4()}.json"
                
                with open(output_path, "w") as f:
                    f.write(str(document_data))
                
                logger.info(f"Saved document to {output_path}")
                
            except Exception as e:
                logger.error(f"Error processing document {i}: {str(e)}")
        
        logger.info("Document processing completed successfully")
        return True
        
    except Exception as e:
        logger.error(f"Error in document processing: {str(e)}")
        return False

