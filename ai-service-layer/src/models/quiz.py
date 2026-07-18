from typing import List, Tuple
from pydantic import BaseModel


class QuizOutput(BaseModel):
    question_rows: List[Tuple[str, List[str], int]]


class Quiz(BaseModel):
    sessionId: str
    url: str
    summary: List[str]
    question_rows: List[Tuple[str, List[str], int]] | None = None
