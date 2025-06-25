from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any, Final

class LabDoc(BaseModel):
    labdoc_id: str
    labdoc_text: str
    labdoc_summary: str

class RadiologyImage(BaseModel):
    radiology_id: str
    radiology_summary: str