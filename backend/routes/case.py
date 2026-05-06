from fastapi import APIRouter, HTTPException, File, UploadFile, Form, BackgroundTasks
from fastapi.responses import JSONResponse
from typing import Optional, List
from pydantic import BaseModel
import uuid
import logging

from supabase_client.supabase_client import SupabaseCaseClient, SupabaseClientError
from agentic import agentic_process

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/cases",
    tags=["cases"],
    responses={404: {"description": "Not found"}},
)

supabase_client = SupabaseCaseClient()

class CaseCreate(BaseModel):
    patient_name: str
    patient_age: int
    case_summary: Optional[str] = None

class CaseUpdate(BaseModel):
    patient_name: Optional[str] = None
    patient_age: Optional[int] = None
    case_summary: Optional[str] = None
    status: Optional[str] = None

class AnalysisRequest(BaseModel):
    analysis_results: Optional[str] = None

@router.post("/create_case")
async def create_case(
    background_tasks: BackgroundTasks,
    user_id: str = Form(...),
    patient_name: str = Form(...),
    patient_age: int = Form(...),
    patient_gender: str = Form(...),
    case_summary: Optional[str] = Form(None),
    lab_files: Optional[List[UploadFile]] = File(None),
    radiology_files: Optional[List[UploadFile]] = File(None),
):
    """Create a new case for a doctor with optional file uploads."""
    try:
        
        case_id = str(uuid.uuid4())

        result = await supabase_client.create_new_case(
            case_id=case_id,
            user_id=user_id,
            patient_name=patient_name,
            patient_age=patient_age,
            patient_gender=patient_gender,
            case_summary=case_summary,
        )
        
        # Process all files with a helper function to avoid redundancy
        async def process_files(files, category):
            processed_files = []
            for file in files or []:
                if file.filename:
                    file_id = str(uuid.uuid4())
                    file_content = await file.read()
                    file_data = {
                        "file_id": file_id,
                        "file_name": file.filename,
                        "file_type": file.content_type,
                        "file_size": len(file_content),
                        "file_url": f"{category}_files/{case_id}/{file.filename}",
                        "file_category": category,
                    }
                    
                    # Upload to storage
                    file_result = await supabase_client.upload_case_file(
                        file_id = file_id,
                        case_id=case_id,
                        file_data=file_data,
                        file_content=file_content
                    )
                    uploaded_files.append(file_result)
                    
                    # Store for background processing (with actual content)
                    processed_files.append({**file_data, "file_content": file_content})
            
            return processed_files
        
        uploaded_files = []
        lab_files_data = await process_files(lab_files, "lab")
        radiology_files_data = await process_files(radiology_files, "radiology")

        # Schedule background task after successful case creation with all parameters including file content
        background_tasks.add_task(
            agentic_process,
            case_id=case_id,
            user_id=user_id,
            patient_name=patient_name,
            patient_age=patient_age,
            patient_gender=patient_gender,
            case_summary=case_summary,
            lab_files=lab_files_data if lab_files_data else None,
            radiology_files=radiology_files_data if radiology_files_data else None,
        )
        
        return JSONResponse(
            status_code=201,
            content={
                "message": "Case created successfully", 
                "case": result,
                "uploaded_files": uploaded_files
            }
        )

    except SupabaseClientError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")



@router.get("/all_cases")
async def get_all_cases(user_id: str):
    """Get all cases for the authenticated doctor."""
    try:
        cases = await supabase_client.get_all_cases(user_id=user_id)
        return JSONResponse(
            status_code=200,
            content={"cases": cases}
        )
    except SupabaseClientError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.get("/cases/{case_id}")
