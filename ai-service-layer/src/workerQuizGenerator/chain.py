from .prompt import quiz_prompt
from .model import llm
from ..models import QuizOutput

quiz_chain = (
    quiz_prompt
    | llm.with_structured_output(QuizOutput)
)
