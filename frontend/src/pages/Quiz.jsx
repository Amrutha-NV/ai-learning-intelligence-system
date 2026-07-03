import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ChevronRight } from "lucide-react";

import Section from "../components/Quiz/Section.jsx";
import Result from "../components/Quiz/Result.jsx";

const QUESTIONS = [
  {
    question: "Which operation allows O(1) access in arrays?",
    options: [
      "Linear search through all elements",
      "Index-based direct access",
      "Binary search on sorted array",
      "Hash-based lookup",
    ],
    correct: 1,
  },
  {
    question: "What is the time complexity of inserting an element at the beginning of an array?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
    correct: 2,
  },
  {
    question: "Which of the following is NOT an advantage of arrays?",
    options: [
      "Cache-friendly memory access",
      "O(1) random access",
      "Efficient insertion in middle",
      "Low memory overhead",
    ],
    correct: 2,
  },
  {
    question: "What is the space complexity of a 1D array with n elements?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
    correct: 2,
  },
  {
    question: "In a dynamic array, what happens when it exceeds its capacity?",
    options: [
      "The operation fails with an error",
      "A new larger array is allocated and elements are copied",
      "Elements are stored in a linked list",
      "The oldest element is removed",
    ],
    correct: 1,
  },
  {
    question: "Which traversal method uses two pointers starting from both ends?",
    options: [
      "Linear scan",
      "Sliding window",
      "Two-pointer technique",
      "Recursive traversal",
    ],
    correct: 2,
  },
  {
    question: "What is the time complexity of searching for a value in an unsorted array?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
    correct: 2,
  },
  {
    question: "Arrays store elements in what type of memory layout?",
    options: [
      "Linked nodes",
      "Contiguous memory",
      "Tree nodes",
      "Hash buckets",
    ],
    correct: 1,
  },
  {
    question: "What is the amortized time complexity of appending to a dynamic array?",
    options: ["O(n)", "O(log n)", "O(1)", "O(n²)"],
    correct: 2,
  },
  {
    question: "Which sorting algorithm works in-place on an array with O(n log n) average complexity?",
    options: [
      "Bubble sort",
      "Merge sort",
      "Quick sort",
      "Counting sort",
    ],
    correct: 2,
  },
];

export default function Quiz() {
  const { topic, subtopic } = useParams();

  const [currQuestion, setCurrQuestion] = useState(0);
  const [showScoreCard, setShowScoreCard] = useState(false);
  const [score, setScore] = useState(0);

  const handleScoreIncrease = () => {
    setScore((prev) => prev + 1);
  };

  const onClickHandler = () => {
    if (currQuestion === QUESTIONS.length - 1) {
      setShowScoreCard(true);
    } else {
      setCurrQuestion((prev) => prev + 1);
    }
  };

  const resetQuiz = () => {
    setCurrQuestion(0);
    setScore(0);
    setShowScoreCard(false);
  };

  if (showScoreCard) {
    return (
      <Result
        score={score}
        totalQuestions={QUESTIONS.length}
        topic={topic}
        subtopic={subtopic}
        onReset={resetQuiz}
      />
    );
  }

  const progress =
    ((currQuestion + 1) / QUESTIONS.length) * 100;

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center px-6 py-12">

      <div className="w-full max-w-4xl">

        {/* Header */}

        <div className="flex justify-between items-center mb-6">

          <div>
            <Link
              to={`/${topic}/${subtopic}/summary`}
              className="text-gray-500 hover:text-red-600 font-medium transition"
            >
              ← Exit Quiz
            </Link>

            <p className="mt-2 text-sm text-gray-500">
              {topic} • {subtopic}
            </p>
          </div>

          <div className="text-right">
            <h3 className="text-xl font-bold text-gray-900">
              Question {currQuestion + 1}
            </h3>

            <p className="text-gray-500">
              of {QUESTIONS.length}
            </p>
          </div>

        </div>

        {/* Progress */}

        <div className="mb-10">

          <div className="flex justify-between text-sm text-gray-500 mb-2">

            <span>Progress</span>

            <span>{Math.round(progress)}%</span>

          </div>

          <div className="h-3 rounded-full bg-gray-200 overflow-hidden">

            <div
              className="h-full bg-gradient-to-r from-red-500 to-red-700 transition-all duration-500"
              style={{
                width: `${progress}%`,
              }}
            />

          </div>

        </div>

        {/* Question */}

        <Section
          key={currQuestion}
          question={QUESTIONS[currQuestion].question}
          options={QUESTIONS[currQuestion].options}
          correct={QUESTIONS[currQuestion].correct}
          onCorrectAnswer={handleScoreIncrease}
        />

        {/* Footer */}

        <div className="flex justify-end mt-8">

          <button
            onClick={onClickHandler}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-7 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95"
          >
            {currQuestion === QUESTIONS.length - 1
              ? "Finish Quiz"
              : "Next"}

            <ChevronRight size={18} />
          </button>

        </div>

      </div>

    </div>
  );
}