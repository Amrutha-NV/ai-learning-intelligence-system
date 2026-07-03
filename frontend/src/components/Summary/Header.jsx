import { Calendar, Clock, Tag, BookOpen } from "lucide-react";

export default function Header({ topicName }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-10 mb-6 shadow-sm">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center">
          <BookOpen size={20} className="text-red-600" />
        </div>

        <div>
          <h1 className="text-[26px] font-bold text-gray-900">
            {topicName} Fundamentals
          </h1>

          <p className="text-sm text-gray-500">
            AI Generated Summary
          </p>
        </div>
      </div>

      <div className="flex gap-6 flex-wrap">
        <div className="flex items-center gap-2">
          <Calendar size={13} className="text-gray-400" />
          <span className="text-sm text-gray-500">
            June 15, 2026
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Clock size={13} className="text-gray-400" />
          <span className="text-sm text-gray-500">
            8 min read
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Tag size={13} className="text-gray-400" />
          <span className="text-sm text-gray-500">
            {topicName}
          </span>
        </div>
      </div>
    </div>
  );
}