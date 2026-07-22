from src.celery_app import celery_app


@celery_app.task
def add_numbers(a: int, b: int):
    print(f"Adding {a} + {b}")
    return a + b