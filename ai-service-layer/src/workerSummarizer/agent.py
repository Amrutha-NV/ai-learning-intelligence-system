import json

from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate

from src.config import get_settings
from ..models import WebContentSummary
from .helper import fetch_url_content


def _build_model() -> ChatGroq:
    settings = get_settings()

    return ChatGroq(
        groq_api_key=settings.GROK_API_KEY,
        model="llama-3.3-70b-versatile",
        temperature=0,
    )


_PROMPT = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            """You are an expert summarizer.

Summarize the supplied learning material into exactly ten concise key points and one subtopic.
The URL content is the primary source. Supplemental session content may add extra context or details.
Return structured output only.""",
        ),
        (
            "human",
            """URL: {url}
Title: {title}

Primary webpage content:
{content}

Supplemental session content:
{supplemental_content}""",
        ),
    ]
)


_REDUCE_PROMPT = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            """You are an expert summarizer.

Combine the supplied partial summaries into exactly ten concise key points and one subtopic.
Preserve the most important ideas and remove duplication.
Return structured output only.""",
        ),
        (
            "human",
            """URL: {url}
Title: {title}

Partial summaries:
{content}""",
        ),
    ]
)


def _clean_text(content: str | None) -> str:
    return (content or "").strip()


def _chunk_text(content: str, chunk_size: int = 12000, overlap: int = 500) -> list[str]:
    normalized_content = _clean_text(content)
    if not normalized_content:
        return []

    chunks: list[str] = []
    start = 0
    content_length = len(normalized_content)

    while start < content_length:
        end = min(start + chunk_size, content_length)
        chunks.append(normalized_content[start:end])
        if end >= content_length:
            break
        start = max(end - overlap, start + 1)

    return chunks


def summarize_web_content(url: str, supplemental_content: str = "") -> WebContentSummary:
    raw_content = fetch_url_content(url)
    page_data = json.loads(raw_content)
    webpage_content = _clean_text(page_data.get("content", ""))
    enriched_content = _clean_text(supplemental_content)

    llm = _build_model().with_structured_output(WebContentSummary)
    chain = _PROMPT | llm
    reduce_chain = _REDUCE_PROMPT | llm

    combined_content = webpage_content
    if enriched_content:
        combined_content = (
            f"{webpage_content}\n\nAdditional session context:\n{enriched_content}"
            if webpage_content
            else enriched_content
        )

    content_chunks = _chunk_text(combined_content)

    if len(content_chunks) <= 1:
        return chain.invoke(
            {
                "url": page_data.get("url", url),
                "title": page_data.get("title", ""),
                "content": webpage_content,
                "supplemental_content": enriched_content,
            }
        )

    partial_summaries: list[str] = []
    for index, chunk in enumerate(content_chunks, start=1):
        chunk_summary = chain.invoke(
            {
                "url": page_data.get("url", url),
                "title": page_data.get("title", ""),
                "content": chunk,
                "supplemental_content": (
                    f"Chunk {index} of {len(content_chunks)} from combined webpage and session context."
                ),
            }
        )
        partial_summaries.append(
            "\n".join(
                [
                    f"Chunk {index} subtopic: {chunk_summary.subtopic}",
                    *[f"- {point}" for point in chunk_summary.key_points],
                ]
            )
        )

    return reduce_chain.invoke(
        {
            "url": page_data.get("url", url),
            "title": page_data.get("title", ""),
            "content": "\n\n".join(partial_summaries),
        }
    )
