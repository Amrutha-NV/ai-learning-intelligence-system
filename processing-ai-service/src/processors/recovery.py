from src.prompts.processing.system_prompt import (
    PROCESSING_SYSTEM_PROMPT
)

from src.services.llm_service import LLMService


class RecoveryProcessor:
    """
    Recovers learning content when the browser
    extension could not extract useful text.
    """

    def __init__(self):
        self.llm_service = LLMService()

    def recover(self, session):
        """
        Return extracted content if it is useful.
        Otherwise recover educational content using the LLM.
        """

        if self._has_valid_content(session.content):
            return session.content

        prompt = self._build_prompt(session)

        return self.llm_service.invoke(prompt)

    def _has_valid_content(
        self,
        content: str
    ) -> bool:
        """
        Determines whether the extracted browser
        content is useful enough for downstream AI.
        """

        if not content:
            return False

        cleaned = content.strip()

        if len(cleaned) < 150:
            return False

        lower = cleaned.lower()

        invalid_phrases = [

            "subscribe",

            "like and share",

            "thanks for watching",

            "follow me",

            "comment below",

            "watch till the end",

            "see you in the next video",

            "welcome back",

            "don't forget to subscribe"

        ]

        if any(
            phrase in lower
            for phrase in invalid_phrases
        ):
            return False

        return True

    def _build_prompt(
        self,
        session
    ) -> str:

        return f"""
{PROCESSING_SYSTEM_PROMPT}

Platform:
{session.platform}

Title:
{session.title}

URL:
{session.url}

Metadata:
{session.metadata}
"""