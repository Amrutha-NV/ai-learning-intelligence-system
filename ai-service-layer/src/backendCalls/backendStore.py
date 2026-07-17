import logging
import json
import requests

from src.config import get_settings

logger = logging.getLogger(__name__)
NODE_SERVER_URL = get_settings().NODE_SERVER_URL

def send_to_node_server(item, content: str) -> dict:
    """
    Accepts item and content, and sends the mapped JSON payload to the Node.js server.
    """
    # 1. Map properties directly into the payload structure
    payload = {
        "sessionId": item.sessionId,
        "platform": item.platform,
        "url": item.url,
        "title": item.title,
        "content": content,
        "activeStudyTime": item.activeStudyTime,
        "startedAt": str(item.startedAt),  # Converted to string for JSON serialization
        "completedAt": str(item.completedAt),
        "device": item.device
    }
    
    logger.info(
        "Sending summary payload to backend for sessionId=%s url=%s",
        item.sessionId,
        item.url,
    )
    print(json.dumps(payload, indent=2, default=str))

    try:
        response=requests.post(f"{NODE_SERVER_URL}/api/store-summary", json=payload)
        response.raise_for_status()

        logger.info(
            "Backend summary callback succeeded for sessionId=%s status_code=%s",
            item.sessionId,
            response.status_code,
        )
        return {
            "status": "success",
            "data": response.json()
        }

    except requests.exceptions.RequestException as e:
        logger.exception(
            "Backend summary callback failed for sessionId=%s url=%s",
            item.sessionId,
            item.url,
        )
        return {
            "status": "error",
            "message": f"Node server request failed: {str(e)}"
        }
    


def send_to_node_server_quiz(quiz) -> dict:
    """
    Accepts quiz and sends the mapped JSON payload to the Node.js server.
    """
    payload = {
        "sessionId": quiz.sessionId,
        "url": quiz.url,
        "questions": quiz.question_rows,
    }

    print(
        "Sending quiz payload to backend for sessionId=%s url=%s",
        quiz.sessionId,
        quiz.url,
        quiz.question_rows,
    )

    try:
        response = requests.post(f"{NODE_SERVER_URL}/api/store-quiz", json=payload)
        response.raise_for_status()

        logger.info(
            "Backend quiz callback succeeded for sessionId=%s status_code=%s",
            quiz.sessionId,
            response.status_code,
        )
        return {
            "status": "success",
            "data": response.json()
        }

    except requests.exceptions.RequestException as e:
        logger.exception(
            "Backend quiz callback failed for sessionId=%s url=%s",
            quiz.sessionId,
            quiz.url,
        )
        return {
            "status": "error",
            "message": f"Node server request failed: {str(e)}"
        }

