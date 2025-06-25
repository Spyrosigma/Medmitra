from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from llama_parse import LlamaParse
import os
from dotenv import load_dotenv
import tempfile
import asyncio
from typing import List
import time

# Import route modules
from routes.case import router as case_router

from core.config import LLAMAPARSE_API_KEY

load_dotenv()

app = FastAPI(title="MedMitra Backend", description="Backend API for MedMitra medical case management", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  
)

app.include_router(case_router)

parser = LlamaParse(
    api_key=LLAMAPARSE_API_KEY,
    result_type="markdown",
    verbose=True
)

@app.get("/")
def read_root():
    return {"message": "MedMitra Backend API is running!"}



# document processing
# @app.post("/docs_process")
# async def process_documents(files: List[UploadFile] = File(...)):
#     """
#     Process uploaded documents in parallel using LlamaParse async mode.
#     """
#     start_time = time.time()
#     try:
#         # Create temporary files from uploaded files
#         temp_files = []
#         file_paths = []
        
#         for file in files:
#             # Create a temporary file
#             temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=f"_{file.filename}")
#             content = await file.read()
#             temp_file.write(content)
#             temp_file.close()
            
#             temp_files.append(temp_file)
#             file_paths.append(temp_file.name)
        
#         # Process all files in parallel using aload_data
#         documents = await parser.aload_data(file_paths)
        
#         # Clean up temporary files
#         for temp_file in temp_files:
#             try:
#                 os.unlink(temp_file.name)
#             except OSError:
#                 pass  # File might already be deleted
        
#         # Process results with proper bounds checking
#         results = []
#         for i, file in enumerate(files):
#             # Check if we have a corresponding document
#             if i < len(documents) and documents[i] is not None:
#                 doc = documents[i]
#                 results.append({
#                     "filename": file.filename,
#                     "content": doc.text if hasattr(doc, 'text') else str(doc),
#                     "metadata": doc.metadata if hasattr(doc, 'metadata') else {},
#                     "status": "success"
#                 })
#             else:
#                 # Handle case where document processing failed or returned None
#                 results.append({
#                     "filename": file.filename,
#                     "content": "",
#                     "metadata": {},
#                     "status": "error",
#                     "error": "Document processing failed or returned no content"
#                 })
        
#         end_time = time.time()
#         total_time = end_time - start_time

#         return {
#             "status": "success",
#             "files_processed": len(results),
#             "results": results,
#             "processing_time": total_time
#         }
        
#     except Exception as e:
#         # Clean up temporary files in case of error
#         for temp_file in temp_files:
#             try:
#                 os.unlink(temp_file.name)
#             except OSError:
#                 pass
        
#         raise HTTPException(status_code=500, detail=f"Error processing documents: {str(e)}")


# @app.post("/docs_process_concurrent")
# async def process_documents_concurrent(files: List[UploadFile] = File(...)):
    # """
    # Alternative approach: Process each file individually but concurrently.
    # This gives you more control over individual file processing.
    # """
    # start_time = time.time()
    # try:
    #     async def process_single_file(file: UploadFile):
    #         # Create temporary file
    #         temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=f"_{file.filename}")
    #         content = await file.read()
    #         temp_file.write(content)
    #         temp_file.close()
            
    #         try:
    #             # Process single file
    #             documents = await parser.aload_data([temp_file.name])
    #             doc = documents[0] if documents else None
                
    #             return {
    #                 "filename": file.filename,
    #                 "content": doc.text if doc else "",
    #                 "metadata": doc.metadata if doc and hasattr(doc, 'metadata') else {},
    #                 "status": "success"
    #             }
    #         except Exception as e:
    #             return {
    #                 "filename": file.filename,
    #                 "content": "",
    #                 "metadata": {},
    #                 "status": "error",
    #                 "error": str(e)
    #             }
    #         finally:
    #             # Clean up temp file
    #             try:
    #                 os.unlink(temp_file.name)
    #             except OSError:
    #                 pass
        
    #     # Process all files concurrently
    #     tasks = [process_single_file(file) for file in files]
    #     results = await asyncio.gather(*tasks, return_exceptions=True)
        
    #     # Handle any exceptions that occurred
    #     processed_results = []
    #     for result in results:
    #         if isinstance(result, Exception):
    #             processed_results.append({
    #                 "filename": "unknown",
    #                 "content": "",
    #                 "metadata": {},
    #                 "status": "error",
    #                 "error": str(result)
    #             })
    #         else:
    #             processed_results.append(result)
        
    #     end_time = time.time()
    #     total_time = end_time - start_time

    #     return {
    #         "status": "success",
    #         "files_processed": len(processed_results),
    #         "results": processed_results,
    #         "processing_time": total_time
    #     }
        
    # except Exception as e:
    #     raise HTTPException(status_code=500, detail=f"Error processing documents: {str(e)}")


if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)