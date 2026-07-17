from fastapi import APIRouter, FastAPI, status, Header
from fastapi.middleware.cors import CORSMiddleware
import logging
from typing import Optional
import uvicorn 
from src.models import Item, Quiz
from src.queueData import add, add_quiz, cache_by_url, cache_by_url_quiz

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s [%(name)s] %(message)s",
)
logger = logging.getLogger(__name__)
print("Logger name:", logger.name)
print("Logger level:", logger.level)
print("Effective level:", logger.getEffectiveLevel())
print("Logger handlers:", logger.handlers)

root = logging.getLogger()
print("Root level:", root.level)
print("Root handlers:", root.handlers)
app = FastAPI()

# FIXED: Leave prefix only here, remove it from include_router below
router = APIRouter(prefix="/api")

# FIXED: Removed trailing whitespace and empty lines between decorators
@router.post("/learning-session", status_code=status.HTTP_200_OK)
@cache_by_url()
async def create_item(item: Item, authorization: Optional[str] = Header(None)):
    print("ENDPOINT ENTERED", flush=True)
    print("Received /learning-session request for sessionId=%s", item.sessionId)
    print("Queueing summary task for sessionId=%s", item.sessionId)
    task = add.delay(item.model_dump())

    return {
        "success": True,
        "message": "Request queued successfully",
        "task_id": task.id,
        "sessionId": item.sessionId
    }

@router.post("/quiz-generate", status_code=status.HTTP_200_OK)
@cache_by_url_quiz()
async def create_quiz(item: Quiz, authorization: Optional[str] = Header(None)):
    logger.info("Received /quiz-generate request for sessionId=%s", item.sessionId)
    logger.info("Queueing quiz task for sessionId=%s", item.sessionId)
    task = add_quiz.delay(item.model_dump())
    return {
        "success": True,
        "message": "Request queued successfully",
        "task_id": task.id,
        "sessionId": item.sessionId
    }

# FIXED: Removed duplicate prefix='/api' here
app.include_router(router)

@app.get("/")
def read_root():
    return {"message": "ai-service-layer-running"}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def main():
    # Note: If your port in the terminal log was 63536, uvicorn might be 
    # running randomly or via command line. This script forces port 5000.
    uvicorn.run("main:app", host="127.0.0.1", port=5000, reload=True)

if __name__ == "__main__":
   uvicorn.run("main:app", port=5000) 
