import json


class JsonParser:
    """
    Parses JSON returned by an LLM.
    """

    @staticmethod
    def parse(content: str) -> dict:

        cleaned = (
            content
            .replace("```json", "")
            .replace("```", "")
            .strip()
        )

        return json.loads(cleaned)