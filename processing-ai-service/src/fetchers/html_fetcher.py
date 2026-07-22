import requests

from bs4 import BeautifulSoup

from readability import Document


class HTMLFetcher:
    """
    Downloads a webpage and extracts its main learning content.
    """

    def fetch(self, url: str) -> dict:

        response = requests.get(
            url,
            timeout=30,
            headers={
                "User-Agent": (
                    "Mozilla/5.0 "
                    "(Windows NT 10.0; Win64; x64)"
                )
            },
        )

        response.raise_for_status()

        html = response.text

        readable_html = Document(html).summary()

        soup = BeautifulSoup(
            readable_html,
            "html.parser"
        )

        for tag in soup(
            [
                "script",
                "style",
                "nav",
                "header",
                "footer",
                "aside"
            ]
        ):
            tag.decompose()

        title = (
            Document(html).title()
            or ""
        )

        content = soup.get_text(
            separator=" ",
            strip=True
        )

        return {
            "title": title,
            "content": content
        }