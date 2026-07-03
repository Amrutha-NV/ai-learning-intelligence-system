import { useState } from "react";
import { Check, X } from "lucide-react";

export default function Section({
  question,
  options,
  correct,
  onCorrectAnswer,
}) {
  const [selectedIdx, setSelectedIdx] = useState(-1);

  const handleOnClick = (clickedIdx) => {
    if (selectedIdx !== -1) return;

    setSelectedIdx(clickedIdx);

    if (clickedIdx === correct) {
      onCorrectAnswer();
    }
  };

  const optionLabels = ["A", "B", "C", "D"];

  return (
    <div className="bg-white border border-gray-200 rounded-3xl shadow-xl p-10 transition-all duration-300">

      {/* Question */}

      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-relaxed mb-10">
        {question}
      </h2>

      {/* Options */}

      <div className="space-y-4">
        {options.map((option, index) => {
          let buttonClass =
            "w-full flex items-center justify-between rounded-2xl border-2 px-6 py-5 transition-all duration-200";

          let badgeClass =
            "w-10 h-10 rounded-full flex items-center justify-center font-semibold";

          let textClass = "text-gray-800";

          if (selectedIdx === -1) {
            buttonClass +=
              " border-gray-200 bg-white hover:border-red-500 hover:shadow-lg hover:-translate-y-1 cursor-pointer";

            badgeClass += " bg-gray-100 text-gray-600";
          } else {
            if (index === correct) {
              buttonClass +=
                " border-green-500 bg-green-50";

              badgeClass +=
                " bg-green-500 text-white";

              textClass = "text-green-700";
            } else if (index === selectedIdx) {
              buttonClass +=
                " border-red-500 bg-red-50";

              badgeClass +=
                " bg-red-500 text-white";

              textClass = "text-red-700";
            } else {
              buttonClass +=
                " border-gray-200 bg-white opacity-50";

              badgeClass +=
                " bg-gray-100 text-gray-500";

              textClass = "text-gray-500";
            }
          }

          return (
            <button
              key={index}
              onClick={() => handleOnClick(index)}
              disabled={selectedIdx !== -1}
              className={buttonClass}
            >
              <div className="flex items-center gap-5">

                <div className={badgeClass}>
                  {optionLabels[index]}
                </div>

                <p className={`text-lg font-medium ${textClass}`}>
                  {option}
                </p>

              </div>

              {selectedIdx !== -1 && index === correct && (
                <Check
                  size={22}
                  className="text-green-600"
                />
              )}

              {selectedIdx !== -1 &&
                index === selectedIdx &&
                index !== correct && (
                  <X
                    size={22}
                    className="text-red-600"
                  />
                )}
            </button>
          );
        })}
      </div>
    </div>
  );
}