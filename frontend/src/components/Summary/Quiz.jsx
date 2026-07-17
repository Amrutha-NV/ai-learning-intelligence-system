import {Link}from'react-router-dom';
export default function Quiz({topic,subtopic}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm flex justify-between items-center mt-8">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          Test your knowledge
        </h3>

        <p className="text-sm text-gray-500">
          Take a 10-question quiz based on this summary.
        </p>
      </div>
      <Link to={`/${topic}/${subtopic}/quiz`}>
      <button className="px-7 py-3 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition">
        Start Quiz
      </button>
      
      </Link>

      
    </div>
  );
}