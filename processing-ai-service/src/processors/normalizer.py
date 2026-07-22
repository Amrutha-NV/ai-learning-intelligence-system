import re


class NormalizerProcessor:
    """
    Standardizes cleaned learning content.
    """

    def normalize(self, text: str) -> str:

        if not text:
            return ""

        text = re.sub(r"\s+([.,!?])", r"\1", text)

        text = re.sub(r"\n\s+", "\n", text)

        return text.strip()