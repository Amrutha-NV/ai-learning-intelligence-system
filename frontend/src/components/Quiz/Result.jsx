import { Trophy, RotateCcw, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

export default function Result({
  score,
  totalQuestions,
  topic,
  subtopic,
  onReset,
}) {
  const percentage = Math.round((score / totalQuestions) * 100);

  const circumference = 2 * Math.PI * 54;
  const offset =
    circumference - (percentage / 100) * circumference;

  let message = "Keep Practicing!";
  let color = "text-gray-600";

  if (percentage >= 90) {
    message = "Excellent Work! 🎉";
    color = "text-green-600";
  } else if (percentage >= 70) {
    message = "Great Job! 🚀";
    color = "text-cyan-600";
  } else if (percentage >= 50) {
    message = "Nice Effort 👍";
    color = "text-red-600";
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center px-6 py-12">

      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl border border-gray-200 p-10">

        {/* Trophy */}

        <div className="flex justify-center mb-6">

          <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center">

            <Trophy
              size={36}
              className="text-red-600"
            />

          </div>

        </div>

        {/* Heading */}

        <h1
          className={`text-3xl font-bold text-center ${color}`}
        >
          {message}
        </h1>

        <p className="text-center text-gray-500 mt-3 mb-10">
          You've completed the quiz successfully.
        </p>

        {/* Circular Score */}

        <div className="flex justify-center mb-10">

          <div className="relative">

            <svg
              width="140"
              height="140"
              className="-rotate-90"
            >
              <circle
                cx="70"
                cy="70"
                r="54"
                stroke="#E5E7EB"
                strokeWidth="10"
                fill="none"
              />

              <circle
                cx="70"
                cy="70"
                r="54"
                stroke="#DC2626"
                strokeWidth="10"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
              />
            </svg>

            <div className="absolute inset-0 flex flex-col justify-center items-center">

              <h2 className="text-3xl font-bold">
                {score}/{totalQuestions}
              </h2>

              <p className="text-gray-500">
                {percentage}%
              </p>

            </div>

          </div>

        </div>

        {/* Stats */}

        <div className="grid grid-cols-3 gap-4 mb-10">

          <div className="rounded-2xl bg-green-50 p-5 text-center">

            <p className="text-sm text-gray-500">
              Correct
            </p>

            <h3 className="text-2xl font-bold text-green-600">
              {score}
            </h3>

          </div>

          <div className="rounded-2xl bg-red-50 p-5 text-center">

            <p className="text-sm text-gray-500">
              Wrong
            </p>

            <h3 className="text-2xl font-bold text-red-600">
              {totalQuestions - score}
            </h3>

          </div>

          <div className="rounded-2xl bg-cyan-50 p-5 text-center">

            <p className="text-sm text-gray-500">
              Accuracy
            </p>

            <h3 className="text-2xl font-bold text-cyan-600">
              {percentage}%
            </h3>

          </div>

        </div>

        {/* Message */}

        <div className="bg-gray-50 rounded-2xl p-5 text-center mb-8">

          <p className="text-gray-600">
            Keep practicing consistently.
            Every quiz brings you one step closer to mastering the topic.
          </p>

        </div>

        {/* Buttons */}

        <div className="space-y-3">

          <button
            onClick={onReset}
            className="w-full flex justify-center items-center gap-3 bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl font-semibold shadow-lg transition-all hover:scale-[1.02] active:scale-95"
          >

            <RotateCcw size={18} />

            Retake Quiz

          </button>

          <Link
            to={`/${topic}/${subtopic}/summary`}
            className="w-full flex justify-center items-center gap-3 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 py-4 rounded-xl font-semibold transition"
          >

            <BookOpen size={18} />

            Back To Summary

          </Link>

        </div>

      </div>

    </div>
  );
}