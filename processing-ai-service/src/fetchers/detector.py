from urllib.parse import urlparse


class PlatformDetector:
    """
    Detects which platform a learning URL belongs to.
    """

    def detect(self, url: str) -> str:

        domain = urlparse(url).netloc.lower()

        if "youtube" in domain or "youtu.be" in domain:
            return "youtube"

        if "geeksforgeeks" in domain:
            return "geeksforgeeks"

        if "leetcode" in domain:
            return "leetcode"

        if "mozilla.org" in domain:
            return "mdn"

        if "chatgpt.com" in domain:
            return "chatgpt"

        return "generic"