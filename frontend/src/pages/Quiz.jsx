import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ChevronRight, RefreshCw, Sparkles } from "lucide-react";
import Section from "../components/Quiz/Section.jsx";
import Result from "../components/Quiz/Result.jsx";
import { useDashboard } from "../context/DashboardContext.jsx";

export default function Quiz() {
  const { activityId } = useParams();
  const { quiz, quizLoading, quizError, fetchQuiz, submitQuizAttempt, clearQuizPoll } = useDashboard();

  const [currQuestion, setCurrQuestion] = useState(0);
  const [showScoreCard, setShowScoreCard] = useState(false);
  const [score, setScore] = useState(0);
  const [answersList, setAnswersList] = useState([]);

  useEffect(() => {
    if (activityId) {
      fetchQuiz(activityId);
    }
    return () => {
      clearQuizPoll();
    };
  }, [activityId, fetchQuiz, clearQuizPoll]);

  const questions = quiz?.questions || [];
  const status = quiz?.status || (quizLoading ? "PROCESSING" : "IDLE");

  const handleScoreIncrease = () => {
    setScore((prev) => prev + 1);
  };

  const handleFinish = async (finalScore) => {
    setShowScoreCard(true);
    try {
      await submitQuizAttempt(activityId, {
        score: finalScore,
        totalQuestions: questions.length,
        answers: answersList,
      });
    } catch (err) {
      console.warn("Quiz submission error:", err);
    }
  };

  const onClickHandler = () => {
    if (currQuestion === questions.length - 1) {
      handleFinish(score);
    } else {
      setCurrQuestion((prev) => prev + 1);
    }
  };

  const resetQuiz = () => {
    setCurrQuestion(0);
    setScore(0);
    setAnswersList([]);
    setShowScoreCard(false);
  };

  const handleRetry = () => {
    fetchQuiz(activityId, true);
  };

  if (showScoreCard) {
    return (
      <Result
        score={score}
        totalQuestions={questions.length}
        activityId={activityId}
        onReset={resetQuiz}
      />
    );
  }

  const currentQ = questions[currQuestion];
  const progress = questions.length > 0 ? ((currQuestion + 1) / questions.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center px-6 py-12">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <Link
              to={`/activity/${activityId}/summary`}
              className="text-gray-500 hover:text-red-600 font-medium transition"
            >
              ← Exit Quiz
            </Link>
          </div>

          {status === "COMPLETED" && questions.length > 0 && (
            <div className="text-right">
              <h3 className="text-xl font-bold text-gray-900">
                Question {currQuestion + 1}
              </h3>
              <p className="text-gray-500">of {questions.length}</p>
            </div>
          )}
        </div>

        {/* Status: PROCESSING / LOADING */}
        {(status === "PROCESSING" || (quizLoading && status !== "COMPLETED")) && (
          <div className="my-10 p-10 text-center bg-white border border-gray-200 rounded-3xl shadow-xl">
            <div className="flex justify-center mb-4 text-red-500">
              <Sparkles className="animate-pulse h-10 w-10" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Generating Quiz...</h3>
            <p className="text-gray-500 mb-6">
              Our AI service is creating quiz questions from your activity summary.
            </p>
            <div className="flex items-center justify-center gap-3">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
              <span className="text-sm font-medium text-red-600">Processing quiz data...</span>
            </div>
          </div>
        )}

        {/* Status: FAILED */}
        {(status === "FAILED" || (quizError && status !== "PROCESSING")) && (
          <div className="my-10 p-8 text-center bg-red-50 border border-red-200 rounded-3xl">
            <h3 className="text-lg font-bold text-red-800 mb-2">Quiz Generation Failed</h3>
            <p className="text-sm text-red-600 mb-6">{quizError || quiz?.error || "An error occurred while generating quiz."}</p>
            <button
              onClick={handleRetry}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition"
            >
              <RefreshCw size={16} />
              Retry Quiz Generation
            </button>
          </div>
        )}

        {/* Status: COMPLETED */}
        {status === "COMPLETED" && currentQ && (
          <>
            {/* Progress */}
            <div className="mb-10">
              <div className="flex justify-between text-sm text-gray-500 mb-2">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>

              <div className="h-3 rounded-full bg-gray-200 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-red-500 to-red-700 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Question */}
            <Section
              key={currQuestion}
              question={currentQ.question || currentQ.text}
              options={currentQ.options || []}
              correct={typeof currentQ.correctAnswer === "number" ? currentQ.correctAnswer : currentQ.correct}
              onCorrectAnswer={handleScoreIncrease}
            />

            {/* Footer */}
            <div className="flex justify-end mt-8">
              <button
                onClick={onClickHandler}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-7 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95"
              >
                {currQuestion === questions.length - 1 ? "Finish Quiz" : "Next"}
                <ChevronRight size={18} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}