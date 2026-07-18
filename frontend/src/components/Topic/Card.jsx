import { useNavigate ,Link} from "react-router-dom";
import { FileText, Clock, ChevronRight } from "lucide-react";

export default function Card({
  id,
  topic,
  name,
  activities,
  lastActive,
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-lg hover:-translate-y-[1px] transition-all duration-200">

      {/* Icon */}
      <div className="w-9 h-9 rounded-lg bg-cyan-50 flex items-center justify-center mb-3">
        <FileText size={16} className="text-cyan-500" />
      </div>

      {/* Title */}
      <h3 className="text-[15px] font-semibold text-gray-900 mb-2">
        {name}
      </h3>

      {/* Activities */}
      <div className="flex items-center gap-2 mb-1">
        <FileText size={12} className="text-gray-400" />
        <span className="text-[13px] text-gray-500">
          {activities} activities
        </span>
      </div>

      {/* Last Active */}
      <div className="flex items-center gap-2 mb-4">
        <Clock size={12} className="text-gray-400" />
        <span className="text-[13px] text-gray-500">
          Last active {lastActive}
        </span>
      </div>

      {/* Button */}
      <Link to={`/${topic}/subtopic/${id}`}>
       <button
        className="w-full flex items-center justify-center gap-2 border border-gray-200 rounded-lg py-2 text-[13px] font-medium text-gray-900 hover:bg-gray-50 transition-colors duration-200"
      >
        Open Topic
        <ChevronRight size={14} />
      </button>
      </Link>
     

    </div>
  );
}