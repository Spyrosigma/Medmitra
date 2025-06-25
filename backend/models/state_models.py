# FILE: STATE_MODELS.PY
from typing import List, Dict, Optional, Annotated, Union
from typing_extensions import TypedDict
from models.data_models import (
    LabDoc, RadiologyImage
)


class AnalysisState(TypedDict):
    """Tracks the complete analysis pipeline state"""
    
    LabDocs: List[LabDoc]
    RadiologyImages: List[RadiologyImage]

