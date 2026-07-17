# summarizer_helper.py

import json
import requests
from urllib.parse import urlparse
from bs4 import BeautifulSoup


def fetch_url_content(url: str) -> str:
    """Fetch webpage and return cleaned text."""

    parsed = urlparse(url)
    if not parsed.scheme:
        return json.dumps({"error": "Invalid URL"})

    response = requests.get(
        url,
        timeout=30,
        headers={
            "User-Agent": "Mozilla/5.0"
        }
    )

    response.raise_for_status()

    soup = BeautifulSoup(response.text, "html.parser")

    for tag in soup(["script", "style", "nav", "footer", "header"]):
        tag.decompose()

    title = soup.title.string if soup.title else ""

    text = soup.get_text(separator=" ", strip=True)

    return json.dumps({
        "url": url,
        "title": title,
        "content": text
    })