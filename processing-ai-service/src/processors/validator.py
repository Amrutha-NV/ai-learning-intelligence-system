class ValidationProcessor:
    """
    Validates processed learning content.
    """

    MIN_CONTENT_LENGTH = 150

    def validate(self, text: str) -> str:

        if not text:
            raise ValueError(
                "Learning content is empty."
            )

        if len(text) < self.MIN_CONTENT_LENGTH:
            raise ValueError(
                "Learning content is too short."
            )

        return text