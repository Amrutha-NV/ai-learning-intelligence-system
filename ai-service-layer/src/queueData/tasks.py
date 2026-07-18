import asyncio
import hashlib
import json
import logging

from aiocache import Cache
from celery import Celery

from ..backendCalls import send_to_node_server, send_to_node_server_quiz
from ..models import Item, Quiz
from ..workerQuizGenerator import generate_quiz
from ..workerSummarizer.service import summarize_url

logger = logging.getLogger(__name__)
app = Celery("tasks", broker="redis://localhost")


def _build_cache(namespace: str) -> Cache:
    return Cache(
        Cache.REDIS,
        endpoint="localhost",
        port=6379,
        namespace=namespace,
    )


@app.task(name="queueData.add")
def add(item_dict):
    print("Summary task started for sessionId=%s", item_dict.get("sessionId"))
    item = Item(**item_dict)
    print("Invoking summarizer for sessionId=%s url=%s", item.sessionId, item.url)
    summary = summarize_url(item.url, item.content)
    print(
        "Summarizer completed for sessionId=%s with %s key points",
        item.sessionId,
        len(summary.key_points),
        summary
    )

    url_hash = hashlib.sha256(item.url.encode()).hexdigest()
    cache_key = f"study:{url_hash}"
    cache = _build_cache("study")
    summary_payload = {
        "url": item.url,
        "content": summary.key_points,
        "subtopic": summary.subtopic,
    }

    print("Caching summary for sessionId=%s cache_key=%s", item.sessionId, cache_key)
    asyncio.run(cache.set(cache_key, json.dumps(summary_payload), ttl=3600))

    print("Sending summary result to backend for sessionId=%s", item.sessionId)
    send_to_node_server(item, summary.key_points)
    print("Summary task completed for sessionId=%s", item.sessionId)

    return {"success": True, "message": "api call success summary stored"}


@app.task(name="queueData.add_quiz")
def add_quiz(quiz_dict):
    logger.info("Quiz task started for sessionId=%s", quiz_dict.get("sessionId"))
    quiz_request = Quiz(**quiz_dict)
    logger.info(
        "Invoking quiz generator for sessionId=%s url=%s",
        quiz_request.sessionId,
        quiz_request.url,
    )
    generated_quiz = generate_quiz(
        quiz_request.sessionId,
        quiz_request.url,
        quiz_request.summary,
    )
    logger.info(
        "Quiz generation completed for sessionId=%s with %s questions",
        generated_quiz.sessionId,
        len(generated_quiz.question_rows or []),
    )

    url_hash = hashlib.sha256(generated_quiz.url.encode()).hexdigest()
    cache_key = f"quiz:{url_hash}"
    cache = _build_cache("quiz")
    quiz_payload = {
        "url": generated_quiz.url,
        "questions": generated_quiz.question_rows,
    }

    logger.info(
        "Caching quiz for sessionId=%s cache_key=%s",
        generated_quiz.sessionId,
        cache_key,
    )
    asyncio.run(cache.set(cache_key, json.dumps(quiz_payload), ttl=3600))

    logger.info("Sending quiz result to backend for sessionId=%s", generated_quiz.sessionId)
    send_to_node_server_quiz(generated_quiz)
    logger.info("Quiz task completed for sessionId=%s", generated_quiz.sessionId)

    return {"success": True, "message": "api call success quiz stored"}
