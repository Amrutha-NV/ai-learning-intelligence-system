from .chain import quiz_chain
from ..models import Quiz, QuizOutput


def generate_quiz(
    session_id: str,
    url: str,
    summary: list[str],
) -> Quiz:
    """
    Generate a quiz from the supplied summary.
    """

    # Invoke the LLM
    quiz_output: QuizOutput = quiz_chain.invoke(
        {
            "summary": "\n".join(summary)
        }
    )

    # Build the final response object
    quiz = Quiz(
        sessionId=session_id,
        url=url,
        summary=summary,
        question_rows=quiz_output.question_rows,
    )

    return quiz
