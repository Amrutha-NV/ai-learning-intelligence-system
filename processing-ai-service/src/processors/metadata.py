class MetadataProcessor:
    """
    Generates metadata from processed content.
    """

    AVERAGE_READING_SPEED = 200

    def generate(
        self,
        text: str,
        session
    ):

        words = text.split()

        word_count = len(words)

        return {

            "platform": session.platform,

            "word_count": word_count,

            "character_count": len(text),

            "estimated_reading_time": max(
                1,
                round(
                    word_count /
                    self.AVERAGE_READING_SPEED
                )
            )
        }