from llama_cloud_services import LlamaParse
from llama_index.core import SimpleDirectoryReader
from parsers.llama_proc import llama_parse
import os
import shutil

class DocumentProcessor:
    
    def __init__(self, local_input_dir: str, output_dir: str):
        """
        Initialize the DocumentProcessor with input and output directories.
        
        Args:
            local_input_dir (str): Directory where user uploads documents
            output_dir (str): Directory to save processed documents
        """
        self.local_input_dir = local_input_dir
        self.output_dir = output_dir

    def process_llama_documents(self) -> str:
            """
            Process documents using LlamaParse.
            
            Returns:
                str: Status message about the processing result
            """
            try:
                input_dir = self.local_input_dir
                output_dir = self.output_dir
                
                # Call llama_parse and check results
                results = llama_parse(input_directory=input_dir, output_directory=output_dir)
                
                if not results:
                    raise Exception("LlamaParse processing returned no results or failed")
                    
                print(f"Documents processed successfully and saved to {output_dir}")
                return True
            
            except Exception as e:
                error_msg = f"Error processing documents with LlamaParse: {str(e)}"
                print(error_msg)
                return False
                
            finally:
                # Clean up temporary files if needed
                # pass
                if os.path.exists(self.local_input_dir):
                    shutil.rmtree(self.local_input_dir)
                    print(f"Cleaned up user-specific input directory: {self.local_input_dir}")