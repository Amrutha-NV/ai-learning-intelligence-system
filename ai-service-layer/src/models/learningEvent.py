from pydantic import BaseModel

# 1. Define Data Schema (Matches JS payload)
class Item(BaseModel):
    sessionId: str
    platform: str
    url: str
    title: str
    content: str 
    activeStudyTime: float
    startedAt: str
    completedAt: str
    device: str
