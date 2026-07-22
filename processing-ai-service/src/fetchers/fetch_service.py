from src.fetchers.detector import PlatformDetector
from src.fetchers.html_fetcher import HTMLFetcher


class FetchService:
    """
    Coordinates platform detection and
    webpage content extraction.
    """

    def __init__(self):
        self.detector = PlatformDetector()
        self.fetcher = HTMLFetcher()

    def fetch(self, url: str) -> dict:
        """
        Fetch learning content from a URL.
        """

        platform = self.detector.detect(url)

        page = self.fetcher.fetch(url)

        return {
            "platform": platform,
            "url": url,
            "title": page["title"],
            "content": page["content"],
        }