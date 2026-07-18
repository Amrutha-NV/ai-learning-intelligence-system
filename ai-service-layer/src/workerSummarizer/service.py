from .agent import summarize_web_content
from ..models import WebContentSummary


def summarize_url(url: str, content: str = "") -> WebContentSummary:
    print(f"received the url {url}")
    return summarize_web_content(url, content)
