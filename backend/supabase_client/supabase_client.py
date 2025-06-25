from typing import Optional, Dict, List, Union, Any
import os, json
import uuid
from supabase import create_client, Client
from datetime import datetime
import pytz

from core.config import SUPABASE_SERVICE_ROLE_KEY, SUPABASE_URL
import logging

# Simple logger setup
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class SupabaseClientError(Exception):
    """Base exception for SupabaseClient errors."""

    pass


class UserNotVerifiedError(SupabaseClientError):
    """Exception raised when a user's email is not verified."""

    pass

            

class SupabaseCaseClient:
    """Client for interacting with Supabase cases."""
    
    def __init__(
        self,
        url: Optional[str] = None,
        key: Optional[str] = None,
    ):
        """
        Initialize the Supabase Case Client.

        Args:
            url (Optional[str]): Supabase URL. Defaults to SUPABASE_URL environment variable.
            key (Optional[str]): Supabase service role key. Defaults to SUPABASE_SERVICE_ROLE_KEY environment variable.

        Raises:
            ValueError: If URL or key is not provided and not found in environment variables.
        """
        self.url = url or SUPABASE_URL
        self.key = key or SUPABASE_SERVICE_ROLE_KEY

        if not self.url or not self.key:
            raise ValueError(
                "Supabase URL and key must be provided either as arguments or as environment variables "
                "(SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY)"
            )

        self.supabase: Client = create_client(self.url, self.key)


    async def create_new_case(self, case_id: str, user_id: str, patient_name: str,  patient_age: int, patient_gender: str, case_summary: str = None) -> Dict[str, Any]:
        """
        Create a new case for a user.
        
        Args:
            user_id (str): The ID of the doctor creating the case.
            patient_name (str): Name of the patient.
            patient_age (int): Age of the patient.
            case_summary (str, optional): Initial case summary.

        Returns:
            Dict[str, Any]: The created case data including ID.

        Raises:
            SupabaseClientError: If there's an error creating the case.
        """
        try:
            case_data = {
                "case_id": case_id,
                "doctor_id": user_id,
                "patient_name": patient_name,
                "patient_age": patient_age,
                "patient_gender": patient_gender,
                "case_summary": case_summary,
                "status": "processing",
                "created_at": datetime.now(pytz.UTC).isoformat(),
                "updated_at": datetime.now(pytz.UTC).isoformat(),
            }

            insert_response = (
                self.supabase.table("cases").insert(case_data).execute()
            )

            response_data = insert_response.model_dump().get("data", [])
            if response_data:
                return response_data[0]
            else:
                raise SupabaseClientError("Failed to insert case")

        except Exception as e:
            raise SupabaseClientError(f"Error creating case: {str(e)}")

    async def get_all_cases(self, user_id: str) -> List[Dict[str, Any]]:
        """
        Get all cases for a doctor.

        Args:
            user_id (str): The ID of the doctor.

        Returns:
            List[Dict[str, Any]]: List of cases belonging to the doctor.

        Raises:
            SupabaseClientError: If there's an error retrieving cases.
        """
        try:
            result = (
                self.supabase.table("cases")
                .select("*")
                .eq("doctor_id", user_id)
                .order("created_at", desc=True)
                .execute()
            )

            data = result.model_dump().get("data", [])
            return data

        except Exception as e:
            raise SupabaseClientError(f"Error retrieving cases: {str(e)}")

    async def get_case_by_id(self, case_id: str) -> Dict[str, Any]:
        """
        Get a specific case by ID.

        Args:
            user_id (str): The ID of the doctor who owns the case.
            case_id (str): The ID of the case to retrieve.

        Returns:
            Dict[str, Any]: The case data.

        Raises:
            SupabaseClientError: If there's an error retrieving the case or case not found.
        """
        try:
            result = (
                self.supabase.table("cases")
                .select("*")
                .eq("case_id", case_id)
                .execute()
            )

            data = result.model_dump().get("data", [])
            if not data:
                raise SupabaseClientError(f"Case with ID {case_id} not found")

            return data[0]

        except Exception as e:
            raise SupabaseClientError(f"Error retrieving case: {str(e)}")

    async def update_case_status(self, case_id: str, status: str) -> Dict[str, Any]:
        """
        Update the status of a case.

        Args:
            case_id (str): The ID of the case to update.
            status (str): The new status to set for the case.

        Returns:
            Dict[str, Any]: The updated case data.
        """
        try:
            update_response = (
                self.supabase.table("cases").update({"status": status}).eq("case_id", case_id).execute()
            )
            response_data = update_response.model_dump().get("data", [])
            
            if response_data:
                return response_data[0]
            else:
                raise SupabaseClientError("Failed to update case status")
        except Exception as e:
            raise SupabaseClientError(f"Error updating case status: {str(e)}")



    async def upload_case_file(self, file_id: str, case_id: int, file_data: Dict[str, Any], file_content) -> Dict[str, Any]:
        """
        Upload a file for a case.

        Args:
            case_id (int): The ID of the case to upload file for.
            file_data (Dict[str, Any]): File data including name, type, size, url, etc.

        Returns:
            Dict[str, Any]: The uploaded file record.

        Raises:
            SupabaseClientError: If there's an error uploading the file.
        """
        try:
            logger.info(f"Uploading file: {file_data.get('file_url')}")
            results = self.supabase.storage.from_('labdocs').upload(file_data.get('file_url'), file=file_content)
            
            public_url = self.supabase.storage.from_('labdocs').get_public_url(file_data.get('file_url'))
            file_record = {
                "file_id": file_id,
                "case_id": case_id,
                "file_name": file_data.get("file_name"),
                "file_type": file_data.get("file_type"),
                "file_size": file_data.get("file_size"),
                "file_url": public_url,
                "file_category": file_data.get("file_category"),
                "upload_date": datetime.now(pytz.UTC).isoformat(),
            }
            
            insert_response = (
                self.supabase.table("case_files").insert(file_record).execute()
            )

            response_data = insert_response.model_dump().get("data", [])
            if response_data:
                return response_data[0]
            else:
                raise SupabaseClientError("Failed to upload file")

        except Exception as e:
            raise SupabaseClientError(f"Error uploading file: {str(e)}")

    async def get_case_files(self, case_id: int) -> List[Dict[str, Any]]:
        """
        Get all files for a case.

        Args:
            case_id (int): The ID of the case to get files for.

        Returns:
            List[Dict[str, Any]]: List of files associated with the case.

        Raises:
            SupabaseClientError: If there's an error retrieving files.
        """
        try:
            result = (
                self.supabase.table("case_files")
                .select("*")
                .eq("case_id", case_id)
                .execute()
            )

            data = result.model_dump().get("data", [])
            return data

        except Exception as e:
            raise SupabaseClientError(f"Error retrieving case files: {str(e)}")

    async def update_case_file_metadata(self, file_id: int, metadata: Dict[str, Any]) -> Dict[str, Any]:
        """
        Update metadata for a specific case file.

        Args:
            file_id (int): The ID of the file to update (primary key).
            metadata (Dict[str, Any]): Metadata to update.

        Returns:
            Dict[str, Any]: The updated file record.

        Raises:
            SupabaseClientError: If there's an error updating the file metadata.
        """
        try:
            update_response = (
                self.supabase.table("case_files")
                .update(metadata)
                .eq("file_id", file_id)
                .execute()
            )
            response_data = update_response.model_dump().get("data", [])
            if response_data:
                return response_data[0]
            else:
                raise SupabaseClientError("Failed to update file metadata")

        except Exception as e:
            raise SupabaseClientError(f"Error updating file metadata: {str(e)}")

    

    async def get_file_by_id(self, file_id: int) -> Dict[str, Any]:
        """
        Get a specific file by ID.

        Args:
            file_id (int): The ID of the file to retrieve.

        Returns:
            Dict[str, Any]: The file data.

        Raises:
            SupabaseClientError: If there's an error retrieving the file or file not found.
        """
        try:
            result = (
                self.supabase.table("case_files")
                .select("*")
                .eq("id", file_id)
                .execute()
            )

            data = result.model_dump().get("data", [])
            if not data:
                raise SupabaseClientError(f"File with ID {file_id} not found")

            return data[0]

        except Exception as e:
            raise SupabaseClientError(f"Error retrieving file: {str(e)}")

    async def delete_case_file(self, case_id: int, file_id: int) -> bool:
        """
        Delete a file from a case.

        Args:
            case_id (int): The ID of the case.
            file_id (int): The ID of the file to delete.

        Returns:
            bool: True if the file was successfully deleted.

        Raises:
            SupabaseClientError: If there's an error deleting the file.
        """
        try:
            delete_response = (
                self.supabase.table("case_files")
                .delete()
                .eq("case_id", case_id)
                .eq("id", file_id)
                .execute()
            )

            if delete_response.model_dump().get("data", []):
                return True
            else:
                return False

        except Exception as e:
            raise SupabaseClientError(f"Error deleting file: {str(e)}")

   