from langchain_text_splitters import RecursiveCharacterTextSplitter

from src.config.settings import settings


class ChunkProcessor:
    """
    Splits processed learning content into
    overlapping chunks for downstream AI agents.
    """

    def __init__(self):

        self.splitter = RecursiveCharacterTextSplitter(

            chunk_size=settings.chunk_size,

            chunk_overlap=settings.chunk_overlap,

            separators=[
                "\n\n",
                "\n",
                ". ",
                " ",
                ""
            ]
        )

    def chunk(
        self,
        text: str
    ):

        return self.splitter.split_text(text)