async def get_case_by_id(
    case_id: str,
):
    """Get a specific case by ID."""
    try:
        case = await supabase_client.get_case_by_id(case_id=case_id)
        case_files_data = await supabase_client.get_case_files(case_id=case_id)
        ai_insights = await supabase_client.get_ai_insights_by_case_id(case_id=case_id)

        return JSONResponse(
            status_code=200,
            content={"case": case, "files": case_files_data, "ai_insights": ai_insights}
        )
    except SupabaseClientError as e:
        if "not found" in str(e).lower():
            raise HTTPException(status_code=404, detail=str(e))
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.put("/cases/{case_id}")
async def update_case(
    case_id: str,
    case_data: CaseUpdate,
):
    """Update a specific case."""
    try:
        update_data = case_data.model_dump(exclude_none=True)
        
        if not update_data:
            raise HTTPException(status_code=400, detail="No data provided for update")
        
        result = await supabase_client.update_case(
            case_id=case_id,
            update_data=update_data
        )
        return JSONResponse(
            status_code=200,
            content={"message": "Case updated successfully", "case": result}
        )
    except SupabaseClientError as e:
        if "not found" in str(e).lower():
            raise HTTPException(status_code=404, detail=str(e))
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.delete("/cases/{case_id}")
async def delete_case(case_id: str):
    """Delete a specific case and all associated data."""
    try:
        success = await supabase_client.delete_case(case_id=case_id)
        if success:
            return JSONResponse(
                status_code=200,
                content={"message": "Case deleted successfully"}
            )
        else:
            raise HTTPException(status_code=404, detail="Case not found")
    except SupabaseClientError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.post("/analyze/{case_id}")
async def analyze_case(
    case_id: str,
    background_tasks: BackgroundTasks,
    analysis_data: AnalysisRequest = None,
):
    """Re-trigger AI analysis for an existing case."""
    try:
        case = await supabase_client.get_case_by_id(case_id=case_id)

        await supabase_client.update_case_status(case_id=case_id, status="processing")

        background_tasks.add_task(
            agentic_process,
            case_id=case_id,
            user_id=case.get("doctor_id", ""),
            patient_name=case.get("patient_name", ""),
            patient_age=case.get("patient_age", 0),
            patient_gender=case.get("patient_gender", ""),
            case_summary=case.get("case_summary"),
        )

        return JSONResponse(
            status_code=200,
            content={"message": "Case analysis started successfully", "case": case}
        )
    except SupabaseClientError as e:
        if "not found" in str(e).lower():
            raise HTTPException(status_code=404, detail=str(e))
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.post("/upload")
async def upload_file(
    case_id: str = Form(...),
    category: str = Form("lab"),
    file: UploadFile = File(...),
):
    """Upload a file for an existing case."""
    try:
        await supabase_client.get_case_by_id(case_id=case_id)

        file_content = await file.read()
        file_id = str(uuid.uuid4())

        file_data = {
            "file_id": file_id,
            "file_name": file.filename,
            "file_type": file.content_type,
            "file_size": len(file_content),
            "file_url": f"{category}_files/{case_id}/{file.filename}",
            "file_category": category,
        }

        result = await supabase_client.upload_case_file(
            file_id=file_id,
            case_id=case_id,
            file_data=file_data,
            file_content=file_content,
        )
        
        return JSONResponse(
            status_code=201,
            content={"message": "File uploaded successfully", "file": result}
        )
    except SupabaseClientError as e:
        if "not found" in str(e).lower():
            raise HTTPException(status_code=404, detail=str(e))
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.get("/files/{case_id}")
async def get_case_files(case_id: str):
    """Get all files for a specific case."""
    try:
        files = await supabase_client.get_case_files(case_id=case_id)
        return JSONResponse(
            status_code=200,
            content={"files": files}
        )
    except SupabaseClientError as e:
        if "not found" in str(e).lower():
            raise HTTPException(status_code=404, detail=str(e))
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.get("/file/{file_id}")
async def get_file_by_id(file_id: str):
    """Get a specific file by ID."""
    try:
        file_data = await supabase_client.get_file_by_id(file_id=file_id)
        return JSONResponse(
            status_code=200,
            content={"file": file_data}
        )
    except SupabaseClientError as e:
        if "not found" in str(e).lower():
            raise HTTPException(status_code=404, detail=str(e))
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.delete("/file/{file_id}")
async def delete_file(file_id: str, case_id: str):
    """Delete a specific file."""
    try:
        success = await supabase_client.delete_case_file(case_id=case_id, file_id=file_id)
        if success:
            return JSONResponse(
                status_code=200,
                content={"message": "File deleted successfully"}
            )
        else:
            raise HTTPException(status_code=404, detail="File not found")
    except SupabaseClientError as e:
        if "not found" in str(e).lower():
            raise HTTPException(status_code=404, detail=str(e))
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")