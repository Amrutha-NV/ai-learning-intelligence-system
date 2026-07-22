import httpx

from celery.utils.log import get_task_logger

from src.celery_app import celery_app
from src.graphs.learning_graph import learning_graph
from src.services.cache_service import CacheService


logger = get_task_logger(__name__)


def send_callback(
    callback_url: str,
    payload: dict,
) -> None:
    """
    Send the completed AI result back to the Node backend.
    """

    with httpx.Client(timeout=10.0) as client:
        response = client.post(
            callback_url,
            json=payload,
        )

        response.raise_for_status()


@celery_app.task(
    bind=True,
    autoretry_for=(
        httpx.ConnectError,
        httpx.TimeoutException,
    ),
    retry_kwargs={
        "max_retries": 3,
    },
    retry_backoff=True,
    retry_jitter=True,
)
def process_learning_task(
    self,
    state: dict,
):
    url = state["url"]

    activity_id = state.get("activity_id")
    callback_url = state.get("callback_url")

    cache_key = f"classification:{url}"

    logger.info(
        "Started processing: %s",
        url,
    )

    try:
        result = learning_graph.invoke(state)

        classification_result = result["classification"]

        if hasattr(
            classification_result,
            "model_dump",
        ):
            classification = (
                classification_result.model_dump()
            )
        else:
            classification = classification_result

        CacheService.set(
            cache_key,
            classification,
        )

        # Send result back to Node automatically
        if activity_id and callback_url:

            callback_payload = {
                "activityId": activity_id,
                "taskId": self.request.id,
                "status": "COMPLETED",
                "classification": classification,
            }

            send_callback(
                callback_url,
                callback_payload,
            )

            logger.info(
                "Callback sent for activity %s",
                activity_id,
            )

        logger.info(
            "Finished processing: %s",
            url,
        )

        return classification

    except Exception:

        logger.exception(
            "Processing failed for activity %s",
            activity_id or "unknown",
        )

        raise