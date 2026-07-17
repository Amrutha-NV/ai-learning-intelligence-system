
from typing import  List

from pydantic import BaseModel
class WebContentSummary(BaseModel):
    """Structured output for web content summary"""
    key_points: List[str]
    subtopic: str
  
