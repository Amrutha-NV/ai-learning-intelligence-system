from langchain_groq import ChatGroq
from src.config import get_settings

llm = ChatGroq(
    api_key=get_settings().GROK_API_KEY,
    model=get_settings().MODEL_NAME,
    temperature=0.3,
)