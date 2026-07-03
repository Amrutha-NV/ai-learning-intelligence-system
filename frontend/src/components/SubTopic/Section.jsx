import { Clock, ExternalLink } from "lucide-react";
import {Link} from 'react-router-dom';

export default function Section({
 topic,
  subtopic,
  title,
  timestamp,
  description,
  isLast = false,
}) {
  return (
    <div className="relative flex gap-6">
      {/* Timeline */}
      <div className="relative flex flex-col items-center">
        {/* Timeline Dot */}
        <div className="w-4 h-4 rounded-full bg-cyan-500 border-4 border-cyan-100 z-10"></div>

        {/* Vertical Line */}
        {!isLast && (
          <div className="w-0.5 flex-1 bg-gray-200 mt-1"></div>
        )}
      </div>

      {/* Card */}
      <div className="flex-1 bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          {title}
        </h3>

        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <Clock size={14} />
          <span>{timestamp}</span>
        </div>

        <p className="text-gray-600 leading-7 mb-6">
          {description}
        </p>
        <Link to={`/${topic}/${subtopic}/summary`}>
         <button className="inline-flex items-center gap-2 border border-gray-200 rounded-lg px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors duration-200">
          Summary
          <ExternalLink size={15} />
        </button>
        </Link>

       
      </div>
    </div>
  );
}