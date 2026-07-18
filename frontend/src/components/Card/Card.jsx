import { useNavigate,Link } from "react-router-dom";
export default function Card({
  id,
  name,
  icon: Icon,
  topics,
  lastActive,
  progress,
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
      {/* Icon */}
      <div className="flex justify-between items-start mb-4">
        <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
          <Icon size={20} className="text-red-600" />
        </div>
      </div>

      {/* Title */}
      <h3 className="text-base font-semibold text-gray-900 mb-2">
        {name}
      </h3>

      {/* Track Info */}
      <div className="flex gap-4 text-sm text-gray-500 mb-4">
        <span>{topics} topics</span>
        <span>Active {lastActive}</span>
      </div>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex justify-between text-xs mb-2">
          <span className="text-gray-500">Progress</span>
          <span className="font-medium text-gray-900">
            {progress}%
          </span>
        </div>

        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-red-600 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
      <Link to={`/topic/${id}`}>
      {/* Button */}
      <button className="w-full flex items-center justify-center gap-2 border border-gray-200 rounded-lg py-2 text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors duration-200">
        Open Track
      </button>

      </Link>

      
    </div>
  );
}