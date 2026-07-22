import re
import html


class CleanerProcessor:

    def clean(self, text: str) -> str:

        if not text:
            return ""

        text = html.unescape(text)

        text = text.replace("\r", "")

        text = text.replace("\t", " ")

        text = re.sub(r"[ ]{2,}", " ", text)

        text = re.sub(r"\n{3,}", "\n\n", text)

        text = re.sub(r"\u200b", "", text)

        return text.strip()